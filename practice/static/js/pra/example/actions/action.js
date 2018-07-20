/**
 * Created by chenhaifeng on 2018/2/26.
 */
import { url } from '../config/config.js';

export const DIMENSION_SET = 'DIMENSION_SET';// 顶部公共组件选项发生变化
export const UPDATE_TREND_DATA = 'UPDATE_TREND_DATA';// 更新趋势图数据
export const UPDATE_HOT_PRO_GRID_DATA = 'UPDATE_HOT_PRO_GRID_DATA';// 更新热销商品排行榜数据
export const UPDATE_FLOW_PRO_GRID_DATA = 'UPDATE_FLOW_PRO_GRID_DATA';// 更新流量商品排行榜数据
export const UPDATE_TREND_DATA_LOADING_STATE = 'UPDATE_TREND_DATA_LOADING_STATE';// 更新趋势图的加载状态
export const UPDATE_HOTPRO_LOADING_STATE = 'UPDATE_HOTPRO_LOADING_STATE';// 更新热销商品加载状态
export const UPDATE_FLOWPRO_LOADING_STATE = 'UPDATE_FLOWPRO_LOADING_STATE';// 更新流量商品加载状态
export const UPDATE_MODAL_TREND_DATE = 'UPDATE_MODAL_TREND_DATE';// 更新弹出框趋势图数据
export const UPDATE_MODAL_LOADING_STATE = 'UPDATE_MODAL_LOADING_STATE';// 更新弹出框加载状态


const setTrendDateActionCreator = data => ({
    type: UPDATE_TREND_DATA,
    data
});

const setHotProGridDateActionCreator = data => ({
    type: UPDATE_HOT_PRO_GRID_DATA,
    data
});

const setFlowProGridDateActionCreator = data => ({
    type: UPDATE_FLOW_PRO_GRID_DATA,
    data
});

const setModalTrendDataActionCreator = data => ({
    type: UPDATE_MODAL_TREND_DATE,
    data
});

const updateTrendLoadingStateActionCreator = data => ({
    type: UPDATE_TREND_DATA_LOADING_STATE,
    data
});

const updateHotProLoadingStateActionCreator = data => ({
    type: UPDATE_HOTPRO_LOADING_STATE,
    data
});

const updateFlowProLoadingStateActionCreator = data => ({
    type: UPDATE_FLOWPRO_LOADING_STATE,
    data
});

const updateModalLoadingStateActionCreator = data => ({
    type: UPDATE_MODAL_LOADING_STATE,
    data
});

// 将顶部公共组件数据保存到store中
export const updateModalTrendDataActionCreator = data => (dispatch, getState) => {
    dispatch(updateModalLoadingStateActionCreator(true));
    const param = {
        ...getState().headerPlugin.commonDimension,
        skuId: data.SkuId,
        proName: data.ProName
    };
    $.ajax({
        url: url.getIndustryModalTrendData,
        data: param,
        success: res => {
            let result;
            if (!res.status && res.content
                && res.content.categories
                && res.content.categories.length
                && res.content.series
                && res.content.series.length) {
                // 数据合格
                result = res.content;
            } else {
                result = {
                    categories: [],
                    series: []
                };
            }
            // 将热销商品数据更新到store
            dispatch(setModalTrendDataActionCreator(result));
        }
    });
};

// 将顶部公共组件数据保存到store中
export const setDimensionAction = data => ({
    type: DIMENSION_SET,
    data
});

// 获取趋势图数据
function getTrendData(dispatch, getState) {
    dispatch(updateTrendLoadingStateActionCreator(true));
    const param = {
        ...getState().headerPlugin.commonDimension
    };
    $.ajax({
        url: url.getIndustryTrendData,
        data: param,
        success: res => {
            let data;
            if (!res.status && res.content
                && res.content.categories
                && res.content.categories.length
                && res.content.series
                && res.content.series.length) {
                // 数据合格
                data = res.content;
            } else {
                data = {
                    categories: [],
                    series: []
                };
            }
            // 将趋势图数据更新到store中
            dispatch(setTrendDateActionCreator(data));
        }
    });
}

function getIndustryHotProGridData(dispatch, getState) {
    dispatch(updateHotProLoadingStateActionCreator(true));
    const param = {
        ...getState().headerPlugin.commonDimension
    };
    $.ajax({
        url: url.getIndustryHotProGridData,
        data: param,
        success: res => {
            let data;
            if (!res.status && res.content && res.content.data && res.content.data.length) {
                data = res.content.data;
                data.forEach((item, i) => {
                    item.key = i;
                });
            } else {
                data = [];
            }
            // 将热销商品数据更新到store
            dispatch(setHotProGridDateActionCreator(data));
        }
    });
}

function getIndustryFlowProGridData(dispatch, getState) {
    dispatch(updateFlowProLoadingStateActionCreator(true));
    const param = {
        ...getState().headerPlugin.commonDimension
    };
    $.ajax({
        url: url.getIndustryFlowProGridData,
        data: param,
        success: res => {
            let data;
            if (!res.status && res.content && res.content.data && res.content.data.length) {
                data = res.content.data;
                data.forEach((item, i) => {
                    item.key = i;
                });
            } else {
                data = [];
            }
            // 将流量商品数据更新到store
            dispatch(setFlowProGridDateActionCreator(data));
        }
    });
}

// 顶部公共组件选项变动的回调
export const curDimensionChangeHandler = (preDimension, nextDimension) => dispatch => {
    dispatch(setDimensionAction(nextDimension));// 将顶部组件的数据更新到store
    dispatch(getTrendData);
    dispatch(getIndustryHotProGridData);
    dispatch(getIndustryFlowProGridData);
};
