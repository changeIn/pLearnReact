import React, { Component } from "react";
import DimensionSwitchComponent from "./DimensionSwitchComponent";
import SkuSwitchComponent from "./SkuSwitchComponent";
import classNames from 'classnames';
import { Config, GracePackDatePicker, GraceCataDropdown} from "util";
import _clonedeep from 'lodash.clonedeep';

/*
* openSessionRevert 是否开启筛选记忆功能, true开启
* */


class SiftSwitchCollection extends Component {
    constructor(props) {
        super(props);

        this.state = {
            openStatusArr: [true, false],
            hasData: false,  //没有ajax，或者ajax完成之后，它才会设置为true
            retData: null
        };

        this.CONST_DIM = "dim";
        this.CONST_SKU = "sku";
        this.curOpenComName = this.CONST_DIM;
        this.resetOpenComName = this.CONST_DIM;
        this.onload = true;

        //在这个地方读取session？ 嗯嗯，就在这个地方读取session
        this.upParam = { dim:{}, sku:{} };  // 用户点击确定按钮，提交数据的最终对象，每次筛选框打开的时候，用这个值来还原筛选框
        this.saveParam = {dim:{}, sku:{}}; // 每次用户选择完之后，存储数据的地方

        this.createParamBySession();

        this.okClickHandler = this.okClickHandler.bind(this);
        this.cancelClickHandler = this.cancelClickHandler.bind(this);
        this.updateDataHandler = this.updateDataHandler.bind(this);
        this.datepcikerChangeHandler = this.datepcikerChangeHandler.bind(this);
        this.channelChangeFn = this.channelChangeFn.bind(this);
    }

    createParamBySession() {
        if(!this.props.openSessionRevert) return null;
        for(let i=0, temSessionVal=null, componentConfig=this.props.componentConfig; i<componentConfig.length; i++) {
            if(componentConfig[i].code === "skuSwitch") {
                temSessionVal = sessionStorage.getItem(this.CONST_SKU);
                if(temSessionVal) {
                    this.upParam[this.CONST_SKU] = this.saveParam[this.CONST_SKU] = JSON.parse(temSessionVal);
                    if(this.props.curWinStatus === "init") {
                        //如果初始化需要还原sku的数据，那么需要把状态都调整到SKU模式，只有init的时候才执行一次
                        this.resetOpenComName = this.curOpenComName = this.CONST_SKU;
                    }
                }
            } else if(componentConfig[i].code === "siftSwitch") {
                for(let j=0, dimList=componentConfig[i].list, dimUpObj = this.upParam[this.CONST_DIM]; j<dimList.length; j++) {
                    if(dimList[j].code === "brand") {
                        temSessionVal = sessionStorage.getItem("selectBrand");
                        if(temSessionVal) {
                            dimUpObj.selectBrand = JSON.parse(temSessionVal);
                        }
                    } else if(dimList[j].code === "category") {
                        temSessionVal = sessionStorage.getItem("selectCate");
                        if(temSessionVal) {
                            dimUpObj.selectCate = JSON.parse(temSessionVal);
                        }
                    } else if(dimList[j].code === "shopType") {
                        temSessionVal = sessionStorage.getItem("selectShopType");
                        if(temSessionVal) {
                            dimUpObj.selectShopType = JSON.parse(temSessionVal);
                        }
                    } else if(dimList[j].code === "priceRange") {
                        temSessionVal = sessionStorage.getItem("selectPriceRange");
                        if(temSessionVal) {
                            dimUpObj.selectPriceRange = JSON.parse(temSessionVal);
                        }
                    }
                }
            }
        }

    }

    //通过ajax获取维度信息（品牌，类目啥的）
    getDimensionInfo() {
        $.ajax({
            url: Config.url.global.getBrandAndCategoryNew,
            //得传一个供应商id的参数！！！一品多供的情况下，切换供应商之后，这个参数就不能为空了
            data: "",
            success: (res, status, xhr) => {
                if(res.status === 0) {
                    this.setState({ hasData: true,  retData: res.content });
                }
            }
        });
    }

    componentDidMount(){
        // 其实这个地方应该增加一个判断，是否含有类目或者品牌
        // 如果两者都没有的话，就不需要走ajax，并且直接hasData设置为true
        this.getDimensionInfo();
    }

    updateDataHandler(param) {
        const {packDatePickerConfig, channelDropDownConfig, componentConfig} = this.props;
        this.saveParam[param.code] = param.value;

        //  这个地方如果类目初始化是通过ajax的情况，就尴尬了，现在先不考虑了，怎么判断也过不了(现在没有这个问题了）
        //  现在还有个问题，就是没有品牌，类目那个大项的。JSON.stringify(this.saveParam[this.resetOpenComName]) !== "{}"，这个判断就不起作用了
        if(componentConfig.length !== 0) {
            if(this.onload && JSON.stringify(this.saveParam[this.resetOpenComName]) !== "{}" ) {
                if(packDatePickerConfig && !this.saveParam[packDatePickerConfig.id]) {
                    return null;
                }
                if(channelDropDownConfig && !this.saveParam[channelDropDownConfig.id]) {
                    return null;
                }
                this.okClickHandler();
            }
        } else {
            if(this.onload) {
                if(packDatePickerConfig && !this.saveParam[packDatePickerConfig.id]) {
                    return null;
                }
                if(channelDropDownConfig && !this.saveParam[channelDropDownConfig.id]) {
                    return null;
                }
                this.okClickHandler();
            }
        }

    }

    // 点击确定时我要把数据存到一个当前的对象当中，并且把它放到session中，下次render的时候，直接把当前对象传给组件！！！
    // 初始化时，我要把session都读取一遍，放到这个对象中
    // 现在上边这两点都还没有做！！！
    // 1、用户选择完维度之后，要把sku的session给清空了
    // 2、当前组件如果不需要session的话，任何关于session的操作都不会执行！！！
    okClickHandler(e) {
        if(this.curOpenComName === this.CONST_SKU) {
            let temObj = this.saveParam[this.CONST_SKU];
            if(!temObj || JSON.stringify(temObj) === "{}") {
                return false;
            }
        }
        let temSelectType = this.resetOpenComName = this.curOpenComName;
        this.onload = false;
        this.upParam = _clonedeep(this.saveParam);
        this.props.dataChangeHandler({
            type: temSelectType,
            value: this.upParam[temSelectType],
            datepickerDate: this.props.packDatePickerConfig && this.upParam[this.props.packDatePickerConfig.id],
            channelData: this.props.channelDropDownConfig && this.upParam[this.props.channelDropDownConfig.id]
        });
        if(this.props.openSessionRevert) {
            this.saveSession(temSelectType);
        }
    }

    saveSession(type) {
        if(type === this.CONST_DIM) {
            for(let key in this.upParam[type]) {
                sessionStorage.setItem(key, JSON.stringify(this.upParam[type][key]));
            }
            sessionStorage.removeItem(this.CONST_SKU);
        }
        if(type === this.CONST_SKU) {
            sessionStorage.setItem(type, JSON.stringify(this.upParam[type]));
            this.clearDimSession();
        }
        if(this.props.packDatePickerConfig) {
            //头部日期组件是没有大促日的，已经跟产品确认过，所以这里不会向session中记录大促日对比 或者 是平日对比的
            sessionStorage.setItem("dateRangeSession", JSON.stringify(this.upParam[this.props.packDatePickerConfig.id].otherParam.dateArr));
        }
        if(this.props.channelDropDownConfig) {
            sessionStorage.setItem("channelSelect", JSON.stringify(this.upParam[this.props.channelDropDownConfig.id].otherParam))
        }
    }

    clearDimSession() {
        sessionStorage.removeItem("selectBrand");
        sessionStorage.removeItem("selectCate");
        sessionStorage.removeItem("selectShopType");
        sessionStorage.removeItem("selectPriceRange");
    }

    cancelClickHandler(e) {
        e.nativeEvent.stopImmediatePropagation();
        this.props.winClose();
        this.createParamBySession();
    }

    //切换选择组件
    changeSwitchComponent(e, index) {
        e.nativeEvent.stopImmediatePropagation();
        index === 0 ? this.curOpenComName = this.CONST_DIM : this.curOpenComName = this.CONST_SKU;
        this.setState(this.state.openStatusArr);
    }

    componentWillReceiveProps(nextProps) {
        //第一次是自身的请求回来品牌类目数据触发的，第二次是子组件请求回来ajax业务数据，redux的stateToprops
        if(!nextProps.curWinShow && nextProps.curWinStatus !== "init") {
            //筛选框关闭，并且非初始化的时候才会走这个方法
            this.curOpenComName = this.resetOpenComName;
            this.createParamBySession();
        }
    }

    otherParamHandler() {
        const {packDatePickerConfig, channelDropDownConfig, openSessionRevert} = this.props;
        let retArr = [], temClassName = "";
        if(channelDropDownConfig) {
            temClassName = classNames({
                'fl fl-component-wrapper': channelDropDownConfig.float==="fl",
                'fr fr-component-wrapper': channelDropDownConfig.float==="fr",
                [channelDropDownConfig.className]: channelDropDownConfig.className
            });

            //获取session
            let temSessionVal = sessionStorage.getItem("channelSelect");
            if(temSessionVal && openSessionRevert) {
                channelDropDownConfig.config.resetCategory = Object.assign({}, JSON.parse(temSessionVal));
            } else if(this.upParam[channelDropDownConfig.id] && this.upParam[channelDropDownConfig.id].otherParam) {
                channelDropDownConfig.config.resetCategory = Object.assign({}, this.upParam[channelDropDownConfig.id].otherParam);
            }

            retArr.push(<div key={channelDropDownConfig.id} className={temClassName}>
                <GraceCataDropdown config={channelDropDownConfig.config} onChange={this.channelChangeFn} />
            </div>)
        }
        if(packDatePickerConfig) {
            temClassName = classNames({
                'fl fl-component-wrapper': packDatePickerConfig.float==="fl",
                'fr fr-component-wrapper': packDatePickerConfig.float==="fr",
                [packDatePickerConfig.className]: packDatePickerConfig.className
            });
            let sessionDate = null;
            //这个只是给没有开启session还原，需要打开筛选框，还原之前点击确定的内容用的
            if(this.upParam[packDatePickerConfig.id]
                && this.upParam[packDatePickerConfig.id].otherParam
                && this.upParam[packDatePickerConfig.id].otherParam.dateArr
                && !openSessionRevert) {
                sessionDate = this.upParam[packDatePickerConfig.id].otherParam.dateArr;
            }
            retArr.push(<div key={packDatePickerConfig.id} className={temClassName}>
                <GracePackDatePicker config={packDatePickerConfig.config}
                                     sessionDate = {sessionDate}
                                     openSessionRevert = {openSessionRevert}
                                     datepcikerChangeHandler={this.datepcikerChangeHandler}  />
            </div>);
        }
        if(retArr.length > 0) {
            return <li key="other-item" className="gss-bd-cont-item gss-bd-cont-other-item" style={{display:"block"}}> {retArr} </li>;
        } else {
            return null;
        }
    }

    datepcikerChangeHandler(dataParam, otherParam) {
        this.updateDataHandler({code: this.props.packDatePickerConfig.id, value: {dataParam, otherParam}});
    }

    channelChangeFn(value) {
        //sessionStorage.setItem("channelSelect", JSON.stringify(value));
        if(value.cItem) {
            this.updateDataHandler({code:this.props.channelDropDownConfig.id, value:{ dataParam:{channel:value.cItem.id}, otherParam:value }});
        } else {
            this.updateDataHandler({
                code:this.props.channelDropDownConfig.id,
                value:{ dataParam:{channel:value.selectedAll ? value.selectedAll.id : value.pItem.id}, otherParam:value }});
        }
    }

    render() {
        if(!this.state.hasData) return null;
        if(this.onload || this.props.curWinStatus === "init") {
            return this.renderDom();
        } else if(this.props.curWinShow) {
            return this.renderDom();
        } else {
            return null;
        }
    }

    renderDom() {
        const { componentConfig, packDatePickerConfig } = this.props;
        let { openStatusArr, retData } = this.state;

        let temHeadArr = [],
            temBodyArr = [],
            gssBdTitleListCls = classNames({
                "gss-bd-title-list": true,
                "gss-bd-title-list-single": componentConfig.length === 1 ? true : false
            }),
            gssBdCls = classNames({
                "gss-bd": true,
                "gss-bd-no-packdate": packDatePickerConfig ? false: true,
                "gss-bd-no-cate": componentConfig.length === 0 ? true: false
            });
        if(this.curOpenComName === this.CONST_DIM) {
            openStatusArr = [true, false];
        } else {
            openStatusArr = [false, true];
        }

        componentConfig.map((item, index) => {
            let temHeadCls = classNames({
                "gss-bd-title-item":true,
                "gss-bd-title-item-single": componentConfig.length === 1 ? true : false,
                "active": openStatusArr[index]
            });
            let temBdCls = classNames({
                "gss-bd-cont-item":true,
                "active": openStatusArr[index]
            });
            temHeadArr.push(<li key={item.code} className={temHeadCls} onClick={(e)=>this.changeSwitchComponent(e,index)}>
                {item.name}<span className={"gss-bd-title-item-line"}></span></li>
            );
            if(item.code === "siftSwitch") {
                temBodyArr.push(
                    <li key={item.code} className={temBdCls}>
                        <DimensionSwitchComponent config={item.list} retData={retData} sessionData={this.upParam[this.CONST_DIM]}  updateDataHandler={this.updateDataHandler} />
                    </li>);
            } else if(item.code === "skuSwitch") {
                temBodyArr.push(
                    <li key={item.code} className={temBdCls}>
                        <SkuSwitchComponent sessionData={this.upParam[this.CONST_SKU]} updateDataHandler={this.updateDataHandler} />
                    </li>);
            } else {
                return null;
            }
        });

        return (
            <div className={gssBdCls} onClick={(e)=>{e.nativeEvent.stopImmediatePropagation();}}>
                <ul className={gssBdTitleListCls}>
                    {temHeadArr}
                </ul>
                <ul className="gss-bd-cont-list">
                    {temBodyArr}{this.otherParamHandler()}
                </ul>
                <div className="gss-bd-ft">
                    <button className="gss-bd-ft-btn gss-bd-ft-btn-ok" onClick={this.okClickHandler}>确定</button>
                    <button className="gss-bd-ft-btn gss-bd-ft-btn-cancel" onClick={this.cancelClickHandler}>取消</button>
                </div>
            </div>
        );
    }


}


export default SiftSwitchCollection;
