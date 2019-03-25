// /core/commonCode/getCommonCodeByCodeId  codeId
var ajaxlock = false;

(function (mui, $) {
    //选择客户类型customer-type
    var customertype = new mui.PopPicker();

    var options = [{
        value: '101',
        text: '企业客户'
    }, {
        value: '102',
        text: '个人客户'
    }];

    if(StorageItem.getSystemId() == SYSTEM_ID_SUPERMARKET){
        options = [{
            value: '101',
            text: '企业客户'
        }];
        customertype.setData(options);
        $("#customer-type").hide();
    } else {
        customertype.setData(options);
        $("#customer-type").show();
    }

    $("#customer-type").click(function () {
        var This = this;
        customertype.show(function (items) {
            $(This).children("input").val(items[0].text);
            if (items[0].text == '企业客户') {
                document.getElementById("company-box").classList.remove('mui-hidden');
                document.getElementById("personal-box").classList.add('mui-hidden');
            } else if (items[0].text == '个人客户') {
                document.getElementById("personal-box").classList.remove('mui-hidden');
                document.getElementById("company-box").classList.add('mui-hidden');
            }
        });
    });

    //经营类型2man-type2
    var entptype = new mui.PopPicker();

    FormUtil.getOptionData(ComConst.ENTP_TYPE_ID, function (resultData) {
        entptype.setData(resultData);
    });

    $("#entp-type").click(function () {
        var This = this;
        entptype.show(function (items) {
            //$(This).children("input").val(items[0].text);
            $('#entpTypeText').val(items[0].text);
            $('#entpType').val(items[0].value);
        });
    });

    //经营者性质operator-nature
    var entpnature = new mui.PopPicker();

    FormUtil.getOptionData(ComConst.ENTP_NATURE_ID, function (resultData) {
        entpnature.setData(resultData);
    });

    $("#entp-nature").click(function () {
        var This = this;
        entpnature.show(function (items) {
            //$(This).children("input").val(items[0].text);
            $('#entpNatureText').val(items[0].text);
            $('#entpNature').val(items[0].value);
        });
    });

    //性别
    var customersex = new mui.PopPicker();

    FormUtil.getOptionData(ComConst.SEX_TYPE_ID, function (resultData) {
        customersex.setData(resultData);
    });

    $("#customer-sex").click(function () {
        var This = this;
        customersex.show(function (items) {
            $('#customerSexText').val(items[0].text);
            $('#customerSex').val(items[0].value);
        });
    });

    //时间 选择初始化
    $("#purchase-birthDay").click(function () {
        var This = this;
        This.picker = new mui.DtPicker(FormUtil.dtPickDateOption);
        This.picker.show(function (rs) {
            $(This).children("input").val(rs.text);
            //$('#birthDayText').val(rs.text);
            //$('#birthDay').val(rs.value);
            This.picker.dispose();
            This.picker = null;
        });
    });

    $("#topRight").click(function () {
        saveCustomer();
    });

    //mui("#main").on("change", "input[type='text']", function() {
    mui("body").on("change", "#entpAddress", function() {

        var inputIds = {
            provinceId:'provinceId',
            cityId:'cityId',
            areaId:'areaId',
            fieldLatitude:'fieldLatitude',
            fieldLongitude:'fieldLongitude',
            address:'entpAddress'
        };

        var address = jQuery(this).val();

        if(address != '' && address.trim() != ''){
            FormUtil.getAddressByApi(address , inputIds);
        }
    });

    mui("body").on("change", "#customerEntpAddress", function() {
        var inputIds = {
            provinceId:'customerProvinceId',
            cityId:'customerCityId',
            areaId:'customerAreaId',
            fieldLatitude:'customerFieldLatitude',
            fieldLongitude:'customerFieldLongitude',
            address:'customerEntpAddress'
        };

        var address = jQuery(this).val();

        if(address != '' && address.trim() != ''){
            FormUtil.getAddressByApi(address , inputIds);
        }
    });

}(mui, jQuery));


function saveCustomer() {

    var type = $('#customer-type').children("input").val();

    if (type == '企业客户') {
        if (!validForm("#company-box")) {
            return;
        }

        var inputIds = {
            provinceId:'provinceId',
            cityId:'cityId',
            areaId:'areaId',
            fieldLatitude:'fieldLatitude',
            fieldLongitude:'fieldLongitude',
            address:'entpAddress'
        };

        var address = $('#entpAddress').val();

        if(address != '' && address.trim() != ''){
            FormUtil.getAddressByApi(address , inputIds , saveEdit);
        }

    } else {
        if (!validForm("#personal-box")) {
            return;
        }

        var inputIds = {
            provinceId:'customerProvinceId',
            cityId:'customerCityId',
            areaId:'customerAreaId',
            fieldLatitude:'customerFieldLatitude',
            fieldLongitude:'customerFieldLongitude',
            address:'customerEntpAddress'
        };

        var address = $('#customerEntpAddress').val();

        if(address != '' && address.trim() != ''){
            FormUtil.getAddressByApi(address , inputIds , saveEdit);
        }

    }

}

function saveEdit(){

    var url ='/entp/entpCustomer/insert';

    var type = $('#customer-type').children("input").val();

    var postData = {};

    if (type == '企业客户') {
        if (!validForm("#company-box")) {
            return;
        }
        postData = setEntpData();
    } else {
        if (!validForm("#personal-box")) {
            return;
        }
        url = '/entp/customer/insert';
        postData = setCustomerData();
    }

    if (ajaxlock) {
        return;
    }
    ajaxlock = true;

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
                mui.toast('添加成功！', {duration: 'long', type: 'div'});
                mui.openWindow({
                    url: 'l-page-4.html',
                    createNew: true,
                    styles: {
                        cachemode:"noCache"
                    }
                });
            } else if (data.result.resultCode === 1) {
                mui.toast('添加失败，备案备案号或姓名已经存在！', {duration: 'long', type: 'div'});
            } else {
                mui.toast('添加失败！', {duration: 'long', type: 'div'});
            }
        },
        errors: function (error) {
            ajaxlock = false;
            mui.toast('添加失败！', {duration: 'long', type: 'div'});
        }
    };

    $.ajax(ajaxSetting);

}

//设置企业数据
function setEntpData() {
    var postData = {};
    postData.baseEntp = setEntp();
    postData.entpImage = "";
    postData.weChat = "";
    postData.certList = [];
    postData.videoUrl = "";
    postData.videoName = "";
    return postData;
}

//设置企业数据
function setEntp() {
    var baseEntp = {};
    baseEntp.bizRegNumber = $('#bizRegNumber').val();
    // baseEntp.endDate = $('#endDate').val();
    // baseEntp.id = $('#id').val();
    baseEntp.entpName = $('#entpName').val();
    baseEntp.entpType = $('#entpType').val();
    baseEntp.legalRepresentative = $('#legalRepresentative').val();
    baseEntp.entpNature = $('#entpNature').val();
    //baseEntp.bakDate = $('#bakDate').val();
    baseEntp.contactPerson = $('#contactPerson').val();
    baseEntp.contactDetail = $('#contactDetail').val();
    //baseEntp.entpShortName = $('#entpShortName').val();
    baseEntp.provinceId = $('#provinceId').val();
    baseEntp.cityId = $('#cityId').val();
    baseEntp.areaId = $('#areaId').val();
    baseEntp.entpAddress = $('#entpAddress').val();
    baseEntp.fieldLatitude = $('#fieldLatitude').val();
    baseEntp.fieldLongitude = $('#fieldLongitude').val();
    //baseEntp.entpIntro = CKEDITOR.instances.entpIntro.getData();
    /*if (getCertList('gridlyFileInfo').length > 0) {
        baseEntp.fileInfoId = getCertList('gridlyFileInfo')[0].fileInfoId;
    } else {
        baseEntp.fileInfoId = "";
    }*/
    return baseEntp;
}

//设置个人客户数据
function setCustomerData() {
    var customer = {};
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
    /*if (getCertList('gridlyPhoto').length > 0) {
        customer.fileInfoId = getCertList('gridlyPhoto')[0].fileInfoId;
    }*/
    return customer;
}

/**
 * 校验数据
 * @param 选择器 所有input 所在的父元素的ID
 * @returns {boolean} true 校验通过| false 校验不通过
 */
function validForm(id) {
    var check = true;
    mui(id + " input").each(function () {
        var hasRequired = jQuery(this).data('required');
        if (hasRequired) {
            var description = jQuery(this).data('description');
            if(description == undefined || description == null || description == ''){
                description = '有必填项没有填写！';
            }
            if (!this.value || this.value.trim() == "") {
                check = false;
                mui.toast(description, {duration: 'long', type: 'div'});
                return false;
            }
        }
        var hasPatten = jQuery(this).attr('data-patten');
        //判断是否需要校验正则
        if(hasPatten){
            //如果非必填，没有值则不校验
            if(this.value && this.value.trim() != ""){
                var pattenDesc = jQuery(this).data('patten-desc');
                if (pattenDesc == undefined || pattenDesc == null || pattenDesc == '') {
                    pattenDesc = '输入的字符不正确！';
                }
                var regExp = new RegExp(hasPatten);
                if(!regExp.test(this.value)) {
                    check = false;
                    mui.toast(pattenDesc, {duration: 'long', type: 'div'});
                    return false;
                }
            }
        }
    });
    return check;
}