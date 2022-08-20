/**
 * Server Base Response
 */
abstract class HttpResponseStatus extends Error {
  constructor(m: string) {
    super(m)
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

export class NotFound extends HttpResponseStatus {}

export class Moved extends HttpResponseStatus {
  constructor(readonly moved_to: string) {
    super('')
  }
}
