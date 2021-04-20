const Genre = require("../models/genre");
const Book = require("../models/book");
const async = require("async");
const { body,validationResult } = require("express-validator");

exports.genre_list = function(req, res, next) { 
    Genre.find()
        .exec(function(err, list_genre) {
            if(err) next(err);
            res.render("genre_list", { title: "Genre List", genre_list: list_genre});
        });
};

exports.genre_detail = function(req, res, next) { 
    async.parallel({
        genre: function (callback) {
            Genre.findById(req.params.id).exec(callback);
        },
        genre_books: function (callback) {
            Book.find({"genre": req.params.id}).exec(callback);
        },
    }, function(err, results) {
        if(err) next(err);
        if(results.genre == null) {
            var err = new Error("Genre not found");
            err.status = 404;
            next(err);
        }
        res.render("genre_detail", { title: "Genre Detail", genre: results.genre, genre_books: results.genre_books});
    });
};

exports.genre_create_get = function(req, res, next) {
    res.render("genre_form", { title: "Create Genre"});
};

exports.genre_create_post = [
    body("name", "Genre name required").trim().isLength({min: 1}).escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        var genre = new Genre({name: req.body.name});
        if(!errors.isEmpty()) {
            res.render("genre_form", { title: "Create Genre", genre: genre, errors: errors.array()});
            return;
        } else {
            Genre.findOne({"name": req.body.name})
                .exec(function(err, foundGenre) {
                    if(err) {
                        return next(err);
                    }
                    if(foundGenre) {
                        res.redirect(foundGenre.url);
                    } else {
                        genre.save(function (err) {
                            if(err) {
                                return next(err);
                            }
                            res.redirect(genre.url);
                        });
                    }
                });
        }
    },
];

exports.genre_delete_get = function(req, res, next) { 
    async.parallel({
        genre: function (callback) {
            Genre.findById(req.params.id).exec(callback);
        },
        genre_books: function (callback) {
            Book.find({"genre": req.params.id}).exec(callback);
        },
    }, function (err, results) {
        console.log(results);
        if(err) return next(err);
        res.render("genre_delete", { title: "Delete Genre", genre: results.genre, genre_books: results.genre_books});
    });
};

exports.genre_delete_post = function(req, res, next) { 
    async.parallel({
        genre: function (callback) {
            Genre.findById(req.body.genreid).exec(callback);
        },
        genre_books: function (callback) {
            Book.find({"genre": req.body.genreid}).exec(callback);
        },
    }, function (err, results) {
        if(err) return next(err);
        if(results.genre_books.length > 0) {
            res.render("genre_delete", { title: "Delete Genre", genre: results.genre, genre_books: results.genre_books});
            return;
        }
        Genre.findByIdAndRemove(req.body.genreid)
            .exec(function (err) {
                if(err) return next(err);
                res.redirect("/catalog/genres");
            });
    });
};

exports.genre_update_get = (req, res, next) => { res.send("未实现：类目更新表单的 GET"); };

exports.genre_update_post = (req, res, next) => { res.send("未实现：更新类目的 POST"); };