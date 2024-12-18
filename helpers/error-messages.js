const ERROR_MESSAGES = {
  body: ['Wrong request body', 400] ,
  notFoundId: ['The movie with the specified ID was not found', 404],
}

class HttpError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

module.exports = { ERROR_MESSAGES, HttpError }
