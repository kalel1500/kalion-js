import {___, __const} from "../_internal/helpers";
import {SModal} from "../modals";
import * as bootstrap from "bootstrap";
import {
    CatchParams,
    FetchParams,
    FetchResponse,
    ValidationInternalData,
    ValidationResponse,
    ValidationRules,
} from "../_types";

export class g {
    static errorModalIsShowed: boolean = false;

    static isNotNull(variable: any): boolean {
        return variable !== null;
    }

    static isUndefined(variable: any): boolean {
        return typeof variable === "undefined";
    }

    static escapeHtml(html: string): string {
        return html.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll("\"", "&quot;").replaceAll("'", "&#039;");
    }

    static handleGlobalError(error?: Error) {
        if (error?.name === "CannotOpenModalException") {
            g.consoleInfo(error);
            return true;
        }

        // TODO Canals - mirgrar a Tingle para no pisar otro modal que este abierto: alert(g.escapeHtml(error?.message ?? "Formato error imprevisto"));
        SModal.errorModal({
            title: "Error imprevisto",
            html: `<span class="restriction-message">${g.escapeHtml(error?.message ?? "Formato error imprevisto")}</span>`,
            cancelButtonText: "Ok",
            footer: ___("contact_pi_team"),
        }).then(result => {
            g.errorModalIsShowed = false;
        });
        g.errorModalIsShowed = true;
        return false;
    }

    static async newFetch<T = FetchResponse>({
                                                 url,
                                                 type = "GET",
                                                 ajaxParams = undefined,
                                                 responseIsText = false,
                                                 showLog = false,
                                             }: FetchParams): Promise<T> {
        // console.info("ajaxLanzado: "+url);
        try {
            let fetchParams = {
                method: type, // *GET, POST, PUT, DELETE, etc.
                headers: {
                    "Content-Type": "application/json", // "Content-Type": "application/x-www-form-urlencoded",
                    "Accept": "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                    "X-CSRF-TOKEN": __const("token"),
                },
            } as RequestInit;
            if (type !== "GET" && ajaxParams !== undefined) {
                fetchParams.body = JSON.stringify(ajaxParams);
            }

            let response = await fetch(url, fetchParams);
            let result = (responseIsText) ? await response.text() : await response.json();
            if (showLog) console.log({result});
            if (!response.ok) {
                return Promise.reject(result);
            }
            if (result === "") {
                return Promise.reject("El servidor ha devuelto una respuesta vacia");
            }
            return result;
        } catch (e) {
            console.error("Error con fetch");
            return Promise.reject(e);
        }

    }

    static catchCode({
                         error,
                         message = undefined,
                         clearMessage = true,
                         reloadOnClose = false,
                         footer = ___("contact_pi_team"),
                         from = undefined,
                     }: CatchParams) {
        if (g.errorModalIsShowed) return;
        console.error(error);
        if (!g.isUndefined(from)) console.log("From:", from);
        let errorMessage = message ?? (error.message ?? "Error imprevisto. (Formato error inesperado)"); // (typeof error === "object" && error.hasOwnProperty("message")) ? error.message : error;
        errorMessage = (clearMessage) ? g.escapeHtml(errorMessage) : errorMessage;

        // Abrir modal
        SModal.errorModal({
            icon: "warning",
            html: `<span class="restriction-message">${errorMessage}</span>`,
            confirmButtonText: (reloadOnClose) ? ___("reload_page") : ___("ok"),
            footer: footer,
        }, true).then((result) => {
            g.errorModalIsShowed = false;
            if (reloadOnClose && result.isConfirmed) {
                location.reload();
            }
        });

        g.errorModalIsShowed = true;
    }

    static sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    static isTypeNaN(value: any) {
        return value !== value;
    }

    static isEmpty(value: any, permitValues: string | string[] = "all") {
        if ((Array.isArray(permitValues) && permitValues.includes(value)) || value === permitValues) {
            return false;
        }
        return value === "" || value === null || value === undefined || (typeof value === "string" && value.match(/^ *$/) !== null) || g.isTypeNaN(value);
    }

    static isNullOrUnd(value: any) {
        return value === null || value === undefined;
    }

    static strIsEmpty(str: string | null | undefined) {
        if (typeof str !== "string") throw new Error("La variable recibida no es un String");
        str = str.trim();
        return !Boolean(str);
    }

    static deleteArrayItemsWhere(array: any[], filterFunc: (e: any) => boolean, nameField: string) {
        let deleteItems = array.filter(filterFunc);
        deleteItems.forEach(deleteItem => array.splice(array.findIndex(item => item[nameField] === deleteItem[nameField]), 1));
        return array;
    }

    static valueFailsRequiredValidation(value: any) {
        // return (!value && value !== 0) || value.length === 0 || /^\s*$/.test(value)
        return value === null || value === undefined || (typeof value === "string" && value.trim().length === 0);
    }

    static validate(data: Record<string, any>, rules: ValidationRules): ValidationResponse {
        // creamos el objeto de respuesta
        let res: ValidationInternalData = {success: [], messages: [], validated: {}};

        // Recorremos el objeto de Reglas de valicacion
        Object.entries(rules).forEach(([key, value]) => {

            if (!Array.isArray(value)) {
                res.validated[key] = value;
                return;
            }

            // Recorremos las reglas de la validacion acual
            value.forEach(item => { // item = required, index = 0

                // Separar la regla de los parametros
                let arrayItems = item.split(":");

                // Logica segun el tipo de validacion
                switch (arrayItems[0]) {
                    case "optional":
                        if (data.hasOwnProperty(key) && data[key] !== undefined) {
                            res.validated[key] = data[key];
                        } else {
                            res.validated[key] = null;
                        }
                        break;
                    case "required":
                        if (g.valueFailsRequiredValidation(data[key])) {
                            res.success.push(false);
                            res.messages.push(`El campo "${key}" es obligatorio`);
                        } else {
                            res.validated[key] = data[key];
                        }
                        break;
                    case "min":
                        if (data[key]) {
                            if (data[key].length < parseInt(arrayItems[1])) {
                                res.success.push(false);
                                res.messages.push(`El campo "${key}" ha de tener como mínimo ${arrayItems[1]} caracteres`);
                            } else {
                                res.validated[key] = data[key];
                            }
                        }
                        break;
                    case "max":
                        if (data[key]) {
                            if (data[key].length > parseInt(arrayItems[1])) {
                                res.success.push(false);
                                res.messages.push(`El campo "${key}" ha de tener como máximo ${arrayItems[1]} caracteres`);
                            } else {
                                res.validated[key] = data[key];
                            }
                        }
                        break;
                    case "color":
                        if (data[key]) {
                            if (!data[key].match(/^(#[a-fA-F0-9]{6})$/i)) {
                                res.success.push(false);
                                res.messages.push(`El campo "${key}" ha de tener formato hexadecimal, por ejemplo, #FFCC00`);
                            } else {
                                res.validated[key] = data[key];
                            }
                        }
                        break;
                    case "array":
                        if (data[key]) {
                            if (!Array.isArray(data[key])) {
                                res.success.push(false);
                                res.messages.push(`El campo "${key}" debe ser un array`);
                            } else {
                                res.validated[key] = data[key];
                            }
                        }
                        break;
                    case "number":
                        if (data[key]) {
                            if (!Number.isInteger(parseInt(data[key]))) {
                                res.success.push(false);
                                res.messages.push(`El campo "${key}" debe ser un numero`);
                            } else {
                                res.validated[key] = data[key];
                            }
                        }
                        break;
                    case "boolean":
                        if (data[key]) {
                            if (typeof (!!data[key]) !== "boolean") {
                                res.success.push(false);
                                res.messages.push(`El campo "${key}" debe ser verdadero o falso`);
                            } else {
                                res.validated[key] = data[key];
                            }
                        }
                        break;
                    case "required_if":
                        if (arrayItems[1] === "1" && g.valueFailsRequiredValidation(data[key])) {
                            res.success.push(false);
                            res.messages.push(`El campo "${key}" es obligatorio en esta situación`);
                        } else {
                            res.validated[key] = data[key] ?? null;
                        }
                        break;
                    default:
                        res.success.push(false);
                        res.messages.push(`La validación introducida no esta controlada`);
                }
            });

        });

        return {success: (!res.success.includes(false)), messages: res.messages, validated: res.validated};
    }

    static pluck(array: any[], key: string) {
        return array.map(i => i[key]);
    }

    static strIncludesAny(str: string, values: string[]) {
        let res = false;
        values.forEach(value => {
            if (str.includes(value)) {
                res = true;
            }
        });
        return res;
    }

    static eventClosest(event: Event, selectors: string): HTMLElement | null {
        return (event?.target as HTMLElement).closest(selectors);
    }

    static showPageLoader() {
        const body = document.querySelector("body");
        body?.classList.add("overlay-body");
        body?.insertAdjacentHTML("beforeend", "<div id=\"page-loader\" class=\"overlay\"><div class=\"loader-container\"><div class=\"loader\"></div></div></div>");
    }

    static removePageLoader() {
        const body = document.querySelector("body");
        const loader = document.querySelector("#page-loader");
        body?.classList.remove("overlay-body");
        loader?.remove();
    }

    static reloadPage() {
        g.showPageLoader();
        location.reload();
    }

    static startTooltips() {
        const tooltipTriggerList = document.querySelectorAll("[data-bs-toggle=\"tooltip\"]");
        const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
    }

    static addSpinner(selectors: string | HTMLElement | NodeListOf<HTMLElement> | null, size: "sm" | "md" = "md") {
        if (selectors === null) return;

        const sizeClass = (size === "sm") ? "spinner-border-sm" : "";
        const spinnerHtml = `<div class="spinner-border ${sizeClass}" data-added-in="general" role="status"><span class="visually-hidden">Loading...</span></div>`;
        if (selectors instanceof HTMLElement) {
            selectors.insertAdjacentHTML("afterbegin", spinnerHtml);
        } else if (selectors instanceof NodeList) {
            selectors.forEach((item) => {
                item.insertAdjacentHTML("afterbegin", spinnerHtml);
            });
        } else {
            const elements = document.querySelectorAll<HTMLElement>(selectors);
            elements.forEach(item => {
                item.insertAdjacentHTML("afterbegin", spinnerHtml);
            });
        }
    }

    static removeSpinner(selectors: string | HTMLElement | NodeListOf<HTMLElement> | null) {
        if (selectors === null) return;

        if (selectors instanceof HTMLElement) {
            selectors.querySelector("[data-added-in=\"general\"]")?.remove();
        } else if (selectors instanceof NodeList) {
            selectors.forEach((item) => {
                item.querySelector("[data-added-in=\"general\"]")?.remove();
            });
        } else {
            const elements = document.querySelectorAll<HTMLElement>(selectors);
            elements.forEach(item => {
                item.querySelector("[data-added-in=\"general\"]")?.remove();
            });
        }
    }

    static consoleInfo(message?: any) {
        if (message) console.info(`%c INFO - ${message}`, "background: #222; color: #bada55; padding: 0.5rem");
    }
}
