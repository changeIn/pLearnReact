import React from 'react';
import Util from 'widget/all';

import imgHolder from '../../../../img/pro-holder.jpg';// 表格图片托底图

export const url = {
    getIndustryTrendData: '/brand/industry/industryTrend/getIndustryTrendData.ajax',
    getIndustryHotProGridData: '/brand/industry/industryTrend/getIndustryHotProGridData.ajax',
    getIndustryFlowProGridData: '/brand/industry/industryTrend/getIndustryFlowProGridData.ajax',
    getIndustryModalTrendData: '/brand/industry/industryTrend/getIndustryModalTrendData.ajax'
};

export const columnsConfig = {
    // 热销商品榜列配置
    HotPro: [
        {
            title: '排名',
            dataIndex: 'Rank',
            key: 'Rank',
            render: text => <div className={`rank-${text}`}>{Util.indicatorRightControl(text, 'number_0')}</div>,
            className: 'textCenter Rank'
        }, {
            title: '商品名称',
            dataIndex: 'ProName',
            key: 'ProName',
            render: (text, obj) => {
                const backImgStyle = {
                    background: `url(${obj.ProImgUrl || imgHolder}) center center`,
                    backgroundSize: 'cover'
                };
                return (
                    <React.Fragment>
                        <div className='img' style={{ ...backImgStyle }}></div>
                        <div className='txt'>
                            <div title={obj.ProName}>
                                <a href={`https://item.jd.com/${obj.SkuId}.html `} target='_blank'>{obj.ProName}</a>
                            </div>
                            <div title={obj.SkuId}>{`SKU:${obj.SkuId}`}</div>
                        </div>
                    </React.Fragment>
                );
            },
            className: 'ProName'
        }, {
            title: '所属品牌',
            dataIndex: 'BrandName',
            key: 'BrandName',
            render: text => <span title={text}>{text}</span>,
            className: 'textCenter BrandName'
        }, {
            title: '成交商品件数',
            dataIndex: 'DealProNum',
            key: 'DealProNum',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.DealProNum - b.DealProNum,
            render: text => <span>{Util.indicatorRightControl(text, 'number_0')}</span>,
            className: 'textCenter DealProNum'
        }, {
            title: '成交金额指数',
            dataIndex: 'DealAmtIndex',
            key: 'DealAmtIndex',
            sorter: (a, b) => a.DealAmtIndex - b.DealAmtIndex,
            render: text => <span>{Util.indicatorRightControl(text, 'number_0')}</span>,
            className: 'textCenter DealAmtIndex'
        }, {
            title: '加购人数',
            dataIndex: 'ToCartUser',
            key: 'ToCartUser',
            sorter: (a, b) => a.ToCartUser - b.ToCartUser,
            render: text => <span>{Util.indicatorRightControl(text, 'number_0')}</span>,
            className: 'textCenter ToCartUser'
        }, {
            title: '关注人数',
            dataIndex: 'CollectNum',
            key: 'CollectNum',
            sorter: (a, b) => a.CollectNum - b.CollectNum,
            render: text => <span>{Util.indicatorRightControl(text, 'number_0')}</span>,
            className: 'textCenter CollectNum'
        }, {
            title: '访客指数',
            dataIndex: 'UVIndex',
            key: 'UVIndex',
            sorter: (a, b) => a.UVIndex - b.UVIndex,
            render: text => <span>{Util.indicatorRightControl(text, 'number_0')}</span>,
            className: 'textCenter UVIndex'
        }, {
            title: '较上期排名变化',
            dataIndex: 'RankChange',
            key: 'RankChange',
            render: text => {
                if (text === 0) {
                    // 持平
                    return <span><span className='chain-tag no-change'>持平</span></span>;
                } else if (text === 9999) {
                    // 新入榜
                    return <span><span className='chain-tag new-enter'>新入榜</span></span>;
                }
                return <span>{Util.generateRankChain(text)}</span>;
            },
            className: 'textCenter RankChange'
        }, {
            title: '操作',
            dataIndex: 'Process',
            key: 'Process',
            render: () => <span>趋势</span>,
            className: 'textCenter Process'
        }
    ],
    // 流量商品榜单配置
    FlowPro: [
        {
            title: '排名',
            dataIndex: 'Rank',
            key: 'Rank',
            render: text => <div className={`rank-${text}`}>{Util.indicatorRightControl(text, 'number_0')}</div>,
            className: 'textCenter Rank'
        }, {
            title: '商品名称',
            dataIndex: 'ProName',
            key: 'ProName',
            render: (text, obj) => {
                const backImgStyle = {
                    background: `url(${obj.ProImgUrl || imgHolder}) center center`,
                    backgroundSize: 'cover'
                };
                return (
                    <React.Fragment>
                        <div className='img' style={{ ...backImgStyle }}></div>
                        <div className='txt'>
                            <div title={obj.ProName}>
                                <a href={`https://item.jd.com/${obj.SkuId}.html `} target='_blank'>{obj.ProName}</a>
                            </div>
                            <div>{`SKU:${obj.SkuId}`}</div>
                        </div>
                    </React.Fragment>
                );
            },
            className: 'ProName'
        }, {
            title: '所属品牌',
            dataIndex: 'BrandName',
            key: 'BrandName',
            render: text => <span>{text}</span>,
            className: 'textCenter BrandName'
        }, {
            title: '访客指数',
            dataIndex: 'UVIndex',
            key: 'UVIndex',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.UVIndex - b.UVIndex,
            render: text => <span>{Util.indicatorRightControl(text, 'number_0')}</span>,
            className: 'textCenter UVIndex'
        }, {
            title: '搜索点击人数',
            dataIndex: 'SearchClickNum',
            key: 'SearchClickNum',
            sorter: (a, b) => a.SearchClickNum - b.SearchClickNum,
            render: text => <span>{Util.indicatorRightControl(text, 'number_0')}</span>,
            className: 'textCenter SearchClickNum'
        }, {
            title: '加购人数',
            dataIndex: 'ToCartUser',
            key: 'ToCartUser',
            sorter: (a, b) => a.ToCartUser - b.ToCartUser,
            render: text => <span>{Util.indicatorRightControl(text, 'number_0')}</span>,
            className: 'textCenter ToCartUser'
        }, {
            title: '关注人数',
            dataIndex: 'CollectNum',
            key: 'CollectNum',
            sorter: (a, b) => a.CollectNum - b.CollectNum,
            render: text => <span>{Util.indicatorRightControl(text, 'number_0')}</span>,
            className: 'textCenter CollectNum'
        }, {
            title: '成交金额指数',
            dataIndex: 'DealAmtIndex',
            key: 'DealAmtIndex',
            sorter: (a, b) => a.DealAmtIndex - b.DealAmtIndex,
            render: text => <span>{Util.indicatorRightControl(text, 'number_0')}</span>,
            className: 'textCenter DealAmtIndex'
        }, {
            title: '较上期排名变化',
            dataIndex: 'RankChange',
            key: 'RankChange',
            render: text => {
                if (text === 0) {
                    // 持平
                    return <span><span className='chain-tag no-change'>持平</span></span>;
                } else if (text === 9999) {
                    // 新入榜
                    return <span><span className='chain-tag new-enter'>新入榜</span></span>;
                }
                return <span>{Util.generateRankChain(text)}</span>;
            },
            className: 'textCenter RankChange'
        }, {
            title: '操作',
            dataIndex: 'Process',
            key: 'Process',
            render: () => <span>趋势</span>,
            className: 'textCenter Process'
        }
    ]
};

export const checkBoxConfig = {
    list: [
        {
            value: 'PV',
            text: '浏览量'
        },
        {
            value: 'UVIndex',
            text: '访客指数'
        },
        {
            value: 'SearchNum',
            text: '搜索次数'
        },
        {
            value: 'SearchClickNum',
            text: '搜索点击次数'
        },
        {
            value: 'SearchClickRate',
            text: '搜索点击率'
        },
        {
            value: 'ToCartUser',
            text: '加购人数'
        },
        {
            value: 'CollectNum',
            text: '关注人数'
        },
        {
            value: 'DealProNum',
            text: '成交商品件数'
        },
        {
            value: 'DealAmtIndex',
            text: '成交金额指数'
        },
        {
            value: 'DealPriceAvg',
            text: '成交客单价'
        },
        {
            value: 'DealRate',
            text: '成交转化率'
        },
        {
            value: 'VisitedProNum',
            text: '被访问商品数'
        },
        {
            value: 'BrandNum',
            text: '品牌数'
        },
        {
            value: 'VisitedBrandNum',
            text: '被访问品牌数'
        },
        {
            value: 'SaleBrandNum',
            text: '动销品牌数'
        }
    ],
    initValue: ['PV', 'DealProNum']
};

export const modalCheckBoxConfig = {
    list: [
        {
            value: 'UVIndex',
            text: '访客指数'
        },
        {
            value: 'ToCartUser',
            text: '加购人数'
        },
        {
            value: 'CollectNum',
            text: '关注人数'
        },
        {
            value: 'DealProNum',
            text: '成交商品件数'
        },
        {
            value: 'DealAmtIndex',
            text: '成交金额指数'
        }
    ],
    initValue: ['DealProNum']
};

export const gracePageConfig = {
    pageName: '行业趋势',
    pageClassName: 'industry-trend-page',
    plugin: [{
        id: 'GraceSiftSwitch', // 需要用的组件名称
        float: 'fl', // fr
        className: '', // 可以给组件的外层包裹一个class，这样如果需要改样式，可以通过class来改
        config: {
            componentName: 'GraceSiftSwitchComponent',
            componentConfig: [{
                name: '商品筛选',
                code: 'siftSwitch',
                list: [{
                    name: '类目',
                    hasAll: false, // true代表有全部的这个选项，默认为true
                    code: 'category',
                    onlySelectChild: true, // 只能选择最后一级节点,
                    selectedArr(data) {
                        if (!data || JSON.stringify(data) === '{}') return [];
                        const maxId = data.maxCategoryIdByDealAmt;
                        let result = [];

                        for (let i = 0; data.category && i < data.category.length; i++) {
                            for (let j = 0; data.category[i].children && j < data.category[i].children.length; j++) {
                                for (let m = 0; data.category[i].children[j].children && m < data.category[i].children[j].children.length; m++) {
                                    if (data.category[i].children[j].children[m].id === +maxId) {
                                        result = [i, j, m];
                                        break;
                                    }
                                }
                            }
                        }

                        return result;
                    },
                    vendorHide: false // 当时供应商的时候，自动隐藏， 默认为false
                }, {
                    name: '经营模式',
                    code: 'shopType',
                    hasAll: true, // true代表有全部的这个选项，默认为true
                    vendorHide: false // 默认为false,表示是供应商的时候，不会自动隐藏
                }, {
                    name: '价格带',
                    code: 'priceRange',
                    hasAll: false,
                    vendorHide: false
                }]
            }]
        } // 可以不写，没有的话，就走默认
    }, {
        id: 'channelDropDown',
        float: 'fr',
        className: '',
        config: '' // 可以不写，没有的话，就走默认
    }, {
        id: 'GracePackDatePicker', // 需要用的组件名称
        float: 'fr',
        className: 'datepicker-clse',
        config: {
            items: [
                { name: '近30天', code: '30', isInit: true },
                { name: '按月查询', code: 'month' }
            ],
            minDate: '2018-04-01',
            pushDataTaskTime: 8
        }
    }]
};
