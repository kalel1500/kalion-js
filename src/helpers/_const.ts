import {AppConstants} from "index";

export const _const: AppConstants = {
    token: document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? null,
    lang: 'es',
    langDouble: 'es-Es',
    defaultZoneName: 'Europe/Madrid', // Europe/Lisbon
    appIcon: new URL('/resources/images/logo-pi.png', import.meta.url).href,

    // Vite
    VITE_BROADCASTING_ENABLED: import.meta.env.VITE_BROADCASTING_ENABLED === 'true',
    VITE_REVERB_APP_KEY: import.meta.env.VITE_REVERB_APP_KEY,
    VITE_REVERB_HOST: import.meta.env.VITE_REVERB_HOST,
    VITE_REVERB_PORT: parseInt(import.meta.env.VITE_REVERB_PORT),
    VITE_REVERB_SCHEME: import.meta.env.VITE_REVERB_SCHEME,
    VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
    VITE_APP_ENV: import.meta.env.VITE_APP_ENV,
};
