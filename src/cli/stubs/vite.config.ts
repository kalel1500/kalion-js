import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import { laravelTsUtilsPlugin } from '@kalel1500/laravel-ts-utils/dist/plugins/vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.ts'],
            refresh: false,
        }),
        tailwindcss(),
        laravelTsUtilsPlugin()
    ]
});
