'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Book = require('./models/bookModel');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3002;

mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Mongoose is connected')
});

app.get('/', (request, response) => {
  response.send('test request received')
})

app.get('/books', handleGetBooks);

async function handleGetBooks(request, response) {
  try {
      let queryObj = {};
      if (request.query.title) {
        queryObj = {title: request.query.title}
      }
      let booksFromDB = await Book.find(queryObj);

    if (booksFromDB) {
      response.status(200).send(booksFromDB);
    } else {
      response.status(404).send('Read something else!');
    }
  } catch (error) {
    console.error(error);
    response.status(500).send('Server error.');
  }
}

app.listen(PORT, () => console.log(`listening on ${PORT}`));
