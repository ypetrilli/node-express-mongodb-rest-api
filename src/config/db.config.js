require('dotenv').config(); //import content form .env file

const DATABASE_URL = process.env.DATABASE_URL;
const PORT = process.env.PORT || 8080;

module.exports = {
      url: DATABASE_URL,
      port: PORT,
};