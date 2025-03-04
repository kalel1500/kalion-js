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
        const btnThemeDark = document.getElementById('theme-dark');
        const btnThemeLight = document.getElementById('theme-light');
        const btnThemeSystem = document.getElementById('theme-system');

        if (
            btnThemeDark === null ||
            btnThemeLight === null ||
            btnThemeSystem === null
        ) {
            throw new Error('No se ha encontrado alguno de los botones para alternar el tema oscuro.');
        }

        // Función eliminar todas las clases
        const removeAllClases = () => {
            this.$document.classList.remove(Theme.dark);
            this.$document.classList.remove(Theme.light);
            this.$document.classList.remove(Theme.system);
        };
        const hideAllBtns = () => {
            btnThemeDark.classList.remove('block!');
            btnThemeLight.classList.remove('block!');
            btnThemeSystem.classList.remove('block!');
        };
        const getBtnToShow = (theme: Theme) => {
            const buttons = {
                [Theme.dark]: btnThemeLight,
                [Theme.light]: btnThemeSystem,
                [Theme.system]: btnThemeDark,
            };
            return buttons[theme];
        };

        // Función para cambiar el tema y alternar íconos
        const setTheme = (theme: Theme) => {
            removeAllClases();
            hideAllBtns();
            Cookie.new().setPreference('theme', theme);
            getBtnToShow(theme).classList.add('block!');
            if (theme === 'dark') {
                this.$document.classList.add('dark');
            } else {
                this.$document.classList.remove('dark');
            }
        };

        // Aplicar estado inicial del tema oscuro
        // const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        // this.initializeState('dark-theme', 'dark', systemPrefersDark, setTheme);

        // Eventos de click para alternar el tema
        btnThemeDark.addEventListener('click', () => setTheme(Theme.dark));
        btnThemeLight.addEventListener('click', () => setTheme(Theme.light));
        btnThemeSystem.addEventListener('click', () => setTheme(Theme.system));
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