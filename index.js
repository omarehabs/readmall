require("./config/env.confic");
const path = require('path')
const fs = require('fs')
const sequelize = require("./config/dbConfig");
const app = require("./app");
const PORT = process.env.PORT;

const {
  User,
  //   Author,
  //   Book,
  //   Category,
  //   Country,
  //   OrderBook,
  //   Order,
  //   Publisher,
  //   Review,
  //   Cart,
  //   Favorite,
  //   UserBook,
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
  if (user) {
    console.log('admin user root@gmail.com')
  } else {
    await User.create({ fullname: 'super admin', email, password: 'root1234', role: "admin" })
    console.log('admin user created: root@gmail.com')
  }
}


const baseDirectory = __dirname;

const directories = [
  path.join(baseDirectory, "/public/images"),
  path.join(baseDirectory, "/public/pdfs"),
  path.join(baseDirectory, "/public/books"),
];
console.log(path.join(baseDirectory, "/public/pdfs"))

// Check and create directories
async function checkAndCreateDirectories(directories) {
  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Directory created: ${dir}`);
    } else {
      console.log(`Directory already exists: ${dir}`);
    }
  });
}


app.listen(PORT, async () => {
  checkAndCreateDirectories(directories);
  try {

    console.log(`server is running on port ${PORT}`);
    await sequelize.authenticate();
    await sequelize.sync({
      alter: true,
    });
    createFirstAdmin()
    console.log(`server is running on port ${PORT}`);
  } catch (e) {
    console.log(e);
  }
});
