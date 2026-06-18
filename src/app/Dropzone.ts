type DropzoneParams = {
    uploadFiles: (files: FileList) => Promise<void>;
    dropzone?: string | HTMLElement;
    input?: string | HTMLInputElement;
    dragClasses?: string[];
};

export class Dropzone {
    private readonly dropzone: HTMLElement;
    private readonly fileInput: HTMLInputElement;
    private readonly dragClasses: string[];
    private readonly uploadFiles: (files: FileList) => Promise<void>;

    private readonly onClickHandler: () => void;
    private readonly onPreventDefault: (e: Event) => void;
    private readonly onDragEnter: () => void;
    private readonly onDragLeave: () => void;
    private readonly onDrop: (e: DragEvent) => void;
    private readonly onFileChange: () => void;

    constructor(params: DropzoneParams) {
        this.dropzone = (typeof params.dropzone === "string" ? document.querySelector(params.dropzone) : params.dropzone) as HTMLElement;
        this.fileInput = (typeof params.input === "string" ? document.querySelector(params.input) : params.input) as HTMLInputElement;
        this.dragClasses = params.dragClasses ?? ["border-indigo-500", "bg-indigo-50/20"];
        this.uploadFiles = params.uploadFiles;

        this.onClickHandler = () => this.fileInput.click();
        this.onPreventDefault = (e: Event) => e.preventDefault();
        this.onDragEnter = () => this.dropzone.classList.add(...this.dragClasses);
        this.onDragLeave = () => this.dropzone.classList.remove(...this.dragClasses);
        this.onDrop = (e: DragEvent) => {
            const dt = e.dataTransfer;
            if (dt && dt.files.length) {
                this.uploadFiles(dt.files).then();
            }
        };
        this.onFileChange = () => {
            if (this.fileInput.files && this.fileInput.files.length) {
                this.uploadFiles(this.fileInput.files).then();
            }
        };

        this.init();
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
