const Book = require('../models/book');

exports.index = (req, res, next) => { res.send('未实现：首页'); };

exports.book_list = (req, res, next) => { res.send('未实现：书籍列表'); };

exports.book_detail = (req, res, next) => { res.send('未实现：书籍详细信息：' + req.params.id); };

exports.book_create_get = (req, res, next) => { res.send('未实现：书籍创建表单的 GET'); };

exports.book_create_post = (req, res, next) => { res.send('未实现：创建书籍的 POST'); };

exports.book_delete_get = (req, res, next) => { res.send('未实现：书籍删除表单的 GET'); };

exports.book_delete_post = (req, res, next) => { res.send('未实现：删除书籍的 POST'); };

exports.book_update_get = (req, res, next) => { res.send('未实现：书籍更新表单的 GET'); };

exports.book_update_post = (req, res, next) => { res.send('未实现：更新书籍的 POST'); };