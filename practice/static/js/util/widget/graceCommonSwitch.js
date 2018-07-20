/**
 * Created by wangnan on 2018/1/26
 */
/*
说明:
<GraceCommonSwitch 
    config={config.list}  //必选 格式：array
    initValue={initValue} //必选 格式：string
    onChange={this.onChangeSwitch} //必选 格式：function
/>

数据格式:
let config = {
    list: [  // 列表项
        { text: '商品排行', value: '1' },
        { text: '店铺排行', value: '2' },
        { text: '热销排行', value: '3' }
    ]
};

let initValue = config.list[0].value; 

onChangeSwitch(value) {
    console.log(value)
}
*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import "css/widget/graceCommonSwitch.scss";
class GraceCommonSwitch extends Component {
    constructor(props) {
        super(props);
        this.setSelectValue = this.setSelectValue.bind(this);
        this.state = {};
        this.state.selectValue = props.initValue;
    }
    componentWillReceiveProps(nextProps) {
        if(this.props.initValue !== nextProps.initValue){
            this.setState({
                selectValue: nextProps.initValue
            });
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return (nextProps.initValue !== this.props.initValue) ||
            (nextState.selectValue !== this.state.selectValue);
    }
    setSelectValue(obj) {
        this.setState({ selectValue: obj.value });
        this.props.onChange(obj);
    }
    render() {
        let { config } = this.props;
        let { selectValue } = this.state;
        return (
            <div className='grace-common-switch'>
                {
                    config.map((item, i) =>
                        <span key={item.value} className={item.value === selectValue ? 'select' : ''} onClick={() => this.setSelectValue(item)}>{item.text}</span>
                    )
                }
            </div>
        )
    }
}
GraceCommonSwitch.propTypes = {
    config: PropTypes.array.isRequired,
    initValue: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
}
export default GraceCommonSwitch
