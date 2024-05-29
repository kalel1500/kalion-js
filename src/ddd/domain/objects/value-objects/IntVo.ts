import InvalidValueException from "ddd/domain/exceptions/InvalidValueException";

type IntVoTypes = number | string | null

export default class IntVo
{
    protected _value: IntVoTypes
    protected _allowNull: boolean

    constructor(value: IntVoTypes, allowNull = false)
    {
        this._allowNull = allowNull
        this._value = value

        this.#ensureIsValidValue()
    }

    value()
    {
        return this._value
    }

    #ensureIsValidValue()
    {
        if (typeof this._value === 'undefined') this._value = null
        if (this._allowNull && this._value === null) return

        if (typeof this._value === "string") this._value = parseInt(this._value)

        if (typeof this._value !== "number") {
            throw new InvalidValueException(`<IntVo> debe ser un entero y se ha recibido ${typeof this._value}`)
        }
    }
}
