const express = require('express');
const { State, removeMovieFromState, addMovieToState, updateMovieInState } = require('../helpers/state');
const { ERROR_MESSAGES, HttpError } = require('../helpers/error-messages');
const { errorHandler } = require('../helpers/error-handler');
const Film = require('../helpers/film');
const { checkRequestBody } = require('../helpers/check-request-body');

const filmsRouter = express.Router();

filmsRouter.get('/readall', async (req, res) => {
  const films = State.movies;

  films.sort((a, b) => a.position - b.position);
  res.json(films)
});

filmsRouter.get('/read', async (req, res) => {
  try {
    const { id } = req.body;

    if (!id || isNaN(id)) {
      throw new HttpError(...ERROR_MESSAGES.body);
    }

    const films = State.movies;
    const film = films.find((film) => film.id === +id);

    if (!film) {
      throw new HttpError(...ERROR_MESSAGES.notFoundId);
    }
    res.json(film);
  } catch (error) {
    errorHandler(error, res);
  }
});

filmsRouter.post('/create', async (req, res) => {
  try {
    if (!checkRequestBody(req.body, 'create')) {
      throw new HttpError(...ERROR_MESSAGES.body);
    }

    const newFilm = new Film(req.body);

    addMovieToState(newFilm);
    res.status(201).json(newFilm);
  } catch (error) {
    errorHandler(error, res);
  }
});

filmsRouter.post('/update', async (req, res) => {
  try {
    const { id } = req.body;

    if (!checkRequestBody(req.body, 'update')) {
      throw new HttpError(...ERROR_MESSAGES.body);
    }

    const films = State.movies;
    const film = films.find((film) => film.id === +id);

    if (!film) {
      res.sendStatus(404).json({ error: 'Film not found' });
    }

    const updatedFilm = new Film(req.body, film);

    updateMovieInState(updatedFilm)
    res.json(updatedFilm);
  } catch (error) {
    errorHandler(error, res);
  }
});

filmsRouter.post('/delete', async (req, res) => {
  try {
    if (!checkRequestBody(req.body, 'delete')) {
      throw new HttpError(...ERROR_MESSAGES.body);
    }

    const films = State.movies;
    const film = films.find((film) => film.id === +req.body.id);

    if (!film) {
      throw new HttpError(...ERROR_MESSAGES.notFoundId);
    }

    removeMovieFromState(film.position);
    res.sendStatus(204);
  } catch (error) {
    errorHandler(error, res);
  }
});

module.exports = filmsRouter;
