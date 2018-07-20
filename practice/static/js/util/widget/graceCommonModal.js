/**
 * Created by wangnan on 2018/02/02
 */
/*
参数说明：
1. mtype="confirm" :带有确认的弹窗
   mtype="alert" alert弹窗
   mtype="normal" :带有自定义交互内容的弹窗 带有交互的弹窗 必选
2. isOpen:true   是否显示      必选
3. hasTitle 是否有头部         非必选
4. titleContent 头部内容       非必选
5. btnText 确定按钮内容           非必选
6. btnTextCancel 取消按钮内容     非必选
7. useModalFooter 默认true 是否使用默认的底部，只有mtype="normal"时有效果     非必选
8. onOk 确认按钮回调              非必选
9. onCancel 取消按钮以及右上角X号回调          必选 (取消按钮和右上角X号走的同一个函数逻辑)
10. position 决定模态框的位置 可以设置{'middle'}或者{{top:200}},前者代表垂直居中，后者代表距离顶部200px,水平默认居中，不支持配置
11. modalCnt 模态框内容 三种mtype类型都支持自定义html结构，但是内置了四种icon css类(没有icon的需求可以忽略)   必选
    1. <span className={'r-modal-icon r-modal-icon-sure'}></span> 不确定，问号提示icon
    2. <span className={'r-modal-icon r-modal-icon-error'}></span> 错误,X号提示
    3. <span className={'r-modal-icon r-modal-icon-success'}></span> 成功，对勾提示
    4. <span className={'r-modal-icon r-modal-icon-warn'}></span> 警告 ，叹号提示
12.isForbidRolling open状态时不允许滚动,默认true

数据格式事例：
let modalHtml = (
    //这里也可以自定义dom结构
    <div className={'r-modal-content-standard'}>
        <span className={'r-modal-icon r-modal-icon-sure'}></span>
        <h3>恭喜您，创建成功！</h3>
        <span>3s后自动跳转到活动列表</span>
    </div>
)

使用事例：
<GraceCommonModal
    mtype='normal'
    hasTitle={true}
    position='middle'
    titleContent='排名定位'
    isOpen={false}
    btnText='查看活动列表'
    btnTextCancel='确定'
    modalCnt={modalHtml}
    onOk={this.onOK}
    onCancel={this.onCancel}
/>
*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import classNames from 'classnames';
import "css/widget/graceCommonModal.scss";
import $ from 'n-zepto';

function ModalTitle({ hasTitle, titleContent }) {
    titleContent = hasTitle && (!titleContent ? '提示信息' : titleContent);
    return hasTitle ?
        <div className={'r-modal-title'}>
            <p>{titleContent}</p>
        </div> :
        null;
}
function ModalContent ({ modalCnt }) {
    return (
        <div className={'r-modal-content'}>
            {modalCnt}
        </div>
    )
}
class ModalBottom extends Component {
    static propTypes = {
        mtype: PropTypes.string.isRequired,
        btnText: PropTypes.string,
        btnTextCancel: PropTypes.string,
        onOk: PropTypes.func,
        onCancel: PropTypes.func,
        useModalFooter:PropTypes.bool,
        isForbidRolling:PropTypes.bool
    }
    constructor(props) {
        super(props);
        this.onOkCallback = this.onOkCallback.bind(this);
        this.onCancelCallback = this.onCancelCallback.bind(this);
    }
    onOkCallback() {
        let { onOk } = this.props;
        onOk && onOk();
    }
    onCancelCallback() {
        let { onCancel } = this.props;
        onCancel && onCancel();
    }
    // shouldComponentUpdate(nextProps){
    //     return nextProps.mtype !== this.props.mtype ||
    //         nextProps.btnText !== this.props.btnText ||
    //         nextProps.btnTextCancel !== this.props.btnTextCancel ||
    //         nextProps.onOk !== this.props.onOk ||
    //         nextProps.onCancel !== this.props.onCancel ||
    //         nextProps.useModalFooter !== this.props.useModalFooter ||
    //         nextProps.isForbidRolling !== this.props.isForbidRolling;
    // }
    render() {
        let { mtype, btnText, btnTextCancel, useModalFooter } = this.props;
        let actionDom = null;
        !btnTextCancel && (btnTextCancel = '取消');
        !btnText && (btnText = '确定');
        useModalFooter = useModalFooter === undefined ? true : useModalFooter;

        if (mtype === 'alert') {
            actionDom = <button className={'r-modal-btn-save'} onClick={this.onOkCallback}>{btnText}</button>;
        } else if (mtype === 'confirm') {
            actionDom = <div>
                <button className={'r-modal-btn-save'} onClick={this.onOkCallback}>{btnText}</button>
                <button className={'r-modal-btn-cancel'} onClick={this.onCancelCallback}>{btnTextCancel}</button>
            </div>;
        } else if (mtype === 'normal') {
            actionDom = useModalFooter ?
                <div>
                    <button className={'r-modal-btn-save'} onClick={this.onOkCallback}>{btnText}</button>
                    <button className={'r-modal-btn-cancel'} onClick={this.onCancelCallback}>{btnTextCancel}</button>
                </div> :
                null;
        }

        return (
            <div className="r-modal-action">
                {actionDom}
            </div>
        )
    }
}
class GraceCommonModal extends Component {
    static propTypes = {
        mtype: PropTypes.string.isRequired,
        modalCnt: PropTypes.element.isRequired,
        onCancel: PropTypes.func.isRequired,
        isOpen: PropTypes.bool,
        hasTitle: PropTypes.bool,
        titleContent: PropTypes.string,
        onOk: PropTypes.func
    }
    constructor(props) {
        super(props);
        this.closeModal = this.closeModal.bind(this);
    }

    closeModal() {
        this.props.onCancel && this.props.onCancel();
        $('body').css({
            overflow:'auto',
            paddingRight:'0'
        })
    }
    browserJudge() {
        let u = navigator.userAgent;
        return u.indexOf('Chrome') > -1 || u.indexOf('CriOS') > -1;
    }
    scrollJudge() {
        let u = navigator.userAgent,isIE = u.indexOf('MSIE') > 0 || u.indexOf('Trident') > -1;
        // 1100是页面的最小高度
        if(isIE){
            return document.documentElement.clientHeight < 1100
        }else{
            return window.innerHeight < 1100;
        }
    }
    render() {
        let { mtype, isOpen, modalCnt, hasTitle, titleContent, btnText, position, btnTextCancel,animate,onOk, onCancel,useModalFooter,isForbidRolling } = this.props;
        let modalStyle = {
            top:position ? typeof position === 'object' && (~~position.top + 'px') : '100px'
        }
        let modalClass = classNames({
            'grace-common-modal': true,
            'open': isOpen,
            'close':!isOpen
        });
        let modalCloseClass = classNames({
            'r-modal-close': true,
            'revise': hasTitle
        });
        let modalWrapCls = classNames({
            'r-modal-wrap': true,
            'vertical-center-modal': position && position === 'middle'
        });
        if(isForbidRolling !== false) isForbidRolling = true;
        if(this.scrollJudge() && isForbidRolling && isOpen){
            let r = this.browserJudge() ? '8px' : '17px';
            $('body').css({
                overflow:'hidden',
                paddingRight:r
            })
        }
        let modalHtml = <div className={'r-modal'} style={modalStyle}>
            <span className={modalCloseClass} onClick={this.closeModal}></span>
            <ModalTitle hasTitle={!!hasTitle} titleContent={titleContent} />
            <ModalContent modalCnt={modalCnt} />
            <ModalBottom mtype={mtype} useModalFooter={useModalFooter} btnText={btnText} btnTextCancel={btnTextCancel} onOk={onOk} onCancel={onCancel} />
        </div>;
        return (
            animate ?
            <div className={'grace-common-modal'}>
                <ReactCSSTransitionGroup component="div" transitionName="fade" transitionEnterTimeout={200} transitionLeaveTimeout={200}>
                    {
                        isOpen && <div className={'r-modal-mask'}></div>
                    }
                </ReactCSSTransitionGroup>
                <ReactCSSTransitionGroup component="div" transitionName="r-modal" transitionEnterTimeout={200} transitionLeaveTimeout={200}>
                    {isOpen && <div className={modalWrapCls}>
                        {modalHtml}
                    </div>}
                </ReactCSSTransitionGroup>
            </div> :
            <div className={modalClass}>
                <div className={'r-modal-mask'}></div>
                <div className={modalWrapCls}>
                    {modalHtml}
                </div>
            </div>
        )
    }
}

export default GraceCommonModal
