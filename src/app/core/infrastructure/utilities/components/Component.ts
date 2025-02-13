import { __const } from '../_internal/helpers';
import { Btn } from './html/Btn';
import { Icon } from './html/Icon';
import { ComponentName, ComponentType, ConfigBtn, ConfigIcon, IconType } from '../../../_types';

export class Component {
    static useBootstrap = __const('VITE_TS_USE_BOOSTRAP_CLASSES');

    static get<T extends ComponentName>(component: T, config?: T extends `btn` ? ConfigBtn : ConfigIcon): string {
        const [type, name] = component.split('.') as [ComponentType, string];

        if (type === 'btn') {
            return this.useBootstrap ? Btn.bootstrap(config as ConfigBtn) : Btn.tailwind(config as ConfigBtn);
        } else if (type === 'icon') {
            return this.useBootstrap ? Icon.bootstrap(name as IconType) : Icon.tailwind(name as IconType, config as ConfigIcon);
        }
        return '';
    }
}