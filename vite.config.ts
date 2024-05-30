import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
    build: {
        outDir: 'dist',
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            name: 'LaravelTsUtilities',
            fileName: (format) => `laravel-ts-utilities.${format}.js`
        },
        rollupOptions: {
            // Asegúrate de externalizar las dependencias que no quieres incluir en tu paquete
            external: [],
            output: {
                globals: {}
            }
        }
    }
});
