import React, { Component } from "react";
import {GraceCataDropdown} from "util";
import {Util, Config} from "util";
import _clonedeep from 'lodash.clonedeep';

//增加是否开启session还原选项！！！
class DimensionSwitchComponent extends Component {
    constructor(props) {
        super(props);

        this.initParamFlag = true; //只有在所有的组件初始化完成之后，才会变成false
        this.upParam = { code:"dim",  value:{} };
        this.categoryReset = null;
        this.thirdCategoryQuote = null;

        this.brandChangeHandler = this.brandChangeHandler.bind(this);
        this.categoryChangeHandler = this.categoryChangeHandler.bind(this);
        this.shopTypeChangeHandler = this.shopTypeChangeHandler.bind(this);
        this.priceRangeChangeHandler = this.priceRangeChangeHandler.bind(this);
    }

    //根据传入的参数，生成graceCateDropdown组件需要的配置
    converDefaultDataPattern(dataInfo) {
        const { config, sessionData } = this.props;
        let resetCategory = null;
        for(let i=0; i<config.length; i++) {
            resetCategory = null;
            if(config[i].code === "brand" && !this.brand) {
                resetCategory = this.pageJumpHandlerByBrand(dataInfo) || (sessionData.selectBrand && sessionData.selectBrand.selected);
                this.brand = {
                    items: dataInfo.brand,
                    selectedArr: config[i].selectedArr || [0],
                    resetCategory: Object.assign({}, resetCategory),
                    columsNum: 1,
                    name: "brandSelect",
                    allObj: {id:"all", name:"全部"},
                    showAll: true  //会自动增加全部这个选项
                };
            } else if(config[i].code === "category"  && !this.category) {
                resetCategory = sessionData.selectCate && sessionData.selectCate.selected;
                this.categoryReset = resetCategory;
                this.category = {
                    items: dataInfo.category,
                    resContent: this.props.retData,
                    selectedArr : config[i].selectedArr || [0],
                    resetCategory: Object.assign({}, resetCategory),
                    name:"categorySelect",
                    showAll: config[i].hasAll,
                    allObj: {id:"all", name:"全部"},
                    onlySelectChild: config[i].onlySelectChild ? true : false,
                    columsNum: 3
                };
            } else if(config[i].code === "shopType" && !config[i].noRender && !this.shopType) {
                let temItemData = [{"id":"zy", "name":"自营", children:[]}, {"id":"pop", "name":"POP", children:[]}];
                resetCategory = sessionData.selectShopType && sessionData.selectShopType.selected;
                this.shopType = {
                    items: temItemData,
                    selectedArr: config[i].selectedArr || [], //这样就是选全部了
                    resetCategory: Object.assign({}, resetCategory),
                    name: "shopTypeSelect",
                    allObj: { id:"all", name:"全部" },
                    showAll: config[i].hasAll, //会自动增加全部这个选项
                    columsNum: 1
                };
            } else if(config[i].code === "priceRange" && !this.priceRange) {
                resetCategory = sessionData.selectPriceRange && sessionData.selectPriceRange.selected;
                let temItems = null;
                // if(this.categoryReset && JSON.stringify(this.categoryReset) !== "{}" && this.categoryReset.cSubItem && this.categoryReset.cSubItem.priceRange) {
                //     temItems = this.categoryReset.cSubItem.priceRange;
                // }
                this.priceRange = {
                    items: null,
                    selectedArr : [],
                    resetCategory: Object.assign({}, resetCategory),
                    name:"priceRangeSelect",
                    allObj: { id:"all", name:"全部" },
                    showAll: config[i].hasAll, //会自动增加全部这个选项
                    columsNum: 1
                }
            }
        }
    }

    //根据session看是否是其他页面跳转过来的
    pageJumpHandlerByBrand(dataInfo) {
        // 有brand的时候，就要看有没有linkBrandId这个session，如果有的话，那么就根据这个id判断是否需要重写brandId的session。
        let brandIdSession = sessionStorage.getItem("linkBrandId"),
            sessionMenuCode = sessionStorage.getItem("ppzh_menuCode"),
            resetCategory = null;
        // linkBrandId  是页面跳转的时候用的。在跳转到交易概览或者流量概览的页面的时候。
        // 可能是上个页面跳转过来的，所以此时不能用上个页面的brand的session，跳转时点击的品牌的session
        if(brandIdSession && (sessionMenuCode==="tradeSummary" || sessionMenuCode==="flowSummary")) {
            let temBrandObj = null,
                brandIndex = null;
            for(let j=0; j<dataInfo.brand.length; j++) {
                if( dataInfo.brand[j].id == brandIdSession ) {
                    temBrandObj = dataInfo.brand[j];
                    brandIndex = j;
                    break;
                }
            }
            if(temBrandObj) {
                resetCategory ={ cIndex:null, cItem:null, cSubIndex:null, cSubItem:null, pIndex:brandIndex, pItem:temBrandObj, selectedArr:[brandIndex], selectedAll:null,showName:null };
                sessionStorage.setItem("brandSelect", JSON.stringify(resetCategory));
            }
        }
        return resetCategory;
    }

    // 品牌 onChange callback
    brandChangeHandler(value) {
        if(value.selectedAll) {
            this.initParam({"selectBrand" : {id:value.selectedAll.id, showName:value.selectedAll.name, selected:value}});
        } else {
            this.initParam({"selectBrand" : {id:value.pItem.id, showName:value.showName, selected:value}});
        }
    }

    // 类目onChange callback
    categoryChangeHandler(value) {
        let selectCate = this.getCategoryId(value);
        selectCate.selected = value;
        this.initParam( {selectCate} );
        if(this.priceRange) {
            //有价格带
            this.priceRange = _clonedeep(this.priceRange);
            // 1、value数据没有价格带，但是session数据有价格带，并且这两个id相等
            // 2、value数据本身就有价格带
            if(value.cSubItem.priceRange && value.cSubItem.priceRange.length > 0) {
                this.priceRange.items = value.cSubItem.priceRange;
                this.setState({});
                return;
            } else if(this.categoryReset && this.categoryReset.cSubItem && this.categoryReset.cSubItem.id === value.cSubItem.id && this.categoryReset.cSubItem.priceRange) {
                this.priceRange.items = this.categoryReset.cSubItem.priceRange;
                this.setState({});
                return;
            }

            this.sendAjaxGetPriceRange({
                secondCategoryId: value.cItem.id,
                thirdCategoryId: value.cSubItem.id
            });
        }
    }

    //根据id查看该三级类目是否有价格带
    getPriceRangeById(thirdCategoryId) {
        let temData = this.props.retData.category,
            fir = null,
            sec = null,
            thir = null;
        for(let i=0; i<temData.length; i++ ) {
            fir = temData[i].children;
            for(let j=0; j<fir.length; j++) {
                sec = fir[j].children;
                for(let m=0; m<sec.length; m++) {
                    thir = sec[m];
                    if(thirdCategoryId === thir.id) {
                        this.thirdCategoryQuote = thir;
                        if(thir.priceRange) {
                            return thir.priceRange;
                        } else {
                            return null;
                        }
                    }
                }
            }
        }
    }

    sendAjaxGetPriceRange(obj) {
        //{secondCategoryId=1, thirdCategoryId=2 }

        let _this = this,
            priceRange = this.getPriceRangeById(obj.thirdCategoryId);

        if(priceRange) {
            this.priceRange.items = priceRange;
            this.setState({});
        } else {
            $.ajax({
                url: Config.url.global.getPriceRangeByCategory,
                //得传一个供应商id的参数！！！一品多供的情况下，切换供应商之后，这个参数就不能为空了
                data: obj,
                success: (res, status, xhr) => {
                    if(res.status === 0) {
                        //有价格带
                        this.priceRange.items = res.content.priceRange;
                        if(this.thirdCategoryQuote) {
                            this.thirdCategoryQuote.priceRange = this.priceRange.items;
                        }
                        this.setState({});
                    }
                }
            });
        }

    }

    //得到三级类目Id
    getCategoryId(param) {
        if(param.cSubItem) {
            return {
                id : param.cSubItem.id,
                showName: param.showName
            }
        } else if(param.cItem) {
            let retId = "";
            for(var i=0; i<param.cItem.children.length; i++) {
                retId += param.cItem.children[i].id+",";
            }
            retId = retId.substring(0, retId.length-1);
            return {
                id: retId,
                showName: param.showName
            }
        } else {
            let retId = "";
            if(param.selectedAll) {
                //表示全部
                retId = param.selectedAll.id;
            } else {
                for(var i=0; i<param.pItem.children.length; i++) {
                    for(var j=0; j<param.pItem.children[i].children.length; j++) {
                        retId += param.pItem.children[i].children[j].id+",";
                    }
                }
                retId = retId.substring(0, retId.length-1);
            }
            return {
                id: retId,
                showName: param.showName
            }
        }
    }

    // 经营模式 onChange callback
    shopTypeChangeHandler(value) {
        if(value.selectedAll) {
            this.initParam({"selectShopType": {id:value.selectedAll.id, showName:value.selectedAll.name, selected:value}});
        } else {
            this.initParam({"selectShopType": {id:value.pItem.id, showName:value.showName, selected:value}});
        }
    }

    //价格带
    priceRangeChangeHandler(value) {
        //debugger
        if(value.selectedAll) {
            this.initParam({"selectPriceRange": {id:value.selectedAll.id, showName:value.selectedAll.name, selected:value}});
        } else {
            this.initParam({"selectPriceRange":{id:value.pItem.id, showName:value.showName, selected:value}});
        }
    }

    initParam(param) {
        const { config } = this.props;
        this.upParam.value = Object.assign(this.upParam.value, param);
        if(this.initParamFlag) {
            //还处在初始化参数的阶段
            for(var i=0; i<config.length; i++) {
                if (config[i].noRender) {
                    continue;
                } else if (config[i].code === "brand") {
                    if(!this.upParam.value.selectBrand) {
                        this.initParamFlag = false;
                    }
                } else if(config[i].code === "category") {
                    if(!this.upParam.value.selectCate) {
                        this.initParamFlag = false;
                    }
                } else if(config[i].code === "shopType") {
                    if(!this.upParam.value.selectShopType) {
                        this.initParamFlag = false;
                    }
                } else if(config[i].code === "priceRange") {
                    if(!this.upParam.value.selectPriceRange) {
                        this.initParamFlag = false;
                    }
                }
            }
            if(!this.initParamFlag) {
                //说明还有没有值的,没有初始化完成
                this.initParamFlag = true;
            } else {
                //都有值了，说明初始化完成了
                this.initParamFlag = false;
                this.props.updateDataHandler(this.upParam);
            }
        } else {
            //直接合成参数，调用父级方法
            this.props.updateDataHandler(this.upParam);
        };

    }

    render() {
        this.converDefaultDataPattern(this.props.retData);

        let resArr = [];

        const { config } = this.props;

        config.map((item, index) => {
            if(item.noRender) {
                resArr.push(null);
            } else {
                resArr.push(
                    <li key={item.code} className="dim-item">
                        <p className="dim-item-name">{item.name}</p>
                        <GraceCataDropdown config={ this[item.code] } onChange={ this[item.code + "ChangeHandler"] } />
                    </li>);
            }
        });

        return (
            <div className="dim-switch-box" >
                <ul className="dim-list">
                    { resArr }
                </ul>
            </div>
        );
    }

}

export default DimensionSwitchComponent;
