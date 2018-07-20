

var timestampObj = {};

const hasSW = ()=>{
    return 'serviceWorker' in navigator &&
      // This is how I block Chrome 40 and detect Chrome 41, because first has
      // bugs with history.pustState and/or hashchange
      (window.fetch || 'imageRendering' in document.documentElement.style) &&
      (window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname.indexOf('127.') === 0)
}
//

// 防止页面img加载时间晚于ajax请求、ajax请求发送tp干扰页面原始img下载导致onload触发推迟，故tp都在onload之后发送
var executor;
if (window.$frontend_monitor && window.$frontend_monitor.executeAfterLoad) {
    executor = window.$frontend_monitor.executeAfterLoad(5000);
}

const handleAjaxComplete = (e, xhr, options)=>{
    try{
        let url = xhr.responseURL;
        let urlObj = url.split('?');
        //记录ajax请求时间
        if(!timestampObj[url])return;
        var tmpTimestamp = Date.now() - timestampObj[url];
        delete timestampObj[url];
        if (tmpTimestamp > 0 && window.$frontend_monitor && window.$frontend_monitor.ajaxSpendTime) {
            var params = {
                spend_time: tmpTimestamp,
                ajax_href: urlObj[0],
                ajax_params: urlObj[1] || ''
            };
            executor ? executor(window.$frontend_monitor.ajaxSpendTime, params) : window.$frontend_monitor.ajaxSpendTime(params);
        }
        //console.log(url+'请求完成了，用了'+tmpTimestamp+'毫秒');

        //上报ajax错误
        var errDetail = '';
        var isErr = false;
        if(xhr.status >= 400){
            errDetail = 'response server status[' +xhr.status + '] message:' + (xhr.statusText || '');
            isErr = true;
        }
        else{
            let responseObj = JSON.parse(xhr.responseText);
            let dataStatus = responseObj['status'];
            let dataMessage = responseObj['message'];
            if(dataStatus != 0){
                 //如果是退出，则先清空离线缓存，避免没有向后台请求urser/system 导致的未跳转到登陆页的问题
                if( dataStatus == 302 && hasSW() ){
                    navigator.serviceWorker.getRegistration().then((registration)=>{
                        if(registration){
                            registration.unregister().then(()=>{
                                window.location.reload();
                            })
                        }else{
                            window.location.reload();
                        }
                        
                    });
                    
                }
                //接口数据status返回302表示鉴权需要重定向
                else if(dataStatus == 302)
                {
                    window.location.reload();
                }
                else{
                    errDetail = 'response data status[' +dataStatus + '] message:' + (dataMessage || '')
                    isErr = true;
                }
            }
        }
        if(isErr){
            $frontend_monitor&&$frontend_monitor.ajaxErr({
                url:urlObj[0],
                params:urlObj[1] || '',
                detail:errDetail
            });
        }
    }
    catch (e) {
    }
}
$(document).on('ajaxBeforeSend', function(e, xhr, options){
    //console.log(e);
    //console.log(xhr);
    //console.log(options);
    if(!timestampObj[window.location.origin+options.url]){
        timestampObj[window.location.origin+options.url] = Date.now();
    }
});
$(document).on('ajaxSuccess', function(e, xhr, options){
    handleAjaxComplete(e, xhr, options);
});
//因为ajaxcomplete事件是在业务回调执行之后再执行，会出现302出错的问题
$(document).on('ajaxError', function(e, xhr, options){
    handleAjaxComplete(e, xhr, options);
});

