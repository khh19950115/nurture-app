var SYSTEM_ID_QUICKTRACE = "quickTrace";
var SYSTEM_ID_SUPERMARKET = "supermarket";
var SYSTEM_ID_DISTRIBUTION = "distribution";
var SYSTEM_ID_QUICKTRACENM = "quickTraceNm";
var SYSTEM_ID_WHOLESALEMARKET = "wholesalemarket";
var SYSTEM_ID_FARMERSMARKET = "farmersmarket";

var SUPPLIER_NATURE_101 = '101';
var SUPPLIER_NATURE_106 = '106';
var SUPPLIER_NATURE_107 = '107';

var CONFIRM_BTN_LIST = ['取消', '确认'];
var CONFIRM_BTN_YES = 1;
var CONFIRM_BTN_NO = 0;


(function (window) {
    Date.prototype.format = function (format) {
        var o = {
            "M+": this.getMonth() + 1, //month
            "d+": this.getDate(),    //day
            "h+": this.getHours(),   //hour
            "m+": this.getMinutes(), //minute
            "s+": this.getSeconds(), //second
            "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
            "S": this.getMilliseconds() //millisecond
        }
        if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
            (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o) if (new RegExp("(" + k + ")").test(format))
            format = format.replace(RegExp.$1,
                RegExp.$1.length == 1 ? o[k] :
                    ("00" + o[k]).substr(("" + o[k]).length));
        return format;
    }

    var Route = {
        /* 提出 URL 以备 提取接口 可以集中管理 */
        // baseUrl: 'http://10.250.209.97:8080',
        // staticBaseUrl: "http://10.250.209.97:8080/static/html"
        baseUrl: "http://zycprc.shangwuju.tj.gov.cn",
        staticBaseUrl: "http://zycprc.shangwuju.tj.gov.cn/static/html"
        //baseUrl: "http://tjtest.zhuisuyun.xyz:81",
        //staticBaseUrl: "http://tjtest.zhuisuyun.xyz:81/static/html"

    };

    var DateTool = {
        getString: function () {
            var d = new Date();
            return d.getFullYear() + "-" + (parseInt(d.getMonth()) + 1) + "-" + d.getDate();
        },
        getTime: function () {
            return new Date().getTime();
        }
    };


    var qiniu = {
        imgUrl: "http://ox0r7jkdu.bkt.clouddn.com/",
        imgMode: "imageView2/1/",
        tokenUrl: "http://:3001/qiniu/auth"
    };

    var UrlParam = {
        getParam: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) {
                return unescape(r[2]);
            } else {
                return null;
            }
        }
    };

    var StorageItem = {
        xAuthTokenName: "xAuthToken",
        systemIdName: "systemId",
        supplierNatureName: "supplierNature",
        entpIdName: "entpId",
        entpName: "entpName",
        userName: "userName",
        openId: "openId",
        employeeId: "employeeId",
        parentEntpIdName: "parentEntpId",
        parentEntpName: "parentEntpName",
        rememberMeName: "rememberMe",
        getEmployeeId: function () {
            return window.localStorage.getItem("employeeId");
        },
        setEmployeeId: function (employeeId) {
            window.localStorage.setItem("employeeId", employeeId);
        }, getXAuthToken: function () {
            return window.localStorage.getItem("xAuthToken");
        },
        setXAuthToken: function (xAuthToken) {
            window.localStorage.setItem("xAuthToken", xAuthToken);
        },
        getSystemId: function () {
            return window.localStorage.getItem("systemId");
        },
        getUserName: function () {
            return window.localStorage.getItem("userName");
        },
        setUserName: function (userName) {
            window.localStorage.setItem("userName", userName);
        },
        setSystemId: function (systemId) {
            window.localStorage.setItem("systemId", systemId);
        },
        getEntpId: function () {
            return window.localStorage.getItem("entpId");
        },
        setEntpId: function (entpId) {
            window.localStorage.setItem("entpId", entpId);
        },
        getEntpName: function () {
            return window.localStorage.getItem("entpName");
        },
        setEntpName: function (entpName) {
            window.localStorage.setItem("entpName", entpName);
        },
        getParentEntpId: function () {
            return window.localStorage.getItem("parentEntpId");
        },
        setParentEntpId: function (parentEntpId) {
            window.localStorage.setItem("parentEntpId", parentEntpId);
        },
        getParentEntpName: function () {
            return window.localStorage.getItem(StorageItem.parentEntpName);
        },
        setParentEntpName: function (parentEntpName) {
            window.localStorage.setItem(StorageItem.parentEntpName, parentEntpName);
        },
        getSupplierNature: function () {
            return window.localStorage.getItem("supplierNature");
        },
        setSupplierNature: function (supplierNature) {
            window.localStorage.setItem("supplierNature", supplierNature);
        },
        getOpenId: function () {
            return window.localStorage.getItem("openId");
        },
        setOpenId: function (openId) {
            window.localStorage.setItem("openId", openId);
        },
        getRememberMe: function () {
            return window.localStorage.getItem("rememberMe");
        },
        setRememberMe: function (rememberMe) {
            window.localStorage.setItem("rememberMe", rememberMe);
        },
        clearAll: function () {
            var openId = window.localStorage.getItem("openId");
            var rememberMe = window.localStorage.getItem("rememberMe");
            window.localStorage.clear();
            window.localStorage.setItem("openId", openId);
            window.localStorage.setItem("rememberMe", rememberMe);
        },
        removeItem: function (name) {
            window.localStorage.removeItem(name);
        },
        getPageList: function () {
            var pageList = window.localStorage.getItem("page-list")||"[]";
            return JSON.parse(pageList);
        },
        setPageList: function (pageList) {
            window.localStorage.setItem("page-list",JSON.stringify(pageList));
        }
    };

    window.Route = Route;
    /* 向外暴露 Route */
    window.Today = DateTool;

    window.Qiniu = qiniu;
    window.UrlParam = UrlParam;
    window.StorageItem = StorageItem;

    try {
        var pageList = StorageItem.getPageList();
        var url=window.location.href;
        if(url.indexOf("login.html")<0){
            if(url.indexOf("index.html")>=0){
                StorageItem.setPageList([]);
            }
            url = url.substring(url.lastIndexOf("/")+1,url.length);
            url = url.replace(/[\?|&]type=(exist|invalid)/g,"");
            // var reg = new RegExp("(/*.*\\.html)");
            // var r = url.match(reg);
            // if(r){
            //     url = r[1];
            // }

            if(url.indexOf('sweep-yards') != -1){
                return;
            }

            if(pageList.length>0 && $.inArray(url,pageList)>=0){
                var size=$.inArray(url,pageList);
                pageList.splice(size+1,pageList.length-size);
                StorageItem.setPageList(pageList);
            }else if(!(pageList.length>0&&pageList[pageList.length-1]==url)){
                pageList.push(url);
                StorageItem.setPageList(pageList);
            }
            // mui.toast("stringify--"+JSON.stringify(pageList));
        }
    }catch (e) {
    }


})(window);

(function ($) {
    String.prototype.startWith = function (str) {
        var reg = new RegExp("^" + str);
        return reg.test(this);
    }
    $(document).ajaxSend(function (event, xhr, options) {
        xhr.setRequestHeader(StorageItem.xAuthTokenName, StorageItem.getXAuthToken());
    });
    $.ajaxSetup({
        dataFilter: function (data, type) {
            try {
                if (data) {
                    var json = JSON.parse(data);
                    if (json.code == "-1") {
                        // mui.toast("请重新登录!");
                        StorageItem.clearAll();
                        if (window.location.href.indexOf("login.html", 0) < 0) { //避免重复跳转
                            if(mui.os.wechat) {
                                mui.openWindow({
                                    url: "../login.html?type=exit",
                                    createNew: true,
                                    styles: {
                                        cachemode: "noCache"
                                    }
                                });
                            } else {
                                window.location.href="../login.html?type=exit";
                            }

                        }
                    }
                }
            } catch (e) {

            }
            return data;
        }
    });
})(jQuery);

var common = {

    toggleDisplay: function (clazz) {
        clazz = clazz || ".tips-ex";
        $(clazz).each(function () {
            if ($(this).parents("div").eq(0).find("ul li").not(".ignore").length > 0) {
                $(this).hide();
            } else {
                $(this).show();
            }
        })

    },
    isQuickTrace: function () {
        return StorageItem.getSystemId() == SYSTEM_ID_QUICKTRACE;
    },
    isSupermarket: function () {
        var systemId = StorageItem.getSystemId();
        // systemId="wholesalemarket";
        if (systemId == "quickTraceNm" || systemId == "wholesalemarket" || systemId == "farmersmarket") {
            return false;
        }
        return true;
    },
    isOperating: (StorageItem.getSupplierNature() == SUPPLIER_NATURE_106 || StorageItem.getSupplierNature() == SUPPLIER_NATURE_107),
    uuid: function () {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01

        return s.join("");
    }
};

function addDisabledReadonly(thzz) {
    thzz.addClass("disabled-readonly");
}

//var commonurl='http://192.10.22.209:3000/';

//扩展mui.showLoading
(function ($, window) {
    //显示加载框
    $.showLoading = function (message, type) {
        type = type || "div";
        if ($.os.plus && type !== 'div') {
            $.plusReady(function () {
                plus.nativeUI.showWaiting(message);
            });
        } else {
            var html = '';
            html += '<i class="mui-spinner mui-spinner-white"></i>';
            html += '<p class="text">' + (message || "数据加载中") + '</p>';
            //遮罩层
            var mask = document.getElementsByClassName("mui-show-loading-mask");
            if (mask.length == 0) {
                mask = document.createElement('div');
                mask.classList.add("mui-show-loading-mask");
                document.body.appendChild(mask);
                mask.addEventListener("touchmove", function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                });
            } else {
                mask[0].classList.remove("mui-show-loading-mask-hidden");
            }
            //加载框
            var toast = document.getElementsByClassName("mui-show-loading");
            if (toast.length == 0) {
                toast = document.createElement('div');
                toast.classList.add("mui-show-loading");
                toast.classList.add('loading-visible');
                document.body.appendChild(toast);
                toast.innerHTML = html;
                toast.addEventListener("touchmove", function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                });
            } else {
                toast[0].innerHTML = html;
                toast[0].classList.add("loading-visible");
            }
        }
    };
    //隐藏加载框
    $.hideLoading = function (callback) {
        if ($.os.plus) {
            $.plusReady(function () {
                plus.nativeUI.closeWaiting();
            });
        }
        jQuery(".mui-show-loading-mask").remove();
        var mask = document.getElementsByClassName("mui-show-loading-mask");
        var toast = document.getElementsByClassName("mui-show-loading");
        if (mask.length > 0) {
            mask[0].classList.add("mui-show-loading-mask-hidden");
        }
        if (toast.length > 0) {
            toast[0].classList.remove("loading-visible");
            callback && callback();
        }
    };
    //全局配置(通常所有页面引用该配置，特殊页面使用mui.init({})来覆盖全局配置)
    $.initGlobal({
        swipeBack:false
        // statusBarBackground:'#f7f7f7'
    });
    var back = $.back;
    var first = null;

    $.back = function() {
        if (window.location.href.indexOf("login.html", 0) >= 0 || window.location.href.indexOf("index.html", 0) >= 0) {
            if (!first) {
                first = new Date().getTime();
                mui.toast('再按一次退出应用');
                setTimeout(function() {
                    first = null;
                }, 1000);
            } else {
                if (new Date().getTime() - first <= 1000) {
                    plus.runtime.quit();
                }
            }
        }else{
            var pageList = StorageItem.getPageList();
            var url= "index.html";
            if(pageList.length>0){
                try {
                    pageList.pop();
                    url= pageList[pageList.length-1];
                    StorageItem.setPageList(pageList);
                    // mui.toast("pop after--"+JSON.stringify(pageList));
                }catch (e) {
                }
            }
            mui.openWindow({
                url: url,
                id:new Date().getTime(),
                createNew: true,
                styles: {
                    cachemode: "noCache"
                },
                show:{
                    //页面loaded事件发生后自动显示，默认为true
                    aniShow:'slide-in-left',//页面显示动画，默认为”slide-in-right“；  页面出现的方式 左右上下
                }
            });
            // if(!(pageList.length>0&&pageList[pageList.length-1]==url)){
            //     pageList.push(url);
            //     window.localStorage.setItem("page-list",JSON.stringify(pageList));
            // }
            // var current = plus.webview.currentWebview();
            // var parent = current.opener()||{};
            // var html=parent.id||parent.id__;
            // html=html.replace("html/","");
            // mui.toast(html);
            // window.location.replace(html)

        }

    };
})(mui, window);