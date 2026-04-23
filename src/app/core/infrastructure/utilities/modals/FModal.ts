import { Modal } from "flowbite";
import type { ModalOptions, ModalInterface, InstanceOptions } from "flowbite";

export type CreationOptions = {
    modalOptions?: ModalOptions;
    instanceOptions?: InstanceOptions;
    onConfirm?: () => boolean;
};

export default class FModal {
    static create(id: string, options?: CreationOptions): ModalInterface {
        const $modalElement: HTMLElement = document.querySelector(`#${id}`) as HTMLElement;

        const defaultModalOptions: ModalOptions = {
            placement: "center",
            backdrop: "static",
            backdropClasses: "bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-40",
            closable: true,
            onHide: () => {
                // console.log("modal is hidden");
            },
            onShow: (modal) => {
                // console.log("modal is shown");
                $modalElement.addEventListener("click", (e) => {
                    const $btnHide = (e.target as HTMLElement).closest(`[data-fmodal-cancel="${id}"]`);
                    const $btnConfirm = (e.target as HTMLElement).closest(`[data-fmodal-confirm="${id}"]`);
                    if ($btnHide) {
                        modal.hide();
                    }
                    if ($btnConfirm) {
                        if (options?.onConfirm) {
                            if (options.onConfirm()) {
                                modal.hide();
                            }
                        } else {
                            modal.hide();
                        }
                    }
                });
            },
            onToggle: () => {
                // console.log("modal has been toggled");
            },
            ...options?.modalOptions,
        };

        const defaultInstanceOptions: InstanceOptions = {
            id: id,
            override: true,
            ...options?.instanceOptions,
        };

        return new Modal($modalElement, defaultModalOptions, defaultInstanceOptions);
    }
}
