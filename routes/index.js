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
        //const books = await Book.findAll().then((book) => res.json(book)); // returns a collection of books
        //console.log(books);
        res.render('index', { books, title: 'Library Books' });
    })
);

/* Create a new book form */
router.get(
    '/books/new',
    asyncHandler(async (req, res, next) => {
        res.render('new-book', { books: {}, title: 'New Book' });
    })
);

/* POST create a new book -  Posts a new book to the database */
router.post(
    '/books/new',
    asyncHandler(async (req, res) => {
        const books = await Book.create({
            title: req.body.title,
            author: req.body.author,
            genre: req.body.genre,
            year: req.body.year,
        });
        console.log(books);
        res.redirect('/books/');
    })
);

/* GET Book Details -  Shows book detail form */
router.get(
    '/books/:id',
    asyncHandler(async (req, res, next) => {
        const { id } = req.params;
        const books = await Book.findAll();
        if (id <= books.length) {
            res.render('update-book', {
                books: books[id],
            });
        }
    })
);

/* Update a book. */
router.post(
    '/books/:id',
    asyncHandler(async (req, res) => {
        //const { id } = req.params;
        const books = await Book.findByPk(req.params.id);
        console.log(books);
        await Book.update({ where: { title: req.body.title } });
        res.redirect('/books/');
    })
);

/* Delete a book. */
router.post(
    '/:id/delete',
    asyncHandler(async (req, res) => {
        res.redirect('/books');
    })
);

module.exports = router;
