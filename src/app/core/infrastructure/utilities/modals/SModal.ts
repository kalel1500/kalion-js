import Swal from 'sweetalert2/dist/sweetalert2.js';
import type { SweetAlertCustomClass, SweetAlertIcon, SweetAlertInput, SweetAlertPosition } from 'sweetalert2';
import { g } from '../general/global';
import { CannotOpenModalException, CannotOpenModalWarning } from '../../../domain';
import { FetchResponse, SyncOrAsync } from '../../../_types';

type ValueOrThunk<T> = T | (() => T)

interface BasicModalOptions {
    icon?: SweetAlertIcon;
    title?: string;
    text?: string;
    html?: string;
    width?: number | string;
    showConfirmButton?: boolean;
    confirmButtonText?: string;
    confirmButtonColor?: string;
    showCancelButton?: boolean;
    cancelButtonText?: string;
    cancelButtonColor?: string;
    showCloseButton?: boolean;
    allowOutsideClick?: ValueOrThunk<boolean> | false;
    showLoaderOnConfirm?: boolean;
    timer?: number;
    position?: SweetAlertPosition;
    willOpen?(popup: HTMLElement): void;
    didClose?(): void;
    didOpen?(popup: HTMLElement): void;
    didRender?(popup: HTMLElement): void;
    preConfirm?(inputValue: any): SyncOrAsync<any>;
    footer?: string;
    customClass?: SweetAlertCustomClass;
}

interface UpdateModalOptions extends BasicModalOptions {
    hideLoading?: boolean;
}

interface AjaxModalOptions extends BasicModalOptions {
    ajaxUrl: string;
    ajaxType?: string;
    ajaxParams?: {};
    footerOnFail?: string;
}

interface InputModalOptions extends BasicModalOptions {
    input?: Exclude<SweetAlertInput, 'file'>;
    inputValue?: string;
    inputPlaceholder?: string;
    inputOptions?: SyncOrAsync<ReadonlyMap<string, string> | Record<string, any>>;
    inputId?: string;
    getValidationMessage?(value: string): string | null;
    preConfirm_url: string;
    preConfirm_type?: string;
    preConfirm_params?: { [key: string]: string };
    preConfirm_inputParamName?: string;
    preConfirm_permitConfirm?: boolean;
    preConfirm_ajaxOkCode?(): void;
}

interface BladeModalOptions extends BasicModalOptions {
    ajaxUrl: string;
    showConfirmButton?: boolean;
    confirmButtonText?: string;
    jsActionsInModal?(p: {}): void;
    funcParam?: {};
}

interface ToastOptions {
    icon?: SweetAlertIcon;
    title?: string;
    position?: SweetAlertPosition;
    timer?: number;
}

interface ToastBothOptions {
    success: boolean;
    icon?: SweetAlertIcon;
    iconOk?: SweetAlertIcon;
    iconNok?: SweetAlertIcon;
    title?: string;
    titleOk?: string;
    titleNok?: string;
    timer?: number;
    timerOk?: number;
    timerNok?: number;
    position?: SweetAlertPosition;
}

const InputsNeedsChangeListener = ['range', 'select', 'radio', 'checkbox', 'date', 'datetime-local', 'time', 'week', 'month'];

export class SModal {
    static colorBlue = '#3085d6';
    static colorRed = '#d33';
    static colorGray = '#aaa';

    static isPendigLoading = false;

    static mustAbortIfIsAlreadyOpen({isUpdate = false, ignorePendingLoading = false}): void {
        if (g.errorModalIsShowed) {
            throw new CannotOpenModalException('Se ha intentado abrir un modal cuando hay un modal de error abierto');
        }
        if (!ignorePendingLoading && !isUpdate && SModal.isPendigLoading) {
            throw new CannotOpenModalWarning('Se ha intentado abrir un modal cuando hay un modal de loading pendiente de actualizarse');
        }
    }

    static #checkAndExecuteShow(callback: Function): Promise<any> {
        try {
            return callback();
        } catch (e) {
            if (e instanceof CannotOpenModalException || e instanceof CannotOpenModalWarning) {
                g.consoleInfo(e.message);
            } else {
                throw e;
            }
            return Promise.reject();
        }
    }

    static #checkAndExecuteUpdate(callback: Function) {
        try {
            callback();
        } catch (e) {
            if (e instanceof CannotOpenModalException || e instanceof CannotOpenModalWarning) {
                g.consoleInfo(e.message);
            } else {
                throw e;
            }
        }
    }

    static Toast = Swal.mixin({
        title: 'Your work has been saved',
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

    static toastInfo({
                         icon = 'info',
                         title = 'Your work has been saved',
                         position = 'top-end',
                         timer = 3000,
                     }: ToastOptions) {
        return SModal.#checkAndExecuteShow(() => {
            SModal.mustAbortIfIsAlreadyOpen({});
            return SModal.Toast.fire({icon, title, position, timer});
        });
    }

    static toastSuccess({
                            icon = 'success',
                            title = 'Your work has been saved',
                            position = 'top-end',
                            timer = 3000,
                        }: ToastOptions) {
        return SModal.#checkAndExecuteShow(() => {
            SModal.mustAbortIfIsAlreadyOpen({});
            return SModal.Toast.fire({icon, title, position, timer});
        });
    }

    static toastError({
                          icon = 'error',
                          title = 'Something error ocurred',
                          position = 'top-end',
                          timer = 3000,
                      }: ToastOptions) {
        return SModal.#checkAndExecuteShow(() => {
            SModal.mustAbortIfIsAlreadyOpen({});
            return SModal.Toast.fire({icon, title, position, timer});
        });
    }

    static toastBottom({
                           icon = 'success',
                           title = 'Your work has been saved',
                           position = 'bottom-end',
                           timer = 3000,
                       }: ToastOptions) {
        return SModal.#checkAndExecuteShow(() => {
            SModal.mustAbortIfIsAlreadyOpen({});
            return SModal.Toast.fire({icon, title, position, timer});
        });
    }

    static toastBoth({
                         success,
                         icon = undefined,
                         iconOk = 'success',
                         iconNok = 'error',
                         title = undefined,
                         titleOk = 'Your work has been saved',
                         titleNok = 'Something error ocurred',
                         timer = undefined,
                         timerOk = 3000,
                         timerNok = 4000,
                         position = 'top-end',
                     }: ToastBothOptions) {
        return SModal.#checkAndExecuteShow(() => {
            SModal.mustAbortIfIsAlreadyOpen({});
            icon = (icon !== undefined) ? icon : (success ? iconOk : iconNok);
            title = (title !== undefined) ? title : (success ? titleOk : titleNok);
            timer = (timer !== undefined) ? timer : (success ? timerOk : timerNok);
            return SModal.Toast.fire({icon, title, position, timer});
        });
    }

    static basic(params: BasicModalOptions) {
        return SModal.#checkAndExecuteShow(() => {
            SModal.mustAbortIfIsAlreadyOpen({});
            return Swal.fire(params);
        });
    }

    static successModal({
                            icon = 'success',
                            title = 'Correcto',
                            html = 'Todo ha ido bien',
                            width = 850,
                            confirmButtonText = 'Ok',
                            allowOutsideClick = () => !Swal.isLoading(),
                        }: BasicModalOptions) {
        return SModal.#checkAndExecuteShow(() => {
            SModal.mustAbortIfIsAlreadyOpen({});
            return Swal.fire({
                icon: icon,
                title: title,
                html: html,
                width: width,
                confirmButtonText: confirmButtonText,
                allowOutsideClick: allowOutsideClick,
            });
        });
    }

    static errorModal({
                          icon = 'error',
                          title = 'Ups...): Algo ha ido mal',
                          html = undefined,
                          width = 850,
                          confirmButtonText = 'Ok',
                          allowOutsideClick = false,
                          footer = undefined,
                      }: BasicModalOptions, ignorePendingLoading = false) {
        return SModal.#checkAndExecuteShow(() => {
            SModal.mustAbortIfIsAlreadyOpen({ignorePendingLoading});
            return Swal.fire({
                icon: icon,
                title: title,
                html: html,
                width: width,
                showCloseButton: true,
                confirmButtonText: confirmButtonText,
                allowOutsideClick: allowOutsideClick,
                footer: footer,
            });
        });
    }

    static confirmModal({
                            title = 'Confirmar',
                            html = '¿Seguro que quieres realizar la acción?',
                            width = 850,
                            confirmButtonText = 'Ok',
                            cancelButtonText = 'Cancelar',
                        }: BasicModalOptions) {
        return SModal.#checkAndExecuteShow(() => {
            SModal.mustAbortIfIsAlreadyOpen({});
            return Swal.fire({
                title: title,
                html: html,
                width: width,
                showCancelButton: true,
                confirmButtonText: confirmButtonText,
                cancelButtonText: cancelButtonText,
                confirmButtonColor: SModal.colorRed,
                cancelButtonColor: SModal.colorGray,
                showLoaderOnConfirm: false,
                allowOutsideClick: false,        // "() => !Swal.isLoading()" -> para que no se pueda cerras si esta cargando. | "false" -> para que no se pueda cerrar
            });
        });
    }

    static loadingModal({
                            title = 'Calculando...',
                            width = 850,
                            willOpen = () => Swal.showLoading(),
                        }: BasicModalOptions) {
        return SModal.#checkAndExecuteShow(() => {
            SModal.mustAbortIfIsAlreadyOpen({});
            SModal.isPendigLoading = true;
            return Swal.fire({
                title: title,
                width: width,
                showConfirmButton: false,
                willOpen: async (popup) => {
                    await willOpen(popup);
                    SModal.isPendigLoading = false;
                },
                allowOutsideClick: () => !Swal.isLoading(),
            });
        });
    }

    static loadingModalAndDoAction({
                                       title = 'Calculando...',
                                       ajaxUrl,
                                       ajaxType,
                                       ajaxParams,
                                       allowOutsideClick = () => !Swal.isLoading(),
                                       footerOnFail = undefined,
                                   }: AjaxModalOptions) {
        return SModal.#checkAndExecuteShow(() => {
            SModal.mustAbortIfIsAlreadyOpen({});
            SModal.isPendigLoading = true;
            return Swal.fire({
                title: title,
                width: 850,
                showConfirmButton: false,
                willOpen: async (popup) => {
                    Swal.showLoading();
                    try {
                        // Ajax to launch Status/Mitigation
                        const result = await g.newFetch({url: ajaxUrl, type: ajaxType, ajaxParams: ajaxParams});

                        // Check if result is wrong and update modal content
                        if (!result.success) {
                            const html = (result?.detail) ? `<div>${result.message}</div><br><small>${result.detail}</small>` : result.message;
                            SModal.updateErrorModal({icon: 'warning', html: html});
                            return;
                        }

                        // Update modal with success message
                        SModal.updateSuccessModal({title: 'Correcto', html: result.message});
                    } catch (e) {
                        g.catchCode({error: e, footer: footerOnFail});
                    }
                    SModal.isPendigLoading = false;
                },
                allowOutsideClick: allowOutsideClick,
            });
        });
    }

    static updateModal(params: UpdateModalOptions) {
        SModal.#checkAndExecuteUpdate(() => {
            SModal.mustAbortIfIsAlreadyOpen({isUpdate: true});
            if (params.hideLoading === true) {
                Swal.hideLoading();
                delete params.hideLoading;
            }
            Swal.update(params);
        });
    }

    static updateSuccessModal({
                                  icon = 'success',
                                  title = 'Exito',
                                  html = 'Todo ha ido bien',
                                  hideLoading = true,
                                  footer = undefined,
                                  allowOutsideClick = undefined,
                              }: UpdateModalOptions) {
        SModal.updateModal({
            icon: icon,
            title: title,
            html: html,
            hideLoading: hideLoading,
            footer: footer,
            allowOutsideClick: allowOutsideClick,
            showConfirmButton: true,
        });
    }

    static updateErrorModal({
                                icon = 'error',
                                title = 'Error',
                                html = 'Ha habido algun error',
                                hideLoading = true,
                                footer = undefined,
                                allowOutsideClick = undefined,
                            }: UpdateModalOptions) {
        SModal.updateModal({
            icon: icon,
            title: title,
            html: html,
            hideLoading: hideLoading,
            footer: footer,
            allowOutsideClick: allowOutsideClick,
            showConfirmButton: true,
        });
    }

    static confirmModalAfterAjaxCheck({
                                          title = 'Confirmar',
                                          html = '¿Seguro que quieres realizar la acción?',
                                          confirmButtonText = 'Ok',
                                          confirmButtonColor = SModal.colorBlue,
                                          cancelButtonText = 'Cancelar',
                                          ajaxUrl,
                                          ajaxType = 'GET',
                                          ajaxParams,
                                          footerOnFail = undefined,
                                      }: AjaxModalOptions) {
        return SModal.#checkAndExecuteShow(() => {
            SModal.mustAbortIfIsAlreadyOpen({});
            return Swal.fire({
                title: title,
                width: 850,
                showCancelButton: true,
                confirmButtonText: confirmButtonText,
                cancelButtonText: cancelButtonText,
                confirmButtonColor: confirmButtonColor,
                cancelButtonColor: SModal.colorGray,
                showLoaderOnConfirm: false,
                willOpen: async () => {
                    Swal.showLoading();
                    try {
                        const res = await g.newFetch({url: ajaxUrl, type: ajaxType, ajaxParams: ajaxParams});
                        // await Hlp.sleep(1000);
                        if (res.success) {
                            SModal.updateModal({html: html, confirmButtonColor: SModal.colorRed});
                        } else {
                            SModal.updateModal({
                                html: `<span class="restriction-message">${res.message}</span>`,
                                showConfirmButton: false,
                                showCancelButton: true,
                                cancelButtonText: 'Ok',
                                cancelButtonColor: SModal.colorBlue,
                            });
                        }
                    } catch (e) {
                        g.catchCode({
                            error: e,
                            footer: footerOnFail,
                            from: `confirmModalWithAjaxCheck->willOpen->fetch ${ajaxUrl}`,
                        });
                    }
                },
                allowOutsideClick: () => !Swal.isLoading(),        // "() => !Swal.isLoading()" -> para que no se pueda cerras si esta cargando. | "false" -> para que no se pueda cerrar
            });
        });
    }

    static #inputModalBasic({
                                title = 'Introduce los datos',
                                width = 850,
                                html = 'Introduce los datos',
                                input = 'textarea',
                                inputValue = '',
                                inputId = 'inpName',
                                inputPlaceholder = 'Placeholder...',
                                inputOptions = undefined,
                                getValidationMessage = () => null,
                                preConfirm_url,
                                preConfirm_type = 'GET',
                                preConfirm_params = {},
                                preConfirm_inputParamName = undefined,
                                preConfirm_permitConfirm = true,
                                preConfirm_ajaxOkCode = undefined,
                                confirmButtonText = 'Guardar',
                                showCancelButton = true,
                                cancelButtonText = 'Cancelar',
                                showLoaderOnConfirm = true,
                                didClose = () => {},
                                didOpen = () => {},
                            }: InputModalOptions, fixedAndAlertChanges = false) {
        return SModal.#checkAndExecuteShow(() => {
            SModal.mustAbortIfIsAlreadyOpen({});
            const inputPassValidation = (value: string) => getValidationMessage(value) === null;
            const didOpenToAlertInputChanges = (el: HTMLElement) => {
                // execute received function
                didOpen(el);

                // Get variables
                let inputHtml = el.querySelector(`${input}[data-id="${inputId}"]`);
                let swalContent = el.querySelector('.swal2-html-container') as Element;
                let confirmBtn = el.querySelector('.swal2-confirm') as HTMLButtonElement;

                // Add hidden error div
                const hiddenClass = g.getHiddenClass();
                // TODO Canals - (tailwind) pasar a componente
                swalContent.insertAdjacentHTML('afterbegin', `<div class="mySwalError alert alert-danger text-start ${hiddenClass}"></div>`);
                let newDivError = swalContent.querySelector('.mySwalError') as HTMLElement;

                // Add hidden success div
                // TODO Canals - (tailwind) pasar a componente
                swalContent.insertAdjacentHTML('afterbegin', `<div class="mySwalSuccess alert alert-success text-start ${hiddenClass}"></div>`);

                // Define validator function
                let keyUpValidationFunction = (e: any) => {
                    let val = e?.target?.value ?? '';
                    if (!inputPassValidation(val)) {
                        newDivError.classList.remove(hiddenClass);
                        newDivError.innerText = getValidationMessage(val) as string;
                        confirmBtn.disabled = true;
                    } else {
                        newDivError.classList.add(hiddenClass);
                        confirmBtn.disabled = false;
                    }
                };

                // Start keyup listener
                if (fixedAndAlertChanges) {
                    inputHtml?.addEventListener('keyup', keyUpValidationFunction);
                    inputHtml?.addEventListener('blur', keyUpValidationFunction);
                } else {
                    const listener = (InputsNeedsChangeListener.includes(input)) ? 'keyup' : 'change';
                    inputHtml?.addEventListener(listener, keyUpValidationFunction);
                }

                // Launch default validation
                keyUpValidationFunction(null);
            };
            const final_permitConfirm = fixedAndAlertChanges ? false : preConfirm_permitConfirm;
            const final_didOpen = fixedAndAlertChanges ? didOpenToAlertInputChanges : didOpen;
            return Swal.fire({
                title: title,
                width: width,
                html: html,
                input: input,
                inputPlaceholder: inputPlaceholder,
                inputValue: inputValue,
                inputOptions: inputOptions,
                inputAttributes: {
                    'data-id': inputId,
                },
                confirmButtonText: confirmButtonText,
                showCancelButton: showCancelButton,
                cancelButtonText: cancelButtonText,
                showCloseButton: true,
                showLoaderOnConfirm: showLoaderOnConfirm,
                preConfirm: async (inputValue): Promise<FetchResponse | false> => {
                    try {
                        if (preConfirm_inputParamName !== undefined) {
                            preConfirm_params[preConfirm_inputParamName] = inputValue;
                        }
                        let result = await g.newFetch({url: preConfirm_url, type: preConfirm_type, ajaxParams: preConfirm_params,});
                        if (!result.success) {
                            Swal.showValidationMessage(result.message);
                            return false;
                        }

                        if (preConfirm_ajaxOkCode !== undefined) preConfirm_ajaxOkCode();

                        if (fixedAndAlertChanges) {
                            let successDiv = document.querySelector('.mySwalSuccess');
                            if (successDiv !== null) {
                                const hiddenClass = g.getHiddenClass();
                                successDiv.classList.remove(hiddenClass);
                                successDiv.innerHTML = `Guardado correctamente.`;
                                setTimeout(() => {
                                    successDiv?.classList.add(hiddenClass);
                                }, 2000);
                            }
                        }

                        return final_permitConfirm ? result : false;
                    } catch (e) {
                        Swal.showValidationMessage(`Request failed: ${(e as FetchResponse).message}`);
                        return false;
                    }
                },
                allowOutsideClick: () => !Swal.isLoading(),
                inputValidator: (value) => {
                    return new Promise((resolve) => {
                        if (inputPassValidation(value)) {
                            resolve();
                        } else {
                            resolve(getValidationMessage(value));
                        }
                    });
                },
                didOpen: final_didOpen,
                customClass: {
                    container: 'swalForceWidth',
                },
                didClose: didClose,
            });
        });
    }

    static inputModal(params: InputModalOptions) {
        return SModal.#checkAndExecuteShow(() => {
            SModal.mustAbortIfIsAlreadyOpen({});
            return SModal.#inputModalBasic(params, false);
        });
    }

    static inputModalFixed(params: InputModalOptions) {
        return SModal.#checkAndExecuteShow(() => {
            SModal.mustAbortIfIsAlreadyOpen({});
            return SModal.#inputModalBasic(params, true);
        });
    }

    static bladeModal({
                          ajaxUrl,
                          showConfirmButton = false,
                          confirmButtonText = '',
                          jsActionsInModal = (p: {}) => {},
                          funcParam = {},
                          width = 850,
                          didClose,
                      }: BladeModalOptions) {
        return SModal.#checkAndExecuteShow(() => {
            SModal.mustAbortIfIsAlreadyOpen({});
            return Swal.fire({
                width: width,
                showConfirmButton: showConfirmButton,
                confirmButtonText: confirmButtonText,
                showCloseButton: true,
                willOpen: async () => {
                    Swal.showLoading();
                    try {
                        const result: FetchResponse = await g.newFetch({url: ajaxUrl});
                        if (!result.success) {
                            SModal.updateErrorModal({title: 'Ups...): Algo ha ido mal', html: result.message});
                            return;
                        }
                        const html = (typeof result.data === 'string') ? result.data : 'Formato blade incorrecto.';
                        SModal.updateModal({hideLoading: true, html: html});
                        if (jsActionsInModal) jsActionsInModal(funcParam);
                    } catch (e) {
                        g.catchCode({error: e});
                    }
                },
                allowOutsideClick: () => !Swal.isLoading(),
                didClose: didClose,
            });
        });
    }
}
