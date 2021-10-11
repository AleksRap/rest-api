const express = require('express');
const path = require('path');

const app = express();

const CONTACTS = [
  { id: 1, name: 'test', value: 'asdas45d55', isMark: true },
];

const PORT = 3000;

// GET
app.get('/api/contacts', (req, res) => {
  res.status(200).json(CONTACTS);
});

app.use(express.static(path.resolve('client')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve('client', 'index.html'));
});

app.listen(PORT, () => console.log(`Server has been started on port ${PORT}`));
