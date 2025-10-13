import { Cookie, Instantiable, Theme, ThemeSwitcher } from '@/app';

export class DomService extends Instantiable {
    private $document = document.documentElement;

    startDarkMode() {

        const themeSwitcher = ThemeSwitcher.new();

        // Aplicar estado inicial del tema oscuro
        themeSwitcher.init();

        // Eventos de click para alternar el tema
        for (const [key, button] of Object.entries(themeSwitcher.buttons) as [Theme, HTMLElement | null][]) {
            button?.addEventListener('click', () => {
                switch (key) {
                    case Theme.dark:
                        themeSwitcher.toLightMode();
                        break;
                    case Theme.light:
                        themeSwitcher.toSystemMode();
                        break;
                    case Theme.system:
                        themeSwitcher.toDarkMode();
                        break;
                }
            });
        }
    }

    startSidebarState() {
        /*// Clave personalizada para almacenar el estado del sidebar según la ruta actual
        const getSidebarKey = (routeName: string | undefined) => `sidebar-collapsed-${routeName}`;*/

        // Inicialización del estado del sidebar
        const sidebarToggleBtn = document.getElementById('sidebar-toggle');

        /*// Obtener el nombre de la ruta actual usando Ziggy
        const currentRoute = route().current();

        // Aplicar estado inicial del sidebar para la ruta actual
        const sidebarKey = getSidebarKey(currentRoute);
        this.initializeState(sidebarKey, 'sc', false);*/

        // Evento de click para alternar el estado del sidebar
        sidebarToggleBtn?.addEventListener('click', () => {
            const isCollapsed = !this.$document.classList.contains('sc');
            this.$document.classList.toggle('sc', isCollapsed);
            Cookie.new().setPreference('sidebar_collapsed', isCollapsed);
        });

    }

    startSidebarArrowsObserve()
    {
        const targetNode = document.getElementById("drawer-navigation")?.firstElementChild as HTMLElement | null | undefined;

        if (!targetNode) return;

        // Create an observer instance linked to the callback function
        const observer = new MutationObserver((mutationList, observer) => {
            for (const mutation of mutationList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'aria-expanded') {
                    const $button = mutation.target as HTMLElement;
                    const $arrow = $button.querySelector('svg.chevron-down');
                    if ($arrow !== null) {
                        const isExpanded = $button.getAttribute('aria-expanded') === 'true';
                        if (isExpanded) {
                            $arrow.classList.add('-rotate-90');
                        } else {
                            $arrow.classList.remove('-rotate-90');
                        }
                    }
                }
            }
        });

        // Start observing the target node for configured mutations
        observer.observe(targetNode, { attributes: true, subtree: true });
    }
}