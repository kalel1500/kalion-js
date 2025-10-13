import { UserPreferences } from '../../../_types';
import { __const } from '../_internal/helpers';
import { g } from './global';

export class Cookie {
    private cookiePreferencesName: string = g.slugify(__const('VITE_APP_NAME'), '_') + '_kalion_user_preferences';

    static new()
    {
        return new Cookie();
    }

    get(name: string): string | null
    {
        const cookies = document.cookie.split("; ");
        const cookie = cookies.find((row) => row.startsWith(`${name}=`));
        return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
    }

    set(name: string, value: string, days: number): void
    {
        const expires = new Date();
        expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/`;
    }

    delete(name: string): void
    {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
    }


    preferences(): UserPreferences | null
    {
        const cookieValue = this.get(this.cookiePreferencesName);
        return cookieValue ? JSON.parse(cookieValue) : null;
    }

    setPreferences(preferences: UserPreferences): void
    {
        const serializedPreferences = encodeURIComponent(JSON.stringify(preferences));
        const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString(); // 30 días
        document.cookie = `${this.cookiePreferencesName}=${serializedPreferences}; path=/; expires=${expires}`;

        // Otra opción es atacar al endpoint para que sea el backend el que modifique la cookie:
        /*g.fetch({
            url: route('kalion.ajax.cookie.update', {_query: {preferences: serializedPreferences}}),
            type: 'PUT'
        }).then();*/
    }

    setPreference<K extends keyof UserPreferences>(key: K, value: UserPreferences[K]): void {
        const preferences = this.preferences();
        if (preferences !== null) {
            preferences[key] = value;
            this.setPreferences(preferences);
        }
    }
}
