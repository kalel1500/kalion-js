import InvalidValueException from "ddd/domain/exceptions/InvalidValueException";

type EnumVoTypes = string | null | undefined

export default abstract class EnumVo
{
    protected _value: EnumVoTypes
    protected _allowNull: boolean
    protected _permittedValues: string[] = []

    constructor(value: EnumVoTypes, allowNull = false)
    {
        this._allowNull = allowNull
        this.setPermittedValues()
        this.#ensureIsValidValue(value)
        this._value = value
    }

    abstract setPermittedValues(): void

    value()
    {
        return this._value
    }

    #ensureIsValidValue(value: EnumVoTypes)
    {
        if (value === null || value === undefined) {
            if (!this._allowNull) {
                const message = '<EnumVo> no permite un valor vacio'
                throw new InvalidValueException(message)
            } else {
                return
            }
        }

        if (!this._permittedValues.includes(value)) {
            const message = `<ActionVo> ha recibido un valor no permitido. Valores permitidos [${this._permittedValues.join(',')}]`
            throw new InvalidValueException(message)
        }
    }

}
