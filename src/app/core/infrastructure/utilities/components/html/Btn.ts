import { Colors, ConfigBtn } from '../../../../_types';
import { g } from '../../general/global';

export class Btn {
    static tailwind({id, color = 'blue', slot = '', extraClasses = '', extraAttributes = '' }: ConfigBtn): string {
        const defaultClasses = 'mb-2 rounded-lg px-5 py-2.5 text-sm font-medium focus:outline-none focus:ring-4';
        const colorClasses: Record<Colors, string> = {
            blue:   '                       bg-blue-700     text-white      hover:bg-blue-800       focus:ring-blue-300                             dark:bg-blue-600                                                dark:hover:bg-blue-700      dark:focus:ring-blue-800',
            dark:   '                       bg-gray-800     text-white      hover:bg-gray-900       focus:ring-gray-300     dark:border-gray-700    dark:bg-gray-800                                                dark:hover:bg-gray-700      dark:focus:ring-gray-700',
            green:  '                       bg-green-700    text-white      hover:bg-green-800      focus:ring-green-300                            dark:bg-green-600                                               dark:hover:bg-green-700     dark:focus:ring-green-800',
            red:    '                       bg-red-700      text-white      hover:bg-red-800        focus:ring-red-300                              dark:bg-red-600                                                 dark:hover:bg-red-700       dark:focus:ring-red-900',
            emerald: '                      bg-emerald-600  text-white      hover:bg-emerald-700    focus:ring-emerald-300                          dark:bg-emerald-500                                             dark:hover:bg-emerald-700   dark:focus:ring-emerald-900',
            light:  'border border-gray-300 bg-white        text-gray-900   hover:bg-gray-100       focus:ring-gray-100     dark:border-gray-600    dark:bg-gray-800    dark:text-white dark:hover:border-gray-600  dark:hover:bg-gray-700      dark:focus:ring-gray-700',
            yellow: '                       bg-yellow-400   text-white      hover:bg-yellow-500     focus:ring-yellow-300                                                                                                                       dark:focus:ring-yellow-900',
            gray:   '                       bg-gray-500     text-white      hover:bg-gray-600       focus:ring-gray-300                                                                                                                         dark:focus:ring-gray-900',
        };
        const finalClasses = g.mergeTailwindClasses(`${defaultClasses} ${colorClasses[color]}`, extraClasses);
        const htmlId = id ? `id="${id}"` : '';
        return `<button type="button" ${htmlId} class="${finalClasses}" ${extraAttributes}>${slot}</button>`;
    }

    static bootstrap({color = 'blue', slot = '', extraClasses = '', extraAttributes = '' }: ConfigBtn): string {
        const colorClasses: Record<Colors, string> = {
            blue:       'btn btn-primary',
            dark:       'btn btn-dark',
            green:      'btn btn-success',
            red:        'btn btn-danger',
            emerald:    'btn btn-info',
            light:      'btn btn-light',
            yellow:     'btn btn-warning',
            gray:       'btn btn-secondary',
        };
        const finalClasses = `${colorClasses[color]} ${extraClasses}`;
        return `<button type="button" class="${finalClasses}" ${extraAttributes}>${slot}</button>`;
    }
}