import { defineConfig, loadEnv, UserConfig } from 'vite';
import dts from 'vite-plugin-dts';
import path from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

type StrBoolean = 'true' | 'false';
type Env = {
    VITE_MINIFY: StrBoolean,
    VITE_SOURCEMAP: StrBoolean,
}

export default ({ mode }: { mode: string }) => {
    const env = loadEnv(mode, process.cwd()) as Env;
    const minify = env.VITE_MINIFY === 'true';
    const sourcemap = env.VITE_SOURCEMAP === 'true';
    const buildTarget = process.env.BUILD_TARGET;

    const libraryConfig: UserConfig = {
        plugins: [
            dts({
                include: ['src/app'], // Incluye los directorios src y types para la generación de tipos
                exclude: ['src/app/core/infrastructure/utilities/_internal/**'],
                outDir: 'dist/app/types', // Directorio de salida para los archivos .d.ts || path.resolve(__dirname, 'dist/types')
            }),
        ],
        build: {
            lib: {
                entry: {
                    app: path.resolve(__dirname, 'src/app/index.ts'), // Entrada para JavaScript
                    "styles-old": path.resolve(__dirname, 'src/app/styles/app-old.css'), // Entrada para main.css
                    "styles": path.resolve(__dirname, 'src/app/styles/app.css'), // Entrada para app.css
                },
                name: 'LaravelTsUtils',
                fileName: (format) => `laravel-ts-utils.${format}.js`,
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
            cssCodeSplit: true,
            minify: minify,
            sourcemap: sourcemap,
            outDir: './dist/app'
        }
    };
    const pluginViteConfig: UserConfig = {
        plugins: [
            dts({
                include: ['src/plugins/vite'], // Incluye los directorios src y types para la generación de tipos
                outDir: 'dist/plugins/vite', // Directorio de salida para los archivos .d.ts || path.resolve(__dirname, 'dist/types')
            }),
        ],
        build: {
            lib: {
                entry: path.resolve(__dirname, 'src/plugins/vite/index.ts'),
                name: 'VitePluginLaravelTsUtils',
                fileName: (format) => `plugin.js`,
                formats: ['es'],
            },
            rollupOptions: {
                // Marcar fs y path como externos porque son APIs de Node.js
                // Marcar Vite también como externo, ya que, ser incluido en el bundle del paquete porque estará disponible en la apicación
                external: ['fs', 'path', 'vite'],
            },
            minify: false,
            outDir: './dist/plugins/vite'
        }
    };
    const pluginTailwindConfig: UserConfig = {
        plugins: [
            dts({
                include: ['src/plugins/tailwind'], // Incluye los directorios src y types para la generación de tipos
                outDir: 'dist/plugins/tailwind', // Directorio de salida para los archivos .d.ts || path.resolve(__dirname, 'dist/types')
            }),
        ],
        build: {
            lib: {
                entry: path.resolve(__dirname, 'src/plugins/tailwind/index.ts'),
                name: 'TailwindCssPlugin',
                fileName: (format) => `plugin.cjs`,
                formats: ['cjs'],
            },
            rollupOptions: {
                // Marcar fs y path como externos porque son APIs de Node.js
                // Marcar Vite también como externo, ya que, ser incluido en el bundle del paquete porque estará disponible en la apicación
                external: ['tailwindcss/plugin', 'flowbite/plugin'],
            },
            minify: false,
            outDir: './dist/plugins/tailwind'
        }
    };
    const cliConfig: UserConfig = {
        plugins: [
            viteStaticCopy({
                targets: [
                    {
                        src: 'src/cli/stubs',   // Selecciona todos los archivos y subcarpetas
                        dest: '',               // Carpeta de destino donde se copiarán en la salida
                    }
                ]
            })
        ],
        build: {
            lib: {
                entry: path.resolve(__dirname, 'src/cli/index.ts'),
                name: 'CliLaravelTsUtils',
                fileName: (format) => `index.js`,
                formats: ['es'],
            },
            rollupOptions: {
                external: ['fs', 'path', 'url'], // Marcar fs, path y url como externos porque son APIs de Node.js
            },
            minify: false,
            outDir: './dist/cli'
        }
    };

    let selectedConfig;
    switch (buildTarget) {
        case 'pluginV':
            selectedConfig = pluginViteConfig;
            break;
        case 'pluginT':
            selectedConfig = pluginTailwindConfig;
            break;
        case 'scripts':
            selectedConfig = cliConfig;
            break;
        default:
            selectedConfig = libraryConfig;
    }

    return defineConfig(selectedConfig);
}
