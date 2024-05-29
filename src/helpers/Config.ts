import {DefaultConfig} from "index";

// Implementa la clase Config usando la interfaz
export class Config<T extends DefaultConfig> {
    private static instance: Config<DefaultConfig>;
    public config: T;

    private constructor() {
        // Define valores por defecto
        this.config = {
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

    public static getInstance(): Config<DefaultConfig> {
        if (!Config.instance) {
            Config.instance = new Config<DefaultConfig>();
        }
        return Config.instance;
    }

    public get<K extends keyof T>(key: K): T[K] {
        return this.config[key];
    }

    public set<K extends keyof T>(key: K, value: T[K]): void {
        this.config[key] = value;
    }

    public extend(newConfig: Partial<T>): void {
        this.config = { ...this.config, ...newConfig };
    }

    // Función para obtener todas las constantes de configuración
    public getConstants(): T {
        return this.config;
    }
}

// Exporta una instancia de configuración
export const Const = Config.getInstance();
export const _const = Config.getInstance().getConstants();
