import { Cookie, Instantiable, Theme, ThemeButtons } from '@/app';

export class ThemeSwitcher extends Instantiable
{
    private $document = document.documentElement;
    private mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    public buttons: ThemeButtons = {
        [Theme.dark]: document.getElementById('theme-dark'),
        [Theme.light]: document.getElementById('theme-light'),
        [Theme.system]: document.getElementById('theme-system'),
    };

    constructor()
    {
        super();

        // Validar que los Botones existen
        /*Object.values(this.buttons).forEach(button => {
            if (button === null) {
                throw new Error('No se ha encontrado alguno de los botones para alternar el tema oscuro.');
            }
        });*/
    }

    getTheme(): Theme
    {
        const preferences = Cookie.new().preferences();
        if (preferences === null) {
            throw new Error('No se han encontrado las preferencias en las cookies');
        }
        return preferences.theme;
    }

    init() {
        const theme = this.getTheme();
        localStorage.setItem('theme', theme);
        this.updateTheme(theme);
        this.mediaQuery.addEventListener('change', e => {
            this.getTheme() === 'system' && (e.matches ? this.setToDark(Theme.system) : this.setToLight(Theme.system));
        });
    }

    setToDark(e: Theme = Theme.dark) {
        this.$document.classList.add('dark');
        this.$document.setAttribute('data-theme', 'dark');
        this.$document.setAttribute('color-theme', e);
    }

    setToLight(e: Theme = Theme.light) {
        this.$document.classList.remove('dark');
        this.$document.setAttribute('data-theme', 'light');
        this.$document.setAttribute('color-theme', e);
    }

    updateTheme(theme: Theme) {

        // Mostrar el botón del tema recibido (y ocultar los demás)
        Object.values(this.buttons).forEach(button => button?.classList.remove('block!'));
        const themBtn = this.buttons[theme];
        themBtn?.classList.add('block!');

        switch (theme) {
            case Theme.system:
                this.mediaQuery.matches ? this.setToDark(Theme.system) : this.setToLight(Theme.system);
                break;
            case Theme.dark:
                this.setToDark();
                break;
            case Theme.light:
                this.setToLight();
                break;
        }
    }

    saveAndUpdate(theme: Theme) {
        localStorage.setItem('theme', theme);
        Cookie.new().setPreference('theme', theme);
        this.updateTheme(theme);
    }

    toDarkMode() {
        this.saveAndUpdate(Theme.dark);
    }

    toLightMode() {
        this.saveAndUpdate(Theme.light);
    }

    toSystemMode() {
        this.saveAndUpdate(Theme.system);
    }

}