var ajaxlock = false;
var initUpfileTotal = ComConst.INIT_UPFILE_TOTAL;
var maxUpfileTotal = 6;
(function(mui, $) {
	//产品品类pro-category
	var procategory = new mui.PopPicker();
	$("#pro-category").click(function() {
		var This = this;
		procategory.show(function(items) {
			$(This).children("input").val(items[0].text);
            $("#varieties").val(items[0].value);
		});
	});
    $.ajax({
        type: "GET",
        url: Route.baseUrl +"/product/getTianJinVarietyList",
        dataType: "json",
        success: function(data){
            $.each(data ,function(index,value){
                value.text= value.varietyName;
                value.value=value.id;
            });
            procategory.setData(data);
        }
    });
	//供应商pro-supplier
	var prosupplier = new mui.PopPicker();
	$("#pro-supplier").click(function() {
		var This = this;
        prosupplier.show(function(items) {
			$(This).children("input").val(items[0].text);
            $("#supplier").val(items[0].value);
		});
	});
    $.ajax({
        type: "GET",
        url:Route.baseUrl + "/product/getSupplierByEntpId",
        dataType: "json",
        success: function(data){
            $(data).each(function(index,value){
                value.text= value.entpName;
                value.value=value.id;
            });
            prosupplier.setData(data);
        }
    });
	//产品类型
	var protype = new mui.PopPicker();
	//设置默认选中
    $("#productTypeText").val("预包装");
    $("#productType").val("101");
	protype.setData([{
		value: '101',
		text: '预包装'
	}, {
		value: '102',
		text: '散货'
	}, {
		value: '103',
		text: '标品'
	}]);
	$("#pro-type").click(function() {
		var This = this;
		protype.show(function(items) {
			$(This).children("input").val(items[0].text);
            $("#productType").val(items[0].value);
		});
	});

	//保存
	$("#topRight").click(function() {
        if (ajaxlock) {
            return;
        }
        //校验
        if(!FormUtil.validForm()) {
            return;
        }
        //产品编号
        var productNo = $('#productNo').val().trim();
        if(productNo =="" || productNo ==null){
            mui.toast('产品sku编码不能为空！', {duration: 'long', type: 'div'});
            return true;
        }
        //产品名称
        var productName = $('#productName').val().trim();
        if(productName =="" || productName ==null){
            mui.toast('产品名称不能为空！', {duration: 'long', type: 'div'});
            return true;
        }
        //所属品种（下拉）
        var varietyId = $('#varietiesText').val().trim();
        if(varietyId =="" || varietyId ==null){
            mui.toast('品类不能为空！', {duration: 'long', type: 'div'});
            return true;
        }
        //供应商
        var supplierId = $('#supplierText').val().trim();
        if(supplierId =="" || supplierId ==null){
            mui.toast('供应商不能为空！', {duration: 'long', type: 'div'});
            return true;
        }
        ajaxlock = true;
        $.ajax({
            type: 'POST',
            url :Route.baseUrl +'/product/inserts',
            data: JSON.stringify(funSetPostData4Save()),
            dataType: 'json',
            contentType: "application/json;charset=UTF-8",
            success: function (result) {
                ajaxlock = false;
                result = result.result;
                if (result.resultCode === 0) {
                    mui.openWindow({
                        url: 'l-page-0.html',
                        createNew: true,
                        styles: {
                            cachemode:"noCache"
                        }
                    });
                }else if (result.resultCode == 1) {
                    mui.toast('商品编号已存在!', {duration: 'long', type: 'div'});
                }  else {
                    mui.toast(result.errMsgList, {duration: 'long', type: 'div'});
                }
            },
            error: function () {
                ajaxlock = false;
            }
        });
	});
    /**
     * 将界面信息封装到这里
     * @returns {{}}
     */
    function funSetPostData4Save() {
        var postData = {};
        // 产品基本信息
        postData.productAllInfo = setProductAllInfo();
        //产品图片信息
        postData.productImgList = setProductImgList();
        return postData;
    }
    /**
     * 设置产品详情
     * @constructor
     */
    function setProductAllInfo() {
        var kind = {};
        //产品编号
        kind.productNo = $('#productNo').val();
        //产品名称
        kind.productName = $('#productName').val();
        //所属品种（下拉）
        kind.varietyId = $('#varieties').val();
        //供应商
        kind.supplierId = $('#supplier').val();
        //产地
        kind.systemReserve2 = $('#systemReserve2').val();
        //产品类型(下拉)
        kind.productType = $('#productType').val();
        //产品品牌
        kind.productBrand = $('#productBrand').val();
        //保质期
        kind.durabilityDay = $('#durabilityDay').val();
        //产品单价
        kind.productPrice = $('#productPrice').val();

        kind.productQrCode = $('#productQrCode').val();
        //产品图片
        kind.productImgList = setProductImgList();

        return kind;
    }

    //上传图片
    var upload = document.getElementById('upload'),
        addPictures = document.getElementById('addPictures');
    upload.addEventListener('change', handleFile, false);
    //选择图片
    function handleFile() {
        if(initUpfileTotal == maxUpfileTotal){
            mui.toast('上传限制，最多上传'+maxUpfileTotal+'张图片！', {duration: 'long', type: 'div'});
            return false;
        }
        window.URL = window.URL || window.webkitURL;
        var sUserAgent = navigator.userAgent.toLowerCase();
        var selected_file = upload.files[0];
        var ssize =selected_file.size;
        if(ssize >5242880){
            mui.toast('请勿上传超过5M的图片！', {duration: 'long', type: 'div'});
            return false;
        }
        if (sUserAgent.match(/android/i) == "android") {
            if(ssize/1024 > 1025) { //大于1M，进行压缩上传
                FileUtil.photoCompressForAndroid(selected_file, {
                    quality: 0.2
                }, function (base64Codes) {
                    var fileName = selected_file.name;
                    var file = FileUtil.convertBase64UrlToBlob(base64Codes,fileName);
                    //每选择一次上传一次
                    FileUtil.uploadFile(file, function (result) {
                        $("#addPictures").append('<li><img onclick="FileUtil.enlargeImg()" id="' + result.id + '" src="' + result.url + '" ><div class="mui-icon mui-icon-closeempty"></div></li>');
                        addp(result.id);
                        initUpfileTotal++;
                    });
                });
            }
            if(ssize/1024 < 1025) { //小于1M，直接上传
                var img = new Image();
                img.src = window.URL.createObjectURL(selected_file);
                var reader = new FileReader();
                reader.onload = function (e) {
                    imgurl = e.target.result;
                };
                reader.readAsDataURL(selected_file);
                //每选择一次上传一次
                FileUtil.uploadFile(selected_file, function (result) {
                    $("#addPictures").append('<li><img onclick="FileUtil.enlargeImg()" id="' + result.id + '" src="' + result.url + '" ><div class="mui-icon mui-icon-closeempty"></div></li>');
                    initUpfileTotal++;
                    addp(result.id);
                });
            }
        } else {
            //判断文件类型是否为图片
            var imageType = /image.*/;
            if (!selected_file.type.match(imageType)) {
                return false;
            }
            var img = document.createElement('img');
            if(ssize/1024 > 1025) { //大于1M，进行压缩上传
                FileUtil.photoCompress(selected_file, {
                    quality: 0.2
                }, function (base64Codes) {
                    var fileName = selected_file.name;
                    var file = FileUtil.convertBase64UrlToBlob(base64Codes,fileName);
                    //每选择一次上传一次
                    FileUtil.uploadFile(file, function (result) {
                        $("#addPictures").append('<li><img onclick="FileUtil.enlargeImg()" id="' + result.id + '" src="' + result.url + '" ><div class="mui-icon mui-icon-closeempty"></div></li>');
                        addp(result.id);
                        initUpfileTotal++;
                    });
                });
            }
            if(ssize/1024 < 1025) { //小于1M，直接上传
                img.onload = function () {
                    imgurl = img.src;
                }
                var reader = new FileReader();
                reader.onload = function (e) {
                    img.src = e.target.result;
                };
                reader.readAsDataURL(selected_file);
                //每选择一次上传一次
                FileUtil.uploadFile(selected_file, function (result) {
                    $("#addPictures").append('<li><img onclick="FileUtil.enlargeImg()" id="' + result.id + '" src="' + result.url + '" ><div class="mui-icon mui-icon-closeempty"></div></li>');
                    initUpfileTotal++;
                    addp(result.id);
                });
            }
        }
    }
    //移除图片
    function addp(id){
        $('#' + id).next("div").click(function(){
            $(this).parent().remove();
            initUpfileTotal --;
            if(initUpfileTotal < 0){
                initUpfileTotal = 0;
            }
        });
    }

    /**
     * 获取已经上传的文件的ID
     * @returns {Array}
     */
    function getFileIds() {
        var fileIds = [];
        var fileItemList = $("#addPictures").find('img');
        $.each(fileItemList, function (i, rowData) {
            var id = jQuery(rowData).attr('id');
            if(id == '' || id == null || id == undefined){
                return true;
            }
            fileIds.push(id);
        });
        return fileIds;
    }

    /**
     * 设置图片
     * @returns {Array}
     */
    function setProductImgList(){
        var fileIds = getFileIds();
        var productImgList = [];
        $.each(fileIds, function (i, rowData) {
            var productImg = {};
            productImg.productId = "";
            productImg.fileInfoId = rowData;
            productImg.showOrder = i;
            productImgList.push(productImg);
        });
        return productImgList;
    }
}(mui, jQuery));

