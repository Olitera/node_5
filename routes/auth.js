const express = require('express');
const { errorHandler } = require('../helpers/error-handler');
const { createManager, getManager } = require('../helpers/state');
const { sign } = require('jsonwebtoken');
const { HttpError } = require('../helpers/error-messages');

const authRouter = express.Router();

authRouter.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const manager =  await createManager({ email, password });

    res.status(201).json(manager);
  } catch (error) {
    errorHandler(error, res);
  }
})

authRouter.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const manager = await getManager({email, password});

      if (!manager) {
        throw new HttpError('Invalid credentials', 401);
      }
      const token = await sign({  userId: manager.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
      res.status(201).json({ token });
    } catch (error) {
      errorHandler(error, res);
    }
  }
)


module.exports = authRouter
