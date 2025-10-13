import { Btn, ComponentName, ComponentType, ConfigBtn, ConfigIcon, Icon, IconType } from '@/app';
import { __const } from '@/app/core/infrastructure/utilities/_internal/helpers';

export class Component {
    static get<T extends ComponentName>(component: T, config?: T extends `btn` ? ConfigBtn : ConfigIcon): string {
        const [type, name] = component.split('.') as [ComponentType, string];
        const useBootstrap = __const('VITE_TS_USE_BOOSTRAP_CLASSES');

        if (type === 'btn') {
            return useBootstrap ? Btn.bootstrap(config as ConfigBtn) : Btn.tailwind(config as ConfigBtn);
        } else if (type === 'icon') {
            return useBootstrap ? Icon.bootstrap(name as IconType) : Icon.tailwind(name as IconType, config as ConfigIcon);
        }
        return '';
    }
}