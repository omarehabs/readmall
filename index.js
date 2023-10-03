require('./config/env.confic');
const sequelize = require('./config/dbConfig');
const helmet = require('helmet');
const app = require('./app');
const PORT = process.env.PORT;

const {
  User,
  Author,
  Book,
  Category,
  Country,
  OrderBook,
  Order,
  Publisher,
  Review,
  Cart,
  Favorite,
  UserBook
} = require('./models/models');


const multer = require('multer');
const bodyParser = require('body-parser');


// Multer configuration to handle file uploads
const upload = multer({ dest: 'uploads/' });

// Body-parser middleware to parse request body
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());


app.listen(PORT, async () => {
  const b  = await Cart.findAll({limit: 1})
  console.log(b)
  const r = await Favorite.findAll({limit: 1})
  console.log(r)
  const o = await UserBook.findAll({limit: 1})
  console.log(o)
  console.log(`server is up on port ${PORT}!`);
  await sequelize.authenticate();
  await sequelize.sync({
    alter: true
  });

});
