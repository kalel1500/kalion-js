import {
    Modal,
    initFlowbite,
    initAccordions,
    initCollapses,
    initCarousels,
    initDismisses,
    initDropdowns,
    initModals,
    initDrawers,
    initTabs,
    initTooltips,
    initPopovers,
    initDials,
    initInputCounters,
    initCopyClipboards,
    initDatepickers
} from "flowbite";
import type { ModalOptions, ModalInterface, InstanceOptions } from "flowbite";

type InitFlowbiteValues =
    | "initAccordions"
    | "initCollapses"
    | "initCarousels"
    | "initDismisses"
    | "initDropdowns"
    | "initModals"
    | "initDrawers"
    | "initTabs"
    | "initTooltips"
    | "initPopovers"
    | "initDials"
    | "initInputCounters"
    | "initCopyClipboards"
    | "initDatepickers";

export type CreationOptions = {
    modalOptions?: ModalOptions;
    instanceOptions?: InstanceOptions;
    onConfirm?: (fModal: FModal) => boolean | Promise<boolean>;
    onDeny?: (fModal: FModal) => boolean | Promise<boolean>;
    onShow?: (fModal: FModal) => void;
    onModalClick?: (fModal: FModal, target: HTMLElement) => void;
    showLoading?: boolean;
    divMessageId?: string;
    initFlowbiteAfterOnShow?: true | InitFlowbiteValues | InitFlowbiteValues[];
    initFlowbiteAfterOnConfirm?: true | InitFlowbiteValues | InitFlowbiteValues[];
};

export enum AlertType {
    info = "info",
    success = "success",
    error = "error",
    warning = "warning",
}

export type ShowMessageOptions = {
    message: string;
    type: AlertType;
    elementId?: string;
    autoHide?: boolean;
    hideAfter?: number;
};

const flowbiteFunctions: Record<InitFlowbiteValues, () => void> = {
    initAccordions,
    initCollapses,
    initCarousels,
    initDismisses,
    initDropdowns,
    initModals,
    initDrawers,
    initTabs,
    initTooltips,
    initPopovers,
    initDials,
    initInputCounters,
    initCopyClipboards,
    initDatepickers,
};

function handleFlowbiteInit(initOption?: true | InitFlowbiteValues | InitFlowbiteValues[]): void {
    if (!initOption) return;

    if (initOption === true) {
        initFlowbite();
    } else if (Array.isArray(initOption)) {
        initOption.forEach((componentName) => {
            const fn = flowbiteFunctions[componentName];
            if (fn) fn();
        });
    } else {
        const fn = flowbiteFunctions[initOption];
        if (fn) fn();
    }
}

export class FModal {
    public modal: ModalInterface;
    public showLoading: boolean;
    public $modalElement: HTMLElement | null;
    public $spinnerElements: NodeListOf<HTMLElement> | null;
    public $messageElements: Record<AlertType, HTMLElement | null>;

    private static registry: Map<string, AbortController> = new Map();

    public constructor(id: string, options?: CreationOptions) {
        this.showLoading = options?.showLoading ?? false;
        this.$modalElement = document.querySelector(`#${id}`);
        this.$spinnerElements = this.$modalElement?.querySelectorAll<HTMLElement>(`.fmodal-spinner`) ?? null;
        this.$messageElements = {
            info: this.$modalElement?.querySelector(`.fmodal-message-${AlertType.info}`) ?? null,
            success: this.$modalElement?.querySelector(`.fmodal-message-${AlertType.success}`) ?? null,
            error: this.$modalElement?.querySelector(`.fmodal-message-${AlertType.error}`) ?? null,
            warning: this.$modalElement?.querySelector(`.fmodal-message-${AlertType.warning}`) ?? null,
        };

        if (!this.$modalElement) {
            console.warn(`Modal with id ${id} does not exist`);
        }

        Object.entries(this.$messageElements).forEach(([key, el]) => {
            if (!el) {
                console.error(`The element to display ${key} messages could not be found on modal.`);
            }
        });

        if (this.showLoading) {
            this.showSpinner();
        }

        this.modal = new Modal(
            this.$modalElement,
            {
                placement: "center",
                backdrop: "static",
                backdropClasses: "bg-dark-backdrop/70 fixed inset-0 z-40", // "bg-gray-900/50 dark:bg-gray-900/80"
                closable: true,
                onHide: () => {
                    // console.log("modal is hidden");
                    this.clearModal();
                },
                onShow: (modal) => {
                    // console.log("modal is shown");
                    if (options?.onShow) {
                        options.onShow(this);

                        handleFlowbiteInit(options?.initFlowbiteAfterOnShow);
                    }
                },
                onToggle: () => {
                    // console.log("modal has been toggled");
                },
                ...options?.modalOptions,
            },
            {
                id: id,
                override: true,
                ...options?.instanceOptions,
            },
        );

        // Limpiar el listener anterior si existe
        let abortController = FModal.registry.get(id);
        if (abortController) {
            abortController.abort();
        }

        abortController = new AbortController();
        FModal.registry.set(id, abortController);

        this.$modalElement?.addEventListener(
            "click",
            async (e) => {
                const target = e.target as HTMLElement;
                const $btnHide = target.closest(`[data-fmodal-cancel="${id}"]`);
                const $btnConfirm = target.closest(`[data-fmodal-confirm="${id}"]`) as HTMLButtonElement;
                const $btnDeny = target.closest(`[data-fmodal-deny="${id}"]`) as HTMLButtonElement;

                if ($btnHide) {
                    this.modal.hide();
                }

                if ($btnConfirm || $btnDeny) {
                    const $actionBtn = $btnConfirm ? $btnConfirm : $btnDeny;
                    const action = $btnConfirm ? options?.onConfirm : options?.onDeny;
                    const actionName = $btnConfirm ? "onConfirm" : "onDeny";

                    if (!action) {
                        this.modal.hide();
                        return;
                    }

                    this.toggleBtn("disable", $actionBtn);

                    try {
                        const shouldHide = await action(this);

                        if (actionName === "onConfirm") {
                            handleFlowbiteInit(options?.initFlowbiteAfterOnConfirm);
                        }

                        if (shouldHide) {
                            this.modal.hide();
                        }
                    } catch (error) {
                        console.error(`Error in ${actionName}: `, error);
                    } finally {
                        this.toggleBtn("enable", $actionBtn);
                    }
                }

                if (options?.onModalClick) {
                    options?.onModalClick(this, target);
                }
            },
            { signal: abortController.signal },
        );

    }

    public destroy(id: string): void {
        FModal.destroy(id);
    }

    public static destroy(id: string): void {
        const abortController = FModal.registry.get(id);
        if (abortController) {
            abortController.abort();
            FModal.registry.delete(id);
        }
    }

    public showMessage({ message, type, autoHide = false, hideAfter = 3000 }: ShowMessageOptions) {
        const $msgEl = this.$messageElements[type];
        if (!$msgEl) return;

        const $slot = $msgEl.querySelector('.slot');
        if ($slot) {
            $slot.textContent = message;
        }
        $msgEl.classList.remove(..."transition-opacity duration-300 ease-out opacity-0 hidden".split(" "));
        $msgEl.classList.add("flex");

        if (autoHide) {
            setTimeout(() => {
                $msgEl.classList.remove("flex");
                $msgEl.classList.add("hidden");
            }, hideAfter);
        }
    }

    public hideMessage() {
        Object.entries(this.$messageElements).forEach(([key, el]) => {
            if (el) {
                el.classList.remove("flex");
                el.classList.add("hidden");
            }
        });
    }

    public clearModal() {
        this.restoreSpinner();
        this.hideMessage();

        const inputs = this.$modalElement?.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("input, textarea");
        inputs?.forEach((input) => {
            if (input.type !== "hidden") {
                input.value = "";
            }
        });
    }

    public hideSpinner() {
        this.$spinnerElements?.forEach(($spinner) => {
            $spinner.classList.remove('block');
            $spinner.classList.add('hidden');
        });
    }

    public showSpinner() {
        this.$spinnerElements?.forEach(($spinner) => {
            $spinner.classList.add('block');
            $spinner.classList.remove('hidden');
        });
    }

    public restoreSpinner() {
        if (this.showLoading) {
            this.showSpinner();
        } else {
            this.hideSpinner();
        }
    }

    /* STATIC */

    public static create(id: string, options?: CreationOptions) {
        const modal = new FModal(id, options);
        return modal.modal;
    }

    public static show(id: string, options?: CreationOptions) {
        FModal.create(id, options).show();
    }

    /* PRIVATE */

    private toggleBtn(action: "disable" | "enable", $btnConfirm: HTMLButtonElement) {
        const $spinner = $btnConfirm.parentElement?.parentElement?.querySelector('[data-is-spinner="true"]') as HTMLElement;
        const $spinnerBackdrop = $btnConfirm.parentElement?.parentElement?.querySelector('[data-is-spinner-backdrop="true"]') as HTMLElement;
        if (action === "disable") {
            $btnConfirm.disabled = true;
            $btnConfirm.style.opacity = "0.5";
            $btnConfirm.style.cursor = "not-allowed";
            $spinner?.classList.remove("hidden");
            $spinnerBackdrop?.classList.remove("hidden");
        }
        if (action === "enable") {
            $btnConfirm.disabled = false;
            $btnConfirm.style.opacity = "1";
            $btnConfirm.style.cursor = "pointer";
            $spinner?.classList.add("hidden");
            $spinnerBackdrop?.classList.add("hidden");
        }
    }
}
