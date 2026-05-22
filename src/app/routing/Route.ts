import { route } from 'ziggy-js';
import { g } from '@/app';

type ControllerInstance = Record<string, any>;
type ControllerClass = new () => ControllerInstance;
type ControllerDefinition = ControllerClass | ControllerInstance;
type ControllerCallback = [ControllerDefinition, string];

type ROUTES = {
    PAGES: {
        [name: string]: {
            uri: string;
            controller: ControllerDefinition;
            method: string;
            makeDataRequest: boolean;
        };
    };
    COMPONENTS: {
        [name: string]: {
            controller: ControllerDefinition;
            method: string;
            uris: string[];
        };
    };
    ALL: {
        [name: string]: {
            controller: ControllerDefinition;
            method: string;
            except: string[];
        };
    };
};

export class Route {
    static #ROUTES: ROUTES = {
        PAGES: {},
        COMPONENTS: {},
        ALL: {},
    };

    /**
     * Instancia una clase o devuelve el objeto literal tal cual.
     */
    private static resolveController(controller: ControllerDefinition): ControllerInstance {
        return typeof controller === 'function'
            ? new (controller as ControllerClass)()
            : controller;
    }

    /**
     * Recorre un grupo de rutas y ejecuta el método del controlador
     * si el predicado devuelve true.
     */
    private static runControllers<T extends { controller: ControllerDefinition; method: string }>(
        routes: Record<string, T>,
        shouldRun: (entry: T) => boolean
    ): void {
        Object.values(routes).forEach(entry => {
            if (!shouldRun(entry)) return;
            const controller = Route.resolveController(entry.controller);
            controller[entry.method]();
        });
    }

    /**
     * Comprueba si el paquete de rutas (Ziggy) está disponible e inicializado.
     */
    private static isRouteAvailable(): boolean {
        try {
            const r = route();
            // @ts-ignore — dependencia de implementación interna de Ziggy
            return Boolean(r?.t?.hasOwnProperty('url'));
        } catch {
            return false;
        }
    }

    // ─── Registro de rutas ────────────────────────────────────────────────────

    static page(uri: string, callback: ControllerCallback, makeDataRequest: boolean = false): void {
        if (!Array.isArray(callback)) return;

        const [controller, method] = callback;
        Route.#ROUTES['PAGES'][uri] = {
            uri,
            controller,
            method,
            makeDataRequest,
        };
    }

    static component(callback: ControllerCallback, uris: string[]): void {
        if (!Array.isArray(callback) || !Array.isArray(uris)) return;

        const [controller, method] = callback;
        const key = `${(controller as any).name ?? 'anonymous'}_${method}`;
        Route.#ROUTES['COMPONENTS'][key] = { controller, method, uris };
    }

    static all(callback: ControllerCallback, except: string[]): void {
        if (!Array.isArray(callback) || !Array.isArray(except)) return;

        const [controller, method] = callback;
        const key = `${(controller as any).name ?? 'anonymous'}_${method}`;
        Route.#ROUTES['ALL'][key] = { controller, method, except };
    }

    // ─── Dispatch ─────────────────────────────────────────────────────────────

    static dispatch(): void {
        if (!Route.isRouteAvailable()) return;

        // PAGES: solo se ejecuta la ruta activa
        Object.values(Route.#ROUTES['PAGES']).forEach(page => {
            if (route().current() !== page.uri) return;

            const controller = Route.resolveController(page.controller);

            if (!page.makeDataRequest) {
                const raw = document.getElementById('page-data')?.dataset.pageData;
                const data = raw ? JSON.parse(raw) : undefined;
                controller[page.method](data);
                return;
            }

            g.fetchStrict({ url: route(page.uri, route().params) })
                .then(viewData => controller[page.method](viewData))
                .catch(e => g.catchCode({ error: e }));
        });

        // COMPONENTS: se ejecutan en las URIs indicadas
        Route.runControllers(Route.#ROUTES['COMPONENTS'], entry => {
            const current = route().current();
            return current !== undefined && entry.uris.includes(current);
        });

        // ALL: se ejecutan en todas las rutas salvo las excluidas
        Route.runControllers(Route.#ROUTES['ALL'], entry => {
            const current = route().current();
            return current !== undefined && !entry.except.includes(current);
        });
    }
}