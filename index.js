const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const Contact = require('./model/contact');
const { Op } = require('sequelize');

const app = express();
app.use(bodyParser.json());




sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
});
