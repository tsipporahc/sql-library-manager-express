const express = require('express');
const app = require('../app');
const book = require('../models/book');
const router = express.Router();
var Book = require('../models').Book;

function asyncHandler(cb) {
    return async (req, res, next) => {
        try {
            await cb(req, res, next);
        } catch (err) {
            err.status = 404;
            err.message = 'Sorry, this page is not found :(';
            console.log(err);
            res.render('error', { err });
        }
    };
}

/* GET home page. */
router.get('/', (req, res, next) => {
    res.redirect('/books');
    next();
});

/* GET Books Listing - Shows the full list of books */
router.get(
    '/books',
    asyncHandler(async (req, res, next) => {
        const books = await Book.findAll();
        res.render('index', { books, title: 'Library Books' });
    })
);

/* Create a new book form */
router.get(
    '/books/new',
    asyncHandler(async (req, res, next) => {
        res.render('new-book', { title: 'New Book' });
    })
);

/* POST create a new book -  Posts a new book to the database */
router.post(
    '/books/new',
    asyncHandler(async (req, res) => {
        try {
            console.log(req.body);
            const book = await Book.create(req.body);
            res.redirect('/books/');
        } catch (err) {
            console.log(err);
        }
    })
);

/* GET Book Details -  Shows book detail form */
router.get(
    '/books/:id',
    asyncHandler(async (req, res, next) => {
        const book = await Book.findByPk(req.params.id);
        res.render('update-book', { book });
    })
);

/* Update a book. */
router.post(
    '/books/:id',
    asyncHandler(async (req, res) => {
        console.log(req.body);
        const book = await Book.findByPk(req.params.id);
        await book.update(req.body);
        res.redirect('/books');
    })
);

/* Delete a book. */
router.post(
    '/books/:id/delete',
    asyncHandler(async (req, res) => {
        const book = await Book.findByPk(req.params.id);
        await book.destroy();
        res.redirect('/books');
    })
);

module.exports = router;
