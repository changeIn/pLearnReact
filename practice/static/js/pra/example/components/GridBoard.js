import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { GraceLoading, GraceGrid, GraceCommonSwitch } from 'util';
import { columnsConfig } from '../config/config';

class GridBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            curSwitchIndex: '1'
        };
        this.SwitchList = [
            { text: '热销商品榜', value: '1' },
            { text: '流量商品榜', value: '2' }
        ];
        // 监听switch的变化，改变表格内容
        this.onSwitchChange = this.onSwitchChange.bind(this);
        this.openModal = this.openModal.bind(this);

        this.columnsConfig = columnsConfig;
        const onProcess = item => {
            if (item.dataIndex === 'Process') {
                item.render = (text, record) => (<span style={{ color: '#3c88f0', cursor: 'pointer' }} onClick={() => { this.openModal(record); }} > 趋势</span >);
            }
        };
        this.columnsConfig.HotPro.forEach(onProcess);
        this.columnsConfig.FlowPro.forEach(onProcess);
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
    onSwitchChange({ value }) {
        this.setState({
            curSwitchIndex: value
        });
    }
    openModal(record) {
        this.props.openModal(record);
    }
    render() {
        return (
            <div className='section'>
                <div className='section-title'>行业商品TOP100</div>
                <GraceCommonSwitch config={this.SwitchList} initValue={this.state.curSwitchIndex} onChange={this.onSwitchChange} />
                <GraceLoading loading={this.props.hotProLoadingState}>
                    <div className={`flow-words-grid  ${this.state.curSwitchIndex === '1' ? '' : 'hide'}`}>
                        <GraceGrid pagination={{ current: 1, pageSize: 10, total: this.props.hotProDataSource.length }} columns={this.columnsConfig.HotPro} dataSource={this.props.hotProDataSource} loading={false} />
                    </div>
                </GraceLoading>
                <GraceLoading loading={this.props.flowProLoadingState}>
                    <div className={`flow-words-grid ${this.state.curSwitchIndex === '2' ? '' : 'hide'}`}>
                        <GraceGrid pagination={{ current: 1, pageSize: 10, total: this.props.flowProDataSource.length }} columns={this.columnsConfig.FlowPro} dataSource={this.props.flowProDataSource} loading={false} />
                    </div>
                </GraceLoading>
            </div >
        );
    }
}

GridBoard.propTypes = {
    hotProDataSource: PropTypes.array,
    flowProDataSource: PropTypes.array,
    hotProLoadingState: PropTypes.bool,
    flowProLoadingState: PropTypes.bool,
    openModal: PropTypes.func
};

GridBoard.defaultProps = {
    hotProDataSource: [],
    flowProDataSource: [],
    hotProLoadingState: true,
    flowProLoadingState: true,
    openModal: () => {
    }
};

export default GridBoard;
