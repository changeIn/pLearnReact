/**
 * Created by wangnan on 2018/1/26
 */
/*
    说明:
    <GraceCheckBox 
        list={checkboxConfig.list}                    //必选 格式array
        initValue={checkboxConfig.value}                //必选 格式array
        onChange={checkboxConfig.callback.onChange}         //必选 格式function
        beforeSelect={checkboxConfig.callback.beforeSelect}    //可选 格式function
        beforeCancelSelect={checkboxConfig.callback.beforeCancelSelect} //可选 格式function
        label={checkboxConfig.label}    //可选 格式object
        isAllSelected={checkboxConfig.input.isAllSelected}      //可选 格式boolean
        horizontal={checkboxConfig.input.horizontal}        //可选 格式boolean
        isShowHasSelected={true}                             //可选 是否显示“xx/xx已选”
        checkBoxRange=5                                      //可选 只在isShowHasSelected为true时起作用，仅作用于显示“xx/5已选”的文本
    />    
    数据结构:
    let checkboxConfig = {
        label: {
            text: '专业班级'
        },
        input: {
            isAllSelected: false,       //是否全选
            horizontal: true    //水平排列, false为垂直排列，默认为水平排列
        },
        callback: {
            onChange: function (value) {
                console.log(value);
            },
            beforeSelect: function (value, selection) {
                //最多选择4个，selection为当前value选中之前的结果集
                return selection.length < 4;
            },
            beforeCancelSelect: function (value, selection) {
                //value为当前将被取消选中的值,selection为当前选中的结果
                //返回false将不取消选中
                //至少选中一个
                return selection.length !== 1;
            },
        },
        list: [{
            text: '计算机1001',
            value: '01001',
            disabled:true //此项禁用不可选
        }, {
            text: '计算机1002',
            value: '01002'
        }, {
            text: '通信1001',
            value: '11001'
        }, {
            text: '通信1002',
            value: '11002'
        }, {
            text: '通信1003',
            value: '11003'
        }],
        value: ['11002', '01002']      //value 组成的数组，用于初始化
    };
*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import "css/widget/graceCheckbox.scss";

class GraceCheckBox extends Component {
    constructor(props) {
        super(props);
        let selectedAllList = [];
        props.list.forEach((item) => {
            selectedAllList.push(item.value);
        });

        this.state = {
            selectedArr: props.isAllSelected ? selectedAllList : props.initValue
        }
        this.selectCheckbox = this.selectCheckbox.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        if(this.props.initValue !== nextProps.initValue){
            this.setState({
                selectedArr: nextProps.initValue
            });
        }
    }
    selectCheckbox(item) {
        let { selectedArr } = this.state;
        let { beforeSelect, beforeCancelSelect, onChange, disabled, isAllSelected } = this.props;
        let checkSelectBool = null,
            checkCancelSelectBool = null;
        if (item.disabled) { return null; }

        if (selectedArr.indexOf(item.value) > -1) {
            let index = selectedArr.indexOf(item.value);
            beforeCancelSelect && (checkCancelSelectBool = beforeCancelSelect(item, selectedArr));
            checkCancelSelectBool === null ? selectedArr.splice(index, 1) : (checkCancelSelectBool ? selectedArr.splice(index, 1) : null);
        } else {
            beforeSelect && (checkSelectBool = beforeSelect(item, selectedArr));
            checkSelectBool === null ? selectedArr.push(item.value) : (checkSelectBool ? selectedArr.push(item.value) : null);
        }

        this.setState({ selectedArr: selectedArr });

        if (checkSelectBool !== false && checkCancelSelectBool !== false) {
            onChange && onChange(selectedArr);
        };
    }
    render() {
        let { list, label, horizontal,isShowHasSelected,checkBoxRange } = this.props;
        let { selectedArr } = this.state;
        let isShowLabel = label && label.text;
        if(horizontal === undefined) {
            horizontal = true;
        }
        
        return (
            <div className='grace-checkbox'>
                {isShowLabel ? <label className='grace-checkbox-label'>{label.text}</label> : ''}
                <div className='item-container'>
                    {list.map((item, i) => {
                        let iCls = classNames({
                            'grace-checkbox-wrap':true,
                            'grace-checkbox-selected':selectedArr.indexOf(item.value) > -1
                        });
                        let itemCls = classNames({
                            'grace-checkbox-item':true,
                            'grace-checkbox-disabled':!!item.disabled,
                            'nohorizontal':!horizontal
                        });
                        
                        return <div key={item.value} className={itemCls} onClick={() => this.selectCheckbox(item)}>
                            <span className={iCls}>
                                <input type="checkbox" className={'grace-checkbox-input'} value={item.value}/>
                                <span className={'grace-checkbox-inner'}></span>
                            </span>
                            <span className="grace-checkbox-item-text">{item.text}</span>
                        </div>
                    })}
                </div>
                {isShowHasSelected ? <div className="grace-checkbox-select-text">{selectedArr ? selectedArr.length : 0}/{checkBoxRange}已选</div> : ''}
            </div>
        )
    }
}
GraceCheckBox.propTypes = {
    list: PropTypes.array.isRequired,
    initValue: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    label: PropTypes.object,
    beforeSelect: PropTypes.func,
    beforeCancelSelect: PropTypes.func,
    disabled: PropTypes.bool,
    isAllSelected: PropTypes.bool,
    horizontal: PropTypes.bool,
    isShowHasSelected:PropTypes.bool,
    checkBoxRange:PropTypes.number
}

export default GraceCheckBox;