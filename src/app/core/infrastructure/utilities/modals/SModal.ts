import Swal from 'sweetalert2/dist/sweetalert2.js';
import type { SweetAlertOptions, SweetAlertIcon, SweetAlertPosition, SweetAlertInput } from 'sweetalert2';
import { CannotOpenModalException, CannotOpenModalWarning, FetchResponse, g, HttpMethod, SyncOrAsync } from '@/app';

/** Opciones "extra" para inputModal que no pertenecen a SweetAlert */
interface InputModalExtras {
    liveValidationEnabled?:        boolean;
    getValidationMessage?:         (value: string) => string | null;
    preConfirm_url:                string;
    preConfirm_type?:              HttpMethod;
    preConfirm_params?:            Record<string, any>;
    preConfirm_inputParamName?:    string;
    preConfirm_keepOpenOnSuccess?: boolean;
    preConfirm_ajaxOkCode?:        () => void;
    // Sobreescribe los tipos de SweetAlertOptions que dependen de 'input'
    // para excluir la rama 'file' y que TS propague el narrowing correctamente
    input?:          Exclude<SweetAlertInput, 'file'>;
    inputValidator?: (value: string) => SyncOrAsync<string | false | void | null>;
}

/** Opciones "extra" para bladeModal */
interface BladeModalExtras {
    ajaxUrl: string;
    jsActionsInModal?: (p: Record<string, any>) => void;
    funcParam?: Record<string, any>;
}

/** Opciones "extra" para loadingModalAndDoAction / confirmModalAfterAjaxCheck */
interface AjaxModalExtras {
    ajaxUrl: string;
    ajaxType?: HttpMethod;
    ajaxParams?: Record<string, any>;
    footerOnFail?: string;
}

/** Opciones "extra" para updateModal */
interface UpdateModalExtras {
    hideLoading?: boolean;
}

// ─── Tipos compuestos: extras + cualquier opción de SweetAlert ────────────────

type InputModalOptions  = InputModalExtras  & SweetAlertOptions;
type BladeModalOptions  = BladeModalExtras  & SweetAlertOptions;
type AjaxModalOptions   = AjaxModalExtras   & SweetAlertOptions;
type UpdateModalOptions = UpdateModalExtras & SweetAlertOptions;

type ToastBothOptions = {
    success: boolean;
    iconOk?: SweetAlertIcon;
    iconNok?: SweetAlertIcon;
    titleOk?: string;
    titleNok?: string;
    timerOk?: number;
    timerNok?: number;
} & SweetAlertOptions;

// ─── Helper para separar extras de las opciones de SweetAlert ────────────────

function splitOptions<E extends Record<string, any>>(
    options: E & SweetAlertOptions,
    extraKeys: (keyof E)[]
): [E, SweetAlertOptions] {
    const extras = {} as E;
    const swalOptions = { ...options } as SweetAlertOptions & Partial<E>;
    for (const key of extraKeys) {
        if (key in swalOptions) {
            (extras as any)[key] = swalOptions[key];
            delete swalOptions[key];
        }
    }
    return [extras, swalOptions as SweetAlertOptions];
}

// ─────────────────────────────────────────────────────────────────────────────

const InputsValidatedOnChange = ['range', 'select', 'radio', 'checkbox', 'date', 'datetime-local', 'time', 'week', 'month'];

export class SModal {
    static colorBlue = '#3085d6';
    static colorRed  = '#d33';
    static colorGray = '#aaa';
    static isPendingLoading = false;

    // ── Guards ───────────────────────────────────────────────────────────────

    static mustAbortIfIsAlreadyOpen({ isUpdate = false, ignorePendingLoading = false } = {}): void {
        if (g.errorModalIsShowed) {
            throw new CannotOpenModalException('Se ha intentado abrir un modal cuando hay un modal de error abierto');
        }
        if (!ignorePendingLoading && !isUpdate && SModal.isPendingLoading) {
            throw new CannotOpenModalWarning('Se ha intentado abrir un modal cuando hay un modal de loading pendiente');
        }
    }

    static #checkAndExecuteShow(callback: () => Promise<any>): Promise<any> {
        try {
            return callback();
        } catch (e) {
            if (e instanceof CannotOpenModalException || e instanceof CannotOpenModalWarning) {
                g.consoleInfo((e as Error).message);
            } else {
                throw e;
            }
            return Promise.reject();
        }
    }

    static #checkAndExecuteUpdate(callback: () => void): void {
        try {
            callback();
        } catch (e) {
            if (e instanceof CannotOpenModalException || e instanceof CannotOpenModalWarning) {
                g.consoleInfo((e as Error).message);
            } else {
                throw e;
            }
        }
    }

    // ── Toast base ───────────────────────────────────────────────────────────

    static Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
        },
    });

    // ── Toasts ───────────────────────────────────────────────────────────────

    static toastInfo(options: SweetAlertOptions = {}) {
        return SModal.#checkAndExecuteShow(() => {
            SModal.mustAbortIfIsAlreadyOpen();
            return SModal.Toast.fire({
                icon: 'info',
                title: 'Your work has been saved',
                ...options,
            });
        });
    }

    static toastSuccess(options: SweetAlertOptions = {}) {
        return SModal.#checkAndExecuteShow(() => {
            SModal.mustAbortIfIsAlreadyOpen();
            return SModal.Toast.fire({
                icon: 'success',
                title: 'Your work has been saved',
                ...options,
            });
        });
    }

    static toastError(options: SweetAlertOptions = {}) {
        return SModal.#checkAndExecuteShow(() => {
            SModal.mustAbortIfIsAlreadyOpen();
            return SModal.Toast.fire({
                icon: 'error',
                title: 'Something error occurred',
                ...options,
            });
        });
    }

    static toastBottom(options: SweetAlertOptions = {}) {
        return SModal.#checkAndExecuteShow(() => {
            SModal.mustAbortIfIsAlreadyOpen();
            return SModal.Toast.fire({
                icon: 'success',
                title: 'Your work has been saved',
                position: 'bottom-end',
                ...options,
            });
        });
    }

    /**
     * Muestra un toast distinto según `success`.
     * Los campos "Ok/Nok" son los defaults; cualquier opción SweetAlert
     * del objeto los sobreescribe directamente.
     */
    static toastBoth({
                         success,
                         iconOk    = 'success',
                         iconNok   = 'error',
                         titleOk   = 'Your work has been saved',
                         titleNok  = 'Something error occurred',
                         timerOk   = 3000,
                         timerNok  = 4000,
                         ...swalOptions
                     }: ToastBothOptions) {
        return SModal.#checkAndExecuteShow(() => {
            SModal.mustAbortIfIsAlreadyOpen();
            return SModal.Toast.fire({
                icon:  success ? iconOk  : iconNok,
                title: success ? titleOk : titleNok,
                timer: success ? timerOk : timerNok,
                position: 'top-end',
                ...swalOptions,  // permite sobreescribir icon/title/timer/position/etc.
            });
        });
    }

    // ── Modales simples ──────────────────────────────────────────────────────

    static basic(options: SweetAlertOptions = {}) {
        return SModal.#checkAndExecuteShow(() => {
            SModal.mustAbortIfIsAlreadyOpen();
            return Swal.fire(options);
        });
    }

    static success(options: SweetAlertOptions = {}) {
        return SModal.#checkAndExecuteShow(() => {
            SModal.mustAbortIfIsAlreadyOpen();
            return Swal.fire({
                icon: 'success',
                title: 'Correcto',
                html: 'Todo ha ido bien',
                width: 850,
                confirmButtonText: 'Ok',
                allowOutsideClick: () => !Swal.isLoading(),
                ...options,
            });
        });
    }

    static error(options: SweetAlertOptions = {}, ignorePendingLoading = false) {
        return SModal.#checkAndExecuteShow(() => {
            SModal.mustAbortIfIsAlreadyOpen({ ignorePendingLoading });
            return Swal.fire({
                icon: 'error',
                title: 'Ups... Algo ha ido mal',
                width: 850,
                showCloseButton: true,
                confirmButtonText: 'Ok',
                allowOutsideClick: false,
                ...options,
            });
        });
    }

    static confirm(options: SweetAlertOptions = {}) {
        return SModal.#checkAndExecuteShow(() => {
            SModal.mustAbortIfIsAlreadyOpen();
            return Swal.fire({
                title: 'Confirmar',
                html: '¿Seguro que quieres realizar la acción?',
                width: 850,
                showCancelButton: true,
                confirmButtonText: 'Ok',
                cancelButtonText: 'Cancelar',
                confirmButtonColor: SModal.colorRed,
                cancelButtonColor: SModal.colorGray,
                showLoaderOnConfirm: false,
                allowOutsideClick: false,
                ...options,
            });
        });
    }

    static loading(options: SweetAlertOptions = {}) {
        return SModal.#checkAndExecuteShow(() => {
            SModal.mustAbortIfIsAlreadyOpen();
            SModal.isPendingLoading = true;

            // Si el caller pasa su propio willOpen, lo envolvemos para
            // poder seguir gestionando isPendingLoading
            const callerWillOpen = options.willOpen;
            const willOpen = async (popup: HTMLElement) => {
                if (callerWillOpen) {
                    await callerWillOpen(popup);
                } else {
                    Swal.showLoading();
                }
                SModal.isPendingLoading = false;
            };

            return Swal.fire({
                title: 'Calculando...',
                width: 850,
                showConfirmButton: false,
                allowOutsideClick: () => !Swal.isLoading(),
                ...options,
                willOpen, // siempre usamos el wrapper
            });
        });
    }

    // ── Modales con AJAX ─────────────────────────────────────────────────────

    static doActionWhileLoading({
                                       ajaxUrl,
                                       ajaxType,
                                       ajaxParams,
                                       footerOnFail,
                                       ...swalOptions
                                   }: AjaxModalOptions) {
        return SModal.#checkAndExecuteShow(() => {
            SModal.mustAbortIfIsAlreadyOpen();
            SModal.isPendingLoading = true;
            return Swal.fire({
                title: 'Calculando...',
                width: 850,
                showConfirmButton: false,
                allowOutsideClick: () => !Swal.isLoading(),
                ...swalOptions,
                // willOpen siempre se sobreescribe para mantener la lógica AJAX
                willOpen: async () => {
                    Swal.showLoading();
                    try {
                        const result = await g.fetch({ url: ajaxUrl, type: ajaxType, params: ajaxParams });
                        if (!result.success || !result.ok) {
                            SModal.updateError({ icon: 'warning', html: result.message });
                            return;
                        }
                        SModal.updateSuccess({ title: 'Correcto', html: result.message });
                    } catch (e) {
                        g.catchCode({ error: e, footer: footerOnFail });
                    }
                    SModal.isPendingLoading = false;
                },
            });
        });
    }

    static confirmAfterFetchSuccess({
                                          ajaxUrl,
                                          ajaxType = 'GET',
                                          ajaxParams,
                                          footerOnFail,
                                          ...swalOptions
                                      }: AjaxModalOptions) {
        return SModal.#checkAndExecuteShow(() => {
            SModal.mustAbortIfIsAlreadyOpen();
            return Swal.fire({
                title: 'Confirmar',
                width: 850,
                showCancelButton: true,
                confirmButtonText: 'Ok',
                cancelButtonText: 'Cancelar',
                confirmButtonColor: SModal.colorBlue,
                cancelButtonColor: SModal.colorGray,
                showLoaderOnConfirm: false,
                allowOutsideClick: () => !Swal.isLoading(),
                ...swalOptions,
                willOpen: async () => {
                    Swal.showLoading();
                    try {
                        const res = await g.fetch({ url: ajaxUrl, type: ajaxType, params: ajaxParams });
                        if (res.success && res.ok) {
                            SModal.update({ html: swalOptions.html, confirmButtonColor: SModal.colorRed });
                        } else {
                            SModal.update({
                                html: `<span class="restriction-message">${res.message}</span>`,
                                showConfirmButton: false,
                                showCancelButton: true,
                                cancelButtonText: 'Ok',
                                cancelButtonColor: SModal.colorBlue,
                            });
                        }
                    } catch (e) {
                        g.catchCode({ error: e, footer: footerOnFail });
                    }
                },
            });
        });
    }

    // ── Update modales ───────────────────────────────────────────────────────

    static update({ hideLoading, ...swalOptions }: UpdateModalOptions = {}) {
        SModal.#checkAndExecuteUpdate(() => {
            SModal.mustAbortIfIsAlreadyOpen({ isUpdate: true });
            if (hideLoading === true) Swal.hideLoading();
            Swal.update(swalOptions);
        });
    }

    static updateSuccess(options: UpdateModalOptions = {}) {
        SModal.update({
            icon: 'success',
            title: 'Éxito',
            html: 'Todo ha ido bien',
            hideLoading: true,
            showConfirmButton: true,
            ...options,
        });
    }

    static updateError(options: UpdateModalOptions = {}) {
        SModal.update({
            icon: 'error',
            title: 'Error',
            html: 'Ha habido algún error',
            hideLoading: true,
            showConfirmButton: true,
            ...options,
        });
    }

    // ── inputModal ───────────────────────────────────────────────────────────

    static input({
                          // Extras propios
                          liveValidationEnabled        = false,
                          getValidationMessage         = () => null,
                          preConfirm_url,
                          preConfirm_type              = 'GET',
                          preConfirm_params            = {},
                          preConfirm_inputParamName    = undefined,
                          preConfirm_keepOpenOnSuccess = false,
                          preConfirm_ajaxOkCode        = undefined,
                          // El resto son SweetAlert options, con sus defaults
                          ...swalOptions
                      }: InputModalOptions) {
        return SModal.#checkAndExecuteShow(() => {
            SModal.mustAbortIfIsAlreadyOpen();

            const inputId   = (swalOptions.inputAttributes?.['data-id'] as string) ?? 'inpName';
            const inputType = (swalOptions.input as string) ?? 'textarea';
            const inputPassValidation = (value: string) => getValidationMessage(value) === null;

            // willOpen con validación en vivo
            const callerDidOpen = swalOptions.didOpen;
            const didOpenWithValidation = (popup: HTMLElement) => {
                callerDidOpen?.(popup);

                const inputHtml  = popup.querySelector(`${inputType}[data-id="${inputId}"]`) as HTMLElement | null;
                const swalContent = popup.querySelector('.swal2-html-container') as Element | null;
                const confirmBtn  = popup.querySelector('.swal2-confirm') as HTMLButtonElement | null;
                if (!swalContent || !confirmBtn) return;

                // Add hidden error div
                const hiddenClass = g.getHiddenClass();
                // TODO Canals - (tailwind) pasar a componente
                swalContent.insertAdjacentHTML('afterbegin', `<div class="mySwalError alert alert-danger text-start ${hiddenClass}"></div>`);
                const newDivError = swalContent.querySelector('.mySwalError') as HTMLElement | null;
                if (!newDivError) return;

                // Add hidden success div
                if (preConfirm_keepOpenOnSuccess) {
                    // TODO Canals - (tailwind) pasar a componente
                    swalContent.insertAdjacentHTML('afterbegin', `<div class="mySwalSuccess alert alert-success text-start ${hiddenClass}"></div>`);
                }

                if (!liveValidationEnabled) return;

                // Define validator function
                const validateInputAndToggleConfirm = (e: Event | null) => {
                    const val = ((e?.target as any)?.value ?? '') as string;
                    if (!inputPassValidation(val)) {
                        newDivError.classList.remove(hiddenClass);
                        newDivError.innerText = getValidationMessage(val) as string;
                        confirmBtn.disabled = true;
                    } else {
                        newDivError.classList.add(hiddenClass);
                        confirmBtn.disabled = false;
                    }
                };

                // Start validation listeners
                const listener = InputsValidatedOnChange.includes(inputType) ? 'change' : 'keyup';
                inputHtml?.addEventListener(listener, validateInputAndToggleConfirm);
                inputHtml?.addEventListener('blur', validateInputAndToggleConfirm);

                // Launch default validation
                validateInputAndToggleConfirm(null);
            };

            // preConfirm: el caller puede sobreescribirlo pasando preConfirm en swalOptions
            const defaultPreConfirm = async (inputValue: any): Promise<FetchResponse | false> => {
                try {
                    const requestParams = { ...preConfirm_params };
                    if (preConfirm_inputParamName !== undefined) {
                        requestParams[preConfirm_inputParamName] = inputValue;
                    }
                    const result = await g.fetch({ url: preConfirm_url, type: preConfirm_type, params: requestParams });
                    if (!result.success || !result.ok) {
                        Swal.showValidationMessage(result.message);
                        return false;
                    }
                    preConfirm_ajaxOkCode?.();

                    if (preConfirm_keepOpenOnSuccess) {
                        const successDiv = Swal.getPopup()?.querySelector('.mySwalSuccess') as HTMLElement | null;
                        if (successDiv) {
                            const hiddenClass = g.getHiddenClass();
                            successDiv.classList.remove(hiddenClass);
                            successDiv.innerHTML = 'Guardado correctamente.';
                            setTimeout(() => successDiv.classList.add(hiddenClass), 2000);
                        }
                        return false;
                    }
                    return result;
                } catch (e) {
                    Swal.showValidationMessage(`Request failed: ${(e as FetchResponse).message}`);
                    return false;
                }
            };

            return Swal.fire({
                // Defaults
                title: 'Introduce los datos',
                width: 850,
                html: 'Introduce los datos',
                input: 'textarea',
                inputPlaceholder: 'Placeholder...',
                inputValue: '',
                confirmButtonText: 'Guardar',
                showCancelButton: true,
                cancelButtonText: 'Cancelar',
                showCloseButton: true,
                showLoaderOnConfirm: true,
                allowOutsideClick: () => !Swal.isLoading(),
                customClass: { container: 'swalForceWidth' },
                inputAttributes: { 'data-id': 'inpName' },
                // Spread: el caller sobreescribe lo que quiera
                ...swalOptions,
                // Estos siempre se calculan después del spread
                didOpen: (liveValidationEnabled || preConfirm_keepOpenOnSuccess || callerDidOpen)
                    ? didOpenWithValidation
                    : undefined,
                preConfirm: swalOptions.preConfirm ?? defaultPreConfirm,
                inputValidator: swalOptions.inputValidator ?? ((value) =>
                        new Promise((resolve) => resolve(
                            inputPassValidation(value) ? undefined : getValidationMessage(value) ?? undefined
                        ))
                ),
            });
        });
    }

    // ── bladeModal ───────────────────────────────────────────────────────────

    static blade({
                          ajaxUrl,
                          jsActionsInModal = () => {},
                          funcParam = {},
                          ...swalOptions
                      }: BladeModalOptions) {
        return SModal.#checkAndExecuteShow(() => {
            SModal.mustAbortIfIsAlreadyOpen();
            return Swal.fire({
                width: 850,
                showConfirmButton: false,
                showCloseButton: true,
                allowOutsideClick: () => !Swal.isLoading(),
                ...swalOptions,
                willOpen: async () => {
                    Swal.showLoading();
                    try {
                        const result: FetchResponse = await g.fetch({ url: ajaxUrl });
                        if (!result.success || !result.ok) {
                            SModal.updateError({ title: 'Ups... Algo ha ido mal', html: result.message });
                            return;
                        }
                        const html = typeof result.data === 'string' ? result.data : 'Formato blade incorrecto.';
                        SModal.update({ hideLoading: true, html });
                        jsActionsInModal(funcParam);
                    } catch (e) {
                        g.catchCode({ error: e });
                    }
                },
            });
        });
    }
}