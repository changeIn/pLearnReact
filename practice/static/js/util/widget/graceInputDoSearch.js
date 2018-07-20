/**
 * Created by chenhaifeng on 2018/2/28.
 */
import React,{ Component } from 'react'
import ReactDom  from 'react-dom'
import PropTypes from 'prop-types'

import "css/widget/graceInputDoSearch.scss";


class GraceInputDoSearch extends Component{
    static propTypes = {
		placeholderStr:PropTypes.string,    				//input占位符
		domWidth:PropTypes.number,      			        //input宽度设置
		limitWordsNum:PropTypes.number,      			    //input宽度设置
		doSearch:PropTypes.func.isRequired        			//点击搜索时的回调
    };

    constructor(props){
        super(props);
    }

    render(){
        let { placeholderStr,domWidth,limitWordsNum } = this.props;
        let inputStyle = { width:domWidth?domWidth+'px':'195px' };

        return (
			<div className="grace-input-do-search">
				<div className="search-container">
					<input style={inputStyle}
						   className="border-out search-input"
						   ref="searchInputRef"
						   onClick={this.hasFocus}
						   maxLength={limitWordsNum}
						   placeholder={placeholderStr} />
					<div ref="clearRef" className="searh-icon-clear hide" onClick={this.clearInput}> </div>
					<div className="searh-icon-done" onClick={this.doSearch}> </div>
				</div>
			</div>
        )
    }

	shouldComponentUpdate(nextProps,nextState){
		return nextProps.placeholderStr !== this.props.placeholderStr ||
			   nextProps.domWidth !== this.props.domWidth ||
			   nextProps.doSearch !== this.props.doSearch ||
			   nextProps.limitWordsNum !== this.props.limitWordsNum;

	}

	setStopPropagation = (e) => {      //阻止点击事件的冒泡
		e.nativeEvent.stopImmediatePropagation();
		e.stopPropagation();
	};
	clearInput = () => {
		let inputRefDom = ReactDom.findDOMNode(this.refs.searchInputRef);
		inputRefDom.value = '';
	};
	hasFocus = (e) => {
		this.setStopPropagation(e);
	};
	doSearch = (e) => {
		let { doSearch } = this.props;
		this.setStopPropagation(e);
		let inputRefDom = ReactDom.findDOMNode(this.refs.searchInputRef);
		let searchKey = inputRefDom.value.replace(/^\s+|\s+$/g,"");
		searchKey = searchKey.replace(/\.\.\.$/,'').replace(/^\s+|\s+$/g,"");
		if(searchKey!=='')	doSearch(searchKey);
	};
}

export default GraceInputDoSearch;