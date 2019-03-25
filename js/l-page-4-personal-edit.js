var ajaxlock = false;

var id = UrlParam.getParam('id');

(function (mui, doc, $) {
    mui.ready(function () {

        var customersex = new mui.PopPicker();

        $("#customer-sex").click(function () {
            customersex.show(function (items) {
                $('#customerSexText').val(items[0].text);
                $('#customerSex').val(items[0].value);
            });
        });

        var birthday = new mui.DtPicker(FormUtil.dtPickDateOption);

        $("#purchase-birthDay").click(function () {
            var This = this;
            birthday.show(function (rs) {
                $(This).children("input").val(rs.text);
                //$('#birthDayText').val(rs.text);
                //$('#birthDay').val(rs.text);
                birthday.hide();
                //birthday.dispose();
                //birthday = null;
            });


        });

        $("#topRight").click(function () {

            saveCustomer();

        });

        initData(customersex, birthday);

        mui("body").on("change", "#customerEntpAddress", function () {

            var inputIds = {
                provinceId: 'customerProvinceId',
                cityId: 'customerCityId',
                areaId: 'customerAreaId',
                fieldLatitude: 'customerFieldLatitude',
                fieldLongitude: 'customerFieldLongitude',
                address: 'customerEntpAddress'
            };

            var address = jQuery(this).val();

            if (address != '' && address.trim() != '') {
                FormUtil.getAddressByApi(address, inputIds);
            }
        });

    });
}(mui, document, jQuery));

function initData(customersex, birthday) {

    if (!hasId()) {
        mui.toast('加载数据时出现错误！', {duration: 'long', type: 'div'});
        return;
    }

    if (ajaxlock) {
        return;
    }
    ajaxlock = true;

    var url = '/entp/customer/selectOneById';

    var ajaxSetting = {
        url: Route.baseUrl + url,
        type: "GET",
        dataType: 'json',
        contentType: 'application/json;charset=utf-8;',
        data: {'id': id},
        async: true,
        success: function (result) {
            ajaxlock = false;
            //mui.toast('添加成功！', {duration: 'long', type: 'div'});
            $('#id').val(id);
            $('#customerName').val(result.customerName);
            $('#customerContactDetail').val(result.contactDetail);

            birthday.setSelectedValue(result.birthday);
            $('#birthDayText').val(result.birthday);
            $('#birthDay').val(result.birthday);


            FormUtil.getOptionData(ComConst.SEX_TYPE_ID, function (resultData) {
                customersex.setData(resultData);

                var sexData = customersex.pickers[0].items;

                $.each(sexData, function (i, rowData) {
                    if (rowData.value == result.sex) {
                        customersex.pickers[0].setSelectedValue(rowData.value, 200);
                        $('#customerSexText').val(rowData.text);
                        $('#customerSex').val(rowData.value);
                    }
                });

            });

            $('#customerPin').val(result.pin);
            $('#email').val(result.email);
            $('#customerProvinceId').val(result.provinceId);
            $('#customerCityId').val(result.cityId);
            $('#customerAreaId').val(result.areaId);
            $('#customerEntpAddress').val(result.customerAddress);
            $('#customerFieldLongitude').val(result.customerLongitude);
            $('#customerFieldLatitude').val(result.customerLatitude);
            $('#fileInfoId').val(result.fileInfoId);
        },
        errors: function (error) {
            ajaxlock = false;
            mui.toast('加载数据失败！', {duration: 'long', type: 'div'});
        }
    };

    $.ajax(ajaxSetting);
}

function saveCustomer() {
    if (!hasId()) {
        mui.toast('加载数据时出现错误，无法保存！', {duration: 'long', type: 'div'});
        return;
    }

    if (!FormUtil.validForm()) {
        return;
    }

    var inputIds = {
        provinceId: 'customerProvinceId',
        cityId: 'customerCityId',
        areaId: 'customerAreaId',
        fieldLatitude: 'customerFieldLatitude',
        fieldLongitude: 'customerFieldLongitude',
        address: 'customerEntpAddress'
    };

    var address = $('#customerEntpAddress').val();

    if (address != '' && address.trim() != '') {
        FormUtil.getAddressByApi(address, inputIds ,saveEdit);
    }

}

function saveEdit() {
    if (ajaxlock) {
        return;
    }
    ajaxlock = true;

    var url = '/entp/customer/update';

    var postData = setCustomerData();

    var ajaxSetting = {
        url: Route.baseUrl + url,
        type: "POST",
        dataType: 'json',
        contentType: 'application/json;charset=utf-8;',
        data: JSON.stringify(postData),
        async: true,
        success: function (data) {
            ajaxlock = false;
            if (data.result.resultCode === 0) {
                //mui.toast('修改成功！', {duration: 'long', type: 'div'});
                mui.openWindow({
                    url: 'l-page-4.html',
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

function setCustomerData() {
    var customer = {};
    customer.id = $('#id').val();
    customer.customerName = $('#customerName').val();
    customer.contactDetail = $('#customerContactDetail').val();
    customer.birthday = $('#birthDay').val();
    customer.sex = $('#customerSex').val();
    customer.pin = $('#customerPin').val();
    customer.email = $('#email').val();
    customer.provinceId = $('#customerProvinceId').val();
    customer.cityId = $('#customerCityId').val();
    customer.areaId = $('#customerAreaId').val();
    customer.customerAddress = $('#customerEntpAddress').val();
    customer.customerLongitude = $('#customerFieldLongitude').val();
    customer.customerLatitude = $('#customerFieldLatitude').val();
    customer.fileInfoId = $('#fileInfoId').val();
    return customer;
}

function hasId() {
    if (id == null || id == '' || id == undefined) {
        return false;
    } else {
        return true;
    }
}