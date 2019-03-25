var ajaxLock = false;
//所有权限
var ALL_PERMISSIONS = new Array('.top-1', '.top-2', '.top-3', '.top-4', '.one-1', '.one-2', '.one-3', '.one-4', '.second-0', '.second-1', '.second-2', '.second-3', '.second-4');


//A版权限
var A_PERMISSIONS = new Array('.top-1', '.top-2', '.top-3', '.top-4', '.one-1', '.one-2', '.one-3', '.one-4', '.second-0', '.second-2', '.second-3', '.second-4');
//A权限 + 去除出库相关权限
var A_NO_OUTSTOCK_PERMISSIONS = new Array('.top-1', '.top-2', '.top-4', '.one-1', '.one-3', '.one-4', '.second-0', '.second-2', '.second-4');
//A+B版权限
var A_AND_B_PERMISSIONS = new Array('.top-1', '.top-2', '.top-3', '.top-4', '.one-1', '.one-2', '.one-3', '.one-4', '.second-1', '.second-2', '.second-3', '.second-4');
//A+B版权限 + 去除出库相关权限
var A_AND_B_NO_OUTSTOCK_PERMISSIONS = new Array('.top-1', '.top-2', '.top-4', '.one-1', '.one-3', '.one-4', '.second-1', '.second-2', '.second-4');

//极速农贸、批发(经营户)权限
var JYH_PERMISSIONS = new Array('.top-1', '.top-2', '.top-3', '.top-4', '.one-1', '.one-2', '.one-3', '.one-4', '.second-0');
//农贸商户(经营户)权限
var NMJYH_NO_OUTSTOCK_PERMISSIONS = new Array('.top-1', '.top-2', '.top-4', '.one-1', '.one-3', '.one-4', '.second-0');

//极速
var QUICKTRACE_PERMISSIONS = A_PERMISSIONS;
//超市
var SUPERMARKET_PERMISSIONS = A_NO_OUTSTOCK_PERMISSIONS;
//配送
var DISTRIBUTION_PERMISSIONS = A_PERMISSIONS;
//极速农贸
var QUICKTRACENM_PERMISSIONS = A_AND_B_PERMISSIONS;
//批发市场
var WHOLESALEMARKET_PERMISSIONS = A_AND_B_PERMISSIONS;
//农贸市场
var FARMERSMARKET_PERMISSIONS = A_AND_B_NO_OUTSTOCK_PERMISSIONS;

(function (mui, $) {


    //实现ios平台原生侧滑关闭页面；
    if (mui.os.plus && mui.os.ios) {
        mui.plusReady(function () { //5+ iOS暂时无法屏蔽popGesture时传递touch事件，故该demo直接屏蔽popGesture功能
            plus.webview.currentWebview().setStyle({
                'popGesture': 'none'
            });
        });
    }

    /*if(mui.os.plus && mui.os.android){
        //拦截安卓回退按钮
        history.pushState(null, null, location.href);
        window.addEventListener('popstate', function(event) {
            history.pushState(null, null, location.href );
            //此处加入回退时你要执行的代码
        });
    }*/

    var type = UrlParam.getParam('type');
    if(type=="invalid"){
        mui.alert("无效的出库单号", 'Error');
    }else if(type=="exist"){
        mui.toast("出库单已入库!");
    }

    /*if (sessionStorage.getItem("k_skip") == null) {
        $("#startup").show();
        var index = 3,
            skip = $("#skip span:first-of-type");
        var time = setInterval(function () {
            index--;
            skip.text(index);
            if (index == 0) {
                clearInterval(time);
                $("#startup").hide();
                $("#header").show();
                sessionStorage.k_skip = 0;
            }
        }, 1000);
    } else {
        $("#startup").hide();
        $("#header").show();
    }*/

    /*mui(document).on('tap', '#skip', function() {
        clearInterval(time);
        $("#startup").hide();
        $("#header").show();
        sessionStorage.k_skip = 0;
    });*/

    //个人信息
    mui(document).on('tap', '#userInfo', function() {
        if($('.user-alert').hasClass('mui-hidden')){
            $('.user-alert').removeClass('mui-hidden');
        }else{
            $('.user-alert').addClass('mui-hidden');
        }
    });
    //修改登录密码
    mui(document).on('tap', '#changePassword', function() {
        mui.openWindow({
            url: 'global_modifypwd.html',
            createNew: true,
            styles: {
                cachemode:"noCache"
            }
        });
    });
    //退出登录
    mui(document).on('tap', '#userLogout', function() {
        $('.user-alert').addClass('mui-hidden');
        $('#logoutIf').attr('src','/logout');
        mui.confirm('确认需要登出系统吗？', '登出确认', CONFIRM_BTN_LIST, function(e) {
            if (e.index == CONFIRM_BTN_YES) {
                logout();
            } else {
                setTimeout(function() {
                    $.swipeoutClose(li);
                }, 500);
            }
        });
    });

    //扫码入场
    mui(document).on('tap', '#sweepYards', function () {
        if(mui.os.plus){
            mui.openWindow({
                url: 'sweep-yards.html?source=index',
                createNew: true,
                styles: {
                    cachemode:"noCache"
                }
            });
        }else{
            scanQRCode();
        }
    });

    //入场登记
    mui(document).on('tap', '#admissionRegistration', function () {
        if (common.isSupermarket()) {
            mui.openWindow({
                url: 'supermarket-instock-edit.html?source=index#admissionRegistration',
                createNew: true,
                styles: {
                    cachemode:"noCache"
                }
            });
        } else {
            mui.openWindow({
                url: 'm-page-1-edit.html?source=index#admissionRegistration',
                createNew: true,
                styles: {
                    cachemode:"noCache"
                }
            });
        }

    });

    //交易登记编辑页面
    $(document).on('tap', '#transactionRegistration', function () {
        if (common.isSupermarket()) {
            mui.openWindow({
                url: 'supermarket-outstock-edit.html?source=index#admissionRegistration',
                createNew: true,
                styles: {
                    cachemode:"noCache"
                }
            });
        } else {
        mui.openWindow({
            url: 'm-page-2-edit.html?source=index',
            createNew: true,
            styles: {
                cachemode:"noCache"
            }
        });
    }
    });

    //检测登记
    $(document).on('tap', '#detectionRegistration', function () {
        if(common.isSupermarket()){
            mui.openWindow({
                url: 'supermarket-detection-edit.html?source=index',
                createNew: true,
                styles: {
                    cachemode:"noCache"
                }
            });
        }else{
            mui.openWindow({
                url: 'm-page-3-edit.html?source=index',
                createNew: true,
                styles: {
                    cachemode:"noCache"
                }
            });
        }
    });

    //入场管理
    mui('body').on('tap', '.one-1', function () {
        if(common.isSupermarket()){
            mui.openWindow({
                url: 'supermarket-instock.html',
                createNew: true,
                styles: {
                    cachemode:"noCache"
                }
            });
        }else{
            mui.openWindow({
                url: 'm-page-1.html',
                createNew: true,
                styles: {
                    cachemode:"noCache"
                }
            });
        }
    });
    //交易管理
    mui('body').on('tap', '.one-2', function () {
        if(common.isSupermarket()){
            mui.openWindow({
                url: 'supermarket-outstock.html',
                createNew: true,
                styles: {
                    cachemode:"noCache"
                }
            });
        }else{
            mui.openWindow({
                url: 'm-page-2.html',
                createNew: true,
                styles: {
                    cachemode:"noCache"
                }
            });
        }
    });
    //检测报告管理
    mui('body').on('tap', '.one-3', function () {
        if(common.isSupermarket()){
            mui.openWindow({
                url: 'supermarket-detection.html',
                createNew: true,
                styles: {
                    cachemode:"noCache"
                }
            });
        }else{
            mui.openWindow({
                url: 'm-page-3.html',
                createNew: true,
                styles: {
                    cachemode:"noCache"
                }
            });
        }
    });
    //门店报表
    mui('body').on('tap', '.one-4', function () {
        if(common.isSupermarket()){
            mui.openWindow({
                url: 'm-page-4.html',
                createNew: true,
                styles: {
                    cachemode:"noCache"
                }
            });
        }else{
            mui.openWindow({
                url: 'm-page-4.html',
                createNew: true,
                styles: {
                    cachemode:"noCache"
                }
            });
        }
    });
    //产品管理
    mui('body').on('tap', '.second-0', function () {
        mui.openWindow({
            url: 'l-page-0.html',
            createNew: true,
            styles: {
                cachemode:"noCache"
            }
        });
    });
    //经营户管理
    mui('body').on('tap', '.second-1', function () {
        mui.openWindow({
            url: 'l-page-1.html',
            createNew: true,
            styles: {
                cachemode:"noCache"
            }
        });
    });
    //供应商管理
    mui('body').on('tap', '.second-2', function () {
        mui.openWindow({
            url: 'l-page-3.html',
            createNew: true,
            styles: {
                cachemode:"noCache"
            }
        });
    });
    //客户管理
    mui('body').on('tap', '.second-3', function () {
        mui.openWindow({
            url: 'l-page-4.html',
            createNew: true,
            styles: {
                cachemode:"noCache"
            }
        });
    });
    //基础信息管理
    mui('body').on('tap', '.second-4', function () {
        mui.openWindow({
            url: 'l-page-5.html',
            createNew: true,
            styles: {
                cachemode:"noCache"
            }
        });
    });

    //拿StorageItem相关的东西
    var systemId = StorageItem.getSystemId();
    var supplierNature = StorageItem.getSupplierNature();
    var entpId = StorageItem.getEntpId();

    //初始化权限
    initPermissions(systemId, supplierNature, entpId);

    //初始化用户信息
    initUserInfo();

    //处理逻辑：1秒内，连续两次按返回键，则退出应用；
    mui.init({
        swipeBack: false
        // statusBarBackground:'#f7f7f7'
    });

    var first = null;
    mui.back = function() {
        //首次按键，提示‘再按一次退出应用’
        if (!first) {
            first = new Date().getTime();
            mui.toast('再按一次退出应用');
            setTimeout(function() {
                first = null;
            }, 1000);
        } else {
            if (new Date().getTime() - first < 1000) {
                StorageItem.clearAll();
                plus.runtime.quit();
            }
        }
    };

}(mui, jQuery));

/**
 * 初始化权限
 * @param systemId
 * @param supplierNature
 * @param entpId
 */
function initPermissions(systemId, supplierNature, entpId) {
    var nowPermissions = new Array();
    switch (systemId) {
        case SYSTEM_ID_QUICKTRACE:
            nowPermissions = QUICKTRACE_PERMISSIONS;
            break;
        case SYSTEM_ID_SUPERMARKET:
            nowPermissions = SUPERMARKET_PERMISSIONS;
            break;
        case SYSTEM_ID_DISTRIBUTION:
            nowPermissions = DISTRIBUTION_PERMISSIONS;
            break;
        case SYSTEM_ID_QUICKTRACENM:
            nowPermissions = initJyhPermissions(supplierNature, entpId, QUICKTRACENM_PERMISSIONS);
            break;
        case SYSTEM_ID_WHOLESALEMARKET:
            nowPermissions = initJyhPermissions(supplierNature, entpId, WHOLESALEMARKET_PERMISSIONS);
            break;
        case SYSTEM_ID_FARMERSMARKET:
            nowPermissions = initNmJyhPermissions(supplierNature, entpId, FARMERSMARKET_PERMISSIONS);
            break;
        default:
            nowPermissions = [];
    }
    //导入权限
    exportPermissions(nowPermissions);
}

//显示相关权限
function exportPermissions(permissions) {
    $.each(permissions, function (i, rowData) {
        jQuery(rowData).show();
    });
}

//跳转
function skipClick(url, className) {
    mui('body').on('tap', className, function () {
        window.top.location.href = url;
    });
}

function initJyhPermissions(supplierNature, entpId, inPermissions) {
    var nowPermissions = new Array();
    if (supplierNature == SUPPLIER_NATURE_106 || supplierNature == SUPPLIER_NATURE_107) {
        nowPermissions = JYH_PERMISSIONS;
        mui("body").off('tap', '.second-0');
        //mui("body").off('tap', '.second-1');
        skipClick('l-page-2.html?id=' + entpId, '.second-0');
        /*if (supplierNature == SUPPLIER_NATURE_106) {
            //经营户管理
            jQuery('.second-1 > a > p').text('企业经营户');
            skipClick('l-page-company-edit.html?id=' + entpId, '.second-1');
        } else if (supplierNature == SUPPLIER_NATURE_107) {
            jQuery('.second-1 > a > p').text('个人经营户');
            skipClick('l-page-personal-edit.html?id=' + entpId, '.second-1');
        }*/
    } else if (supplierNature == SUPPLIER_NATURE_101) {
        nowPermissions = inPermissions;
    }
    return nowPermissions;
}

function initNmJyhPermissions(supplierNature, entpId, inPermissions) {
    var nowPermissions = new Array();
    if (supplierNature == SUPPLIER_NATURE_106 || supplierNature == SUPPLIER_NATURE_107) {
        nowPermissions = NMJYH_NO_OUTSTOCK_PERMISSIONS;
        mui("body").off('tap', '.second-0');
        //mui("body").off('tap', '.second-1');
        skipClick('l-page-2.html?id=' + entpId, '.second-0');
        /*if (supplierNature == SUPPLIER_NATURE_106) {
            //经营户管理
            jQuery('.second-1 > a > p').text('企业经营户');
            skipClick('l-page-company-edit.html?id=' + entpId, '.second-1');
        } else if (supplierNature == SUPPLIER_NATURE_107) {
            jQuery('.second-1 > a > p').text('个人经营户');
            skipClick('l-page-personal-edit.html?id=' + entpId, '.second-1');
        }*/
    } else if (supplierNature == SUPPLIER_NATURE_101) {
        nowPermissions = inPermissions;
    }
    return nowPermissions;
}


function logout(){
    var url = '/app/login/exit';

    if (ajaxLock) {
        return;
    }
    ajaxLock = true;

    var ajaxSetting = {
        url:Route.baseUrl + url,
        type: "POST",
        contentType: 'application/json;charset=utf-8;',
        async: true,
        complete: function () {
            ajaxLock = false;
            //mui.alert("登出成功，请重新登录！" , "登出提示" , "确定" , function(type){
                StorageItem.clearAll();
                mui.openWindow({
                    url: '../login.html',
                    createNew: true,
                    styles: {
                        cachemode:"noCache"
                    }
                });
            //} , 'div');
        },
        errors: function (error) {
            ajaxLock = false;
            //mui.toast('网络出现异常，请重试！', {duration: 'long', type: 'div'});
        }
    };

    if(mui.os.wechat) {
        $.ajax(ajaxSetting);
    } else {
        //mui.alert("登出成功，请重新登录！" , "登出提示" , "确定" , function(type){
            StorageItem.clearAll();
            window.location.href="../login.html";
            // mui.openWindow({
            //     url: '../login.html',
            //     styles: {
            //         cachemode:"noCache"
            //     }
            // });
        //} , 'div');
    }

}

function initUserInfo() {
    var userName = StorageItem.getUserName();
    var entpName = StorageItem.getEntpName();
    if (StorageItem.getSupplierNature() == SUPPLIER_NATURE_106 || StorageItem.getSupplierNature() == SUPPLIER_NATURE_107) {
        entpName = StorageItem.getParentEntpName();
    }
    $('#userName').text(userName||"");
    $('#entpName').text(entpName||"");
}