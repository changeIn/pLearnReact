import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { GraceLoading, GraceCommonModal, GraceCheckbox, GraceCommonChart } from 'util';
import { modalCheckBoxConfig } from '../config/config';

class Modal extends Component {
    static beforeCheckBoxCancelSelect(obj, arr) {
        return arr.length > 1;
    }
    static beforeCheckBoxSelect(obj, arr) {
        return arr.length + 1 <= 4;
    }
    constructor(props) {
        super(props);
        this.onCheckBoxChange = this.onCheckBoxChange.bind(this);

        this.state = {
            // checkbox选项恢复默认值
            curCheckBoxIndexes: {
                DealProNum: true
            }
        };
        this.onModalCancel = this.onModalCancel.bind(this);
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
    onModalCancel() {
        // 调用上级onCancel，清空store中的数据
        this.props.onCancel();
    }
    onCheckBoxChange(selectIndexes) {
        const curCheckBoxIndexes = {};
        selectIndexes.forEach(index => {
            curCheckBoxIndexes[index] = true;
        });
        this.setState({ curCheckBoxIndexes });
    }
    render() {
        // 只把checkbox选中的指标做显示
        const series = this.props.series.filter(d => this.state.curCheckBoxIndexes[d.code]).map(item => ({
            ...item,
            name: item.code
        }));
        const modalCheckBoxCF = {
            onChange: this.onCheckBoxChange,
            beforeCancelSelect: Modal.beforeCheckBoxCancelSelect,
            beforeSelect: Modal.beforeCheckBoxSelect,
            checkBoxRange: 4,
            isShowHasSelected: true,
            ...modalCheckBoxConfig
        };
        const modalChartConfig = {
            chartConfig: {
                chart: {
                    height: 300
                },
                legend: { align: 'right' },
                xAxis: {
                    categories: this.props.categories.map(d => d.slice(5)),
                    labels: { step: 2 }
                },
                series
            },
            showYAxis: false
        };

        const modalContent = (
            <GraceLoading loading={this.props.loadingState}>
                <GraceCheckbox {...modalCheckBoxCF} />
                <GraceCommonChart {...modalChartConfig} />
            </GraceLoading>
        );
        return (
            <GraceCommonModal
                mtype='normal'
                useModalFooter={false}
                position='middle'
                isOpen={this.props.isOpen}
                hasTitle
                titleContent={this.props.title}
                modalCnt={modalContent}
                onCancel={this.onModalCancel}
            />
        );
    }
}

Modal.propTypes = {
    loadingState: PropTypes.bool,
    title: PropTypes.string,
    series: PropTypes.array, // 保存原始数据
    categories: PropTypes.array,
    isOpen: PropTypes.bool,
    onCancel: PropTypes.func
};

Modal.defaultProps = {
    loadingState: true,
    title: '',
    series: [],
    categories: [],
    isOpen: false,
    onCancel: () => { }
};
export default Modal;
