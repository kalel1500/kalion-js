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
import type { ModalOptions, ModalInterface } from "flowbite";

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
    title?: string;
    modalOptions?: ModalOptions;
    onConfirm?: (fModal: FModal) => boolean | Promise<boolean>;
    onDeny?: (fModal: FModal) => boolean | Promise<boolean>;
    onShow?: (fModal: FModal) => void;
    onModalClick?: (fModal: FModal, target: HTMLElement) => void;
    onModalChange?: (fModal: FModal, target: HTMLElement) => void;
    showLoading?: boolean;
    divMessageId?: string;
    initFlowbiteAfterOnShow?: true | InitFlowbiteValues | InitFlowbiteValues[];
    initFlowbiteAfterOnConfirm?: true | InitFlowbiteValues | InitFlowbiteValues[];
    destroyOnHide?: boolean;
    clearInputsOnHide?: boolean;
    isLazyLoaded?: boolean;
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

export function handleFlowbiteInit(initOption?: true | InitFlowbiteValues | InitFlowbiteValues[]): void {
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
    public id: string;
    public showLoading: boolean;
    public destroyOnHide: boolean;
    public clearInputsOnHide: boolean;
    public isLazyLoaded: boolean;

    public $modalElement: HTMLElement | null;
    public $spinnerElements: NodeListOf<HTMLElement> | null;
    public $messageElements: Record<AlertType, HTMLElement | null>;

    private options: CreationOptions;
    private modalConfiguration: Pick<ModalOptions, "placement" | "backdropClasses" | "backdrop" | "closable">;

    private static registryAbortClick: Map<string, AbortController> = new Map();
    private static registryAbortChange: Map<string, AbortController> = new Map();
    private static registryInstance: Map<string, FModal> = new Map();
    private static registryByElement: WeakMap<HTMLElement, FModal> = new WeakMap();

    public constructor(id: string, options?: CreationOptions) {
        this.id = id;
        this.options = options ?? {};
        this.modalConfiguration = this.getModalConfiguration(this.options);
        this.showLoading = options?.showLoading ?? false;
        this.destroyOnHide = options?.destroyOnHide ?? false;
        this.clearInputsOnHide = options?.clearInputsOnHide ?? true;
        this.isLazyLoaded = options?.isLazyLoaded ?? false;

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

        this.modal = this.createModal();

        // Limpiar el listener anterior si existe
        this.removeListener();

        const abortControllerClick = new AbortController();
        const abortControllerChange = new AbortController();
        FModal.registryAbortClick.set(id, abortControllerClick);
        FModal.registryAbortChange.set(id, abortControllerChange);
        FModal.registryInstance.set(id, this);
        if (this.$modalElement) {
            FModal.registryByElement.set(this.$modalElement, this);
        }

        this.$modalElement?.addEventListener(
            "click",
            async (e) => {
                const target = e.target as HTMLElement;
                const $btnHide = target.closest(`[data-fmodal-cancel="${id}"]`);
                const $btnConfirm = target.closest(`[data-fmodal-confirm="${id}"]`) as HTMLButtonElement;
                const $btnDeny = target.closest(`[data-fmodal-deny="${id}"]`) as HTMLButtonElement;

                if ($btnHide) {
                    this.hide();
                }

                if ($btnConfirm || $btnDeny) {
                    const $actionBtn = $btnConfirm ? $btnConfirm : $btnDeny;
                    const currentOptions = this.options;
                    const action = $btnConfirm ? currentOptions.onConfirm : currentOptions.onDeny;
                    const actionName = $btnConfirm ? "onConfirm" : "onDeny";

                    if (!action) {
                        this.hide();
                        return;
                    }

                    this.toggleBtn("disable", $actionBtn);

                    try {
                        const shouldHide = await action(this);

                        if (actionName === "onConfirm") {
                            handleFlowbiteInit(currentOptions.initFlowbiteAfterOnConfirm);
                        }

                        if (shouldHide) {
                            this.hide();
                        }
                    } catch (error) {
                        console.error(`Error in ${actionName}: `, error);
                    } finally {
                        this.toggleBtn("enable", $actionBtn);
                    }
                }

                if (this.options.onModalClick) {
                    this.options.onModalClick(this, target);
                }
            },
            { signal: abortControllerClick.signal },
        );

        this.$modalElement?.addEventListener(
            "change",
            async (e) => {
                const target = e.target as HTMLElement;

                if (this.options.onModalChange) {
                    this.options.onModalChange(this, target);
                }
            },
            { signal: abortControllerChange.signal },
        );

    }

    public show() {
        this.modal.show();
    }

    public hide() {
        this.modal.hide();
    }

    /**
     * Replaces the options used by this instance. Structural Flowbite options
     * cause only the underlying Modal to be recreated.
     */
    public updateOptions(options: CreationOptions = {}): this {
        const nextModalConfiguration = this.getModalConfiguration(options);
        const mustRecreateModal = this.modalConfigurationChanged(nextModalConfiguration);

        this.options = options;
        this.showLoading = options.showLoading ?? false;
        this.destroyOnHide = options.destroyOnHide ?? false;
        this.clearInputsOnHide = options.clearInputsOnHide ?? true;
        this.isLazyLoaded = options.isLazyLoaded ?? false;
        this.modalConfiguration = nextModalConfiguration;

        if (mustRecreateModal) {
            const wasVisible = this.modal.isVisible();

            // Avoid running the public hide lifecycle solely because the
            // underlying Flowbite instance needs to be replaced.
            this.modal._options.onHide = () => {};
            if (wasVisible) {
                this.modal.hide();
            }
            this.modal.destroyAndRemoveInstance();
            this.removePlacementClasses();
            this.modal = this.createModal();

            if (wasVisible) {
                this.modal.show();
            }
        }

        this.restoreSpinner();
        return this;
    }

    public destroy(): void {
        FModal.destroy(this.id);
    }

    public static destroy(id: string): void {
        FModal.removeListener(id);

        const instance = FModal.registryInstance.get(id);
        if (instance) {
            // Destroy Flowbite instance
            instance.modal._options.onHide = () => {};
            if (instance.modal.isVisible()) {
                instance.modal.hide();
            }
            instance.modal.destroyAndRemoveInstance();

            // Delete Element
            const element = instance.$modalElement;
            if (element) {
                FModal.registryByElement.delete(element);
            }

            // Delete instance
            FModal.registryInstance.delete(id);
        }
    }

    public removeListener(): void {
        FModal.removeListener(this.id);
    }

    public static removeListener(id: string): void {
        const abortControllerClick = FModal.registryAbortClick.get(id);
        if (abortControllerClick) {
            abortControllerClick.abort();
            FModal.registryAbortClick.delete(id);
        }
        const abortControllerChange = FModal.registryAbortChange.get(id);
        if (abortControllerChange) {
            abortControllerChange.abort();
            FModal.registryAbortChange.delete(id);
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
        if (this.isLazyLoaded) {
            this.destroySlimSelects();
        }
    }

    public destroySlimSelects() {
        if (!this.$modalElement) return;

        // Buscar todos los selects dentro del modal
        const selects = this.$modalElement.querySelectorAll<HTMLSelectElement>("select");

        selects.forEach((selectElement) => {
            // SlimSelect almacena la instancia en la propiedad 'slim' del elemento
            const slimInstance = (selectElement as any).slim;

            if (slimInstance && typeof slimInstance.destroy === "function") {
                slimInstance.destroy();
            }
        });
    }

    public clearInputs() {
        const inputs = this.$modalElement?.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("input, textarea");
        inputs?.forEach((input) => {
            if (input.type !== "hidden") {
                input.value = "";
            }
        });
    }

    public setTitle(title: string) {
        const $titleElement = this.$modalElement?.querySelector("h3");

        if (!$titleElement) {
            console.warn(`No h3 title element found in modal ${this.id}.`);
            return;
        }

        $titleElement.textContent = title;
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
        const existing = FModal.registryInstance.get(id);
        if (existing) {
            return existing.updateOptions(options);
        }

        return new FModal(id, options);
    }

    public static get(target: string | HTMLElement): FModal | undefined {
        if (typeof target === "string") {
            return FModal.registryInstance.get(target);
        }
        return FModal.registryByElement.get(target);
    }

    public static show(id: string, options?: CreationOptions) {
        const instance = FModal.create(id, options);
        instance.show();
        return instance;
    }

    /* PRIVATE */

    private createModal(): ModalInterface {
        return new Modal(
            this.$modalElement,
            {
                ...this.modalConfiguration,
                onHide: (modal) => {
                    this.clearModal();
                    if (this.clearInputsOnHide) {
                        this.clearInputs();
                    }

                    this.options.modalOptions?.onHide?.(modal);

                    if (this.destroyOnHide) {
                        this.destroy();
                    }
                },
                onShow: (modal) => {
                    const currentOptions = this.options;

                    if (currentOptions.title !== undefined) {
                        this.setTitle(currentOptions.title);
                    }

                    if (currentOptions.onShow) {
                        currentOptions.onShow(this);
                        handleFlowbiteInit(currentOptions.initFlowbiteAfterOnShow);
                    }

                    currentOptions.modalOptions?.onShow?.(modal);
                },
                onToggle: (modal) => {
                    this.options.modalOptions?.onToggle?.(modal);
                },
            },
            {
                id: this.id,
                override: true,
            },
        );
    }

    private getModalConfiguration(options: CreationOptions): Pick<ModalOptions, "placement" | "backdropClasses" | "backdrop" | "closable"> {
        return {
            placement: options.modalOptions?.placement ?? "center",
            backdrop: options.modalOptions?.backdrop ?? "static",
            backdropClasses: options.modalOptions?.backdropClasses ?? "bg-dark-backdrop/70 fixed inset-0 z-40",
            closable: options.modalOptions?.closable ?? true,
        };
    }

    private modalConfigurationChanged(next: Pick<ModalOptions, "placement" | "backdropClasses" | "backdrop" | "closable">): boolean {
        return Object.keys(next).some((key) => {
            const option = key as keyof typeof next;
            return next[option] !== this.modalConfiguration[option];
        });
    }

    private removePlacementClasses(): void {
        this.$modalElement?.classList.remove(
            "justify-start",
            "justify-center",
            "justify-end",
            "items-start",
            "items-center",
            "items-end",
        );
    }

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
