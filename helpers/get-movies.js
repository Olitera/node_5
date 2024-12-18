const fetchAndSaveMovies = require('./save-movies');
const fs = require('fs').promises;

async function getMovies() {
  try {
    await fs.access('top250.json');
  } catch (error) {
    await fetchAndSaveMovies();
  }

  return JSON.parse(await fs.readFile('top250.json', 'utf8'));
}

module.exports = getMovies;
