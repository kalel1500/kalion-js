import { g } from '@/app';
import type { Optgroup, Option } from "slim-select";

type SlimData = Option | Optgroup;
type SearchCallback = (search: string, currentData: SlimData[]) => Promise<Optgroup[]>;

export class SlimHelper {

    public static debouncedSearch({source, delay = 500, minLength = 3, fetchLimit = 20}: {source: string | SearchCallback, delay?: number, minLength?: number, fetchLimit?: number}) {
        const searchLogic = async (search: string, currentData: SlimData[]): Promise<SlimData[]> => {
            if (search.length < minLength) {
                throw new Error(`Search must be at least ${minLength} characters`);
            }

            if (typeof source === 'string') {
                return await SlimHelper.fetchStandard(source, search, currentData, fetchLimit);
            }

            return await source(search, currentData);
        };

        return g.debounce(searchLogic, delay);
    }

    private static async fetchStandard(baseUrl: string, search: string, currentData: SlimData[], fetchLimit: number): Promise<SlimData[]> {
        // Extraemos todos los IDs ya seleccionados para filtrar (aplanamos currentData para obtener solo los valores)
        const selectedValues = currentData.flatMap(d =>
            'options' in d ? d.options.map(o => o.value) : [d.value]
        ).filter(v => v !== undefined);

        const url = new URL(baseUrl, window.location.origin);
        url.searchParams.set('search', search);
        url.searchParams.set('limit', fetchLimit.toString());
        url.searchParams.set('exclude', selectedValues.join(','));


        const response = await fetch(url.toString());
        const resp = await response.json();

        // Asumimos que el backend ya envía un array de SlimData (opciones o grupos)
        const rawData: SlimData[] = resp?.data || [];

        if (!rawData.length) {
            throw new Error(resp?.error || "No results found");
        }

        // Filtramos los resultados del backend que ya existan en la selección
        const selectedSet = new Set(selectedValues.map((v) => String(v)));
        return rawData
            .map((item) => {
                if ('options' in item) {
                    // Si es un grupo, filtramos sus opciones internas
                    const filteredOptions = item.options?.filter(
                        (opt) => !selectedSet.has(String(opt.value))
                    ) || [];

                    // Devolvemos una copia del grupo con las opciones filtradas
                    return { ...item, options: filteredOptions } as Optgroup;
                }

                // Si es una opción simple, la devolvemos o null si debe filtrarse
                return !selectedSet.has(String(item.value)) ? item : null;
            })
            .filter((item): item is SlimData => {
                if (item === null) return false;

                // Si es un grupo, solo lo mostramos si aún tiene opciones disponibles
                if ('options' in item) {
                    return item.options.length > 0;
                }

                return true;
            });
    }
}