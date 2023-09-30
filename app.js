const express = require('express');
// const session = require('express-session');
// const SequelizeSess = require('connect-session-sequelize')(session.Store);
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const cors = require('cors');
const sequelize = require('./config/dbConfig');
// require('./test')
const authorRoute = require('./routes/authorRoute');
const userRoute = require('./routes/userRoute');
const bookroute = require('./routes/bookRoute');
const countryRoute = require('./routes/countryRoute');
const categoryRoute = require('./routes/categoryRoute');
const publisherRoute = require('./routes/publisherRoute');
const reviewRoute = require('./routes/reviewRoute');
const cartRoute = require('./routes/cartRoute');
const favoriteRoute = require('./routes/favoriteRoute');
const orderRoute = require('./routes/orderRoute');
const userBookRoute = require('./routes/userBookRoute')
const { errorCtrl } = require('./middleware/multerErrorController');


const app = express();

app.use(
  cors({
    origin: '*',
  })
);
app.disable('x-powered-by');
// app.use(helmet());
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "script-src 'self' 'nonce-some-random-value'");
  next();
});
app.use(express.json());
app.use(cookieParser());

const VER1 = '/api/v1';
app.use(`${VER1}/authors`, authorRoute);
app.use(`${VER1}/users`, userRoute);
app.use(`${VER1}/books`, bookroute);
app.use(`${VER1}/countries`, countryRoute);
app.use(`${VER1}/categories`, categoryRoute);
app.use(`${VER1}/publishers`, publisherRoute);
app.use(`${VER1}/reviews`, reviewRoute);
app.use(`${VER1}/carts`, cartRoute);
app.use(`${VER1}/favorites`, favoriteRoute);
app.use(`${VER1}/orders`, orderRoute);
app.use(`${VER1}/userBooks`, userBookRoute);

app.use(errorCtrl);
app.get('/', (req, res) => {
  return res.status(200).json('hello my man!');
});

module.exports = app;
