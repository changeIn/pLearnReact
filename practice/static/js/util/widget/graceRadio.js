/**
 * Created by chenhaifeng on 2018/3/13.
 */
/*
使用示例
	<GraceRadio list={list} initValue={initValue} onChange={this.radioChange}> </GraceRadio>

数据参数格式说明：
	initValue:'OrdCustNum',
    list: [
        {
          text: '下单人数',
          value: 'OrdCustNum'
        }, {
          text: '下单金额',
          value: 'OrdAmt',
        }, {
          text: '成交人数',
          value: 'DealUser'
        }, {
          text: '成交转化率',
          value: 'DealRate'
        }, {
          text: '成交金额',
          value: 'DealAmt'
        }, {
          text: '成交客单价',
          value: 'DealPriceAvg'
        }
      ]
*/

import React,{ Component } from 'react'
import PropTypes from 'prop-types'
import "css/widget/graceRadio.scss"
import $ from "n-zepto";

class RadioComponent extends Component{
	static propTypes = {
		list: PropTypes.array.isRequired,
		onChange: PropTypes.func.isRequired,
		initValue: PropTypes.string,
		randomStr: PropTypes.string,
		callBackSelected: PropTypes.func
	};

	state = {
		radioSelected:this.props.initValue
	};

	constructor(props){
		super(props);
	}

	render(){
		let _this = this;
		let { list,randomStr } = this.props;
		let radioSelected = this.state.radioSelected;
		let radioDom = [];
		list.forEach(function(item,index){
			let inputInit = (!radioSelected&&index===0)?true:radioSelected===item.value;
			radioDom.push( <span key={index}>
								<input data-randomstr={randomStr} onClick={_this.getRadioComponentValue} type="radio" defaultChecked={inputInit} value={item.value} id={`${item.value}Radio${randomStr}`} name={`myRadio${randomStr}`} />
								<label htmlFor={`${item.value}Radio${randomStr}`}><span className="radio-ion"> </span><span>{item.text}</span></label>
							</span>
			);
		});

		return (
			<div className="radio-container">
				{radioDom}
			</div>
		)
	}

	componentDidMount() {
		let { randomStr } = this.props;
		let callBackSelected = this.props.callBackSelected;
		let val = $("input[name='myRadio"+randomStr+"']:checked").val();
		callBackSelected(val);
		this.setState({
			radioSelected:val
		});
	}

	shouldComponentUpdate(nextProps,nextState){
		return nextProps.randomStr !== this.props.randomStr||
			   nextState.radioSelected !== this.state.radioSelected;
	}

	getRadioComponentValue = (e) => {
		// let randomStr1  = this.props.randomStr;
		let randomStr = e.currentTarget.dataset.randomstr;
		let callBackSelected = this.props.callBackSelected;
		let val = $("input[name='myRadio"+randomStr+"']:checked").val();
		callBackSelected(val);
		this.setState({
			radioSelected:val
		});
	};
}


class GraceRadio extends Component{
	static propTypes = {
		list: PropTypes.array.isRequired,
		onChange: PropTypes.func.isRequired,
		initValue: PropTypes.string
    };

	constructor(props){
	    super(props);
	}

	render(){
        let list = this.props.list;
		if(list.length === 0){
			return (
				<div className="grace-radio">
					<div className="no-data-comtainer">
						暂无数据！
					</div>
				</div>
			)
		}
		else{
			return (
				<div className="grace-radio">
					<RadioComponent { ...this.props } callBackSelected={this.getCallBackValue} randomStr={this.getRandomStr()}> </RadioComponent>
				</div>
			)
		}
	}

	getCallBackValue = (value) => {
		let onChange  = this.props.onChange;
		onChange && onChange(value);
	};
	getRandomStr = () => {
		function randomString(len) {

			len = len || 32;
			let $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
			let maxPos = $chars.length;
			let pwd = '';
			for (let i = 0; i < len; i++) {
				//0~32的整数  
				pwd += $chars.charAt(Math.floor(Math.random() * (maxPos+1)));
			}
			return pwd;
		}
		return randomString(8);
	};
}

export default GraceRadio;