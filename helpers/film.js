const { State } = require('./state');

class Film {
  constructor(newFilmData, editedFilm) {
    if (editedFilm) {
      Object.assign(this, editedFilm);
    }
    if (!newFilmData.id) {
      this.id = Film.generateId();
      console.log(this.id);
    }
    Object.assign(this, newFilmData);
    if (!newFilmData.position) {
      this.position = Film.generatePosition();
      console.log(this.position);
    }
  }

  static generateId() {
    const [movie] = State.movies.toSorted((a, b) => b.id - a.id);
    console.log(movie?.id ? movie.id + 1 : 1);
    return movie?.id ? movie.id + 1 : 1;
  }

  static generatePosition() {
    const [movie] = State.movies.toSorted((a, b) => b.position - a.position);
    return movie?.position ? movie.position + 1 : 1;
  }
}

module.exports = Film
