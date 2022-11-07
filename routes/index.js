const express = require('express');
const app = require('../app');
const router = express.Router();
const Book = require('../models/').Book;

/* function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch(error) {
      res.render('error', {error:err});
    }
  }
} */

/* GET home page. */
router.get('/', async(req, res, next) => {
  const books = await Book.findAll().then(book => res.json(book)); // returns a collection of books
  console.log(books);
  res.render('index', { title: 'Library Books' });
});

module.exports = router;
