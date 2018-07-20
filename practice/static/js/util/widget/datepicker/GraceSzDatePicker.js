import React, { Component } from "react";
import DatepickerDay from "./DatepickerDay";
import DatepickerMonth from "./DatepickerMonth";
import DatepickerDayQuick from "./DatepickerDayQuick";
import DatepickerDayRange from "./DatepickerDayRange";
import DatepickerPromotionDay from "./DatepickerPromotionDay";
import { formatDate, previousDay } from "./util";
import classNames from 'classnames';
class GraceSzDatePicker extends Component {

    constructor(props) {
        super(props);
        const {config} = this.props;
        let curDate = previousDay(new Date(), 1),
            defaultPattern = "yyyy-MM-dd";

        //选择日期缓存
        this.dateSelectCache = {};

        //在我这里可以维护一个缓存，每一次一个datepicker调用回调，那么就给它缓存下来，当用户直接点击左侧日期列表的时候，直接根据code从缓存中取
        //那么问题又来了，怎么区别这些日期组件？？？    他们的缓存名称肯定得不一样的
        //如果是用缓存的话，还有个问题，只有isInit为true的日期控件，才会被调用selectHandler
        //右边的日期大小是固定的，然后给整体来个最小宽度，最大宽度就好了。外层就是设置right这个东西


        //如果有items，那么item中，必须有且仅有一个isInit为true
        //相当于items中的配置可以覆盖defaultProps中的配置，如果没有items，那么defaultProps就相当于一个单独的item
        //item之外的配置，相当于所有item的基础配置，如果item中没有相关配置，那么就用总配置，当然了，这里虽然做了一遍配置，但是每个组件
        //本来也有自己的props，这里只是把用户定义的配置，与SzDatePicker的配置结合下
        let defaultCommonConfig = {
            minDate: "",
            maxDate: "",  //minDate与maxDate是日期字符串，格式应该和formate一致
            pushDataTaskTime: 8,
            code:'day',
            name:"按日查询",
            defaultStartDate:formatDate(curDate, defaultPattern),  //string格式
            format: defaultPattern,
            isShow: false,
            isInit: false,
            showTimeSet:false,//显示时分
            readSzGlobalTime:false
        };

        if(config.items) {
            //通过下面的循环，确定初始化时，选中日期的组件的code
            config.items.forEach((item) => {
                if(item.isInit) defaultCommonConfig.curSelDateMapCode = item.code;
            });
            //让用户的自定义的基础配置覆盖公共基础配置
            defaultCommonConfig = Object.assign(defaultCommonConfig, config);
            delete defaultCommonConfig.items;

            //把每个item的配置与公共基础配置结合起来，生成最终每个组件(day, month, dayQuick等)需要使用的配置
            this.state = {
                items : config.items.map((item, index) => {
                    item.isShow = item.isInit ? true : false;
                    if(item.code.indexOf("promotionDay") == -1) {
                        item.defaultStartDate = item.isInit ? item.defaultStartDate : "";
                    }
                    if(item.code === "dayRange") {
                        item.range = item.range ? item.range : 31;
                    }
                    return Object.assign({}, defaultCommonConfig, item);
                }),
                errorFlag: false
            }
        } else {
            //可以不传item，但是不建议这么用，因为浪费的引用其他的日期组件，如果只是单独使用day，请直接使用DatepickerDay组件
            this.state = Object.assign({}, defaultCommonConfig, config);
            this.state.isInit = true;
            this.state.isShow = true;
        }

        this.selectHandler = this.selectHandler.bind(this);
        this.datepickerListClick = this.datepickerListClick.bind(this);
    }

    liMouseEnter(temItem) {
        clearTimeout(this.timer);
        this.timer = setTimeout(()=> {
            this.setState({
                items: this.state.items.map((item, index) => {
                    if(item.code === temItem.code) {
                        item.isShow = true;
                    } else {
                        item.isShow = false;
                    }
                    return item;
                })
            });
        }, 150);
    }

    liMouseLeave() {
        clearTimeout(this.timer);
    }

    datepickerListClick(temItem) {
        // if(temItem.code === "option")
        //   this.props.selectHandler(dataArr);
    }

    datepickerList() {
        if (this.state.items) {
            return (
                <ul className="quick-type-list">
                    {
                        this.state.items.map((item, index)=>{
                            let className = "quick-type-item";
                            if (item.isShow) {
                                className+=" cur-item";
                            }
                            if(item.curSelDateMapCode === item.code) {
                                className += " selected-date-item"
                            }
                            return <li key={item.code+index} className={className}
                                       onClick={()=> this.datepickerListClick(item)}
                                       onMouseEnter={()=>this.liMouseEnter(item)}
                                       onMouseLeave={()=>this.liMouseLeave(item)}>{item.name}</li>
                        })
                    }
                </ul>
            )
        } else {
            return null;
        }
    }

    selectHandler(dataArr, errorTip) {
        if(dataArr === "error") {
            //显示错误，2s之后取消
            this.setState({
                errorFlag: true,
                errorTip
            });
            setTimeout(()=>{
                this.setState({
                    errorFlag: false,
                    errorTip: ""
                });
            }, 2000);
        } else {
            if(this.state.items) {
                let code = dataArr[2];
                this.setState({
                    items: this.state.items.map((item, index) => {
                        item.curSelDateMapCode = code;
                        return item;
                    })
                });
            }

            /* 在这里塞入缓存！！！ */

            this.props.selectHandler(dataArr);
        }
    }

    renderBodyCont() {
        var errorFlag = this.state.errorFlag;
        var retArr = [],
            openCls = classNames({
                "grace-datepicker-error-tip": true,
                "open":errorFlag
            });

        if(this.state.items) {
            retArr = this.state.items.map((node, index) => {
                if(node.code === "day" || node.code === "week" || node.code === "usually") {
                    return <DatepickerDay key={node.code} itemIndex={index} selectHandler={this.selectHandler} {...node} />
                } else if(node.code === "dayRange" ) {
                    return <DatepickerDayRange key={node.code} itemIndex={index} selectHandler={this.selectHandler} {...node} />
                } else if(node.code === "month") {
                    return <DatepickerMonth key={node.code} itemIndex={index} selectHandler={this.selectHandler} {...node} />
                } else if(node.code === "7" || node.code === "30" || node.code === "1") {
                    return <DatepickerDayQuick key={node.code} itemIndex={index} selectHandler={this.selectHandler} {...node} />
                } else if(node.code.indexOf("promotionDay") > -1) {
                    return <DatepickerPromotionDay key={node.code} itemIndex={index} selectHandler={this.selectHandler} {...node} />
                }
                return <DatepickerDay key={node.code} itemIndex={index} selectHandler={this.selectHandler} {...node} />
            });
        } else {
            if(this.state.code === "day" || this.state.code === "week" || this.state.code === "usually") {
                retArr.push(<DatepickerDay selectHandler={this.selectHandler} {...this.state} />);
            } else if(this.state.code === "dayRange") {
                retArr.push(<DatepickerDayRange selectHandler={this.selectHandler} {...this.state} />);
            } else if(this.state.code === "month") {
                retArr.push(<DatepickerMonth selectHandler={this.selectHandler} {...this.state} />);
            } else if(this.state.code === "7" || this.state.code === "30" || this.state.code === "1") {
                retArr.push(<DatepickerDayQuick selectHandler={this.selectHandler} {...this.state} />);
            } else if(this.state.code.indexOf("promotionDay") > -1) {
                return <DatepickerPromotionDay selectHandler={this.selectHandler} {...this.state} />
            } else {
                retArr.push(<DatepickerDay selectHandler={this.selectHandler} {...this.state} />);
            }
        }
        retArr.push(<div key="datepicker-error" className={openCls}><i className="error-tip-icon"></i><span className="error-tip-text">{this.state.errorTip}</span></div>);

        return retArr

    }

    render() {
        let {config} = this.props,
            className = "grace-sz-date-picker";
        if(config.items) {
            className+=" multi-datepicker"
        }
        for(var i=0; i<config.items.length; i++) {
            if(config.items[i].code.indexOf("promotionDay") > -1) {
                className+=" dc-grace-sz-date-picker";
                break;
            }
        }
        return (
            <div className={className} style={{display:this.props.isShow?"block":"none"}}>
                { this.datepickerList() }
                <div className="quick-date-dashbord">
                    <div className="quick-date-dashbord-cont">{ this.renderBodyCont() }</div>
                </div>
            </div>
        );
    }
}

export default GraceSzDatePicker;