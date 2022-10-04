require('dotenv').config(); //import content form .env file

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require("cors");
const routes = require('./routes/article.route');
const app = express();

const DATABASE_URL = process.env.DATABASE_URL; //Get database connection url
const PORT = process.env.PORT || 8080; // Get app running port

mongoose.connect(DATABASE_URL);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
});

database.once('connected', () => {
    console.log('Connected successfully to database');
});

app.use(express.json());
app.use(bodyParser.json()); // using bodyParser to parse JSON bodies into JS objects
app.use(express.urlencoded({ extended: true })); // parse requests of content-type - application/x-www-form-urlencoded
app.use(cors());
app.use('/api', routes);

app.get('/', (req, res) => {
    res.json({"message": "Welcome to Node Express Articles Rest API"});
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});