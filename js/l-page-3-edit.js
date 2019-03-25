var ajaxlock = false;
(function (mui, $) {
    //得到传过来的id
    var search = location.search;
    var id = search.substring(4);
    //经营类型man-type
    var mantype = new mui.PopPicker();
    $("#man-type").click(function () {
        var This = this;
        mantype.show(function (items) {
            $(This).children("input").val(items[0].text);
            $("#entpType").val(items[0].value);
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
            mantype.setData(data);
        }
    });
    //经营者性质operator-nature
    var operatornature = new mui.PopPicker();
    $("#operator-nature").click(function () {
        var This = this;
        operatornature.show(function (items) {
            $(This).children("input").val(items[0].text);
            $("#entpNature").val(items[0].value);
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
            operatornature.setData(data);
        }
    });
    //编辑
    if (id != "") {
        $.ajax({
            type: 'GET',
            url: Route.baseUrl + '/entp/supplier/selectOne',
            data: {'id': id},
            dataType: 'json',
            success: function (result) {
                $('#bizRegNumber').val(result.entp.bizRegNumber);
                $('#endDate').val(result.entp.endDate);
                $('#entpName').val(result.entp.entpName);
                $('#entpType').val(result.entp.entpType);
                $('#contactPerson').val(result.entp.contactPerson);
                $('#contactDetail').val(result.entp.contactDetail);
                $('#entpShortName').val(result.entp.entpShortName);
                $('#legalRepresentative').val(result.entp.legalRepresentative);
                $('#provinceId').val(result.entp.provinceId);
                var type = mantype.pickers[0].items;
                $.each(type, function (i, rowData) {
                    if (rowData.value == result.entp.entpType) {
                        mantype.pickers[0].setSelectedValue(rowData.value, 200);
                        $('#entpTypeText').val(rowData.text);
                        $('#entpType').val(rowData.value);
                    }
                });
                var nature = operatornature.pickers[0].items;
                $.each(nature, function (i, rowData) {
                    if (rowData.value == result.entp.entpNature) {
                        operatornature.pickers[0].setSelectedValue(rowData.value, 200);
                        $('#entpNatureText').val(rowData.text);
                        $('#entpNature').val(rowData.value);
                    }
                });
                $('#bakDate').val(result.entp.bakDate);
                $('#otherId').val(result.entp.otherId);
                $('#cityId').val(result.entp.cityId);
                $('#areaId').val(result.entp.areaId);
                $('#entpAddress').val(result.entp.entpAddress);
                $('#orgLongitude').val(result.entp.fieldLongitude);
                $('#orgLatitude').val(result.entp.fieldLatitude);
            },
            error: function (err) {
                mui.toast(err, {duration: 'long', type: 'div'});
            }
        });
    }
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
        /* var entpNature = $('#entpNature').val().trim();
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
            FormUtil.getAddressByApi(address, inputIds, editSave);
        }

    });

    function editSave() {

        if (id == "") {
            if (ajaxlock) {
                return;
            }
            ajaxlock = true;
            //新增
            $.ajax({
                type: "POST",
                url: Route.baseUrl + "/entp/supplier/insert",
                contentType: "application/json;charset=UTF-8",
                data: JSON.stringify(funSetPostData4Save()),
                dataType: 'json',
                success: function (data) {
                    ajaxlock = false;
                    var result = data.result;
                    if (result.resultCode == 0) {
                        mui.toast('添加成功！', {duration: 'long', type: 'div'});
                        mui.openWindow({
                            url: 'l-page-3.html',
                            createNew: true,
                            styles: {
                                cachemode: "noCache"
                            }
                        });
                    } else if (result.resultCode == 1) {
                        mui.toast('社会统一信用代码已存在！', {duration: 'long', type: 'div'});
                    } else if (result.resultCode == "2") {
                        mui.toast('企业名称已存在！', {duration: 'long', type: 'div'});
                    } else if (result.resultCode == "5") {
                        mui.toast('备案节点企业编码已存在！', {duration: 'long', type: 'div'});
                    } else {
                        mui.toast(result.errMsgList, {duration: 'long', type: 'div'});
                    }
                },
                error: function () {
                    ajaxlock = false;
                }
            });
        } else {//修改
            if (ajaxlock) {
                return;
            }
            ajaxlock = true;
            $.ajax({
                type: "POST",
                url: Route.baseUrl + "/entp/supplier/update",
                contentType: "application/json;charset=UTF-8",
                data: JSON.stringify(funSetPostData4Save()),
                dataType: 'json',
                success: function (data) {
                    ajaxlock = false;
                    var result = data.result;
                    if (result.resultCode == 0) {
                        mui.toast('添加成功！', {duration: 'long', type: 'div'});
                        mui.openWindow({
                            url: 'l-page-3.html',
                            createNew: true,
                            styles: {
                                cachemode: "noCache"
                            }
                        });
                    } else if (result.resultCode == 1) {
                        mui.toast('社会统一信用代码已存在！', {duration: 'long', type: 'div'});
                    } else if (result.resultCode == "2") {
                        mui.toast('企业名称已存在！', {duration: 'long', type: 'div'});
                    } else if (result.resultCode == "5") {
                        mui.toast('备案节点企业编码已存在！', {duration: 'long', type: 'div'});
                    } else {
                        mui.toast(result.errMsgList, {duration: 'long', type: 'div'});
                    }
                },
                error: function () {
                    mui.toast('添加出现异常！', {duration: 'long', type: 'div'});
                    ajaxlock = false;
                }
            })
        }

    }

    function funSetPostData4Save() {
        var postData = {};
        postData.baseEntp = setEntp();
        return postData;
    }

    function setEntp() {
        var baseEntp = {};
        baseEntp.id = id;
        baseEntp.bizRegNumber = $('#bizRegNumber').val();
        baseEntp.endDate = $('#endDate').val();
        baseEntp.entpName = $('#entpName').val();
        baseEntp.entpType = $('#entpType').val();
        baseEntp.legalRepresentative = $('#legalRepresentative').val();
        baseEntp.entpNature = $('#entpNature').val();
        baseEntp.contactPerson = $('#contactPerson').val();
        baseEntp.contactDetail = $('#contactDetail').val();
        baseEntp.provinceId = $('#provinceId').val();
        baseEntp.cityId = $('#cityId').val();
        baseEntp.areaId = $('#areaId').val();
        baseEntp.entpAddress = $('#entpAddress').val();
        return baseEntp;
    }

    //地址
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