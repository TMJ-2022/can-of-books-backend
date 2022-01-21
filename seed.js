'use strict';

const mongoose = require('mongoose');
require('dotenv').config();
const Book = require('./bookModel.js');

mongoose.connect(process.env.MONGODB_URI);

async function seed() {
  const myBook = new Book({
    title: 'The Outsiders',
    description: 'Greasers and Socs fight in the 1960s costing some their lives.',
    status: 'Available',
    email: 'mlh6118@gmail.com'
  });
  await myBook.save(function (err) {
    if (err) console.error(err);
    else console.log('Saved The Outsiders');
  });

  await Book.create({
    title: 'Red Badge of Courage',
    description: 'Teen in Civil War learns being a soldier is not all he thought.',
    status: 'Out of Print',
    email: 'jamsbury95@hotmail.com'
  });
  console.log('Saved Red Badge of Courage');

  // Placeholder for T's book.

  mongoose.disconnect();
}

seed();
