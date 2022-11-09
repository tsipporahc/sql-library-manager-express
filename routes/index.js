const express = require('express');
const app = require('../app');
const book = require('../models/book');
const router = express.Router();
var Book = require('../models').Book;

function asyncHandler(cb) {
    return async (req, res, next) => {
        try {
            await cb(req, res, next);
        } catch (error) {
            next(error);
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
        let book;
        try {
            console.log(req.body);
            book = await Book.create(req.body);
            res.redirect('/books/');
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                // checking the error
                book = await Book.build(req.body);
                res.render('new-book', {
                    book,
                    errors: error.errors,
                });
            } else {
                throw error; // error caught in the asyncHandler's catch block
            }
        }
    })
);

/* GET Book Details -  Shows book detail form */
router.get(
    '/books/:id',
    asyncHandler(async (req, res, next) => {
        const book = await Book.findByPk(req.params.id);
        if (book) {
            res.render('update-book', { book });
        } else {
            const err = new Error(); // custom error object
            err.status = 404;
            err.message = 'Sorry, this page is not found :(';
            next(err);
        }
    })
);

/* Update a book. */
router.post(
    '/books/:id',
    asyncHandler(async (req, res) => {
        let book;
        try {
            console.log(req.body);
            const book = await Book.findByPk(req.params.id);
            await book.update(req.body);
            res.redirect('/books');
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                // checking the error
                book = await Book.build(req.body);
                res.render('update-book', {
                    book,
                    errors: error.errors,
                });
            } else {
                throw error; // error caught in the asyncHandler's catch block
            }
        }
    })
);

/* Delete a book. */
router.post(
    '/books/:id/delete',
    asyncHandler(async (req, res) => {
        const book = await Book.findByPk(req.params.id);
        if (book) {
            await book.destroy();
            res.redirect('/books');
        } else {
            res.sendStatus(404);
        }
    })
);

module.exports = router;
