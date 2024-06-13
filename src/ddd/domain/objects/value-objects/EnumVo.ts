import {InvalidValueException} from "../../exceptions/InvalidValueException";
import {g} from "../../../../helpers";
import {StrOrNullish} from "../../../../_types";

export type EnumVoParams = {
    allowNull?: boolean
}

export abstract class EnumVo {
    protected _value: StrOrNullish;
    protected _allowNull: boolean;
    protected _permittedValues: string[] = [];

    constructor(value: StrOrNullish, params?: EnumVoParams) {
        this.setPermittedValues();
        this._allowNull = params?.allowNull ?? false;
        this._value = value;
        this.#ensureIsValidValue();
    }

    abstract setPermittedValues(): void

    value() {
        return this._value;
    }

    #ensureIsValidValue() {
        if (g.isNullish(this._value)) {
            if (!this._allowNull) {
                const message = "<EnumVo> no permite un valor vacio";
                throw new InvalidValueException(message);
            } else {
                return;
            }
        }

        if (typeof this._value !== "string") {
            const message = "<EnumVo> ha de ser de tipo String";
            throw new InvalidValueException(message);
        }

        if (!this._permittedValues.includes(this._value)) {
            const message = `<ActionVo> ha recibido un valor no permitido. Valores permitidos [${this._permittedValues.join(",")}]`;
            throw new InvalidValueException(message);
        }
    }

    static from<T extends EnumVo>(this: new (value: StrOrNullish, params?: EnumVoParams) => T, value: StrOrNullish, params?: EnumVoParams): T {
        return new this(value, params);
    }
}
