export class ValidationError extends Error {
  constructor(message) {
    super(message)
    this.name = 'ValidationError'
  }
}

export const validate = <T>(a: any, converter: (a: any) => T) => {}
