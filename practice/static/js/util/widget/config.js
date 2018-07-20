export default {
	url:{
		global:{
			//通过sku拿取店铺类目经营类型等信息
			skuGetBaseData:"/brand/common/skuGetBaseData.ajax",
            globalInfo:"/brand/common/newGetGlobalInfo.ajax",
            getBrandAndCategoryNew:"/brand/common/getBrandAndCategoryNew.ajax",
            searchSku:"/brand/common/common/searchSku.ajax",
			getPriceRangeByCategory: "/brand/common/getPriceRangeByCategoryId.ajax"
		},
		dealAnalysis:{
			getDealSummayData:"/brand/dealAnalysis/dealSummary/getDealSummayData.ajax",
			getVenderDealSummayData:"/brand/dealAnalysis/dealSummary/getVenderDealSummayData.ajax",
			getDealTrendData:"/brand/dealAnalysis/dealSummary/getDealTrendData.ajax",
			getShopRankData:'/brand/dealAnalysis/shopRank/getShopRankData.ajax',
			getDealDetailData:'/brand/dealAnalysis/dealDetail/getDealDetailData.ajax',
			getBrandConstituteData:"/brand/dealAnalysis/dealConstitute/getBrandConstituteData.ajax",
			getCategoryConstituteData:'/brand/dealAnalysis/dealConstitute/getCategoryConstituteData.ajax',
			getCategoryTrendData:'/brand/dealAnalysis/dealConstitute/getCategoryTrendData.ajax',
			getSaleConstituteData:'/brand/dealAnalysis/dealConstitute/getSaleConstituteData.ajax',
			getSaleTrendData:'/brand/dealAnalysis/dealConstitute/getSaleTrendData.ajax',
			getPriceZoneConstituteData:'/brand/dealAnalysis/dealConstitute/getPriceZoneConstituteData.ajax',
			getPriceZoneTrendData:'/brand/dealAnalysis/dealConstitute/getPriceZoneTrendData.ajax',

			getChannelConstituteData:'/brand/dealAnalysis/dealConstitute/getChannelConstituteData.ajax',
			getChannelTrendData:'/brand/dealAnalysis/dealConstitute/getChannelTrendData.ajax',
			getPayConstituteData:'/brand/dealAnalysis/dealConstitute/getPayConstituteData.ajax',
			getPayTrendData:'/brand/dealAnalysis/dealConstitute/getPayTrendData.ajax'
		},
		viewFlow:{
			//流量概况
			getFlowSummaryTrendData:"/brand/viewFlow/viewSummary/getFlowSummaryTrendData.ajax",
			getFlowColumnData:"/brand/viewFlow/viewSummary/getFlowColumnData.ajax",
			getSecondFlowData:"/brand/viewFlow/viewSummary/getSecondFlowData.ajax",
			getActivityData:"/brand/viewFlow/viewSummary/getActivityData.ajax",
			getKeyWordData:"/brand/viewFlow/viewSummary/getKeyWordData.ajax",
			getProvinceData:"/brand/viewFlow/viewSummary/getProvinceData.ajax",
			getChannelData:"/brand/viewFlow/viewSummary/getChannelData.ajax	",
            //引流渠道分析
            getViewSourceGridData:"/brand/viewFlow/viewSource/getViewSourceGridData.ajax",
            getViewSourceTrendData:"/brand/viewFlow/viewSource/getViewSourceTrendData.ajax",
            getViewSourceGridSecondLevelData: "/brand/viewFlow/viewSource/getViewSourceGridSecondLevelData.ajax",
			//引流渠道分析-店铺
			getShopGridData:"/brand/viewFlow/viewSource/getShopGridData.ajax",
			getShopTrendData:"/brand/viewFlow/viewSource/getShopTrendData.ajax",
			//引流渠道分析-活动
			getActivityGridData:"/brand/viewFlow/viewSource/getActivityGridData.ajax",
			getActivityTrendData:"/brand/viewFlow/viewSource/getActivityTrendData.ajax",
			//引流渠道分析-内容营销
			getContentGridData:"/brand/viewFlow/viewSource/getContentGridData.ajax",
			getContentTrendData:"/brand/viewFlow/viewSource/getContentTrendData.ajax",
			//引流渠道分析-频道
			getChannelGridData:"/brand/viewFlow/viewSource/getChannelGridData.ajax",
			getChannelTrendData:"/brand/viewFlow/viewSource/getChannelTrendData.ajax",
			//引流渠道分析-商品
			getProductGridData:"/brand/viewFlow/viewSource/getProductGridData.ajax",
			getProductTrendData:"/brand/viewFlow/viewSource/getProductTrendData.ajax",
			//引流渠道分析-搜索
			getSearchGridData:"/brand/viewFlow/viewSource/getSearchGridData.ajax",
			getSearchTrendData:"/brand/viewFlow/viewSource/getSearchTrendData.ajax",

		},
		user:{
			getAnnouncement:"/user/getAnnouncement.ajax",
			getUserOrderRecord:"/user/getUserOrderRecord.ajax",
			getSystemInfo:"	/user/getSystemInfo.ajax",
			checkNewMessage:'/user/checkNewMessage.ajax',
			getSystemMessageData:'/user/getSystemMessageData.ajax',
            getAuthList: '/user/getAuthList.ajax',
			getShopInfo:'/user/getShopInfo.ajax',
			getCurContext:'/user/getCurContext.ajax'

		},

		admin:{
			executeSqlQuery:"/brand/sqlExecutor/executeQuery.ajax",
			executeSqlUpdate:"/brand/sqlExecutor/executeUpdate.ajax"
		}
	}
}