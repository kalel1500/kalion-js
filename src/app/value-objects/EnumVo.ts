import { InvalidValueException, StrIntOrNullish } from '@/app';

type EnumVoConstructor<T extends StrIntOrNullish> = {
    new (value: T): EnumVo<T>;
    _permittedValues: readonly T[];
};

export abstract class EnumVo<T extends StrIntOrNullish> {
    public value: T;

    constructor(value: T) {
        this.value = value;
        this.ensureIsValidValue();
    }

    private ensureIsValidValue() {
        const ctor = this.constructor as EnumVoConstructor<T>;

        if (!ctor._permittedValues.includes(this.value)) {
            const message = `<EnumVo> ha recibido un valor no permitido. Valores permitidos [${ctor._permittedValues.join(',')}]`;
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
