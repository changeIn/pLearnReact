import React,{ Component } from 'react'
import PropTypes from "prop-types";

class SelectionCheckboxAll extends Component{
	static propTypes = {
		store: PropTypes.object,
		locale: PropTypes.object,
		// data: data,
		getCheckboxPropsByItem: PropTypes.func,
		// getRecordKey: this.getRecordKey,
		disabled: PropTypes.bool,
		prefixCls: PropTypes.string,
		onSelect: PropTypes.func,
		selections: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
		hideDefaultSelections: PropTypes.bool,
		// getPopupContainer: this.getPopupContainer
	};

	static defaultProps = {

	};

	constructor(props){
		super(props);
		this.state = {
			checked: this._getCheckState(props),
			indeterminate: this._getIndeterminateState(props)
		};
	}

	render(){
		let { prefixCls,disabled } = this.props;
		let { checked,indeterminate } = this.state;

		return (
			<span>
                <div className={`${prefixCls}-selection ${disabled?prefixCls+"-checkbox-disabled":""}`}>
                    <label className={`${prefixCls}-checkbox-wrapper`}>
                        <span className={`${prefixCls}-checkbox ${checked?prefixCls+'-checkbox-checked':''} ${indeterminate?prefixCls+'-checkbox-indeterminate':''}`}>
                            <input type="checkbox" checked={checked} className={`${prefixCls}-checkbox-input`} value="on" onChange={this._handleSelectAllChagne} />
                            <span className={`${prefixCls}-checkbox-inner`}> </span>
                        </span>
                    </label>
                </div>
            </span>
		)
	}

	componentDidMount(){  //真实的DOM被渲染出来后调用，在该方法中可通过this.getDOMNode()访问到真实的DOM元素。此时已可以使用其他类库来操作这个DOM。在服务端中，该方法不会被调用。
		this._subscribe();
	}

	componentWillReceiveProps(nextProps){  //组件接收到新的props时调用，并将其作为参数nextProps使用，此时可以更改组件props及state。
		this._setCheckState(nextProps);
	}

	componentWillUnmount(){  //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器。
		if (this.unsubscribe) {
			this.unsubscribe();
		}
	}
	_subscribe = () => {
		let _this = this;
		let store = this.props.store;
		this.unsubscribe = store.subscribe(function () {
			_this._setCheckState(_this.props);
		});
	};
	_checkSelection = (data, type, byDefaultChecked) => {
		let { store,getCheckboxPropsByItem,getRecordKey } = this.props;
		// type should be 'every' | 'some'

		if (type === 'every' || type === 'some') {
			return byDefaultChecked ? data[type](function (item, i) {
				return getCheckboxPropsByItem(item, i).defaultChecked;
			}) : data[type](function (item, i) {
				return store.getState().selectedRowKeys.indexOf(getRecordKey(item, i)) >= 0;
			});
		}
		return false;
	};
	_setCheckState = () => {
		let checked = this._getCheckState(this.props);
		let indeterminate = this._getIndeterminateState(this.props);
		if (checked !== this.state.checked) {
			this.setState({ checked: checked });
		}
		if (indeterminate !== this.state.indeterminate) {
			this.setState({ indeterminate: indeterminate });
		}
	};
	_getCheckState = (props) => {
		let { store,data } = props;
		let checked = false;
		if (!data.length) {
			checked = false;
		} else {
			checked = store.getState().selectionDirty ? this._checkSelection(data, 'every', false) : this._checkSelection(data, 'every', false) || this._checkSelection(data, 'every', true);
		}
		return checked;
	};
	_getIndeterminateState = (props) => {
		let { store,data } = props;

		let indeterminate = false;
		if (!data.length) {
			indeterminate = false;
		} else {
			indeterminate = store.getState().selectionDirty ? this._checkSelection(data, 'some', false) && !this._checkSelection(data, 'every', false) : this._checkSelection(data, 'some', false) && !this._checkSelection(data, 'every', false) || this._checkSelection(data, 'some', true) && !this._checkSelection(data, 'every', true);
		}
		return indeterminate;
	};
	_handleSelectAllChagne = (e) => {
		let checked = e.target.checked;
		this.props.onSelect(checked ? 'all' : 'removeAll', 0, null);
	};
	_renderMenus = (selections) => {
		// let _this = this;
		//
		// return selections.map(function (selection, index) {
		//     return React.createElement(
		//         Menu.Item,
		//         { key: selection.key || index },
		//         React.createElement(
		//             'div',
		//             { onClick: function onClick() {
		//                     _this.props.onSelect(selection.key, index, selection.onSelect);
		//                 } },
		//             selection.text
		//         )
		//     );
		// });
	}
}

export default SelectionCheckboxAll;