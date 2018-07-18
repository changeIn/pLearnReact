import React,{ Component } from 'react'

const data = [
  {category: "Sporting Goods", price: "$49.99", stocked: true, name: "Football"},
  {category: "Sporting Goods", price: "$9.99", stocked: true, name: "Baseball"},
  {category: "Sporting Goods", price: "$29.99", stocked: false, name: "Basketball"},
  {category: "Electronics", price: "$99.99", stocked: true, name: "iPod Touch"},
  {category: "Electronics", price: "$399.99", stocked: false, name: "iPhone 5"},
  {category: "Electronics", price: "$199.99", stocked: true, name: "Nexus 7"}
];

function SearchBar(props) {
	return (
		<input value={props.value} onChange={props.handleInputsChange} />
	);
}

function ProductTable(props) {
	return (
		<div>
			<table>
				<thead>
					<td>Name</td>
					<td>Price</td>
				</thead>
				<tbody>
					
				</tbody>
			</table>
		</div>
	)
}

function ProductRow(props) {
	return (
		<tr>
			props.rows.map(row => )
		</tr>
	)
}
