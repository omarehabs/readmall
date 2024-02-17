require("./config/env.confic");
const sequelize = require("./config/dbConfig");
const helmet = require("helmet");
const https = require("https");
const fs = require("fs");
const app = require("./app");
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
  UserBook,
} = require("./models/models");

const multer = require("multer");
const bodyParser = require("body-parser");

// Multer configuration to handle file uploads
const upload = multer({ dest: "uploads/" });

// Body-parser middleware to parse request body
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// https
//   .createServer(
//     {
//       // key: fs.readFileSync("key.pem"),
//       // cert: fs.readFileSync("cert.pem"),
//       // passphrase: "omarehab",
//     },
async function createFirstAdmin() {
  const email = 'root@gmail.com'
  const user = await User.count({ where: { email } })
  console.log(user);
  if (user) {
    console.log('admin user root@gmail.com')
  } else {
    await User.create({ fullname: 'super admin', email, password: 'root1234', role: "admin" })
    console.log('admin user created: root@gmail.com')
  }
}
app.listen(PORT, async () => {
  try {

    createFirstAdmin()
    console.log(`server is running on port ${PORT}`);
    await sequelize.authenticate();
    await sequelize.sync({
      alter: true,
    });
    console.log(`server is running on port ${PORT}`);
  } catch (e) {
    console.log(e);
  }
});
