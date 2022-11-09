var sequelize = require('./models/index.js').sequelize;
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

// test connection to database and sync model
(async () => {
    await sequelize.sync();
    try {
        await sequelize.authenticate(); //returns a promise that resolves to a successful, authenticated connection to the database.
        console.log('Connection to the database successful!'); //tests the connection to the database!!
    } catch (error) {
        console.error('Error connecting to the database: ', error);
    }
})();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error(); // custom error object
    err.status = 404;
    err.message = 'Sorry, this page is not found :(';
    next(err);
});

// global error handler for server errors
app.use((err, req, res, next) => {
    if (err.status === 404) {
        res.status(err.status);
        res.render(
            'page-not-found',
            { err },
            console.log(`Error Status: ${err.status}. ${err.message}`)
        );
    } else {
        err.message =
            err.message ||
            `Sorry! There was an unexpected error on the server.`;
        res.status(err.status || 500);
        console.log(err);
        res.render(
            'error',
            { err },
            console.log(`Error Status: ${err.status}. ${err.message}`)
        );
    }
});

module.exports = app;
