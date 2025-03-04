import { Instantiable } from '../../infrastructure/utilities/general/Instantiable';
import { Cookie } from '../../infrastructure';
import { Theme } from '../../_types';

export class DomService extends Instantiable {
    private $document = document.documentElement;

    // Comprobar y aplicar estado inicial desde localStorage
    /*private initializeState(preference: keyof UserPreferences, className: string, prefersCondition: boolean, callback: Function | null = null) {
        const savedState = Cookie.new().preferences()[preference];
        let isActive;
        // Si hay un estado guardado en localStorage, lo usamos
        if (savedState !== null) {
            isActive = savedState === 'true';
            this.setState(key, className, isActive);
        } else {
            // Si no hay estado guardado, prevalece la clase existente en el HTML
            isActive = this.$document.classList.contains(className) || prefersCondition;
        }

        this.setState(key, className, isActive);
        if (callback) callback(isActive);  // Ejecutar callback si se pasa uno
        return isActive;
    }*/

    startDarkMode() {
        // Inicialización del tema oscuro
        const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
        const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');
        const themeToggleBtn = document.getElementById('theme-toggle');

        // Función para cambiar el tema y alternar íconos
        const setTheme = (theme: Theme) => {
            const isDark = theme === 'dark';
            this.$document.classList.toggle('dark', isDark);
            Cookie.new().setPreference('theme', theme);
            themeToggleDarkIcon?.classList.toggle('hidden', isDark);
            themeToggleLightIcon?.classList.toggle('hidden', !isDark);
        };

        // Aplicar estado inicial del tema oscuro
        // const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        // this.initializeState('dark-theme', 'dark', systemPrefersDark, setTheme);

        // Evento de click para alternar el tema
        themeToggleBtn?.addEventListener('click', () => {
            const isDark = !this.$document.classList.contains('dark');
            setTheme(isDark ? Theme.dark : Theme.light);
        });

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