/**
 * Created by yuhongping on 2018/1/30.
 */

import React,{ Component } from 'react'
import PropTypes from 'prop-types'

import $ from 'n-zepto'
import 'css/widget/graceCataDropdown.scss'

const GraceDropdown = WrappedComponent => {
    return class extends Component {

        $document = $(document)

        constructor(props) {
            super(props);
            this.state = { isShow: false};
            this._isMounted = true;
            this.clickFn = this.clickFn.bind(this);
            this.closeDropdown = this.closeDropdown.bind(this);
        }
        closeDropdown() {
            this.$document.unbind('click', this.closeDropdown);
            if(this._isMounted) {
                this.setState({
                    isShow: false
                });
            }
        }
        openDropdown() {
            $(".grace-dropdown-open .dropdown-toggle").click();
            this.$document.bind('click', this.closeDropdown);
            this.setState({
                isShow: true
            });
        }
        clickFn() {
            if (this.state.isShow) {
                this.closeDropdown();
            } else {
                this.openDropdown();
            }
        }
        render() {
            const { isShow } = this.state;
            //只要给它传递的props没有改变，那么我理解为这个组件就不会重新执行render！！！
            return <div className={(isShow ? 'grace-dropdown-open' : '') } >
                <WrappedComponent {...this.props} isShow={this.state.isShow} handleClick={this.clickFn}/>
            </div>
        }

        componentWillUnmount() {
            //debugger 初始化的时候，就会触发这个，这个还得优化下，想想
            this._isMounted = false
        }
    }
}
export default GraceDropdown;

