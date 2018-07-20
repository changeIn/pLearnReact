import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { GracePageFramework } from 'util';

import Modal from './Modal';
import Trend from './Trend';
import GridBoard from './GridBoard';

import { gracePageConfig } from '../config/config';

class App extends Component {
    constructor(props) {
        super(props);
        this.openModal = this.openModal.bind(this);
        this.state = {
            isModalOpen: false,
            modalTitle: ''
        };
        this.cancelModal = this.cancelModal.bind(this);
    }
    shouldComponentUpdate() {
        return true;
    }
    openModal(record) {
        // 打开弹出框，拉取数据
        this.setState({
            isModalOpen: true,
            modalTitle: record.ProName
        });
        this.props.updateModalTrendDataActionCreator(record);
    }
    cancelModal() {
        this.setState({
            isModalOpen: false,
            modalTitle: ''
        });
    }
    render() {
        const gridBoardConfig = {
            hotProDataSource: this.props.hotProGridData,
            flowProDataSource: this.props.flowProDridData,
            hotProLoadingState: this.props.hotProLoadingState,
            flowProLoadingState: this.props.flowProLoadingState,
            openModal: this.openModal
        };
        const modalConfig = {
            isOpen: this.state.isModalOpen,
            series: this.props.modalTrendData.series,
            categories: this.props.modalTrendData.categories,
            title: this.state.modalTitle,
            onCancel: this.cancelModal,
            loadingState: this.props.modalLoadingState
        };
        return (
            <React.Fragment>
                {/* 大盘走势 */}
                <Trend trendData={this.props.trendData} trendLoadingState={this.props.trendLoadingState} />
                {/* 行业商品top100 */}
                <GridBoard {...gridBoardConfig} />
                {/* 趋势弹出框 */}
                <Modal {...modalConfig} />
            </React.Fragment>
        );
    }
}

App.propTypes = {
    hotProGridData: PropTypes.array.isRequired,
    flowProDridData: PropTypes.array.isRequired,
    modalTrendData: PropTypes.object.isRequired,
    trendData: PropTypes.object.isRequired,
    modalLoadingState: PropTypes.bool.isRequired,
    trendLoadingState: PropTypes.bool.isRequired,
    flowProLoadingState: PropTypes.bool.isRequired,
    hotProLoadingState: PropTypes.bool.isRequired,
    updateModalTrendDataActionCreator: PropTypes.func.isRequired
};

// eslint-disable-next-line
export default GracePageFramework(App, gracePageConfig);
