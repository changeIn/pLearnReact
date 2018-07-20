/**
 * Created by yuhongping on 2018/1/23.
 */

import React,{ Component } from 'react';
import classNames from 'classnames';
import 'css/widget/graceCataDropdown.scss'
import GraceDropdown from './GraceDropdown';


/*
 * 1、columsNum 为3的时候，名字才会按照生意参谋那样来(showName在这里就变成生意参谋那样了)，否则就原封不动。
 *
 * 配置项
 * items            选项数组
 * onlySelectChild  只允许选择子级
 * columsNum        展开级别，是展开几级
 * onChange         选项改变回调函数
 * handleClick      点击回调
 * */
class GraceCataDropdown extends Component {

    static defaultProps = {
        config: {
            columsNum: 1,
            allObj: {id:"all", name:"全部"}
        }
    };

    constructor(props) {
        super(props);
        //代表当前生成的数据是否需要跳转，即默认选中的数据，不在当前屏；
        //数据还原或者初始化的时候，它的值才为true
        this.isInit = true;
        this._isMounted = true;


//debugger
        this.state = this.initState(this.props.config);

        if(!this.state) {
            this.state = {}
        } else {
            //先执行onChange事件回调，再执行render
            this.props.onChange(this.state.curCategory);
        }

        this.mouseEnterFn = this.mouseEnterFn.bind(this);
        this.changeCate = this.changeCate.bind(this);
        this.mouseLeaveFn = this.mouseLeaveFn.bind(this);
        this.allEnterHandler = this.allEnterHandler.bind(this);
        this.setStateByCurCategory = this.setStateByCurCategory.bind(this);
        this.selectAll = this.selectAll.bind(this);
    }

    //包括初始化curCategory，pItemArr，pIndex，cItemArr, cIndex, cSubItemArr, cSubIndex
    initState(config) {
        // 通过session初始化数据，初步判断是否可以根据session初始化变量，在有resetCategory的情况下，
        // 1、有些页面只能选择三级类目，不能选择全部
        // 2、有些页面只能选择三级类目，可以选择全部
        // 3、有些页面可以选择一二三级类目，不能选择全部
        // 4、有些页面可以选择一二三级类目，可以选择全部

        if(!config.items) return null;

        if((typeof config.columsNum).toLowerCase() !== "number") {
            config.columsNum = 1;
        }

        if(config.resetCategory && JSON.stringify(config.resetCategory) !== "{}"  &&
            ( !config.onlySelectChild ||
                (
                    config.onlySelectChild && (
                        config.resetCategory.selectedArr.length === config.columsNum ||
                        ( config.showAll && config.resetCategory.selectedAll )
                    )
                )
            )) {
            return this.initStateBySession(config);
        } else {
            return this.initStateByDefault(config);
        }
    }

    //根据session初始化selected
    initStateBySession(config) {
        // 1、不能仅仅取它的selectedArr，得判断selectedArr的值是否合适；
        // 2、如果session判断不合适的话，那么就相当于没有session，走initStateByDefault；
        // 3、selectArr如果是[]， 说明选择的是全部；
        let selectedArr = this.getSelectedArrByResetCategory(config.items, config.resetCategory);
        if(selectedArr) {
            //说明selectedArr通过resetCategory初始化成功
            return this.createStateBySelectedArr(selectedArr, config);
        } else {
            return this.initStateByDefault(config);
        }
    }

    // 根据sessionStorage，判断是否可以生成渲染selectedArr
    // curCategory.selectedAll和curCategory.pItem肯定有一个为null
    getSelectedArrByResetCategory(items, resetCategory) {
        let selectedArr = [], pItem, cItem, cSubItem;
        if(resetCategory.pItem) {
            for(let i=0; i<items.length; i++) {
                if(items[i].id === resetCategory.pItem.id) {
                    pItem = items[i];
                    selectedArr.push(i);
                    break;
                }
            }
            if(selectedArr.length === 0) return null;
            if(resetCategory.cItem && pItem.children) {
                for(let i=0; i<pItem.children.length; i++) {
                    if(pItem.children[i].id === resetCategory.cItem.id) {
                        cItem = pItem.children[i];
                        selectedArr.push(i);
                        break;
                    }
                }
                if(selectedArr.length === 1) return null;
                if(resetCategory.cSubItem && cItem.children) {
                    for(let i=0; i<cItem.children.length; i++) {
                        if(cItem.children[i].id === resetCategory.cSubItem.id) {
                            cSubItem = cItem.children[i];
                            selectedArr.push(i);
                            break;
                        }
                    }
                    return selectedArr;
                } else {
                    return selectedArr;
                }
            } else {
                return selectedArr;
            }
        } else if(resetCategory.selectedAll) {
            if(resetCategory.selectedAll.id === this.props.config.allObj.id) {
                return selectedArr;
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    //只要是这个方法，就绝对不考虑session的问题了(或者说reset的问题了)，只有初始化或者props改变，的时候才会考虑session的问题
    initStateByDefault(config) {
        let temSelectedArr = this.getSelectedArr(config);
        if(temSelectedArr) {
            return this.createStateBySelectedArr(temSelectedArr, config);
        } else {
            // 说明走的是ajax，那么就等ajax调用完成，自动更新ajax
            // 这里就不需要任何处理了
            return null;
        }
    }

    getSelectedArr(config) {
        const { items, selectedArr, showAll, columsNum, onlySelectChild } = config;
        let stateSelectedArr = [];
        if(selectedArr && (typeof selectedArr).toLocaleString() === "function") {
            //要通过方法运行生成selectedArr
            return selectedArr(this.props.config.resContent || items);
        } else if(showAll) {
            //选择全部
            return stateSelectedArr;
        } else if(onlySelectChild) {
            if(selectedArr && selectedArr.length === columsNum) {
                return selectedArr;
            } else {
                //既没有selectedArr，并且showAll为false，那么就是默认选择第一个，不管你有几级
                stateSelectedArr.push(0);
                if(items[0].children && items[0].children.length > 0 && columsNum > 1) {
                    //有二级
                    stateSelectedArr.push(0);
                    if(items[0].children[0].children && items[0].children[0].children.length > 0 && columsNum > 2) {
                        //有三级
                        stateSelectedArr.push(0);
                    }
                }
                return stateSelectedArr;
            }

        } if(selectedArr && selectedArr.length !== 0 ) {
            return selectedArr;
        }  else {
            if(items.length === 0) {
                return stateSelectedArr;
            }
            //既没有selectedArr，并且showAll为false，那么就是默认选择第一个，不管你有几级
            stateSelectedArr.push(0);
            if(items[0].children && items[0].children.length > 0 && columsNum > 1) {
                //有二级
                stateSelectedArr.push(0);
                if(items[0].children[0].children && items[0].children[0].children.length > 0 && columsNum > 2) {
                    //有三级
                    stateSelectedArr.push(0);
                }
            }
            return stateSelectedArr;
        }
    }

    //通过selectedArr生成State
    createStateBySelectedArr(selectedArr, config) {
        const {items, onlySelectChild, columsNum} = config;
        // 到这里，selectedArr肯定是一个数据，长度>=0
        // curCategory.cIndex 表示需要把文字状态置位选中的，selectedAll:选择全部， selectedArr表示已选择的数，在onlySelected为true时，这两个值可能不一一样
        let curCategory = {pItem:null, cItem:null, cSubItem:null, pIndex:-1, cIndex:-1, cSubIndex:-1, showName:"", selectedAll:null, selectedArr:[]},
            pItemArr = items, cItemArr = null, cSubItemArr = null, pIndex = -1, cIndex = -1, cSubIndex = -1;

        if(selectedArr.length === 0) {
            //相当于选择了全部, 因为allObj是可以自定义的，所以id和name是啥都有可能，所以
            curCategory.selectedAll = config.allObj;
            curCategory.showName = config.allObj.name;
            if(pItemArr && pItemArr.length>0 && pItemArr[0].children && pItemArr[0].children.length > 0) {
                cItemArr = pItemArr[0].children;
                if(cItemArr[0].children && cItemArr[0].children.length > 0) {
                    cSubItemArr = cItemArr[0].children;
                }
            }
        } else {
            //分两种情况，只能选择最后一级的节点；一二三级都可以选
            for(let i=0; i<selectedArr.length; i++) {
                let temNum = selectedArr[i];
                if(i === 0) {
                    if(onlySelectChild && i+1===columsNum) {
                        curCategory.pIndex = temNum;
                        curCategory.pItem = pItemArr[temNum];
                        curCategory.selectedArr.push(temNum);
                        curCategory.showName = curCategory.pItem.name;
                    } else if(onlySelectChild) {
                        curCategory.pIndex = temNum;
                        curCategory.pItem = pItemArr[temNum];
                        curCategory.selectedArr.push(temNum);
                        curCategory.showName = pItemArr[temNum].name;
                    } else {
                        curCategory.pIndex = temNum;
                        curCategory.pItem = pItemArr[temNum];
                        curCategory.selectedArr.push(temNum);
                        curCategory.showName = curCategory.pItem.name;
                    }
                } else if(i === 1) {
                    if(pItemArr && pItemArr.length>0 && pItemArr[curCategory.pIndex].children && pItemArr[curCategory.pIndex].children.length > 0) {
                        cItemArr = pItemArr[curCategory.pIndex].children;
                        if(onlySelectChild && i+1 === columsNum) {
                            curCategory.selectedArr.push(temNum);
                            curCategory.cItem = cItemArr[temNum];
                            curCategory.cIndex = temNum;
                            curCategory.showName += " > " + curCategory.cItem.name;
                        } else if(onlySelectChild) {
                            curCategory.selectedArr.push(temNum);
                            curCategory.cItem = cItemArr[temNum];
                            curCategory.cIndex = temNum;
                            curCategory.showName += " > " + cItemArr[temNum].name;
                        } else {
                            curCategory.selectedArr.push(temNum);
                            curCategory.cItem = cItemArr[temNum];
                            curCategory.cIndex = temNum;
                            curCategory.showName += " > " + curCategory.cItem.name;
                        }
                    }
                } else if(i === 2) {
                    if(cItemArr && cItemArr[curCategory.cIndex].children && cItemArr[curCategory.cIndex].children.length>0) {
                        cSubItemArr = cItemArr[curCategory.cIndex].children;
                        curCategory.selectedArr.push(temNum);
                        curCategory.cSubItem = cSubItemArr[temNum];
                        curCategory.cSubIndex = temNum;
                        curCategory.showName += " > " + curCategory.cSubItem.name;
                    }
                }
            }
        }

        //最后生成下面这些东西，更新state
        return {
            curCategory, pItemArr, cItemArr, cSubItemArr, pIndex, cIndex, cSubIndex
        };
    }

    //设计-1的地方，会有值为0的情况，所以不能用||运算，所以-1用其他的代替也得这么判断
    mouseEnterFn(e, item, arrIndex, level) {
        clearTimeout(this.setTimeoutTimer);
        //e.target.classList.add("nihao")
        let { pIndex, cIndex, curCategory } = this.state;
        this.setStopPropagation(e);
        if(level === 2) {
            this.setState({
                pIndex: pIndex === -1 ? (curCategory.selectedAll)?0:curCategory.pIndex : pIndex,
                cIndex: cIndex === -1 ? (curCategory.selectedAll)?0:curCategory.cIndex : cIndex,
                cSubIndex: arrIndex
            });
        } else if(level === 0) {
            //改变cItem和cSubItem
            if(item.children && item.children.length > 0) {
                if(item.children[0].children && item.children[0].children.length>0) {
                    this.setState({
                        pIndex: arrIndex,
                        cItemArr: item.children,
                        cIndex:-1,
                        cSubItemArr: item.children[0].children,
                        cSubIndex: -1
                    });
                } else {
                    this.setState({
                        pIndex: arrIndex,
                        cItemArr: item.children,
                        cIndex:-1,
                        cSubItemArr: null,
                        cSubIndex:-1
                    });
                }
            } else {
                this.setState({
                    pIndex: arrIndex,
                    cItemArr:null,
                    cIndex: -1,
                    cSubItemArr:null,
                    cSubIndex: -1
                });
            }
        } else if(level === 1) {
            //只改变cSubItem
            if(item.children && item.children.length > 0) {
                this.setState({
                    pIndex: pIndex === -1 ? (curCategory.pIndex===-1)?0:curCategory.pIndex : pIndex,
                    cIndex: arrIndex,
                    cSubItemArr:item.children,
                    cSubIndex: -1
                });
            } else {
                this.setState({
                    pIndex: pIndex === -1 ? (curCategory.pIndex===-1)?0:curCategory.pIndex : pIndex,
                    cIndex: arrIndex,
                    cSubItemArr:null,
                    cSubIndex: -1
                });
            }
        }
    }

    //因为当鼠标移出的时候，我就要开始setTimeout了，如果此时鼠标移入其他的Li，那么就清除setTimeout
    mouseLeaveFn() {
        this.setTimeoutTimer = setTimeout(()=>{
            this.setStateByCurCategory();
        }, 1000);
    }

    //只要出发这个方法，就是根据state.curCategory还原
    setStateByCurCategory() {
        this.isInit = true;
        const {curCategory, cSubItemArr} = this.state;
        if(this._isMounted) {
            if (this.state.curCategory.selectedAll) {
                //说明现在在all上
                this.setState(this.createStateBySelectedArr([], this.props.config));
            } else {
                this.setState({
                    pIndex: -1,
                    cItemArr: (curCategory.pItem.children && curCategory.pItem.children.length > 0) ? curCategory.pItem.children : null,
                    cIndex: -1,
                    cSubItemArr: (curCategory.cItem && curCategory.cItem.children && curCategory.cItem.children.length > 0) ? curCategory.cItem.children
                        : (cSubItemArr && cSubItemArr.length > 0 ? cSubItemArr : null),
                    cSubIndex: -1
                });
            }
        }
    }

    allEnterHandler() {
        clearTimeout(this.setTimeoutTimer);
        this.setStateByCurCategory();
    }

    selectAll(e) {
        this.setStopPropagation(e);
        //当选中全部的时候，就没有selectedArr了
        let temState = this.createStateBySelectedArr([], this.props.config);
        this.setState(temState);
        this.props.handleClick();
        this.props.onChange(temState.curCategory);
    }

    createUlDom(param) {
        return <ul key={param.level} ref={(dom)=>{this[param.name] = dom}} className={classNames({"dropdown-menu border-out":true, "single-dropdown":param.columsNum===1})}>
            {
                param.itemArr && param.itemArr.map(function (item, arrIndex) {
                    let selectedCls = classNames({
                            "selected": param.selectedItem && param.selectedItem.id === item.id,
                            "gray-bg": (param.hoveIndex !== -1) && param.hoveIndex === arrIndex
                        }),
                        showCls = classNames({
                            'show-i':item.children && item.children.length>0,
                            'hide-i': true
                        });
                    return  <li key={item.id} className={selectedCls}>
                        <a href="javascript:void(0)"
                           onMouseEnter={ (e)=>{this.mouseEnterFn(e, item, arrIndex, param.level)} }
                           onMouseLeave={ this.mouseLeaveFn }
                           onClick={ (e)=>{this.changeCate(e, item, arrIndex, param.level)} }
                           title={item.name}>{item.name}</a>
                        <i className={showCls}></i>
                    </li>
                }, this)
            }
        </ul>
    }

    changeCate(e, item, arrIndex, level) {
        this.setStopPropagation(e);
        let {columsNum=2,onlySelectChild} = this.props.config;
        if(onlySelectChild && Number(columsNum)-1 != level) return;
        let curCategory = {};
        if(level === 0) {
            curCategory = {
                pItem: item,
                pIndex: arrIndex,
                cItem: null,
                cIndex:null,
                cSubItem:null,
                cSubIndex:null,
                selectedArr:[arrIndex],
                showName: item.name
            }
        } else if(level === 1) {
            let pIndex = this.state.pIndex === -1 ? this.state.curCategory.pIndex : this.state.pIndex;
            curCategory = {
                pItem: this.state.pItemArr[pIndex],
                pIndex,
                cItem: item,
                cIndex:arrIndex,
                cSubItem:null,
                cSubIndex:null,
                selectedArr:[pIndex, arrIndex],
                showName: this.state.pItemArr[pIndex].name+" > "+item.name
            }
        } else if(level === 2) {
            let pIndex = this.state.pIndex === -1 ? this.state.curCategory.pIndex : this.state.pIndex,
                cIndex = this.state.cIndex === -1 ? this.state.curCategory.cIndex : this.state.cIndex;
            curCategory = {
                pItem: this.state.pItemArr[pIndex],
                pIndex,
                cItem: this.state.cItemArr[cIndex],
                cIndex,
                cSubItem: item,
                cSubIndex: arrIndex,
                selectedArr:[pIndex, cIndex,  arrIndex],
                showName: this.state.pItemArr[pIndex].name+" > "+this.state.cItemArr[cIndex].name+" > "+item.name
            }
        }

        this.setState({
            curCategory
        });
        this.props.handleClick();
        this.props.onChange(curCategory);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(!this.state) {
            return true;
        }
        if(nextState.pIndex !== this.state.pIndex || nextState.cIndex !== this.state.cIndex || nextState.cSubIndex !== this.state.cSubIndex) {
            return true;
        }
        if(nextProps.config.columsNum !== this.props.config.columsNum
            || JSON.stringify(nextProps.config.selectedArr) !== JSON.stringify(this.props.config.selectedArr)
            || JSON.stringify(nextProps.config.items) !== JSON.stringify(this.props.config.items)
            || JSON.stringify(this.state.curCategory) !== JSON.stringify(nextState.curCategory)
            || JSON.stringify(this.state.curCategory) !== JSON.stringify(this.props.config.resetCategory)
            || nextProps.config.noJudgeCondition
        ) {
            return true;
        } else {
            return false;
        }

    }

    // 什么时候需要调用 onChange这个回调方法？？？
    // 1、初始化的时候调用
    // 2、ajax的时候调用，
    // 3、还有更新props的items，selectedArr的时候
    componentWillReceiveProps(nextProps) {
        if(nextProps.config.columsNum !== this.props.config.columsNum
            || JSON.stringify(nextProps.config.selectedArr) !== JSON.stringify(this.props.config.selectedArr)
            || (nextProps.config.items !== null && this.props.config.items === null)
            || JSON.stringify(nextProps.config.items) !== JSON.stringify(this.props.config.items)
            || JSON.stringify(nextProps.config.resetCategory) !== JSON.stringify(this.props.config.resetCategory)
            || nextProps.config.noJudgeCondition
        ) {
            if(!nextProps.config.items) return null;
            let temState = this.initState(nextProps.config);
            if(temState) {
                this.props.onChange(temState.curCategory);
                this.setState(
                    temState
                )
            }
        }
    }

    //最后一步就是计算滚动
    componentDidUpdate() {
        //现在需要做的就是判断明白什么时候需要跳转
        //只有两种情况需要自动跳转滚动条，第一种是第一次初始化的时候，第二种是mouseOut还原数据的时候
        if(this.isInit && this.props.isShow) {
            //跳转，并且设置为false
            this.isInit = false;
            let {pIndex, cIndex, cSubIndex} = this.state.curCategory;
            if(pIndex > 6) {
                this.pItemDom.scrollTop = 259*Math.floor(pIndex/7);
            } else if(cIndex > 6) {
                this.cItemDom.scrollTop = 259*Math.floor(cIndex/7);
            } else if(cSubIndex > 6) {
                this.cSubItemDom.scrollTop = 259*Math.floor(cSubIndex/7);
            }
        }

    }

    render(){
        //初始化的时候，就不应该有pIndex，cIndex，cSubIndex；只有当用户hover上去的时候，才会有这些Index！！！
        const { config } = this.props;
        if(!config.items) return null;
        const { columsNum=2 } = config;
        const { curCategory, pItemArr, pIndex, cItemArr, cIndex, cSubItemArr, cSubIndex } = this.state;

        if(!pItemArr) return null;

        let selectUlArr = [],
            showAllCls = classNames({
                'show-all': config.showAll
            }),
            selectedAllCls = classNames({
                'selected-all': curCategory.selectedAll
            }),
            dropdownBodyCls = classNames({
                "grace-cata-dropdown-body": true,
                "align-right": config.align === "right"
            });

        //后期可能把这个columsNum参数去掉，然后我来计算它的最深长度，现在传一个是为了方便，第二个就是我这边就不用计算了，节约了页面初始化时间
        for(let i=0; i<columsNum; i++) {
            if(i === 0) {
                selectUlArr.push(this.createUlDom({
                    itemArr:pItemArr,
                    level: 0,
                    name:"pItemDom",
                    hoveIndex: pIndex,
                    selectedItem: curCategory.pItem,
                    columsNum
                }));
            } else if(i === 1) {
                selectUlArr.push(this.createUlDom({
                    itemArr:cItemArr,
                    level: 1,
                    name:"cItemDom",
                    hoveIndex: cIndex,
                    selectedItem: curCategory.cItem,
                    columsNum
                }));
            } else if(i === 2) {
                selectUlArr.push(this.createUlDom({
                    itemArr:cSubItemArr,
                    level: 2,
                    name:"cSubItemDom",
                    hoveIndex: cSubIndex,
                    selectedItem: curCategory.cSubItem,
                    columsNum
                }));
            } else {
                return null;
            }
        }
        //onClick={e=>this.toggleCataBody(e)}这么写可以阻止冒泡，  this.toggleCataBody.bind(this, e)就不行，天坑！ 还要考虑为什么不行
        return (
            <div className={"grace-btn-group cata-dropdown " + "grace-catedropdown-" + config.name} >
                <button type="button" className="grace-btn btn-primary dropdown-toggle" onClick={event=>this.toggleCataBody(event)}>
                    <span className="select-res-name" title={curCategory.showName}>{curCategory.showName}</span>
                    <span className="down-icon"></span>
                </button>
                <div className={dropdownBodyCls}>
                    <div className={"hide-all " + showAllCls + ' ' + selectedAllCls} onClick={e=>this.selectAll(e)} onMouseEnter={this.allEnterHandler}>
                        <span title="全部">全部</span>
                    </div>
                    <div className="ul-wrap">
                        {selectUlArr}
                    </div>
                </div>
            </div>
        )
    }

    toggleCataBody(event) {
        this.setStopPropagation(event);
        this.props.handleClick(event);
    }

    setStopPropagation(event){
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();
    }

    componentWillUnmount() {
        // 初始化的时候，就会触发这个，这个还得优化下，想想
        this._isMounted = false
    }
}

export default GraceDropdown(GraceCataDropdown);
/*
 let industryCategory = {
 items:[
 {"name":"女沙发装萨芬的","id":"111","children":[]}
 ,{"name":"男阿装","id":"222","children":[{"name":"男衬衫","id":"2221"}
 ,{"name":"西裤","id":"2222"},{"name":"西服","id":"2223"},{"name":"风衣","id":"2224"}
 ,{"name":"女衬衫","id":"1111"},{"name":"连衣裙","id":"1112"},{"name":"短裙","id":"1113"}
 ,{"name":"风衣","id":"1114"},{"name":"女衬衫","id":"11111"},{"name":"连衣裙","id":"11112"}
 ,{"name":"短裙","id":"11113"},{"name":"风衣","id":"11114"},{"name":"女衬衫","id":"111111"}
 ,{"name":"连衣裙","id":"111112"},{"name":"短裙","id":"111113"},{"name":"风衣","id":"111114"}
 ,{"name":"女衬衫","id":"1111111"},{"name":"连衣裙","id":"1111112"},{"name":"短裙","id":"1111113"}
 ,{"name":"风衣","id":"1111114"}
 ]}],
 noJudgeCondition: true, //这个参数默认为false，当它设置为true时，componentWillReceiveProps和shouldComponentUpdate触发时，不会做任何判断了，都会直接进入if
 allObj: {id:"all", name:"全部"},  allObj的值可以自定义
 columsNum: 3;  //表示该组件最大展示的层级，最大值是3，最小值是1，默认值是1
 resetCategory: {},  // 根据session初始化时需要设置的默认值,或者初始化需要还原的值！！！
 selectedArr: [0,0,0],  //初始化在没有session的基础上，的默认值， 可以为function()
 onlySelectChild: true //只能选择最后一个节点
 name:"categorySelect",
 showAll: config[i].hasAll,
 onChange: function() {
 //选项变化时触发的方法
 }
 }
 }
 */
