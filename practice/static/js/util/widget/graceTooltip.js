/**
 * Created by chenhaifeng on 2018/1/23.
 */

import React,{ Component } from 'react'
import ReactDom  from 'react-dom'
import PropTypes from 'prop-types'

import "css/widget/graceTooltip.scss"

class Popup extends Component{
    static propTypes = {
        title:PropTypes.string.isRequired,
        appendToBody:PropTypes.bool,
        finishBodyDom:PropTypes.func
    };
    constructor(props){
        super(props);
    }
    render(){
        let { title,appendToBody } = this.props;
        if(!appendToBody){
            let style = {
                position:'absolute',
                top:'0px',
                left:'0px',
                width:'100%',
            };
            return (
                <div style={style}>
                    <div ref="nodeRef" className="grace-tooltip">
                        <div className="grace-tooltip-arrow"> </div>
                        <div className="grace-tooltip-inner">{ title }</div>
                    </div>
                </div>
            );
        }
        else{
            return null
        }
    }
    componentDidMount(){//新建一个div标签并塞进body
		// let _this = this;
		this._upDateComponent();
		// window.onresize = function(){
		// 	_this._upDateComponent();
		// };
    }
	// componentDidUpdate(){  //完成渲染新的props或者state后调用，此时可以访问到新的DOM元素。
	// 	this._upDateComponent();
	// }
	shouldComponentUpdate(nextProps,nextState){
		return nextProps.title !== this.props.title ||
		       nextProps.appendToBody !== this.props.appendToBody;

	}

    componentWillUnmount(){     //在组件卸载的时候，保证弹层也被卸载掉
        let { appendToBody } = this.props;
        if(appendToBody){
            document.body.removeChild(this.popup);
        }
        else{
            this.popup = null;
        }
    }

	_refsFactorForm = (node) => {       //渲染在body上的浮层，获取其dom节点
		this.factorForm = node;
	};

	_upDateComponent = () => {
		let { title,appendToBody,finishBodyDom } = this.props;
		if(appendToBody){
			this.popup = document.createElement("div");
			this.popup.style = "position: absolute; top: 0px; left: 0px; width: 100%;";
			document.body.appendChild(this.popup);
			ReactDom.render(
				<div ref={this._refsFactorForm} className="grace-tooltip">
					<div className="grace-tooltip-arrow"> </div>
					<div className="grace-tooltip-inner">{ title }</div>
				</div>
				, this.popup,
				function(){
					finishBodyDom(true);
				});
		}
	};
}

class GraceToolTip extends Component{
	static propTypes = {
        'title':PropTypes.string.isRequired,
        'tooltip-placement': PropTypes.string,
        'tooltip-animation': PropTypes.bool,
        'tooltip-popup-delay': PropTypes.number,
        'tooltip-append-to-body':PropTypes.bool,
        'tooltip-trigger':PropTypes.string,
        'tooltip-on-visible-change':PropTypes.func
    };
	constructor(props){
	    super(props);
	}

    componentWillMount(){  //在完成首次渲染之前调用，此时仍可以修改组件的state。
        this._upDateProps();
    }

    render(){
        const { children,title, } = this.props;
        const { trigger,appendToBody } = this.tooltip;

        let triggerProps = trigger==='click' ? { onClick :this._onShowPupoDom } :
            trigger==='focus' ? { tabIndex : 0 , onFocus : this._onShowPupoDom , onBlur : this._onHidePupoDom } :
                { onMouseEnter : this._onShowPupoDom , onMouseLeave : this._onHidePupoDom };

		return (
            <span ref="fatherRef" {...triggerProps}>
                { children }
                <Popup ref="childRef" appendToBody={appendToBody} finishBodyDom={this._childReady} title={title}> </Popup>
            </span>
		)
	}

	componentDidMount(){
		let _this = this;
		this._upDateComponent();
		window.onresize = function(){
			_this._upDateComponent();
		};
	}
	shouldComponentUpdate(nextProps,nextState){
		return nextProps['title'] !== this.props['title'] ||
			nextProps['tooltip-placement'] !== this.props['tooltip-placement'] ||
		    nextProps['tooltip-animation'] !== this.props['tooltip-animation'] ||
		    nextProps['tooltip-popup-delay'] !== this.props['tooltip-popup-delay'] ||
		    nextProps['tooltip-append-to-body'] !== this.props['tooltip-append-to-body'] ||
		    nextProps['tooltip-trigger'] !== this.props['tooltip-trigger'] ||
		    nextProps['tooltip-on-visible-change'] !== this.props['tooltip-on-visible-change'];
	}
	componentDidUpdate(){  //完成渲染新的props或者state后调用，此时可以访问到新的DOM元素。
		this._upDateComponent();
	}

	componentWillUpdate(){  //接收到新的props或者state后，进行渲染之前调用，此时不允许更新props或state。
        this._upDateProps();
	}
	componentWillUnmount(){
        this.tooltip = null;
    }
    _childReady = () => {       //如果浮层渲染在body上获取其dom
        this.tooltip.popupDomDone = true;
        this.tooltip.pupopDom = this.refs.childRef.factorForm;
        if(this.tooltip.hoverDom){
            this._renderLayer();
        }
    };
	_upDateComponent = () => {
		const { trigger,appendToBody } = this.tooltip;
		let _this = this;
		this.tooltip.hoverDom = ReactDom.findDOMNode(this.refs.fatherRef);


		if(appendToBody&&this.tooltip.popupDomDone){
			this.tooltip.pupopDom = this.refs.childRef.factorForm;
			this._renderLayer();
		}
		else if(!appendToBody){
			this.tooltip.pupopDom = ReactDom.findDOMNode(this.refs.childRef.refs.nodeRef);
			this._renderLayer();
		}
		if(trigger==='click'){
			document.onclick = function(){
				_this._onHidePupoDom();
			};
		}
	};
	_upDateProps = () => {
		const trigger = this.props['tooltip-trigger']?this.props['tooltip-trigger']:'hover';
		const appendToBody =  this.props['tooltip-append-to-body']===undefined?true:!!this.props['tooltip-append-to-body'];
		const placement = this.props['tooltip-placement']?this.props['tooltip-placement']:'top';
		const animation = this.props['tooltip-animation']===undefined?true:!!this.props['tooltip-animation'];
		const popupDelay = this.props['tooltip-popup-delay']?parseInt(this.props['tooltip-popup-delay']):0;
		const onVisibleChange = this.props['tooltip-visible-change']?this.props['tooltip-visible-change']:null;

		this.tooltip = {};
		this.tooltip.trigger = trigger;
		this.tooltip.appendToBody = appendToBody;
		this.tooltip.placement = placement;
		this.tooltip.animation = animation;
		this.tooltip.popupDelay = popupDelay;
		this.tooltip.onVisibleChange = onVisibleChange;
    };
    _renderLayer(){     //设置浮层的属相
        const { placement,hoverDom,pupopDom,appendToBody } = this.tooltip;
        const { offsetHeight,offsetWidth,offsetLeft,offsetTop } = hoverDom.children[0];
        let style = {left:0,top:0};
        const arrowHeight = 10;
        const pupopWidth = pupopDom.offsetWidth;
        const pupopHeight = pupopDom.offsetHeight;
        switch(placement){
            //上
            case 'topLeft' :
                style.left = offsetLeft;
                style.top = offsetTop - (pupopHeight+arrowHeight);
                break;
            case 'top' :
                style.left = offsetLeft - (pupopWidth - offsetWidth)/2;
                style.top = offsetTop - (pupopHeight+arrowHeight);
                break;
            case 'topRight' :
                style.left = offsetLeft - (pupopWidth-offsetWidth);
                style.top = offsetTop - (pupopHeight+arrowHeight);
                break;
            //右
            case 'rightTop' :
                style.left = offsetLeft + offsetWidth;
                style.top = offsetTop;
                break;
            case 'right' :
                style.left = offsetLeft + offsetWidth;
                style.top = offsetTop - (pupopHeight-offsetHeight)/2;
                break;
            case 'rightBottom' :
                style.left = offsetLeft + offsetWidth;
                style.top = offsetTop - (pupopHeight-offsetHeight);
                break;
            //下
            case 'bottomLeft' :
                style.left = offsetLeft;
                style.top = offsetTop + offsetHeight;
                break;
            case 'bottom' :
                style.left = offsetLeft + (offsetWidth-pupopWidth)/2;
                style.top = offsetTop + offsetHeight;
                break;
            case 'bottomRight' :
                style.left = offsetLeft - (pupopWidth-offsetWidth);
                style.top = offsetTop + offsetHeight;
                break;
            //左
            case 'leftTop' :
                style.left = offsetLeft - (pupopWidth+arrowHeight);
                style.top = offsetTop;
                break;
            case 'left' :
                style.left = offsetLeft - (pupopWidth+arrowHeight);
                style.top = offsetTop - (pupopHeight-offsetHeight)/2;
                break;
            case 'leftBottom' :
                style.left = offsetLeft - (pupopWidth+arrowHeight);
                style.top = offsetTop - (pupopHeight-offsetHeight);
                break;
            default:
                break
        }

        pupopDom.classList.add('grace-tooltip-placement-'+placement);
        let {top,left} = this._getPoint(hoverDom.children[0]);
        top = appendToBody?top:0;
		left = appendToBody?left:0;
		style.left = `${style.left + left}px`;
		style.top = `${style.top + top}px`;
        pupopDom.style.left = style.left;
        pupopDom.style.top = style.top;
    }
    _onShowPupoDom = (e) => {       //处理浮层的显示
		this._setStopPropagation(e);
		if(e.target.nodeName !== 'SPAN')return;
        let { animation,popupDelay,pupopDom } = this.tooltip;
        let animationStr = animation?'-animation':'';

        setTimeout(function(){
            pupopDom.classList.remove('grace-tooltip'+animationStr+'-hidden');
            pupopDom.classList.add('grace-tooltip'+animationStr+'-show');
        },popupDelay);

    };
    _onHidePupoDom = (e) => {       //处理浮层的隐藏
        let { animation, popupDelay, pupopDom,onVisibleChange } = this.tooltip;
        let animationStr = animation ? '-animation' : '';

        setTimeout(function () {
            pupopDom.classList.remove('grace-tooltip' + animationStr + '-show');
            pupopDom.classList.add('grace-tooltip' + animationStr + '-hidden');
        }, popupDelay);
        this._setStopPropagation(e);
        if(onVisibleChange)onVisibleChange();
    };
    _setStopPropagation = (e) => {      //阻止点击事件的冒泡
        e.nativeEvent.stopImmediatePropagation();
        e.stopPropagation();
    };
	_getPoint = (obj) => { //获取某元素以浏览器左上角为原点的坐标
		let t = 0; //获取该元素对应父容器的上边距
		let l = 0; //对应父容器的上边距
		//判断是否有父容器，如果存在则累加其边距
		while (obj = obj.offsetParent) {//等效 obj = obj.offsetParent;while (obj != undefined)
			t += obj.offsetTop; //叠加父容器的上边距
			l += obj.offsetLeft; //叠加父容器的左边距
		}
		return {'top':t,'left':l}
	}
}

export default GraceToolTip;

/*


调用方式：
<Tooltip title="在body上" tooltip-placement="top" tooltip-animation={false} tooltip-popup-delay={100} tooltip-append-to-body={true}>
    <span>我是带有toolTip的文案</span>
</Tooltip>

参数说明：
        title:说明文案（必选）
        tooltip-placement:浮层位置，可选值：top left right bottom topLeft topRight bottomLeft bottomRight leftTop leftBottom rightTop rightBottom；默认值：top
        tooltip-animation:浮层显示/隐藏是否带渐隐/显动画；默认值：true
        tooltip-popup-delay:浮层显示/隐藏延时执行时间；默认值：0
        tooltip-append-to-body：浮层DOM是否append到body上；默认值：false
        tooltip-trigger:浮层触发方式：hover/focus/click；默认值：hover
        tooltip-on-visible-change:隐藏浮层的回调函数


*/