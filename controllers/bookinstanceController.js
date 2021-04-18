const BookInstance = require('../models/bookinstance');

exports.bookinstance_list = function (req, res, next) {
    BookInstance.find()
        .populate("book")
        .exec(function (err, list_bookinstances) {
            if (err) next(err);
            res.render("bookinstance_list", { title: "Book Instance List", bookinstance_list: list_bookinstances });
        });
};

exports.bookinstance_detail = (req, res, next) => { res.send('未实现：书籍副本详细信息：' + req.params.id); };

exports.bookinstance_create_get = (req, res, next) => { res.send('未实现：书籍副本创建表单的 GET'); };

exports.bookinstance_create_post = (req, res, next) => { res.send('未实现：创建书籍副本的 POST'); };

exports.bookinstance_delete_get = (req, res, next) => { res.send('未实现：书籍副本删除表单的 GET'); };

exports.bookinstance_delete_post = (req, res, next) => { res.send('未实现：删除书籍副本的 POST'); };

exports.bookinstance_update_get = (req, res, next) => { res.send('未实现：书籍副本更新表单的 GET'); };

exports.bookinstance_update_post = (req, res, next) => { res.send('未实现：更新书籍副本的 POST'); };