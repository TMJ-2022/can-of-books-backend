'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Book = require('./models/bookModel');
const seed = require('./seed.js');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3002;

mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true}).then(console.log('Mongoose is connected')).then(seed());

app.get('/', (request, response) => {
  response.send('test request received')
})

app.get('/books', handleGetBooks);

async function handleGetBooks(request, response) {
  console.log("request", request.body);
  console.log("response", response.body);
  try {
      let queryObj = {};
      if (request.query.email) {
        queryObj = {email: request.query.email}
      }
      let booksFromDB = await Book.find(queryObj);

    if (booksFromDB) {
      response.status(200).send(booksFromDB);
    } else {
      response.status(404).send('Booklist not found.');
    }
  } catch (error) {
    console.error(error);
    response.status(500).send('Server error.');
  }
}

app.listen(PORT, () => console.log(`listening on ${PORT}`));
