import React,{ Component } from 'react'
import PropTypes from "prop-types";



class SelectionBox extends Component{
	static propTypes = {
		store: PropTypes.object,
		//type: PropTypes.string,暂时没用
		prefixCls: PropTypes.string,
		rowIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		disabled: PropTypes.bool,
		defaultSelection: PropTypes.func,
		onChange: PropTypes.func,
	};

	static defaultProps = {

	};

	constructor(props){
		super(props);
		this.state = {
			checked: this._getCheckState(props)
		};
	}

	render(){
		let { disabled,rowIndex,onChange,prefixCls } = this.props;
		let checked = this.state.checked;
		return(
			<span>
                <label className={`${prefixCls}-checkbox-wrapper`}>
                    <span className={`${prefixCls}-checkbox ${checked?prefixCls+'-checkbox-checked':''}`}>
                        <input type="checkbox" checked={checked} disabled={disabled} className={`${prefixCls}-checkbox-input`} onChange={onChange} value="on" name={rowIndex} />
                        <span className={`${prefixCls}-checkbox-inner`}> </span>
                    </span>
                </label>
            </span>
		)
	}

	componentDidMount(){
		this._subscribe();
	}

	componentWillUnmount(){
		if (this.unsubscribe) {
			this.unsubscribe();
		}
	}

	_getCheckState = () => {
		let { store,defaultSelection,rowIndex } = this.props;

		let checked = false;
		if (store.getState().selectionDirty) {
			checked = store.getState().selectedRowKeys.indexOf(rowIndex) >= 0;
		}
		else {
			checked = store.getState().selectedRowKeys.indexOf(rowIndex) >= 0 || defaultSelection().indexOf(rowIndex) >= 0;
		}
		return checked;
	};

	_subscribe = () => {
		let _this = this;
		let store = this.props.store;

		this.unsubscribe = store.subscribe(function () {
			let checked = _this._getCheckState(_this.props);
			_this.setState({ checked: checked });
		});
	}
}

export default SelectionBox;