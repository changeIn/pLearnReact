/**
 * Created by Ryanchill on 2018/1/30
 */

/* description
 *
 * 1.使用方式
 * let miniPaginationConfig = {
 *     currPage:1;
 *     showPage:true
 * }
 * 
 * <GraceMiniPagination  {...miniPaginationConfig} />
 *  
 * 2.配置项
 * @param {number}  currPage: 1,                    // 当前显示的页码        
 * @param {bool}    showPage: true,                 // 是否显示页码数字
 * @param {bool}    enableIuputJump                 // 是否允许通过输入来进行跳转
 * @param {func}    toPage: function(pageNumObj){ } // 跳转页码的回调. 参数 页码对象
 * @param {number}  totalPage: 10,                  // 总共多少页
 * @param {bool}    morePage: false                 // 目前页码数据显示到边界后，是否还需要远程加载数据
 * @param {string}  align:left | center | right }   // 分页组件在容器中的位置      
 * @param {string}  size:'s|m|l'                    // 组件大小
 *         
 * 
 */


import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import "css/widget/graceMiniPagination.scss";
import "css/common.scss";

class GraceMiniPagination extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.initState(this.props);
        this.initState = this.initState.bind(this);
    }

    // 初始化state
    initState(obj) {
        return {
            counter: 0,
            currPage: obj.currPage || 1,
            totalPage: obj.totalPage,
            showPage: obj.showPage === void(0) ? true :obj.showPage,
            morePage: obj.morePage === void(0) ? false : obj.morePage,
            align:obj.align || 'right',
            enableIuputJump: obj.enableIuputJump === void(0)? true:obj.enableIuputJump,
            isBegin: true,  // 开始标志
            isEnd: false,   // 结尾标志
            reqTimes:1      // 使用morePage时候当前的请求次数 
        }
    }
    handlePageChange(type) {

        // 已经到达边界 且 morePage 属性为 false
        let { currPage, totalPage,isBegin, isEnd, morePage ,reqTimes} = this.state;
        let step = (type == 'previous' ? -1 : 1);
        let nextPageNum = currPage + step;

        // 是否已经到达边界
        if(nextPageNum <= 1){
            if(morePage && reqTimes > 1){
                nextPageNum = totalPage;
                reqTimes--;
            }else{
                nextPageNum = 1;
            }
        }else if (nextPageNum > totalPage){
            if(morePage){
                nextPageNum = 1
                reqTimes++;
            }else{
                nextPageNum = totalPage;    
            }
        }

        this.setState({
            currPage: nextPageNum,
            isBegin:nextPageNum == 1,
            isEnd:nextPageNum == totalPage,
            reqTimes:reqTimes
        })
        
        if(nextPageNum !== this.state.currPage){
            this.props.toPage({
                currPage:nextPageNum,
                reqTimes:reqTimes
            });
        }   
    }

    handlePageInput(){
        let inputPageNum =  this.refs.pageInput.value;
        let { currPage, totalPage,morePage} = this.state;

        if( inputPageNum && !morePage && (+inputPageNum >= 1 && +inputPageNum <= totalPage)){
            this.setState({
                currPage: +inputPageNum
            })
            // // 只能在非morePage 模式中使用输入跳转
            // this.props.toPage({
            //     currPage:inputPageNum,
            //     reqTimes:1
            // });
        }
    }

    handleInputBlur(){
        let {currPage} = this.state;
        this.props.toPage({
            currPage:currPage,
            reqTimes:1
        });
    }
    
    // 处理组件初始完之后的更新
    componentWillReceiveProps(nextProps) {
        this.initState(nextProps);
    }

    render() {
        let { toPagem, size } = this.props;
        let { currPage, totalPage, isBegin, isEnd, morePage, reqTimes, align, enableIuputJump} = this.state;

        let miniPaginationWrapperClass = classnames({
            'clearfix': true,
            'grace-miniPagination-content-wrapper': true,
            [`grace-miniPagination-${size.toLowerCase()}`]: true,
            [`grace-miniPagination-${align.toLowerCase()}`]:true,
            'grace-miniPagination-morePage':morePage
        })

        let previousBtnClass = classnames({
            'grace-miniPagination-btn': true,
            'miniPagination-previous-btn': true,
            'miniPagination-previous-btn-disable': isBegin

        })

        let nextBtnClass = classnames({
            'grace-miniPagination-btn': true,
            'miniPagination-next-btn': true,
            'miniPagination-next-btn-disable': isEnd && !morePage

        })

        let _this = this;


        return (
            <div className='grace-miniPagination-wrapper'>
                <div className={miniPaginationWrapperClass}>
                    <div className={previousBtnClass} onClick={this.handlePageChange.bind(this, 'previous')}><span></span></div>
                    <div className='pageNum-area'>
                        {   enableIuputJump 
                            ? <input className='pageNum-area-currPage' 
                                type="text" 
                                value={currPage}
                                ref="pageInput"
                                onChange={this.handlePageInput.bind(this)} 
                                onBlur={this.handleInputBlur.bind(this)} /> 
                            : <span className='pageNum-area-currPage-common'>{currPage}</span>
                        }
                        <span className='pageNum-area-separator'>/</span>
                        <span className='pageNum-area-totalPage'>{totalPage}</span>
                    </div>
                    <div className={nextBtnClass} onClick={this.handlePageChange.bind(this, 'next')}><span></span></div>
                </div>
            </div>
        )
    }
}

//传入类型检测
GraceMiniPagination.propTypes = {
    totalPage: PropTypes.number.isRequired,
    currPage: PropTypes.number.isRequired,
    toPage: PropTypes.func.isRequired,
    showPage: PropTypes.bool,
    morePage: PropTypes.bool,
    position: PropTypes.string,
    size:PropTypes.string
}

export default GraceMiniPagination