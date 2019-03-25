(function (mui, $) {

    mui('.mui-scroll-wrapper').scroll();

    if (window.location.hash == "#admissionRegistration") {
        $("#globalTitle").text("入场登记");
    }

    var init = true;
    //出库 时间 选择初始化
    $("#purchase-time").click(function () {
        var This = this;
        var optionsJson = this.getAttribute('data-options') || '{}';
        var options = JSON.parse(optionsJson);
        This.picker = new mui.DtPicker(options);
        if (init && instock) {
            This.picker.setSelectedValue(instock.instockDate);
            init = false;
        }
        This.picker.show(function (rs) {
            $("#instockDate").val(rs.text).data("val", rs.text);
            This.picker.dispose();
            This.picker = null;
        });
    });

    var id = UrlParam.getParam('id');
    var copy = UrlParam.getParam('copy')=="true";

    //扫码过来的
    var outstockNo = UrlParam.getParam('outstockNo');
    var scanSupplierEntpId;
    var supplierEnable = id ? false : true;

    var instock = {};
    //同步方便以下赋值
    if (id) {
        $.ajax({
            cache: false,
            type: 'get',
            async: false,
            url: Route.baseUrl +"/stock/instock/getInstockBase",
            data: {
                instockId: id
            },
            success: function (data) {
                if (data && data.id) {
                    instock = data;
                    $("#plateNumber").val(instock.plateNumber);
                    $("#deliveryman").val(instock.deliveryman);
                    $("#agencyId").val(instock.agencyName);
                    $("#agencyId").data("entpId", instock.entpId);
                    var date = copy?new Date().format("yyyy-MM-dd hh:mm:ss"):instock.instockDate;
                    $("#instockDate").val(date).data("val", date);
                }
            }
        });
        $.ajax({
            cache: false,
            type: 'get',
            url:Route.baseUrl + "/stock/instock/fmarket/getInstockDetailInfo",
            data: {
                pageSize: 1000,
                pageNumber: 1,
                instockId: id
            },
            success: function (data) {
                if (data && data.list && data.list.length > 0) {
                    addRows(data.list);
                }
            }
        });
    } else if (outstockNo) {
        $("#offCanvasShow").hide();
        $.ajax({
            cache: false,
            type: 'get',
            async: false,
            data: {
                outStockNo: outstockNo,
                pageSize: 1000,
                pageNumber: 1
            },
            url: Route.baseUrl +"/stock/instock/scanOutStockNo",
            success: function (data) {
                if (!data.hasOwnProperty('result')) {
                    scanSupplierEntpId = data.supplierEntpId;
                    supplierEnable = false;
                    // $("#agencyId").data("entpId", data.supplierEntpId);
                    $("#supplierEntpId").val(data.supplierName).data("val", scanSupplierEntpId)
                    $("#plateNumber").val(data.plateNumber);
                    $("#deliveryman").val(data.deliveryman);
                    var date=new Date().format("yyyy-MM-dd hh:mm:ss");
                    $("#instockDate").val(date).data("val", date);
                }
            }
        });
        $.ajax({
            type: 'get',
            data: {
                outstockNo: outstockNo,
                pageSize: 1000,
                pageNumber: 1
            },
            url:Route.baseUrl + "/stock/instock/getInstockDetailByOutstockNo",
            success: function (data) {
                var rows = [];
                $.each(data.list, function (index, value) {
                    rows.push({
                        'quantity': value.quantity,
                        'productUnit': value.productUnit,
                        'price': value.price,
                        'parentBatchId': value.parentBatchId,
                        'rootBatchBaseId': value.rootBatchBaseId,
                        'productId': value.productId,
                        'productName': value.productName,
                        'productNo': value.productNo,
                        'otherId': value.otherId
                    });
                });
                addRows(rows);
            }
        });
    }else{
        var date=new Date().format("yyyy-MM-dd hh:mm:ss");
        $("#instockDate").val(date).data("val", date);
    }


    //收货单位
    var supplier = new mui.PopPicker();

    var supplierUrl = '/stock/instock/getSupplierSelect';

    if(common.isOperating) {
        supplierUrl = supplierUrl + '?parentEntpId=' + StorageItem.getParentEntpId();
    }

    setData(supplier, 'entpName', supplierUrl, null, {
        id: instock.supplierEntpId,
        container: $("#supplierEntpId"),
        fn:function () {
            if(instock.cityName&&!instock.supplierName){
                $("#supplierEntpId").val(instock.cityName).data("val", "");
            }
        }
    });
    if (supplierEnable) {
        $("#supplier").click(function () {
            var This = this;
            supplier.show(function (items) {
                if(items[0].id){
                    $("#supplierEntpId").val(items[0].text).data("val", items[0].id);
                }
            });
        });
    }else{
        addDisabledReadonly($("#supplierEntpId"));
    }

    //经营户
    if(common.isOperating) {
        //operatingUrl = operatingUrl + '?parentEntpId=' + StorageItem.getParentEntpId();
        $('#agencyId').val(StorageItem.getUserName());
        $('#agencyId').data("val", StorageItem.getEntpId());
        if(StorageItem.getEntpId()){
            setSelectedEnable(StorageItem.getEntpId());
            loadOnSaleProduct({
                agencyId: StorageItem.getEntpId()
            });
        }
        addDisabledReadonly($("#agencyId"));
    } else {
        var operatinghouseholds = new mui.PopPicker();
        var operatingUrl = '/stock/instock/fmarket/getAgencyByMarketId';
        setData(operatinghouseholds, 'entpName', operatingUrl, null, {
            id: instock.entpId,
            container: $("#agencyId"),
            fn: function (data, item) {
                setSelectedEnable(item.id);
                if (item.id && !outstockNo) {
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
                        if(!outstockNo && $("#agencyId").data("val")!=items[0].id){
                            $(".product-detail.IncomingInfo").empty();
                        }
                        $("#agencyId").val(items[0].text).data("val", items[0].id);
                        setSelectedEnable(items[0].id);
                        if (!outstockNo) {
                            loadOnSaleProduct({
                                agencyId: items[0].id
                            });
                        }
                    }
                });
            });
        }else{
            addDisabledReadonly($("#agencyId"));
        }
    }


    function loadOnSaleProduct(data) {
        $.ajax({
            cache: false,
            type: 'get',
            url:Route.baseUrl + "/stock/farmer/getOnSaleProduct",
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

    //登记人registrant
    var registrant = new mui.PopPicker();

    var registrantUrl = '/stock/instock/getEmployeeSelect';

    if (common.isOperating) {
        registrantUrl = registrantUrl + '?parentEntpId=' + StorageItem.getParentEntpId();
    }

    setData(registrant, 'fullName', registrantUrl, null, {
        id: instock.employeeId || StorageItem.getEmployeeId(),
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
            agencyId: $("#agencyId").data("val"),
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
            agencyId: $("#agencyId").data("val"),
            queryContent: $("#product-sku").val(),
            varietyIds: varietyIds.join(",")
        });
        $(".varietyChoiceDialog").hide();
    });

    $("button.product-confirm").click(function () {
        var rows = [];
        var productIdArray = $('.product-detail.IncomingInfo .itemBox').map(function () {
            return $(this).data("row").productId;
        }).get();
        $(".product-list input[type=checkbox][name='productId']:checked").each(function () {
            var row = $(this).closest("li").data("row");
            row.productId = row.id;
            if ($.inArray(row.id, productIdArray) < 0) {
                rows.push(row);
            }
        });
        addRows(rows);
    });

    function setSelectedEnable(id) {
        if(id){
            $("#offCanvasShow").removeClass("product-none");
        }
    }

    function addRows(rows) {
        $.each(rows, function (index, value) {
            var dtpl = $(detail_tpl);
            dtpl.find(".commodityCode").html(value.productNo);
            dtpl.find(".commodityName").html(value.productName);
            dtpl.find(".selectNum").val(value.quantity || 0);
            dtpl.find(".selectMoney").val(value.price || 0);
            $(".product-detail.IncomingInfo").append(dtpl);
            dtpl.data("row", value);
        })
        $('.productChoiceDialog').hide();
        common.toggleDisplay();
    }
    var deleteBatchList = [];

    var _lock=false;
    $("#topRight").click(function () {
        if(_lock){
            return;
        }
        _lock=true;
        try {
            mui.showLoading("保存中..","div"); //加载文字和类型，plus环境中类型为div时强制以div方式显示
            var instockDate = $("#instockDate").data("val");
            instockDate = instockDate ? instockDate + ":00" : instockDate;
            var instockBase = {
                supplierEntpId: $("#supplierEntpId").data("val"),
                agencyId: $("#agencyId").data("val"),
                employeeId: $("#employeeId").data("val"),
                instockDate: instockDate,
                plateNumber: $("#plateNumber").val(),
                deliveryman: $("#deliveryman").val(),
                enterType: "101",
                id: id,
                cityName: instock.cityName,
                entpId: $("#agencyId").data("entpId") || $("#agencyId").data("val")
            }
            var type = {
                supplierEntpId: "供应商不能为空",
                employeeId: "登记人不能为空",
                instockDate: "进货时间不能为空"
            };
            if (!id) {
                type.agencyId = "经营户不能为空";
            }
            if(instock.cityName&&!instock.supplierName){
                delete type["supplierEntpId"];
            }

            if (!validate(instockBase, type)) {
                _lock=false;
                mui.hideLoading();//隐藏后的回调函数
                return;
            }
            var detailList = [];
            var batchBaseList = [];

            $(".product-detail.IncomingInfo .itemBox").each(function () {
                var row = $(this).data("row");
                var price = $(this).find("input.selectMoney").val() || 0;
                var quantity = $(this).find("input.selectNum").val() || 0;
                if (!id || copy) {
                    row.batchBaseId = uuid();
                }
                detailList.push({
                    batchBaseId: row.batchBaseId,
                    rootBatchBaseId: row.rootBatchBaseId,
                    otherId: row.otherId || "",
                    price: price,
                    id: id ? row.id : "",
                    productName: row.productName,
                    productionDate: instockBase.instockDate,
                    quantity: quantity
                });
                batchBaseList.push({
                    rootBatchId: row.rootBatchBaseId,
                    animalCertCode: row.animalCertCode || "",
                    docTraceCode: row.docTraceCode || "",
                    id: row.batchBaseId,
                    insertFlag: row.insertFlag || "1",
                    productId: row.productId,
                    productionPeriodStr: instockBase.instockDate,
                    productionVolume: quantity,
                    traceFlag: row.traceFlag || "101"
                });
            })
            var requestPayload = {
                opt: id ? "upd" : "ins",
                detailList: detailList,
                batchBaseList: batchBaseList,
                deleteBatchList: deleteBatchList,
                instock: instockBase
            };
            if (batchBaseList.length < 1) {
                mui.alert("进货明细不能为空", 'Error', function () {
                });
                _lock=false;
                mui.hideLoading();//隐藏后的回调函数
                return;
            }
            console.log(requestPayload)
            if(!FormUtil.validForm()){
                _lock=false;
                mui.hideLoading();//隐藏后的回调函数
                return;
            }
            var url = outstockNo ? "/stock/instock/fmarket/saveInstockAuto" : "/stock/instock/fmarket/saveInstockByHand";
            if (outstockNo) {
                instockBase.outstockNo = outstockNo;
            }

            if(copy){
                url = "/stock/instock/fmarket/saveInstockByHand";
                requestPayload.instock.id=null;
                $.each(requestPayload.detailList,function (index,value) {
                    value.id=null;
                    value.otherId=null;
                });
                $.each(requestPayload.batchBaseList,function (index,value) {
                    value.id=null;
                })
                requestPayload.opt="ins";
            }
            $.ajax({
                type: 'post',
                url: Route.baseUrl + url,
                contentType: "application/json;charset=UTF-8",
                dataType: 'json',
                data: JSON.stringify(requestPayload),
                complete:function(){
                    mui.hideLoading();//隐藏后的回调函数
                },
                success: function (data) {
                    if (data && data.result.resultCode == 9) {
                        _lock=false;
                        mui.alert('发生未知错误，请与管理员联系', 'Error', function () {
                        });
                    } else {
                        // window.location.href=document.referrer;
                        // window.location.href = "m-page-1.html";
                        var url = UrlParam.getParam('source')=="index"?"index.html":"m-page-1.html";
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
                        deleteBatchList.push(row.batchBaseId);
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