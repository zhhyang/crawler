/**
 * Created by Freeman on 2016/4/8.
 */

var read = require('../update/read'),
    sinaBlog = require('../config').sinaBlog,
    debug = require('debug')('crawler:test:test_read');


read.classList(sinaBlog.url,function (err,result) {
    debug('读取文章分类列表结果：%s', result);
    console.log('读取文章分类列表结果：%s', result);
});