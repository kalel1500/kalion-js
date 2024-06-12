import {InvalidValueException} from "../../exceptions/InvalidValueException";
import {g} from "../../../../helpers";

export type IntVoTypes = number | string | null
export type IntVoParams = {
    allowNull?: boolean
}

export class IntVo {
    protected _value: IntVoTypes;
    protected _allowNull: boolean;

    constructor(value: IntVoTypes, params?: IntVoParams) {
        this._allowNull = params?.allowNull ?? false;
        this._value = value;

        this.#ensureIsValidValue();
    }

    value() {
        return this._value;
    }

    #ensureIsValidValue() {
        if (this._allowNull && g.isNullish(this._value)) return;

        if (typeof this._value === "string") this._value = parseInt(this._value);

        if (typeof this._value !== "number") {
            throw new InvalidValueException(`<IntVo> debe ser un entero y se ha recibido ${typeof this._value}`);
        }
    }

    static from(value: IntVoTypes, params?: IntVoParams): IntVo {
        return new this(value, params);
    }
}
