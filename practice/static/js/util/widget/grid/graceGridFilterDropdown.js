import _defineProperty from 'babel-runtime/helpers/defineProperty';
import React,{ Component } from 'react'
import PropTypes from "prop-types";
import classNames from 'classnames';
import Dropdown from 'rc-dropdown';
import Menu, { SubMenu, Item as MenuItem,Divider } from 'rc-menu';
import  FilterDropdownMenuWrapper from '../grid/graceGridFilterDropdownMenuWrapper';


class FilterDropdown extends Component {
	state = {
		selectedKeys: this.props.selectedKeys,
		keyPathOfSelectedItem: {},
		visible: 'filterDropdownVisible' in this.props.column ? this.props.column.filterDropdownVisible : false
	};

	render() {
		let { column,locale,prefixCls,dropdownPrefixCls,getPopupContainer } = this.props;
		let visible = this.state.visible;
		let multiple = 'filterMultiple' in column ? column.filterMultiple : true;
		let dropdownMenuClass = classNames(_defineProperty({}, dropdownPrefixCls + '-menu-without-submenu', !this.hasSubMenu()));

		let confirmBtn = multiple?
			 <div className={prefixCls + '-dropdown-btns'}>
				<a className={prefixCls + '-dropdown-link confirm'} onClick={this.handleConfirm}>{locale.filterConfirm}</a>
				<a className={prefixCls + '-dropdown-link clear'} onClick={this.handleClearFilters}>{locale.filterReset}</a>
			</div>:null;


		const menu = (
			<FilterDropdownMenuWrapper className={prefixCls + '-dropdown'}>
				<Menu  multiple={multiple}
					   onClick={this.handleMenuItemClick}
					   prefixCls={`${dropdownPrefixCls}-menu`}
					   className={dropdownMenuClass}
					   onSelect={this.setSelectedKeys}
					   onDeselect={this.setSelectedKeys}
					   selectedKeys={this.state.selectedKeys}>
					{ this.renderMenus(column.filters) }
				</Menu>
				{ confirmBtn }
			</FilterDropdownMenuWrapper>
		);

		return (
			<Dropdown
				prefixCls={'grace-dropdown'}
				trigger={['click']}
				onVisibleChange={this.onVisibleChange}
				visible={visible}
				closeOnSelect={false}
				overlay={menu}
				placement={'bottomRight'}
				animation="slide-up"
			>
				<span className={`${prefixCls}-filter-arrow ${visible?'arrow-up':'arrow-down'}`}> </span>
			</Dropdown>
		);
	}

	hasSubMenu = () => {
		let filters = this.props.column.filters === undefined ? [] : this.props.column.filters;
		return filters.some(function (item) {
			return !!(item.children && item.children.length > 0);
		});
	};
	handleMenuItemClick = (info) => {
		if (info.keyPath.length <= 1) {
			return;
		}
		let keyPathOfSelectedItem = this.state.keyPathOfSelectedItem;
		if (this.state.selectedKeys.indexOf(info.key) >= 0) {
			// deselect SubMenu child
			delete keyPathOfSelectedItem[info.key];
		}
		else {
			// select SubMenu child
			keyPathOfSelectedItem[info.key] = info.keyPath;
		}
		this.setState({ keyPathOfSelectedItem: keyPathOfSelectedItem });
	};
	setSelectedKeys = (_ref) => {
		let _this = this;
		let { column } = this.props;
		let multiple = 'filterMultiple' in column ? column.filterMultiple : true;
		let selectedKeys = _ref.selectedKeys;
		this.setState({ selectedKeys: selectedKeys },function(){
			if(!multiple){
				_this.handleConfirm();
			}
		});
	};
	renderMenus = (items) => {
		let _this2 = this;
		return items.map(function (item) {
			if (item.children && item.children.length > 0) {
				let keyPathOfSelectedItem = _this2.state.keyPathOfSelectedItem;

				let containSelected = Object.keys(keyPathOfSelectedItem).some(function (key) {
					return keyPathOfSelectedItem[key].indexOf(item.value) >= 0;
				});
				let subMenuCls = containSelected ? _this2.props.dropdownPrefixCls + '-submenu-contain-selected' : '';
				return <SubMenu title={item.text} className={subMenuCls} key={item.value.toString()}>
						{_this2.renderMenus(item.children)}
					</SubMenu>
			}
			return <MenuItem key={item.value}><span>{item.text}</span> </MenuItem>;
		});
	};
	handleConfirm = () => {
		this.setVisible(false);
		this.confirmFilter();
	};
	handleClearFilters = () => {
		this.setState({
			selectedKeys: []
		}, this.handleConfirm);
	};
	confirmFilter = () => {
		if (this.state.selectedKeys !== this.props.selectedKeys) {
			this.props.confirmFilter(this.props.column, this.state.selectedKeys);
		}
	};
	setVisible = (visible) => {
		let column = this.props.column;

		if (!('filterDropdownVisible' in column)) {
			this.setState({ visible: visible });
		}
		if (column.onFilterDropdownVisibleChange) {
			column.onFilterDropdownVisibleChange(visible);
		}
	};
	onVisibleChange = (visible) => {
		this.setState({
			visible,
		});
	};
}

export default FilterDropdown;