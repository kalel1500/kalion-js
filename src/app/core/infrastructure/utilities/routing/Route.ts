import {route} from "ziggy-js";
import { g } from '../general';

type ROUTES = {
    PAGES: {
        [name: string]: {
            uri: string,
            controller: any,
            method: string,
            makeDataRequest: boolean,
        }
    },
    COMPONENTS: {
        [name: string]: {
            controller: any,
            method: string,
            uris: string[],
        }
    },
    ALL: {
        [name: string]: {
            controller: any,
            method: string,
            except: string[],
        }
    },
}

export class Route {
    static #ROUTES: ROUTES = {
        PAGES: {},
        COMPONENTS: {},
        ALL: {},
    };

    static page(uri: string, callback: [any, string], makeDataRequest = false): void {
        if (Array.isArray(callback) && (typeof makeDataRequest === "boolean")) {
            const controller = callback[0];
            const method = callback[1];
            Route.#ROUTES["PAGES"][uri] = {
                uri: uri,
                controller: controller,
                method: method,
                makeDataRequest: makeDataRequest,
            };
        }
    }

    static component(callback: [any, string], uris: string[]): void {
        if (Array.isArray(callback) && Array.isArray(uris)) {
            const controller = callback[0];
            const method = callback[1];
            Route.#ROUTES["COMPONENTS"][`${controller.name}_${method}`] = {
                controller: controller,
                method: method,
                uris: uris,
            };
        }
    }

    static all(callback: [any, string], except: string[]): void {
        if (Array.isArray(callback) && Array.isArray(except)) {
            const controller = callback[0];
            const method = callback[1];
            Route.#ROUTES["ALL"][`${controller.name}_${method}`] = {
                controller: controller,
                method: method,
                except: except,
            };
        }
    }

    static dispatch(): void {
        if (!Route.existsRoutesDefinition()) return;

        Object.values(Route.#ROUTES["PAGES"]).forEach(page => {
            if (route().current() === page.uri) {
                // Prueba de imports dinamicos para reducir tamaño del archivo js
                // const { default: ControllerClass } = await page.controller()
                // const controller = new ControllerClass()
                const controller = new page.controller();

                if (!page.makeDataRequest) {
                    controller[page.method]();
                    return;
                }

                g.newFetch({url: route(page.uri, route().params)})
                    .then(viewData => {
                        controller[page.method](viewData);
                    })
                    .catch(e => {
                        g.catchCode({error: e});
                    });
                return; // cortamos ejecucion porque ya no se va a cumplir la condicion para las demas rutas
            }
        });

        Object.values(Route.#ROUTES["COMPONENTS"]).forEach(component => {
            const onRoutes = component.uris;
            const currentRoute = route().current();
            if (currentRoute !== undefined && onRoutes.includes(currentRoute)) {
                const controller = new component.controller();
                controller[component.method]();
            }
        });

        Object.values(Route.#ROUTES["ALL"]).forEach(component => {
            const exceptRoutes = component.except;
            const currentRoute = route().current();
            if (currentRoute !== undefined && !exceptRoutes.includes(currentRoute)) {
                const controller = new component.controller();
                controller[component.method]();
            }
        });
    }

    static existsRoutesDefinition(): boolean {
        const routeVariable = route();
        // @ts-ignore
        return routeVariable.t.hasOwnProperty("url");
    }
}
