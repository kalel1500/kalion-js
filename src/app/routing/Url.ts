import { g } from '@/app';
import { Filter } from 'tabulator-tables';

type QueryParams = Record<string, unknown>

export class Url {
    static getCurrentUrl(): string {
        return window.location.href;
    }

    static #updateUrl(url: URL): void {
        window.history.pushState({}, '', url.toString());
    }

    static #isParamOrChild(key: string, param: string): boolean {
        return key === param || key.startsWith(`${param}[`);
    }

    static #hasParam(searchParams: URLSearchParams, param: string): boolean {
        return Array.from(searchParams.keys()).some(key => this.#isParamOrChild(key, param));
    }

    static #removeParam(searchParams: URLSearchParams, param: string): void {
        Array.from(searchParams.keys()).forEach(key => {
            if (this.#isParamOrChild(key, param)) searchParams.delete(key);
        });
    }

    static #appendParam(searchParams: URLSearchParams, key: string, value: unknown): void {
        if (value === undefined) return;

        if (value === null) {
            searchParams.append(key, '');
            return;
        }

        if (Array.isArray(value)) {
            value.forEach((item, index) => {
                this.#appendParam(searchParams, `${key}[${index}]`, item);
            });
            return;
        }

        if (value instanceof Date) {
            searchParams.append(key, value.toISOString());
            return;
        }

        if (typeof value === 'object') {
            Object.entries(value).forEach(([childKey, childValue]) => {
                this.#appendParam(searchParams, `${key}[${childKey}]`, childValue);
            });
            return;
        }

        searchParams.append(key, String(value));
    }

    static addParamsToUrl(objectQueryParams: QueryParams, onStart = false): void {
        const url = new URL(window.location.href);

        if (onStart) {
            const searchParams = new URLSearchParams();
            Object.entries(objectQueryParams).forEach(([key, value]) => {
                if (!this.#hasParam(url.searchParams, key)) {
                    this.#appendParam(searchParams, key, value);
                }
            });
            url.searchParams.forEach((value, key) => searchParams.append(key, value));
            url.search = searchParams.toString();
            this.#updateUrl(url);
            return;
        }

        Object.entries(objectQueryParams).forEach(([key, value]) => {
            this.#removeParam(url.searchParams, key);
            this.#appendParam(url.searchParams, key, value);
        });

        this.#updateUrl(url);
    }

    static removeParamsUrl(paramsToDelete: string[]): void {
        const url = new URL(window.location.href);
        paramsToDelete.forEach(param => this.#removeParam(url.searchParams, param));

        this.#updateUrl(url);
    }

    static getEncodedFilters(): string | null {
        return new URL(window.location.href).searchParams.get('filters');
    }

    static getDecodedFilters(): Filter[] | null {
        const filters = Url.getEncodedFilters();
        let decodedFilters = null;
        if (filters) {
            try {
                decodedFilters = decodeURIComponent(filters);
                decodedFilters = JSON.parse(decodedFilters);
            } catch (e) {
                g.catchCode({error: e});
                return null;
            }
        }
        return decodedFilters;
    }
}
