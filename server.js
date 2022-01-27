'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const seed = require('./seed.js');
const app = express();
app.use(cors());
app.use(express.json());

const mongoose = require('mongoose');
const Book = require('./models/bookModel');

const PORT = process.env.PORT || 3002;

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(console.log('Mongoose is connected')).then(seed());

app.get('/', (request, response) => {
  response.send('test request received')
})

app.get('/books', handleGetBooks);
app.post('/books', handleNewBook);
app.delete('/books/:id', handleRemoveBook);

async function handleGetBooks(request, response) {
  // console.log("request", request.body);
  // console.log("response", response.body);
  try {
    let queryObj = {};
    if (request.query.email) {
      queryObj = { email: request.query.email }
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

async function handleNewBook(request, response) {
  try {
    const book = await Book.create(request.body);
    response.send(book);
  } catch (error) {
    console.error(error);
    response.status(400).send('Could not create book');
  }
}

async function handleRemoveBook(request, response) {
  try {
    const email = request.query.email;

    const id = request.params.id;
    console.log(id, email);

    const book = await Book.findOne({ _id: id, email: email });
    // const book = await Book.findByIdAndDelete(id);

    if (book) {
      await Book.findByIdAndDelete(id);
      response.send('success');
    } else {
      response.status(404).send('No access to this book.');
      return;
    }

    // await Book.findByIdAndDelete(id);


  } catch (error) {
    console.error(error);
    response.status(400).send('Failed to remove book')
  }
}


app.listen(PORT, () => console.log(`listening on ${PORT}`));
