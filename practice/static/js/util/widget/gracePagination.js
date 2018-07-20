/**
 * Created by chenhaifeng on 2018/2/8.
 */
import React,{ Component } from 'react'
import PropTypes from 'prop-types'

import "css/widget/gracePagination.scss";


class GracePagination extends Component{
    static propTypes = {
        current:PropTypes.number,               //当前页数
        hideOnSinglePage:PropTypes.bool,        //只有一页时是否隐藏分页器
        pageSize:PropTypes.number,              //每页条数
		pageButtonSize:PropTypes.number,		//分页器显示的页数按钮的个数
        pageSizeOptions:PropTypes.array,        //指定每页可以显示多少条
		showSizeChanger:PropTypes.bool,         //是否可以显示 pageSizeOptions
		total:PropTypes.number,                 //数据总数
		// hasTotalTitle:PropTypes.bool,			//有总计标题
		onChange:PropTypes.func,                //页码改变的回调，参数是改变后的页码及每页条数 Function(page, pageSize)
		onShowSizeChange:PropTypes.func,        //pageSize 变化的回调 Function(current, size)
		//showQuickJumper:PropTypes.bool,         //是否可以快速跳转至某页
        //showTotal:PropTypes.func,               //用于显示数据总量和当前数据顺序 Function(total, range)
        //simple:PropTypes.bool,                  //当添加该属性时，显示为简单分页
        //size:PropTypes.string,                  //当为「small」时，是小尺寸分页
    };

    static defaultProps = {
		current:1,
		pageSize:10,
        hideOnSinglePage:false,
		pageButtonSize:5,
        pageSizeOptions:[10,20,50,100],
        showSizeChanger	:false,
        total:0,
		hasTotalTitle:false,
		//showQuickJumper	:false,
    };

    constructor(props){
        super(props);
        this.state = {
            current: props.current,
			pageSize: props.pageSize,
			
        }
    }

    render(){
        let { total,pageSizeOptions,hideOnSinglePage,showSizeChanger } = this.props;
        let { current,pageSize } = this.state;

        let pageTotalNum = Math.ceil(total/pageSize);
        let isFirst = current===1;
        let isLast = current===pageTotalNum;
        let pageNumberDom = this._dealPageNumberBtn(current,pageTotalNum);

		if(hideOnSinglePage&&pageTotalNum===1){
			return null;
		}

        return (
            <div className="grace-pagination">
                <div className={`page-size-options ${!showSizeChanger?'page-size-options-hide':''}`}>
                    <span className="options-official">每页显示</span>
                    <span>
                        <select className="options-select" value={pageSize} onChange={this._pageSizeOptionsChange}>
                            {
                                pageSizeOptions.map(function(item,index){
                                    return <option key={`${item}-${index}`} value={item}>{item}</option>;
                                })
                            }
                        </select>
                    </span>
                </div>
                <div className="pagination-body">
                    <div className="body-page-step">
                        <span className={`first-page-btn ${isFirst?'btn-disabled':''}`} onClick={!isFirst?this._firstPageBtnClick:null}>首页</span>
                        <span className={`pre-page-btn ${isFirst?'btn-disabled':''}`} onClick={!isFirst?this._prePageBtnClick:null}> </span>
                        <ul className="number-page-btns">
                            {pageNumberDom}
                        </ul>
                        <span className={`next-page-btn ${isLast?'btn-disabled':''}`} onClick={!isLast?this._nextPageBtnClick:null}> </span>
                        <span className={`last-page-btn ${isLast?'btn-disabled':''}`} onClick={!isLast?this._lastPageBtnClick:null}>尾页</span>
                        <span className="total-num-font">{`共${total}条`}</span>
                    </div>

                </div>
            </div>
        )
    }
	componentWillReceiveProps(nextProps){
		let { current,pageSize } = nextProps;

		if(current)this.setState({ current:current });
		if(pageSize)this.setState({ pageSize:pageSize });
	}


	shouldComponentUpdate(nextProps,nextState){
        return nextState.current !== this.state.current ||
			nextState.pageSize !== this.state.pageSize ||
			nextProps.current !== this.props.current ||
			nextProps.hideOnSinglePage !== this.props.hideOnSinglePage ||
			nextProps.pageSize !== this.props.pageSize ||
			nextProps.pageSizeOptions !== this.props.pageSizeOptions ||
			nextProps.showSizeChanger !== this.props.showSizeChanger ||
			nextProps.total !== this.props.total ||
			nextProps.onChange !== this.props.onChange ||
			nextProps.onShowSizeChange !== this.props.onShowSizeChange;
    }

    _stopPropagation = (e) => {
        e.stopPropagation();
        if (e.nativeEvent.stopImmediatePropagation) {
            e.nativeEvent.stopImmediatePropagation();
        }
    };
	_dealPageNumberBtn = (current,pageTotalNum) =>{
		let pageButtonSize = this.props.pageButtonSize;
	    let temp = [];
	    let beginIndex = 0;
	
		if(current<=3){
			beginIndex = 1
		}
		else if(pageTotalNum-current<2){
			beginIndex = pageTotalNum - pageButtonSize +1;
        }
        else{
			beginIndex = current - Math.floor(pageButtonSize/2);
        }

		// 修正非法值
		beginIndex = Math.max(beginIndex,1);	    for(let i=0;i<pageButtonSize;i++){
		    if(beginIndex>pageTotalNum){
				return temp;
            }
			temp.push(
				<li key={`${beginIndex}-${i}`}
					className={`number-page-btn-item ${beginIndex===current?'item-select':''}`}
				    onClick={beginIndex!==current?this._pageBtnClick:null}
					value={beginIndex}>{beginIndex}</li>
			);
			beginIndex++;
        }
	    return temp;
    };
    _pageBtnClick = (e) => {
        this._stopPropagation(e);
        let { onChange } = this.props;
        let { pageSize } = this.state;
        let page = e.target.value;

        this.setState({ current:page });
        onChange(page,pageSize);

    };
    _prePageBtnClick = (e) => {
		this._stopPropagation(e);
		let { onChange } = this.props;
		let { current,pageSize } = this.state;
		let page = current - 1;

		this.setState({ current:page });
		onChange(page,pageSize);
    };
    _nextPageBtnClick = (e) => {
		this._stopPropagation(e);
		let { onChange } = this.props;
		let { current,pageSize } = this.state;
		let page = current + 1;

		this.setState({ current:page });
		onChange(page,pageSize);
    };
    _firstPageBtnClick = (e) => {
		this._stopPropagation(e);
		let { onChange } = this.props;
		let { pageSize } = this.state;
		let page = 1;

		this.setState({ current:page });
		onChange(page,pageSize);
    };
    _lastPageBtnClick = (e) => {
		this._stopPropagation(e);
		let { total,onChange } = this.props;
		let { pageSize } = this.state;
		let pageTotalNum = Math.ceil(total/pageSize);

		this.setState({ current:pageTotalNum });
		onChange(pageTotalNum,pageSize);
    };
	_pageSizeOptionsChange = (e) => {
		this._stopPropagation(e);
		let { total,onChange } = this.props;
		let { current } = this.state;
		let { onShowSizeChange } = this.props;
        let nextPageSize = e.target.value;
		let pageTotalNum = Math.ceil(total/nextPageSize);
		current = pageTotalNum>=current?current:1;

		this.setState({pageSize:nextPageSize,current:current});
		onChange(current,nextPageSize);
		if(onShowSizeChange) onShowSizeChange(current,nextPageSize);
    };
}

export default GracePagination;