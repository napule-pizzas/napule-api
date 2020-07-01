class BaseError extends Error {
  constructor(err, params) {
    super(err);

    this.code = err.code;
    this.msg = err.msg;
    this.status = err.status;
    this.params = params;
  }

  toObject() {
    let data = {
      success: false,
      code: this.code,
      msg: this.msg
    };
    Object.assign(data, this.params);
    return data;
  }
}

class ApiError extends BaseError {
  constructor(type, params) {
    const errors = {
      BAD_REQUEST: { status: 400, code: 10, msg: 'invalid_data' },
      INVALID_JSON: { status: 400, code: 11, msg: 'invalid_json' }
    };
    const err = errors[type] || errors.BAD_REQUEST;
    super(err, params);
  }
}

module.exports = {
  BaseError,
  ApiError
};
