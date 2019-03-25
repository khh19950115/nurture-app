var ajaxLock = false;

(function (mui, $) {

    $("#saveBtn").click(function () {
        modifyPassword();
    });

}(mui, jQuery));


function modifyPassword() {

    if(!FormUtil.validForm()){
        return;
    } else {
        var oldPassword =  $('#oldPassword').val();
        var newPassword = $('#newPassword').val();
        var reNewPassword = $('#reNewPassword').val();

        if(oldPassword == newPassword){
            mui.toast('新密码不能和原始密码一致！', {duration: 'long', type: 'div'});
            return;
        }

        if(newPassword != reNewPassword){
            mui.toast('确认密码和新密码不一致！', {duration: 'long', type: 'div'});
            return;
        }
    }

    var modifyData = {};

    modifyData.oldPassword = oldPassword;
    modifyData.newPassword = newPassword;

    var url = '/app/upd/pwd?oldPassword=' + oldPassword + '&newPassword=' + newPassword;
    //var url = '/app/upd/pwd';

    if (ajaxLock) {
        return;
    }
    ajaxLock = true;

    var ajaxSetting = {
        url: Route.baseUrl +url,
        type: "POST",
        contentType: 'application/json;charset=utf-8;',
        //dataType:'json',
        //data: modifyData,
        async: true,
        success: function (data) {
           ajaxLock = false;
           var reslut = data.result;
           if(reslut){
               //mui.alert("密码修改成功，请重新登录！" , "修改密码提示" , "确定" , function(type){
                   logout();
               //} , 'div');
           } else {
               $('#oldPassword').val('');
               mui.toast('修改失败，原密码不正确！', {duration: 'long', type: 'div'});
           }
        },
        errors: function (error) {
            ajaxLock = false;
            mui.toast('网络出现异常，请重试！', {duration: 'long', type: 'div'});
        }
    };

    $.ajax(ajaxSetting);
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
        success: function (data) {
            ajaxLock = false;
            var reslut = data.result;
            if(reslut){
                StorageItem.clearAll();
                mui.openWindow({
                    url: '../login.html',
                    createNew: true,
                    styles: {
                        cachemode:"noCache"
                    }
                });
            } else {
                //mui.alert("解除微信绑定时出现错误，请重新登录！" , "登出提示" , "确定" , function(type){
                mui.openWindow({
                    url: '../login.html',
                    createNew: true,
                    styles: {
                        cachemode:"noCache"
                    }
                });
                //} , 'div');
            }
        },
        errors: function (error) {
            ajaxLock = false;
            mui.toast('网络出现异常，请重试！', {duration: 'long', type: 'div'});
        }
    };

    if(mui.os.wechat) {
        $.ajax(ajaxSetting);
    } else {
        window.top.location.href = '../login.html';
    }
}