import {EventCallBackMethods} from "tabulator-tables";
import Echo from "laravel-echo";
import {Translation} from "../translation";

declare global {
    interface Window {
        Pusher: any;
        Echo: Echo;
    }
}

// Define una interfaz para la configuración por defecto
export interface DefaultConstants {
    token: string | null;
    lang: string;
    langDouble: string;
    defaultZoneName: string;
    appIcon: string;
    routeName_websockets_checkService: string;
    routeName_queues_checkService: string;

    VITE_BROADCASTING_ENABLED: boolean;
    VITE_REVERB_APP_KEY: string | null;
    VITE_REVERB_HOST: string;
    VITE_REVERB_PORT: number;
    VITE_REVERB_SCHEME: string;
    VITE_APP_NAME: string;
    VITE_APP_ENV: string;
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
    contact_pi_team: string;
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

export interface FetchParams {
    url: string;
    type?: string;
    ajaxParams?: {};
    responseIsText?: boolean;
    showLog?: boolean;
    // finallyCallback?(): void;
    // finallyParams?: {};
}

export interface FetchParamsSimple {
    url: string;
    type: string;
}

export interface CatchParams {
    error: any;
    message?: string;
    clearMessage?: boolean;
    reloadOnClose?: boolean;
    footer?: string;
    from?: string;
}

export interface FetchResponse {
    success: boolean;
    message: string;
    data?: Record<string, any> | string;
    detail?: string;
}

export interface ResponseEventFetch {
    response: FetchResponse;
}

export interface FetchBroadcastingResponse extends FetchResponse {
    data: {
        broadcasting: FetchResponse,
        [p: string]: any
    };
}

export type Nullish = null | undefined;
export type StrOrNullish = string | Nullish;
export type StrIntOrNullish = number | StrOrNullish;

export type FetchResponseOrBroadcasting = FetchResponse | FetchBroadcastingResponse;

export type AvailableValidations =
    "optional"
    | "required"
    | `min:${number}`
    | `max:${number}`
    | "color"
    | "array"
    | "number"
    | "boolean"
    | `required_if:${"1" | "0"}`;

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