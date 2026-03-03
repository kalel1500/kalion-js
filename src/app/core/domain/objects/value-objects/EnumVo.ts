import { InvalidValueException, StrIntOrNullish } from '@/app';

export abstract class EnumVo<T extends StrIntOrNullish> {
    public value: T;
    protected abstract _permittedValues: T[];

    constructor(value: T) {
        this.value = value;
        this.#ensureIsValidValue();
    }

    #ensureIsValidValue() {
        if (!this._permittedValues.includes(this.value)) {
            const message = `<EnumVo> ha recibido un valor no permitido. Valores permitidos [${this._permittedValues.join(',')}]`;
            throw new InvalidValueException(message);
        }
    }

    static from<V extends StrIntOrNullish, U extends EnumVo<V>>(
        this: new (value: V) => U,
        value: V
    ): U {
        return new this(value);
    }
}
