(function (mui, doc, $) {


    var type = UrlParam.getParam('type');
    if(type=="exit"){
        mui.toast("请重新登录!");
    }

    if(StorageItem.getRememberMe() != null){
        var rememberMe = JSON.parse(StorageItem.getRememberMe());
        $('#userName').val(rememberMe.loginName);
        $('#password').val(rememberMe.password);
    }

    mui.ready(function () {
        $('body').height($('body')[0].clientHeight);
        $("#password").blur(function() {
            window.scroll(0,0);
        });

        //todo 删除此toast
        // mui.toast(window.location.href);

        if (StorageItem.getXAuthToken()) {
            $.ajax({
                url: Route.baseUrl + "/appAutoLogin", 
                type: "get",
                success: function (data) {
                    if (data == "SUCCESS") {
                        mui.openWindow({
                            url: 'html/index.html',
                            createNew: true,
                            styles: {
                                cachemode:"noCache"
                            }
                        });
                    }
                },
                error: function (data) {

                }
            });
        }

        setTimeout(function () {
            autoLoginByWechatCode();
        }, 200);

        document.getElementById("loginSwitchBtn").addEventListener("toggle", function (event) {
            if (event.detail.isActive) {
                console.log("你启动了开关");
                $("#password").prop('type', 'text');
            } else {
                console.log("你关闭了开关");
                $("#password").prop('type', 'password');
            }
        })
        $("#login").on('click', function () {
            initLogin();
            var userName = $('#userName').val();
            var password = $('#password').val();
            if (userName == '' || password == '') {
                mui.alert("请输入用户名或者密码");
                return;
            }
            var mask = mui.createMask();//遮罩层
            $.ajax({
                url: Route.baseUrl + '/applogin',
                type: 'post',
                data: {
                    userName: userName,
                    userPsw: password,
                    openId: StorageItem.getOpenId()=="null"?null:StorageItem.getOpenId()
                },
                beforeSend: function () {
                    mask.show();//显示遮罩层
                },
                complete: function () {
                    mask.close();//关闭遮罩层
                },
                success: function (data) {
                    if (data && data.success) {
                        StorageItem.setXAuthToken(data[StorageItem.xAuthTokenName]);
                        StorageItem.setSystemId(data.userDetail[StorageItem.systemIdName]);
                        StorageItem.setEntpId(data.userDetail[StorageItem.entpIdName]);
                        StorageItem.setSupplierNature(data.userDetail[StorageItem.supplierNatureName]);
                        StorageItem.setEntpName(data.userDetail[StorageItem.entpName]);
                        StorageItem.setUserName(data.userDetail[StorageItem.userName]);
                        StorageItem.setEmployeeId(data.userDetail[StorageItem.employeeId]);
                        StorageItem.setParentEntpId(data.userDetail[StorageItem.parentEntpIdName]);
                        StorageItem.setParentEntpName(data.userDetail[StorageItem.parentEntpName]);

                        var rememberMe = {};
                        rememberMe.loginName = userName;
                        rememberMe.password = password;
                        StorageItem.setRememberMe(JSON.stringify(rememberMe));

                        mui.openWindow({
                            url: 'html/index.html',
                            createNew: true,
                            styles: {
                                cachemode:"noCache"
                            }
                        });
                    } else {
                        mui.alert(data.message);
                    }
                },
                error: function (xhr, type, errorThrown) {
                    mui.alert("网络出现问题!");
                    mask.close();//关闭遮罩层
                }

            });
        });
    });

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
                initLogin();
                plus.runtime.quit();
            }
        }
    };

}(mui, document, jQuery));

function autoLoginByWechatCode() {
    //根据微信code尝试自动登录
    var code = UrlParam.getParam("code");
    if (code) {
        var d = {code: code};
        $.ajax({
            url: Route.baseUrl + "/apploginwechat",
            data: d,
            type: "post",
            success: function (res) {
                if (res.success) {
                    StorageItem.setXAuthToken(res[StorageItem.xAuthTokenName]);
                    StorageItem.setSystemId(res.userDetail[StorageItem.systemIdName]);
                    StorageItem.setEntpId(res.userDetail[StorageItem.entpIdName]);
                    StorageItem.setSupplierNature(res.userDetail[StorageItem.supplierNatureName]);
                    StorageItem.setEntpName(res.userDetail[StorageItem.entpName]);
                    StorageItem.setUserName(res.userDetail[StorageItem.userName]);
                    StorageItem.setEmployeeId(res.userDetail[StorageItem.employeeId]);
                    StorageItem.setParentEntpId(res.userDetail[StorageItem.parentEntpIdName]);
                    StorageItem.setParentEntpName(res.userDetail[StorageItem.parentEntpName]);
                    mui.openWindow({
                        url: 'html/index.html',
                        createNew: true,
                        styles: {
                            cachemode:"noCache"
                        }
                    });
                } else {
                    StorageItem.setOpenId(res.openId);
                }
            },
            error: function (res) {
            }

        });
    }
}

function initLogin() {
    //清除storage
    StorageItem.clearAll();
    //清除cookies
    //$.cookie('Cookie', null);
    clearAllCookie();
    $.session.clear();
}

//清除所有cookie函数
function clearAllCookie() {
    var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
    if(keys) {
        for(var i = keys.length; i--;) {
            document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString();
        }
    }
}