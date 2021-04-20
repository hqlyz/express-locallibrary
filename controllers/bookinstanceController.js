const BookInstance = require('../models/bookinstance');
const { body,validationResult } = require('express-validator');
const Book = require("../models/book");

exports.bookinstance_list = function (req, res, next) {
    BookInstance.find()
        .populate("book")
        .exec(function (err, list_bookinstances) {
            if (err) next(err);
            res.render("bookinstance_list", { title: "Book Instance List", bookinstance_list: list_bookinstances });
        });
};

exports.bookinstance_detail = function(req, res, next) {
    BookInstance.findById(req.params.id)
        .populate("book")
        .exec(function(err, bookinstance) {
            if(err) next(err);
            if(bookinstance == null) {
                var err = new Error("Bookinstance not found");
                err.status = 404;
                next(err);
            }
            res.render("bookinstance_detail", { title: "Copy: " + bookinstance.book.title, bookinstance: bookinstance});
        });
};

exports.bookinstance_create_get = function(req, res, next) { 
    Book.find({}, "title")
        .exec(function (err, books) {
            if(err) return next(err);
            res.render("bookinstance_form", { title: "BookInstance Create", book_list: books});
        });
};

exports.bookinstance_create_post = [
     body('book', 'Book must be specified').trim().isLength({ min: 1 }).escape(),
     body('imprint', 'Imprint must be specified').trim().isLength({ min: 1 }).escape(),
     body('status').escape(),
     body('due_back', 'Invalid date').optional({ checkFalsy: true }).isISO8601().toDate(),
     (req, res, next) => {
         const errors = validationResult(req);
         var bookinstance = new BookInstance({
             book: req.body.book,
             imprint: req.body.imprint,
             status: req.body.status,
             due_back: req.body.due_back,
         });
         if(!errors.isEmpty()) {
             Book.find({}, "title")
                .exec(function (err, books) {
                    if(err) return next(err);
                    res.render("bookinstance_form", { title: "BookInstance Create", book_list: books, selected_book: bookinstance.book._id, bookinstance: bookinstance, errors: errors.array()});
                });
            return;
         }
         bookinstance.save(function (err) {
             if(err) return next(err);
             res.redirect(bookinstance.url);
         });
     }
];

exports.bookinstance_delete_get = (req, res, next) => { res.send('未实现：书籍副本删除表单的 GET'); };

exports.bookinstance_delete_post = (req, res, next) => { res.send('未实现：删除书籍副本的 POST'); };

exports.bookinstance_update_get = (req, res, next) => { res.send('未实现：书籍副本更新表单的 GET'); };

exports.bookinstance_update_post = (req, res, next) => { res.send('未实现：更新书籍副本的 POST'); };