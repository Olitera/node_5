const bcrypt = require('bcryptjs');
const { HttpError } = require('./error-messages');

const State = {
  movies: [],
  managers: [],
}

function getNewPosition(position) {
  const [movie] = State.movies.toSorted((a, b) => b.position - a.position);
  if (position > movie?.position) {
    return movie?.position + 1;
  }
  return position
}

function updateMovieInState(newMovie) {
  let isRepeat = false;

  State.movies = State.movies
    .toSorted((a, b) => a.position - b.position)
    .reduce((acc, movie) => {
      if (movie.position === newMovie.position) {
        if (movie.id !== newMovie.id) {
          isRepeat = true;
        }
        if (movie.id === newMovie.id && isRepeat) {
          return acc;
        }
        return isRepeat ? [...acc, newMovie, { ...movie, position: movie.position + 1 }] : [...acc, newMovie];
      }
      return [...acc, movie]
    }, [])
}

function removeMovieFromState(position) {
  State.movies = State.movies
    .toSorted((a, b) => a.position - b.position)
    .reduce((acc, movie) => {
      if (movie.position < position) {
        return [...acc, movie];
      } else if (movie.position > position) {
        return [...acc, { ...movie, position: movie.position - 1 }]
      }
      return acc;
    }, [])
}

function addMovieToState(newMovie) {
  if (newMovie.position > State.movies.length) {
    State.movies.push(newMovie);

    return;
  }
  State.movies = State.movies
    .toSorted((a, b) => a.position - b.position)
    .reduce((acc, movie) => {
      if (movie.position < newMovie.position) {
        return [...acc, movie];
      } else if (movie.position === newMovie.position) {
        return [...acc, newMovie, { ...movie, position: movie.position + 1 }]
      }
      return [...acc, { ...movie, position: movie.position + 1 }]
    }, [])
}

async function createManager(credentials) {
  if (State.managers.find(({ email }) => email === credentials.email)) {
    throw new HttpError('Manager with this email already exists', 409);
  }
  const salt = +process.env.BCRYPT_SALT || 4;
  const password = await bcrypt.hash(credentials.password, salt).catch(console.error);
  const id = State.managers.length === 0 ? 1 : Math.max(...State.managers.map(manager => manager.id)) + 1;
  State.managers = [...State.managers, { id, ...credentials, password }];

  return { id, email: credentials.email, super: !!credentials.super };
}

async function getManager(credentials) {
  const manager = State.managers.find(({ email }) => email === credentials.email) || null;
  if (!manager?.password) {
    throw new HttpError('Manager not found', 404);
  }
  const isPasswordValid = await bcrypt.compare(credentials.password, manager.password)

  if (!isPasswordValid) {
    throw new HttpError('Invalid password', 401);
  }
  return manager
}

function getManagerById (id) {
  return State.managers.find(({ id: managerId }) => managerId === id)
}

module.exports = {
  State,
  getNewPosition,
  removeMovieFromState,
  addMovieToState,
  updateMovieInState,
  createManager,
  getManager,
  getManagerById
}
