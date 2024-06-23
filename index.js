const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
const Contact = require('./model/contact');
const { Op } = require('sequelize');

const app = express();
app.use(bodyParser.json());

app.get('/delete', async (req, res) => {
    try {
        await Contact.destroy({ where: {} });  // Deletes all records in the Contact table
        res.status(200).json({ message: 'All contacts have been deleted' });
    } catch (error) {
        console.error('Error deleting contacts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/contacts', async (req, res) => {
    try {
      const contacts = await Contact.findAll();
      res.json(contacts);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      res.status(500).send('Internal Server Error');
    }
  });

  
app.post('/identify', async (req, res) => {
  const { email, phoneNumber } = req.body;
});

sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
});
