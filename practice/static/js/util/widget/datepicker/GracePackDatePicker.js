import React, { Component } from "react";
import { formatDate, getTimeParam } from "./util";
import GraceSzDatePicker from "./GraceSzDatePicker";

/*
    { name: '昨日', code: '1', isInit: true},
    { name: '近7日', code: '7'},
    { name: '近30日', code: '30'},
    { name: '自然日', code: 'day'},
    { name: '自然周', code: 'week'},
    { name: '自然月', code: 'month'},
    { name: '自定义', code: 'dayRange', range: 31, errorTip:"最多只能选择31天"},
    { name: '平时对比', code: 'usually'},  //平日对比指的是当前日期开始的近三十日
    //大促日 code值统一为  "promotionDay"+"yyyy"+"M或者MM"+"dd"
    { name: '2017年618大促对比', code: 'promotionDay2017618', defaultStartDate: "2017-06-18"}, //大促日2017618
    { name: '2017年11.11大促对比', code: 'promotionDay20171111', defaultStartDate: "2017-11-11"} //大促日20171111
* */


class GracePackDatePicker extends Component {

  constructor(props) {
    super(props);
    this.selectHandler = this.selectHandler.bind(this);
    this.toggleDatepicker = this.toggleDatepicker.bind(this);
    this.mouseEnterEv = this.mouseEnterEv.bind(this);
    this.mouseLeaveEv = this.mouseLeaveEv.bind(this);
    this.state = {
      value:"",
      isShow: false
    };
  }

  mouseLeaveEv() {
    clearTimeout(this.timer);
    this.timer= setTimeout(()=>{
      this.setState({
        isShow : false
      });
    }, 300);
  }

  mouseEnterEv() {
    clearTimeout(this.timer);
    this.setState({
      isShow : true
    });

  }

  toggleDatepicker() {

    this.setState({
      isShow : !this.state.isShow
    });
    // this.setState({
    //   isShow: true
    // });
  }

    //日期选择的回调
    selectHandler(dataArr) {
        let t = getTimeParam(dataArr),
            showName = "";
        if(dataArr[2].indexOf("promotionDay") > -1 || dataArr[2] === "usually") {
            showName = dataArr[3]==="" ? t.startDate : dataArr[3]+"( "+t.startDate+" )";
        } else {
            showName = t.startDate+" 至 "+t.endDate;
        }
        this.setState({ value: showName});
        this.props.datepcikerChangeHandler({
            startDate:t.startDate,
            endDate:t.endDate,
            date:t.date
        }, {
            dateType: dataArr[2],
            dateArr: dataArr,
            dateShowName: showName
        });
    }

    //初始化的时候，根据session来进行初始化
    componentWillMount() {
        let {openSessionRevert, sessionDate} = this.props;
        var dateSession = sessionStorage.getItem("dateRangeSession");
        if(dateSession && openSessionRevert) {
            var temJson = JSON.parse(dateSession);
            for(var i=0; i<this.props.config.items.length; i++) {
                if(this.props.config.items[i].code == temJson[2]) {
                    //把所有的isInit设置为false
                    for(var m=0; m<this.props.config.items.length; m++) {
                        this.props.config.items[m].isInit = false;
                    }
                    if(temJson[2] == "dayRange") {
                        this.props.config.items[i].defaultStartDate = formatDate(new Date(temJson[0]), "yyyy-MM-dd");
                        this.props.config.items[i].defaultEndDate = formatDate(new Date(temJson[1]), "yyyy-MM-dd");
                    } else if(temJson[2].indexOf("promotionDay") > -1) {
                        //debugger
                    } else {
                        this.props.config.items[i].defaultStartDate = formatDate(new Date(temJson[1]), "yyyy-MM-dd");
                    }
                    this.props.config.items[i].isInit = true;
                }
            }
        } else if(sessionDate && !openSessionRevert) {
            //只是当它放到筛选框中，并且这个筛选框没有开始session还原的时候，关闭筛选框，然后再打开筛选框时，还原已经点击确定时的内容的
            for(var i=0; i<this.props.config.items.length; i++) {
                if(this.props.config.items[i].code == sessionDate[2]) {
                    //把所有的isInit设置为false
                    for(var m=0; m<this.props.config.items.length; m++) {
                        this.props.config.items[m].isInit = false;
                    }
                    if(sessionDate[2] == "dayRange") {
                        this.props.config.items[i].defaultStartDate = formatDate(new Date(sessionDate[0]), "yyyy-MM-dd");
                        this.props.config.items[i].defaultEndDate = formatDate(new Date(sessionDate[1]), "yyyy-MM-dd");
                    } else if(sessionDate[2].indexOf("promotionDay") > -1) {
                        //debugger
                    } else {
                        this.props.config.items[i].defaultStartDate = formatDate(new Date(sessionDate[1]), "yyyy-MM-dd");
                    }
                    this.props.config.items[i].isInit = true;
                }
            }
        }
    }

    render() {
        var {value} = this.state;

        return (
            <div className="input-calendar" onMouseEnter={this.mouseEnterEv} onMouseLeave={this.mouseLeaveEv}>
                <input className="ic-input" type="text" value={value}  />
                <GraceSzDatePicker config={this.props.config} selectHandler={this.selectHandler} isShow={this.state.isShow}  />
                <span className="input-group-btn" onClick={this.toggleCalender}>
          <i className="grace-icon-calendar"></i>
        </span>
            </div>
        );
    }
}

export default GracePackDatePicker;
