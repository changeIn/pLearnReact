import React,{ Component } from 'react'
import PropTypes from 'prop-types'


import "css/widget/mszSwitch.scss"

class MszSwitch extends Component{
    shouldComponentUpdate(nextProps) {
        return nextProps.currentValue != this.props.currentValue||nextProps.list != this.props.list;
    }   
    constructor(props){
        super(props);
    }

    setCurrent(value,event){
        console.log(this.props.currentValue);
        let disableFun = this.props.disable;
        if(disableFun!=undefined && typeof(disableFun)=='function' )
        {
            if( !this.props.disable(event) ){
                this.props.onChange(value);
            }
        }else{
            this.props.onChange(value);
        }
         
    }
    render() {
        let { list, currentValue} = this.props;
        return (
            <div className='msz-switch'>
            {
                list.map(function (currentList,i) {
                  return <span key={i} className={ currentList.value == currentValue ? 'current' : ''} onClick={this.setCurrent.bind(this,currentList.value)}>{currentList.text}</span>
                },this)
            }
            </div>
        );
    }
}

MszSwitch.propTypes = {
    list: React.PropTypes.array.isRequired,     
    currentValue:React.PropTypes.string.isRequired,
    onChange:PropTypes.func.isRequired,     
};

export default MszSwitch;


/*

 <MySwitch list={list} currentValue={currentValue} onChange={this.onChangeList}/>
 <div>{currentValue}</div>

数据结构
{
    list: [{text: '全部下单客户', value: 999999}, {text: '新下单客户', value: 0}, {text: '老下单客户', value: 1}],
    currentValue:999999
};
 */