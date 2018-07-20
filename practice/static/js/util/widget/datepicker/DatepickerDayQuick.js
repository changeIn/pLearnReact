import React, { Component } from "react";
import { formatDate, previousDay} from "./util";
import 'css/widget/graceDatepicker.scss';

class DatepickerDayQuick extends Component {
  
  static defaultProps = {
    pushDataTaskTime: 8,
    code:'day',
    name:"按日查询",
    defaultStartDate:"",
    format: 'yyyy-MM-dd',
    isInit: false, //是否初始化选中需要选中的日期（比如日选中当天，周选中当周，范围选择当前范围）
    isShow: false, //是否初始化显示DOM
    //表示选中的日期对应的组件的code
    curSelDateMapCode: "",  //为空的情况表示单独使用这个组件，可以忽略这个配置；当与别的组件组合的时候，就需要这个组件
    comparePattern: "yyyyMM", //日期对比时，格式化的日期
    showTimeSet:false, //显示时分     
    readSzGlobalTime:false
  };
  
  constructor(props) {
    super(props);
    
    this.state = this.initState();
    this.clickDateHandler = this.clickDateHandler.bind(this);
  }
  
  /**
   * 初始化state
   * 这个就不设置minDate和maxDate了，
   */
  initState() {
    let { defaultStartDate, pushDataTaskTime, code, format} = this.props,
      preDate = previousDay(new Date(), 1);

    if(defaultStartDate) {
      defaultStartDate = new Date(defaultStartDate);
    } else {
      if(preDate.getHours() >= pushDataTaskTime) {
        defaultStartDate = preDate;
      } else {
        defaultStartDate = previousDay(preDate, 1);
      }
    }
    code = code - 1;
    let endDate = defaultStartDate,
      startDate = previousDay(endDate, code, format);
    
    return {
      startDate: {
        date: startDate,
        patternDate: formatDate(startDate, format)
      },
      endDate: {
        date: endDate,
        patternDate: formatDate(endDate, format)
      }
    }
  }

  componentDidMount() {
    const {isInit} = this.props;
    if(isInit) {
      //触发点击事件
      this.selectDom.click();
    }
  }

  clickDateHandler() {
    const {startDate, endDate} = this.state,
      {code, name} = this.props;
    this.props.selectHandler([startDate.date, endDate.date, code, name]);
  }

  render() {
    const {isShow, itemIndex, code, curSelDateMapCode} = this.props;
    let {startDate, endDate} = this.state;
    let className = "quick-list-content";
    if(curSelDateMapCode === code) {
      className+=" quick-list-select"
    }
    let ref = thisdom => { this.selectDom = thisdom };
    return (
      <div className="grace-datepicker grace-quick-datepicker" style={{display:isShow ? "block":"none", top:itemIndex*40+"px"}}>
        <div className="grace-datepicker-cont"><div className="quick-list" onClick={this.clickDateHandler} ref={ref}>
          <span className={className} >{"("+startDate.patternDate + "至"+endDate.patternDate+")"}</span>
        </div></div>
      </div>
    )
  }
  
}

export default DatepickerDayQuick;