/**
 * Created by Freeman on 2016/4/8.
 */


var originRequest = require('request'),
    cheerio = require('cheerio'),
    debug = require('debug')('crawler:update:read');


/**
 * 请求指定URL
 *
 * @param {String} url
 * @param {Function} callback
 */
function request (url, callback) {
    originRequest(url, callback);
}


/**
 * 获取文章分类列表
 *
 * @param {String} url
 * @param {Function} callback
 */

exports.classList = function (url,callback) {
    debug('读取文章分类列表：%s', url);

    console.log(url);

    request(url,function (err,res) {
        if (err){
            callback(err);
        }

        // 根据网页内容创建DOM操作对象
        var $ = cheerio.load(res.body.toString());
        // 读取博文类别列表
        var classList = [];

        $('.classList li a').each(function () {
            var $me = $(this);
            var item = {
                name: $me.text().trim(),
                url:  $me.attr('href')
            };
            var s = item.url.match(/articlelist_\d+_(\d+)_\d\.html/);
            if(Array.isArray(s)){
                item.id = s[1];
                classList.push(item);
            }

        });

        callback(null,classList);
    })
};


/**
 * 获取分类页面博文列表
 *
 * @param {String} url
 * @param {Function} callback
 */


function articlelist(url,callback) {
    debug('读取分类页面博文列表：%s', url);
    request(url,function (err,res) {
        if (err){
            callback(err);
        }
        // 根据网页内容创建DOM操作对象
        var $ = cheerio.load(res.body.toString());

        var articleList = [];

        $('.articleList .articleCell').each(function () {
            var $me = $(this);
            var $title = $me.find('.atc_title a');
            var $time = $me.find('.atc_tm');
            var item = {
                title: $title.text().trim(),
                url:   $title.attr('href'),
                time:  $time.text().trim()
            };
            var s = item.url.match(/blog_([a-zA-Z0-9]+)\.html/);
            if (Array.isArray(s)){
                item.id = s[1];
                articleList.push(item);
            }
        });

        var nextUrl = $('.SG_pgnext a').attr('href');
        if (nextUrl){
            articlelist(nextUrl,function (err,articleList2) {
                if (err) return callback(err);

                // 合并结果
                callback(null, articleList.concat(articleList2));
            });
        }else {
            callback(null,articleList);
        }
    });

};

exports.articleList = articlelist;

/**
 * 获取博文页面内容
 *
 * @param {String} url
 * @param {Function} callback
 */
function articleDetail(url,callback) {

    debug('读取博文内容：%s', url);

    request(url,function (err, res) {
        if(err){
            callback(err);
        }
        // 根据网页内容创建DOM操作对象
        var $ = cheerio.load(res.body.toString());

        // 获取文章标签
        var tags = [];

        $('.blog_tag h3 a').each(function () {
            var tag = $(this).text().trim();
            if (tag) {
                tags.push(tag);
            }
        });

        // 获取文章内容
        var content = $('.articalContent').html().trim();

        callback(null,{tags:tags,content:content});
    })
};

exports.articleDetail = articleDetail;