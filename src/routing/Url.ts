import {route} from "../../../../vendor/tightenco/ziggy";
import g from "../helpers/global";
import {Filter} from "tabulator-tables";

// type QueryParams = { [p: string]: string | number }
type QueryParams = Record<string, unknown>

export default class Url
{
    static getCurrentUrl(): string
    {
        const current = (route().current() as string);
        const params = route().params;
        return route(current, params)
    }

    static #updateUrl(params: QueryParams)
    {
        // TODO Canals(revisar) - quiza hay que limitar por si se hace muy grande la query -> console.log(objectQueryParams.filters.length);
        const newUrl = route((route().current() as string), params);
        window.history.pushState({}, '', newUrl);
    }

    static addParamsToUrl(objectQueryParams: QueryParams, onStart = false)
    {
        let currentParams = route().params;
        let params = (onStart) ? {...objectQueryParams, ...currentParams}: {...currentParams, ...objectQueryParams}
        this.#updateUrl(params);
    }

    static removeParamsUrl(paramsToDelete: string[])
    {
        let currentParams = route().params;
        paramsToDelete.forEach(item => {
            delete currentParams[item];
        });

        this.#updateUrl(currentParams);
    }

    static getEncodedFilters(): string | null
    {
        return route()?.params?.filters as string ?? null;
    }

    static getDecodedFilters(): Filter[] | null
    {
        const filters = Url.getEncodedFilters();
        let decodedFilters = null;
        if (filters) {
            try {
                decodedFilters = decodeURIComponent(filters);
                decodedFilters = JSON.parse(decodedFilters);
            } catch (e) {
                g.catchCode({error: e})
                return null;
            }
        }
        return decodedFilters;
    }
}
