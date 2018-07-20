/**
 * Created by chenhaifeng on 2018/1/11.
 */

import React,{ Component } from 'react'
import PropTypes from 'prop-types'
import  Odometer  from './odometer.js'
import  "css/odometer.css"

import Format from './format'
import $ from 'n-zepto'
import "css/widget/graceCommonSummary.scss"
// import GraceToolTip from './graceTooltip'


class DetailUlComponent extends Component{
	static propTypes = {
		detailData:PropTypes.array
	};

	constructor(props){
		super(props);
	}

	render(){
		let { detailData } = this.props;
		let liDom = [];
		detailData.forEach(function(item,index){
			liDom.push(
				<li key={`${item.value}-${index}`}>
					<span>{item.name}</span>
					<span>{item.value==='--'?'--':Format(item.value,item.format)}</span>
				</li>
			);
		});

		return (
			<ul className="detail-list">
				{liDom}
			</ul>
		)
	}
}

class UlComponent extends Component{
	static propTypes = {
		summaryData:PropTypes.array,
		initValue:PropTypes.string,											//组件的初始化条件
		onChange:PropTypes.func,											//选择变化时回调向外部抛出选择结果
		maxLineItemCount:PropTypes.number,                					//每行能显示的item数量，最大值为 5 超出部分换行展示
		enableOdometer:PropTypes.bool,						            	//是否使用odometer
		enableTootip:PropTypes.bool,					        	    	//是否开启tooltip提示框
		callBackSelected:PropTypes.func,
	};

	state = {
		checkboxSelected:this.props.initValue
	};

	constructor(props){
		super(props);
	}

	render(){
		let _this = this;
		let { summaryData,maxLineItemCount,enableOdometer,enableTootip } = this.props;
		let checkboxSelected = this.state.checkboxSelected;
		let liDom = [];
		let dataLen = summaryData.length;
		let style = { width: 100/dataLen + '%' };
		summaryData.forEach(function(item,index){
			let selectInit = checkboxSelected === item.code;
			liDom.push(
				<li key={`${item.value}-${index}`}
					id={`li-${index}-id`}
					style={style}
					className={`list-li ${selectInit?'select':''}`}
					data-id={item.code}
					onClick={_this.clickSummaryLiDom}
				>
					<p className="li-title">
						<span className="">{item.name}</span>
					</p>
					<div className="li-detail">
						<DetailUlComponent detailData={item.detail}> </DetailUlComponent>
					</div>
				</li>
			);
		});

		return (
			<ul className="summary-list">
				{liDom}
			</ul>
		)
	}

	componentDidMount(){
		let callBackSelected = this.props.callBackSelected;
		callBackSelected(this.state.checkboxSelected);
	}

	clickSummaryLiDom = (e) => {
		let callBackSelected = this.props.callBackSelected;
		let code = e.currentTarget.dataset.id;
		callBackSelected(code);
		this.setState({
			checkboxSelected:code
		});
	};
}


class GraceCommonSummary extends Component{
	static propTypes = {
		summaryData:PropTypes.array,
		initValue:PropTypes.string,											//组件的初始化条件
		onChange:PropTypes.func,											//选择变化时回调向外部抛出选择结果
		maxLineItemCount:PropTypes.number,                					//每行能显示的item数量，最大值为 5 超出部分换行展示
		enableOdometer:PropTypes.bool,						            	//是否使用odometer
		enableTootip:PropTypes.bool,					        	    	//是否开启tooltip提示框
    };

	static defaultProps = {
		summaryData:[],
		initValue:[],
		maxLineItemCount:5,
		enableOdometer:false,
		enableTootip:false
	};

	constructor(props){
	    super(props);
	}

	render(){
        let summaryData = this.props.summaryData;
		if(summaryData.length === 0){
			return (
				<div className="grace-common-summary">
					<div className="no-data-comtainer">
						summary暂无数据！
					</div>
				</div>
			)
		}
		else{
			return (
				<div className="grace-common-summary">
					<div className="summary-item">
						<UlComponent { ...this.props } callBackSelected={this.getCallBackValue}> </UlComponent>
					</div>
				</div>
			)
		}
	}

	componentDidMount(){
		this._initOdometer();
	}

	shouldComponentUpdate(nextProps,nextState){
		return nextProps.summaryData !== this.props.summaryData ||
			nextProps.initValue !== this.props.initValue ||
			nextProps.maxLineItemCount !== this.props.maxLineItemCount
	}

	componentDidUpdate(){
		this._initOdometer();
	}

	getCallBackValue = (value) => {
		let onChange  = this.props.onChange;
		onChange && onChange(value);
	};

	// shouldComponentUpdate(nextProps,nextState){
	// 	return nextProps.summaryData !== this.props.summaryData ||
	// 		nextProps.summarySelected !== this.props.summarySelected ||
	// 		nextProps.summarySelected !== this.props.summarySelected;
	// }
	_initOdometer = () => {
		if(this.props.enableOdometer){
			let odometerDom = $('.odometer.body-value');
			let len = odometerDom.length;
			for (let i = 0; i < len; ++i) {
				let item = odometerDom[i];
				let num = item.innerHTML.indexOf('%')>0?item.innerHTML.replace('%',''):item.innerHTML;
				let od = new Odometer({
					el:item,
					value:0
				});
				od.update(num);
			}
		}
	};
}

export default GraceCommonSummary;

/*
使用示例
	<GraceSummary summaryData={summaryData}
					onChange={this.consoleValue}
					checkboxRange={4}
					clickType={'checkbox'}
					initValue={['aaa']}
					maxLineItemCount={4}> </GraceSummary>

数据参数格式说明：
    summaryData : [                        //summary数据结构
        {
			code:'OrdAmt',
			name:'访客指数',
            detail:[
				{name:'我的商品',value:122987,format:'number_0'},
				{name:'竞品',value:122987,format:'number_0'}
            ]
        },
        {
			code:'OrdNum',
			name:'成交商品件数',
            detail:[
				{name:'我的商品',value:122987,format:'number_0'},
				{name:'竞品',value:122987,format:'number_0'}
            ]
        },
        {
			code:'OrdCustNum',
			name:'成交金额指数',
            detail:[
				{name:'我的商品',value:122987,format:'number_0'},
				{name:'竞品',value:122987,format:'number_0'}
            ]
        },
		{
			code:'OrdProNum',
			name:'加购人数',
            detail:[
				{name:'我的商品',value:122987,format:'number_0'},
				{name:'竞品',value:122987,format:'number_0'}
            ]
		},
		{
			code:'OrdProNum',
			name:'关注人数',
            detail:[
				{name:'我的商品',value:122987,format:'number_0'},
				{name:'竞品',value:122987,format:'number_0'}
            ]
		}
*/