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
        type ParsedFilter = Partial<Pick<Filter, 'field' | 'type'>> & {
            scalarValue?: string;
            arrayValues: Map<number, string>;
        };

        const filters = new Map<number, ParsedFilter>();
        const searchParams = new URL(window.location.href).searchParams;
        const pattern = /^filter\[(\d+)]\[(field|type|value)](?:\[(\d+)])?$/;

        searchParams.forEach((value, key) => {
            const match = key.match(pattern);
            if (!match) return;

            const index = Number(match[1]);
            const property = match[2];
            const valueIndex = match[3];
            const filter = filters.get(index) ?? { arrayValues: new Map<number, string>() };

            if (property === 'field') filter.field = value;
            else if (property === 'type') filter.type = value as Filter['type'];
            else if (valueIndex === undefined) filter.scalarValue = value;
            else filter.arrayValues.set(Number(valueIndex), value);

            filters.set(index, filter);
        });

        const parsedFilters = Array.from(filters.entries())
            .sort(([firstIndex], [secondIndex]) => firstIndex - secondIndex)
            .flatMap(([, filter]) => {
                if (!filter.field || !filter.type) return [];

                const arrayValue = Array.from(filter.arrayValues.entries())
                    .sort(([firstIndex], [secondIndex]) => firstIndex - secondIndex)
                    .map(([, value]) => value);

                return [{
                    field: filter.field,
                    type: filter.type,
                    value: arrayValue.length ? arrayValue : (filter.scalarValue ?? ''),
                }];
            });

        return parsedFilters.length ? parsedFilters : null;
    }
}
