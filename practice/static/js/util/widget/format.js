
/**
 * 格式化函数
 * 提供数据格式化服务，目前支持**数字**，**货币**，**日期**，**百分比**的格式化，接受两个参数，输入数据和格式化的pattern，基本规则是 *格式化类型_参数1_参数2* ，pattern详细书写规则如下：

 - 数字：number_精度（数字）_是否保留+-号（数字0，1）
 - 货币：currency_货币单位($,￥等)
 - 日期：date_日期的格式  其中日期的格式，支持常见的日期格式yyyy,yy,y,MMMM,MMM,MM,M,dd,d 等等
 - 百分比:percent_精度_是否保留+-号_是否*100

 * @param  {[type]} input 输入字符串
 * @param  {[type]} param [description]
 * @return {[type]}       [description]
 */
var _dateConfig = {
    pattern_ymd: 'yyyy-MM-dd',
    pattern_ym: 'yyyy-MM',
    pattern_md: 'MM-dd',
    pattern_week: ['SUN','MON','TUE','WED','THU','FRI','SAT'],
    pattern_ymd_cn: 'yyyy年MM月dd日',
    pattern_ym_cn: 'yyyy年MM月',
    pattern_md_cn: 'MM月dd日',
    pattern_week_cn: ['日','一','二','三','四','五','六'],

    datetime_mm: 6e4,
    datetime_hh: 36e5,
    datetime_dd: 864e5
};

export default function(input, param){


        var tmpDateFormat = "yyyy-MM-dd";
        var tmpCurrency = "￥";
        var tmpPercentCharactor = "%";


         var formatDate = function(_date, _pattern){
            _date = _date||new Date();


            // 解决 格式化grace时间对象的兼容问题
            // update by yuhongping@jd.com 20160223
            if (!(_date instanceof Date)) {
                if (_date.date && _date.date instanceof Date) {
                    _date = _date.date;
                } else {
                    throw new Error('第一个参数请传入时间类型！');
                }
            }

            var returnVal = _pattern||_dateConfig.pattern_ymd;
            returnVal = returnVal.replace(/yyyy|YYYY/,_date.getFullYear());
            returnVal = returnVal.replace(/yy|YY/,(_date.getFullYear() % 100)>9?(_date.getFullYear() % 100).toString():'0' + (_date.getFullYear() % 100));
            returnVal = returnVal.replace(/MM/,(_date.getMonth()+1)>9?(_date.getMonth()+1).toString():'0'+(_date.getMonth()+1));
            returnVal = returnVal.replace(/M/g,_date.getMonth()+1);
            returnVal = returnVal.replace(/w|W/g,_dateConfig.pattern_week_cn[_date.getDay()]);
            returnVal = returnVal.replace(/dd|DD/,_date.getDate()>9?_date.getDate().toString():'0' + _date.getDate());
            returnVal = returnVal.replace(/d|D/g,_date.getDate());
            returnVal = returnVal.replace(/hh|HH/,_date.getHours()>9?_date.getHours().toString():'0' + _date.getHours());
            returnVal = returnVal.replace(/h|H/g,_date.getHours());
            returnVal = returnVal.replace(/mm/,_date.getMinutes()>9?_date.getMinutes().toString():'0' + _date.getMinutes());
            returnVal = returnVal.replace(/m/g,_date.getMinutes());
            returnVal = returnVal.replace(/ss|SS/,_date.getSeconds()>9?_date.getSeconds().toString():'0' + _date.getSeconds());
            returnVal = returnVal.replace(/s|S/g,_date.getSeconds());
            return returnVal;
        };

        /**
         * 将数据转成千分位
         * @param num 要转换的数字，可为整数或者浮点数
         * @param dec 要保留的小数位
         * @returns {string}
         */
        function formatThousands (num, dec) {
            num = Number(num);
            if (dec) {
                num = num.toFixed(dec);
            }
            return (num + '').replace(/^[-\+]?\d+/, function (v) {
                return v.replace(/\d{1,3}(?=(\d{3})+$)/g, '$&,');
            });
        }

        var formatters = {

            number:function(input, param){
                input = parseFloat(input);
                param = param || "";
                var tmp = param.split("_");

                var res = formatThousands(input, tmp[0] || 0);
                if(parseInt(tmp[1])){
                    input > 0 && (res = "+"+res)
                }
                return res;
            },

            percent:function(input, param){
                var multiply100;
                if(param && (multiply100 = param.split("_")[2]) && parseInt(multiply100)){
                    input = parseFloat(input)*100;
                }
                return this.number(input,param)+tmpPercentCharactor;
            },

            date:function(input,param){
                if(!param){
                    return formatDate(input,tmpDateFormat);
                }
                else{
                    return formatDate(input,param);
                }
            },

            currency:function(input,param){
                var tmp = param.split("_")[1] || '￥';
                //如果传过来的数据带有金钱符号 做容错处理
                return input.toString().indexOf(tmp)>=0 ? input : tmp + this.number(input,param);
                // if(!param){
                //     return $filter("currency")(input, tmpCurrency);
                // }
                // else{
                //     return $filter("currency")(input, param);
                // }

            },

            limitTo:function(str, n){

                if(!param) return input;

                if(!str){
                    return "";
                }
                var ilen = str.length;
                if (ilen * 2 <= n) return str;
                n -= 3;
                var i = 0;
                while (i < ilen && n > 0) {
                    if (escape(str.charAt(i)).length > 4) n--;
                    n--;
                    i++;
                }
                if (n > 0 || (i == ilen && n == 0)) return str;
                return str.substring(0, i) + "...";
            
            
            },

            typeCast:function(input,param){

                switch(param){
                    case "i":
                        return parseInt(input);
                    case 'f':
                        return parseFloat(input);
                    case 's':
                        if(input instanceof Object) return JSON.stringify(input);
                        return input+"";
                    case 'o':
                        return input && JSON.parse(input) || input;
                    case 'b':
                        if(input == 'true') return true;
                        else if(input == 'false' || input == '0' || input == 'undefined' || input == 'null') return false;
                        else return !!input;
                    default :
                        return input;
                        break;
                }

            }

        }

        function valueFormatter(input,param){
            if(input === null || input === '' || input === undefined){
                return input;
            }
            var index = (param||"").indexOf("_");

            if(index == -1){
                var type = param;
                param = null;
            }
            else{
                var type = param.substr(0,index);
                param = param.substr(index+1);
            }

            if(formatters[type]){

                return formatters[type](input,param);
            }


            return input;

        }

        return valueFormatter(input,param);

   
}



/*

 <MySwitch list={list} currentValue={currentValue} onChange={this.onChangeList}/>
 <div>{currentValue}</div>

数据结构
{
    list: [{text: '全部下单客户', value: 999999}, {text: '新下单客户', value: 0}, {text: '老下单客户', value: 1}],
    currentValue:999999
};
 */