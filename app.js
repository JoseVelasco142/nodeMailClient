var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require("express-session");

// ROUTES
var index = require('./routes/index');
var mail = require('./routes/mail');
var login = require('./routes/login');
var inbox = require('./routes/inbox');

// EXPRESS
var app = express();
var CONNECTION = {};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// SESSION
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'BLACK-CAT'
}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ROUTE MAP
app.use('/', index);
app.use('/index', index);
app.use('/mail', mail);
app.use('/login', login);
app.use('/inbox', inbox);

/// 404
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
