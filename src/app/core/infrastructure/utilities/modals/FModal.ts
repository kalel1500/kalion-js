import { Modal } from "flowbite";
import type { ModalOptions, ModalInterface, InstanceOptions } from "flowbite";

export type CreationOptions = {
    modalOptions?: ModalOptions;
    instanceOptions?: InstanceOptions;
    onConfirm?: () => boolean | Promise<boolean>;
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
    public static modalId?: string;
    public static divMessageId?: string;
    public static $modalElement?: HTMLElement;

    protected static toggleBtn(action: "disable" | "enable", $btnConfirm: HTMLButtonElement) {
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

    public static create(id: string, options?: CreationOptions): ModalInterface {
        this.modalId = id;
        this.divMessageId = options?.divMessageId;
        this.$modalElement = document.querySelector(`#${id}`) as HTMLElement;

        const modal = new Modal(
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

        this.$modalElement.addEventListener("click", async (e) => {
            const target = e.target as HTMLElement;
            const $btnHide = target.closest(`[data-fmodal-cancel="${id}"]`);
            const $btnConfirm = target.closest(`[data-fmodal-confirm="${id}"]`) as HTMLButtonElement; // Casteo a HTMLButtonElement

            if ($btnHide) {
                modal.hide();
            }

            if ($btnConfirm) {
                if (!options?.onConfirm) {
                    modal.hide();
                    return;
                }

                this.toggleBtn("disable", $btnConfirm);

                try {
                    const shouldHide = await options.onConfirm();

                    if (shouldHide) {
                        modal.hide();
                    }
                } catch (error) {
                    console.error("Error en onConfirm:", error);
                } finally {
                    this.toggleBtn("enable", $btnConfirm);
                }
            }
        });

        return modal;
    }

    protected static getMessageElement(): HTMLElement | undefined {
        const $messageElement = this.divMessageId
            ? (document.querySelector(`#${this.divMessageId}`) as HTMLElement)
            : (document.querySelector(`.fmodal-message`) as HTMLElement);
        if (!$messageElement) {
            console.error(`The element to display messages could not be found.`);
            return;
        }
        return $messageElement;
    }

    public static showMessage({ message, type, autoHide = true, hideAfter = 3000 }: ShowMessageOptions) {
        const $messageElement = this.getMessageElement();
        if (!$messageElement) return;

        $messageElement.textContent = message;
        $messageElement.classList.remove("hidden", "text-green-600", "text-red-600");
        $messageElement.classList.add(type === "success" ? "text-green-600" : "text-red-600");

        if (autoHide) {
            setTimeout(() => {
                $messageElement.classList.add("hidden");
            }, hideAfter);
        }
    }

    public static hideMessage() {
        const $messageElement = this.getMessageElement();
        if (!$messageElement) return;

        $messageElement.classList.add("hidden");
    }

    public static clearModal() {
        this.hideMessage();

        const inputs = this.$modalElement?.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("input, textarea");
        inputs?.forEach((input) => {
            if (input.type !== "hidden") {
                input.value = "";
            }
        });
    }
}
