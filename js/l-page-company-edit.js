var ajaxlock = false;
(function(mui, $) {
    addDisabledReadonly($("#userName"));

    //得到传过来的id
    var search=location.search;
    var id=search.substring(4);
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
        async:false,
        dataType: "json",
        success: function(data){
            $(data).each(function(index,value){
                value.text= value.codeDtlName;
                value.value=value.codeDtlId;
            });
            mantype.setData(data);
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
        async:false,
        dataType: "json",
        success: function(data){
            $(data).each(function(index,value){
                value.text= value.codeDtlName;
                value.value=value.codeDtlId;
            });
            operatornature.setData(data);
        }
    });
    //保存
	$("#topRight").click(function() {
        if(!FormUtil.validForm()) {
            return;
        }
        //企业名称
        var entpName = $('#entpName').val().trim();
        if(entpName =="" || entpName ==null){
            mui.toast('企业名称不能为空！', {duration: 'long', type: 'div'});
            return true;
        }
        //登陆名称
        var userName = $('#entpName').val().trim();
        if(userName =="" || userName ==null){
            mui.toast('登陆名称不能为空！', {duration: 'long', type: 'div'});
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
        var entpType = $('#entpType').val().trim();
        if(entpType =="" || entpType ==null){
            mui.toast('经营类型不能为空！', {duration: 'long', type: 'div'});
            return true;
        }
        //经营者性质
      /*  var entpNature = $('#entpNature').val().trim();
        if(entpNature =="" || entpNature ==null){
            mui.toast('经营者性质不能为空！', {duration: 'long', type: 'div'});
            return true;
        }*/
      /*  var entpAddress = $('#entpAddress').val().trim();
        if(entpAddress =="" || entpAddress ==null){
            mui.toast('公司地址不能为空！', {duration: 'long', type: 'div'});
            return true;
        }*/
        if (ajaxlock) {
            return;
        }
        ajaxlock = true;
        $.ajax({
            type: "POST",
            url:Route.baseUrl + "/entp/agency/update",
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
                    mui.toast("身份证号码已存在!", {duration: 'long', type: 'div'});
                } else if (result.resultCode == "2") {
                    mui.toast("经营户名称已存在!", {duration: 'long', type: 'div'});
                } else if (result.resultCode == "3") {
                    mui.toast("请输入正确的企业主体二维码!", {duration: 'long', type: 'div'});
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
        baseEntp.supplierNature = "106";
        baseEntp.entpName = $('#entpName').val();
        baseEntp.bizRegNumber = $('#bizRegNumber').val();
        baseEntp.legalRepresentative = $('#legalRepresentative').val();
        baseEntp.contactPerson = $('#contactPerson').val();
        baseEntp.contactDetail = $('#contactDetail').val();
        baseEntp.stallNum = $('#stallNum').val();
        baseEntp.entpType = $('#entpType').val();
        baseEntp.id = id;
        baseEntp.entpNature = $('#entpNature').val();
        baseEntp.entpQrCode = $('#entpQrCode').val();
        baseEntp.otherId = $('#otherId').val();
        //登录名
        baseEntp.systemReserve3=$('#userName').val();
        baseEntp.systemReserve2=$('#userName').data("val");
        return baseEntp;
    }

    /**
     * 编辑模式
     */
        $.ajax({
            type: 'GET',
            url: Route.baseUrl +'/entp/agency/selectOne',
            data: {'id': id},
            dataType: 'json',
            success: function (result) {
                $('#bizRegNumber').val(result.entp.bizRegNumber);
                $('#id').val(result.entp.id);
                $('#entpName').val(result.entp.entpName);
                $('#entpType').val(result.entp.entpType);
                $('#contactDetail').val(result.entp.contactDetail);
                $('#stallNum').val(result.entp.stallNum);
                $('#entpQrCode').val(result.entp.entpQrCode);
                $('#otherId').val(result.entp.otherId);
                $('#legalRepresentative').val(result.entp.legalRepresentative);
                $('#contactPerson').val(result.entp.contactPerson);
               // $('#userName').val(result.entp.systemReserve3);
                $('#userName').val(result.entp.systemReserve3).data("val",result.entp.systemReserve2);

                var type = mantype.pickers[0].items;
                $.each(type, function (i, rowData) {
                    if(rowData.value == result.entp.entpType){
                        mantype.pickers[0].setSelectedValue(rowData.value, 200);
                        $('#entpTypeText').val(rowData.text);
                        $('#entpType').val(rowData.value);
                    }
                });
                var nature = operatornature.pickers[0].items;
                $.each(nature, function (i, rowData) {
                    if(rowData.value == result.entp.entpNature){
                        operatornature.pickers[0].setSelectedValue(rowData.value, 200);
                        $('#entpNatureText').val(rowData.text);
                        $('#entpNature').val(rowData.value);
                    }
                });
            },
            error: function (err) {
                mui.toast(err, {duration: 'long', type: 'div'});
            }
        });
}(mui, jQuery));