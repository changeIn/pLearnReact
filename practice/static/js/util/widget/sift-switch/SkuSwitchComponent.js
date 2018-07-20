import React, { Component } from "react";
import {Util, Config} from "util";
import classNames from 'classnames';

class SkuSwitchComponent extends Component {
    constructor(props) {   
        super(props);
        this.state = {
            hideSkuRes:true,
            skuRes: {
                skuId:"",
                skuTitle:"",
                skuImg:""
            },
            hideSkuSearchError:true
        };
        this.searchBySku = this.searchBySku.bind(this);
        this.inputClickHandler = this.inputClickHandler.bind(this);
        this.checkInputVal = this.checkInputVal.bind(this);
    }

    inputClickHandler(e) {
        e.nativeEvent.stopImmediatePropagation();
    }

    cancelBububble(e) {
        e.nativeEvent.stopImmediatePropagation();
    }

    searchBySku(e) {
        e.nativeEvent.stopImmediatePropagation();
        let searchValue = this.skuInput.value;
        Util.customFetch({
            url: Config.url.global.searchSku,
            data: "skuId="+searchValue,  //得传一个供应商id的参数！！！跟后端确认下，一品多供的情况下，肯定得切换供应商
            success: (res, status, xhr)=>{
                if(!Util.isContentEmpty(res)) {
                    this.setState({
                        skuRes: res.content,
                        hideSkuRes: false,
                        hideSkuSearchError: true
                    });
                    this.props.updateDataHandler({
                        code:"sku",
                        value:res.content
                    });
                } else {
                    this.setState({
                        hideSkuRes: true,
                        hideSkuSearchError: false
                    });
                    this.props.updateDataHandler({
                        code:"sku",
                        value:""
                    });
                }
            }
        });
    }

    // componentWillReceiveProps(nextProps) {
    //     const { config } = this.props;
    //     if(nextProps.curWinStatus === "close") {
    //         //筛选框即将打开，此时要把所有的数据清空
    //         this.skuInput.value = "";
    //         this.setState({
    //             hideSkuRes: true,
    //             hideSkuSearchError: true
    //         })
    //     }
    // }

    checkInputVal() {
        this.skuInput.value = this.skuInput.value.replace(/[^0-9]/g,'');
        if(this.skuInput.value.length > 30) {
            this.skuInput.value = this.skuInput.value.substring(0, 30);
        }
    }

    render() {
        const {skuRes, hideSkuRes, hideSkuSearchError} = this.state;
        let skuSearchResCls = classNames({
            "sku-search-res":true,
            "hide":hideSkuRes
        });
        let skuSearchErrorBoxCls = classNames({
            "sku-search-error-box" : true,
            "hide": hideSkuSearchError
        });
        return (
            <div className="sku-switch-box" onClick={this.cancelBububble}>
                <p className="sku-input-box">
                    <input className="sku-input" ref={(input)=>{this.skuInput = input}} onKeyDown={this.checkInputVal} onKeyUp={this.checkInputVal} onClick={(e)=>this.inputClickHandler(e)} type="text" placeholder="请输入sku编码" />
                    <button className="sku-input-btn" onClick={this.searchBySku}>1</button>
                </p>
                <div className={skuSearchResCls} >
                    <div className="sku-search-res-img"><img src={skuRes.skuImg} width="58" height="58" alt="" /></div>
                    <div className="sku-search-res-cont">
                        <p className="sku-search-res-cont-name"><span>{skuRes.skuTitle}</span></p>
                        <p><span>SKU：{skuRes.skuId}</span></p>
                    </div>
                </div>
                <div className={skuSearchErrorBoxCls}>
                    <p className="sku-search-error"><span className="sku-search-error-icon"></span><span className="sku-search-error-tip">找不到商品，请重新输入</span></p>
                </div>
            </div>
        );
    }

}

export default SkuSwitchComponent;