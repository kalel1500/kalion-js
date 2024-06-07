export class CannotOpenModalWarning extends Error {
    constructor(msg: string) {
        super(msg);
        this.name = "CannotOpenModalWarning";
    }
}
