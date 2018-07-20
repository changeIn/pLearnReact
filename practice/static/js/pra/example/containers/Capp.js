/**
 * Created by chenhaifeng on 2018/2/26.
 */
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import App from '../components/App';
import {
    curDimensionChangeHandler,
    updateModalTrendDataActionCreator
} from '../actions/action.js';

// 自动监听 state -> pros
const mapStateToProps = state => ({
    commonDimension: state.headerPlugin.commonDimension,
    trendData: state.Content.trendData,
    hotProGridData: state.Content.hotProGridData,
    flowProDridData: state.Content.flowProDridData,
    modalTrendData: state.Content.modalTrendData,
    trendLoadingState: state.Content.trendLoadingState,
    hotProLoadingState: state.Content.hotProLoadingState,
    flowProLoadingState: state.Content.flowProLoadingState,
    modalLoadingState: state.Content.modalLoadingState
});

// dispatch->props
const mapDispatchToProps = dispatch => ({
    dispatch,
    curDimensionChangeHandler,
    ...bindActionCreators({
        updateModalTrendDataActionCreator
    }, dispatch)
});

const Capp = connect(mapStateToProps, mapDispatchToProps)(App);

export default Capp;
