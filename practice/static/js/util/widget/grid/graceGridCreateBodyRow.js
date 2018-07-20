import _defineProperty from 'babel-runtime/helpers/defineProperty';
import React,{ Component } from 'react'
import classnames from 'classnames';
import omit from 'omit.js';
export default function createTableRow() {
    let RowComponent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'tr';
    class BodyRow extends Component{
        constructor(props){
            super(props);
            this.store = props.store;

            let selectedRowKeys = this.store.getState().selectedRowKeys;

            this.state = {
                selected: selectedRowKeys.indexOf(props.rowKey) >= 0
            };
        }
        render(){
            let rowProps = omit(this.props, ['prefixCls', 'rowKey', 'store']);
            let className = classnames(this.props.className, _defineProperty({}, this.props.prefixcls + '-row-selected', this.state.selected));
            return (
                <RowComponent {...rowProps} className={className}>
                    {this.props.children}
                </RowComponent>
            )
        }

        componentDidMount(){  //真实的DOM被渲染出来后调用，在该方法中可通过this.getDOMNode()访问到真实的DOM元素。此时已可以使用其他类库来操作这个DOM。在服务端中，该方法不会被调用。
            this.subscribe();
        }

        componentWillUnmount(){  //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器。
            if (this.unsubscribe) {
                this.unsubscribe();
            }
        }
        subscribe = () => {
            let _this = this;

            let { store,rowkey } = this.props;

            this.unsubscribe = store.subscribe(function () {
                let selectedRowKeys = _this.store.getState().selectedRowKeys;

                let selected = selectedRowKeys.indexOf(rowkey) >= 0;
                if (selected !== _this.state.selected) {
                    _this.setState({ selected: selected });
                }
            });
        };
    }
    return BodyRow
}