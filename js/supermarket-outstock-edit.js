(function (mui, $) {
    mui('.mui-scroll-wrapper').scroll();

    //收货单位
    var id = UrlParam.getParam('id');
    var copy = UrlParam.getParam('copy')=="true";

    var outstock = {
        agencyInfo: {},
        result: {}
    };
    var quickTraceEmployee={};
    if(common.isQuickTrace()){
        $.ajax({
            type: "GET",
            async: false,
            url: Route.baseUrl + "/stock/flashoutstock/getCurrentUserName",
            contentType: "application/json;charset=UTF-8",
            dataType: 'json',
            success: function (data) {
                quickTraceEmployee={
                    employeeId:data.employee.id,
                    fullName:data.employee.fullName
                }
            }
        });
    }


    //同步方便以下赋值
    if (id) {
        $.ajax({
            cache: false,
            type: 'get',
            async: false,
            url: Route.baseUrl +"/stock/outstock/getOutstockBase/" + id,
            success: function (data) {
                if (data && data.agencyInfo) {
                    outstock = data;
                    $("#contactDetail").val(outstock.result.contactDetail);
                    $("#contactPerson").val(outstock.result.contactPerson);
                    $("#plateNumber").val(outstock.result.plateNumber);
                    $("#deliveryman").val(outstock.result.deliveryman);
                    var date = copy ? new Date().format("yyyy-MM-dd hh:mm:ss"):outstock.result.outstockDate;
                    $("#outstockDate").val(date).data("val", date);
                }
            }
        });
        if(copy){
            $.ajax({
                url:Route.baseUrl + "/stock/outstock/getRecentBatchInfoByOutstockId",
                data:{
                    outstockId : id
                },
                type: "POST",
                dataType: 'json',
                success: function (data) {
                    if (data && data.result && data.result.resultCode == 9) {
                        return;
                    }
                    addRows(data);
                }
            });
        }else{
            $.ajax({
                cache: false,
                type: 'get',
                url: common.isQuickTrace()? Route.baseUrl + "/stock/flashoutstock/getOutstockDetails": Route.baseUrl + "/stock/outstock/getOutstockDetailList",
                data: {
                    pageSize: 1000,
                    pageNumber: 1,
                    outstockId: id,
                    outstockBaseId: id
                },
                success: function (data) {
                    if (data && data.list && data.list.length > 0) {
                        $.each(data.list, function (index, value) {
                            value.collectDate = value.sysRegTmsp;
                        });
                        addRows(data.list);
                    }
                }
            });
        }
    }else{
        var date=new Date().format("yyyy-MM-dd hh:mm:ss");
        $("#outstockDate").val(date).data("val", date);
    }
    var supplier = new mui.PopPicker();
    setData(supplier, 'customerName', '/stock/outstock/getCustomerByEntpId', null, {
        id: outstock.result.entpOrCustom,
        container: $("#supplierEntpId")
        // fn: function (data, item) {
        //     if (item.id) {
        //         loadOnSaleProduct({
        //             supplierEntpId: item.id
        //         });
        //     }
        // }
    });
    $("#supplier").click(function () {
        var This = this;
        supplier.show(function (items) {
            if(items[0].id){
                $("#supplierEntpId").val(items[0].text).data("val", items[0].id);
                setContactDetail(items[0]);
            }
        });
    });

    function setContactDetail(item) {
        $.ajax({
            cache: false,
            type: 'get',
            url: Route.baseUrl +"/stock/outstock/getCustomerPhone",
            data: {
                "idList[]": item.id
            },
            success: function (data) {
                if (data && data.length > 0) {
                    $("#contactDetail").val(data[0].contactDetail);
                }
            }
        });

    }


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
            supplierEntpId: $("#supplierEntpId").data("val"),
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
            supplierEntpId: $("#supplierEntpId").data("val"),
            queryContent: $("#product-sku").val(),
            varietyIds: varietyIds.join(",")
        });
        $(".varietyChoiceDialog").hide();
    });

    loadOnSaleProduct();

    function loadOnSaleProduct(data) {
        $.ajax({
            cache: false,
            type: 'get',
            data: data,
            url: Route.baseUrl +"/stock/outstock/getBatchedProduct",
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
            return $(this).data("row").productId;
        }).get();
        $(".product-list input[type=checkbox][name='productId']:checked").each(function () {
            var row = $(this).closest("li").data("row");
            if ($.inArray(row.id, productIdArray) < 0) {
                rows.push(row.id);
            }
        });
        if (rows.length > 0) {
            $.ajax({
                url: Route.baseUrl +"/stock/outstock/getRecentBatchInfoByProductIdList",
                data: JSON.stringify({
                    productNameList: rows
                }),
                type: "POST",
                contentType: "application/json;charset=UTF-8",
                dataType: 'json',
                success: function (data) {
                    if (data && data.result && data.result.resultCode == 9) {
                        return;
                    }
                    addRows(data);
                }
            });
        } else {
            $('.productChoiceDialog').hide();
        }
    });

    function addRows(data, field) {
        $.each(data, function (index, value) {
            var dtpl = $(outstock_detail_tpl);
            dtpl.find(".commodityCode").html(value.productNo);
            dtpl.find(".commodityName").html(value.productName);
            dtpl.find("input[name='batchId']").val(value.collectDate);
            dtpl.find(".selectNum").val(value.quantity || 0);
            dtpl.find(".selectMoney").val(value.price || 0);
            $(".product-detail.IncomingInfo").append(dtpl);
            dtpl.data("row", value);
        })
        $('.productChoiceDialog').hide();
        common.toggleDisplay();
    }

    //登记人registrant
    var registrant = new mui.PopPicker();
    setData(registrant, 'fullName', '/stock/outstock/getEmployeeByEntpId', null, {
        id: common.isQuickTrace() ? quickTraceEmployee.employeeId : (outstock.result.employeeId || StorageItem.getEmployeeId()),
        container: $("#employeeId")
    });

    if(common.isQuickTrace()){
        $("#employeeId").val(quickTraceEmployee.fullName).data("val", quickTraceEmployee.employeeId);
    }else{
        $("#registrant").click(function () {
            var This = this;
            registrant.show(function (items) {
                if(items[0].id){
                    $("#employeeId").val(items[0].text).data("val", items[0].id);
                }
            });
        });
    }


    //出库 时间 选择初始化
    $("#purchase-time").click(function () {
        var This = this;
        var optionsJson = this.getAttribute('data-options') || '{}';
        var options = JSON.parse(optionsJson);
        This.picker = new mui.DtPicker(options);
        This.picker.show(function (rs) {
            $("#outstockDate").val(rs.text).data("val", rs.text);
            This.picker.dispose();
            This.picker = null;
        });
    });


    // 最新批次选择 初始化
    var batchInpPicker = new mui.PopPicker();
    $(".product-detail").on("click", ".InfoBox.aDisabled", function () {
        var This = this;
        var row = $(This).closest(".itemBox").data("row")
        setData(registrant, 'collectDate', '/stock/outstock/getBatchListByProductId/' + row.productId, null, {
            success: function (data) {
                $.each(data, function (index, value) {
                    value.text = value['collectDate'];
                })
                batchInpPicker.setData(data);
                batchInpPicker.show(function (items) {
                    $(This).children("input[name='batchId']").val(items[0].text).data("val", items[0].id);
                    row.batchId = items[0].id;
                });
            }
        });

    })

    var _lock=false;
    $("#topRight").click(function () {
        if(_lock){
            return;
        }
        _lock=true;
        try {
            if(copy){
                id="";
            }
            mui.showLoading("保存中..","div"); //加载文字和类型，plus环境中类型为div时强制以div方式显示
            var baseOutstockBase = {
                contactDetail: $('#contactDetail').val(),
                contactPerson: $('#contactPerson').val(),
                employeeId: $('#employeeId').data("val"),
                // entpId: $('#supplierEntpId').data("val"),
                entpOrCustom: $('#supplierEntpId').data("val"),
                plateNumber: $('#plateNumber').val(),
                id: id || "",
                outstockNo:outstock.result.outstockNo
            }
            var outStockDate = $("#outstockDate").data("val");
            if(!validate(baseOutstockBase,{
                // entpId:"经营户不能为空",
                // entpOrCustom:"收货单位不能为空",
                employeeId:"登记人不能为空"
            })){
                mui.hideLoading();//隐藏后的回调函数
                _lock=false;
                return;
            }
            if(!outStockDate){
                mui.alert("出货时间不能为空", 'Error', function () {
                });
                mui.hideLoading();//隐藏后的回调函数
                _lock=false;
                return;
            }
            var outstockDetailSaveList = [];
            $(".product-detail.IncomingInfo .itemBox").each(function () {
                var row = $(this).data("row");
                var price = $(this).find("input.selectMoney").val()||0;;
                var quantity = $(this).find("input.selectNum").val()||0;;
                var otherId = "";
                outstockDetailSaveList.push({
                    batchBaseId: row.batchId,
                    otherId: otherId,
                    price: price,
                    quantity: quantity,
                    rootBatchId: row.rootBatchId,
                    detection: row.detection||"false",
                    showNumber: 1
                });
            })
            var requestPayload = {
                opt: id ? "upd" : "ins",
                baseOutstockBase: baseOutstockBase,
                dateString: outStockDate ? outStockDate + ":00" : outStockDate,
                outstockDetailSaveList: outstockDetailSaveList
            };
            if(outstockDetailSaveList.length<1){
                mui.alert("出货明细不能为空", 'Error', function () {
                });
                mui.hideLoading();//隐藏后的回调函数
                _lock=false;
                return;
            }
            console.log(requestPayload)
            if(copy){
                $.each(requestPayload.outstockDetailSaveList,function (index,value) {
                    value.id=null;
                    value.otherId=null;
                });
                requestPayload.opt="ins";
            }
            $.ajax({
                type: 'post',
                url: common.isQuickTrace()? Route.baseUrl + "/stock/flashoutstock/saveOutstock": Route.baseUrl + "/stock/outstock/saveOutstock",
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
                        // window.location.href = "supermarket-outstock.html";
                        var url = UrlParam.getParam('source')=="index"?"index.html":"supermarket-outstock.html";
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
                    if(row.batchBaseId){
                        // deleteBatchList.push(row.batchBaseId);
                    }
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

}(mui, jQuery));