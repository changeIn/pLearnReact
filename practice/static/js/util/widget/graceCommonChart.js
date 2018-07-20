/**
 * Created by Ryanchill on 2018/1/31
 */

/* description
 *
 * angular-grace 使用的是 highChart V4.2.5
 * react-grace 使用的是 highChart V6.0.5
 *
 * 1.使用方式
 * 通过 ref='chart' 的方式获得实例 this.refs.chart   -> get instance  可以调用实例中的方法
 *
 * let commonChartConfig = {
 *      chartConfig: this.getDefaultChartConfig(),
 *      showlegend: true,
 *      callback: this.chartRenderCb,
 *      domProps: {
 *      id: 'chartInstance1',
 *      uid: '7758258'
 *      }
 *  }
 *
 * <GraceCommonChart  {...commonChartConfig} />
 *  or
 * <GraceCommonChart
 *   chartConfig = {commonChartConfig.chartConfig}
 *   getInstance = {commonChartConfig.getInstance}
 *   showlegend = {commonChartConfig.showlegend}
 *
 * />
 *
 *
 * 2.配置项
 * @param {object}  chartConfig: {},             // highchart中的配置对象
 * @param {bool}    showlegend: true(default)    // 是否展现legend   配置项使用默认的legend
 * @param {number}  maxSelect:5                  // 已经废弃
 * @param {func}    callback: fn(){},            // 图表渲染完成之后的回调函数
 * @param {object}  domProps: {}                 // 设置自定义属性
 * @param {boolen}  autoFormat                   // 是否自动读取meta.js信息进行tooltip格式化 适合不用特殊化处理的tooltip 默认处理
 * @param {func}    toolTipNameFormatFn          // tooltip X轴值格式化属性 方便进行特殊化处理 不设置的话与图表X轴保持一致
 *
 *
 * 3.注意
 * autoFormat 属性生效的时候 会自动实现指标中文名映射 数字格式化等操作 所有的数据源都依赖meta.js对应指标的描述
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import _merge from 'lodash.merge';
import _clonedeep from 'lodash.clonedeep';
import Highcharts from 'highcharts';
import HighchartsNoData from 'highcharts/modules/no-data-to-display';
import 'css/widget/graceCommonChart.scss';
import 'css/common.scss';
import meta from './meta';
import DataFormatter from './format';


class GraceCommonChart extends React.Component {
    constructor(props) {
        super(props);
        HighchartsNoData(Highcharts);
        Highcharts.setOptions({
            lang: {
                noData: '暂无数据'
            }
        });
        // this.Highcharts = Highcharts;
        this.state = this.initState(this.props);
        this.initState = this.initState.bind(this);
        this.getChart = this.getChart.bind(this);
    }

    componentDidMount() {
        this.chart = this.renderChart(this.mergeChartConf(this.props.chartConfig));
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.showlegend !== nextProps.showlegend) {
            const newState = this.initState(nextProps);
            this.setState({
                ...newState
            });
        }
    }

    shouldComponentUpdate(nextProps) {
        if (JSON.stringify(this.props.chartConfig) !== JSON.stringify(nextProps.chartConfig)) {
            window && window.requestAnimationFrame && requestAnimationFrame(() => {
                this.chart = this.renderChart(this.mergeChartConf(nextProps.chartConfig));
            });
        }
        return false;
    }

    componentWillUnmount() {
        this.chart.destroy();
    }


    getChart() {
        if (!this.chart) {
            throw new Error('getChart() 方法必须在组件装载完成之后调用');
        }
        return this.chart;
    }

    // 获得实例
    setChartRef(chartRef) {
        this.chartRef = chartRef;
    }

    // 合并图表配置
    mergeChartConf(customChartConf) {
        let customChartConf_copy = _clonedeep(customChartConf);
        let _this = this;
        const { showYAxis, showlegend } = this.props;
        const defaultChartConf = {
            chart: {
                type: 'line',
                backgroundColor: '#ffffff',
                plotBackgroundColor: '#ffffff',
                spacing: [30, 15, 30, 15]
            },
            title: {
                text: null,
                style: {
                    color: '#656565',
                    font: 'bold 14px 微软雅黑'
                }
            },
            legend: {
                enabled: showlegend,
                useHTML: true,
                floating: true,
                align: 'right',
                verticalAlign: 'top',
                symbolWidth: 8,
                symbolHeight: 8,
                symbolPadding: 8,
                y: -30,
                itemStyle: {
                    color: '#666666',
                    fontSize: '12px',
                    fontWeight: 'normal'
                },
                labelFormatter() {
                    return meta[this.name] ? meta[this.name].name : this.name;
                }
            },
            credits: {
                enabled: false
            },
            xAxis: {
                tickLength: 0,
                labels: {
                    style: {
                        color: '#999999',
                        fontSize: '11px'
                    }
                }
            },
            yAxis: {
                title: {
                    text: null
                },
                labels: {
                    enabled: false
                },
                gridLineDashStyle: 'longdash',
                gridLineColor: '#e8e8e8'
            },
            tooltip: {
                borderWidth: 0,
                backgroundColor: 'rgba(0, 27, 55, 0.55)',
                followPointer: false,
                shadow: false,
                shape: 'square',
                shared: true,
                padding: 0,
                crosshairs: {
                    width: 1,
                    color: '#e2e2e2',
                    dashStyle: 'solid'
                },
                style: {
                    fontFamily: '"Helvetica Neue", Helvetica, Verdana, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei","微软雅黑","WenQuanYi Micro Hei", sans-serif'
                },
                formatter() {
                    const xAxisLabel = `<span class="xAxisLabel">${_this.props.toolTipNameFormatFn(_this.chartToolTipXDateFormat(this.x))}</span>`;
                    let yAxisDetail = '';

                    // 同一X轴的Y轴的值
                    this.points.forEach(item => {
                        const color = item.color || '#000000';
                        const autoFormatFlag = _this.props.autoFormat === undefined ? true : _this.props.autoFormat;

                        const indexName =
                            autoFormatFlag && meta[item.series.name]
                                ? meta[item.series.name].name
                                : item.series.name;

                        const formatString = (meta[item.series.name] && meta[item.series.name].format) || item.series.options.format || null;

                        const indexVal =
                            autoFormatFlag && formatString
                                ? DataFormatter(item.y, formatString)
                                : item.y;

                        yAxisDetail += `<div class="graceCommonChart-tooptipItem">
                                <div class="graceCommonChart-indexContainer">
                                  <span class="graceCommonChart-indexIcon" style="background:${color}"></span>
                                  <span class="graceCommonChart-indexName">${indexName}</span>
                                </div>
                                <span class="graceCommonChart-indexVal">${indexVal}</span>
                            </div>`;
                    });
                    return `<div class="graceCommonChart-toolTipWrapper">${xAxisLabel}${yAxisDetail}<div>`;
                },
                useHTML: true
            },
            colors: ['#4671bd', '#199bfc', '#15c2c2', '#29b952', '#efda7a', '#e5b167', '#8697e9', '#ffe2e2', '#bec4e2', '#415c8a'],
            plotOptions: {
                series: {}, // 通用配置
                line: {
                    cursor: 'pointer',
                    // lineWidth: 2,
                    marker: {
                        enabled: true,
                        radius: 4,
                        lineWidth: 2,
                        lineColor: '#ffffff',
                        symbol: 'circle'
                    },
                    states: {
                        hover: {
                            enabled: false
                        }
                    }
                }
            },
            series: [],
            noData: {
                style: {
                    fontSize: '15px',
                    color: '#666666',
                    fontWeight: 600
                }
            }
        };

        const mergeConfig = _merge(defaultChartConf, customChartConf_copy);

        // 不显示Y轴 更新配置
        if (!showYAxis) {
            const upDateConfig = this.yAxisVisibleConf(customChartConf_copy.series);
            mergeConfig.series = upDateConfig.series_copy || [];
            mergeConfig.yAxis = upDateConfig.yAxis_invisible || [];
        }
        return mergeConfig;
    }

    // 初始化state
    initState = obj => ({
        showlegend: obj.showlegend === undefined ? true : obj.showlegend,
        // maxSelect: obj.maxSelect === undefined ? false : obj.maxSelect,
        selectedIndexes: [] // 已选坐标
    })

    // 是否隐藏Y轴配置
    yAxisVisibleConf = series => {
        let yAxis_invisible;
        const series_copy = series ? series.slice(0) : [];

        // 为series添加轴引用值
        series_copy.length > 0 &&
            series_copy.forEach((item, index) => {
                item.yAxis = index;
                item._colorIndex = index;
            });

        // 生成y轴隐藏配置
        // eslint-disable-next-line
        yAxis_invisible = Array.apply(null, Array(series_copy.length)).map(() => ({ visible: false }));

        return { series_copy, yAxis_invisible };
    }

    // x轴格式化
    chartToolTipXDateFormat = pointX => {
        let t2;
        if (/^\d{2}$/.test(pointX)) {
            // 03(3)-->3
            pointX = Number(pointX);
        } else if (/^\d{1,2}[-|/]\d{1,2}$/.test(pointX)) {
            // 03-26-->3-26(03/26-->3-26)
            pointX = String(pointX).replace(/\//, '-');
            t2 = pointX.split('-');
            pointX = Number(t2[0]) + '-' + t2[1];
        } else if (/^\d{2,4}[-|/]\d{1,2}[-|/]\d{1,2}$/.test(pointX)) {
            // 2017-03-26-->3-26(2017/03/26-->3-26)
            pointX = String(pointX).replace(/\//, '-');
            t2 = pointX.split('-');
            pointX = Number(t2[1]) + '-' + t2[2];
        } else if (/^\d{6}$/.test(pointX)) {
            // 201703——>2017-03
            pointX = String(pointX).replace(/^(\w{4})-?(\w{2})$/, '$1-$2');
        } else if (/^\d{8}$/.test(pointX)) {
            // 20170326——>3-26
            t2 = String(pointX)
                .replace(/^(\w{4})-?(\w{2})-?(\w{2})$/, '$1-$2-$3')
                .substring(5)
                .split('-');
            pointX = Number(t2[0]) + '-' + t2[1];
        } else if (/[\((][\s\S]*[\))]$/.test(pointX)) {
            // 2017年第12周(03/20-03/26)-->2017年第12周
            pointX = pointX.replace(/[\((][\s\S]*[\))]/, '');
        }
        return pointX;
    }

    renderChart(config) {
        if (!config) {
            throw new Error('缺失配置项');
        }

        config.chart.renderTo = this.chartRef;

        const chart = new Highcharts.Chart(
            {
                ...config,
                chart: {
                    ...config.chart,
                    renderTo: this.chartRef
                }
            },
            this.props.callback
        );

        return chart;
    }

    render() {
        return (
            <div className='graceCommonChart'>
                <div className='grace-highchart-container' ref={this.setChartRef.bind(this)} {...this.props.domProps} />
            </div>
        );
    }
}

// 传入类型检测
GraceCommonChart.propTypes = {
    chartConfig: PropTypes.object,
    callback: PropTypes.func,
    showlegend: PropTypes.bool,
    toolTipNameFormatFn: PropTypes.func,
    showYAxis: PropTypes.bool,
    domProps: PropTypes.object
};

GraceCommonChart.defaultProps = {
    showYAxis: true,
    showlegend: true,
    callback: () => { },
    toolTipNameFormatFn: v => (v),
    domProps: {},
    chartConfig: {}
};

export default GraceCommonChart;
