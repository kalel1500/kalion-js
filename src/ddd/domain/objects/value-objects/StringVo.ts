import {g} from "../../../../helpers";
import {InvalidValueException} from "../../exceptions/InvalidValueException";
import {StrOrNullish} from "../../../../_types";

export type StringVoParams = {
    allowNull?: boolean
    errorMessage?: string | null
}

export class StringVo {
    protected _value: StrOrNullish;
    protected _allowNull: boolean;
    protected _errorMessage: string | null;

    constructor(value: StrOrNullish, params?: StringVoParams) {
        this._allowNull = params?.allowNull ?? false;
        this._errorMessage = params?.errorMessage ?? null;
        this._value = value;

        this.#ensureIsValidValue();
    }

    value() {
        return this._value;
    }

    #ensureIsValidValue() {
        if (!this._allowNull) {
            if (typeof this._value !== "string") {
                const message = "<StringVo> ha de ser de tipo String";
                throw new InvalidValueException(message);
            }

            if (g.isEmpty(this._value)) {
                const message = (this._errorMessage === null) ? "<StringVo> no permite un valor vacio" : this._errorMessage;
                throw new InvalidValueException(message);
            }
        }
    }

    static from(value: StrOrNullish, params?: StringVoParams): StringVo {
        return new this(value, params);
    }
}
