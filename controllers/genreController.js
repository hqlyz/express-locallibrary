const Genre = require('../models/genre');

exports.genre_list = (req, res, next) => { res.send('未实现：类目列表'); };

exports.genre_detail = (req, res, next) => { res.send('未实现：类目详细信息：' + req.params.id); };

exports.genre_create_get = (req, res, next) => { res.send('未实现：类目创建表单的 GET'); };

exports.genre_create_post = (req, res, next) => { res.send('未实现：创建类目的 POST'); };

exports.genre_delete_get = (req, res, next) => { res.send('未实现：类目删除表单的 GET'); };

exports.genre_delete_post = (req, res, next) => { res.send('未实现：删除类目的 POST'); };

exports.genre_update_get = (req, res, next) => { res.send('未实现：类目更新表单的 GET'); };

exports.genre_update_post = (req, res, next) => { res.send('未实现：更新类目的 POST'); };