/**
 * Created by chenhaifeng on 2018/3/1.
 */
import React,{ Component } from 'react'
import PropTypes from 'prop-types'
import Format from './format'

import "css/widget/graceRateBar.scss";


class GraceRateBar extends Component{
	static propTypes = {
		rateValue:PropTypes.oneOfType([PropTypes.number,PropTypes.string]),             //bar的值
	};

	constructor(props){
		super(props);
	}

	render(){
		let { rateValue } = this.props;
		let formatValue = 0;
		let style = null;
		if(rateValue === '_PPZH_NO_AUTH_' || rateValue === null){
			formatValue = '--';
			style = {
				width:0
			};
		}
		else{
			formatValue = Format(rateValue,'percent_2_0_1');
			style = {
				width:(Number(rateValue)<0.005&&Number(rateValue)>0)?'1px':formatValue
			};
		}


		return (
			<div className="grace-rate-bar">
				<div className="bar-container">
                    <span className="rate-value">{formatValue}</span>
					{/*<span className="variation-trend decline rise">550.0%</span>*/}
                    <span className="rate-bar-container">
                        <span className="rate-bar" style={style}> </span>
                    </span>
                </div>
			</div>
		)
	}

	shouldComponentUpdate(nextProps,nextState){
		return nextProps.rateValue !== this.props.rateValue;
	}

	componentDidUpdate(){
		//this.delayShowLoadingLayer();
	}

	// _stopPropagation = (e) => {
	// 	e.stopPropagation();
	// 	if (e.nativeEvent.stopImmediatePropagation) {
	// 		e.nativeEvent.stopImmediatePropagation();
	// 	}
	// };
}

export default GraceRateBar;