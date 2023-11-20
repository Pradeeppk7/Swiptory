const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const authRouter = require('./routes/authRoute');
const storyRouter = require('./routes/storyRoute');
const userRouter = require('./routes/userRoute')
const morgan = require('morgan');

const app = express();
app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

dotenv.config();


app.get('/health', (req, res) => {
    const dbStatus =
    mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';

  res.status(200).json({
    server: 'Running',
    database: dbStatus,
  });
});

const api = process.env.API_URL;
app.use(`${api}/auth`, authRouter);
app.use(`${api}/user`, userRouter);
app.use(`${api}/story`, storyRouter);


app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(err.status || 500)
    .json({ error: 'Something went wrong! Please try again later.' });
});


app.listen(process.env.PORT, () => {
  mongoose
    .connect(process.env.DB_CONNECT)
    .then(() => {
      console.log('MongoDB Connected');
      console.log(`App listening at http://localhost:${process.env.PORT}`);
    })
    .catch((err) => console.log(err));
});


module.exports = app;