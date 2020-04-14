

/**
 * Server Base Response
 */
abstract class HttpResponse extends Error {
    constructor(m: string) {
        super(m);
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class NotFound extends HttpResponse {

}

export class Moved extends HttpResponse {
    constructor(readonly moved_to: string) {
        super('');
    }
}