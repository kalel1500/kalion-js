import { Colors, ConfigBtn } from '../../../../_types';
import { g } from '../../general/global';

type getHtmlParams = {
    htmlId?: string;
    finalClasses: string;
    extraAttributes: string;
    slot: string;
    isLink: boolean;
    linkUrl?: string;
    linkBlank?: boolean;
};

export class Btn {
    private static getHtml({
                               htmlId,
                               finalClasses,
                               extraAttributes,
                               slot,
                               isLink = false,
                               linkUrl = '#',
                               linkBlank,
                           }: getHtmlParams)
    {
        return isLink
            ? `<a href="${linkUrl}" ${linkBlank ? 'target="_blank"' : ''} ><button class="${finalClasses}">${slot}</button></a>`
            : `<button type="button" ${htmlId} class="${finalClasses}" ${extraAttributes}>${slot}</button>`;
    }

    static tailwind({id, size = 'base', color = 'blue', slot = '', extraClasses = '', extraAttributes = '', isLink = false, linkUrl, linkBlank}: ConfigBtn): string {
        const defaultClasses = 'mb-2 rounded-lg font-medium focus:outline-none focus:ring-4';
        const sizeClasses = {
            '2xs':  'px-2 py-1   text-xs  ',
            xs:     'px-3 py-2   text-xs  ',
            sm:     'px-3 py-2   text-sm  ',
            base:   'px-5 py-2.5 text-sm  ',
            lg:     'px-5 py-3   text-base',
            lx:     'px-6 py-3.5 text-base',
        };
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
        const finalClasses = g.mergeTailwindClasses(`${defaultClasses} ${sizeClasses[size]} ${colorClasses[color]}`, extraClasses);
        const htmlId = id ? `id="${id}"` : '';
        // return `<button type="button" ${htmlId} class="${finalClasses}" ${extraAttributes}>${slot}</button>`;
        return Btn.getHtml({htmlId, finalClasses, extraAttributes, slot, isLink, linkUrl, linkBlank});
    }

    static bootstrap({id, size = 'base', color = 'blue', slot = '', extraClasses = '', extraAttributes = '', isLink = false, linkUrl, linkBlank}: ConfigBtn): string {
        const defaultClasses = 'btn';
        const sizeClasses = {
            '2xs':  'btn-xs',
            xs:     'btn-xs',
            sm:     'btn-sm',
            base:   '',
            lg:     'btn-lg',
            lx:     'btn-lg',
        };
        const colorClasses: Record<Colors, string> = {
            blue:       'btn-primary',
            dark:       'btn-dark',
            green:      'btn-success',
            red:        'btn-danger',
            emerald:    'btn-info',
            light:      'btn-light',
            yellow:     'btn-warning',
            gray:       'btn-secondary',
        };
        const finalClasses = `${defaultClasses} ${sizeClasses[size]} ${colorClasses[color]} ${extraClasses}`;
        const htmlId = id ? `id="${id}"` : '';
        // return `<button type="button" class="${finalClasses}" ${extraAttributes}>${slot}</button>`;
        return Btn.getHtml({htmlId, finalClasses, extraAttributes, slot, isLink, linkUrl, linkBlank});
    }
}