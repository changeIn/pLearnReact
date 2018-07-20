/**
 * Created by chenhaifeng on 2018/2/26.
 */

import { combineReducers } from 'redux';
import {
    DIMENSION_SET,
    UPDATE_TREND_DATA,
    UPDATE_HOT_PRO_GRID_DATA,
    UPDATE_FLOW_PRO_GRID_DATA,
    UPDATE_TREND_DATA_LOADING_STATE,
    UPDATE_HOTPRO_LOADING_STATE,
    UPDATE_FLOWPRO_LOADING_STATE,
    UPDATE_MODAL_TREND_DATE,
    UPDATE_MODAL_LOADING_STATE
} from '../actions/action.js';

let cmnStore = localStorage.getItem('_PPZH_COMMON_STORE_');// todo 搞清楚这是干什么的
if (cmnStore) {
    cmnStore = JSON.parse(cmnStore);
}
const defaultState = Object.assign({}, {}, cmnStore);

const headerPlugin = (state = defaultState, action) => {
    switch (action.type) {
        case DIMENSION_SET:
            return {
                ...state,
                commonDimension: action.data
            };
        default:
            return state;
    }
};

const Content = (state = {
    trendData: {
        // 存放趋势图的数据
        categories: [],
        series: []
    },
    modalTrendData: {
        // 存放弹出框趋势图的数据
        categories: [],
        series: []
    },
    hotProGridData: [],
    flowProDridData: [],
    trendLoadingState: true,
    hotProLoadingState: true,
    flowProLoadingState: true,
    modalLoadingState: true
}, action) => {
    switch (action.type) {
        case UPDATE_TREND_DATA:
            // 数据取到了， 除了更新数据外，还要更新状态
            return {
                ...state,
                trendData: action.data,
                trendLoadingState: false
            };
        case UPDATE_HOT_PRO_GRID_DATA:
            // 数据取到了， 除了更新数据外，还要更新状态
            return {
                ...state,
                hotProGridData: action.data,
                hotProLoadingState: false
            };
        case UPDATE_FLOW_PRO_GRID_DATA:
            // 数据取到了， 除了更新数据外，还要更新状态
            return {
                ...state,
                flowProDridData: action.data,
                flowProLoadingState: false
            };
        case UPDATE_TREND_DATA_LOADING_STATE:
            return {
                ...state,
                trendLoadingState: action.data
            };
        case UPDATE_HOTPRO_LOADING_STATE:
            return {
                ...state,
                hotProLoadingState: action.data
            };
        case UPDATE_FLOWPRO_LOADING_STATE:
            return {
                ...state,
                flowProLoadingState: action.data
            };
        case UPDATE_MODAL_TREND_DATE:
            // 具备了弹出框趋势图数据，则自动设置modalLoadingState为false
            return {
                ...state,
                modalTrendData: action.data,
                modalLoadingState: false
            };
        case UPDATE_MODAL_LOADING_STATE:
            if (action.data) {
                // 如果当前是重新加载数据，则需要将原先的数据清空
                return {
                    ...state,
                    modalTrendData: {
                        categories: [],
                        series: []
                    },
                    modalLoadingState: action.data
                };
            }
            return {
                ...state,
                modalLoadingState: action.data
            };
        default:
            return state;
    }
};

const rootReducer = combineReducers({ headerPlugin, Content });

export default rootReducer;
