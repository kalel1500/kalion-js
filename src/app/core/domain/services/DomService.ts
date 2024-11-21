import { Instantiable } from '../../infrastructure/utilities/general/Instantiable';
import { Cookie } from '../../infrastructure';
import { UserPreferences } from '../../_types';

export class DomService extends Instantiable {
    private $document = document.documentElement;

    // Función generalizada para cambiar clases y actualizar las Cookies
    private setState(preference: keyof UserPreferences, className: string, isActive: boolean) {
        this.$document.classList.toggle(className, isActive);
        Cookie.new().setPreference(preference, isActive);
    }

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
        const setTheme = (isDark: boolean) => {
            this.setState('dark_theme', 'dark', isDark);
            themeToggleDarkIcon?.classList.toggle('hidden', isDark);
            themeToggleLightIcon?.classList.toggle('hidden', !isDark);
        };

        // Aplicar estado inicial del tema oscuro
        // const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        // this.initializeState('dark-theme', 'dark', systemPrefersDark, setTheme);

        // Evento de click para alternar el tema
        themeToggleBtn?.addEventListener('click', () => {
            const isDark = !this.$document.classList.contains('dark');
            setTheme(isDark);
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
            this.setState('sidebar_collapsed', 'sc', isCollapsed);
        });

    }
}