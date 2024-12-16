type MutationParams = {
    elementId: string;
    class: string;
    whenHave: () => void;
    whenHavent: () => void;
}

export class Mutation {
    static observeClass(params: MutationParams) {
        let isDrawerOpen: null | boolean = null;
        const element = document.getElementById(params.elementId);

        if (element === null) return;

        // Crear un MutationObserver para observar los cambios de atributos
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    const drawerClosed = element.classList.contains(params.class);

                    if (drawerClosed && isDrawerOpen !== false) {
                        params.whenHave();
                        isDrawerOpen = false;
                    } else if (!drawerClosed && isDrawerOpen !== true) {
                        params.whenHavent();
                        isDrawerOpen = true;
                    }
                }
            });
        });

        // Configurar el observer para observar cambios en los atributos
        observer.observe(element, {attributes: true});
    }

    static observe(targetNode: HTMLElement, options: MutationObserverInit, mutationCallback: () => {})
    {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutationCallback);
        });

        // Configurar el observer para observar cambios en los atributos
        observer.observe(targetNode, {attributes: true});
    }
}
