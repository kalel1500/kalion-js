import {DefaultConstants} from "../_types";

// Implementa la clase Constants usando la interfaz
export class Constants<T extends DefaultConstants> {
    private static instance: Constants<DefaultConstants>;
    public constants: T;

    private constructor() {
        // Define valores por defecto
        this.constants = {
            token: document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? null,
            lang: 'es',
            langDouble: 'es-Es',
            defaultZoneName: 'Europe/Madrid', // Europe/Lisbon
            appIcon: new URL('/resources/images/logo-app.png', 'http://localhost/laravel-starter-template/').href,

            // Vite
            VITE_BROADCASTING_ENABLED: false,
            VITE_REVERB_APP_KEY: null,
            VITE_REVERB_HOST: 'localhost',
            VITE_REVERB_PORT: 8080,
            VITE_REVERB_SCHEME: 'http',
            VITE_APP_NAME: 'Laravel',
            VITE_APP_ENV: 'local',
        } as T;
    }

    public static getInstance(): Constants<DefaultConstants> {
        if (!Constants.instance) {
            Constants.instance = new Constants<DefaultConstants>();
        }
        return Constants.instance;
    }

    public get<K extends keyof T>(key: K): T[K] {
        return this.constants[key];
    }

    public set<K extends keyof T>(key: K, value: T[K]): void {
        this.constants[key] = value;
    }

    public extend(newConfig: Partial<T>): void {
        this.constants = { ...this.constants, ...newConfig };
    }

    // Función para obtener todas las constantes de configuración
    public getConstants(): T {
        return this.constants;
    }
}

// Exporta una instancia de configuración
export const Const = Constants.getInstance();
export const _const = Constants.getInstance().getConstants();
