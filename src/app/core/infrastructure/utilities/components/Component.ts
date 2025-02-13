import { __const } from '../_internal/helpers';
import { Btn } from './html/Btn';
import { Icon } from './html/Icon';

export class Component {
    static useBootstrap = __const('VITE_TS_USE_BOOSTRAP_CLASSES');

    static get(component: string, config: any): string {
        const [type, name] = component.split('.');
        if (type === 'btn') {
            return this.useBootstrap ? Btn.bootstrap(config) : Btn.tailwind(config);
        } else if (type === 'icon') {
            return this.useBootstrap ? Icon.bootstrap(name) : Icon.tailwind(name, config);
        }
        return '';
    }
}