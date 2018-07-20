import React, { Component } from "react";
import GraceSiftSwitchComponent from "./GraceSiftSwitchComponent"
/*
* openSessionRevert 是否开启筛选记忆功能， true开启
* */

class GraceSiftSwitch extends Component {
    constructor(props) {
        super(props);
        this.dataChangeHandler = this.dataChangeHandler.bind(this);
    }

    dataChangeHandler(param, otherParam) {
        // 这个方法是为了调用PageFramework中curDimensionChangeHandler
        // param = {
        //     brandId:"13342",
        //     thirdCategoryId:"15252,12432,56112",
        //     shopType:"pop",
        // }
        this.props.curDimensionChangeHandler(param, otherParam);
    }

    render() {
        // 初始化这个render可能走好几遍，需要检查下这个问题。这个应该和页面有关，页面调用几次dispatch
        // console.log("GraceSiftSwitch   render .........");
        let { siftSwitchConfig, packDatePickerConfig, channelDropDownConfig, globalInfo } = this.props;
        /*
        这个siftConfig 和 dataConfig 应该是通过props获取的；通过不同的componentName，生成不同的筛选组件
        const config = {
            componentName:"GraceSiftSwitchComponent",
            componentConfig: [
                {
                    name:"商品筛选",
                    code: "siftSwitch",
                    list:[{
                        name:"品牌",
                        hasAll: false,  //true代表有全部的这个选项，默认为false
                        code:"brand"
                    }, {
                        name:"类目",
                        hasAll: true,  //true代表有全部的这个选项， 默认为false
                        code:"category"
                    }, {
                        name:"经营方式",
                        code:"shopType",
                        hasAll: false,  //true代表有全部的这个选项，这个选项为有两列或者三列的元素开启的
                        vendorHide:true  //当时供应商的时候，自动隐藏， 默认为false
                    }]
                },
                {
                    name: "SKU搜索",
                    code: "skuSwitch"
                }
            ]
        }
        */
        if(!siftSwitchConfig) {
            siftSwitchConfig = {
                config:{
                    componentConfig: []
                }
            }
        }
        //将来随着页头筛选组件的增多，如果其他样式的筛选组件，并且当前这个头部筛选组件的样式满足不了，会在这个地方来判断，我选用什么样的筛选组件
        //if(siftSwitchConfig.config.componentName === "GraceSiftSwitchComponent") {
            return <GraceSiftSwitchComponent componentConfig={siftSwitchConfig.config.componentConfig}
                                             openSessionRevert={siftSwitchConfig.config.openSessionRevert}
                                             packDatePickerConfig = {packDatePickerConfig}
                                             channelDropDownConfig = {channelDropDownConfig}
                                             dataChange={this.dataChangeHandler} />
        // } else {
        //     return null;
        // }
    }

}

export default GraceSiftSwitch;
