const express = require('express');
const path = require('path');
const { v4 } = require('uuid');

const app = express();

let CONTACTS = [
  { id: '1', name: 'test', value: 'asdas45d55', isMark: true },
];

const PORT = 3000;

app.use(express.json());

// GET
app.get('/api/contacts', (req, res) => {
  res.status(200).json(CONTACTS);
});

// POST
app.post('/api/contacts', (req, res) => {
  const contact = { ...req.body, id: v4(), isMark: false };
  CONTACTS.push(contact);
  res.status(201).json(contact);
});

// PUT
app.put('/api/contacts/:id', (req, res) => {
  const index = CONTACTS.findIndex(({ id }) => id === req.body.id);
  CONTACTS[index].isMark = !CONTACTS[index].isMark;

  res.status(200).json(CONTACTS[index]);
});

// DELETE
app.delete('/api/contacts/:id', (req, res) => {
  CONTACTS = CONTACTS.filter(({ id }) => id !== req.params.id);
  res.status(200).json(true);
});

app.use(express.static(path.resolve('client')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve('client', 'index.html'));
});

app.listen(PORT, () => console.log(`Server has been started on port ${PORT}`));
