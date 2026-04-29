import { Modal } from "flowbite";
import type { ModalOptions, ModalInterface, InstanceOptions } from "flowbite";

export type CreationOptions = {
    modalOptions?: ModalOptions;
    instanceOptions?: InstanceOptions;
    onConfirm?: (fModal: FModal) => boolean | Promise<boolean>;
    onDeny?: (fModal: FModal) => boolean | Promise<boolean>;
    onShow?: (fModal: FModal) => void;
    showLoading?: boolean;
    divMessageId?: string;
};

export type ShowMessageOptions = {
    message: string;
    type: "success" | "error";
    elementId?: string;
    autoHide?: boolean;
    hideAfter?: number;
};

export default class FModal {
    public modal: ModalInterface;
    public showLoading: boolean;
    public $modalElement: HTMLElement | null;
    public $spinnerElements: NodeListOf<HTMLElement> | null;
    public $messageElement: HTMLElement | null;

    private static registry: Map<string, AbortController> = new Map();

    public constructor(id: string, options?: CreationOptions) {
        this.showLoading = options?.showLoading ?? false;
        this.$modalElement = document.querySelector(`#${id}`);
        this.$spinnerElements = this.$modalElement?.querySelectorAll<HTMLElement>(`.fmodal-spinner`) ?? null;
        this.$messageElement = options?.divMessageId
            ? (this.$modalElement?.querySelector(`#${options?.divMessageId}`) ?? null)
            : (this.$modalElement?.querySelector(`.fmodal-message`) ?? null);

        if (!this.$messageElement) {
            console.warn(`Modal with id ${id} does not exist`);
        }

        if (!this.$messageElement) {
            console.error(`The element to display messages could not be found on modal.`);
        }

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
                    const actionName = $btnConfirm ? 'onConfirm' : 'onDeny';

                    if (!action) {
                        this.modal.hide();
                        return;
                    }

                    this.toggleBtn("disable", $actionBtn);

                    try {
                        const shouldHide = await action(this);

                        if (shouldHide) {
                            this.modal.hide();
                        }
                    } catch (error) {
                        console.error(`Error in ${actionName}: `, error);
                    } finally {
                        this.toggleBtn("enable", $actionBtn);
                    }
                }
            },
            { signal: abortController.signal },
        );

    }

    public destroy(id: string): void {
        const abortController = FModal.registry.get(id);
        if (abortController) {
            abortController.abort();
            FModal.registry.delete(id);
        }
    }

    public showMessage({ message, type, autoHide = true, hideAfter = 3000 }: ShowMessageOptions) {
        if (!this.$messageElement) return;

        this.$messageElement.textContent = message;
        this.$messageElement.classList.remove("hidden", "text-green-600", "text-red-600");
        this.$messageElement.classList.add(type === "success" ? "text-green-600" : "text-red-600");

        if (autoHide) {
            setTimeout(() => {
                this.$messageElement?.classList.add("hidden");
            }, hideAfter);
        }
    }

    public hideMessage() {
        if (!this.$messageElement) return;

        this.$messageElement.classList.add("hidden");
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
