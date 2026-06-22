
export class Spinner {
    protected readonly $spinner: HTMLElement;
    protected readonly $spinnerBackdrop: HTMLElement;

    constructor(parent: string | HTMLElement) {
        const parentElement = this.resolveElement(parent, "parent") as HTMLElement;

        this.$spinner = parentElement?.querySelector('[data-is-spinner="true"]') as HTMLElement;
        this.$spinnerBackdrop = parentElement?.querySelector('[data-is-spinner-backdrop="true"]') as HTMLElement;
    }

    private resolveElement(target: string | HTMLElement | HTMLInputElement | undefined, name: string): Element {
        if (target === undefined) throw new Error(`[Spinner] The "${name}" parameter is required.`);
        const el = typeof target === "string" ? document.querySelector(target) : target;
        if (!el) throw new Error(`[Spinner] No element found for "${name}" with selector: "${target}".`);
        return el;
    }

    public show() {
        this.$spinner?.classList.remove("hidden");
        this.$spinnerBackdrop?.classList.remove("hidden");
    }

    public hide() {
        this.$spinner?.classList.add("hidden");
        this.$spinnerBackdrop?.classList.add("hidden");
    }
}
