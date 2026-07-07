import SlimSelect from "slim-select";
import type { Settings, Events, Optgroup, Option } from "slim-select";
import { FetchResponse, g } from '@/app';
import { ___ } from '@/app/_internal/helpers';

type SlimData = Option | Optgroup;
type SearchCallback = (search: string, currentData: SlimData[]) => Promise<Optgroup[]>;
type SlimConfigData = (Partial<Option> | Partial<Optgroup>)[];
type SelectOptions = Partial<Settings & Events> & { data?: SlimConfigData };
type SearchOptions = { search: Events["search"] } & Partial<Omit<Settings & Events, "search">> & { data?: SlimConfigData };
type DebouncedSearchParams = {
    source: string | SearchCallback;
    delay?: number;
    minLength?: number;
    fetchLimit?: number;
    textMinCharacters?: string;
    textEmptyResults?: string;
};

const SLIM_EVENT_KEYS = ['search', 'searchFilter', 'beforeChange', 'afterChange', 'beforeClose', 'afterClose', 'beforeOpen', 'afterOpen', 'addable', 'error'] as const;

export class SSelect {
    // ─── public API  ──────────────────────────────────────────────

    private static splitOptions(options: SelectOptions): { settings: Partial<Settings>; events: Partial<Events>; data?: SlimConfigData } {
        const { data, ...restOptions } = options;
        const settings: Partial<Settings> = {};
        const events: Partial<Events> = {};

        for (const [key, value] of Object.entries(restOptions)) {
            if ((SLIM_EVENT_KEYS as readonly string[]).includes(key)) {
                (events as any)[key] = value;
            } else {
                (settings as any)[key] = value;
            }
        }

        return { settings, events, data };
    }

    static basic(select: string | Element, options: SelectOptions = {}): SlimSelect {
        const { settings, events, data } = SSelect.splitOptions(options);
        return new SlimSelect({
            select,
            data,
            settings: { ...settings },
            events: { ...events },
        });
    }

    static search(select: string | Element, options: SearchOptions): SlimSelect {
        const { settings, events, data } = SSelect.splitOptions(options);
        const defaultSettings: Partial<Settings> = {
            keepSearch: true,
            closeOnSelect: false,
            searchHighlight: true,
            allowDeselect: true,
            timeoutDelay: 500,
            maxValuesShown: 4,
            searchPlaceholder: ___('select_search_placeholder'),
            searchText: ___('select_search_text'),
            searchingText: ___('select_searching_text'),
            resultsText: ___('select_results_text'),
            deselectText: ___('select_deselect_text'),
            removeText: ___('select_remove_text'),
            placeholderText: ___('select_placeholder_text'),
            maxValuesMessage: ___('select_maxValues_message'),
            addableText: ___('select_addable_text'),
        };
        return new SlimSelect({
            select,
            data,
            settings: { ...defaultSettings, ...settings },
            events: { ...events },
        });
    }

    // ─── Helpers ───────────────────────────────────────────────────

    public static debouncedSearch({
                                      source,
                                      delay = 500,
                                      minLength = 3,
                                      fetchLimit = 20,
                                      textMinCharacters,
                                      textEmptyResults,
    }: DebouncedSearchParams) {
        const searchLogic = async (search: string, currentData: SlimData[]): Promise<SlimData[]> => {
            if (search.length < minLength) {
                throw new Error(textMinCharacters ?? ___('select_debounce_MIN_characters', {min: minLength.toString()}));
            }

            if (typeof source === "string") {
                return await SSelect.fetchAndFilterSelected(source, search, currentData, fetchLimit, textEmptyResults);
            }

            return await source(search, currentData);
        };

        return g.debounce(searchLogic, delay);
    }

    private static async fetchAndFilterSelected(baseUrl: string, search: string, currentData: SlimData[], fetchLimit: number, textEmptyResults?: string): Promise<SlimData[]> {
        // Extraemos todos los IDs ya seleccionados para filtrar (aplanamos currentData para obtener solo los valores)
        const selectedValues = currentData.flatMap((d) => ("options" in d ? d.options.map((o) => o.value) : [d.value])).filter((v) => v !== undefined);

        const url = new URL(baseUrl, window.location.origin);
        url.searchParams.set("search", search);
        url.searchParams.set("limit", fetchLimit.toString());
        url.searchParams.set("exclude", selectedValues.join(","));

        // const response = await fetch(url.toString());
        // const resp = (await response.json()) as FetchResponse<SlimData[]>;
        const resp = await g.fetchStrict<FetchResponse<SlimData[]>>({ url: url.toString() });

        // Asumimos que el backend ya envía un array de SlimData (opciones o grupos)
        const rawData: SlimData[] = resp?.data || [];

        if (!rawData.length) {
            throw new Error(textEmptyResults ?? ___('select_debounce_empty_results'));
        }

        // Filtramos los resultados del backend que ya existan en la selección
        const selectedSet = new Set(selectedValues.map((v) => String(v)));
        return rawData
            .map((item) => {
                if ("options" in item) {
                    // Si es un grupo, filtramos sus opciones internas
                    const filteredOptions = item.options?.filter((opt) => !selectedSet.has(String(opt.value))) || [];

                    // Devolvemos una copia del grupo con las opciones filtradas
                    return { ...item, options: filteredOptions } as Optgroup;
                }

                // Si es una opción simple, la devolvemos o null si debe filtrarse
                return !selectedSet.has(String(item.value)) ? item : null;
            })
            .filter((item): item is SlimData => {
                if (item === null) return false;

                // Si es un grupo, solo lo mostramos si aún tiene opciones disponibles
                if ("options" in item) {
                    return item.options.length > 0;
                }

                return true;
            });
    }
}