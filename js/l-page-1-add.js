var ajaxlock = false;
(function(mui, $) {
	//选择客户类型customer-type
	var customertype = new mui.PopPicker();
	customertype.setData([{
		value: '1',
		text: '个人'
	}, {
		value: '2',
		text: '个体经营户/企业'
	}]);
	$("#customer-type").click(function() {
		var This = this;
		customertype.show(function(items) {
			$(This).children("input").val(items[0].text);
			if(items[0].text == '个体经营户/企业') {
				document.getElementById("company-box").classList.remove('mui-hidden');
				document.getElementById("personal-box").classList.add('mui-hidden');
                $("#customerType").val(items[0].value);
			} else if(items[0].text == '个人') {
				document.getElementById("personal-box").classList.remove('mui-hidden');
				document.getElementById("company-box").classList.add('mui-hidden');
                $("#customerType").val(items[0].value);
			}
		});
	});
	//经营类型man-type
	var mantype = new mui.PopPicker();
	$("#man-type").click(function() {
		var This = this;
		mantype.show(function(items) {
			$("#man-type").children("input").val(items[0].text);
			$("#entpType").val(items[0].value);
		});
	});
    $.ajax({
        type: "GET",
        url:Route.baseUrl + "/core/commonCode/getCommonCodeByCodeId",
        data: {codeId:"20002"},
        dataType: "json",
        success: function(data){
            $(data).each(function(index,value){
                value.text= value.codeDtlName;
                value.value=value.codeDtlId;
            });
            mantype.setData(data);
        }
    });

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
        dataType: "json",
        success: function(data){
            $(data).each(function(index,value){
                value.text= value.codeDtlName;
                value.value=value.codeDtlId;
            });
            mantype2.setData(data);
        }
    });

	//经营者性质operator-nature
	var operatornature = new mui.PopPicker();
	$("#operator-nature").click(function() {
		var This = this;
		operatornature.show(function(items) {
			$("#operator-nature").children("input").val(items[0].text);
			$("#entpNature").val(items[0].value);
		});
	});

    $.ajax({
        type: "GET",
        url: Route.baseUrl +"/core/commonCode/getCommonCodeByCodeId",
        data: {codeId:"20001"},
        dataType: "json",
        success: function(data){
            $(data).each(function(index,value){
                value.text= value.codeDtlName;
                value.value=value.codeDtlId;
            });
            operatornature.setData(data);
        }
    });

    //用户名正则，4到16位（字母，数字，下划线）
    var uPattern = /^[a-zA-Z0-9\.@_]{1,16}$/;

	$("#topRight").click(function() {

        if (ajaxlock) {
            return;
        }
        if(!FormUtil.validForm()) {
            return;
        }
        var type = $('#customerType').val();
        if(type==2){
            //企业名称
            var entpName = $('#entpName').val().trim();
            if(entpName =="" || entpName ==null){
                mui.toast('企业名称不能为空！', {duration: 'long', type: 'div'});
                return true;
            }
            //登陆账号
            var userName = $('#userName').val().trim();
            if(userName =="" || userName ==null){
                mui.toast('登陆账号不能为空！', {duration: 'long', type: 'div'});
                return true;
            }else if(!uPattern.test(userName)){
                mui.toast('请输入1-16位字符(字母,数字)的登陆账号', {duration: 'long', type: 'div'});
                return true;
            }
            //联系人
            var contactPerson = $('#contactPerson').val().trim();
            if(contactPerson =="" || contactPerson ==null){
                mui.toast('联系人不能为空！', {duration: 'long', type: 'div'});
                return true;
            }
            //联系方式
            var contactDetail = $('#contactDetail').val().trim();
            if(contactDetail =="" || contactDetail ==null){
                mui.toast('联系方式不能为空！', {duration: 'long', type: 'div'});
                return true;
            }
            //经营类型
            var entpTypeText = $('#entpType').val().trim();
            if(entpTypeText =="" || entpTypeText ==null){
                mui.toast('经营类型不能为空！', {duration: 'long', type: 'div'});
                return true;
            }
            //经营者性质
        /*    var entpNatureText = $('#entpNatureText').val().trim();
            if(entpNatureText =="" || entpNatureText ==null){
                mui.toast('经营者性质不能为空！', {duration: 'long', type: 'div'});
                return true;
            }*/
        }else{
            //姓名
            var entpName = $('#entpName1').val().trim();
            if(entpName =="" || entpName ==null){
                mui.toast('姓名不能为空！', {duration: 'long', type: 'div'});
                return true;
            }
            //登陆账号
            var userName = $('#userName1').val().trim();
            if(userName =="" || userName ==null){
                mui.toast('登陆账号不能为空！', {duration: 'long', type: 'div'});
                return true;
            }else if(!uPattern.test(userName)){
                mui.toast('请输入1-16位字符(字母,数字)的登陆账号', {duration: 'long', type: 'div'});
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
        }
        ajaxlock = true;
        $.ajax({
            type: "POST",
            url:Route.baseUrl + "/entp/agency/insert",
            contentType: "application/json;charset=UTF-8",
            data: JSON.stringify(funSetPostData4Save()),
            dataType: 'json',
            success: function (data) {
                ajaxlock = false;
                var result = data.result;
                if (result.resultCode == 0) {
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
        var type = $('#customerType').val();
        var baseEntp = {};
        if(type==2){
            baseEntp.supplierNature = "106";
            baseEntp.entpName = $('#entpName').val();
            baseEntp.bizRegNumber = $('#bizRegNumber').val();
            baseEntp.legalRepresentative = $('#legalRepresentative').val();
            baseEntp.contactPerson = $('#contactPerson').val();
            baseEntp.contactDetail = $('#contactDetail').val();
            baseEntp.stallNum = $('#stallNum').val();
            baseEntp.entpType = $('#entpType').val();
            baseEntp.entpNature = $('#entpNature').val();
            //登录名
            baseEntp.systemReserve3=$('#userName').val();
        }else{//个人
            baseEntp.supplierNature = "107";
            baseEntp.entpName = $('#entpName1').val();
            baseEntp.contactDetail = $('#contactDetail1').val();
            baseEntp.bizRegNumber = $('#bizRegNumber1').val();
            baseEntp.stallNum = $('#stallNum1').val();
            baseEntp.entpType = $('#entpType1').val();
            baseEntp.systemReserve3 = $('#userName1').val();
        }
        return baseEntp;
    }
}(mui, jQuery));