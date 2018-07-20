import React, { Component } from "react";

/**
 * 该组件本身不管任何数据的计算，只管组件的渲染，类似于redux的UI组件
 * 它的父组件来管理数据的处理
 * 它只负责接受数据，渲染dom，以及绑定事件传给父组件
 */
class DatepickerHeader extends Component {
  static defaultProps = {
    evList: [
      { type: 0, name: "preMonth" },
      { type: 1, name: "preYear" },
      { type: 2, name: "nextMonth" },
      { type: 3, name: "nextYear" }
    ]
  };
  constructor(props) {
    super(props);
    this.clickHandler = this.clickHandler.bind(this);
  }

  clickHandler(evItem) {
    this.props.headerClickHandler(evItem);
  }

  render() {
    return (
      <div className="grace-datepicker-header">
        <div className="grace-datepicker-header-cont gdhc">
          <ul className="gdhc-nav">
            <li className="year-prev-arrow fl arrow-btn gdhc-nav-li" onClick={() => this.clickHandler(this.props.evList[1])}></li>
            {
              this.props.month ? 
                <li className="month-prev-arrow fl arrow-btn gdhc-nav-li" onClick={() => this.clickHandler(this.props.evList[0])}></li> 
                : <li className="month-prev-arrow-disable fl arrow-btn-disable gdhc-nav-li"></li>
			}
            <li className="year-next-arrow fr arrow-btn gdhc-nav-li" onClick={() => this.clickHandler(this.props.evList[3])}></li>
            {
              this.props.month ?
                <li className="month-next-arrow fr arrow-btn gdhc-nav-li" onClick={() => this.clickHandler(this.props.evList[2])}></li>
                : <li className="month-next-arrow-disable fr arrow-btn-disable gdhc-nav-li"></li>
            }
            <li className="gdhc-nav-li nav-date"><span>{this.props.year+ (this.props.month?("-"+this.props.month):"")}</span></li>
          </ul>
        </div>
      </div>
    );
  }
}

export default DatepickerHeader;