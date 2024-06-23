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

  const existingContacts = await Contact.findAll({
    where: {
      [Op.or]: [
        { email },
        { phoneNumber }
      ]
    },
    attributes: ['id', 'linkedId']
  });


  if (existingContacts.length === 0) {
    const newContact = await Contact.create({ email, phoneNumber, linkPrecedence: 'primary' });
    return res.json({
      contact: {
        primaryContactId: newContact.id,
        emails: email ? [email] : [],
        phoneNumbers: phoneNumber ? [phoneNumber] : [],
        secondaryContactIds: []
      }
    });
  }

  const ids = new Set();

  existingContacts.forEach(contact => {
    if (contact.id) {
        ids.add(contact.id);
    }
    if (contact.linkedId) {
        ids.add(contact.linkedId);
    }
});
   
  const final_ids = Array.from(ids)
  const all_contact = await Contact.findAll({
    where: {
    [Op.or]: [
        { id: { [Op.in]: final_ids } },
        { linkedId: { [Op.in]: final_ids } }
    ]
    },
    order: [['linkPrecedence', 'ASC'], ['createdAt', 'ASC']]
});


  const secondaryContactIds = new Set();
  const emails = new Set();
  const phoneNumbers = new Set();
  let primary = null
  
  for (const contact of all_contact) {
    if (contact.linkPrecedence === 'primary') {
        primary = contact
    }else {
        secondaryContactIds.add(contact.id);
    }
    if (contact.email) {
      emails.add(contact.email);
    }
    if (contact.phoneNumber) {
      phoneNumbers.add(contact.phoneNumber);
    }
  }

});

sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
});
