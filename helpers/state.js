const State = {
  movies: []
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
        if(movie.id !== newMovie.id) {
          isRepeat = true;
        }
        if(movie.id === newMovie.id && isRepeat) {
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

module.exports = { State, getNewPosition, removeMovieFromState, addMovieToState, updateMovieInState }
