import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { GraceLeftMenuBar, GraceSiftSwitch } from 'util';

/**
{
    pageName:"店铺排行", //页面名称，作为头部筛选框上边，展示页面名字的值，必填
    pageClassName:"shop-rank-page", //用来覆盖本页面的全局样式class等，如果有这个属性，这个class会被添加到id为page-wrapper的dom上
    plugin:[
         {
             id:"GraceSiftSwitch", //需要用的组件名称，必写
             float:"fl", //fr 左侧布局
             className:"",  //可以给组件的外层包裹一个class，这样如果需要改样式，可以通过class来改
             config:"" //可以不写，没有的话，就走默认
         },
         {
             id:"channelDropDown", //必写
             float:"fr", //必写
             className:"", //非必写
             config:"" //可以不写，没有的话，就走默认
         },
         {
             id:"GracePackDatePicker", //需要用的组件名称
             float:"fr", //fr
             className:"datepicker-clse",
             config:{
                 items: [
                     { name: '按日查询', code: 'day',  defaultStartDate: "2018-02-04"},
                     { name: '按周查询', code: 'week'},
                     { name: '按月查询', code: 'month'},
                     { name: '近7天', code: '7', isInit: true},
                     { name: '近30天', code: '30'},
                     { name: '自定义', code: 'dayRange', minDate:"2018-02-01"}
                 ],
                 minDate: '2017-02-12',
                 pushDataTaskTime: 8
            }
        }
    ]
}
* */

const GracePageFramework = (WrappedComponent, pageParam) => {
    pageParam || (pageParam = { pageName: '交易概况' });

    return class GracePage extends Component {
        static propTypes = {
            dispatch: PropTypes.func.isRequired,
            curDimensionChangeHandler: PropTypes.func.isRequired
        };
        // 设置cookie的值
        static setCookie(cname, cvalue, exdays) {
            const d = new Date();
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
            const expires = `expires=${d.toUTCString()}`;
            document.cookie = `${cname}=${cvalue}; ${expires};path=/`;
        }
        // 维度筛选的配置项（品牌，类目，经营模式，店铺类型，sku查询）
        static getSiftSwitchConfigFn(param) {
            if (!param.config) {
                param.config = {
                    componentName: 'GraceSiftSwitchComponent',
                    openSessionRevert: true, // 为true表示开启session还原
                    componentConfig: [
                        {
                            name: '商品筛选',
                            code: 'siftSwitch', // 固定死的
                            list: [
                                {
                                    name: '品牌',
                                    hasAll: true, // true代表有全部的这个选项，默认为true
                                    code: 'brand' // 固定死的
                                },
                                {
                                    name: '类目',
                                    hasAll: true, // true代表有全部的这个选项，默认为true
                                    code: 'category', // 固定死的
                                    vendorHide: false // 当时供应商的时候，自动隐藏， 默认为false
                                },
                                {
                                    name: '经营模式',
                                    code: 'shopType', // 固定死的
                                    hasAll: true, // true代表有全部的这个选项，默认为true
                                    vendorHide: true // 当时供应商的时候，自动隐藏， 默认为false
                                }
                            ]
                        },
                        {
                            name: 'SKU搜索',
                            code: 'skuSwitch'
                        }
                    ]
                };
            }

            if (param.config.openSessionRevert !== true && param.config.openSessionRevert !== false) {
                // 我就认为没有这个参数，那么就设置为默认值true
                param.config.openSessionRevert = true;
            }
            return param;
        }
        // 得到渠道的配置项
        static getChannelDropDownConfigFn(param) {
            if (!param.config) {
                param.config = {
                    name: 'channelSelect',
                    items: [
                        { id: 2, name: 'PC' },
                        {
                            id: 6,
                            name: '无线整体',
                            children: [
                                { id: 1, name: 'APP' },
                                { id: 4, name: '手Q' },
                                { id: 3, name: '微信' },
                                { id: 5, name: 'M端' }
                            ]
                        }
                    ],
                    align: 'right', // 对齐方式，默认左对齐
                    selectedArr: [],
                    allObj: { id: 0, name: '全部渠道' },
                    columsNum: 2,
                    showAll: true
                };
            }
            return param;
        }
        // 日期组件的配置
        static getPackDatePickerConfigFn(param) {
            if (!param.config) {
                param.config = {
                    items: [
                        // { name: '按日查询', code: 'day',  defaultStartDate: "2018-02-04"},
                        { name: '按日查询', code: 'day' },
                        { name: '按周查询', code: 'week' },
                        { name: '按月查询', code: 'month' },
                        { name: '近7天', code: '7', isInit: true },
                        { name: '近30天', code: '30' },
                        { name: '自定义', code: 'dayRange', minDate: '2018-02-01' }
                    ],
                    minDate: '2017-02-12',
                    pushDataTaskTime: 8
                };
            }
            return param;
        }
        constructor(props) {
            super(props);
            if (window.location.href.indexOf('cube') > -1 || window.location.href.indexOf('pageinfoserver') > -1 || window.location.href.indexOf('tppzh') > -1) {
                const temSearch = window.location.search;
                if (temSearch.indexOf('cookiename') > -1) {
                    let temName = temSearch.split('=');
                    temName = temName[1];
                    GracePage.setCookie('tmpcookiename', temName, 2);
                }
            }
            this.dispatchParam = {
            };
            this.originParam = {};
            this.otherParam = {};
            this.vendor = null;
            this.state = {
                globalInfo: {
                    menuList: [{
                        menuCode: "example",
                        children: [{
                            menuCode: "示例",
                            menuId: 2,
                            menuPath: "/views/pra/example.html",
                            menuName: "交易概况"
                        }, {
                            menuCode: "practice",
                            menuId: 3,
                            menuPath: "/views/pra/p6.html",
                            menuName: "练习"
                        }],
                        menuId: 1,
                        menuPath: null,
                        menuName: "行业"
                    }],
                    user: {
                        "vendorList": [],
                        "userInfo": {
                            "vendorCode": null,
                            "imgUrl": "/static/img/brand-icon.jpg",
                            "vendorName": "南极电商（上海）有限公司",
                            "vendor": "南极电商数据专用",
                            "vendorType": 0
                        }
                    },
                    pin: '测试用户'
                }, // 全局数据，包括菜单信息，用户信息等
                foldMenu: false // 折叠菜单
            };

            this.togglerMenuBarHandler = this.togglerMenuBarHandler.bind(this);
            this.curDimensionChangeHandler = this.curDimensionChangeHandler.bind(this);
            this.siftSwitchChangeFn = this.siftSwitchChangeFn.bind(this);
        }
        // 只有当curDimensionChangeHandler和globalInfo都有值的时候，才能触发dispatch
        curDimensionChangeHandler(param, otherParam) {
            const { dispatch } = this.props;
            const newParam = { ...this.dispatchParam, ...param };
            this.otherParam = { ...this.otherParam, ...otherParam };

            if (this.state.globalInfo.user) {
                if (this.state.globalInfo.user.userInfo.vendorType === 0) {
                    newParam.vendor = '';
                } else {
                    newParam.vendor = this.state.globalInfo.user.userInfo.vendor;
                }
                this.otherParam.vendorType = this.state.globalInfo.user.userInfo.vendorType;
            }

            dispatch(this.props.curDimensionChangeHandler(this.originParam, newParam, this.otherParam));
            this.dispatchParam = newParam;
            this.originParam = Object.assign({}, this.dispatchParam);
        }
        siftSwitchChangeFn(dataParam, otherParam) {
            if (dataParam.skuId) {
                // skuId, 删除所有其他的swift参数
                delete this.dispatchParam.brandId;
                delete this.dispatchParam.thirdCategoryId;
                delete this.dispatchParam.shopType;
                dataParam.brandId = 'all';
                dataParam.thirdCategoryId = 'all';
                if (this.state.globalInfo.user.userInfo.vendorType === 0) {
                    dataParam.shopType = 'all';
                }
            } else if (dataParam.brandId || dataParam.thirdCategoryId) {
                delete this.dispatchParam.skuId;
            }
            this.curDimensionChangeHandler(dataParam, otherParam);
        }
        togglerMenuBarHandler() {
            this.setState({
                foldMenu: !this.state.foldMenu
            });
        }
        createGraceSiftSwitch() {
            const param = pageParam.plugin;
            let siftSwitchConfig = null,
                    channelDropDownConfig = null,
                    packDatePickerConfig = null;

            for (let i = 0; i < param.length; i++) {
                if (param[i].id === 'GraceSiftSwitch') {
                    siftSwitchConfig = GracePage.getSiftSwitchConfigFn(param[i]);
                } else if (param[i].id === 'GracePackDatePicker') {
                    packDatePickerConfig = GracePage.getPackDatePickerConfigFn(param[i]);
                } else if (param[i].id === 'channelDropDown') {
                    channelDropDownConfig = GracePage.getChannelDropDownConfigFn(param[i]);
                }
            }
            let temClassName = '';
            if (siftSwitchConfig) {
                // 用户传进来的时候，也有可能有这个选项，所以还是得系统自己判断
                temClassName = classNames({
                    'fl fl-component-wrapper': siftSwitchConfig.float === 'fl',
                    'fr fr-component-wrapper': siftSwitchConfig.float === 'fr',
                    [siftSwitchConfig.className]: siftSwitchConfig.className
                });
            } else {
                temClassName = 'fl fl-component-wrapper';
            }

            return (
                <div key={siftSwitchConfig ? siftSwitchConfig.id : 'siftSwitch'} className={temClassName}>
                    <GraceSiftSwitch siftSwitchConfig={siftSwitchConfig} curDimensionChangeHandler={this.siftSwitchChangeFn} packDatePickerConfig={packDatePickerConfig} channelDropDownConfig={channelDropDownConfig} />
                </div>);
        }

        render() {
            const { foldMenu, globalInfo } = this.state, pageWrappgerCls = classNames({
                        'page-wrapper': true,
                        [pageParam.pageClassName]: pageParam.pageClassName
                    }),
                    mainMenuClassName = classNames({
                        'main-menu': true,
                        'main-menu-fold': foldMenu
                    }),
                    mainContainerClassName = classNames({
                        'main-container': true,
                        'main-container-fold': foldMenu
                    }),
                    retHeadArr = [];

            if (globalInfo.user) {
                retHeadArr.push(this.createGraceSiftSwitch());
            }
            // pageParam.pageName = <span>dfadsafdsafdsa</span>
            return (
                <div id='page-wrapper' className={pageWrappgerCls}>
                    <div id='page-main-wrapper' className='page-main-wrapper'>
                        <div id='main-menu' className={mainMenuClassName}>
                            <GraceLeftMenuBar globalInfo={globalInfo} togglerMenuBarHandler={this.togglerMenuBarHandler} />
                        </div>
                        <div id='main-container' className={mainContainerClassName}>
                            <div className='main-container-wrapper'>
                                <div className='main-container-header'>
                                    <div className='main-container-header-title'><p>{pageParam.pageName}</p></div>
                                    <div className='main-container-header-wrapper'>
                                        { retHeadArr }
                                    </div>
                                </div>
                                <WrappedComponent {...this.props} />
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    };
};
export default GracePageFramework;

