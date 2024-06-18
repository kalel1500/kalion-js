export class CannotOpenModalException extends Error {
    constructor(msg: string) {
        super(msg);
        this.name = "CannotOpenModalException";
    }
}
