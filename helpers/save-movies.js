const fs = require('fs').promises;
const getMoviesFromApi = require('./prefetch-data');

const saveMoviesToJson = async (movies) => {
  try {
    const jsonData = JSON.stringify(movies, null, 2);

    await fs.writeFile('top250.json', jsonData);
    console.log('Films saved to films.json');
  } catch (error) {
    console.error('Error saving movies to JSON file:', error);
  }
};

const transformMovieData = (movie, position) => {
  return {
    id: movie.id,
    title: movie.alternativeName || movie.name,
    rating: movie.rating?.kp ? movie.rating.kp.toString() : null,
    year: movie?.year,
    budget: movie.budget?.value,
    gross: movie.fees?.world?.value,
    poster: movie.poster?.url,
    position: position
  };
};

const fetchAndSaveMovies = async () => {
  try {
    const movies = await getMoviesFromApi();

    if (movies?.docs) {
      const transformedMovies = movies.docs.map((movie, index) => transformMovieData(movie, index + 1));

      await saveMoviesToJson(transformedMovies);
    }
  } catch (error) {
    console.error('Error fetching movies:', error);
  }
};

module.exports = fetchAndSaveMovies;
