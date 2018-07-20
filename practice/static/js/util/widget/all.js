/**
 * Created by chenhaifeng on 2017/6/22.
 */

import $ from 'n-zepto';
import React from 'react'

const hasOwn = Object.prototype.hasOwnProperty;
var Util = {};
import { Format } from 'util'
import jingmaiPng from '../../../img/logout.png';

let resetScrollHeight = () => {
    let top = $('.msz-scroller').length > 0 && $('.msz-scroller').position().top,
        btmHeight = $('#menu').height(),
        bodyHeight = $(document.body).height(),
        height = bodyHeight - top - btmHeight;
    $('.msz-scroller').height(height);
}

let customFetch = (ajaxObj) => {
    if (navigator && navigator.onLine) {
        return $.ajax(ajaxObj);
    } else {
        $(window).trigger('user_offline');
    }
    return;
}

//写cookies
let setCookie = (c_name, value, expiredays) => {
    var exdate = new Date();
    　　　　exdate.setDate(exdate.getDate() + expiredays);
    　　　　document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
}

//读取cookies
let getCookie = (name) => {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");

    if (arr = document.cookie.match(reg))
        return (arr[2]);
    else
        return null;
}

/**
 * 判断日期是否在指定的日期范围里
 * @param  {[type]} startDate [description]
 * @param  {[type]} endDate   [description]
 * @param  {[type]} minDate   [description]
 * @param  {[type]} maxDate   [description]
 * @return {[type]}           [description]
 */
let isOutRangeDate = (startDate, endDate, _minDate, _maxDate) => {
    let regex = /\d{4}-\d{1,2}-\d{1,2}/;

    let yesterday = Format(new Date(new Date().getTime() - 86400000), "date_yyyy-MM-dd");
    let minDate = _minDate || '2016-01-01';
    let maxDate = _maxDate || yesterday;
    let ret = false;
    if (!(regex.test(startDate) && regex.test(endDate))) {
        return;
    }


    if (new Date(startDate) < new Date(minDate) || new Date(endDate) > new Date(maxDate)) {
        ret = true;
    }

    return ret;

}

let isJingMai = () => {
    return /JM_IOS|JM_ANDROID/.test(navigator.userAgent);
    // return /JM_IOS|JM_ANDROID/.test(navigator.userAgent) && ( typeof _JmJsBridge!='undefined' ) ;
}

let setMetaTitle = (title, isChangeTitle) => {
    if (!isJingMai()) {
        return;
    }
    if (isChangeTitle && /\/detail/.test(document.location.pathname)) {
        return;
    }
    document.title = title || "";
    let mobile = navigator.userAgent.toLowerCase()
    if (/iphone|ipad|ipod/.test(mobile)) {
        let iframe = document.createElement('iframe')
        iframe.style.visibility = 'hidden'
        // 替换成站标favicon路径或者任意存在的较小的图片即可
        iframe.setAttribute('src', jingmaiPng);
        let iframeCallback = function () {
            setTimeout(function () {
                iframe.removeEventListener('load', iframeCallback)
                document.body.removeChild(iframe)
            }, 0)
        }
        iframe.addEventListener('load', iframeCallback)
        document.body.appendChild(iframe)
    }
}

//删除cookies
let delCookie = (name) => {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null)
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}

let cycleGraph = (chartConfig) => {
    return $.extend(true, {
        chart: {
            type: 'pie',
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            marginTop: 5,
            marginBottom: 40
        },
        title: {
            text: ''
        },
        credits: {
            enabled: false
        },
        plotOptions: {
            pie: {
                innerSize: '62%',
                cursor: 'pointer',
                showInLegend: true,
                dataLabels: false,
                borderColor: null,
                point: {
                    events: {
                        legendItemClick: function (event) {
                            return false;
                        }
                    }
                }
            },
            series: {
                animation: false,
                states: {
                    hover: {
                        enabled: false
                    }
                }
            }
        },
        colors: ['#4671bd', '#199bfc', '#15c2c2', '#29b952', '#efda7a', '#e5b167', '#8697e9', '#ffe2e2'],
        xAxis: {
            visible: false
        },
        yAxis: {
            visible: false,
            gridLineWidth: 0
        },
        legend: {
            enabled: true,
            symbolRadius: 8,
            symbolWidth: 8,
            symbolHeight: 8,
            margin: 0,
            padding: 2,
            layout: 'vertical',
            y: 10,
            itemStyle: {
                color: '#666',
                fontSize: '12px',
                fontWeight: 'lighter',
                cursor: 'default'
            }
        },
        exporting: {
            enabled: false
        }
    }, chartConfig);
}

export function strEllip(str, n) {
    if (!str) {
        return "";
    }
    let ilen = str.length;
    if (ilen * 2 <= n) return str;
    n -= 3;
    let i = 0;
    while (i < ilen && n > 0) {
        if (escape(str.charAt(i)).length > 4) n--;
        n--;
        i++;
    }
    if (n > 0 || (i === ilen && n === 0)) return str;
    return str.substring(0, i) + "...";
}
export function indicatorRightControl(indicatorStr, FormatParam) {
    if (indicatorStr === '_PPZH_NO_AUTH_' || indicatorStr === null) {
        return '--';
    }
    else if (FormatParam) {
        return Format(indicatorStr, FormatParam);
    }
    else {
        return indicatorStr;
    }
}
/**
 * 判断当前AJAX请求是否成功
 * @param  {[type]}  res [description]
 * @param  {Boolean=}  checkContent [是否校验content] - false
 * @return {Boolean}     true表示 ajax请求成功，false表示未成功
 *
 * 监测的逻辑：如果checkContent为true，则在status是0的情况下会继续检测content
 * 检测content时，如果content是null或undefined或不是对象或是数组，则返回false
 */
export function isSuccRes(res, checkContent) {
    let ret = res && Number(res.status) === 0;

    if (!ret || !checkContent) {
        // 如果status不为0，则checkContent即便是true也不会再继续检测content了
        return ret;
    }

    if (!res.content || (typeof res.content !== 'object') || (res.content instanceof Array)) {
        ret = false;
    }
    return ret;
}
/**
 *
 * @param res
 * @returns {boolean}
 * 返回状态值为0，验证content是否是空对象；返回状态值非0，打印错误信息。
 */
export function isContentEmpty(res) {
    if (isSuccRes(res, true)) {       //返回结果正确，且status为0
        if (res.content.toString() === '' || res.content === null || JSON.stringify(res.content) === "{}") {
            console.log('错误：status为零，但content数据为空！');
            return true;
        }
        else {
            return false;
        }
    }
    else {
        let msg = res.message || 'empty';
        console.log('错误信息:' + msg + ' | 返回内容:' + JSON.stringify(res.content));
        return true;
    }
}

/**
 * @desc  生成环比上升下降样式
 * @param {string} text 源数据
 * @param {string} FormatParam 格式化字符串
 * @param {string} mode 模式[jsx/string]
 * @return jsx fragment/ or string
 */
export function generateRankChain(text, FormatParam, mode) {
    let sign = text >= 0 ? "rise" : "decline";
    let formatText = FormatParam ? Format(text, FormatParam) : Math.abs(text);
    let _mode = mode || 'JSX'
    if (_mode === 'JSX' || _mode === 'jsx') {
        return <span className="chain-tag" sign={sign}>
            <span className='arrow-span'></span>
            {formatText}
        </span>
    } else if (_mode == 'string') {
        return `<span class="chain-tag" sign=${sign}>
                    <span class='arrow-span'></span>
                    ${formatText}
                </span>`
    }
}

/**
 * @desc  生成排名样式
 * @param {string} rank源数据
 * @return jsx fragment
 */
export function generateRank(rank) {
    return <span className="rank-tag" rank={rank}>
        {rank}
    </span>
}

export function replaceHttpHeader(url) {
    return url.replace(/https:\/\/|http:\/\/|\/\//, '');
}

export function dealParamsDefaultValue(params) {
    Object.keys(params).forEach(function (item, index) {
        if (params[item] === '' || params[item] === null) {
            params[item] = '_NO_VALUE_';
        }
    });
    return params;
}
Util = {
    resetScrollHeight: resetScrollHeight,
    customFetch: customFetch,
    isOutRangeDate: isOutRangeDate,
    isJingMai: isJingMai,
    setMetaTitle: setMetaTitle,
    strEllip: strEllip,
    indicatorRightControl: indicatorRightControl,
    cycleGraph: cycleGraph,
    isContentEmpty: isContentEmpty,
    dealParamsDefaultValue: dealParamsDefaultValue,
    replaceHttpHeader: replaceHttpHeader,
    generateRankChain: generateRankChain,
    generateRank: generateRank
}
Util.cookieMethod = { setCookie, getCookie, delCookie }

export default Util;
