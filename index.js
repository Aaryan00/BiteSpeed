const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const Contact = require('./model/contact');
const { Op } = require('sequelize');

const app = express();
app.use(bodyParser.json());

app.get('/contacts', async (req, res) => {
    try {
      const contacts = await Contact.findAll();
      res.json(contacts);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      res.status(500).send('Internal Server Error');
    }
  });


sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
});
