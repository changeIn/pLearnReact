import React, { Component } from "react";
import { formatDate, convertDyadicArray, previousDay} from "./util";
import DatepickerHeader from "./uicomponent/DatepickerHeader";
import DatepickerDayBody from "./uicomponent/DatepickerDayBody";
import 'css/widget/graceDatepicker.scss';

/*
* 专门用来处理自定义日期的
* 1、虽然如果state中的一个属性是对象，你改变对象中某个属性的值，即使不设置setState，等到其他属性更新的时候，该属性的改变也能更新；
* 但是总感觉怪怪的，所以即使改变对象，我也走下setState吧，就这么定了！！！
* 2、mark：slice方法虽然生成的是一个新的数组，但是数组中的每一个元素都是对象；
* 即使生成的是新数组，但是数组中每个元素的引用还是原来的引用，只是整体的数组的引用变了；
* 所以如果你改动了dateList中某个元素的内容，那么根据dateList生成的corverDateList中，对应元素的内容也会跟着改变。
* 3、
* */


class DatepickerDayRange extends Component {
  
  static defaultProps = {
    minDate: "", //string
    maxDate: "", //sting
    pushDataTaskTime: 8, //时效性默认为8点
    code:'dayRange',
    name:"自定义",
    defaultStartDate:"",  //初始化开始日期，这个值可以为""
    defaultEndDate:"",   //初始化结束日期，这个值可以为""，如果有defaultEndDate，那么必须有defaultStartDate
    format: 'yyyy-MM-dd',
    isInit: true, //是否初始化选中需要选中的日期（比如日选中当天，周选中当周，范围选择当前范围）
    initNoPassClick: true,
    isShow: false, //当前dom是否正在显示，isShow为true，表示当前日期组件正在显示
    //表示选中的日期对应的组件的code
    curSelDateMapCode: "",  //为空的情况表示单独使用这个组件，可以忽略这个配置；当与别的组件组合的时候，就需要这个组件
    showTimeSet:false,//显示时分,以及确认按钮，该功能目前还没有
    readSzGlobalTime:false,  //读取商智的全局时间，这个下次上线的时候，全部去掉，这个用不到了
    errorTip:"最多只能选择31天"
  };

  constructor(props) {   
    super(props);
    this.state = this.initState();
    this.clickDateHandler = this.clickDateHandler.bind(this);
    this.headerClickHandler = this.headerClickHandler.bind(this);
    this.clickCount = 0; //用来记录点击次数
  }

  /**
   * state 中所有的属性
   * minDate,
   * maxDate,
   * startDate,  被选中的开始日期
   * endDate,   被选中的结束日期
   * dateList,
   * corverDateList,
   * renderDate
   * */
  initState() {
      let {isInit, minDate, maxDate, defaultStartDate, defaultEndDate } = this.props,
          temCurDate = new Date(),  //当前日期
          temCurDatePre = previousDay(temCurDate, 1), //当前日期前一天
          startDate, endDate, renderDate;

      //生成state的相关数据，有minDate和maxDate是怕props中的minDate和maxDate有问题，所以在这里再处理下，转换成state
      minDate = minDate ? new Date(minDate) : temCurDatePre;
      maxDate = maxDate ? new Date(maxDate) : temCurDatePre;

      if(defaultStartDate) {
          startDate = new Date(defaultStartDate);
      } else {
          startDate = temCurDatePre;
      }

      if(defaultEndDate) {
          endDate = new Date(defaultEndDate);
      } else {
          endDate = temCurDatePre;
      }

      isInit ? (renderDate = endDate) : (renderDate = temCurDatePre);

      return { minDate, maxDate, startDate, endDate, renderDate }

  }

  componentWillUpdate(nextProps, nextState) {
    let {curSelDateMapCode, code, isShow} = nextProps;
    //先不考虑点击
    if( curSelDateMapCode !== code  && !isShow) {
      var temDateObj = new Date(2050,0,1);
      this.addCurDateClass(temDateObj, temDateObj, nextState.dateList);
      this.clickCount = 0;
    }
  }

  componentWillMount() {
      let { startDate, endDate } = this.state,
          dateList = this.getDateList(),
          corverDateList = convertDyadicArray(dateList, 7);
      /*
      * mark：slice方法虽然生成的是一个新的数组，但是数组中的每一个元素都是对象。
      * 即使生成的是新数组，但是数组中每个元素的引用还是原来的引用，只是整体的数组的引用变了。
      * 所以如果你改动了dateList中某个元素的内容，那么根据dateList生成的corverDateList中，对应元素的内容也会跟着改变。
      * */
      if(this.props.isInit) {
          dateList = this.addCurDateClass(startDate, endDate, dateList);
      }

      this.setState({
        dateList,
        corverDateList
      });
  }

  componentDidMount() {
    var {startDate, endDate} = this.state;
    var {code ,name, isInit} = this.props;
    if(isInit) this.props.selectHandler([startDate, endDate, code, name]);
  }

  /**
   * 更新state
   * @param {*} renderDate 要渲染日期面板的日期
   * @param {*} startDate 只有初始化时才可以没有startDate
   */
  updateState(selectDate, updateDateList) {
    const {code, curSelDateMapCode} = this.props;
    let startDate = null, endDate = null;

    if(updateDateList) {
      // 说明只是更新startDate、endDate
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
      return {
        startDate,
        endDate
      };
    } else {
      //要更新的是corverDateList
      let dateList = this.getDateList(selectDate),
        corverDateList = convertDyadicArray(dateList, 7);
      if(curSelDateMapCode === code) {
          dateList = this.addCurDateClass(this.state.startDate, this.state.endDate, dateList);
      }
      return {
        corverDateList,
        dateList,
        renderDate: selectDate
      }
    }
  }

  /**
   * 获取日历数据源
   */
  getDateList(dateObj) {
    let { minDate, maxDate, renderDate } = this.state;
    if(dateObj) renderDate = dateObj;
    let year = renderDate.getFullYear(),
      month = renderDate.getMonth(),
      curMonthLastDayObj = new Date(year, month+1, 0), // 当月最后一天
      preMonthLastDayObj = new Date(year, month, 0), //上月最后一天
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

    // 下月
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
   * 日期头部 callback
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
   * 日期点击 callback
   * @param {*} index 
   * @param {*} dateNode 
   * @param {*} item 
   */
  clickDateHandler(index, dateNode, item) {
    if(dateNode.disSelect) return; 
    this.clickCount++;
    let { code, name, range } = this.props,
        temDate = dateNode.date,
        retObj = this.updateState(temDate, true);

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

  }

  calDateDisRetDay(startDate, endDate) {
    return Math.floor((endDate.getTime() - startDate.getTime())/(24*60*60*1000))+1;
  }

  /**
   * 给当前的日期加上相关className
   */
  addCurDateClass(startDate, endDate, dateList) {
    var temDateNode = null, formatDateStr="",  format = "yyyyMMdd";
    for(var i=0; i<dateList.length; i++) {
        temDateNode = dateList[i]; temDateNode.isSelected = false;
        formatDateStr = formatDate(temDateNode.date, format);
        if(formatDateStr >= formatDate(startDate, format) && formatDateStr <= formatDate(endDate, format)) {
          temDateNode.isSelected = true;
        }
    }
    return dateList;
  }

  render() {
    let {isInit, isShow, showTimeSet,code, initNoPassClick} = this.props,
        year, month;
      year = formatDate(this.state.renderDate, "yyyy");
      month = formatDate(this.state.renderDate, "MM");

    return (
      <div className="grace-datepicker" style={{"display":isShow?"block":"none"}}>
        <div className="grace-datepicker-cont">
          <DatepickerHeader
            year={ year }
            month={ month }
            headerClickHandler={ this.headerClickHandler } />
          <DatepickerDayBody
            code = { code }
            isInit = { isInit }
            initNoPassClick = { initNoPassClick }
            showTimeSet = { showTimeSet }
            corverDateList={ this.state.corverDateList }
            clickDateHandler={ this.clickDateHandler } />
        </div>
      </div>
    ) 
     
  }
  
}

export default DatepickerDayRange;