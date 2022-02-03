'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
// const seed = require('./seed.js');
const app = express();
app.use(cors());
app.use(express.json());

const mongoose = require('mongoose');
const Book = require('./models/bookModel');
const verifyUser = require('./authentication.js');

const PORT = process.env.PORT || 3002;

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(console.log('Mongoose is connected'))


app.get('/', (request, response) => {
  response.send('test request received')
})

let handleUpdateBook = async (req, res) => {
  console.log("request query", req.query);
  console.log("request body", req.body);
  verifyUser(req, async (err, user) => {
    if (err) {
      res.send('invalid token');
    } else {
      const { id } = req.params;
      try {
        const book = await Book.findOne({ _id: id, email: user.email });
        if (!book) res.status(400).send('unable to update book');
        else {
          const updatedBook = await Book.findByIdAndUpdate(id, req.body, { new: true });
          res.status(200).send(updatedBook);
        }
      } catch (e) {
        res.status(500).send('server error');
      }
    }
})
};

app.get('/books', handleGetBooks);
app.post('/books', handleNewBook);
app.delete('/books/:id', handleRemoveBook);
app.put('/books/:id', handleUpdateBook);
app.get('/user', handleGetUser);

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
  verifyUser(req, async (err, user) => {
    if (err) {
      res.send('invalid token');
    } else {
      const { title, description, status } = req.body;
      try {
        const newBook = await Book.create({ ...req.body, email: user.email })
        res.status(200).send(newBook)
    } catch (error) {
      console.error(error);
      response.status(400).send('Could not create book');
    }
  }})

}

async function handleRemoveBook(request, response) {

  verifyUser(request, async (err, user) => {
    if (err) {
      response.send('invalid token');
    } else {
      const { id } = request.params;
    try {
      // const email = request.query.email;
  
      // const id = request.params.id;
      console.log(id, email);
  
      const book = await Book.findOne({ _id: id, email: user.email });
  
      if (book) {
        await Book.findByIdAndDelete(id);
        response.send('success you deleted it');
      } else {
        response.status(404).send('No access to this book.');
        return;
      }
  
    } catch (error) {
      console.error(error);
      response.status(400).send('Failed to remove book')
    }

  }})

}

function handleGetUser(req, res) {
  verifyUser(req, (err, user) => {
    if (err) {
      res.send('This token is invalid');
    } else {
      res.send(user);
    }
  })
}


app.listen(PORT, () => console.log(`listening on ${PORT}`));
