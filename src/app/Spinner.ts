import { g } from './global';

export class Spinner {
    protected readonly $spinner: HTMLElement;
    protected readonly $spinnerBackdrop: HTMLElement;

    constructor(parent: string | HTMLElement) {
        const parentElement = g.resolveElement(parent, "parent", "Spinner") as HTMLElement;

        this.$spinner = parentElement?.querySelector('[data-is-spinner="true"]') as HTMLElement;
        this.$spinnerBackdrop = parentElement?.querySelector('[data-is-spinner-backdrop="true"]') as HTMLElement;
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
