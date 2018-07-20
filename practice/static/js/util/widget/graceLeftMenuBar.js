import React, {Component} from 'react'
import PropTypes from 'prop-types'

import {Config, Util} from 'util'
import classNames from 'classnames';

import $ from 'n-zepto'

import 'css/widget/graceLeftMenuBar.scss'

class GraceLeftMenuBar extends Component {

    constructor(props) {
        super(props);

        this.urlMapMenuCode = {
            "/views/pra/example.html":"example",
            "/views/pra/p6.html":"practice"
        };

        this.state = {
            leftNavFold: false, //菜单是否折叠
            curMenuCode: this.getMenuCodeBySession(),
            firMenuFold: [],
            brandOptionShow: false
        };

        this.leftBarClickHander = this.leftBarClickHander.bind(this);
        this.menuClikcHandler = this.menuClikcHandler.bind(this);
        this.mouseToggleEv = this.mouseToggleEv.bind(this);
        this.menuMouseEnter = this.menuMouseEnter.bind(this);
        this.menuMouseLeave = this.menuMouseLeave.bind(this);
    }

    //一品多供切换供应商
    getGlobalInfo(vendorId) {
        Util.customFetch({
            url: Config.url.global.globalInfo,
            data: "vendorId="+vendorId,
            success: (res, status, xhr) => {
                if((typeof res).toLowerCase() === "string") {
                    res = JSON.parse(res);
                }
                if(res.status === 0) {
                    let {menuList} = res.content.globalInfo;
                    //设置菜单的menuCode
                    this.setSessionMenuCode(menuList[0].children[0].menuCode);
                    window.location.href = menuList[0].children[0].menuPath;
                }
            }
        });
    }

    //通过session获得menuCode
    getMenuCodeBySession() {
        return sessionStorage.getItem("ppzh_menuCode");
    }

    leftBarClickHander() {
        this.setState({leftNavFold: !this.state.leftNavFold});
        this.props.togglerMenuBarHandler();
    }

    menuClikcHandler(index) {
        let {firMenuFold} = this.state;
        for(let i=0; i<firMenuFold.length; i++) {
            firMenuFold[i] = true;
        }
        firMenuFold[index] = false;
        this.setState({
            firMenuFold: firMenuFold
        })
    }

    brandClickHandler(event, brandNode) {
        //把vendor值放到sessionStorage中, 退出的时候，清除sessionStorage中的数据
        this.setSessionVendor(brandNode);
        //重新请求该供应商下的菜单数据，然后自动跳转到第一个菜单
        this.getGlobalInfo(brandNode.vendor);
    }

    mouseToggleEv() {
        let _this = this;
        if(_this.timerst) {
            clearTimeout(_this.timerst);
            _this.timerst = null;
            _this.setState({
                brandOptionShow : false
            });
            return;
        }
        _this.timerst = setTimeout(() => {
            _this.setState({
                brandOptionShow : true
            });
        }, 200);
    }

    menuMouseEnter(menuCode) {
        //如果菜单折叠才去触发事件
        if(this.state.leftNavFold){
            clearTimeout(this[menuCode].menuMouseTimer);
            this[menuCode].menuMouseTimer = setTimeout(()=> {
                this[menuCode].classList.add("lmc-fmi-fold-hover");
            }, 150);
        }
    }

    menuMouseLeave(menuCode) {
        if(this.state.leftNavFold){
            clearTimeout(this[menuCode].menuMouseTimer);
            this[menuCode].menuMouseTimer = setTimeout(()=> {
                this[menuCode].classList.remove("lmc-fmi-fold-hover");
            }, 150);
        }
    }

    componentWillReceiveProps(nextProps) {
        //先匹配url，如果匹配不上url，那么就走默认的
        //如果有menuCode，那么就对比，如果没有的话，那么就用默认的
        let menuList = null,
            { firMenuFold } = this.state;

        if(nextProps.globalInfo.user) {
            menuList = nextProps.globalInfo.menuList;

            var temHref = window.location.href,
                temMenuCode = "";

            for(var key in this.urlMapMenuCode) {
                if(temHref.indexOf(key) > 0) {
                    temMenuCode = this.urlMapMenuCode[key];
                    break;
                }
            }

            temMenuCode = temMenuCode ? temMenuCode : menuList[0].children[0].menuCode;

            sessionStorage.setItem("ppzh_menuCode", temMenuCode);

            for(let i=0; i<menuList.length; i++) {
                firMenuFold[i] = true;
                if(menuList[i].children) {
                    for(var j=0; j<menuList[i].children.length; j++) {
                        if(menuList[i].children[j].menuCode === temMenuCode) {
                            firMenuFold[i] = false;
                            break;
                        }
                    }
                }
            }
            this.setState({
                curMenuCode: temMenuCode, firMenuFold
            });
        }
    }

    setSessionMenuCode(menuCode) {
        sessionStorage.removeItem("linkBrandId");
        sessionStorage.setItem("ppzh_menuCode", menuCode);
    }

    /*一品多供对应的设置session*/
    setSessionVendor(vendor) {
        sessionStorage.setItem("vendor", JSON.stringify(vendor));
    }

    componentDidUpdate() {
        $(window).resize();
    }

    render() {
        const {user, menuList} = this.props.globalInfo;

        let userInfo = user && user.userInfo;

        let {firMenuFold, brandOptionShow, curMenuCode, leftNavFold} = this.state;
        if(!user || !user.vendorList || user.vendorList.length === 0) {
            brandOptionShow = false;
        }

        let menuContClass = classNames({
            "left-menu": true,
            "lmc-collapsed": leftNavFold
        }),
        brandOptionClsName = classNames({
            "lmc-brand-select-list": true,
            "lmc-brand-select-list-open": brandOptionShow
        }),
            brandSelectArrowCls = classNames({
                "lmc-brand-select-arrow": true,
               "hide": !user || !user.vendorList || user.vendorList.length === 0
            });

        return (
            <div className={menuContClass}>
                <div className="left-menu-content lmc">
                    <div className="lmc-header">
                        <div className="lmc-logo"><img className="logo-icon" src={require("../../../img/default.png")} width="37" /><span className="logo-name">品牌纵横</span></div>
                        <div className="lmc-brand-img"><img className="" src={userInfo && userInfo.imgUrl} width="90" height="90" /></div>
                        <div className="lmc-brand-select" onMouseEnter={this.mouseToggleEv} onMouseLeave={this.mouseToggleEv}>
                            <p className="lmc-brand-select-res" title={userInfo && userInfo.vendorName}>{userInfo && userInfo.vendorName}<i className={brandSelectArrowCls}></i></p>
                            <ul className={brandOptionClsName}>
                                {
                                    user && user.vendorList && user.vendorList.map((item, node) => {
                                        let temBrand = null;
                                        if(item.vendorType === 1) {
                                            temBrand = <span className="lmc-bso-flag lmc-bso-flag-brand">品</span>
                                        } else {
                                            temBrand = <span className="lmc-bso-flag">供</span>
                                        }
                                        return <li key={item.vendor} className="lmc-brand-select-opt lmc-bso" onClick={(event)=>this.brandClickHandler(event, item)}>{temBrand}<span className="lmc-bso-name">{item.vendorName}</span></li>;
                                    })
                                }
                            </ul>
                        </div>
                        <div className="lmc-fold"><i className="lmc-fold-btn" onClick={()=>this.leftBarClickHander()}></i></div>
                    </div>
                    <div className="lmc-menu">
                        <ul className="lmc-menu-firlv-list">
                            {
                                menuList.map((item, index) => {
                                    let childCont = null,
                                        firLvContClsName = (item.children&&item.children.length>0)?"lmc-fmi-cont ":"lmc-fmi-cont-no-submenu ",
                                        flrLvClasName = "lmc-firlv-menu-item lmc-fmi";
                                    firLvContClsName+=item.menuCode+"-icon";
                                    if(item.children && item.children.length > 0) {
                                        let ulShowClassName = "lmc-menu-seclv-list";
                                        let liList = item.children.map((childItem, childIndex) => {
                                            if(childItem.menuCode === curMenuCode) {
                                                ulShowClassName += " lmc-fmi-select";
                                                return (<li key={childItem.menuCode} className="lmc-menu-seclv-item cur-menu">
                                                    <a className="lmc-menu-seclv-link" href={childItem.menuPath} target={childItem.menuPath.indexOf("realTime/realRoom")>-1 ? "_blank":"_self"}
                                                       onClick={()=>this.setSessionMenuCode(childItem.menuCode)}>{childItem.menuName}</a>
                                                </li>)
                                            } else {
                                                return (<li key={childItem.menuCode} className="lmc-menu-seclv-item">
                                                    <a className="lmc-menu-seclv-link" href={childItem.menuPath} target={childItem.menuPath.indexOf("realTime/realRoom")>-1 ? "_blank":"_self"}
                                                       onClick={()=>this.setSessionMenuCode(childItem.menuCode)}>{childItem.menuName}</a>
                                                </li>)
                                            }

                                        });
                                        childCont = <ul className={ulShowClassName}>{ liList }</ul>
                                    }
                                    if(!firMenuFold[index]) {
                                        flrLvClasName+=" lmc-fmi-active"
                                    }
                                    return <li key={item.menuCode} className={flrLvClasName} ref={thisDom => {this[item.menuCode] = thisDom}}
                                                onMouseEnter={() => this.menuMouseEnter(item.menuCode)}
                                                onMouseLeave={() => this.menuMouseLeave(item.menuCode)}>
                                                <div className={firLvContClsName} onClick={() => this.menuClikcHandler(index)}>
                                                    <i className="lmc-fmi-icon"></i><span className="lmc-fmi-name">{item.menuName}</span>
                                                </div>
                                                {childCont}
                                            </li>
                                })
                            }
                        </ul>
                    </div>
                </div>
            </div>
        );

    }
}

export default GraceLeftMenuBar;
