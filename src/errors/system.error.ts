class SystemError extends Error {
  constructor(
    private _code: number,
    public message: string,
    private _errors?: unknown[],
  ) {
    super(message);
    this.message = message || 'An error occurred';
    this._code = _code || 500;
    this._errors = _errors || [];
    Object.setPrototypeOf(this, SystemError.prototype);
  }

  get code(): number {
    return this._code;
  }

  get errors(): unknown[] | undefined {
    return this._errors;
  }
}

export default SystemError;
