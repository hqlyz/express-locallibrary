const Author = require('../models/author');
const async = require("async");
const Book = require("../models/book");
const { body,validationResult } = require('express-validator');

exports.author_list = function (req, res, next) {
    Author.find()
        .sort([['family_name', 'ascending']])
        .exec(function (err, list_authors) {
            if (err) next(err);
            res.render("author_list", { title: "Author List", author_list: list_authors });
        });
};

exports.author_detail = function(req, res, next) {
    async.parallel({
        author: function (callback) {
            Author.findById(req.params.id)
                .exec(callback);
        },
        author_books: function(callback) {
            Book.find({"author": req.params.id}, "title summary")
                .exec(callback);
        },
    }, function (err, results) {
        if(err) next(err);
        if(results.author == null) {
            var err = new Error("Author not found");
            err.status = 404;
            next(err);
        }
        res.render("author_detail", { title: "Author Detail", author: results.author, author_books: results.author_books});
    });
};

exports.author_create_get = function(req, res, next) { 
    res.render("author_form", { title: "Author Create"});
};

exports.author_create_post = [
    body("first_name").trim().isLength({min: 1}).escape().withMessage('First name must be specified.').isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
    body("family_name").trim().isLength({min: 1}).escape().withMessage('Family name must be specified.').isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
    body("date_of_birth").optional({checkFalsy: true}).isISO8601().toDate(),
    body("date_of_death").optional({checkFalsy: true}).isISO8601().toDate(),
    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            res.render("author_form", { title: "Author Create", author: req.body, errors: errors.array()});
            return;
        } else {
            var author = new Author({
                first_name: req.body.first_name,
                family_name: req.body.family_name,
                date_of_birth: req.body.date_of_birth,
                date_of_death: req.body.date_of_death,
            });
            author.save(function (err) {
                if(err) next(err);
                res.redirect(author.url);
            });
        }
    }
];

exports.author_delete_get = function(req, res, next) { 
    async.parallel({
        author: function (callback) {
            Author.findById(req.params.id).exec(callback);
        },
        author_books: function (callback) {
            Book.find({"author": req.params.id}).exec(callback);
        },
    }, function (err, results) {
        if(err) return next(err);
        if(results.author == null) {
            res.redirect("/catalog/authors");
        }
        res.render("author_delete", { title: "Author Delete", author: results.author, author_books: results.author_books});
    })
};

exports.author_delete_post = function(req, res, next) { 
    async.parallel({
        author: function (callback) {
            Author.findById(req.body.authorid).exec(callback);
        },
        author_books: function (callback) {
            Book.find({"author": req.body.authorid}).exec(callback);
        },
    }, function (err, results) {
        if(err) return next(err);
        if(results.author_books.length > 0) {
            res.render("author_delete", { title: "Author Delete", author: results.author, author_books: results.author_books});
            return;
        }
        Author.findByIdAndRemove(req.body.authorid)
            .exec(function (err) {
                if(err) return next(err);
                res.redirect("/catalog/authors");
            });
    });
};

exports.author_update_get = (req, res, next) => { res.send('未实现：作者更新表单的 GET'); };

exports.author_update_post = (req, res, next) => { res.send('未实现：更新作者的 POST'); };