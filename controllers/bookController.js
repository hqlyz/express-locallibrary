const Book = require("../models/book");
const BookInstance = require("../models/bookinstance");
const Author = require("../models/author");
const Genre = require("../models/genre");

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

exports.book_detail = function(req, res, next) { 
    async.parallel({
        book: function (callback) {
            Book.findById(req.params.id)
                .populate("author")
                .populate("genre")
                .exec(callback);
        },
        book_instances: function (callback) {
            BookInstance.find({"book": req.params.id})
                .exec(callback);
        },
    }, function (err, results) {
        if(err) next(err);
        if(results.book == null) {
            var err = new Error("Book not found");
            err.status = 404;
            next(err);
        }
        res.render("book_detail", { title: "Book Detail", book: results.book, book_instances: results.book_instances});
    })
};

exports.book_create_get = (req, res, next) => { res.send("未实现：书籍创建表单的 GET"); };

exports.book_create_post = (req, res, next) => { res.send("未实现：创建书籍的 POST"); };

exports.book_delete_get = (req, res, next) => { res.send("未实现：书籍删除表单的 GET"); };

exports.book_delete_post = (req, res, next) => { res.send("未实现：删除书籍的 POST"); };

exports.book_update_get = (req, res, next) => { res.send("未实现：书籍更新表单的 GET"); };

exports.book_update_post = (req, res, next) => { res.send("未实现：更新书籍的 POST"); };