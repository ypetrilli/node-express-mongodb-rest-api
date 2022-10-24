const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require("cors");

const app = express();
const routes = require('./src/routes/article.route');
const config = require('./src/config/db.config');

mongoose.connect(config.url);
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

app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}.`);
});