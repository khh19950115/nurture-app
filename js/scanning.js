var _barcode = null,
    _flash = !1,
    $bcid = document.getElementById("bcid");
mui.plusReady(function() {
	mui.init();
	setTimeout(function () {
	    if (!_barcode) {
	        _barcode = new plus.barcode.Barcode('bcid', [plus.barcode.QR], {
	            frameColor: '#00FF00',
	            scanbarColor: '#00FF00'
	        });
	        _barcode.onmarked = function (type, result) {
	            checkOutStockNo(result);
	            //scanQRCode();
	        };
	    }
	    scanQRCode();
	}, 300);
	var height = window.innerHeight ; //获取页面实际高度  
	var width = window.innerWidth + 'px';
	$bcid.style.height = height-(1.8 + 'rem');
	$bcid.style.width = width;
});
document.getElementById('topRight').addEventListener('tap', function () {
    plus.gallery.pick(function (path) {
        plus.barcode.scan(path, function (type, result) {
            checkOutStockNo(result.replace(/"/g, ''));
        }, function (error) {
            // mui.alert(error.message);
        });
    }, function (error) {
        // mui.alert(error.message);
    }, [plus.barcode.QR]);
});

document.getElementById('flash').addEventListener('tap', function () {
    _flash = !_flash;
    _barcode.setFlash(_flash);
});

function scanQRCode() {
    // _barcode.start();
    _barcode.start({sound:'none',vibrate: 'false'});
}

/**
 * 校验出库单号
 */
function checkOutStockNo(result) {
    var array = result.split('/');
    var outstockNo = array[array.length - 1]||"";
    outstockNo=outstockNo.replace(/[\?|&].*/g,"");
    $.ajax({
        data: {
            outstockNo: outstockNo
        },
        url: Route.baseUrl + '/stock/wechatInstock/checkOutStockNo'
    }).then(function (json) {
        initInStock(json, outstockNo);
    }, ajaxFail);
}

/**
 * 初始化入库
 */
function initInStock(json, outstockNo) {
    var url;
    switch (json.result.resultCode) {
        case 0:
            //读取所有产品信息
            if (common.isSupermarket()) {
                url='supermarket-instock-edit.html?outstockNo=' + outstockNo;
            } else {
                url='m-page-1-edit.html?outstockNo=' + outstockNo;
            }
            break;
        case 2:
            url= 'index.html?type=invalid';
            break;
        case 1:
            url= 'index.html?type=exist';
            break;
    }
    _barcode.close();
    window.location.href = url;

//            if(url){
//                mui.openWindow({
//                    url: url,
//                    createNew: true,
//                    styles: {
//                        cachemode:"noCache"
//                    }
//                });
//            }
//            try {
//                _barcode.stop();
//                window.close();
//            }catch (e) {
//            }
}

/**
 * 服务器没有响应
 */
function ajaxFail(json) {
    mui.alert(JSON.stringify(json));
}