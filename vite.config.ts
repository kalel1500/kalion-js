import { defineConfig, loadEnv, normalizePath, UserConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';
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
                insertTypesEntry: true,
                bundleTypes: true,
                include: ["src/app/**/*.ts"],
                exclude: ['src/app/core/infrastructure/utilities/_internal/**'],
            }),
        ],
        build: {
            lib: {
                entry: resolve(__dirname, 'src/app/index.ts'),
                formats: ['es', 'cjs'],
                fileName: (format) => {
                    return `kalion-js.${format === "es" ? "js" : "common.js"}`;
                },
            },
            rollupOptions: {
                // Externalizar las dependencias que no quieres incluir en tu paquete
                external: [
                    '@fortawesome/fontawesome-free',
                    '@popperjs/core',
                    'bootstrap',
                    'flowbite',
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
            sourcemap: sourcemap,
            outDir: resolve(__dirname, "dist/app"),
            emptyOutDir: true,
        },
        resolve: {
            alias: {
                '@': resolve(__dirname, './src'),
            }
        },
    };
    const stylesConfig: UserConfig = {
        build: {
            lib: {
                entry: {
                    "styles-old": resolve(__dirname, 'src/styles/app-old.css'),
                    "styles": resolve(__dirname, 'src/styles/app.css'),
                    "slimselect": resolve(__dirname, 'src/styles/slim-select/slimselect.css'),
                    "sweetalert": resolve(__dirname, 'src/styles/sweetalert/sweetalert.css'),
                    "tabulator": resolve(__dirname, 'src/styles/tabulator/tabulator.css'),
                    "tailwind-config": resolve(__dirname, 'src/styles/tailwind-config.css'),
                },
            },
            cssCodeSplit: true,
            minify: minify,
            sourcemap: sourcemap,
            outDir: resolve(__dirname, "dist/styles"),
            emptyOutDir: true,
        },
    };
    const pluginViteConfig: UserConfig = {
        plugins: [
            dts({
                insertTypesEntry: true,
                bundleTypes: true,
                include: ['src/plugins/vite/**/*.ts'], // Incluye los directorios src y types para la generación de tipos
            }),
        ],
        build: {
            lib: {
                entry: resolve(__dirname, 'src/plugins/vite/index.ts'),
                name: 'VitePluginKalionJs',
                fileName: (format) => `index.js`,
                formats: ['es'],
            },
            rollupOptions: {
                // Marcar fs y path como externos porque son APIs de Node.js
                // Marcar Vite también como externo, ya que, ser incluido en el bundle del paquete porque estará disponible en la apicación
                external: ['fs', 'path', 'vite'],
            },
            minify: false,
            outDir: resolve(__dirname, "dist/plugins/vite"),
            emptyOutDir: true,
        }
    };
    const pluginTailwindConfig: UserConfig = {
        plugins: [
            dts({
                insertTypesEntry: true,
                bundleTypes: true,
                include: ['src/plugins/tailwind/**/*.ts'], // Incluye los directorios src y types para la generación de tipos
            }),
            viteStaticCopy({
                targets: [
                    {
                        src: 'src/plugins/tailwind/tailwind.config.js',
                        dest: normalizePath(resolve(__dirname, "dist/plugins/tailwind")),
                        rename: {
                            stripBase: 3
                        }
                    }
                ]
            })
        ],
        build: {
            lib: {
                entry: resolve(__dirname, 'src/plugins/tailwind/index.ts'),
                name: 'TailwindCssPlugin',
                fileName: (format) => `index.cjs`,
                formats: ['cjs'],
            },
            rollupOptions: {
                // Marcar fs y path como externos porque son APIs de Node.js
                // Marcar Vite también como externo, ya que, ser incluido en el bundle del paquete porque estará disponible en la apicación
                external: ['tailwindcss/plugin', 'flowbite/plugin'],
            },
            minify: false,
            outDir: resolve(__dirname, "dist/plugins/tailwind"),
            emptyOutDir: true,
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
        case 'styles':
            selectedConfig = stylesConfig;
            break;
        default:
            selectedConfig = libraryConfig;
    }

    return defineConfig(selectedConfig);
}
