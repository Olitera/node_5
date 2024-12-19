const { HttpError } = require('./error-messages');

function errorHandler(error, res) {
  if (error instanceof HttpError) {
    res.status(error.status).json({ error: error.message });
  } else {
    res.status(500).json({ error: 'Something went wrong' });
  }
}

module.exports = { errorHandler }
