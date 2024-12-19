require('dotenv').config();
const express = require('express');
const app = express();
const greetingsRouter = require('./routes/greetings');
const filmsRouter = require('./routes/films');
const getMovies = require('./helpers/get-movies');
const { State } = require('./helpers/state');
const authRouter = require('./routes/auth');

app.use(express.json());

app.use('/greetings', greetingsRouter);
app.use('/films', filmsRouter);
app.use('/auth', authRouter);

app.use((err, req, res) => {
  console.log(err);
});

async function startApp() {
  State.movies = await getMovies();
  app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
  })
}

void startApp()
