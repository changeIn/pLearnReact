/**
 * Created by chenhaifeng on 2018/1/11.
 */

import React,{ Component } from 'react'
import PropTypes from 'prop-types'
import  Odometer  from './odometer.js'
import  "css/odometer.css"

import Format from './format'
import $ from 'n-zepto'
import "css/widget/graceSummary.scss"
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
					<span>{item.value?(item.value==='--'?item.value:Format(item.value,item.format)):null}</span>
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
		initValue:PropTypes.oneOfType([PropTypes.array,PropTypes.string]),	//组件的初始化条件
		checkboxRange:PropTypes.number,										//选项的最大值
		onChange:PropTypes.func,											//选择变化时回调向外部抛出选择结果
		beforeSelect:PropTypes.func,										//不使用这个回调默认不能选择少于一个选项
		beforeCancelSelect:PropTypes.func,									//不使用这个回调默认不能超过checkboxRange设定的值
		maxLineItemCount:PropTypes.number,                					//每行能显示的item数量，最大值为 5 超出部分换行展示
		clickType:PropTypes.oneOf(['checkbox','radio']),			   		//点击类型：checkbox多选；radio单选，
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
		let { summaryData,maxLineItemCount,clickType,enableOdometer,enableTootip } = this.props;
		let checkboxSelected = this.state.checkboxSelected;
		let liDom = [];
		let style = { width: maxLineItemCount<5?(100 - (maxLineItemCount-1)*2.17)/maxLineItemCount + '%':'18.8%' };
		summaryData.forEach(function(item,index){
			let inputInit = null;

			if(clickType === 'checkbox'){
				inputInit = (checkboxSelected.length===0&&index===0)?true:checkboxSelected.indexOf(item.code)>-1;
			}
			else{
				inputInit = (!checkboxSelected&&index===0)?true:checkboxSelected===item.code;
			}

			let clickDom = clickType==='checkbox'?<span>
													<input onChange={_this.getCheckBoxValue} type="checkbox" checked={inputInit} value={item.code} id={`${item.code}CheckBoxSummary`} name="summaryCheckBox" />
    												<label htmlFor={`${item.code}CheckBoxSummary`}><span> </span></label>
												</span>
												:<span>
													<input onClick={_this.getRadioValue} type="radio" checked={inputInit} value={item.code} id={`${item.code}RadioSummary`} name="summaryRadio" />
													<label htmlFor={`${item.code}RadioSummary`}><span> </span></label>
												</span>;
			liDom.push(
				<li key={`${item.value}-${index}`} id={`li-${index}-id`}
					style={style}
					className={`list-li ${maxLineItemCount>4?'more-four-li':''} ${clickType==='radio'?'list-radio':''} ${inputInit?'select':''} ${item.trend<0?'decline':item.trend>0?'raise':''} ${index==maxLineItemCount-1?'no-margin-right':''}`}
					data-id={item.code}
					onClick={clickType==='radio'?_this.clickRadioLiDom:null}
				>
					<h5 className="li-title">
						{/*<GraceToolTip title={itemData.desc} tooltip-placement="top"><span className={`icon-help ${itemData.tooltiPos==='left'?'fl':''}`}> </span></GraceToolTip>*/}
						<span className="">{item.name}</span>
					</h5>
					<div className="li-radio-checkbox">
						{clickDom}
					</div>
					<div className="li-body">
						<span className="money-sign">{item.format.indexOf('currency')>-1?"￥":null}</span>
						<span className={`body-value ${enableOdometer?'odometer':''}`}>{item.value==='--'?item.value:Format(item.value,item.format).replace(/[%|￥]/,'')}</span>
						<span className="percent-sign">{item.format.indexOf('percent')>-1?"%":null}</span>
					</div>
					<div className="li-trend">
						<span>{item.trend!==undefined?item.trend==='--'?item.trend:Format(Math.abs(item.trend),'percent_1_0_1'):null}</span>
						<span className={`arrow arrow-${item.trend<0?'decline':item.trend>0?'raise':''}`}> </span>
					</div>
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

	componentDidMount() {
		let { clickType,callBackSelected } = this.props;
		if(clickType === 'checkbox'){
			let val_array = [];
			$('input[name="summaryCheckBox"]:checked').each(function(){
				val_array.push($(this).val());//向数组中添加元素
			});
			callBackSelected(val_array);
			this.setState({
				checkboxSelected:val_array
			});
		}
		else{
			let callBackSelected = this.props.callBackSelected;
			let val = $("input[name='summaryRadio']:checked").val();
			callBackSelected(val);
			this.setState({
				checkboxSelected:val
			});
		}
	}

	clickRadioLiDom = (e) => {

		let callBackSelected = this.props.callBackSelected;
		let code = e.currentTarget.dataset.id;
		$('#'+code+'RadioSummary').trigger('click');

		let val = $("input[name='summaryRadio']:checked").val();
		callBackSelected(val);
		this.setState({
			checkboxSelected:val
		});
	};
	getCheckBoxValue = (e) => {
		let { checkboxRange,callBackSelected,beforeSelect,beforeCancelSelect } = this.props;
		let checkboxSelected = this.state.checkboxSelected;
		let checkSelectBool = true;
		if(e.target.checked){
			if(checkboxSelected.length===checkboxRange){
				e.target.checked = false;
				checkSelectBool = false;
			}
			if(beforeSelect)checkSelectBool = beforeSelect(checkboxSelected);
		}
		else{
			if(checkboxSelected.length===1){
				e.target.checked = true;
				checkSelectBool = false;
			}
			if(beforeCancelSelect)checkSelectBool = beforeCancelSelect(checkboxSelected);
		}
		if(checkSelectBool){
			let val_array = [];
			$('input[name="summaryCheckBox"]:checked').each(function(){
				val_array.push($(this).val());//向数组中添加元素
			});
			callBackSelected(val_array);
			this.setState({
				checkboxSelected:val_array
			});
		}
	};
	getRadioValue = (e) => {
		e.stopPropagation();
		e.nativeEvent.stopImmediatePropagation();
	};

}


class GraceSummary extends Component{
	static propTypes = {
		summaryData:PropTypes.array,
		initValue:PropTypes.oneOfType([PropTypes.array,PropTypes.string]),	//组件的初始化条件
		checkboxRange:PropTypes.number,										//选项的最大值
		onChange:PropTypes.func,											//选择变化时回调向外部抛出选择结果
		beforeSelect:PropTypes.func,										//不使用这个回调默认不能选择少于一个选项
		beforeCancelSelect:PropTypes.func,									//不使用这个回调默认不能超过checkboxRange设定的值
		maxLineItemCount:PropTypes.number,                					//每行能显示的item数量，最大值为 5 超出部分换行展示
		clickType:PropTypes.oneOf(['checkbox','radio']),			   		//点击类型：checkbox多选；radio单选，
		enableOdometer:PropTypes.bool,						            	//是否使用odometer
		enableTootip:PropTypes.bool,					        	    	//是否开启tooltip提示框

    };

	static defaultProps = {
		summaryData:[],
		initValue:[],
		checkboxRange:4,
		maxLineItemCount:4,
		clickType:'checkbox',
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
				<div className="grace-summary">
					<div className="no-data-comtainer">
						summary暂无数据！
					</div>
				</div>
			)
		}
		else{
			return (
				<div className="grace-summary">
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
			nextProps.checkboxRange !== this.props.checkboxRange ||
			nextProps.clickType !== this.props.clickType ||
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

export default GraceSummary;

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
			name:'交易金额',
			format:'currency_￥',
			value:0.4131,
			trend:0.2,
            detail:[
				{name:'较前一天',value:5.5,format:'percent_2_0_1'},
				{name:'较前一周',value:1.5,format:'percent_2_0_1'}
            ]
        },
        {
			code:'OrdNum',
			name:'下单单量',
			format:'number_0',
			value:13452,
			trend:-0.2,
            detail:[
				{name:'较前一天',value:5.5,format:'percent_2_0_1'},
				{name:'较前一周',value:1.5,format:'percent_2_0_1'}
            ]
        },
        {
			code:'OrdCustNum',
			name:'下单客户数',
			format:'number_0',
			value:34542,
			trend:0.12,
            detail:[
				{name:'较前一天',value:5.5,format:'percent_2_0_1'},
				{name:'较前一周',value:1.5,format:'percent_2_0_1'}
            ]
        },
		{
			code:'OrdProNum',
			name:'下单商品件数',
			format:'number_0',
			value:12342,
			trend:0.12,
            detail:[
				{name:'较前一天',value:5.5,format:'percent_2_0_1'},
				{name:'较前一周',value:1.5,format:'percent_2_0_1'}
            ]
		}
*/