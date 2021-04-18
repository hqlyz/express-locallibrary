const Author = require('../models/author');

exports.author_list = function (req, res, next) {
    Author.find()
        .sort([['family_name', 'ascending']])
        .exec(function (err, list_authors) {
            if (err) next(err);
            res.render("author_list", { title: "Author List", author_list: list_authors });
        });
};

exports.author_detail = (req, res, next) => { res.send('未实现：作者详细信息：' + req.params.id); };

exports.author_create_get = (req, res, next) => { res.send('未实现：作者创建表单的 GET'); };

exports.author_create_post = (req, res, next) => { res.send('未实现：创建作者的 POST'); };

exports.author_delete_get = (req, res, next) => { res.send('未实现：作者删除表单的 GET'); };

exports.author_delete_post = (req, res, next) => { res.send('未实现：删除作者的 POST'); };

exports.author_update_get = (req, res, next) => { res.send('未实现：作者更新表单的 GET'); };

exports.author_update_post = (req, res, next) => { res.send('未实现：更新作者的 POST'); };