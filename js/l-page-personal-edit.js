var ajaxlock = false;
var id="";
(function(mui, doc,$) {

    addDisabledReadonly($("#userName1"));


    //得到id
    var search=location.search;
    id=search.substring(4);

	/*mui.ready(function() {
		//经营类型man-type
		var mantype = new mui.PopPicker();
		var mantypeButton = doc.getElementById('man-type');
		mantypeButton.addEventListener('tap', function(event) {
			mantype.show(function(items) {
				mantypeButton.value = items[0].text;
				//返回 false 可以阻止选择框的关闭
				//return false;
			});
		}, false);
		
		
	});*/


//经营类型2man-type2
    var mantype2 = new mui.PopPicker();
    $("#man-type2").click(function() {
        var This = this;
        mantype2.show(function(items) {
            $("#man-type2").children("input").val(items[0].text);
            $("#entpType1").val(items[0].value);
        });
    });
    $.ajax({
        type: "GET",
        url: Route.baseUrl +"/core/commonCode/getCommonCodeByCodeId",
        data: {codeId:"20002"},
        async:false,
        dataType: "json",
        success: function(data){
            $(data).each(function(index,value){
                value.text= value.codeDtlName;
                value.value=value.codeDtlId;
            });
            mantype2.setData(data);
        }
    });

    /**
     * 编辑模式
     */
    $.ajax({
        type: 'GET',
        url: Route.baseUrl +'/entp/agency/selectOne',
        data: {'id': id},
        dataType: 'json',
        success: function (result) {
            $('#bizRegNumber1').val(result.entp.bizRegNumber);
           // $('#id').val(result.entp.id);
            $('#entpName1').val(result.entp.entpName);
            var type = mantype2.pickers[0].items;
            $.each(type, function (i, rowData) {
                if(rowData.value == result.entp.entpType){
                    mantype2.pickers[0].setSelectedValue(rowData.value, 200);
                    $('#man-type').val(rowData.text);
                    $('#entpType1').val(rowData.value);
                }
            });

            $('#contactDetail1').val(result.entp.contactDetail);
            $('#stallNum1').val(result.entp.stallNum);
          //  $('#userName1').val(result.entp.systemReserve3);
            $('#userName1').val(result.entp.systemReserve3).data("val",result.entp.systemReserve2);
            $('#entpQrCode1').val(result.entp.entpQrCode);
            $('#otherId1').val(result.entp.otherId);
        },
        error: function (err) {
            mui.toast(err, {duration: 'long', type: 'div'});
        }
    });

}(mui, document,jQuery));

//保存
$("#topRight").click(function() {
    if (ajaxlock) {
        return;
    }
    if(!FormUtil.validForm()) {
        return;
    }
    //姓名
    var entpName = $('#entpName1').val().trim();
    if(entpName =="" || entpName ==null){
        mui.toast('姓名不能为空！', {duration: 'long', type: 'div'});
        return true;
    }
    //登陆名称
    var userName = $('#userName1').val().trim();
    if(userName =="" || userName ==null){
        mui.toast('登陆名称不能为空！', {duration: 'long', type: 'div'});
        return true;
    }
    //联系方式
    var contactDetail = $('#contactDetail1').val().trim();
    if(contactDetail =="" || contactDetail ==null){
        mui.toast('联系方式不能为空！', {duration: 'long', type: 'div'});
        return true;
    }
    //身份证号
    var bizRegNumber1 = $('#bizRegNumber1').val().trim();
    if(bizRegNumber1 =="" || bizRegNumber1 ==null){
        mui.toast('身份证号不能为空！', {duration: 'long', type: 'div'});
        return true;
    }
    //经营类型
    var entpTypeText = $('#entpType1').val().trim();
    if(entpTypeText =="" || entpTypeText ==null){
        mui.toast('经营类型不能为空！', {duration: 'long', type: 'div'});
        return true;
    }
    ajaxlock = true;
    $.ajax({
        type: "POST",
        url: Route.baseUrl + "/entp/agency/update",
        contentType: "application/json;charset=UTF-8",
        data: JSON.stringify(funSetPostData4Save()),
        dataType: 'json',
        success: function (data) {
            ajaxlock = false;
            var result = data.result;
            if (result.resultCode == 0) {
                mui.toast('修改成功！', {duration: 'long', type: 'div'});
                mui.openWindow({
                    id: new Date().getTime(),
                    url: 'l-page-1.html',
                    createNew: true,
                    styles: {
                        cachemode:"noCache"
                    }
                });
            } else if (result.resultCode == 1) {
                mui.toast('身份证号码已存在！', {duration: 'long', type: 'div'});
            } else if (result.resultCode == "2") {
                mui.toast('经营户名称已存在！', {duration: 'long', type: 'div'});
            } else if (result.resultCode == "3") {
                mui.toast('请输入正确的企业主体二维码！', {duration: 'long', type: 'div'});
            } else {
                mui.toast(result.errMsgList, {duration: 'long', type: 'div'});
            }
        },
        error: function () {
            ajaxlock = false;
        }
    })
});
function funSetPostData4Save() {
    var postData = {};
    postData.baseEntp = setEntp();
    return postData;
}

function setEntp() {
    var baseEntp = {};
    baseEntp.supplierNature = "107";
    baseEntp.bizRegNumber = $('#bizRegNumber1').val();
    baseEntp.id =id;
    baseEntp.entpName = $('#entpName1').val();
    baseEntp.entpType = $('#entpType1').val();
    baseEntp.contactPerson = $('#entpName1').val();
    baseEntp.contactDetail = $('#contactDetail1').val();
    baseEntp.stallNum = $('#stallNum1').val();
    baseEntp.entpType = $('#entpType1').val();
    //登录名
    baseEntp.systemReserve3=$('#userName1').val();
    baseEntp.systemReserve2=$('#userName1').data("val");
    baseEntp.entpQrCode = $('#entpQrCode1').val();
    baseEntp.otherId = $('#otherId1').val();
    return baseEntp;
}