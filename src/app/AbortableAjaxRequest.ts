import type { Options } from 'tabulator-tables';
import { g } from '@/app';
import type { ApiObject, HttpMethod } from '@/app';

type AjaxRequestFunc = NonNullable<Options['ajaxRequestFunc']>;

/**
 * `ajaxRequestFunc` para Tabulator que garantiza una única petición en vuelo por tabla:
 * cada nueva carga (filtro, orden, paginación, búsqueda...) aborta la anterior a nivel HTTP.
 *
 * Tabulator ya descarta las respuestas fuera de orden (DataLoader.requestOrder), pero sin cortar
 * la red y mostrando el aviso "Error" si la petición vieja falla. Aquí, además de cortar la red,
 * la promesa de la petición abortada se queda pendiente para siempre, de modo que Tabulator
 * la ignora (la petición nueva ya tiene un requestOrder mayor) y no muestra el aviso "Error".
 */
export class AbortableAjaxRequest {
    private controller: AbortController | null = null;

    readonly requestFunc: AjaxRequestFunc;

    constructor() {
        const self = this;

        // `function` (no arrow) porque Tabulator la invoca con `this` = módulo Ajax, lo que permite reutilizar
        // su urlGenerator (respeta ajaxURLGenerator y la serialización por defecto de page/size/sort/filter).
        this.requestFunc = function (this: any, url: string, config: any, params: any) {
            self.abort();
            const controller = new AbortController();
            self.controller = controller;

            const finalUrl: string = this.urlGenerator.call(this.table, url, config, params);
            const type = String(config?.method ?? 'GET').toUpperCase() as HttpMethod;

            return g.fetchStrict({
                url: finalUrl,
                type,
                params: type === 'GET' ? undefined : (params as ApiObject),
                headers: config?.headers ?? {},
                signal: controller.signal,
            })
                .catch((e: unknown) => {
                    if (g.isAbortError(e)) return new Promise<never>(() => {});
                    throw e;
                })
                .finally(() => {
                    if (self.controller === controller) self.controller = null;
                });
        };
    }

    abort(): void {
        this.controller?.abort();
        this.controller = null;
    }
}
