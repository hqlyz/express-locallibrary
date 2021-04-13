const BookInstance = require('../models/bookinstance');

exports.bookinstance_list = (req, res, next) => { res.send('未实现：书籍副本列表'); };

exports.bookinstance_detail = (req, res, next) => { res.send('未实现：书籍副本详细信息：' + req.params.id); };

exports.bookinstance_create_get = (req, res, next) => { res.send('未实现：书籍副本创建表单的 GET'); };

exports.bookinstance_create_post = (req, res, next) => { res.send('未实现：创建书籍副本的 POST'); };

exports.bookinstance_delete_get = (req, res, next) => { res.send('未实现：书籍副本删除表单的 GET'); };

exports.bookinstance_delete_post = (req, res, next) => { res.send('未实现：删除书籍副本的 POST'); };

exports.bookinstance_update_get = (req, res, next) => { res.send('未实现：书籍副本更新表单的 GET'); };

exports.bookinstance_update_post = (req, res, next) => { res.send('未实现：更新书籍副本的 POST'); };