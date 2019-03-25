var initUpfileTotal = ComConst.INIT_UPFILE_TOTAL;
var maxUpfileTotal = 6;

(function (mui, $) {

    mui('.mui-scroll-wrapper').scroll();


    //检测类型
    var id = UrlParam.getParam('id');

    var detectionBase = {detectionBase: {}};


    var detectionTypePicker = new mui.PopPicker();
    var qualified = new mui.PopPicker();


    //同步方便以下赋值
    if (id) {
        $.ajax({
            cache: false,
            type: 'get',
            async: false,
            url: Route.baseUrl +"/batch/detection/selectOne",
            data: {
                detectionId: id
            },
            success: function (data) {
                if (data && data.detectionBase) {
                    detectionBase = data;
                    $("#detectionNo").val(detectionBase.detectionBase.detectionNo);
                    $("#detectionName").val(detectionBase.detectionBase.detectionName);
                    $("#detectionDate").val(detectionBase.detectionBase.detectionDate).data("val", detectionBase.detectionBase.detectionDate);
                    $("#detectionGist").val(detectionBase.detectionBase.detectionGist);
                    $("#detectionMechanism").val(detectionBase.detectionBase.detectionMechanism);
                }

                if(data && data.images){
                    initImages(data.images);
                }

            }
        });
        $.ajax({
            cache: false,
            type: 'get',
            async: false,
            url: Route.baseUrl +"/batch/detection/getBatchBydetectionId",
            data: {
                pageSize: 10,
                pageNumber: 1,
                detectionId: id
            },
            success: function (data) {
                if (data && data.list && data.list.length > 0) {
                    addRows(data.list);
                }
            }
        });
    }else{
        var date=new Date().format("yyyy-MM-dd hh:mm:ss");
        $("#detectionDate").val(date).data("val", date);
    }


    function addRows(data, field) {
        $.each(data, function (index, value) {
            var dtpl = $(detection_detail_tpl);
            dtpl.find(".commodityCode").html(value.productNo);
            dtpl.find(".commodityName").html(value.productName);
            dtpl.find(".batchInp").val(value.productionPeriodStr);
            $(".product-detail.IncomingInfo").append(dtpl);
            dtpl.data("row", value);
        })
        $('.productChoiceDialog').hide();
        common.toggleDisplay();
    }

    setData(detectionTypePicker, null, [{
        id: '101',
        text: '型式检测'
    }, {
        id: '102',
        text: '出厂检测'
    }, {
        id: '103',
        text: '入场检测'
    }, {
        id: '104',
        text: '过程检测'
    }], null, {
        id: detectionBase.detectionBase.detectionType || "101",
        container: $("#detectionType")
    });
    $("#detectionType-picker").click(function () {
        var This = this;
        detectionTypePicker.show(function (items) {
            $("#detectionType").val(items[0].text).data("val", items[0].id);
        });
    });

    //经营户
    if(common.isOperating) {
        //operatingUrl = operatingUrl + '?parentEntpId=' + StorageItem.getParentEntpId();
        $('#agency').val(StorageItem.getUserName());
        $('#agency').data("val", StorageItem.getEntpId());
        if(StorageItem.getEntpId()){
            setSelectedEnable(StorageItem.getEntpId());
            loadOnSaleProduct({
                agencyId: StorageItem.getEntpId()
            });
        }
        addDisabledReadonly($("#agency"));
    } else {
        //经营户
        var operatinghouseholds = new mui.PopPicker();
        var operatingUrl = '/batch/detection/getAgencyByEntpId';
        setData(operatinghouseholds, 'entpName', operatingUrl, null, {
            id: detectionBase.detectionBase.belongEntpId,
            container: $("#agency"),
            fn: function (data, item) {
                setSelectedEnable(item.id);
                if (item.id) {
                    loadOnSaleProduct({
                        agencyId: item.id
                    });
                }
            }
        });
        if (!id) {
            $("#operating-households").click(function () {
                var This = this;
                operatinghouseholds.show(function (items) {
                    if(items[0].id){
                        if($("#agency").data("val")!=items[0].id){
                            $(".product-detail.IncomingInfo").empty();
                        }
                        $("#agency").val(items[0].text).data("val", items[0].id);
                        setSelectedEnable(items[0].id);
                        loadOnSaleProduct({
                            agencyId: items[0].id
                        });
                    }
                });
            });
        }else{
            addDisabledReadonly($("#agency"));
        }
    }

    //检测员
    var registrant = new mui.PopPicker();

    var registrantUrl = '/batch/detection/getEmployeeSelect';

    if (common.isOperating) {
        registrantUrl = registrantUrl + '?parentEntpId=' + StorageItem.getParentEntpId();
    }

    setData(registrant, 'fullName', registrantUrl, null, {
        id: detectionBase.detectionBase.employeeId,
        container: $("#employeeId")
    });
    $("#registrant").click(function () {
        var This = this;
        registrant.show(function (items) {
            if(items[0].id){
                $("#employeeId").val(items[0].text).data("val", items[0].id);
            }
        });
    });

    //是否合格qualified
    setData(qualified, null, [{
        id: '101',
        text: '合格'
    }, {
        id: '102',
        text: '不合格'
    }], null, {
        id: detectionBase.detectionBase.isQualified || "101",
        container: $("#isQualified")
    });
    $("#qualified").click(function () {
        var This = this;
        qualified.show(function (items) {
            $("#isQualified").val(items[0].text).data("val", items[0].id);
        });
    });

    //出库 时间 选择初始化
    $("#purchase-time").click(function () {
        var This = this;
        var optionsJson = this.getAttribute('data-options') || '{}';
        var options = JSON.parse(optionsJson);
        This.picker = new mui.DtPicker(options);
        This.picker.show(function (rs) {
            $("#detectionDate").val(rs.text).data("val", rs.text);
            This.picker.dispose();
            This.picker = null;
        });
    });

    function setSelectedEnable(id) {
        if(id){
            $("#offCanvasShow").removeClass("product-none");
        }
    }

    //最新批次选择 初始化
    var batchInpPicker = new mui.PopPicker();
    // $('.batch-tap').each(function (i, batchInp) {
    //     $(batchInp).click(function () {
    //         var This = this;
    //         batchInpPicker.show(function (items) {
    //             $(This).children("input").val(items[0].text);
    //         });
    //     });
    // });

    $(".product-detail").on("click", ".batch-tap", function () {
        var This = this;
        var row = $(This).closest(".itemBox").data("row")
        setData(registrant, 'collectDate', '/batch/detection/getBatchListByProductId', {
            productId: row.id,
            entpJyhId: detectionBase.detectionBase.belongEntpId || $("#agency").data("val")
        }, {
            success: function (data) {
                $.each(data, function (index, value) {
                    value.text = value['productionPeriodStr'];
                })
                batchInpPicker.setData(data);
                batchInpPicker.show(function (items) {
                    $(This).children("input[name='batchId']").val(items[0].text).data("val", items[0].id);
                    row.batchId = items[0].batchBaseId;
                });
            }
        });

    })

    //品种
    $.ajax({
        cache: false,
        type: 'get',
        url: Route.baseUrl +"/product/getTianJinVarietyList",
        success: function (data) {
            $(".product-variety").empty();
            $.each(data, function (index, value) {
                var ptpl = $(variety_tpl);
                ptpl.find(".product-id").val(value.id);
                ptpl.find(".product-no").html(value.varietyNo);
                ptpl.find(".product-name").html(value.varietyName);
                $(".product-variety").append(ptpl);
            })
            $(".product-variety").data("length",data.length);
        }
    });
    //点击删选关闭侧滑抽屉
    $("#filterBtn").on('click', function (event) {
        var varietyIds = $(".product-variety input[type=checkbox]:checked").map(function () {
            return $(this).val();
        }).get();
        var length=$(".product-variety").data("length");
        if(length==varietyIds.length){
            varietyIds=[];
        }
        loadOnSaleProduct({
            agencyId: $("#agency").data("val"),
            queryContent: $("#product-sku").val(),
            varietyIds: varietyIds.join(",")
        });
        $(".varietyChoiceDialog").hide();
		fnClose();
    });

    $("#resetBtn").on('click', function (event) {
        $(".product-variety input[type=checkbox]:checked").prop("checked", false);
        $("#product-sku").val(null);
        $("#filterBtn").trigger("click");
        $(".varietyChoiceDialog").hide();
    });

    $("#searchProductBtn").on('click' , function(event){
        var varietyIds = $(".product-variety input[type=checkbox]:checked").map(function () {
            return $(this).val();
        }).get();
        loadOnSaleProduct({
            agencyId: $("#agency").data("val"),
            queryContent: $("#product-sku").val(),
            varietyIds: varietyIds.join(",")
        });
        $(".varietyChoiceDialog").hide();
    });
	
    function loadOnSaleProduct(data) {
        $.ajax({
            cache: false,
            type: 'get',
            url:Route.baseUrl + "/batch/detection/fmarket/getAllKindHasBatch",
            data: data,
            success: function (data) {
                $(".product-list").empty();
                $.each(data, function (index, value) {
                    var ptpl = $(product_tpl);
                    ptpl.find(".product-id").val(value.id);
                    ptpl.find(".product-no").html(value.productNo);
                    ptpl.find(".product-name").html(value.productName);
                    $(".product-list").append(ptpl);
                    ptpl.data("row", value);
                })
                common.toggleDisplay();
            }
        });
    }

    $("button.product-confirm").click(function () {
        var rows = [];
        var productIdArray = $('.product-detail.IncomingInfo .itemBox').map(function () {
            return $(this).data("row").id;
        }).get();
        $(".product-list input[type=checkbox][name='productId']:checked").each(function () {
            var row = $(this).closest("li").data("row");
            if ($.inArray(row.id, productIdArray) < 0) {
                rows.push(row.id);
            }
        });
        if (rows.length > 0) {
            $.ajax({
                url: Route.baseUrl +"/batch/detection/getLastBatchByProductIdList",
                data: JSON.stringify({
                    productNameList: rows
                }),
                type: "POST",
                contentType: "application/json;charset=UTF-8",
                dataType: 'json',
                success: function (data) {
                    if ($.isArray(data)) {
                        addRows(data);
                    }
                }
            });
        } else {
            $('.productChoiceDialog').hide();
        }
    });

    var _lock=false;
    $("#topRight").click(function () {
        if(_lock){
            return;
        }
        _lock=true;
        try {
            mui.showLoading("保存中..","div"); //加载文字和类型，plus环境中类型为div时强制以div方式显示
            var detectionBaseIn = {
                belongEntpId: $("#agency").data("val"),
                detectionDate: $("#detectionDate").data("val"),
                detectionGist: $("#detectionGist").val(),
                detectionMechanism: $("#detectionMechanism").val(),
                detectionName: $("#detectionName").val(),
                detectionNo: $("#detectionNo").val(),
                detectionType: $("#detectionType").data("val"),
                employeeId: $("#employeeId").data("val"),
                id: id || "",
                isQualified: $("#isQualified").data("val")
            }
            var detectionBatches = [];
            $(".product-detail.IncomingInfo .itemBox").each(function () {
                var row = $(this).data("row");
                detectionBatches.push({
                    batchId: row.batchId,
                    productId: row.id
                });
            })
            var requestPayload = {
                detectionBase: detectionBaseIn,
                detectionImage: getFileIds(),
                detectionBatches: detectionBatches,
                hdnId: id || ""
            };
            if(!validate(detectionBaseIn,{
                belongEntpId:"经营户不能为空",
                detectionType:"检测类型不能为空",
                detectionName:"检测名称不能为空",
                detectionNo:"检测编号不能为空",
                employeeId:"检测员不能为空",
                isQualified:"是否合格不能为空",
                detectionDate:"检测日期不能为空"
            })){
                mui.hideLoading();//隐藏后的回调函数
                _lock=false;
                return;
            }
            if(detectionBatches.length<1){
                mui.alert("检测明细不能为空", 'Error', function () {
                });
                mui.hideLoading();//隐藏后的回调函数
                _lock=false;
                return;
            }
            console.log(requestPayload)
            $.ajax({
                type: 'post',
                url: id ? Route.baseUrl + "/batch/detection/updateDetectionInfo" : Route.baseUrl + "/batch/detection/insert",
                contentType: "application/json;charset=UTF-8",
                dataType: 'json',
                data: JSON.stringify(requestPayload),
                complete:function(){
                    mui.hideLoading();//隐藏后的回调函数
                },
                success: function (data) {
                    if (data && data.result && data.result.resultCode == 9) {
                        _lock=false;
                        mui.alert('发生未知错误，请与管理员联系', 'Error', function () {
                        });
                    } else {
                        // window.location.href=document.referrer;
                        // window.location.href = "m-page-3.html";
                        var url = UrlParam.getParam('source')=="index"?"index.html":"m-page-3.html";
                        mui.openWindow({
                            url: url,
                            createNew: true,
                            styles: {
                                cachemode:"noCache"
                            }
                        });
                    }
                },
                error:function () {
                    _lock=false;
                }
            });
        }catch (e) {
            mui.hideLoading();//隐藏后的回调函数
            _lock=false;
        }
    });

    //删除弹窗
    $('.product-detail.IncomingInfo').on('tap', '.mui-btn', function (event) {
        var row = jQuery(this).closest("li").data("row");
        var elem = this;
        var li = elem.parentNode.parentNode;
        (function (row, li) {
            mui.confirm('确认删除？', '删除确认', CONFIRM_BTN_LIST, function (e) {
                if (e.index == CONFIRM_BTN_YES) {
                    var row = $(li).data("row");
                    console.log(row)
                    li.remove();
                    common.toggleDisplay();
                } else {
                    setTimeout(function () {
                        mui.swipeoutClose(li);
                    }, 0);
                }
            });
        }(row, li))
    });

    //上传图片
    var upload = document.getElementById('upload'),
        addPictures = document.getElementById('addPictures');
    upload.addEventListener('change', handleFile, false);

}(mui, jQuery));


//选择图片
function handleFile() {
    if(initUpfileTotal == maxUpfileTotal){
        mui.toast('上传限制，最多上传' + maxUpfileTotal + '张图片！', {duration: 'long', type: 'div'});
        return false;
    }
    window.URL = window.URL || window.webkitURL;
    var sUserAgent = navigator.userAgent.toLowerCase();
    var selected_file = upload.files[0];
    var fileSize = selected_file.size;
    if(fileSize > 5242880){
        mui.toast('请勿上传超过5M的图片！', {duration: 'long', type: 'div'});
        return false;
    }
    if (sUserAgent.match(/android/i) == "android") {
        if(fileSize/1024 > 1025) { //大于1M，进行压缩上传
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
        if(fileSize/1024 < 1025) { //小于1M，直接上传
            var img = new Image();
            img.src = window.URL.createObjectURL(selected_file);
            var reader = new FileReader();
            reader.onload = function(e) {
                imgurl = e.target.result;
            };
            reader.readAsDataURL(selected_file);
            //每选择一次上传一次
            FileUtil.uploadFile(selected_file , function (result) {
                $("#addPictures").append('<li><img onclick="FileUtil.enlargeImg()" id="'+ result.id +'" src="'+result.url+'" ><div class="mui-icon mui-icon-closeempty"></div></li>');
                initUpfileTotal ++;
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
        if (fileSize / 1024 < 1025) {
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
        if(fileSize/1024 > 1025) { //大于1M，进行压缩上传
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
        var detectionImage = {};
        var id = jQuery(rowData).attr('id');
        if(id == '' || id == null || id == undefined){
            return true;
        }
        detectionImage.fileInfoId = id;
        fileIds.push(detectionImage);
    });
    return fileIds;
}

function initImages(images) {
    $.each(images, function (i, rowData) {
        FileUtil.getFileFullPath(rowData.fileInfoId , function (fileFullPath) {
            if (rowData.fileInfoId) {
                //修改状态下，有图片的情况下，显示图片
                var brick = '<li><img onclick="FileUtil.enlargeImg()" id="'+ rowData.fileInfoId +'" src="' + fileFullPath+ '">'
                brick += '<div class="mui-icon mui-icon-closeempty"></div></li>'
                $('#addPictures').append(brick);
                initUpfileTotal ++ ;
                addp(rowData.fileInfoId);
            }
        });
    });
}