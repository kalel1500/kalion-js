import { EventCallBackMethods } from 'tabulator-tables';
import Echo from 'laravel-echo';

declare global {
    interface Window {
        Pusher: any;
        Echo: Echo<'reverb'>;
    }
}

export type EnvVariables = {
    readonly VITE_CONF_MINIFY?: string;
    readonly VITE_CONF_SOURCEMAP?: string;
    readonly VITE_CONF_USE_APPCODE_IN_SOURCE_PATH?: string;

    readonly VITE_BROADCASTING_ENABLED?: string; // notInEnv

    readonly VITE_REVERB_APP_KEY?: string; // notInEnv
    readonly VITE_REVERB_HOST?: string; // notInEnv
    readonly VITE_REVERB_PORT?: string; // notInEnv
    readonly VITE_REVERB_SCHEME?: string; // notInEnv

    readonly VITE_APP_ENV?: string;
    readonly VITE_APP_NAME?: string;
    readonly VITE_APP_CODE?: string;

    readonly VITE_TS_STORAGE_VERSION?: string;
    readonly VITE_TS_USE_BOOSTRAP_CLASSES?: string; // notInEnv
}

// Define una interfaz para la configuración por defecto
export interface DefaultConstants {
    token: string | null;
    lang: string;
    langDouble: string;
    defaultZoneName: string;
    appIcon: string;
    routeName_checkReverb: string;
    routeName_checkQueue: string;

    readonly VITE_BROADCASTING_ENABLED: boolean;

    readonly VITE_REVERB_APP_KEY: string | undefined;
    readonly VITE_REVERB_HOST: string;
    readonly VITE_REVERB_PORT: number;
    readonly VITE_REVERB_SCHEME: string;

    readonly VITE_APP_ENV: string;
    readonly VITE_APP_NAME: string;
    readonly VITE_APP_CODE: string;

    readonly VITE_TS_STORAGE_VERSION: string;
    readonly VITE_TS_USE_BOOSTRAP_CLASSES: boolean;
}

export interface Translation {
    [key: string]: string;
}

export interface DefaultTranslations extends Translation {
    save: string;
    cancel: string;
    delete: string;
    move_to: string;
    close: string;
    detail: string;
    copy: string;
    search_placeholder: string;
    select_placeholder: string;
    select_value_placeholder: string;
    copied_text: string;
    confirm_delete_record_NAME: string;
    confirm_delete_FIELD_NAME: string;
    record_RECORD_doesnt_exist_in_the_TABLE_table: string;
    min_MIN_characters_on_search: string;
    add_FIELD: string;
    see_FIELD: string;
    edit_FIELD_NAME: string;
    the_page: string;
    cannot_save_an_error: string;
    incorrect_blade_format: string;
    to_empty: string;
    launch: string;
    correct: string;
    ok: string;
    reload_page: string;
    unforeseen_error: string;
    loading: string;
    loading_dots: string;
    search: string;
    searching_dots: string,
    no_results: string,
    filter: string;
    date: string;
    download_completed: string;
    fetch_error_message: string;
    some_class_does_not_meet_the_INTERFACE_interface_contract: string;
    it_has_been_called_a_JS_component_that_does_not_match_the_current_page: string;
    need_NUMBER_characters: string;
    a_loader_was_expected_on_the_page: string;
    check_if_the_loader_was_in_a_div: string;
    you_do_not_have_permissions_to_edit: string;
}

export enum CheckableProcess {
    reverb = "reverb",
    queue = "queue",
}

export enum StorageProcessKeys {
    reverb = "reverbFailed",
    queue = "queueFailed",
}

export interface FetchParams {
    url: string;
    type?: string;
    params?: {};
}

export interface FetchParamsSimple {
    url: string;
    type: string;
}

export interface CatchParams {
    error: any;
    title?: string;
    text?: string;
    html?: string;
    reloadOnClose?: boolean;
    footer?: string;
    from?: string;
}

export type ApiObject = Record<string, any>;
export type DataType = ApiObject | string;

export interface FetchResponse<T = DataType> {
    ok: boolean;
    success: boolean;
    message: string;
    data?: T;
}

export interface ResponseEventFetch<T = DataType> {
    processName: CheckableProcess;
    response: FetchResponse<T>;
}

export interface FetchBroadcastingResponse<T = DataType> extends FetchResponse {
    data: {
        broadcasting: FetchResponse<T>,
        [p: string]: any
    };
}

export type FetchResponseOrBroadcasting<T = DataType> = FetchResponse<T> | FetchBroadcastingResponse<T>;

export type FetchReturnType<R> = R extends FetchResponse<any> ? R : FetchResponse;

export type Nullish = null | undefined;
export type StrOrNullish = string | Nullish;
export type StrIntOrNullish = number | StrOrNullish;

export type AvailableValidations =
    'optional'
    | 'required'
    | `min:${number}`
    | `max:${number}`
    | 'color'
    | 'array'
    | 'number'
    | 'boolean'
    | `required_if:${'1' | '0'}`;

export type ValidationRules = {
    [P: string]: AvailableValidations[] | string | number | boolean | null | undefined;
};

export type ValidationResponse = {
    success: boolean;
    messages: string[];
    validated: Record<string, any>;
};

export type ValidationInternalData = {
    success: boolean[];
    messages: string[];
    validated: Record<string, any>;
};

export type SyncOrAsync<T> = T | Promise<T> | { toPromise: () => T };

export type NullHTMLButtonElement = HTMLButtonElement | null;

export type TableSettingEvents = Partial<EventCallBackMethods>;

export type TranslationReplacements = Record<string, StrOrNullish>;

export enum Theme {
    dark = "dark",
    light = "light",
    system = "system",
}

export type ThemeButtons = Record<Theme, HTMLElement | null>

export type UserPreferences = {
    version: string;
    theme: Theme;
    sidebar_collapsed: boolean;
    sidebar_state_per_page: boolean;
};

export type ViewData<T> = {
    success: boolean;
    message: string;
    data: T;
};

export type Sizes =
    '2xs' |
    'xs' |
    'sm' |
    'base' |
    'lg' |
    'lx';

export type Colors =
    'blue' |
    'dark' |
    'green' |
    'red' |
    'emerald' |
    'light' |
    'yellow' |
    'gray';

export type ConfigBtn = {
    id?: string;
    size: Sizes;
    color: Colors;
    slot?: string;
    extraClasses?: string;
    extraAttributes?: string;
    isLink?: boolean;
    linkUrl?: string;
    linkBlank?: boolean;
};

export type ConfigIcon = {
    outline?: boolean;
    strokeWidth?: string;
    size?: string;
};

export type ComponentType =
    'btn' |
    'icon';
export type IconType =
    'info' |
    'save' |
    'cancel' |
    'delete' |
    'new' |
    'reload' |
    'move' |
    'edit';
export type ComponentName =
    `btn` |
    `icon.${IconType}`;

