$(function () {



    // 获取微信签名
    $.ajax({
        data: {'url': location.href.split('#')[0]},
        url: Route.baseUrl +"/interface/weChat/sign"
    }).then(initWechat, wechatFail);

    wx.ready(function () {
        // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。

    });
    wx.error(function (res) {
        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        console.log(arguments)
    });
})

function scanQRCode() {
    wx.scanQRCode({
        needResult: 1,
        scanType: ["qrCode", "barCode"],
        success: function (result) {
            checkOutStockNo(result);
        },
        fail: function (res) {
            console.log(res)
        }
    });
}


function initWechat(json) {
    console.log(json);
    // wx.config({
    //     debug : true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    //     appId : _appId, // 必填，公众号的唯一标识
    //     timestamp : _timestamp, // 必填，生成签名的时间戳
    //     nonceStr : _nonceStr, // 必填，生成签名的随机串
    //     signature : _signature,// 必填，签名，见附录1
    //     jsApiList : [ 'onMenuShareTimeline', 'onMenuShareAppMessage',
    //         'onMenuShareQQ', 'onMenuShareWeibo', 'scanQRCode' ]
    //     // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    // });

    wx.config({
        appId: json.appId,
        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage',
            'onMenuShareQQ', 'onMenuShareWeibo', 'scanQRCode'],
        nonceStr: json.nonceStr,
        signature: json.signature,
        timestamp: json.timestamp
    });
}

/**
 * 微信功能注册失败
 */
function wechatFail() {
    console.log(arguments)
}

/**
 * 服务器没有响应
 */
function ajaxFail() {
    console.log(arguments)
}

/**
 * 校验出库单号
 */
function checkOutStockNo(result) {
    var array = result.resultStr.split("/");
    var outstockNo = array[array.length - 1]||"";
    outstockNo=outstockNo.replace(/[\?|&].*/g,"");
    $.ajax({
        data: {
            outstockNo: outstockNo
        },
        url: Route.baseUrl +"/stock/wechatInstock/checkOutStockNo"
    }).then(function (json) {
        initInStock(json, outstockNo);
    }, ajaxFail);
}




/**
 * 初始化入库
 */
function initInStock(json, outstockNo) {
    switch (json.result.resultCode) {
        case 0:
            //读取所有产品信息
            if (common.isSupermarket()) {
                mui.openWindow({
                    url: 'supermarket-instock-edit.html?outstockNo=' + outstockNo,
                    createNew: true,
                    styles: {
                        cachemode:"noCache"
                    }
                });
            } else {
                mui.openWindow({
                    url: 'm-page-1-edit.html?outstockNo=' + outstockNo,
                    createNew: true,
                    styles: {
                        cachemode:"noCache"
                    }
                });
            }
            break;
        case 2:
            mui.alert("无效的出库单号", 'Error', function () {
            });
            break;
        case 1:
            mui.alert("出库单已入库", 'Error', function () {
            });
            break;
    }
}