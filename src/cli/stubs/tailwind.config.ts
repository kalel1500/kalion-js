import type { Config } from 'tailwindcss'
import { laravelContent, laravelDefaultPlugins } from '@kalel1500/laravel-ts-utils/dist/plugins/tailwind';

export default {
    content: [
        ...laravelContent
    ],
    theme: {
        extend: {
            screens: {}
        },
    },
    plugins: [
        ...laravelDefaultPlugins
    ],
} satisfies Config
