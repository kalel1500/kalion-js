import { existsSync } from 'fs';
import { resolve } from 'path';
import { loadEnv, Plugin, UserConfig } from 'vite';

type EnvVariables = {
    VITE_APP_ENV?: string;
    VITE_APP_NAME?: string;
    VITE_APP_CODE?: string;
    VITE_CONF_MINIFY?: string;
    VITE_CONF_SOURCEMAP?: string;
    VITE_CONF_USE_APPCODE_IN_SOURCE_PATH?: string;
};
type OpString = string | undefined;

const optionalDependencies = [
    'bootstrap',
];

const isDependencyInstalled = (dep: string) => {
    try {
        const resolvedPath = resolve(`node_modules/${dep}`); // require.resolve(dep, { paths: [process.cwd()] });
        return existsSync(resolvedPath);
    } catch (e) {
        return false;
    }
};

const getAppCode = (confAppCode: OpString, confAppName: OpString) => {
    return confAppCode?.toLocaleLowerCase()
        ?? confAppName
            ?.toLowerCase()
            .replace(/(?:^\w|[A-Z]|\b\w|\s+|[_-])/g, (match, index) => index === 0 ? match.toLowerCase() : match.toUpperCase())
            .replace(/\s+|[_-]/g, '');
};

export function laravelTsUtilsPlugin(): Plugin {
    const externalDependencies = optionalDependencies.filter(dep => !isDependencyInstalled(dep));

    return {
        name: 'vite-plugin-laravel-ts-utils',
        config(config, { mode }): UserConfig {
            const env                       = loadEnv(mode, process.cwd()) as EnvVariables;
            const confAppName           = env.VITE_APP_NAME;
            const confAppCode           = env.VITE_APP_CODE;
            const confAppMinify                 = env.VITE_CONF_MINIFY === 'true';
            const confAppSourcemap              = env.VITE_CONF_SOURCEMAP === 'true';
            const confUseAppCodeInSourcePath    = env.VITE_CONF_USE_APPCODE_IN_SOURCE_PATH === 'true'
            const modeIsProd                    = mode === 'production';

            const appCode = getAppCode(confAppCode, confAppName);
            const basePublicPath = (confUseAppCodeInSourcePath && modeIsProd) ? `/${appCode}/build` : undefined;

            return {
                base: basePublicPath,
                build: {
                    minify: confAppMinify,
                    sourcemap: confAppSourcemap,
                    target: "es2022",
                    rollupOptions: {
                        output: {
                            manualChunks: id => {
                                if (id.includes('node_modules')) {
                                    return 'vendor';
                                }
                            }
                        },
                        external: externalDependencies
                    }
                },
                css: {
                    devSourcemap: true
                },
            };
        }
    };
}