const express = require('express');

const greetingsRouter = express.Router();

greetingsRouter.get('/', (req, res) => {
  res.send('Hello World!');
});

module.exports = greetingsRouter;
