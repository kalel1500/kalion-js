import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import path from 'path';


export default defineConfig({
    plugins: [
        dts({
            include: ['src'], // Incluye los directorios src y types para la generación de tipos
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
        }
    }
});
