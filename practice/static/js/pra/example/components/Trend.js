import React from 'react';
import PropTypes from 'prop-types';

import { GraceLoading, GraceCheckbox, GraceCommonChart } from 'util';
import { checkBoxConfig } from '../config/config';

class Trend extends React.Component {
    static beforeCheckBoxSelect(obj, arr) {
        return arr.length + 1 <= 4;
    }
    static beforeCheckBoxCancelSelect(obj, arr) {
        return arr.length > 1;
    }
    constructor(props) {
        super(props);
        this.state = {
            curCheckBoxIndexes: {
                PV: true,
                DealProNum: true
            }
        };
        // 监听checkbox的变化，改变趋势图内容
        this.onCheckBoxChange = this.onCheckBoxChange.bind(this);
    }
    shouldComponentUpdate(nextProps, nextState) {
        try {
            if (JSON.stringify(this.props) === JSON.stringify(nextProps) && JSON.stringify(this.state) === JSON.stringify(nextState)) {
                return false;
            }
        } catch (e) {
            return true;
        }
        return true;
    }
    onCheckBoxChange(selectIndexes) {
        // 选中的指标发生变化,重新渲染趋势图
        const curCheckBoxIndexes = {};
        selectIndexes.forEach(index => {
            curCheckBoxIndexes[index] = true;
        });
        this.setState({ curCheckBoxIndexes });
    }
    render() {
        // 只把checkbox选中的指标做显示
        const series = this.props.trendData.series.filter(d => this.state.curCheckBoxIndexes[d.code]).map(item => ({
            ...item,
            name: item.code
        }));
        const CommonChartConfig = {
            chartConfig: {
                chart: {
                    height: 300
                },
                xAxis: {
                    categories: this.props.trendData.categories.map(d => d.slice(5)),
                    labels: { step: 2 }
                },
                series
            },
            showYAxis: false
        };
        const checkBoxCF = {
            onChange: this.onCheckBoxChange,
            beforeCancelSelect: Trend.beforeCheckBoxCancelSelect,
            beforeSelect: Trend.beforeCheckBoxSelect,
            checkBoxRange: 4,
            isShowHasSelected: true,
            list: checkBoxConfig.list,
            initValue: checkBoxConfig.initValue
        };
        return (
            <div className='section'>
                <GraceLoading loading={this.props.trendLoadingState}>
                    <div className='section-title'>大盘走势</div>
                    <GraceCheckbox {...checkBoxCF} />
                    <GraceCommonChart {...CommonChartConfig} />
                </GraceLoading>
            </div>
        );
    }
}

Trend.propTypes = {
    trendLoadingState: PropTypes.bool, // 保存原始数据
    trendData: PropTypes.object
};

Trend.defaultProps = {
    trendLoadingState: true,
    trendData: {}
};

export default Trend;
