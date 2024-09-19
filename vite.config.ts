import {defineConfig, loadEnv, UserConfig} from 'vite';
import dts from 'vite-plugin-dts';
import path from 'path';

type StrBoolean = 'true' | 'false';
type Env = {
    VITE_MINIFY: StrBoolean,
    VITE_SOURCEMAP: StrBoolean,
}

export default ({ mode }: { mode: string }) => {
    const env = loadEnv(mode, process.cwd()) as Env;
    const minify = env.VITE_MINIFY === "true";
    const sourcemap = env.VITE_SOURCEMAP === "true";
    const isPlugin = process.env.BUILD_TARGET === 'plugin';

    const libraryConfig: UserConfig = {
        plugins: [
            dts({
                include: ['src'], // Incluye los directorios src y types para la generación de tipos
                exclude: ['src/_internal/**'],
                outDir: 'dist/types', // Directorio de salida para los archivos .d.ts || path.resolve(__dirname, 'dist/types')
            }),
        ],
        build: {
            lib: {
                entry: path.resolve(__dirname, 'src/index.ts'),
                name: 'LaravelTsUtilities',
                fileName: (format) => `laravel-ts-utilities.${format}.js`,
                formats: ['es']
            },
            rollupOptions: {
                // Asegúrate de externalizar las dependencias que no quieres incluir en tu paquete
                external: [
                    '@fortawesome/fontawesome-free',
                    '@popperjs/core',
                    'bootstrap',
                    'laravel-echo',
                    'luxon',
                    'pusher-js',
                    'slim-select',
                    'sweetalert2',
                    'tabulator-tables',
                    'ziggy-js',
                ],
                output: {
                    globals: {}
                }
            },
            minify: minify,
            sourcemap: sourcemap
        }
    };
    const pluginConfig: UserConfig = {
        plugins: [
            dts({
                include: ['src/plugins'], // Incluye los directorios src y types para la generación de tipos
                outDir: 'plugins', // Directorio de salida para los archivos .d.ts || path.resolve(__dirname, 'dist/types')
            }),
        ],
        build: {
            lib: {
                entry: path.resolve(__dirname, 'src/plugins/index.ts'),
                name: 'VitePluginLaravelTsUtilities',
                fileName: (format) => `vite-plugin-laravel-ts-utilities.js`,
                formats: ['es'],
            },
            rollupOptions: {
                external: ['fs', 'path'], // Marcar fs y path como externos porque son APIs de Node.js
            },
            minify: false,
            outDir: './plugins'
        }
    };
    return defineConfig(isPlugin ? pluginConfig : libraryConfig);
}
