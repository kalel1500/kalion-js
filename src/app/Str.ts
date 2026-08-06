
type Dictionary = Record<string, string>;

export class Str {

    protected static escapeRegExp(str: string): string {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    protected static trimChar(str: string, char: string): string {
        const escaped = this.escapeRegExp(char);
        return str.replace(new RegExp(`^[${escaped}]+|[${escaped}]+$`, 'g'), '');
    }

    /**
     * Aproximación de Illuminate\Support\Str::ascii().
     * Cubre acentos/diacríticos (NFD) + algunos caracteres que NFD no descompone.
     * NO es 1:1 con la tabla de Laravel (esa cubre decenas de idiomas: cirílico,
     * griego, vietnamita, etc. con miles de entradas).
     */
    protected static toAscii(text: string): string {
        text = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

        const extraMap: Dictionary = {
            'ß': 'ss', 'œ': 'oe', 'Œ': 'OE', 'æ': 'ae', 'Æ': 'AE',
            'ø': 'o', 'Ø': 'O', 'đ': 'd', 'Đ': 'D', 'ð': 'd', 'Ð': 'D',
            'þ': 'th', 'Þ': 'Th', 'ł': 'l', 'Ł': 'L', 'ı': 'i',
        };
        return text.replace(/[ß œŒæÆøØđĐðÐþÞłŁı]/g, (c) => extraMap[c] ?? c);
    }

    static slug(
        title: string,
        separator: string = '-',
        dictionary: Dictionary = { '@': 'at' }
    ): string {
        // 1. Transliteración a ASCII (aproximada)
        title = this.toAscii(title);

        // 2. Convierte guiones/underscores "opuestos" en el separador
        const flip = separator === '-' ? '_' : '-';
        title = title.replace(new RegExp(`[${this.escapeRegExp(flip)}]+`, 'gu'), separator);

        // 3. Reemplaza palabras del diccionario (ej: @ -> -at-)
        const flippedDictionary: Dictionary = {};
        for (const [key, value] of Object.entries(dictionary)) {
            flippedDictionary[key] = `${separator}${value}${separator}`;
        }
        for (const [key, value] of Object.entries(flippedDictionary)) {
            title = title.split(key).join(value);
        }

        // 4. Minúsculas y elimina todo lo que no sea separador, letra, número o espacio
        title = title.toLowerCase();
        title = title.replace(
            new RegExp(`[^${this.escapeRegExp(separator)}\\p{L}\\p{N}\\s]+`, 'gu'),
            ''
        );

        // 5. Colapsa separadores/espacios repetidos en uno solo
        title = title.replace(
            new RegExp(`[${this.escapeRegExp(separator)}\\s]+`, 'gu'),
            separator
        );

        // 6. Trim del separador en los extremos
        return this.trimChar(title, separator);
    }
}