import type { Filter } from 'tabulator-tables';

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
        prepend = false,
    ): string {
        const updatedUrl = this.toUrl(url);

        if (prepend) {
            const searchParams = new URLSearchParams();
            Object.entries(queryParams).forEach(([key, value]) => {
                this.removeParam(updatedUrl.searchParams, key);
                this.appendParam(searchParams, key, value);
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
        prepend = false,
    ): void {
        this.updateUrl(this.withQueryParams(window.location.href, queryParams, prepend));
    }

    public static removeCurrentQueryParams(paramsToDelete: string[]): void {
        this.updateUrl(this.withoutQueryParams(window.location.href, paramsToDelete));
    }

    public static getFilters(): Filter[] | null {
        const filters = new Map<number, Partial<Filter>>();
        const searchParams = new URL(window.location.href).searchParams;

        searchParams.forEach((value, key) => {
            const match = key.match(/^filter\[(\d+)]\[(field|type|value)]$/);
            if (!match) return;

            const index = Number(match[1]);
            const property = match[2] as keyof Filter;
            const filter = filters.get(index) ?? {};

            Object.assign(filter, { [property]: value });
            filters.set(index, filter);
        });

        if (filters.size === 0) return null;

        return Array.from(filters.entries())
            .sort(([firstIndex], [secondIndex]) => firstIndex - secondIndex)
            .map(([, filter]) => filter as Filter);
    }
}
