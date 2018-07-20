import React, { Component } from "react";
import { formatDate, convertDyadicArray, previousDay} from "./util";
import DatepickerHeader from "./uicomponent/DatepickerHeader";
import DatepickerDayBody from "./uicomponent/DatepickerDayBody";
import 'css/widget/graceDatepicker.scss';

/*
 * 处理大促日这样的日期
 * */
class DatepickerPromotionDay extends Component {

    static defaultProps = {
        code:'promotionDay',
        name:"大促日",
        defaultStartDate:"",  //初始化需要选中的日期,必传
        defaultEndDate:"", //促销结束日期，可以不传，不传就和defaultStartDate一样
        format: 'yyyy-MM-dd',
        isInit: true, //是否初始化选中需要选中的日期（比如日选中当天，周选中当周，范围选择当前范围）
        isShow: false, //是否初始化显示DOM
        //表示选中的日期对应的组件的codes
        curSelDateMapCode: ""  //为空的情况表示单独使用这个组件，可以忽略这个配置；当与别的组件组合的时候，就需要这个组件
    };

    constructor(props) {
        super(props);
        let renderDate = null;
        if(this.props.defaultStartDate) {
            renderDate = new Date(this.props.defaultStartDate);
        } else {
            renderDate = previousDay(new Date(), 1);
        }
        /**
         * state 中所有的属性
         * dateList,
         * corverDateList,
         * renderDate
         * */
        this.state = { renderDate };
        this.state.dateList = this.getDateList(renderDate);
        this.state.corverDateList = convertDyadicArray(this.state.dateList, 7);
        this.clickDateHandler = this.clickDateHandler.bind(this);
        this.headerClickHandler = this.headerClickHandler.bind(this);
    }

    componentWillUpdate(nextProps, nextState) {
        let {curSelDateMapCode, code, isShow} = nextProps;
        if( curSelDateMapCode !== code ) {
            var temDateObj = new Date(2050,0,1);
            this.addCurDateClass(temDateObj);
        }
    }

    componentWillMount() {
        if(this.props.isInit) {
            this.addCurDateClass(this.state.renderDate);
        }
    }

    /**
     * 获取日历数据源,根据状态的renderDate
     */
    getDateList(renderDate) {
        let year = renderDate.getFullYear(),
            month = renderDate.getMonth(),
            curMonthLastDayObj = new Date(year, month+1, 0), // 当月最后一天
            preMonthLastDayObj = new Date(year, month, 0), //上月最后一天
            lastWeek = preMonthLastDayObj.getDay(), // 上个月最后一天是周几
            list = [],
            temDateObj = null,
            comparePttern = "yyyyMMdd",
            patternDate = "",
            renderDateStr = formatDate(renderDate, comparePttern);

        // 计算上月出现在 📅 中的日期
        for (let i = lastWeek; i > 0; i--) {
            temDateObj = new Date(year, month-1, preMonthLastDayObj.getDate()-i+1); temDateObj.setHours(10);
            patternDate = formatDate(temDateObj, comparePttern);
            list.push({
                "date": temDateObj, value:formatDate(temDateObj, "dd"), isSelected: false, disSelect: true,
                className:"date-item", tdClassName:"pre-month-td"
            });
        }

        // 当月
        for (let i = 1; i < curMonthLastDayObj.getDate() + 1; i++) {
            temDateObj = new Date(year, month, i); temDateObj.setHours(10);
            patternDate = formatDate(temDateObj, comparePttern);
            list.push({
                "date": temDateObj, value:formatDate(temDateObj, "dd"), isSelected: false,
                disSelect: patternDate === renderDateStr ? false : true,
                className: "date-item", tdClassName:"cur-month-td"
            });
        }

        // 下月
        let temp = list.length % 7;
        if (temp) {
            // 说明还有下月,补足剩余的天数
            for (let i = 1; i < 8 - temp; i++) {
                temDateObj = new Date(year, month+1, i); temDateObj.setHours(10);
                patternDate = formatDate(temDateObj, comparePttern);
                list.push({
                    "date": temDateObj, value:formatDate(temDateObj, "dd"), isSelected: false, disSelect: true,
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
    headerClickHandler() {
        return ;
    }

    /**
     * 对应点击日期的回调事件
     * @param {*} index
     * @param {*} dateNode
     * @param {*} item
     */
    clickDateHandler(index, dateNode, item) {
        if(dateNode.disSelect) return;
        let { renderDate, corverDateList } = this.state;
        this.addCurDateClass(dateNode.date);
        this.setState({
            "corverDateList" : corverDateList
        });
        this.props.selectHandler([renderDate, renderDate, this.props.code, this.props.name]);
    }

    /**
     * 给当前的日期加上相关className
     */
    addCurDateClass(dateNode) {
        var { dateList } = this.state,
            temDateNode = null,
            format = "yyyyMMdd",
            formatDateStr="",
            dateNodeStr = formatDate(dateNode, format);

        for(var i=0; i<dateList.length; i++) {
            temDateNode = dateList[i];
            formatDateStr = formatDate(temDateNode.date, format);
            temDateNode.isSelected = false;
            if(formatDateStr === dateNodeStr) {
                temDateNode.isSelected = true;
                break;
            }
        }
    }

    render() {
        let {isInit, isShow, showTimeSet,code} = this.props,
            year, month;
        year = formatDate(this.state.renderDate, "yyyy");
        month = formatDate(this.state.renderDate, "MM");

        return (
            <div className="grace-datepicker dc-grace-datepicker" style={{"display":isShow?"block":"none"}}>
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

export default DatepickerPromotionDay;