export type DropzoneParams = {
    /** Callback que recibe los archivos seleccionados o soltados. */
    uploadFiles: (files: FileList) => Promise<void>;
    /** Selector CSS o elemento HTML que actuará como zona de drop. */
    dropzone?: string | HTMLElement;
    /** Selector CSS o elemento input[type="file"]. */
    input?: string | HTMLInputElement;
    /** Clases CSS que se añaden al dropzone mientras se arrastra un archivo. */
    dragClasses?: string[];
    /** Callback opcional para gestionar errores del upload. */
    onError?: (error: unknown) => void;
};

export class Dropzone {
    private readonly dropzone: HTMLElement;
    private readonly fileInput: HTMLInputElement;
    private readonly dragClasses: string[];
    private readonly uploadFiles: (files: FileList) => Promise<void>;
    private readonly onError: (error: unknown) => void;

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
        if (target === undefined) throw new Error(`[Dropzone] El parámetro "${name}" es obligatorio.`);
        const el = typeof target === "string" ? document.querySelector(target) : target;
        if (!el) throw new Error(`[Dropzone] No se encontró el elemento para "${name}" con el selector: "${target}".`);
        return el;
    }

    private init(): void {
        // Abrir explorador al hacer clic en el contenedor
        this.dropzone.addEventListener("click", this.onClickHandler);

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

    /** Elimina todos los event listeners registrados por esta instancia. */
    destroy(): void {
        this.dropzone.removeEventListener("click", this.onClickHandler);

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
