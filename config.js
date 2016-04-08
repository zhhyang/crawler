/**
 * Created by Freeman on 2016/4/8.
 */

var mysql = require('mysql');

exports.db = mysql.createConnection({
    host:            '127.0.0.1',   // 数据库地址
    port:            3306,          // 数据库端口
    database:        'sina_blog',   // 数据库名称
    user:            'root',        // 数据库用户
    password:        'root'             // 数据库用户对应的密码
});

exports.sinaBlog = {
    url: 'http://blog.sina.com.cn/u/1776757314'  // 博客首页地址
};

// 定时更新
exports.autoUpdate = '* */5 * * * *';  // 任务执行规则，参考 cron 语法



