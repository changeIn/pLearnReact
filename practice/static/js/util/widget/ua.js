function parse(userAgent) {
    if (!userAgent || typeof userAgent !== "string") {
        return {};
    }

    var u = userAgent;

    //存储浏览器信息
    var obj = {};

    var hash = {
        //若需要添加360浏览器，直接将360Browser添加到listBroName数组的最前面即可
        listBroName: ['Opera', 'Firefox', 'JMBrowser', 'BaiDuBrowser', 'UCBrowser', 'QQBrowser', 'SouGouBrowser', 'LieBaoBrowser',
            '2345Browser', 'EdgeBrowser', 'QiyuBrowser', 'QuarkBrowser', 'YandexBrowser', 'TheWorldBrowser', 'XiaoMiBrowser', 'Chrome', 'Safari', 'IE'],
        listSysName: ['Windows', 'Windows Phone', 'Mac OS', 'iOS', 'Android', 'Linux']
    };

    var match = {
        /**
         * @return boolean
         */
        'IE': function () {
            return u.indexOf('MSIE') > 0 || u.indexOf('Trident') > -1;
        },
        /**
         * @return boolean
         */
        'Safari': function () {
            return u.indexOf('Safari') > -1 && u.indexOf('Version') > -1;
        },
        /**
         * @return boolean
         */
        'Chrome': function () {
            return u.indexOf('Chrome') > -1 || u.indexOf('CriOS') > -1;
        },
        /**
         * @return boolean
         */
        'Opera': function () {
            return u.indexOf('OPR') > -1 || u.indexOf('Opera') > -1;
        },
        /**
         * @return boolean
         */
        'Firefox': function () {
            return u.indexOf('Firefox') > -1 || u.indexOf('FxiOS') > -1;
        },
        /**
         * @return boolean
         */
        'JMBrowser': function () {
            return u.indexOf('JM_IOS') > -1 || u.indexOf('JM_ANDROID') > -1 || u.indexOf('JM_PC') > -1;
        },
        /**
         * @return boolean
         */
        'UCBrowser': function () {
            return u.indexOf('UBrowser') > -1 || u.indexOf('UC') > -1;
        },
        /**
         * @return boolean
         */
        'QQBrowser': function () {
            return u.indexOf('QQBrowser') > -1;
        },
        /**
         * @return boolean
         */
        'BaiDuBrowser': function () {
            return u.indexOf('BIDUBrowser') > -1 || u.indexOf('Baidu') > -1;
        },
        /**
         * @return boolean
         */
        'SouGouBrowser': function () {
            return u.indexOf('MetaSr') > -1 || u.indexOf('Sogou') > -1;
        },
        /**
         * @return boolean
         */
        'LieBaoBrowser': function () {
            return u.indexOf('LBBROWSER') > -1;
        },
        // '360Browser':u.indexOf('360EE') > -1|| u.indexOf('360SE') > -1,

        //这里已经在网上(非官方)初步确认关键字2345chrome为2345浏览器，后续若查到官方相关资料不是2345再修改，下为例子ua:
        //"Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.99 Safari/537.36 2345chrome v3.0.0.9739"
        /**
         * @return boolean
         */
        '2345Browser': function () {
            return u.indexOf('2345Explorer') > -1 || u.indexOf('2345chrome') > -1
        },
        /**
         * @return boolean
         */
        'EdgeBrowser': function () {
            return u.indexOf('Edge') > -1
        },
        /**
         * @return boolean
         */
        'QiyuBrowser': function () {
            return u.indexOf('Qiyu') > -1
        },
        /**
         * @return boolean
         */
        'QuarkBrowser': function () {
            return u.indexOf('Quark') > -1
        },
        /**
         * @return boolean
         */
        'YandexBrowser': function () {
            return u.indexOf('YaBrowser') > -1
        },
        /**
         * @return boolean
         */
        'TheWorldBrowser': function () {
            return u.indexOf('TheWorld') > -1
        },
        /**
         * @return boolean
         */
        'XiaoMiBrowser': function () {
            return u.indexOf('MiuiBrowser') > -1
        },
        /**
         * @return boolean
         */
        //系统类型
        'Windows': function () {
            return u.indexOf('Windows NT') > -1
        },
        /**
         * @return boolean
         */
        'Windows Phone': function () {
            return u.indexOf('Windows Phone') > -1
        },
        /**
         * @return boolean
         */
        'Android': function () {
            return u.indexOf('Android') > -1
        },
        /**
         * @return boolean
         */
        'iOS': function () {
            return u.indexOf('like Mac OS X') > -1
        },
        /**
         * @return boolean
         */
        'Mac OS': function () {
            return u.indexOf('Macintosh') > -1
        },
        /**
         * @return boolean
         */
        'Linux': function () {
            return u.indexOf('Linux ') > -1 || u.indexOf('X11') > -1
        }
    };
    var i;
    for (i = 0; i < hash["listBroName"].length; i++) {
        if (match[hash["listBroName"][i]]()) {
            obj["browser"] = hash["listBroName"][i];
            break;
        }
    }
    for (i = 0; i < hash["listSysName"].length; i++) {
        if (match[hash["listSysName"][i]]()) {
            obj["os"] = hash["listSysName"][i];
            break;
        }
    }

    var version = {
        /*
          猎豹浏览器在userAgent中无版本信息，以下为在猎豹中打印出的userAgent
          "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.75 Safari/537.36 LBBROWSER"
          浏览器版本为v6.0.114.15244
        */
        /**
         * @return string
         */
        'LieBaoBrowser': function () {
            return '';
        },
        'Chrome': function () {
            var t = u.replace(/^.*Chrome\/([\d+.]+).*$/, '$1').replace(/^.*CriOS\/([\d.]+).*$/, '$1');
            return t === u ? '' : t;
        },
        'IE': function () {
            //IE11 和 IE10以及以下区别
            var t = u.replace(/^.*MSIE ([\d+.]+).*$/, '$1');
            if (t === u) {
                var k = u.replace(/^.*rv:([\d+.]+).*$/, '$1');
                return k === u ? '' : k;
            } else {
                return t;
            }
        },
        'JMBrowser': function () {
            return u.replace(/^.*JM_(IOS|ANDROID|PC)\/([\d+.]+).*$/, '$2');
        },
        'UCBrowser': function () {
            return u.replace(/^.*UC?Browser\/([\d+.]+).*$/, '$1');
        },
        'QQBrowser': function () {
            return u.replace(/^.*QQBrowser\/([\d+.]+).*$/, '$1').replace(/^.*QQBrowserLite\/([\d+.]+).*$/, '$1');
        },
        'BaiDuBrowser': function () {
            //兼容特殊格式"Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; WOW64; Trident/6.0; BIDUBrowser 8.7)"
            return u.replace(/^.*BIDUBrowser( |\/)([\w+.]+).*$/, '$2').replace(/^.*baiduboxapp\/([\w+.]+).*$/, '$1').replace(/^.*baidubrowser\/([\w+.]+).*$/, '$1');
        },
        'SouGouBrowser': function () {
            return u.replace(/^.*SE ([\d.X]+).*$/, '$1').replace(/^.*SogouMobileBrowser\/([\d.]+).*$/, '$1');
        },
        'Firefox': function () {
            return u.replace(/^.*Firefox\/([\d+.]+).*$/, '$1').replace(/^.*FxiOS\/([\w.]+).*$/, '$1');
        },
        'Safari': function () {
            return u.replace(/^.*Version\/([\d+.]+).*$/, '$1');
        },
        'Opera': function () {
            /*
            Opera 历史版本userAgent  http://www.useragentstring.com/pages/useragentstring.php?name=Opera
            如果OPR关键字存在则直接返回，不存在则先判断Version关键字存不存在，存在 直接返回，不存在则按照Opera关键字处理
            */
            var r = u.replace(/^.*OPR\/([\d+.]+).*$/, '$1');
            if (r === u) {
                var c = u.replace(/^.*Version\/([\d+.]+).*$/, '$1');
                return c === u ? u.replace(/^.*Opera( |\/)?([\d+.]+).*$/, '$2') : c;
            } else {
                return r;
            }
        },
        // '360Browser':function(){
        //   return ''
        // },
        '2345Browser': function () {
            return u.replace(/^.*2345Explorer\/([\d+.]+).*$/, '$1').replace(/^.*2345chrome ([\w+.]+).*$/, '$1');
        },
        'EdgeBrowser': function () {
            return u.replace(/^.*Edge\/([\d+.]+).*$/, '$1');
        },
        'QiyuBrowser': function () {
            return u.replace(/^.*Qiyu\/([\d+.]+).*$/, '$1');
        },
        'QuarkBrowser': function () {
            return u.replace(/^.*Quark\/([\d+.]+).*$/, '$1');
        },
        'YandexBrowser': function () {
            return u.replace(/^.*YaBrowser\/([\d+.]+).*$/, '$1');
        },
        'TheWorldBrowser': function () {
            return u.replace(/^.*TheWorld (\d).*$/, '$1');
        },
        'XiaoMiBrowser': function () {
            return u.replace(/^.*MiuiBrowser\/([\d+.]+).*$/, '$1');
        }
    };

    //识别系统版本号
    var osVersion = {
        'Windows': function () {
            var v = u.replace(/^.*Windows NT ([\d+.]+)(;)?.*$/, '$1');
            var info = {
                '10.0': '10',
                '6.3': '8.1',
                '6.2': '8',
                '6.1': '7',
                '6.0': 'Vista',
                '5.2': 'XP',
                '5.1': 'XP'
            };
            return info[v] || v;
        },
        'Windows Phone': function () {
            return u.replace(/^.*Windows Phone ([\d.]+);.*$/, '$1');
        },
        'Android': function () {
            return u.replace(/^.*Android ([\d.]+).*$/, '$1');
        },
        'iOS': function () {
            return u.replace(/^.*OS ([\d_]+) like.*$/, '$1').replace(/_/g, '.')
        },
        'Mac OS': function () {
            var c = u.replace(/^.*Mac OS X ([\d_|.]+).*$/, '$1').replace(/_/g, '.');
            return c === u ? '' : c
        }
    };

    //知道了浏览器名字以后获取浏览器版本
    if (version[obj["browser"]]) {
        obj["version"] = version[obj["browser"]]();
    }

    //获取系统版本
    switch (obj['os']) {
        case 'Windows':
            obj['os'] += ' ' + osVersion['Windows']();
            break;
        case 'Windows Phone':
            obj['os'] += ' ' + osVersion['Windows Phone']();
            break;
        case 'Android':
            obj['os'] += ' ' + osVersion['Android']();
            break;
        case 'iOS':
            obj['os'] += ' ' + osVersion['iOS']();
            break;
        case 'Mac OS':
            obj['os'] += ' ' + osVersion['Mac OS']();
            break;
    }
    return obj;
}

module.exports.parse = parse;