/**
 * Created by wangnan on 2018/02/05
 */
/*
参数说明:
isMult：是否为复选,默认为false,单选  非必选
onChange：点击回调，返回当前的选择信息，非必选
data：数据对象，格式如下  必选
数据格式:
let data:{
    "code": "company",
    "name": "分公司",                        //维度名称
    "mode": 1,
    "selected": null,
    "detail": [                               //维度项的集合
        {
            "code": "companyAll",           //维度code， 如果为全部则需要注意一定要该字段转换为小写后以 “All”结尾
            "name": "全部",                   //维度显示的名称
            "mode": null,
            "selected": true,                //标示该维度是否默认选中
            "detail": null
        },
        {
            "code": "beijing",
            "name": "北京",
            "mode": null,
            "selected": true,
            "detail": null
        },
        {
            "code": "shanghai",
            "name": "上海",
            "mode": null,
            "selected": true,
            "detail": null
        },
        {
            "code": "guangzhou",
            "name": "广州",
            "mode": null,
            "selected": true,
            "detail": null
        },
        {
            "code": "chengdu",
            "name": "成都",
            "mode": null,
            "selected": true,
            "detail": null
        },
        {
            "code": "wuhan",
            "name": "武汉",
            "mode": null,
            "selected": true,
            "detail": null
        },
        {
            "code": "shenyang",
            "name": "沈阳",
            "mode": null,
            "selected": true,
            "detail": null
        },
        {
            "code": "xian",
            "name": "西安",
            "mode": null,
            "selected": true,
            "detail": null
        }
    ]
}
onChangeBaseSelect(value){
    console.log(value);  //value为当前已选择项的信息
    //dosomeing
}
使用事例:
<GraceDimensionBaseSelect isMult={true} data={data} onChange={this.onChangeBaseSelect}/>
*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class Multiselect extends Component {
    static propTypes = {
        data: PropTypes.object.isRequired
    }
    constructor(props) {
        super(props);
        this.clickItem = this.clickItem.bind(this);
        this.state = {
            selectCode: this.getSelectCode(props.data.detail)
        }
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            selectCode: this.getSelectCode(nextProps.data.detail)
        });
    }
    getSelectCode(data) {
        let code = null;
        if (!data || !(data.constructor === Array)) {
            throw new Error('data 格式错误');
            // return null;
        }
        for (let i = 0; i < data.length; i++) {
            if (data[i]['selected'] === true) {
                code = data[i]['code'];
                break;
            }
        }
        return code;
    }
    clickItem(item) {
        this.setState({ selectCode: item.code });
        this.props.onChange && this.props.onChange(item);
    }
    render() {
        let { data } = this.props;
        let { selectCode } = this.state;

        return (
            <div className='grace-base-select-multiselect'>
                <div className='select-title'>{data['name']}</div>
                <div className='select-content'>
                    {data.detail.map((item, i) => {
                        let itemCls = classNames({
                            'select-content-item': true,
                            'select': item.code === selectCode
                        });
                        return <div className={itemCls} key={item.code} onClick={() => this.clickItem(item)}>{item.name}</div>
                    })}
                </div>
            </div>
        )
    }
}

class Radio extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAllSelected: this.isAllSelected(props.data.detail).mark,
            selectCode: this.getSelectCode(props.data.detail),
            allItemIndex: this.isAllSelected(props.data.detail).index
        }
        this.clickItem = this.clickItem.bind(this);
    }
    isAllSelected(data) {
        if (!data || !(data.constructor === Array)) {
            throw new Error('data 格式错误');
            // return null;
        }
        let obj = {};
        for (let i = 0; i < data.length; i++) {
            if (data[i]['code'].indexOf('All') > -1) {
                obj.mark = data[i]['selected'];
                obj.index = i;
                break;
            }
        }
        return obj;
    }
    getSelectCode(data) {
        if (!data || !(data.constructor === Array)) {
            throw new Error('data 格式错误');
            // console.error('data 格式错误');
            // return null;
        }
        let selectCode = [],
            isAllSelect = this.isAllSelected(data);
        for (let i = 0; i < data.length; i++) {
            if (isAllSelect) {
                data[i]['code'].indexOf('All') === -1 && selectCode.push(data[i]['code']);
            } else if (!!data[i]['selected']) {
                selectCode.push(data[i]['code']);
            }
        }
        return selectCode;
    }
    clickItem(item, isAllButton) {
        let { selectCode, isAllSelected } = this.state;
        let { data, onChange } = this.props;
        if (isAllButton) {
            selectCode = isAllSelected ? [] : this.getSelectCode(data.detail);
            isAllSelected = !isAllSelected;
        } else {
            if (selectCode.indexOf(item.code) > -1) {
                let index = selectCode.indexOf(item.code);
                item.code.indexOf('All') > -1 ? (selectCode = []) : (selectCode.splice(index, 1));
                isAllSelected = false;
            } else {
                selectCode.push(item.code);
                isAllSelected = selectCode.length === data.detail.length - 1 ? true : false;
            }
        }
        this.setState({
            selectCode: selectCode,
            isAllSelected: isAllSelected
        });
        onChange && onChange({
            selectCode: selectCode,
            isAllSelected: isAllSelected
        });
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            selectCode: this.getSelectCode(nextProps.data.detail)
        });
    }
    render() {
        let { data } = this.props;
        let { selectCode, isAllSelected, allItemIndex } = this.state;
        let allCls = classNames({
            'radio-icon': true,
            'select': isAllSelected
        });
        return (
            <div className='grace-base-select-radio'>
                <div className='radio-title'>{`${data['name']}:`}</div>
                <div className='radio-content'>
                    <div className={'radio-content-item'} key={data.detail[allItemIndex].code} onClick={() => this.clickItem(data.detail[allItemIndex], true)}>
                        <i className={allCls}></i>
                        <span>{data.detail[allItemIndex].name}</span>
                    </div>
                    {data.detail.map((item, i) => {
                        if (i === allItemIndex) { return null; }
                        let iCls = classNames({
                            'radio-icon': true,
                            'select': selectCode.indexOf(item.code) > -1
                        });
                        return <div className={'radio-content-item'} key={item.code} onClick={() => this.clickItem(item)}>
                            <i className={iCls}></i>
                            <span>{item.name}</span>
                        </div>
                    })}
                </div>
            </div>
        )
    }
}

class GraceDimensionBaseSelect extends Component {
    static propTypes = {
        isMult: PropTypes.bool,
        data: PropTypes.object.isRequired,
        onChange: PropTypes.func
    }
    constructor(props) {
        super(props);
    }
    render() {
        let { isMult, data, onChange } = this.props;
        // if(data === undefined || data === null){
        //     data = {};
        // }
        return (
            isMult ? <Radio data={data} onChange={onChange} /> : <Multiselect data={data} onChange={onChange} />
        )
    }
}

export default GraceDimensionBaseSelect