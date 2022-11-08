const express = require('express');
const app = require('../app');
const router = express.Router();
var Book = require('../models').Book;

function asyncHandler(cb) {
    return async (req, res, next) => {
        try {
            await cb(req, res, next);
        } catch (err) {
            err.status = 404;
            err.message = 'Sorry, this page is not found :(';
            res.render('error', { err });
        }
    };
}

/* GET home page. */
router.get('/', (req, res, next) => {
    res.redirect('/books');
    next();
});

router.get(
    '/books',
    asyncHandler(async (req, res, next) => {
        const books = await Book.findAll();
        //const books = await Book.findAll().then((book) => res.json(book)); // returns a collection of books
        console.log(books);
        res.render('index', { books, title: 'Library Books' });
    })
);

module.exports = router;
