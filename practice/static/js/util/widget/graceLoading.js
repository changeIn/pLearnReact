/**
 * Created by chenhaifeng on 2018/2/8.
 */
import React,{ Component } from 'react'
import ReactDom  from 'react-dom'
import PropTypes from 'prop-types'

import "css/widget/graceLoading.scss";


class GraceLoading extends Component{
    static propTypes = {
		loading:PropTypes.oneOfType([PropTypes.bool,PropTypes.object]),
		delay:PropTypes.number,               	//延迟显示加载效果的时间（防止闪烁）
		tip:PropTypes.string        			//当作为包裹元素时，可以自定义描述文案
    };

	static defaultProps = {
		loading:true,
		delay:200
	};

	state = {
		timer:null,
		spinning:this.props.loading
	};

    constructor(props){
        super(props);
    }

    render(){
        let { tip } = this.props;
        let spinning = this.state.spinning;
        return (
			<div className="grace-loading">
				<div className={`loading-icon-container ${spinning?'':'grace-loading-hide'}`}>
					<div className="icon-container">
						<div grace-loader='ball-rotate'></div>
					</div>
					<div className="tip-container">{tip?tip:''}</div>
				</div>
				<div className={`grace-loading-contenet ${spinning?'blur-in':'blur-out'}`}>
					{this.props.children}
				</div>
			</div>
        )
    }

	componentWillReceiveProps(nextProps){
		let { delay,loading } = nextProps;
		let _this = this;
		if(this.timer) clearTimeout(this.timer);
		if(delay){
			this.timer = setTimeout(function(){
				_this.setState({ spinning: loading });
			},delay);
		}
		else{
			this.setState({ spinning: loading });
		}
	}

	componentWillUnmount(){
		if (this.timer) {
			clearTimeout(this.timer);
		}
	}
}

export default GraceLoading;