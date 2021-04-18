const Genre = require("../models/genre");
const Book = require("../models/book");
const async = require("async");

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

exports.genre_create_get = (req, res, next) => { res.send("未实现：类目创建表单的 GET"); };

exports.genre_create_post = (req, res, next) => { res.send("未实现：创建类目的 POST"); };

exports.genre_delete_get = (req, res, next) => { res.send("未实现：类目删除表单的 GET"); };

exports.genre_delete_post = (req, res, next) => { res.send("未实现：删除类目的 POST"); };

exports.genre_update_get = (req, res, next) => { res.send("未实现：类目更新表单的 GET"); };

exports.genre_update_post = (req, res, next) => { res.send("未实现：更新类目的 POST"); };