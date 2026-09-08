import { UserSettings } from '@/app';
import { __const } from '@/app/_internal/helpers';
import { Str } from '@/app/Str';

export class Cookie {
    protected static settingsName = () => __const('VITE_KALION_COOKIE_USER_SETTINGS_NAME') ?? Str.slug(__const('VITE_APP_NAME')) + '-user-settings';

    static get(name: string): string | null
    {
        const cookies = document.cookie.split("; ");
        const cookie = cookies.find((row) => row.startsWith(`${name}=`));
        return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
    }

    static set(name: string, value: string, days: number): void
    {
        const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
        document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
    }

    static delete(name: string): void
    {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
    }


    static userSettings(): UserSettings | null
    {
        const cookieValue = this.get(this.settingsName());
        return cookieValue ? JSON.parse(cookieValue) : null;
    }

    static setUserSettings(settings: UserSettings): void
    {
        this.set(this.settingsName(), JSON.stringify(settings), 30);

        // Otra opción es atacar al endpoint para que sea el backend el que modifique la cookie:
        /*g.fetch({
            url: route('kalion.ajax.cookie.update', {_query: {settings: serializedSettings}}),
            type: 'PUT'
        }).then();*/
    }

    static setUserSetting<K extends keyof UserSettings>(key: K, value: UserSettings[K]): void {
        const settings = this.userSettings();
        if (settings !== null) {
            settings[key] = value;
            this.setUserSettings(settings);
        }
    }
}
