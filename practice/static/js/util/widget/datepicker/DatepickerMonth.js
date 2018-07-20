import React, { Component } from "react";
import { formatDate, convertDyadicArray, previousDay} from "./util";
import DatepickerHeader from "./uicomponent/DatepickerHeader";
import DatepickerMonthBody from "./uicomponent/DatepickerMonthBody";
import 'css/widget/graceDatepicker.scss';

class DatepickerMonth extends Component {

  static defaultProps = {
    minDate: "",
    maxDate: "",
    pushDataTaskTime: 8,
    code:'day',
    name:"按日查询",
    defaultStartDate:"",
    format: 'yyyy-MM-dd',
    isInit: false, //是否初始化显示日期
    isShow: false, //是否初始化显示DOM
    //表示选中的日期对应的组件的code
    curSelDateMapCode: "",  //为空的情况表示单独使用这个组件，可以忽略这个配置；当与别的组件组合的时候，就需要这个组件
    showTimeSet:false,//显示时分                    
    readSzGlobalTime:false
  };

  constructor(props) {
    super(props);
    this.state = this.initState();
    this.clickDateHandler = this.clickDateHandler.bind(this);
    this.headerClickHandler = this.headerClickHandler.bind(this);
  }

  /**
   * 组件状态初始化
   * 月份也必须得有minDate和maxDate，因为这两个到时候需要判断向外输出的最大值最小值
   * 其实根据selectDate就可以确定要渲染的日期了，因为一个块就渲染一年，
   * 但是有个问题，如果选的是今年，而我要渲染去年的月份呢?  所以还是需要renderDate和selectDate并存
   */
  initState() {
    let {defaultStartDate,pushDataTaskTime, minDate, maxDate} = this.props;
    let preDate = previousDay(new Date(), 1);

    minDate = minDate ? new Date(minDate) : "";
    maxDate = maxDate ? new Date(maxDate) : preDate;
    
    // if(defaultStartDate) {
    //   defaultStartDate = new Date(defaultStartDate);
    // } else {
    //   if(preDate.getHours() >= pushDataTaskTime) {
    //     //时效性
    //     defaultStartDate = preDate;
    //   } else {
    //     defaultStartDate = previousDay(preDate, 1);
    //   }
    // }

    if(preDate.getDate() <= new Date().getDate()) {
      preDate.setDate(0);
    }
    if(defaultStartDate) {
      defaultStartDate = new Date(defaultStartDate);
      if(defaultStartDate.getMonth()>preDate.getMonth() && defaultStartDate.getFullYear() === preDate.getFullYear()) {
        defaultStartDate = preDate;
      }
    } else {
        defaultStartDate = preDate;
    }

    return {
      minDate,
      maxDate,
      selectDate: defaultStartDate,
      renderDate: defaultStartDate
    };
  }

  componentWillUpdate(nextProps, nextState) {
    let {curSelDateMapCode, code} = nextProps;
    if(curSelDateMapCode !== code) {
      this.addCurDateClass(nextState.dateList, new Date(2050,0,1));
    }
  }

  componentWillMount() {
    const {renderDate} = this.state,
      {isInit} = this.props;
    let dateList = this.getDateList(renderDate),
      corverDateList = convertDyadicArray(dateList, 3);
    
    if(isInit)
      this.addCurDateClass(dateList, renderDate);

    this.setState({
      dateList,
      corverDateList,
    });
  }

  /**
   * 更新组件状态
   * @param {*} dateParam 
   */
  updateState(dateParam) {
    if((typeof dateParam).toLowerCase() === "number") {
      //更新数据源
      let temDate = new Date(dateParam, 0),
        dateList = this.getDateList(temDate),
        corverDateList = convertDyadicArray(dateList, 3);
      this.addCurDateClass(dateList, this.state.selectDate);
      return {
        dateList, corverDateList, renderDate:temDate
      }
    }
    //只更新renderDate
    this.addCurDateClass(this.state.dateList, dateParam);
    return {
      renderDate: dateParam
    }
  }

  /**
   * 对应日期头部的点击事件
   * @param {object} evItem 
   */
  headerClickHandler(evItem) {
    let {renderDate} = this.state,
      year = renderDate.getFullYear();

    if(evItem.type === 1) {
      //pre year
      year--;
    } else {
      year++;
    }

    //改变组件状态值，通过this.setState()
    this.setState(this.updateState(year));
  }

  /**
   * 对应点击日期的回调事件
   * @param {number} inde 点击日期的序号
   * @param {object} dateNode 点击日期包含的数据
   * @param {array} item 点击日期所在行数据
   */
  clickDateHandler(inde, dateNode, item) {
    if(dateNode.disSelect) return;
    const {code, name} = this.props;

    let date = dateNode.date,
      year = date.getFullYear(),
      month = date.getMonth(),
      {minDate, maxDate} = this.state;

    this.setState(this.updateState(date));

    //date要跟最小值比较，如果date小于最小值，返回最小值
    let retMaxDate = new Date(year, month+1, 0);

    if(formatDate(date, "yyyyMMdd") < formatDate(minDate, "yyyyMMdd")) {
      date = minDate;
    }
    if(formatDate(retMaxDate, "yyyyMMdd")> formatDate(maxDate, "yyyyMMdd")) {
      retMaxDate = maxDate;
    }

    this.props.selectHandler([date, retMaxDate, code, name]);
  }

  /**
   * 给当前的日期加上相关className
   * @param {array} dateList 
   * @param {object} selectDate 
   */
  addCurDateClass(dateList, selectDate) {
    let temDateNode = null,
      format = "yyyyMM";
    for (let key in dateList) {
      temDateNode = dateList[key];
      temDateNode.isSelected = false;
      if (formatDate(temDateNode.date, format) === formatDate(selectDate, format)) {
        temDateNode.isSelected = true;
      }
    }
  }

  /**
   * 生成日期数据
   * @param {obj} dateObj 
   */
  getDateList(dateObj) {
    let list = [], year = dateObj.getFullYear(), temDate = null,
      { minDate, maxDate } = this.state;
    let temCurDate = new Date();
    for(var i=1; i<13; i++) {
      temDate = new Date(year, i-1);
      temDate.setHours(10);
      list.push({ 
        "date": temDate, value: i+"月", isSelected: false, className:"month-item",
        disSelect: temDate.getTime() < minDate || temDate.getTime() > maxDate || (temDate.getMonth() >= temCurDate.getMonth() && temDate.getFullYear() == temCurDate.getFullYear()),
      });
    }
    return list;
  }

  render() {
    let year = formatDate(this.state.renderDate, "yyyy");
      let {isInit, isShow, code} = this.props;

      return (
        <div className="grace-datepicker" style={{"display":isShow?"block":"none"}}>
          <div className="grace-datepicker-cont">
            <DatepickerHeader
              year={year}
              headerClickHandler={this.headerClickHandler} />
            <DatepickerMonthBody
              code = {code}
              isInit = {isInit}
              corverDateList={this.state.corverDateList}
              clickDateHandler={this.clickDateHandler} />
          </div>
        </div>
      )
    // } else {
    //   return null;
    // }
     
  }
}

export default DatepickerMonth;