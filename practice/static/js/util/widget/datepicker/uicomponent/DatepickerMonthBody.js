import React, { Component } from "react";

/**
 * 该组件本身不管任何数据的计算，只管组件的渲染，类似于redux的UI组件
 * 它的父组件来管理数据的处理
 * 它只负责接受数据，渲染dom，以及绑定事件传给父组件
 */
class DatepickerMonthBody extends Component {
  constructor(props) {
    super(props);

    this.clickDateHandler = this.clickDateHandler.bind(this);
  }

  clickDateHandler(inde, dateNode, item) {
    this.props.clickDateHandler(inde, dateNode, item);
  }

  renderBodyCont() {
    var spanClassName = "",
      ref = null;
    return this.props.corverDateList.map((item, index) => {
      return (
        <tr key={index} className="dt-bd-tr">
          {
            item.map((dateNode, inde) => {
              spanClassName = dateNode.className + (dateNode.isSelected?" cur-month":"");
              spanClassName += dateNode.disSelect?" dis-select":""
              if(dateNode.isSelected) {
                  ref = thisdom => { this.selectDom = thisdom };
              } else {
                ref = null;
              }
              return (
                <td key={inde} className="dt-bd-td" ref={ref} onClick={() => this.clickDateHandler(inde, dateNode, item)}>
                  <span className={spanClassName}>{dateNode.value}</span>
                </td>
              )
            })
          }
        </tr>);
    });
  }

  componentDidMount() {
    const {isInit} = this.props;
    if(isInit) {
      //触发点击事件
      this.selectDom.click();
    }
  }

  render() {
    return (
      <div className="grace-datepicker-body">
        <div className="grace-datepicker-body-cont gdbc">
          <table className="datepick-table dt">
            <tbody>
              {this.renderBodyCont()}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default DatepickerMonthBody;