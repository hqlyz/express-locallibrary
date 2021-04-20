const Book = require("../models/book");
const BookInstance = require("../models/bookinstance");
const Author = require("../models/author");
const Genre = require("../models/genre");
const { body, validationResult } = require('express-validator');

const async = require("async");

exports.index = function (req, res) {
    console.log.bind(console, "index");
    async.parallel({
        book_count: function (callback) {
            console.log.bind(console, "book_count");
            Book.countDocuments({}, callback);
        },
        book_instance_count: function (callback) {
            BookInstance.countDocuments({}, callback);
        },
        book_instance_available_count: function (callback) {
            BookInstance.countDocuments({ status: 'Available' }, callback);
        },
        author_count: function (callback) {
            Author.countDocuments({}, callback);
        },
        genre_count: function (callback) {
            Genre.countDocuments({}, callback);
        }
    }, function (err, results) {
        console.log.bind(console, results);
        res.render("index", { title: "Local Library Home", error: err, data: results });
    });
};

exports.book_list = function (req, res, next) {
    Book.find({}, "title author")
        .populate("author")
        .exec(function (err, list_books) {
            if (err) next(err);
            res.render("book_list", { title: "Book List", book_list: list_books });
        });
};

exports.book_detail = function (req, res, next) {
    async.parallel({
        book: function (callback) {
            Book.findById(req.params.id)
                .populate("author")
                .populate("genre")
                .exec(callback);
        },
        book_instances: function (callback) {
            BookInstance.find({ "book": req.params.id })
                .exec(callback);
        },
    }, function (err, results) {
        if (err) next(err);
        if (results.book == null) {
            var err = new Error("Book not found");
            err.status = 404;
            next(err);
        }
        res.render("book_detail", { title: "Book Detail", book: results.book, book_instances: results.book_instances });
    })
};

exports.book_create_get = function (req, res, next) {
    async.parallel({
        authors: function (callback) {
            Author.find(callback);
        },
        genres: function (callback) {
            Genre.find(callback);
        },
    }, function (err, results) {
        if (err) next(err);
        res.render("book_form", { title: "Book Create", authors: results.authors, genres: results.genres });
    });
};

exports.book_create_post = [
    (req, res, next) => {
        if (!(req.body.genre instanceof Array)) {
            if (req.body.genre === "undefined") {
                req.body.genre = [];
            } else {
                req.body.genre = new Array(req.body.genre);
            }
        }
        next();
    },

    body("title", "Title must not be empty.").trim().isLength({ min: 1 }).escape(),
    body("author", "Author must not be empty.").trim().isLength({ min: 1 }).escape(),
    body("summary", "Summary must not be empty.").trim().isLength({ min: 1 }).escape(),
    body("isbn", "ISBN must not be empty").trim().isLength({ min: 1 }).escape(),
    body("genre.*").escape(),

    (req, res, next) => {
        const errors = validationResult(req);
        var book = new Book({
            title: req.body.title,
            author: req.body.author,
            summary: req.body.summary,
            isbn: req.body.isbn,
            genre: req.body.genre,
        });
        if (!errors.isEmpty()) {
            async.parallel({
                authors: function (callback) {
                    Author.find(callback);
                },
                genres: function (callback) {
                    Genre.find(callback);
                },
            }, function (err, results) {
                if (err) next(err);
                for (let i = 0; i < results.length; i++) {
                    if (book.genre.indexOf(results.genres[i]._id) > -1) {
                        book.genre[i].checked = "true";
                    }
                }
                res.render("book_form", { title: "Book Create", authors: results.authors, genres: results.genres, book: book, errors: errors.array() });
            });
            return;
        }
        book.save(function (err) {
            if (err) return next(err);
            res.redirect(book.url);
        });
    }
];

exports.book_delete_get = function(req, res, next) {
    async.parallel({
        book: function (callback) {
            Book.findById(req.params.id).exec(callback);
        },
        
    })
};

exports.book_delete_post = (req, res, next) => { res.send(""); };

exports.book_update_get = function (req, res, next) {
    async.parallel({
        book: function (callback) {
            Book.findById(req.params.id)
                .populate("author")
                .populate("genre")
                .exec(callback);
        },
        authors: function (callback) {
            Author.find(callback);
        },
        genres: function (callback) {
            Genre.find(callback);
        },
    }, function (err, results) {
        if (err) return next(err);
        if (results.book == null) {
            let err = new Error("Book not found");
            err.status = 404;
            return next(err);
        }
        for (let i = 0; i < results.genres.length; i++) {
            for (let j = 0; j < results.book.genre.length; j++) {
                if (results.book.genre[j]._id.toString() == results.genres[i]._id.toString()) {
                    results.genres[i].checked = "true";
                }
            }
        }
        res.render("book_form", { title: "Update Book", authors: results.authors, genres: results.genres, book: results.book });
    });
};

exports.book_update_post = [
    (req, res, next) => {
        if (!(req.body.genre instanceof Array)) {
            if (req.body.genre === "undefined") {
                req.body.genre = [];
            } else {
                req.body.genre = new Array(req.body.genre);
            }
        }
        next();
    },

    body("title", "Title must not be empty.").trim().isLength({ min: 1 }).escape(),
    body("author", "Author must not be empty.").trim().isLength({ min: 1 }).escape(),
    body("summary", "Summary must not be empty.").trim().isLength({ min: 1 }).escape(),
    body("isbn", "ISBN must not be empty").trim().isLength({ min: 1 }).escape(),
    body("genre.*").escape(),

    (req, res, next) => {
        const errors = validationResult(req);
        var book = new Book({
            title: req.body.title,
            author: req.body.author,
            summary: req.body.summary,
            isbn: req.body.isbn,
            genre: req.body.genre,
            _id: req.params._id,
        });
        if (!errors.isEmpty()) {
            async.parallel({
                authors: function (callback) {
                    Author.find(callback);
                },
                genres: function (callback) {
                    Genre.find(callback);
                },
            }, function (err, results) {
                if (err) next(err);
                for (let i = 0; i < results.length; i++) {
                    if (book.genre.indexOf(results.genres[i]._id) > -1) {
                        book.genre[i].checked = "true";
                    }
                }
                res.render("book_form", { title: "Book Create", authors: results.authors, genres: results.genres, book: book, errors: errors.array() });
            });
            return;
        }
        Book.findByIdAndUpdate(req.params.id, book, {}, function(err, updatedBook) {
            if(err) return next(err);
            res.redirect(updatedBook.url);
        });
    }
];