var id = "";
var ajaxlock = false;
(function (mui, $) {
    //得到传过来的id
    var search = location.search;
    id = search.substring(4);
    //经营类型
    var entptype = new mui.PopPicker();
    $("#entp-type").click(function () {
        var This = this;
        entptype.show(function (items) {
            $('#entpTypeText').val(items[0].text);
            $('#entpType').val(items[0].value);
        });
    });

    $.ajax({
        type: "GET",
        url: Route.baseUrl + "/core/commonCode/getCommonCodeByCodeId",
        data: {codeId: "20002"},
        async: false,
        dataType: "json",
        success: function (data) {
            $(data).each(function (index, value) {
                value.text = value.codeDtlName;
                value.value = value.codeDtlId;
            });
            entptype.setData(data);
        }
    });

    //经营者性质operator-nature
    var entpnature = new mui.PopPicker();
    $("#entp-nature").click(function () {
        var This = this;
        entpnature.show(function (items) {
            $('#entpNatureText').val(items[0].text);
            $('#entpNature').val(items[0].value);
        });
    });
    $.ajax({
        type: "GET",
        url: Route.baseUrl + "/core/commonCode/getCommonCodeByCodeId",
        data: {codeId: "20001"},
        async: false,
        dataType: "json",
        success: function (data) {
            $(data).each(function (index, value) {
                value.text = value.codeDtlName;
                value.value = value.codeDtlId;
            });
            entpnature.setData(data);
        }
    });
    //编辑模式
    if (id != "") {
        $.ajax({
            type: 'GET',
            url: Route.baseUrl + '/entp/entpCustomer/selectOne',
            data: {'id': id},
            dataType: 'json',
            success: function (result) {
                $('#bizRegNumber').val(result.entp.bizRegNumber);
                $('#entpName').val(result.entp.entpName);
                $('#entpType').val(result.entp.entpType);
                $('#entpNature').val(result.entp.entpNature);

                var type = entptype.pickers[0].items;
                $.each(type, function (i, rowData) {
                    if (rowData.value == result.entp.entpType) {
                        entptype.pickers[0].setSelectedValue(rowData.value, 200);
                        $('#entpTypeText').val(rowData.text);
                        $('#entpType').val(rowData.value);
                    }
                });
                var nature = entpnature.pickers[0].items;
                $.each(nature, function (i, rowData) {
                    if (rowData.value == result.entp.entpNature) {
                        entpnature.pickers[0].setSelectedValue(rowData.value, 200);
                        $('#entpNatureText').val(rowData.text);
                        $('#entpNature').val(rowData.value);
                    }
                });
                $('#contactPerson').val(result.entp.contactPerson);
                $('#contactDetail').val(result.entp.contactDetail);
                $('#provinceId').val(result.entp.provinceId);
                $('#entpShortName').val(result.entp.entpShortName);
                $('#legalRepresentative').val(result.entp.legalRepresentative);

                $('#cityId').val(result.entp.cityId);
                $('#areaId').val(result.entp.areaId);
                $('#entpAddress').val(result.entp.entpAddress);
            },
            error: function (err) {
                mui.toast(err, {duration: 'long', type: 'div'});
            }
        });
    }
    //保存
    $("#topRight").click(function () {
        if (!FormUtil.validForm()) {
            return;
        }
        //企业名称
        var entpName = $('#entpName').val().trim();
        if (entpName == "" || entpName == null) {
            mui.toast('企业名称不能为空！', {duration: 'long', type: 'div'});
            return true;
        }
        //联系人
        var contactPerson = $('#contactPerson').val().trim();
        if (contactPerson == "" || contactPerson == null) {
            mui.toast('联系人不能为空！', {duration: 'long', type: 'div'});
            return true;
        }
        //联系方式
        var contactDetail = $('#contactDetail').val().trim();
        if (contactDetail == "" || contactDetail == null) {
            mui.toast('联系方式不能为空！', {duration: 'long', type: 'div'});
            return true;
        }
        //经营类型
        var entpType = $('#entpType').val().trim();
        if (entpType == "" || entpType == null) {
            mui.toast('经营类型不能为空！', {duration: 'long', type: 'div'});
            return true;
        }
        //经营者性质
        /*  var entpNature = $('#entpNature').val().trim();
          if(entpNature =="" || entpNature ==null){
              mui.toast('经营者性质不能为空！', {duration: 'long', type: 'div'});
              return true;
          }*/
        var entpAddress = $('#entpAddress').val().trim();
        if (entpAddress == "" || entpAddress == null) {
            mui.toast('公司地址不能为空！', {duration: 'long', type: 'div'});
            return true;
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
            FormUtil.getAddressByApi(address, inputIds , saveEdit);
        }

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

    function saveEdit() {

        if (ajaxlock) {
            return;
        }
        ajaxlock = true;
        $.ajax({
            type: "POST",
            url: Route.baseUrl + "/entp/entpCustomer/update",
            contentType: "application/json;charset=UTF-8",
            data: JSON.stringify(funSetPostData4Save()),
            dataType: 'json',
            success: function (data) {
                ajaxlock = false;
                var result = data.result;
                if (result.resultCode == 0) {
                    mui.toast('添加成功！', {duration: 'long', type: 'div'});
                    mui.openWindow({
                        url: 'l-page-4.html',
                        createNew: true,
                        styles: {
                            cachemode: "noCache"
                        }
                    });
                } else if (result.resultCode == 1) {
                    mui.toast('社会统一信用代码已存在！', {duration: 'long', type: 'div'});
                } else if (result.resultCode == "2") {
                    mui.toast('企业名称已存在！', {duration: 'long', type: 'div'});
                } else {
                    mui.toast(result.errMsgList, {duration: 'long', type: 'div'});
                }
            },
            error: function () {
                ajaxlock = false;
            }
        })

    }

    function funSetPostData4Save() {
        var postData = {};
        postData.baseEntp = setEntp();
        return postData;
    }

    function setEntp() {
        var baseEntp = {};
        baseEntp.bizRegNumber = $('#bizRegNumber').val();
        baseEntp.endDate = $('#endDate').val();
        baseEntp.id = id;
        baseEntp.entpName = $('#entpName').val();
        baseEntp.entpType = $('#entpType').val();
        baseEntp.legalRepresentative = $('#legalRepresentative').val();
        baseEntp.entpNature = $('#entpNature').val();
        baseEntp.contactPerson = $('#contactPerson').val();
        baseEntp.contactDetail = $('#contactDetail').val();
        baseEntp.entpShortName = $('#entpShortName').val();
        baseEntp.provinceId = $('#provinceId').val();
        baseEntp.cityId = $('#cityId').val();
        baseEntp.areaId = $('#areaId').val();
        baseEntp.entpAddress = $('#entpAddress').val();
        return baseEntp;
    }
}(mui, jQuery));