import React, { Component } from 'react';
import PropTypes from 'prop-types';
import "css/widget/graceCycleChart.scss";
import { Util } from 'util';
import Highcharts from 'highcharts';
import $ from 'n-zepto';

class GraceCycleChart extends Component {
	renderChart = (data, config) => {
		this.chart && this.chart.container && this.chart.destroy();
		this.chart = new Highcharts.Chart($.extend(Util.cycleGraph(), {
			series: [{
				data: data
			}],
			chart: {
				type: 'pie',
				renderTo: this.chartRef,
				width: 266,
				height: 266
			},
			legend: {
				enabled: false,
			}
		}, config));
		return this.chart;
	}
	setChartRef = (chartRef) => {
		this.chartRef = chartRef;
	}
	componentDidMount() {
		let { data, config } = this.props;
		this.renderChart(data, config);
	}
	shouldComponentUpdate(nextProps) {
		if (JSON.stringify(this.props.data) !== JSON.stringify(nextProps.data)) {
			
			this.chart = this.renderChart(nextProps.data, nextProps.config);
			return true;
		}
		return false;
	}
	componentWillUnmount() {
		this.chart.destroy();
	}
	render() {
		return (
			<div ref={this.setChartRef} className="cycle-chart"></div>
		)
	}
}
GraceCycleChart.propTypes = {
	config: PropTypes.object,
	data: PropTypes.array
}

export default GraceCycleChart;