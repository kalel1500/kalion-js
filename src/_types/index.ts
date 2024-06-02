import {EventCallBackMethods} from "tabulator-tables";
import Echo from "laravel-echo";

declare global {
    interface Window {
        Pusher: any;
        Echo: Echo;
    }
}

// Define una interfaz para la configuración por defecto
export interface DefaultConstants {
    token: string | null,
    lang: string,
    langDouble: string,
    defaultZoneName: string,
    appIcon: string,

    VITE_BROADCASTING_ENABLED: boolean,
    VITE_REVERB_APP_KEY: string|null,
    VITE_REVERB_HOST: string,
    VITE_REVERB_PORT: number,
    VITE_REVERB_SCHEME: string,
    VITE_APP_NAME: string
    VITE_APP_ENV: string
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
    url: string
    type: string
}

export interface CatchParams {
    error: any
    message?: string
    clearMessage?: boolean
    reloadOnClose?: boolean
    footer?: string
    from?: string
}

export interface FetchResponse {
    success: boolean
    message: string
    data?: Record<string, any> | string
    detail?: string
}

export interface ResponseEventFetch {
    response: FetchResponse
}

export interface FetchBroadcastingResponse extends FetchResponse {
    data: {
        broadcasting: FetchResponse,
        [p: string]: any
    }
}

export type FetchResponseOrBroadcasting = FetchResponse | FetchBroadcastingResponse

export type AvailableValidations = 'optional' | 'required' | `min:${number}` | `max:${number}` | 'color' | 'array' | 'number' | 'boolean' | `required_if:${'1' | '0'}`

export type ValidationRules = {
    [P: string]: AvailableValidations[] | string | number | boolean | null | undefined
}

export type ValidationResponse = {
    success: boolean,
    messages: string[],
    validated: Record<string, any>
}

export type ValidationInternalData = {
    success: boolean[],
    messages: string[],
    validated: Record<string, any>
}

export type SyncOrAsync<T> = T | Promise<T> | { toPromise: () => T }

export type NullHTMLButtonElement = HTMLButtonElement | null

export type TableSettingEvents = Partial<EventCallBackMethods>
