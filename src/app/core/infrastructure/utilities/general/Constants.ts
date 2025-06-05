import { DefaultConstants } from '../../../_types';

// Implementa la clase Constants usando la interfaz
export class Constants<T extends DefaultConstants> {
    private static instance: Constants<any>;
    public constants: T;

    private constructor() {
        // Define valores por defecto
        this.constants = {
            token: document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? null,
            lang: 'es',
            langDouble: 'es-Es',
            defaultZoneName: 'Europe/Madrid', // Europe/Lisbon
            appIcon: new URL('/resources/images/logo-app.png', 'http://localhost/laravel-starter-template/').href,
            routeName_websockets_checkService: 'kalion.ajax.websockets.checkService',
            routeName_queues_checkService: 'kalion.ajax.queues.checkService',

            // Vite
            VITE_BROADCASTING_ENABLED: false,

            VITE_REVERB_APP_KEY: undefined,
            VITE_REVERB_HOST: 'localhost',
            VITE_REVERB_PORT: 8080,
            VITE_REVERB_SCHEME: 'http',

            VITE_APP_ENV: 'local',
            VITE_APP_NAME: 'Laravel',
            VITE_APP_CODE: 'laravel',

            VITE_TS_STORAGE_VERSION: '0.0',
            VITE_TS_USE_BOOSTRAP_CLASSES: false,
        } as T;
    }

    // Método para obtener la instancia única de la clase (Singleton)
    public static getInstance<U extends DefaultConstants>(): Constants<U> {
        if (!Constants.instance) {
            Constants.instance = new Constants<U>();
        }
        return Constants.instance;
    }

    // Método estático para obtener el valor de una constante específica
    public get<K extends keyof T>(key: K): T[K] {
        // return Constants.getInstance().getConstants()[key];
        return this.constants[key];
    }

    public extend(newConfig: Partial<T>): void {
        const filteredNewConfig = Object.fromEntries(
            Object.entries(newConfig).filter(([_, value]) => value !== undefined)
        );
        this.constants = {...this.constants, ...filteredNewConfig};
    }

    // Función para obtener todas las constantes de configuración
    public getConstants(): T {
        return this.constants;
    }
}
