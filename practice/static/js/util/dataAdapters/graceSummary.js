export default function (summaryData) {
	let newSummaryData = summaryData.slice(0);
	summaryData.forEach(function(summaryItem,summaryIndex){
		!summaryItem.code?summaryItem.code='code'+summaryIndex:summaryItem.code;
		!summaryItem.name?summaryItem.name='未配置指标名称':summaryItem.code;
		if(summaryItem.value === null || summaryItem.value === '_PPZH_NO_AUTH_'){
			summaryItem.value = '--';
		}
		if(summaryItem.trend === null || summaryItem.trend === '_PPZH_NO_AUTH_'){
			summaryItem.trend = '--';
		}
		summaryItem.detail.forEach(function(detailItem,detailIndex){
			if(detailItem.value === null || detailItem.value === '_PPZH_NO_AUTH_'){
				detailItem.value = '--';
			}
		});
	});

	return newSummaryData;
}

/*
使用示例
	<GraceSummary summaryData={summaryData}
					onChange={this.consoleValue}
					checkboxRange={4}
					clickType={'checkbox'}
					initValue={['aaa']}
					maxLineItemCount={4}> </GraceSummary>

数据参数格式说明：
    summaryData : [                        //summary数据结构
        {
			code:'OrdAmt',
			name:'交易金额',
			format:'currency_￥',
			value:0.4131,
			trend:0.2,
            detail:[
				{name:'较前一天',value:5.5,format:'percent_2_0_1'},
				{name:'较前一周',value:1.5,format:'percent_2_0_1'}
            ]
        },
        {
			code:'OrdNum',
			name:'下单单量',
			format:'number_0',
			value:13452,
			trend:-0.2,
            detail:[
				{name:'较前一天',value:5.5,format:'percent_2_0_1'},
				{name:'较前一周',value:1.5,format:'percent_2_0_1'}
            ]
        },
        {
			code:'OrdCustNum',
			name:'下单客户数',
			format:'number_0',
			value:34542,
			trend:0.12,
            detail:[
				{name:'较前一天',value:5.5,format:'percent_2_0_1'},
				{name:'较前一周',value:1.5,format:'percent_2_0_1'}
            ]
        },
		{
			code:'OrdProNum',
			name:'下单商品件数',
			format:'number_0',
			value:12342,
			trend:0.12,
            detail:[
				{name:'较前一天',value:5.5,format:'percent_2_0_1'},
				{name:'较前一周',value:1.5,format:'percent_2_0_1'}
            ]
		}
	]
*/