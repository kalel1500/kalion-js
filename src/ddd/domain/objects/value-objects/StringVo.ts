import g from "helpers/global";
import InvalidValueException from "ddd/domain/exceptions/InvalidValueException";

type StringVoTypes = string | null | undefined
type StringVoParams = {
    allowNull?: boolean
    errorMessage?: string | null
}

export default class StringVo
{
    protected _value: StringVoTypes
    protected _allowNull: boolean
    protected _errorMessage: string | null

    constructor(value: StringVoTypes, {allowNull = false, errorMessage = null}: StringVoParams = {})
    {
        this._allowNull = allowNull;
        this._errorMessage = errorMessage

        this.#ensureIsValidValue(value)
        this._value = value
    }

    value()
    {
        return this._value
    }

    #ensureIsValidValue(value: StringVoTypes)
    {
        if (this._allowNull && g.isEmpty(value)) return

        if (g.strIsEmpty(value)) {
            const message = (this._errorMessage === null) ? '<StringVo> no permite un valor vacio' : this._errorMessage
            throw new InvalidValueException(message)
        }
    }
}
