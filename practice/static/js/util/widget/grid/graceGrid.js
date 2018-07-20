/**
 * Created by chenhaifeng on 2018/2/5.
 */
/*
* 表格组件参数配置说明：
*
*	tips:带有*号前缀的配置表示功能待实现
*
* 表格配置：
*		bordered: PropTypes.bool,                                               //是否展示外边框和列边框 默认值：false
*       dataSource: PropTypes.array,                                            //数据数组
*		footer:PropTypes.func,                                                  //表格尾部
*		indentSize:PropTypes.number,                                            //展示树形数据时，每层缩进的宽度，以 px 为单位
*		columns: PropTypes.array,                                               //表格列的配置描述，具体项下方注释
*		components:PropTypes.object,                                            //覆盖默认的 table 元素
*		loading:PropTypes.oneOfType([PropTypes.bool,PropTypes.object]),         //页面是否加载中
*		locale: PropTypes.object,                                               //默认文案设置，目前包括排序、过滤、空数据文案.filterConfirm: '确定'filterReset: '重置'emptyText: '暂无数据'
*		rowClassName:PropTypes.func,                                            //表格行的类名 Function(record, index):string
*		rowKey:PropTypes.oneOfType([PropTypes.string,PropTypes.object]),        //表格行 key 的取值，可以是字符串或一个函数 string|Function(record):string
*		pagination: PropTypes.object,                                           //分页器配置
*       rowSelection: PropTypes.object,                                         //列表项是否可选择
*		showHeader:PropTypes.bool,                                              //是否显示表头
*		title:PropTypes.func,                                                   //表格标题
*		onChange: PropTypes.func,                                               //分页、排序、筛选变化时触发 Function(pagination, filters, sorter)
*		onRow:PropTypes.func,                                                   //设置行属性 Function(record, index)
*		prefixCls: PropTypes.string,                                            //表格所有类名的前缀
*		className: PropTypes.string,                                            //最外层dom添加的自定义类
*		lockHeaderConfig:PropTypes.object										//firstLockerOffsetTop:第一层锁定dom的顶部偏移;firstLockerHeight:第二层锁定dom的高度
*		*useFixedHeader: PropTypes.bool,                                         //是否为标题使用分隔表。更好地设置列的宽度
*		*childrenColumn: PropTypes.array,                                        //展开部分列信息
*       *size: PropTypes.string,                                                 //正常或迷你类型，default or small 默认值：default
*       *dropdownPrefixCls: PropTypes.string                                     //展开项的类名前缀
*
*columns配置：
*
*		key: PropTypes.string											//React 需要的 key，如果已经设置了唯一的 dataIndex，可以忽略这个属性
*		title: PropTypes.string											//列头显示文字
*		dataIndex: PropTypes.string										//列数据在数据项中对应的 key，支持 a.b.c 的嵌套写法
*		width: oneOfType([PropTypes.string,PropTypes.bool]),			//列数据在数据项中对应的 key，支持 a.b.c 的嵌套写法
*		render: PropTypes.func,											//生成复杂数据的渲染函数，参数分别为当前行的值，当前行数据，行索引，@return里面可以设置表格行/列合并
*		defaultSortOrder: oneOfType([PropTypes.string,PropTypes.bool])  //排序的受控属性，外界可用此控制列的排序，可设置为 'ascend' 'descend'
*		sortOrder: oneOfType([PropTypes.string,PropTypes.bool])			//'ascend' 'descend' false
*		sorter: PropTypes.func											//排序函数，本地排序使用一个函数(参考 Array.sort 的 compareFunction)，需要服务端排序可设为 true
*		className: PropTypes.string										//列的 className
*		fixed: oneOfType([PropTypes.string,PropTypes.bool]),     		//列是否固定，可选 true(等效于 left) 'left' 'right'
*		onCell: PropTypes.func											//设置单元格属性 Function(record)
*		onHeaderCell: PropTypes.func									//设置头部单元格属性 Function(column)
*		colSpan: PropTypes.number										//表头列合并,设置为 0 时，不渲染
*		*onFilter: PropTypes.func										//本地模式下，确定筛选的运行函数
*		*onFilterDropdownVisibleChange: PropTypes.string				//自定义筛选菜单可见变化时调用 function(visible)
*		*filters: PropTypes.object										//表头的筛选菜单项
*		*filterMultiple: PropTypes.bool  								//是否多选
*		*filterIcon: PropTypes.ReactNode    							//自定义 fiter 图标。
*		*filteredValue: PropTypes.array	    							//筛选的受控属性，外界可用此控制列的筛选状态，值为已筛选的 value 数组
*		*filtered: PropTypes.bool		    							//标识数据是否经过过滤，筛选图标会高亮
*		*filterDropdown: PropTypes.ReactNode    						//可以自定义筛选菜单，此函数只负责渲染图层，需要自行编写各种交互
*		*filterDropdownVisible: PropTypes.bool    						//用于控制自定义筛选菜单是否可见
*
*
* components结构展示（次配置一般不需要配置，在组件中作为修改行状态的依据）：
*
*
* pagination配置：
*
*		current:PropTypes.number,               //当前页数
*       hideOnSinglePage:PropTypes.bool,        //只有一页时是否隐藏分页器
*       pageSize:PropTypes.number,              //每页条数
*		pageButtonSize:PropTypes.number,		//分页器显示的页数按钮的个数
*       pageSizeOptions:PropTypes.array,        //指定每页可以显示多少条
*		showSizeChanger:PropTypes.bool,         //是否可以显示 pageSizeOptions
*		total:PropTypes.number,                 //数据总数
*		onChange:PropTypes.func,                //页码改变的回调，参数是改变后的页码及每页条数 Function(page, pageSize)
*		onShowSizeChange:PropTypes.func,        //pageSize 变化的回调 Function(current, size)
*
*rowSelection配置：
*
*		fixed：PropTypes.bool,        								//把选择框列固定在左边
*		getCheckboxProps：PropTypes.func,       						//选择框的默认属性配置 Function(record)
*		hideDefaultSelections：PropTypes.bool,  						//去掉『全选』『反选』两个默认选项
*		selectedRowKeys：PropTypes.array,							//指定选中项的 key 数组，需要和 onChange 进行配合
*		selections：oneOfType([PropTypes.object,PropTypes.bool]),   //自定义选择项 配置项, 设为 true 时使用默认选择项
*		onChange：PropTypes.func,        							//选中项发生变化的时的回调 Function(selectedRowKeys, selectedRows)
*		onSelect：PropTypes.func,        							//用户手动选择/取消选择某列的回调 Function(record, selected, selectedRows)
*		onSelectAll：PropTypes.func,        							//用户手动选择/取消选择所有列的回调 Function(selected, selectedRows, changeRows)
*		onSelectInvert：PropTypes.func,        						//用户手动选择反选的回调 Function(selectedRows)
*
* selections配置：
*
* 		key：PropTypes.string					//React 需要的 key，建议设置string
* 		text：PropTypes.string					//选择项显示的文字
* 		onSelect：PropTypes.func					//选择项点击回调 Function(changeableRowKeys)
* */

import _extends from 'babel-runtime/helpers/extends';
import _typeof from 'babel-runtime/helpers/typeof';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import React,{ Component } from 'react'
import * as ReactDOM from 'react-dom';
import PropTypes from 'prop-types'
import classNames from 'classnames'
import RcTable from 'rc-table';
import createStore from './graceGridCreateStore';
import createBodyRow from './graceGridCreateBodyRow';
import GracePagination from '../gracePagination';
import GraceLoading from '../graceLoading';
import SelectionBox from './graceGridSelectionBox';
import SelectionCheckboxAll from './graceGridSelectionCheckboxAll';
import FilterDropdown from './graceGridFilterDropdown';
import { flatArray, treeMap, flatFilter, normalizeColumns } from './graceGridService';
import 'css/widget/graceGrid.scss'

const __rest = this && this.__rest || function (s, e) {
    let t = {};
    for (let p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    }
    if (s != null && typeof Object.getOwnPropertySymbols === "function") for (let i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0) t[p[i]] = s[p[i]];
    }
    return t;
};
//空函数
function noop() {}

//默认分页配置
let defaultPagination = {
    onChange: noop,
    onShowSizeChange: noop
};
//空对象
let emptyObject = {};

//表格组件主体
class GraceGrid extends Component{
	static propTypes = {
		// rowHeight:PropTypes.number,												//表格主体部分的行高
		// headerRowHeight:PropTypes.number,										//表格头部行高
		// minColumnWidth:PropTypes.number,										//表格最小列宽
		//minBodyHeight:PropTypes.number,											//表格主体最小的高度
		bordered: PropTypes.bool,                                               //是否展示外边框和列边框 默认值：false
        dataSource: PropTypes.array,                                            //数据数组
		footer:PropTypes.func,                                                  //表格尾部
		indentSize:PropTypes.number,                                            //展示树形数据时，每层缩进的宽度，以 px 为单位
		columns: PropTypes.array,                                               //表格列的配置描述，具体项下方注释
		components:PropTypes.object,                                            //覆盖默认的 table 元素
		loading:PropTypes.oneOfType([PropTypes.bool,PropTypes.object]),         //页面是否加载中
		locale: PropTypes.object,                                               //默认文案设置，目前包括排序、过滤、空数据文案.filterConfirm: '确定'filterReset: '重置'emptyText: '暂无数据'
		rowClassName:PropTypes.func,                                            //表格行的类名 Function(record, index):string
		rowKey:PropTypes.oneOfType([PropTypes.string,PropTypes.object]),        //表格行 key 的取值，可以是字符串或一个函数 string|Function(record):string
		pagination: PropTypes.oneOfType([PropTypes.bool,PropTypes.object]),     //分页器配置
        rowSelection: PropTypes.object,                                         //列表项是否可选择
		showHeader:PropTypes.bool,                                              //是否显示表头
		title:PropTypes.func,                                                   //表格标题
		onChange: PropTypes.func,                                               //分页、排序、筛选变化时触发 Function(pagination, filters, sorter)
		onRow:PropTypes.func,                                                   //设置行属性 Function(record, index)
		prefixCls: PropTypes.string,                                            //表格所有类名的前缀
		useFixedHeader: PropTypes.bool,                                         //是否为标题使用分隔表。更好地设置列的宽度
		childrenColumn: PropTypes.array,                                        //展开部分列信息
        className: PropTypes.string,                                            //最外层dom添加的自定义类
		lockHeaderConfig:PropTypes.object,										//firstLockerOffsetTop:第一层锁定dom的顶部偏移;firstLockerHeight:第二层锁定dom的高度
        size: PropTypes.string,                                                 //正常或迷你类型，default or small 默认值：default
        dropdownPrefixCls: PropTypes.string                                     //展开项的类名前缀
    };

    static defaultProps = {
		bordered: false,
		indentSize: 20,
		loading: false,
        prefixCls: 'grace-grid',
        useFixedHeader: false,
		locale: {
			filterConfirm: '确定',
			filterReset: '重置',
			emptyText: '暂无数据'
		},
		showHeader: true,
		pagination:false,
		rowKey: 'key',
		dataSource: [],
		rowSelection: null,
		className: '',
        // rowSelection: {
        //     onChange: (selectedRowKeys, selectedRows) => {
        //         console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        //     },
        //     getCheckboxProps: record => ({
        //         disabled: record.name === 'Disabled User', // Column configuration not to be checked
        //         name: record.name,
        //     })
        // },
    };

	constructor(props){
	    super(props);
	    //初始化一些值
        this.store = createStore({
            selectedRowKeys: (props.rowSelection || {}).selectedRowKeys || [],
            selectionDirty: false
        });
        this.columns = props.columns || normalizeColumns(props.children);
        this.CheckboxPropsCache = {};
        this.state = _extends({}, this._getDefaultSortOrder(this.columns), {
            // 减少状态
            filters: this._getFiltersFromColumns(), pagination: this._getDefaultPagination(props)
        });
        this._createComponents(props.components);
	}

    render(){
        let { bordered,loading } = this.props;
	    //rcTable组件
        let renderTable = this._renderTable();
        //分页组件
        let renderPagination = this._renderPagination();
		let renderLoading = loading?
			<GraceLoading> {renderTable} {renderPagination}</GraceLoading> :
			<span>{renderTable} {renderPagination}</span>;
		return (
			<div className={`grace-grid-wrapper ${bordered?'grace-grid-bordered':''}`}>
				{renderLoading}
			</div>
		)
	}
	componentDidMount() {
		let { lockHeaderConfig } = this.props;
		if(lockHeaderConfig){
			let fixedDom = document.getElementsByClassName('grace-grid-thead');
			document.addEventListener('scroll',winScroll,false);
			function winScroll(e){
				if(lockHeaderConfig.firstLockerOffsetTop+lockHeaderConfig.firstLockerHeight<window.pageYOffset){
					setTimeout(function(){
						fixedDom[0].setAttribute('style',`transform: translateY(${lockHeaderConfig.firstLockerOffsetTop+lockHeaderConfig.firstLockerHeight+window.pageYOffset}px);`);
					},0);
				}
				else {
					setTimeout(function(){
						fixedDom[0].setAttribute('style',`transform: translateY(0px);`);
					},0);
				}
			}
		}
	}
/*
* 				gridConfig.lockHeaderConfig = {
                    //第一层锁定dom的顶部偏移
                    firstLockerOffsetTop:$scope.firstLockerOffsetTop,
                    //第二层锁定dom的高度
                    firstLockerHeight:$scope.firstLockerHeight
                },
* */
    componentWillReceiveProps(nextProps){  //组件接收到新的props时调用，并将其作为参数nextProps使用，此时可以更改组件props及state。
        this.columns = nextProps.columns || normalizeColumns(nextProps.children);
        if ('pagination' in nextProps || 'pagination' in this.props) {
            this.setState(function (previousState) {
                let newPagination = _extends({}, defaultPagination, previousState.pagination, nextProps.pagination);
                newPagination.current = newPagination.current || 1;
                newPagination.pageSize = newPagination.pageSize || 10;
                return { pagination: nextProps.pagination !== false ? newPagination : emptyObject };
            });
        }
        if (nextProps.rowSelection && 'selectedRowKeys' in nextProps.rowSelection) {
            this.store.setState({
                selectedRowKeys: nextProps.rowSelection.selectedRowKeys || []
            });
            let rowSelection = this.props.rowSelection;

            if (rowSelection && nextProps.rowSelection.getCheckboxProps !== rowSelection.getCheckboxProps) {
                this.CheckboxPropsCache = {};
            }
        }
        if ('dataSource' in nextProps && nextProps.dataSource !== this.props.dataSource) {
            this.store.setState({
                selectionDirty: false
            });
            this.CheckboxPropsCache = {};
        }
        if (this._getSortOrderColumns(this.columns).length > 0) {
            let sortState = this._getSortStateFromColumns(this.columns);
            if (sortState.sortColumn !== this.state.sortColumn || sortState.sortOrder !== this.state.sortOrder) {
                this.setState(sortState);
            }
        }
        let filteredValueColumns = this._getFilteredValueColumns(this.columns);
        if (filteredValueColumns.length > 0) {
            let filtersFromColumns = this._getFiltersFromColumns(this.columns);
            let newFilters = _extends({}, this.state.filters);
            Object.keys(filtersFromColumns).forEach(function (key) {
                newFilters[key] = filtersFromColumns[key];
            });
            if (this.isFiltersChanged(newFilters)) {
                this.setState({ filters: newFilters });
            }
        }
        this._createComponents(nextProps.components, this.props.components);
    }

    //渲染rcTable组件
	_renderTable = () => {
		let { locale,prefixCls,showHeader,expandedRowRender,expandIconAsCell } = this.props;
		let _this = this;
		let classString = 'defaultUIStyle';
		let data = this._getCurrentPageData();
		let columns = this._renderRowSelection();
		let restProps = __rest(this.props, ["style", "className", "prefixCls", "showHeader"]);

		expandIconAsCell = expandedRowRender && expandIconAsCell !== false;
		columns = this._renderColumnsDropdown(columns, locale);
		columns = columns.map(function (column, i) {
			let newColumn = _extends({}, column);
			newColumn.key = _this._getColumnKey(newColumn, i);
			return newColumn;
		});
		let expandIconColumnIndex = columns[0] && columns[0].key === 'selection-column' ? 1 : 0;
		if ('expandIconColumnIndex' in restProps) {
			expandIconColumnIndex = restProps.expandIconColumnIndex;
		}

		return <RcTable key="table" {...restProps} onRow={this._onRow} components={this.components} columns={columns} data={data} showHeader={showHeader}
						className={classString}	prefixCls={prefixCls} expandIconAsCell={expandIconAsCell} emptyText={locale.emptyText}
						expandIconColumnIndex={expandIconColumnIndex}> </RcTable>
	};
	//获取当前页数据
	_getCurrentPageData = () => {
		let data = this._getLocalData();
		let current = 0;
		let pageSize = 0;
		let state = this.state;
		// 如果没有分页的话，默认全部展示
		if (!this._hasPagination()) {
			pageSize = Number.MAX_VALUE;
			current = 1;
		}
		else {
			pageSize = state.pagination.pageSize;
			current = this._getMaxCurrent(state.pagination.total || data.length);
		}
		// 分页
		// ---
		// 当数据量少于等于每页数量时，直接设置数据
		// 否则进行读取分页数据
		if (data.length > pageSize || pageSize === Number.MAX_VALUE) {
			data = data.filter(function (_, i) {
				return i >= (current - 1) * pageSize && i < current * pageSize;
			});
		}
		return data;
	};
	//处理列属性（排序，筛选...）
	_renderRowSelection = () => {
		let { locale,prefixCls,rowSelection,dataSource } = this.props;
		let _this = this;

		let columns = this.columns.concat();
		if (rowSelection) {
			let data = this._getFlatCurrentPageData().filter(function (item, index) {
				if (rowSelection.getCheckboxProps) {
					return !_this._getCheckboxPropsByItem(item, index).disabled;
				}
				return true;
			});
			let selectionColumnClass = `${prefixCls}-selection-column ${prefixCls}-selection-column-custom`;
			let selectionColumn = {
				key: 'selection-column',
				render: this._renderSelectionBox(rowSelection.type),
				className: selectionColumnClass,
				fixed: rowSelection.fixed,
				width:20
			};
			if (rowSelection.type !== 'radio') {
				let checkboxAllDisabled = data.every(function (item, index) {
					return _this._getCheckboxPropsByItem(item, index).disabled;
				});
				selectionColumn.title = <SelectionCheckboxAll type="checkBox" store={this.store} data={data}
															  getCheckboxPropsByItem={this._getCheckboxPropsByItem}
															  getRecordKey={this._getRecordKey}
															  disabled={checkboxAllDisabled}
															  prefixCls={prefixCls}
															  onSelect={this._handleSelectRow}
															  selections={rowSelection.selections}
															  hideDefaultSelections={rowSelection.hideDefaultSelections}
				> </SelectionCheckboxAll> ;
			}
			if ('fixed' in rowSelection) {
				selectionColumn.fixed = rowSelection.fixed;
			}
			else if (columns.some(function (column) {
					return column.fixed === 'left' || column.fixed === true;
				})) {
				selectionColumn.fixed = 'left';
			}
			if (columns[0] && columns[0].key === 'selection-column') {
				columns[0] = selectionColumn;
			}
			else {
				columns.unshift(selectionColumn);
			}
		}
		return columns;
	};
	_getFlatCurrentPageData = () => {
	    //处理掉子元素的结构
		return flatArray(this._getCurrentPageData());
	};
    _getSorterFn = () => {
        let { sortOrder,sortColumn } = this.state;

        if (!sortOrder || !sortColumn || typeof sortColumn.sorter !== 'function') {
            return;
        }
        return function (a, b) {
            let result = sortColumn.sorter(a, b);
            if (result !== 0) {
                return sortOrder === 'descend' ? -result : result;
            }
            return 0;
        };
    };
    _recursiveSort(data, sorterFn) {
        let _this = this;
        let childrenColumn = this.props.childrenColumn;
        let childrenColumnName = childrenColumn === undefined ? 'children' : childrenColumn;

        return data.sort(sorterFn).map(function (item) {
            return item[childrenColumnName] ? _extends({}, item, _defineProperty({}, childrenColumnName, _this._recursiveSort(item[childrenColumnName], sorterFn))) : item;
        });
    };
    //根据key值返回列数据
    _findColumn = (myKey) => {
        let _this = this;

        let column = void 0;
        treeMap(this.columns, function (c) {
            if (_this._getColumnKey(c) === myKey) {
                column = c;
            }
        });
        return column;
    };
	_getLocalData = () => {
        let _this = this;
        let state = this.state;
        let dataSource = this.props.dataSource;

        let data = dataSource || [];
        // 优化本地排序
        data = data.slice(0);
        let sorterFn = this._getSorterFn();
        if (sorterFn) {
            data = this._recursiveSort(data, sorterFn);
        }
        // 筛选
        if (state.filters) {
            Object.keys(state.filters).forEach(function (columnKey) {
                let col = _this._findColumn(columnKey);
                if (!col) {
                    return;
                }
                let values = state.filters[columnKey] || [];
                if (values.length === 0) {
                    return;
                }
                let onFilter = col.onFilter;
                data = onFilter ? data.filter(function (record) {
                    return values.some(function (v) {
                        return onFilter(v, record);
                    });
                }) : data;
            });
        }
        return data;
    };
	_getFlatData = () => {
        return flatArray(this._getLocalData());
    };
	_hasPagination = (props) => {
		return (props || this.props).pagination !== false;
	}
    _getDefaultSelection = () => {
        let { rowSelection } = this.props;
        let _this = this;
        rowSelection = rowSelection === undefined ? {} : rowSelection;

        if (!rowSelection.getCheckboxProps) {
            return [];
        }
        return this._getFlatData().filter(function (item, rowIndex) {
            return _this._getCheckboxPropsByItem(item, rowIndex).defaultChecked;
        }).map(function (record, rowIndex) {
            return _this._getRecordKey(record, rowIndex);
        });
    };
    _onRow = (record, index) => {
        let { onRow,prefixCls } = this.props;
        let custom = onRow ? onRow(record, index) : {};
        return _extends({}, custom, { prefixcls: prefixCls, store: this.store, rowkey: this._getRecordKey(record, index) });
    };
    _getColumnKey = (column, index) => {
		return column.key || column.dataIndex || index;
	};
    _renderColumnsDropdown = (columns, locale) => {
		let _this = this;
        let { prefixCls,dropdownPrefixCls } = this.props;
		let sortOrder = this.state.sortOrder;

		return treeMap(columns, function (originColumn, i) {
			let column = _extends({}, originColumn);
			let key = _this._getColumnKey(column, i);
			let filterDropdown = null;
			let sortButton = null;
			if (column.filters && column.filters.length > 0 || column.filterDropdown) {
				let colFilters = _this.state.filters[key] || [];
				filterDropdown = <FilterDropdown	locale={locale}
													column={column}
													selectedKeys={colFilters}
													confirmFilter={_this._handleFilter}
													prefixCls={prefixCls}
													dropdownPrefixCls={dropdownPrefixCls || 'grace-dropdown'}
													getPopupContainer={_this._getPopupContainer}
								> </FilterDropdown>
			}
			if (column.sorter) {
				let isSortColumn = _this._isSortColumn(column);
				if (isSortColumn) {
					column.className = classNames(column.className, _defineProperty({}, prefixCls + '-column-sort', sortOrder));
				}
				let isAscend = isSortColumn && sortOrder === 'ascend';
				let isDescend = isSortColumn && sortOrder === 'descend';
				sortButton = <div className={prefixCls + '-column-sorter'}>
                                <span className={prefixCls + '-column-sorter-up ' + (isAscend ? 'on' : 'off')} title={'\u2191'} onClick={()=>_this._toggleSortOrder('ascend', column)}>
                                    <i className={'graceicon ' + prefixCls + '-ion-sorter-up'}> </i>
                                </span>
                                <span className={prefixCls + '-column-sorter-down ' + (isDescend ? 'on' : 'off')} title={'\u2193'} onClick={()=>_this._toggleSortOrder('descend', column)}>
                                    <i className={'graceicon ' + prefixCls + '-ion-sorter-down'}> </i>
                                </span>
                            </div>;
			}
			column.title = <span> {column.title} {sortButton} {filterDropdown} </span>;
             //    React.createElement(
			// 	'span',
			// 	null,
			// 	column.title,
			// 	sortButton,
			// 	filterDropdown
			// );
			return column;
		});
	};
    _toggleSortOrder = (order, column) => {
		let { sortColumn,sortOrder } = this.state;
		// 只同时允许一列进行排序，否则会导致排序顺序的逻辑问题
		let isSortColumn = this._isSortColumn(column);
		if (!isSortColumn) {
			sortOrder = order;
			sortColumn = column;
		}
		else {
			if (sortOrder === order) {
				sortOrder = '';
				sortColumn = null;
			}
			else {
				sortOrder = order;
			}
		}
		let newState = {
			sortOrder: sortOrder,
			sortColumn: sortColumn
		};
		// Controlled
		if (this._getSortOrderColumns().length === 0) {
			this.setState({
				sortOrder: sortOrder,
				sortColumn: sortColumn
            });
		}
		let onChange = this.props.onChange;
		if (onChange) {
			onChange.apply(null, this._prepareParamsArguments(_extends({}, this.state, newState)));
		}
	};
    _isSortColumn = (column) => {
		let sortColumn = this.state.sortColumn;

		if (!column || !sortColumn) {
			return false;
		}
		return this._getColumnKey(sortColumn) === this._getColumnKey(column);
	};
	_renderPagination = () => {
		// 强制不需要分页
		if (!this._hasPagination()) {
			return null;
		}
		//let size = 'default';
		let pagination = this.state.pagination;

		// if (pagination.size) {
		// 	size = pagination.size;
		// } else if (this.props.size === 'middle' || this.props.size === 'small') {
		// 	size = 'small';
		// }
		let total = pagination.total || this._getLocalData().length;
		return total > 0 ? <GracePagination key="pagination" total={total} pageSize={pagination.pageSize} hasTotalTitle={pagination.hasTotalTitle}
											current={pagination.current} onShowSizeChange={this._handleShowSizeChange} onChange={this._handlePageChange}
                            > </GracePagination> : null;
		// return total > 0 ? React.createElement(Pagination, _extends({ key: 'pagination' }, pagination,
        // { className: classNames(pagination.className, this.props.prefixCls + '-pagination'), onChange: this.handlePageChange,
        // total: total, size: size, current: this.getMaxCurrent(total), onShowSizeChange: this.handleShowSizeChange })) : null;
        //<GracePagination onChange={this.pageChange} onShowSizeChange={this.sizeChange} current={1} pageSize={20} total={500}> </GracePagination>
	};
	// Get pagination, filters, sorter
    _getMaxCurrent = (total) => {
		let { current,pageSize } = this.state.pagination;

		if ((current - 1) * pageSize >= total) {
			return Math.floor((total - 1) / pageSize) + 1;
		}
		return current;
	};
	_handleShowSizeChange = (current, pageSize) => {
		let pagination = this.state.pagination;
		pagination.onShowSizeChange(current, pageSize);
		let nextPagination = _extends({}, pagination, { pageSize: pageSize,	current: current });
		this.setState({ pagination: nextPagination });
		let onChange = this.props.onChange;
		if (onChange) {
			onChange.apply(null, this._prepareParamsArguments(_extends({}, this.state, { pagination: nextPagination })));
		}
	};
	_handlePageChange = (current,pageSize) => {

		let props = this.props;
		let pagination = _extends({}, this.state.pagination);
		if (current) {
			pagination.current = current;
		}
		else {
			pagination.current = pagination.current || 1;
		}
		pagination.onChange.apply(pagination, [pagination.current].concat(pageSize));
		let newState = {
			pagination: pagination
		};
		// Controlled current prop will not respond user interaction
		// if (props.pagination && typeof(props.pagination) === 'object' && 'current' in props.pagination) {
		// 	newState.pagination = _extends({}, pagination, {current: this.state.pagination.current});
		// }
		this.setState(newState);
		this.store.setState({
			selectionDirty: false
		});
		let onChange = this.props.onChange;
		if (onChange) {
			onChange.apply(null, this._prepareParamsArguments(_extends({}, this.state, {selectionDirty: false, pagination: pagination})));
		}
	};
	_prepareParamsArguments = (state) => {
		let pagination = _extends({}, state.pagination);
		// remove useless handle function in Table.onChange
		delete pagination.onChange;
		delete pagination.onShowSizeChange;
		let filters = state.filters;
		let sorter = {};
		if (state.sortColumn && state.sortOrder) {
			sorter.column = state.sortColumn;
			sorter.order = state.sortOrder;
			sorter.field = state.sortColumn.dataIndex;
			sorter.columnKey = this._getColumnKey(state.sortColumn);
		}
		return [pagination, filters, sorter];
	};
    _getFilteredValueColumns = (columns) => {
        return flatFilter(columns || this.columns || [], function (column) {
            return typeof column.filteredValue !== 'undefined';
        });
    };
    _getFiltersFromColumns = (columns) => {
        let _this = this;
        let filters = {};
        this._getFilteredValueColumns(columns).forEach(function (col) {
            let colKey = _this._getColumnKey(col);
            filters[colKey] = col.filteredValue;
        });
        return filters;
    };
    _getDefaultPagination = (props) => {
		let pagination = props.pagination || {};
		return this._hasPagination(props) ? _extends({}, defaultPagination, pagination, { current: pagination.current || 1, pageSize: pagination.pageSize || 10}) : {};
	};
    _getCheckboxPropsByItem = (item, index) => {
        let { rowSelection } = this.props;
        rowSelection = rowSelection === undefined ? {} : rowSelection;

        if (!rowSelection.getCheckboxProps) {
            return {};
        }
        let key = this._getRecordKey(item, index);
        // Cache checkboxProps
        if (!this.CheckboxPropsCache[key]) {
            this.CheckboxPropsCache[key] = rowSelection.getCheckboxProps(item);
        }
        return this.CheckboxPropsCache[key];
    };
    _getPopupContainer = function () {
		return ReactDOM.findDOMNode(this);
	};
    _getRecordKey = (record, index) => {
        let rowKey = this.props.rowKey;
        let recordKey = typeof rowKey === 'function' ? rowKey(record, index) : record[rowKey];
        return recordKey === undefined ? index : recordKey;
    };
    _handleSelectRow = (selectionKey, index, onSelectFunc) => {
        let _this = this;
        let data = _this._getFlatCurrentPageData();
        let defaultSelection = this.store.getState().selectionDirty ? [] : this._getDefaultSelection();
        let selectedRowKeys = this.store.getState().selectedRowKeys.concat(defaultSelection);
        let changeableRowKeys = data.filter(function (item, i) {
            return !_this._getCheckboxPropsByItem(item, i).disabled;
        }).map(function (item, i) {
            return _this._getRecordKey(item, i);
        });
        let changeRowKeys = [];
        let selectWay = '';
        let checked = false;
        // handle default selection
        switch (selectionKey) {
            case 'all':
                changeableRowKeys.forEach(function (key) {
                    if (selectedRowKeys.indexOf(key) < 0) {
                        selectedRowKeys.push(key);
                        changeRowKeys.push(key);
                    }
                });
                selectWay = 'onSelectAll';
                checked = true;
                break;
            case 'removeAll':
                changeableRowKeys.forEach(function (key) {
                    if (selectedRowKeys.indexOf(key) >= 0) {
                        selectedRowKeys.splice(selectedRowKeys.indexOf(key), 1);
                        changeRowKeys.push(key);
                    }
                });
                selectWay = 'onSelectAll';
                checked = false;
                break;
            case 'invert':
                changeableRowKeys.forEach(function (key) {
                    if (selectedRowKeys.indexOf(key) < 0) {
                        selectedRowKeys.push(key);
                    } else {
                        selectedRowKeys.splice(selectedRowKeys.indexOf(key), 1);
                    }
                    changeRowKeys.push(key);
                    selectWay = 'onSelectInvert';
                });
                break;
            default:
                break;
        }
        _this.store.setState({
            selectionDirty: true
        });
        // when select custom selection, callback selections[n].onSelect
        let rowSelection = _this.props.rowSelection;

        let customSelectionStartIndex = 2;
        if (rowSelection && rowSelection.hideDefaultSelections) {
            customSelectionStartIndex = 0;
        }
        if (index >= customSelectionStartIndex && typeof onSelectFunc === 'function') {
            return onSelectFunc(changeableRowKeys);
        }
        _this._setSelectedRowKeys(selectedRowKeys, {
			selectWay: selectWay,
			checked: checked,
			changeRowKeys: changeRowKeys
        });
    };
    _setSelectedRowKeys = (selectedRowKeys, _ref) => {
        let _this = this;
        let { selectWay,record,checked,changeRowKeys } = _ref;
        let rowSelection = this.props.rowSelection;
        rowSelection = rowSelection === undefined ? {} : rowSelection;

        if (rowSelection && !('selectedRowKeys' in rowSelection)) {
            this.store.setState({ selectedRowKeys: selectedRowKeys });
        }
        let data = this._getFlatData();
        if (!rowSelection.onChange && !rowSelection[selectWay]) {
            return;
        }
        let selectedRows = data.filter(function (row, i) {
            return selectedRowKeys.indexOf(_this._getRecordKey(row, i)) >= 0;
        });
        if (rowSelection.onChange) {
            rowSelection.onChange(selectedRowKeys, selectedRows);
        }
        if (selectWay === 'onSelect' && rowSelection.onSelect) {
            rowSelection.onSelect(record, checked, selectedRows);
        }
        else if (selectWay === 'onSelectAll' && rowSelection.onSelectAll) {
            let changeRows = data.filter(function (row, i) {
                return changeRowKeys.indexOf(_this.getRecordKey(row, i)) >= 0;
            });
            rowSelection.onSelectAll(checked, selectedRows, changeRows);
        }
        else if (selectWay === 'onSelectInvert' && rowSelection.onSelectInvert) {
            rowSelection.onSelectInvert(selectedRowKeys);
        }
    };
    _getDefaultSortOrder = (columns) => {
        let definedSortState = this._getSortStateFromColumns(columns);
        let defaultSortedColumn = flatFilter(columns || [], function (column) {
            return column.defaultSortOrder != null;
        })[0];
        if (defaultSortedColumn && !definedSortState.sortColumn) {
            return {
                sortColumn: defaultSortedColumn,
                sortOrder: defaultSortedColumn.defaultSortOrder
            };
        }
        return definedSortState;
    };
    _getSortStateFromColumns = (columns) => {
        // return first column which sortOrder is not falsy
        let sortedColumn = this._getSortOrderColumns(columns).filter(function (col) {
            return col.sortOrder;
        })[0];
        if (sortedColumn) {
            return {
                sortColumn: sortedColumn,
                sortOrder: sortedColumn.sortOrder
            };
        }
        return {
            sortColumn: null,
            sortOrder: null
        };
    };
    _getSortOrderColumns = (columns) => {
        return flatFilter(columns || this.columns || [], function (column) {
            return 'sortOrder' in column;
        });
    };
    _createComponents = () => {
        let components = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        let prevComponents = arguments[1];

        let bodyRow = components && components.body && components.body.row;
        let preBodyRow = prevComponents && prevComponents.body && prevComponents.body.row;
        if (!this.components || bodyRow !== preBodyRow) {
            this.components = _extends({}, components);
            this.components.body = _extends({}, components.body, { row: createBodyRow(bodyRow) });
        }
    };
    _renderSelectionBox = (type) => {
        let prefixCls = this.props.prefixCls;
        let _this = this;
        return function (_, record, index) {
            let rowIndex = _this._getRecordKey(record, index); // 从 1 开始
            let props = _this._getCheckboxPropsByItem(record, index);
            let handleChange = function handleChange(e) {
                /*type === 'radio' ? _this.handleRadioSelect(record, rowIndex, e) : */
                _this._handleSelect(record, rowIndex, e);
            };
            return <span onClick={_this.stopPropagation}><SelectionBox type={type} prefixCls={prefixCls} store={_this.store} rowIndex={rowIndex} disabled={props.disabled}
                                                                       onChange={handleChange} defaultSelection={_this._getDefaultSelection}> </SelectionBox></span>

        };
    };
	_handleFilter = (column, nextFilters) => {
		let props = this.props;
		let _this = this;
		let pagination = _extends({}, this.state.pagination);
		let tempNextFilters = JSON.parse(JSON.stringify(nextFilters));
		if(tempNextFilters.length===1&&tempNextFilters[0]==='all'){
			tempNextFilters = [];
		}
		let filters = _extends({}, this.state.filters, _defineProperty({}, this._getColumnKey(column), tempNextFilters));
		// Remove filters not in current columns
		let currentColumnKeys = [];
		treeMap(this.columns, function (c) {
			if (!c.children) {
				currentColumnKeys.push(_this._getColumnKey(c));
			}
		});
		Object.keys(filters).forEach(function (columnKey) {
			if (currentColumnKeys.indexOf(columnKey) < 0) {
				delete filters[columnKey];
			}
		});
		if (props.pagination) {
			// Reset current prop
			pagination.current = 1;
			pagination.onChange(pagination.current);
		}
		let newState = {
			pagination: pagination,
			filters: {}
		};
		let filtersToSetState = _extends({}, filters);
		// Remove filters which is controlled
		this._getFilteredValueColumns().forEach(function (col) {
			let columnKey = _this._getColumnKey(col);
			if (columnKey) {
				delete filtersToSetState[columnKey];
			}
		});
		if (Object.keys(filtersToSetState).length > 0) {
			newState.filters = filtersToSetState;
		}
		// Controlled current prop will not respond user interaction
		if (_typeof(props.pagination) === 'object' && 'current' in props.pagination) {
			newState.pagination = _extends({}, pagination, { current: _this.state.pagination.current });
		}
		this.setState(newState, function () {
			_this.store.setState({
				selectionDirty: false
			});
			let onChange = _this.props.onChange;
			if (onChange) {
				onChange.apply(null, _this._prepareParamsArguments(_extends({}, _this.state, { selectionDirty: false, filters: filters,
					pagination: pagination })));
			}
		});
	};
    _handleSelect = (record, rowIndex, e) => {
        let checked = e.target.checked;
        let defaultSelection = this.store.getState().selectionDirty ? [] : this._getDefaultSelection();
        let selectedRowKeys = this.store.getState().selectedRowKeys.concat(defaultSelection);
        let key = this._getRecordKey(record, rowIndex);
        if (checked) {
            selectedRowKeys.push(this._getRecordKey(record, rowIndex));
        }
        else {
            selectedRowKeys = selectedRowKeys.filter(function (i) {
                return key !== i;
            });
        }
        this.store.setState({
            selectionDirty: true
        });
        this._setSelectedRowKeys(selectedRowKeys, {
			selectWay: 'onSelect',
			record: record,
			checked: checked
        });
    };
    stopPropagation = (e) => {
        e.stopPropagation();
        if (e.nativeEvent.stopImmediatePropagation) {
            e.nativeEvent.stopImmediatePropagation();
        }
    }
}

export default GraceGrid;