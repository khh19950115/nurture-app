var ajaxlock = false;

(function (mui, $) {

    initData();
    //企业基础信息：企业名称、工商注册号 禁用样式
    addDisabledReadonly($("#entpName"));
    addDisabledReadonly($("#bizRegNumber"));

    $("#topRight").click(function () {
        saveEntp();
    });

    mui("body").on("change", "#entpAddress", function () {

        var inputIds = {
            provinceId: 'provinceId',
            cityId: 'cityId',
            areaId: 'areaId',
            fieldLatitude: 'fieldLatitude',
            fieldLongitude: 'fieldLongitude',
            address: 'entpAddress'
        };

        var address = jQuery(this).val();

        if (address != '' && address.trim() != '') {
            FormUtil.getAddressByApi(address, inputIds);
        }

    });


}(mui, jQuery));


function initData() {

    var url = '/entp/entp/selectOne';

    if (ajaxlock) {
        return;
    }
    ajaxlock = true;

    var ajaxSetting = {
        url: Route.baseUrl + url,
        type: "GET",
        contentType: 'application/json;charset=utf-8;',
        //data: {'id': id},
        async: true,
        success: function (data) {
            var entp = data.entp;
            ajaxlock = false;
            //mui.toast('添加成功！', {duration: 'long', type: 'div'});
            $('#id').val(entp.id);
            $('#entpName').val(entp.entpName);
            $('#bizRegNumber').val(entp.bizRegNumber);
            $('#legalRepresentative').val(entp.legalRepresentative);
            $('#contactPerson').val(entp.contactPerson);
            $('#contactDetail').val(entp.contactDetail);
            $('#entpAddress').val(entp.entpAddress);
            $('#provinceId').val(entp.provinceId);
            $('#cityId').val(entp.cityId);
            $('#areaId').val(entp.areaId);
            $('#fieldLatitude').val(entp.fieldLatitude);
            $('#fieldLongitude').val(entp.fieldLongitude);
        },
        errors: function (error) {
            ajaxlock = false;
            mui.toast('加载数据失败！', {duration: 'long', type: 'div'});
        }
    };

    $.ajax(ajaxSetting);

}

function saveEntp() {

    var id = $('#id').val();

    if (id == null || id == undefined || id == '') {
        mui.toast('数据加载有误，请重试！', {duration: 'long', type: 'div'});
        return;
    }

    if (!FormUtil.validForm()) {
        return;
    }

    var inputIds = {
        provinceId: 'provinceId',
        cityId: 'cityId',
        areaId: 'areaId',
        fieldLatitude: 'fieldLatitude',
        fieldLongitude: 'fieldLongitude',
        address: 'entpAddress'
    };

    var address = $('#entpAddress').val();

    if (address != '' && address.trim() != '') {
        FormUtil.getAddressByApi(address, inputIds, saveEdit);
    }

}

function saveEdit() {
    if (ajaxlock) {
        return;
    }
    ajaxlock = true;

    var url = '/entp/entp/app/update';

    var postData = setEntpData();

    var ajaxSetting = {
        url: Route.baseUrl + url,
        type: "POST",
        dataType: 'json',
        contentType: 'application/json;charset=utf-8;',
        data: JSON.stringify(postData),
        async: true,
        success: function (data) {
            ajaxlock = false;
            if (data.result === 0) {
                //mui.toast('修改成功！', {duration: 'long', type: 'div'});
                mui.openWindow({
                    url: 'index.html',
                    createNew: true,
                    styles: {
                        cachemode: "noCache"
                    }
                });
            } else {
                mui.toast('修改失败！', {duration: 'long', type: 'div'});
            }
        },
        errors: function (error) {
            ajaxlock = false;
            mui.toast('修改失败！', {duration: 'long', type: 'div'});
        }
    };

    $.ajax(ajaxSetting);
}

function setEntpData() {
    var baseEntp = {};
    baseEntp.id = $('#id').val();
    baseEntp.bizRegNumber = $('#bizRegNumber').val();
    baseEntp.entpName = $('#entpName').val();
    baseEntp.legalRepresentative = $('#legalRepresentative').val();
    baseEntp.contactPerson = $('#contactPerson').val();
    baseEntp.contactDetail = $('#contactDetail').val();
    baseEntp.entpAddress = $('#entpAddress').val();
    baseEntp.provinceId = $('#provinceId').val();
    baseEntp.cityId = $('#cityId').val();
    baseEntp.areaId = $('#areaId').val();
    baseEntp.fieldLatitude = $('#fieldLatitude').val();
    baseEntp.fieldLongitude = $('#fieldLongitude').val();
    return baseEntp;
}