const https = require('https');

const API_URL = process.env.KINOPOISK_API_URL;
const API_TOKEN = process.env.KINOPOISK_API_TOKEN;

const params = {
  page: 1,
  limit: 250,
  selectFields: ['id', 'name', 'alternativeName', 'rating', 'year', 'budget', 'fees', 'poster'],
  sortField: 'rating.kp',
  sortType: -1,
  lists: 'top250'
};

const getMoviesFromApi = () => {
  const selectedFieldsRequest = params.selectFields.map((field) => `&selectFields=${ field }`).join('');

  return new Promise((resolve, reject) => {
    const options = {
      'method': 'GET',
      'hostname': API_URL,
      'path': `/v1.4/movie?page=${ params.page }&limit=${ params.limit }${ selectedFieldsRequest }&sortField=${ params.sortField }&sortType=${ params.sortType }&lists=${ params.lists }`,
      'headers': {
        'x-api-key': API_TOKEN
      },
      'maxRedirects': 20
    };

    const req = https.request(options, (res) => {
      let chunks = [];

      res.on('data', (chunk) => {
        chunks.push(chunk);
      });

      res.on('end', () => {
        const body = Buffer.concat(chunks);
        const data = JSON.parse(body.toString());
        resolve(data);
      });

      res.on('error', (error) => {
        reject(error);
      });
    });

    req.end();
  });
};

module.exports = getMoviesFromApi;
