
import React,{ Component } from 'react'

class FilterDropdownMenuWrapper extends Component {
	render() {
		return (
			<div className={this.props.className} onClick={this.props.onClick}>
				{this.props.children}
			</div>
		);
	}
}

export default FilterDropdownMenuWrapper;