export type DropzoneParams = {
    /** Callback invoked with the selected or dropped files. */
    uploadFiles: (files: FileList) => Promise<void>;
    /** CSS selector or HTML element to use as the drop zone. */
    dropzone?: string | HTMLElement;
    /** CSS selector or input[type="file"] element. */
    input?: string | HTMLInputElement;
    /** CSS classes added to the dropzone while a file is being dragged over it. */
    dragClasses?: string[];
    /** Optional callback to handle upload errors. */
    onError?: (error: unknown) => void;
    /** Whether clicking the dropzone opens the file picker. */
    openPickerOnDropzoneClick?: boolean;
    /** One or more external elements/selectors that also trigger the file picker on click. */
    triggers?: string | HTMLElement | (string | HTMLElement)[];
};

export class Dropzone {
    private readonly dropzone: HTMLElement;
    private readonly fileInput: HTMLInputElement;
    private readonly dragClasses: string[];
    private readonly uploadFiles: (files: FileList) => Promise<void>;
    private readonly onError: (error: unknown) => void;
    private readonly openPickerOnDropzoneClick: boolean;
    private readonly triggers: HTMLElement[];

    private readonly onClickHandler: () => void;
    private readonly onPreventDefault: (e: Event) => void;
    private readonly onDragEnter: () => void;
    private readonly onDragLeave: () => void;
    private readonly onDrop: (e: DragEvent) => void;
    private readonly onFileChange: () => void;

    constructor(params: DropzoneParams) {
        this.dropzone = this.resolveElement(params.dropzone, "dropzone") as HTMLElement;
        this.fileInput = this.resolveElement(params.input, "input") as HTMLInputElement;
        this.dragClasses = params.dragClasses ?? [];
        this.uploadFiles = params.uploadFiles;
        this.onError = params.onError ?? ((error) => console.error("[Dropzone]", error));
        this.openPickerOnDropzoneClick = params.openPickerOnDropzoneClick ?? false;
        this.triggers = this.resolveTriggers(params.triggers);

        this.onClickHandler = () => this.fileInput.click();
        this.onPreventDefault = (e: Event) => e.preventDefault();
        this.onDragEnter = () => {
            if (this.dragClasses.length) this.dropzone.classList.add(...this.dragClasses);
        };
        this.onDragLeave = () => {
            if (this.dragClasses.length) this.dropzone.classList.remove(...this.dragClasses);
        };
        this.onDrop = (e: DragEvent) => {
            const dt = e.dataTransfer;
            if (dt && dt.files.length) {
                this.uploadFiles(dt.files).catch(this.onError);
            }
        };
        this.onFileChange = () => {
            if (this.fileInput.files && this.fileInput.files.length) {
                this.uploadFiles(this.fileInput.files).catch(this.onError);
            }
        };

        this.init();
    }

    private resolveElement(target: string | HTMLElement | HTMLInputElement | undefined, name: string): Element {
        if (target === undefined) throw new Error(`[Dropzone] The "${name}" parameter is required.`);
        const el = typeof target === "string" ? document.querySelector(target) : target;
        if (!el) throw new Error(`[Dropzone] No element found for "${name}" with selector: "${target}".`);
        return el;
    }

    private resolveTriggers(triggers: DropzoneParams["triggers"]): HTMLElement[] {
        if (!triggers) return [];
        const items = Array.isArray(triggers) ? triggers : [triggers];
        return items.map((t) => this.resolveElement(t, "triggers") as HTMLElement);
    }

    private init(): void {
        // Optional click behavior on the dropzone itself
        if (this.openPickerOnDropzoneClick) {
            this.dropzone.addEventListener("click", this.onClickHandler);
        }

        // External triggers that also open the file picker
        this.triggers.forEach((trigger) => trigger.addEventListener("click", this.onClickHandler));

        // Prevenir comportamientos por defecto del navegador
        ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
            this.dropzone.addEventListener(eventName, this.onPreventDefault, false);
        });

        // Efectos visuales al arrastrar
        ["dragenter", "dragover"].forEach((eventName) => {
            this.dropzone.addEventListener(eventName, this.onDragEnter);
        });

        ["dragleave", "drop"].forEach((eventName) => {
            this.dropzone.addEventListener(eventName, this.onDragLeave);
        });

        // Capturar archivos soltados
        this.dropzone.addEventListener("drop", this.onDrop);

        // Capturar archivos seleccionados manualmente
        this.fileInput.addEventListener("change", this.onFileChange);
    }

    /** Removes all event listeners registered by this instance. */
    destroy(): void {
        if (this.openPickerOnDropzoneClick) {
            this.dropzone.removeEventListener("click", this.onClickHandler);
        }
        this.triggers.forEach((trigger) => trigger.removeEventListener("click", this.onClickHandler));

        ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
            this.dropzone.removeEventListener(eventName, this.onPreventDefault);
        });

        ["dragenter", "dragover"].forEach((eventName) => {
            this.dropzone.removeEventListener(eventName, this.onDragEnter);
        });

        ["dragleave", "drop"].forEach((eventName) => {
            this.dropzone.removeEventListener(eventName, this.onDragLeave);
        });

        this.dropzone.removeEventListener("drop", this.onDrop);
        this.fileInput.removeEventListener("change", this.onFileChange);
    }
}
