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
    let code = confAppCode ?? confAppName;
    return code
        ?.toLowerCase() // Convierte a minúsculas
        .normalize('NFD') // Normaliza la cadena para separar caracteres y tildes
        .replace(/[\u0300-\u036f]/g, '') // Elimina los caracteres de acento
        .replace(/[^\w\s-_]/g, '') // Elimina caracteres especiales, manteniendo letras, números, espacios, guiones y guiones bajos
        .replace(/_/g, '-') // Reemplaza guiones bajos por guiones
        .trim() // Elimina espacios al inicio y al final
        .replace(/^\-+|\-+$/g, '') // Elimina guiones al principio y al final
        .replace(/\s+/g, '-') // Reemplaza uno o más espacios por un guion
        .replace(/--+/g, '-') // Elimina guiones duplicados
        .replace(/^-+|-+$/g, ''); // Elimina guiones al principio y al final nuevamente si es necesario
};

export function kalionJs(): Plugin {
    const externalDependencies = optionalDependencies.filter(dep => !isDependencyInstalled(dep));

    return {
        name: 'vite-plugin-kalion-js',
        config(config, {mode}): UserConfig {
            const env                       = loadEnv(mode, process.cwd()) as EnvVariables;
            const confAppName           = env.VITE_APP_NAME;
            const confAppCode           = env.VITE_APP_CODE;
            const confAppMinify                 = env.VITE_CONF_MINIFY === 'true';
            const confAppSourcemap              = env.VITE_CONF_SOURCEMAP === 'true';
            const confUseAppCodeInSourcePath    = env.VITE_CONF_USE_APPCODE_IN_SOURCE_PATH === 'true';
            const modeIsProd                    = mode === 'production';

            const appCode = getAppCode(confAppCode, confAppName);
            const basePublicPath = (confUseAppCodeInSourcePath && modeIsProd) ? `/${appCode}/build` : undefined;

            return {
                base: basePublicPath,
                build: {
                    minify: confAppMinify,
                    cssMinify: confAppMinify,
                    sourcemap: confAppSourcemap,
                    target: 'es2022',
                    rollupOptions: {
                        output: {
                            manualChunks: id => {
                                if (id.includes('node_modules')) {
                                    return 'vendor';
                                }
                            },
                        },
                        external: externalDependencies,
                    },
                },
                optimizeDeps: {
                    exclude: externalDependencies,
                },
                css: {
                    devSourcemap: true,
                },
            };
        },
        resolveId(source) {
            if (externalDependencies.includes(source)) {
                return 'kalel--' + source;
            }
            return null; // Deja que Vite maneje el resto
        },
        load(id) {
            // Si es uno de los módulos externos, no cargamos nada
            if (id.startsWith('kalel--')) {
                return ''; // Retorna una cadena vacía para no cargar el módulo
            }
            return null; // Deja que Vite cargue otros módulos
        },
    };
}