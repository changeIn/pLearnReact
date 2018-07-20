/**
 * Created by wangnan on 2018/1/26
 */
/* 
说明:
<GraceCommonSelect 
    channel={channel}  //必选 格式:array
    initItem={initItem}  //必选 格式:string
    onChange={this.onChangeSelect} //必须 格式:function
    disabled={disabled} //可选 格式boolean 默认false
/> 
*/
/*
数据结构:
let optionSelect = {
    channel: [
        { name: '全部渠道', code: '99' },
        { name: 'APP', code: '2' },
        { name: 'PC', code: '20' },
        { name: '微信', code: '3' },
        { name: '手Q', code: '4' },
        { name: 'M端', code: '1' }
    ],
    disabled: false
};
let initItem = optionSelect.channel[5];
*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import "css/widget/graceCommonSelect.scss";

class GraceCommonSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            selectItem: props.initItem
        }
        this.setOpenTag = this.setOpenTag.bind(this);
        this.selectItem = this.selectItem.bind(this);
        this.clickBodyEvent = this.clickBodyEvent.bind(this);
    }
    setOpenTag(e) {
        e.nativeEvent.stopImmediatePropagation();
        this.setState({ open: !this.state.open });
    }
    selectItem(value) {
        if(!value.disabled){
            this.setState({ selectItem: value });
            this.setState({ open: false });
            this.props.onChange(value);
        } 
    }
    componentWillReceiveProps(nextProps) {
        if(this.props.initItem !== nextProps.initItem){
            this.setState({
                selectItem: nextProps.initItem
            });
        }
    }
    componentDidMount(e) {
        let _this = this;
        this.setState({_isMounted:true});
        document.addEventListener('click', _this.clickBodyEvent);
    }
    componentWillUnmount(){
        let _this = this;
        this.setState({_isMounted:false});
        document.removeEventListener('click', _this.clickBodyEvent);
    }
    clickBodyEvent() {
        this.state._isMounted && this.setState({ open: false });
    }
    render() {
        let { channel, disabled } = this.props;
        let { open, selectItem } = this.state;
        let clsName = disabled ?
            'grace-common-select disable' :
            open ? 'grace-common-select open' : 'grace-common-select';
        return (
            <div className={clsName}>
                <button className={'grace-btn'} onClick={this.setOpenTag}>
                    <span>{selectItem.name}</span>
                    <i className={'down-icon'}></i>
                </button>
                <ul>
                    {channel.map((item, i) => <li className={item.disabled ? 'disabled' : item.code === selectItem.code ? 'select' : ''} key={item.code} onClick={() => this.selectItem(item)}>{item.name}</li>)}
                </ul>
            </div>
        )
    }
}

GraceCommonSelect.propTypes = {
    channel:PropTypes.array.isRequired,     
    initItem:PropTypes.object.isRequired,
    disabled:PropTypes.bool,
    onChange:PropTypes.func.isRequired,   
}

export default GraceCommonSelect;
