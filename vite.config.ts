import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
    build: {
        outDir: 'dist',
        lib: {
            entry: 'src/index.ts', // path.resolve(__dirname, 'src/index.ts'),
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
