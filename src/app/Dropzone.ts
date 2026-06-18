type params = {
    uploadFiles: (files: FileList) => Promise<void>;
    dropzone?: string | HTMLElement;
    input?: string | HTMLInputElement;
};

export function startDropzone(params: params) {
    const dropzone = (typeof params.dropzone === "string" ? document.querySelector(params.dropzone) : params.dropzone) as HTMLDivElement;
    const fileInput = (typeof params.input === "string" ? document.querySelector(params.input) : params.input) as HTMLInputElement;

    // Abrir explorador al hacer clic en el contenedor
    dropzone.addEventListener("click", () => fileInput.click());

    // Prevenir comportamientos por defecto del navegador
    ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
        dropzone.addEventListener(eventName, (e) => e.preventDefault(), false);
    });

    // Efectos visuales al arrastrar (Utilizando clases de Tailwind 4)
    ["dragenter", "dragover"].forEach((eventName) => {
        dropzone.addEventListener(eventName, () => {
            dropzone.classList.add("border-indigo-500", "bg-indigo-50/20");
        });
    });

    ["dragleave", "drop"].forEach((eventName) => {
        dropzone.addEventListener(eventName, () => {
            dropzone.classList.remove("border-indigo-500", "bg-indigo-50/20");
        });
    });

    // Capturar archivos soltados
    dropzone.addEventListener("drop", (e: DragEvent) => {
        const dt = e.dataTransfer;
        if (dt && dt.files.length) {
            params.uploadFiles(dt.files).then();
        }
    });

    // Capturar archivos seleccionados manualmente
    fileInput.addEventListener("change", () => {
        if (fileInput.files && fileInput.files.length) {
            params.uploadFiles(fileInput.files).then();
        }
    });
}
