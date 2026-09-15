import { g } from '@/app';
import { Filter } from 'tabulator-tables';

type QueryParams = Record<string, unknown>

export class Url {
    public static getCurrentUrl(): string {
        return window.location.href;
    }

    private static updateUrl(url: string): void {
        window.history.pushState({}, '', url);
    }

    private static toUrl(url: string | URL): URL {
        return new URL(url.toString(), window.location.href);
    }

    private static isParamOrChild(key: string, param: string): boolean {
        return key === param || key.startsWith(`${param}[`);
    }

    private static hasParam(searchParams: URLSearchParams, param: string): boolean {
        return Array.from(searchParams.keys()).some(key => this.isParamOrChild(key, param));
    }

    private static removeParam(searchParams: URLSearchParams, param: string): void {
        Array.from(searchParams.keys()).forEach(key => {
            if (this.isParamOrChild(key, param)) searchParams.delete(key);
        });
    }

    private static appendParam(searchParams: URLSearchParams, key: string, value: unknown): void {
        if (value === undefined) return;

        if (value === null) {
            searchParams.append(key, '');
            return;
        }

        if (Array.isArray(value)) {
            value.forEach((item, index) => {
                this.appendParam(searchParams, `${key}[${index}]`, item);
            });
            return;
        }

        if (value instanceof Date) {
            searchParams.append(key, value.toISOString());
            return;
        }

        if (typeof value === 'object') {
            Object.entries(value).forEach(([childKey, childValue]) => {
                this.appendParam(searchParams, `${key}[${childKey}]`, childValue);
            });
            return;
        }

        searchParams.append(key, String(value));
    }

    public static withQueryParams(
        url: string | URL,
        queryParams: QueryParams,
        preserveExisting = false,
    ): string {
        const updatedUrl = this.toUrl(url);

        if (preserveExisting) {
            const searchParams = new URLSearchParams();
            Object.entries(queryParams).forEach(([key, value]) => {
                if (!this.hasParam(updatedUrl.searchParams, key)) {
                    this.appendParam(searchParams, key, value);
                }
            });
            updatedUrl.searchParams.forEach((value, key) => searchParams.append(key, value));
            updatedUrl.search = searchParams.toString();
            return updatedUrl.toString();
        }

        Object.entries(queryParams).forEach(([key, value]) => {
            this.removeParam(updatedUrl.searchParams, key);
            this.appendParam(updatedUrl.searchParams, key, value);
        });

        return updatedUrl.toString();
    }

    public static withoutQueryParams(url: string | URL, paramsToDelete: string[]): string {
        const updatedUrl = this.toUrl(url);
        paramsToDelete.forEach(param => this.removeParam(updatedUrl.searchParams, param));

        return updatedUrl.toString();
    }

    public static updateCurrentQueryParams(
        queryParams: QueryParams,
        preserveExisting = false,
    ): void {
        this.updateUrl(this.withQueryParams(window.location.href, queryParams, preserveExisting));
    }

    public static removeCurrentQueryParams(paramsToDelete: string[]): void {
        this.updateUrl(this.withoutQueryParams(window.location.href, paramsToDelete));
    }

    public static getEncodedFilters(): string | null {
        return new URL(window.location.href).searchParams.get('filters');
    }

    public static getDecodedFilters(): Filter[] | null {
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
