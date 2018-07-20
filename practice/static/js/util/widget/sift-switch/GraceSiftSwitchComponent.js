import React, { Component } from "react";
import SiftSwitchCollection from "./SiftSwitchCollection";

import classNames from 'classnames';
import 'css/widget/graceSiftSwitch.scss';

class GraceSiftSwitchComponent extends Component {

    constructor(props) {
        super(props);

        const { componentConfig } = this.props;

        this.state = {
            brandName:"",
            categoryName:"",
            shopTypeName:"",
            priceZoneName:"",
            datepickerName:"",
            channelName:"",
            skuInfo:"",
            headerShowFlag: [true, false],
            curWinStatus: "init",  //init , open, close
            curWinShow: false
        };

        this.isGongYingShang = false;

        //判断是否是供应商
        let sessionStorageVendor = sessionStorage.getItem("vendor");
        if(sessionStorageVendor) {
            sessionStorageVendor = JSON.parse(sessionStorageVendor);
            if(sessionStorageVendor.vendorType === 1) {
                //是供应商
                this.isGongYingShang = true;
            }
        }
        if(this.props.openSessionRevert) {
            let temSkuSessionVal = sessionStorage.getItem("sku");
            if(temSkuSessionVal) {
                this.state.headerShowFlag = [false, true];
            }
        }

        //在渲染之前就要把props.config中的内容改了
        for(var i=0; i<componentConfig.length; i++) {
            let tem = componentConfig[i];
            if(tem.code === "siftSwitch") {
                for(var j=0; j<tem.list.length; j++) {
                    //经营方式 && 供应商隐藏  &&  当前用户是供应商
                    if(tem.list[j].code === "shopType" && tem.list[j].vendorHide && this.isGongYingShang) {
                        //增加一个属性叫noRender，为true代表这个属性相当于没有任何东西
                        tem.list[j].noRender = true;
                    }
                }
            }
        }

        this.dataChangeHandler = this.dataChangeHandler.bind(this);
        this.gssBtnClickHandler = this.gssBtnClickHandler.bind(this);
        this.winCloseHandler = this.winCloseHandler.bind(this);
    }

    createParam(upParam, param, showNameObj) {
        if(param.datepickerDate) {
            showNameObj && (showNameObj.datepickerName = param.datepickerDate.otherParam.dateShowName);
            upParam = Object.assign(upParam, param.datepickerDate.dataParam);
        }
        if(param.channelData) {
            showNameObj && (showNameObj.channelName = param.channelData.otherParam.showName);
            upParam = Object.assign(upParam, param.channelData.dataParam);
        }
        return upParam;
    }

    dataChangeHandler(param) {
        if(param.type === "sku") {
            if(param.value) {
                let headerShowFlag = [false, true],
                    showNameObj = {},
                    otherParam = {};
                if(param.datepickerDate) {
                    otherParam.dateType = param.datepickerDate.otherParam.dateType;
                }
                this.props.dataChange(this.createParam({skuId:param.value.skuId}, param, showNameObj), otherParam);
                this.setState({ headerShowFlag,  skuInfo:param.value, ...showNameObj});
            }
        } else if(param.type === "dim") {
            let headerShowFlag=[true, false],
                temObj = {},
                showNameObj = {},
                otherParam = {};
            for(var key in param.value) {
                if(key === "selectBrand") {
                    temObj.brandId = param.value[key].id;
                    showNameObj.brandName = param.value[key].showName;
                } else if(key === "selectCate") {
                    temObj.thirdCategoryId = param.value[key].id;
                    showNameObj.categoryName = param.value[key].showName;
                } else if(key === "selectShopType") {
                    temObj.shopType = param.value[key].id;
                    showNameObj.shopTypeName = param.value[key].showName;
                } else if(key === "selectPriceRange") {
                    temObj.priceZoneId = param.value[key].id;
                    showNameObj.priceZoneName = param.value[key].showName;
                }
            }
            if(param.datepickerDate) {
                otherParam.dateType = param.datepickerDate.otherParam.dateType;
            }
            this.props.dataChange(this.createParam(temObj, param, showNameObj), otherParam);
            this.setState({
                headerShowFlag,
                ...showNameObj
            });
        }
        if(this.state.curWinStatus !== "init") {
            this.winCloseHandler();
        }
    }

    //筛选组件click回调
    gssBtnClickHandler(e) {
        e.nativeEvent.stopImmediatePropagation();
        if(this.state.curWinShow) {
            this.setState({
                curWinShow : false,
                curWinStatus: "close"
            });
        } else {
            this.setState({
                curWinShow : true,
                curWinStatus: "open"
            });
        }
    }

    winCloseHandler() {
        this.setState({
            curWinShow : false,
            curWinStatus: "close"
        });
    }

    componentDidMount() {
        let _this = this;
        document.addEventListener("click", function() {
            if(_this.state.curWinShow) {
                _this.winCloseHandler();
            }
        }, false);
    }

    render() {
        const {componentConfig, packDatePickerConfig, channelDropDownConfig, openSessionRevert} = this.props;

        const {curWinShow, curWinStatus, brandName, categoryName, shopTypeName,datepickerName,channelName,  priceZoneName, headerShowFlag, skuInfo} = this.state;
        let resArr = [],
            temName = "";

        // 生成头部内容！！！
        // 这里也需要根据session判断一下，如果有sku的话，是直接显示sku的那些值，并且还得判断当前组件是否需要sku这个选项
        // 当前组件如果不需要session的话，任何关于session的操作都不会执行！！！
        componentConfig.map((item, index) => {
            let temArr = [];
            if(item.code === "siftSwitch") {
                item.list.map((resNameItem) => {
                    if(resNameItem.noRender) return null;
                    let temLiClassName = classNames({
                        'gss-dim-res-item': true,
                        'gss-dim-res-brand': resNameItem.code === "brand",
                        'gss-dim-res-category': resNameItem.code === "category",
                        'gss-dim-res-model': resNameItem.code === "shopType",
                        "gss-dim-res-pricerange":resNameItem.code === "priceRange",
                    });
                    if(resNameItem.code === "brand") temName = brandName;
                    else if(resNameItem.code === "category") temName = categoryName;
                    else if(resNameItem.code === "priceRange") temName = priceZoneName;
                    else temName = shopTypeName;
                    temArr.push(
                        <li key={resNameItem.code} className={temLiClassName}>
                            <span className="gss-dim-res-item-title">{resNameItem.name}</span><span className="gss-dim-res-item-name" title={temName}>{temName}</span>
                        </li>
                    );
                });
                if(packDatePickerConfig) {
                    temArr.push(<li key={"gss-datepicker-key"} className={"gss-dim-res-item gss-dim-res-datepicker"}>
                        <span className="gss-dim-res-item-title">{"时间"}</span><span className="gss-dim-res-item-name" title={datepickerName}>{datepickerName}</span>
                    </li>);
                }
                if(channelDropDownConfig) {
                    temArr.push(<li key={"gss-channel-key"} className={"gss-dim-res-item gss-dim-res-channel"}>
                        <span className="gss-dim-res-item-title">{"终端"}</span><span className="gss-dim-res-item-name" title={channelName}>{channelName}</span>
                    </li>);
                }
                resArr.push(<ul key={item.code} className="gss-dim-res-list" style={headerShowFlag[0]?{"display":"block"}:{"display":"none"}}>{temArr}</ul>);
            } else if(item.code === "skuSwitch") {
                temArr.push(<li key={"sku-title-img"} className="gss-sku-res-item gss-sku-res-img"><img src={skuInfo.skuImg} width="58" height="58" /></li>);
                temArr.push(<li key={"sku-title-content"} className="gss-sku-res-item gss-sku-res-cont gss-sr">
                    <p className="gss-sr-name">{skuInfo.skuTitle}</p>
                    <p className="gss-sr-num"><span className="gss-sr-num-title">sku：</span><span className="gss-sr-num-name">{skuInfo.skuId}</span></p>
                </li>);
                if(packDatePickerConfig) {
                    temArr.push(<li key={"gss-datepicker-key"} className={"gss-dim-res-item gss-dim-res-datepicker"}>
                        <span className="gss-dim-res-item-title">{"时间"}</span><span className="gss-dim-res-item-name" title={datepickerName}>{datepickerName}</span>
                    </li>);
                }
                if(channelDropDownConfig) {
                    temArr.push(<li key={"gss-channel-key"} className={"gss-dim-res-item gss-dim-res-channel"}>
                        <span className="gss-dim-res-item-title">{"终端"}</span><span className="gss-dim-res-item-name" title={channelName}>{channelName}</span>
                    </li>);
                }
                resArr.push(<ul key={item.code} className="gss-sku-res-list" style={headerShowFlag[1]?{"display":"block"}:{"display":"none"}}>{temArr}</ul>);

            }
        });

        if(componentConfig.length === 0) {
            let temArr = [];
            if(packDatePickerConfig) {
                temArr.push(<li key={"gss-datepicker-key"} className={"gss-dim-res-item gss-dim-res-datepicker"}>
                    <span className="gss-dim-res-item-title">{"时间"}</span><span className="gss-dim-res-item-name" title={datepickerName}>{datepickerName}</span>
                </li>);
            }
            if(channelDropDownConfig) {
                temArr.push(<li key={"gss-channel-key"} className={"gss-dim-res-item gss-dim-res-channel"}>
                    <span className="gss-dim-res-item-title">{"终端"}</span><span className="gss-dim-res-item-name" title={channelName}>{channelName}</span>
                </li>);
            }
            resArr.push(<ul key={"no-cate-sku"} className="gss-sku-res-list" style={{"display":"block"}} >{temArr}</ul>);
        }


        let gssBtnCls = classNames({
            "gss-btn" : true,
            "gss-btn-open" : curWinShow
        });

        return (
            <div className="grace-sift-switch-box">
                <div className="grace-sift-switch gss">
                    <div className="gss-hd" onClick={this.gssBtnClickHandler}>
                        <div className={gssBtnCls} onClick={this.gssBtnClickHandler}></div>
                        { resArr }
                    </div>
                    <div className="gss-bd-box" style={curWinShow ? {"display":"block"}:{"display":"none"}}>
                        <SiftSwitchCollection componentConfig={componentConfig}
                                              curWinStatus = {curWinStatus}
                                              openSessionRevert = {openSessionRevert}
                                              packDatePickerConfig = {packDatePickerConfig}
                                              channelDropDownConfig = {channelDropDownConfig}
                                              curWinShow={curWinShow}
                                              winClose={this.winCloseHandler}
                                              dataChangeHandler={this.dataChangeHandler}  />
                    </div>
                </div>
            </div>
        );
    }

}

export default GraceSiftSwitchComponent;
