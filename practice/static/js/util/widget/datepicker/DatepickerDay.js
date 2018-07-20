import React, { Component } from "react";
import { formatDate, convertDyadicArray, previousDay} from "./util";
import DatepickerHeader from "./uicomponent/DatepickerHeader";
import DatepickerDayBody from "./uicomponent/DatepickerDayBody";
import 'css/widget/graceDatepicker.scss';

class DatepickerDay extends Component {

    static defaultProps = {
        minDate: "", //string
        maxDate: "", //sting
        pushDataTaskTime: 8, //时效性默认为8点
        code:'day',
        name:"按日查询",
        defaultStartDate:"",  //初始化需要选中的日期,这个值可以不传，但是不能为空
        format: 'yyyy-MM-dd',
        isInit: true, //是否初始化选中需要选中的日期（比如日选中当天，周选中当周，范围选择当前范围）
        isShow: false, //是否初始化显示DOM
        //表示选中的日期对应的组件的code
        curSelDateMapCode: "",  //为空的情况表示单独使用这个组件，可以忽略这个配置；当与别的组件组合的时候，就需要这个组件
        showTimeSet:false,//显示时分,以及确认按钮
        readSzGlobalTime:false,
        errorTip:"最多只能选择31天"
    };

    constructor(props) {
        super(props);

        //临时使用的，后期去掉
        this.temDayRangeDate = null;

        //周和日  都要能适配，而且还有自定义日期
        //state中要有个startDate，和一个endDate
        this.state = this.initState();
        this.clickDateHandler = this.clickDateHandler.bind(this);
        this.headerClickHandler = this.headerClickHandler.bind(this);
        this.clickCount = 0; //用来记录点击次数，给自定义日期用的，其他情况虽然用不到，但是这么简单的变量不妨碍整体，这样就不用根据code判断了
    }

    /**
     * 初始化state
     */
    initState() {
        let { minDate, maxDate, defaultStartDate,dayRangeEndDate, pushDataTaskTime, code } = this.props,
            preDate = previousDay(new Date(), 1);
        //在这里得判断时效性，

        if(code === "usually") {
            minDate = previousDay(preDate, 29);
        } else {
            minDate = minDate ? new Date(minDate) : "";
        }
        maxDate = maxDate ? new Date(maxDate) : preDate;

        if(defaultStartDate) {
            defaultStartDate = new Date(defaultStartDate);
        } else {
            if(preDate.getHours() >= pushDataTaskTime) {
                defaultStartDate = preDate;
            } else {
                defaultStartDate = previousDay(preDate, 1);
            }
        }

        return {
            minDate,
            maxDate,
            renderDate: defaultStartDate
        };
    }

    componentWillUpdate(nextProps, nextState) {
        let {curSelDateMapCode, code, isShow} = nextProps;
        if( (curSelDateMapCode !== code && code !== "dayRange") || (code ==="dayRange" && !isShow) ) {
            var temDateObj = new Date(2050,0,1);
            this.addCurDateClass(temDateObj, temDateObj, nextState.dateList);
            if(code === "dayRange" && this.clickCount%2 !== 0) {
                //还需要还原日期
                this.clickCount++;
            }
        }
    }

    componentWillMount() {
        const {renderDate} = this.state,
            {code, isInit} = this.props;
        let dateList = this.getDateList(),
            corverDateList = convertDyadicArray(dateList, 7),
            startDate, endDate, temRetDate;

        if(code !== "week") {
            if(code == "dayRange" && this.props.dayRangeEndDate) {
                startDate = renderDate;
                endDate = new Date(this.props.dayRangeEndDate);
            } else {
                startDate = endDate = renderDate;
            }
        } else {
            let temCurDate = new Date(); temCurDate.setHours(13);
            let temCurDateTime = temCurDate.getTime();
            for(var i=0; i<corverDateList.length; i++) {
                //三种情况，周的开头，周的末尾，周的中间，开头或者末尾的话，就是年月日相等。中间的话就是getTime
                if((corverDateList[i][0].date.getTime() <= temCurDateTime && corverDateList[i][6].date.getTime() >= temCurDateTime)
                    || formatDate(corverDateList[i][0].date, "yyyy-MM-dd") ===  formatDate(temCurDate, "yyyy-MM-dd")
                    || formatDate(corverDateList[i][6].date, "yyyy-MM-dd") ===  formatDate(temCurDate, "yyyy-MM-dd")
                    || this.state.minDate.getTime() > corverDateList[i][0].date.getTime()
                    || this.state.maxDate.getTime() < corverDateList[i][6].date.getTime()
                ) {
                    for(var j=0; j<corverDateList[i].length; j++) {
                        corverDateList[i][j].disSelect = true;
                    }
                }
            }
            //week的情况
            temRetDate = this.createWeekDateRange(renderDate, corverDateList);

            startDate = temRetDate.startDate;
            endDate = temRetDate.endDate;
        }

        if(isInit) {
            this.addCurDateClass(startDate, endDate, dateList);
            if(isInit && code === "dayRange") {
                this.addCurDateClassUseVorverDateList(startDate, endDate, corverDateList);
            }
        }

        this.setState({
            startDate,
            endDate,
            dateList,
            corverDateList,
        });
    }

    addCurDateClassUseVorverDateList(startDate, endDate, corverDateList) {
        let temDateNode = null,
            format = "yyyyMMdd";
        for(var i=0; i<corverDateList.length; i++) {
            for(var j=0; j<corverDateList[i].length; j++) {
                temDateNode = corverDateList[i][j];
                temDateNode.isSelected = false;
                if (formatDate(temDateNode.date, format) == formatDate(startDate, format)
                    || formatDate(temDateNode.date, format) == formatDate(endDate, format)) {
                    temDateNode.isSelected = true;
                }
            }
        }
    }


    /**
     * 更新state
     * @param {*} renderDate 要渲染日期面板的日期
     * @param {*} startDate 只有初始化时才可以没有startDate
     */
    updateState(selectDate, updateDateList) {
        const {code, curSelDateMapCode} = this.props;
        let startDate = null, endDate = null, temRetDate;
        //有开始日期说明只是更新startDate、endDate
        if(updateDateList) {
            if(code === "day" || code === "usually") {
                endDate = startDate = selectDate;
                this.addCurDateClass(startDate, endDate, this.state.dateList);
            } else if(code === "week"){
                temRetDate = this.createWeekDateRange(selectDate, this.state.corverDateList);
                startDate = temRetDate.startDate;
                endDate = temRetDate.endDate;
                this.addCurDateClass(startDate, endDate, this.state.dateList);
            } else {
                //自定义
                if(this.clickCount%2 !== 0) {
                    //选择第一个日期
                    endDate = startDate = selectDate;
                } else {
                    //选择第二个日期
                    endDate = this.state.startDate;
                    if(selectDate.getTime() < endDate.getTime()) {
                        startDate = selectDate;
                    } else {
                        startDate = endDate;
                        endDate = selectDate;
                    }
                }
            }
            return {
                startDate,
                endDate
            };
        } else {
            //没有开始日期，说明要更新的是corverDateList
            let dateList = this.getDateList(selectDate),
                corverDateList = convertDyadicArray(dateList, 7);

            //切换日期类型的时候，要初始化当前这个日期类型（我需要确认什么时候需要加class)
            if(curSelDateMapCode === code) {
                this.addCurDateClass(this.state.startDate, this.state.endDate, dateList);
            }

            if(code === "week") {
                let temCurDate = new Date(); temCurDate.setHours(13);
                let temCurDateTime = temCurDate.getTime();
                for(var i=0; i<corverDateList.length; i++) {
                    //三种情况，周的开头，周的末尾，周的中间，开头或者末尾的话，就是年月日相等。中间的话就是getTime;
                    if((corverDateList[i][0].date.getTime() <= temCurDateTime && corverDateList[i][6].date.getTime() >= temCurDateTime)
                        || formatDate(corverDateList[i][0].date, "yyyy-MM-dd") ===  formatDate(temCurDate, "yyyy-MM-dd")
                        || formatDate(corverDateList[i][6].date, "yyyy-MM-dd") ===  formatDate(temCurDate, "yyyy-MM-dd")
                        || this.state.minDate.getTime() > corverDateList[i][0].date.getTime()
                        || this.state.maxDate.getTime() < corverDateList[i][6].date.getTime()
                    ) {
                        for(var j=0; j<corverDateList[i].length; j++) {
                            corverDateList[i][j].disSelect = true;
                            corverDateList[i][j].isSelected = false;
                        }
                    }
                }
            }

            return {
                corverDateList,
                dateList,
                renderDate: selectDate
            }
        }
    }

    /**
     * 根据开始日期和数据源生成结束日期
     * @param {*} startDate 开始日期
     * @param {*} corverDateList
     */
    createWeekDateRange(startDate, corverDateList) {
        let {minDate, maxDate} = this.state;
        let temDateTime = startDate.getTime(),
            tem, endDate, len = 0;
        for(let i=0; i<corverDateList.length; i++) {
            tem = corverDateList[i];
            len = tem.length;
            if(temDateTime<=tem[len-1].date.getTime()) {
                if(minDate.getTime() > tem[0].date.getTime())
                    startDate = minDate;
                else
                    startDate = tem[0].date
                if(maxDate.getTime() < tem[len-1].date.getTime())
                    endDate = maxDate;
                else
                    endDate = tem[len-1].date
                break;
            }
        }
        return {
            startDate,
            endDate
        }
    }

    /**
     * 获取日历数据源,根据状态的renderDate
     */
    getDateList(dateObj) {
        let {minDate, maxDate, renderDate} = this.state;
        let {code} = this.props;
        //debugger
        this.temDayRangeDate = null;
        if(dateObj) {
            renderDate = dateObj
        } else if(code === "dayRange" && this.props.dayRangeEndDate) {
            renderDate = new Date(this.props.dayRangeEndDate);
            this.temDayRangeDate = renderDate;
        }
        //debugger;
        let year = renderDate.getFullYear(),
            month = renderDate.getMonth(),
            curMonthLastDayObj = new Date(year, month+1, 0), // 当月有最后一天 obj
            preMonthLastDayObj = new Date(year, month, 0), //上月最后一天 obj
            lastWeek = preMonthLastDayObj.getDay(), // 上个月最后一天是周几
            list = [],
            temDateObj = null,
            comparePttern = "yyyyMMdd",
            patternDate = "",
            patternMinDate = formatDate(minDate, comparePttern),
            patternMaxDate = formatDate(maxDate, comparePttern);

        // 计算上月出现在 📅 中的日期
        for (let i = lastWeek; i > 0; i--) {
            temDateObj = new Date(year, month-1, preMonthLastDayObj.getDate()-i+1); temDateObj.setHours(10);
            patternDate = formatDate(temDateObj, comparePttern);
            list.push({
                "date": temDateObj, value:formatDate(temDateObj, "dd"), isSelected: false,
                disSelect: patternDate < patternMinDate || patternDate > patternMaxDate,
                className:"date-item", tdClassName:"pre-month-td"
            });
        }

        // 当月
        for (let i = 1; i < curMonthLastDayObj.getDate() + 1; i++) {
            temDateObj = new Date(year, month, i); temDateObj.setHours(10);
            patternDate = formatDate(temDateObj, comparePttern);
            list.push({
                "date": temDateObj, value:formatDate(temDateObj, "dd"), isSelected: false,
                disSelect: patternDate < patternMinDate || patternDate > patternMaxDate,
                className: "date-item", tdClassName:"cur-month-td"
            });
        }

        let temp = list.length % 7;
        if (temp) {
            // 说明还有下月,补足剩余的天数
            for (let i = 1; i < 8 - temp; i++) {
                temDateObj = new Date(year, month+1, i); temDateObj.setHours(10);
                patternDate = formatDate(temDateObj, comparePttern);
                list.push({
                    "date": temDateObj, value:formatDate(temDateObj, "dd"), isSelected: false,
                    disSelect: patternDate < patternMinDate || patternDate > patternMaxDate,
                    className: "date-item", tdClassName:"next-month-td"
                });
            }
        }

        return list
    }

    /**
     * 对应日期头部的点击事件
     * @param {object} evItem
     */
    headerClickHandler(evItem) {
        let {renderDate} = this.state,
            year = renderDate.getFullYear(),
            month = renderDate.getMonth();

        if(evItem.type === 0) {
            //pre month
            if (month === 0) {
                year--;
                month = 11;
            } else {
                month--;
            }
        } else if(evItem.type === 1) {
            //pre year
            year--;
        } else if(evItem.type === 2) {
            //next month
            if(month === 11) {
                month = 0;
                year++;
            } else {
                month++;
            }
        } else {
            //next year
            year++;
        }
        //改变组件状态值，通过this.setState()
        this.setState(this.updateState(new Date(year, month)));
    }

    /**
     * 对应点击日期的回调事件
     * @param {*} index
     * @param {*} dateNode
     * @param {*} item
     */
    clickDateHandler(index, dateNode, item) {
        if(dateNode.disSelect) return;
        this.clickCount++;
        let {code, name, range} = this.props,
            temDate = dateNode.date, retObj = this.updateState(temDate, true);

        if(code === "dayRange") {
            if(this.clickCount%2 === 0) {
                //自定义日期，并且选到第二个日期了
                if( this.calDateDisRetDay(retObj.startDate, retObj.endDate) > range) {
                    //alert("选择天数间隔过长，请重新选择");
                    this.props.selectHandler("error", this.props.errorTip);
                    this.clickCount --;
                } else {
                    this.addCurDateClass(retObj.startDate, retObj.endDate, this.state.dateList);
                    this.setState(retObj);
                    this.props.selectHandler([retObj.startDate, retObj.endDate, code, name]);
                }
            } else {
                this.addCurDateClass(retObj.startDate, retObj.endDate, this.state.dateList);
                this.setState(retObj);
            }
        } else {
            this.setState(retObj);
            this.props.selectHandler([retObj.startDate, retObj.endDate, code, name]);
        }

    }

    calDateDisRetDay(startDate, endDate) {
        return Math.floor((endDate.getTime() - startDate.getTime())/(24*60*60*1000))+1;
    }

    /**
     * 给当前的日期加上相关className
     */
    addCurDateClass(startDate, endDate, dateList) {
        let temDateNode = null,
            format = "yyyyMMdd";
        for (let key in dateList) {
            temDateNode = dateList[key];
            temDateNode.isSelected = false;
            if (formatDate(temDateNode.date, format) >= formatDate(startDate, format)
                && formatDate(temDateNode.date, format) <= formatDate(endDate, format)) {
                temDateNode.isSelected = true;
            }
        }
    }

    render() {
        let {isInit, isShow, showTimeSet,code, dayRangeEndDate} = this.props,
            year, month;

        // if(code === "dayRange" && dayRangeEndDate) {
        //   if(formatDate(this.state.renderDate, "MM") < formatDate(new Date(this.props.dayRangeEndDate), "MM")) {
        //       month = formatDate(new Date(this.props.dayRangeEndDate), "MM");
        //   } else {
        //       month = formatDate(this.state.renderDate, "MM");
        //   }
        //   year = formatDate(this.state.renderDate, "yyyy");
        //
        // } else {
        //   year = formatDate(this.state.renderDate, "yyyy");
        //   month = formatDate(this.state.renderDate, "MM");
        // }
        year = formatDate(this.state.renderDate, "yyyy");
        month = formatDate(this.state.renderDate, "MM");

        if(this.temDayRangeDate && code === "dayRange") {
            //debugger
            month = "04";
        }

        return (
            <div className="grace-datepicker" style={{"display":isShow?"block":"none"}}>
              <div className="grace-datepicker-cont">
                <DatepickerHeader
                    year={year}
                    month={month}
                    headerClickHandler={this.headerClickHandler} />
                <DatepickerDayBody
                    code = {code}
                    isInit = {isInit}
                    showTimeSet = {showTimeSet}
                    corverDateList={this.state.corverDateList}
                    clickDateHandler={this.clickDateHandler} />
              </div>
            </div>
        )

    }

}

export default DatepickerDay;