import React, { Component } from "react";

/**
 * 该组件本身不管任何数据的计算，只管组件的渲染，类似于redux的UI组件
 * 它的父组件来管理数据的处理
 * 它只负责接受数据，渲染dom，以及绑定事件传给父组件
 * 目前来看showTimeSet只有单独使用datepicker的时候才会起作用
 */
class DatepickerDayBody extends Component {
  constructor(props) {
    super(props);
    this.state = {
      weekNameArr: ["一", "二", "三", "四", "五", "六", "日"],
      hour:1,
      minute: 10
    };
    this.clickDateHandler = this.clickDateHandler.bind(this);
  }

  clickDateHandler(index, dateNode, item) {
    //debugger
    this.props.clickDateHandler(index, dateNode, item);
  }

  renderBodyHeader() {
    if (this.state.weekNameArr && this.state.weekNameArr.length > 0) {
      return (
        <tr className="dt-hd-tr">
          {
            this.state.weekNameArr.map((value, index) => <th key={index}><span>{value}</span></th>)
          }
        </tr>
      );
    } else {
      return null;
    }
  }

  renderBodyCont() {
    let spanClassName = "",
      tdClassName = "",
      trClassName = "dt-bd-tr",
      ref = null;
    let code = this.props.code;
    if(this.props.code === "week") {
      trClassName += " week-tr";
    }
    return this.props.corverDateList.map((item, index) => {
      return (
        <tr key={index} className={trClassName}>
          {
            item.map((dateNode, inde) => {
              spanClassName = dateNode.className + (dateNode.isSelected?" today-date":"");
              spanClassName+= dateNode.disSelect?" dis-select":"";
              tdClassName = "dt-bd-td " + dateNode.tdClassName;
              if(dateNode.isSelected) {
                ref = thisdom => {
                  if(code == "dayRange") {
                    //debugger
                    if(this.dayRangeStart) {
                        this.dayRangeEnd = thisdom;
                    } else {
                        this.dayRangeStart = thisdom;
                    }
                  } else {
                      this.selectDom = thisdom;
                  }
                };
              } else {
                ref = null;
              }
              return (
                <td key={inde} className={tdClassName} ref={ref} onClick={() => this.clickDateHandler(inde, dateNode, item)}>
                  <span className={spanClassName}>{dateNode.value}</span>
                </td>
              )
            })
          }
        </tr>);
    });
  }

  componentDidMount() {
    const {isInit, code, initNoPassClick} = this.props;
    if(isInit && !initNoPassClick) {
      //触发点击事件
        if(code === "dayRange") {
          //debugger
            this.dayRangeStart.click();
            this.dayRangeEnd.click();
        } else {
            this.selectDom.click();
        }

    }
  }

  render() {
    return (
      <div className="grace-datepicker-body">
        <div className="grace-datepicker-body-cont gdbc">
          <table className="datepick-table dt">
            <thead>
              {this.renderBodyHeader()}
            </thead>
            <tbody>
              {this.renderBodyCont()}
            </tbody>
          </table>
        </div>        
      </div>
    );
  }
}

export default DatepickerDayBody;