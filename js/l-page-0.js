var ajaxlock = false;
mui.init();
var initPageNumber = ComConst.INIT_PAGE_NUMBER;
(function (mui, doc, $) {
    //筛选侧滑
	
	var offCanvasSideScreen = document.querySelector("#offCanvasSideScreen");
	
	offCanvasSideScreen.addEventListener('tap', function() {
		mui("#offCanvasContentScroll").pullRefresh().setStopped(true);
		$("#offCanvasContentScroll").removeClass("scrollWrapper").addClass("offCanvasContentScroll");
		$("#offCanvasWrapper").addClass("mui-off-canvas-wrap2 mui-active");
		$("#offCanvasSide").addClass("mui-transitioning mui-active off-right");
	})
    //新增产品
    mui('body').on('tap', '.pro-add', function () {
        mui.openWindow({
            url: 'l-page-0-add.html',
            createNew: true,
            styles: {
                cachemode: "noCache"
            }
        });
    });

    //编辑产品
    mui('body').on('tap', '.list-pro', function () {
        var id = jQuery(this).find('.man-list-top2').data('id');
        mui.openWindow({
            url: 'l-page-0-edit.html?id=' + id,
            createNew: true,
            styles: {
                cachemode: "noCache"
            }
        });
    });

//筛选框
    mui('body').on('tap', '.screen-btn1', function () {
        var content = jQuery('.search-ipt').val();
        initOperatorList(1, content, "");
    });
    //全选
    var chkall = document.getElementById("check-all");
    var checklist = document.getElementById("check-list");
    chkall.addEventListener("tap", function () {
        if (chkall.classList.contains('check-none')) {
            chkall.classList.remove("check-none");
            chkall.innerText = '全选';
            mui("input[name='checkbox']").each(function () {
                this.checked = false;
            });
        } else {
            chkall.classList.add("check-none");
            chkall.innerText = '取消全选';
            mui("input[name='checkbox']").each(function () {
                this.checked = true;
            });
        }
    }, false);

    var cbknum = mui("input[name='checkbox']").length;
    var cnum = 0;
    mui('body').on("change", "input[name='checkbox']", function () {
        if (chkall.classList.contains('check-none')) {
            cnum--;
        } else {
            cnum++;
        }
        if (cbknum == cnum) {
            chkall.classList.add("check-none");
            chkall.innerText = '取消全选';
        } else {
            chkall.classList.remove("check-none");
            chkall.innerText = '全选';
        }
    });

    //点击删选关闭侧滑抽屉 //筛选品类
    mui("body").on('tap', '.slide-btn-screen', function (event) {
        //全选
        var chkall = document.getElementById("check-all");
        if (chkall.innerText == '取消全选') {
            initOperatorList(initPageNumber, "", "");
        } else {
            var varietyIds = [];
            var $inputArr = $('input[name=checkbox]:checked');
            $inputArr.each(function () {
                varietyIds.push($(this).val());
            });
            initOperatorList(initPageNumber, "", varietyIds);
        }
        fnClick();
    });

    //点击删选关闭侧滑抽屉 //筛选品类 //重置按钮
    mui("body").on('tap', '.slide-btn-reset', function (event) {
        $("[name='checkbox']").removeAttr("checked");//取消全选
        chkall.innerText = '全选';
		fnClick();
        initOperatorList(null, "", "");
    });

    document.getElementById('clickback').addEventListener('tap',fnClick);
	
	function fnClick() {
		mui("#offCanvasContentScroll").pullRefresh().setStopped(false);
		$("#offCanvasContentScroll").addClass("scrollWrapper").removeClass("offCanvasContentScroll");
		$("#offCanvasWrapper").removeClass("mui-off-canvas-wrap2 mui-active");
		$("#offCanvasSide").removeClass("mui-transitioning mui-active off-right");
	}

    //获取品类

    $.ajax({
        url: Route.baseUrl + '/product/getTianJinVarietyList',
        dataType: 'json',
        success: function (data) {
            //   $('.management-list ul').empty();
            for (var d = 0; d < data.length; d++) {
                var item = data[d];
                var html =
                    '<div class="mui-input-row mui-checkbox mui-left slide-checkipt" data-id="' + item.id + '">' +
                    '<label class="check-name">' + item.varietyName + '</label>' +
                    '<input name="checkbox"  type="checkbox" value="' + item.id + '" >' +
                    '</div>'
                $('.mui-input-group').append(html);
            }
        }
    });
    /* $.ajax({
         url: Route.baseUrl +'/product/getCategoryList',
         dataType: 'json',
         success: function (data) {
            // $('.management-list ul').empty();
                 for (var d = 0; d < data.length; d++) {
                     var item = data[d];
                     var html =
                         '<div class="mui-input-row mui-checkbox mui-left slide-checkipt">'+
                         '<label class="check-name">' + item.categoryName + '</label>'+
                         '<input name="checkbox" value="'+item.varietyIdList+'" type="checkbox">'+
                         '</div>'
                     $('.mui-input-group').append(html);
                 }
         }
     });*/

    mui.init({
        pullRefresh: {
            container: "#offCanvasContentScroll",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
            down: PageUtil.pullRefreshDownSettings,
            up: PageUtil.pullRefreshUpSettings
        }
    });
}(mui, document, jQuery));
//
(function ($) {
    //初始化产品列表
    initList(initPageNumber, "", "");
    //删除弹窗
    //var btnArray = ['确认', '取消'];
    $('.management-list').on('tap', '.mui-btn', function (event) {
        var elem = this;
        var li = elem.parentNode.parentNode;
        mui.confirm('确认删除？', '删除确认', CONFIRM_BTN_LIST, function (e) {
            if (e.index == CONFIRM_BTN_YES) {
                var id = jQuery(elem).data('id');
                deleteProduct(id, li)
            } else {
                setTimeout(function () {
                    $.swipeoutClose(li);
                }, 0);
            }
        });
    });
})(mui);

//刷新回调
function refreshUp() {
    //1、加载完新数据后，必须执行如下代码，true表示没有更多数据了：
    //2、若为ajax请求，则需将如下代码放置在处理完ajax响应数据之后

    //重置上拉加载
    //mui('#pullup-container').pullRefresh().refresh(true);
    //禁用上拉刷新
    //mui('#pullup-container').pullRefresh().disablePullupToRefresh();
    //启用上拉刷新
    //mui('#pullup-container').pullRefresh().enablePullupToRefresh();

    var searchParam = jQuery('.search-ipt').val();
    var varietyIds = [];
    var $inputArr = $('input[name=checkbox]:checked');
    $inputArr.each(function () {
        varietyIds.push($(this).val());
    });
    initList(initPageNumber, searchParam, varietyIds);
}

//初始化产品列表
function initList(pageNumber, content, varietyIds) {

    if (ajaxlock) {
        return;
    }
    ajaxlock = true;
    pageNumber = (pageNumber == null || pageNumber == undefined) ? 1 : pageNumber;
    content = (content == null || content == undefined) ? '' : content;
    varietyIds = (varietyIds == null || varietyIds == undefined) ? '' : varietyIds;
    var url = '/product/search?pageSize=' + ComConst.PAGE_SIZE + '&pageNumber=' + pageNumber + '&condition=' + content + '&categoryList[]=' + varietyIds + '&isApp=true';
    var ajaxSetting = {
        type: "GET",
        dataType: 'json',
        contentType: 'application/json;charset=utf-8;',
        url: Route.baseUrl + url,
        async: true,
        success: function (result) {
            ajaxlock = false;
            var list = result.list;

            if (result == undefined || result.pages == 0 || list == undefined || list.length == 0) {
                $('.tips').show();
                mui('#offCanvasContentScroll').pullRefresh().disablePullupToRefresh();//禁用上拉，禁用后不显示没有更多数据tip
                return;
            }

            $.each(list, function (i, rowData) {
                var varietyName = rowData.varietyName;
                if (varietyName == null) {
                    varietyName = '其他'
                }
                var html = '<li class="mui-table-view-cell">' +
                    <!--右侧删除-->
                    '<div class="mui-slider-right mui-disabled">' +
                    '<a class="mui-btn slide-right-btn" data-id="' + rowData.id + '">删除</a>' +
                    '</div>' +
                    '<div class="mui-slider-handle list-pro">' +
                    '<div class="man-list-top2 " data-id="' + rowData.id + '">' +
                    '<h4 class="man-list-h">' + rowData.productName + '</h4>' +
                    '</div>' +
                    '<div class="man-list-bottom">' +
                    '<span>SKU编号：</span><span>' + rowData.productNo + '</span>' +
                    '<span>品类：</span><span>' + varietyName + '</span>' +
                    '<span class="mui-icon mui-icon-arrowright man-arrow-btn2"></span>' +
                    '</div>' +
                    '</div>' +
                    '</li>';
                $('.management-list ul').append(html);
            });

            if (initPageNumber >= result.pages) {//总页码等于当前页码，禁用上拉
                mui('#offCanvasContentScroll').pullRefresh().endPullupToRefresh(true);//参数为true代表没有更多数据了。
                //mui('#offCanvasContentScroll').pullRefresh().disablePullupToRefresh();//禁用上拉，禁用后不显示没有更多数据tip
            } else {
                initPageNumber++;
                mui('#offCanvasContentScroll').pullRefresh().endPullupToRefresh(false);//参数为false代表还有数据，可继续上拉。
                mui('#offCanvasContentScroll').pullRefresh().enablePullupToRefresh();//启用上拉，此处启用后才会出现上拉加载更多tip
            }

        },
        errors: function (err) {
            ajaxlock = false;
            mui.toast('加载失败！', {duration: 'long', type: 'div'});
        }
    };
    $.ajax(ajaxSetting);
}

//查询
function initOperatorList(pageNumber, content, varietyIds) {

    if (ajaxlock) {
        return;
    }
    ajaxlock = true;
    pageNumber = (pageNumber == null || pageNumber == undefined) ? 1 : pageNumber;
    content = (content == null || content == undefined) ? '' : content;
    varietyIds = (varietyIds == null || varietyIds == undefined) ? '' : varietyIds;
    var url = '/product/search?pageSize=' + ComConst.PAGE_SIZE + '&pageNumber=' + pageNumber + '&condition=' + content + '&categoryList[]=' + varietyIds + '&isApp=true';

    var ajaxSetting = {
        type: "GET",
        dataType: 'json',
        contentType: 'application/json;charset=utf-8;',
        url: Route.baseUrl + url,
        async: true,
        success: function (result) {
            ajaxlock = false;
            $('.management-list ul').empty();
            var list = result.list;

            if (result == undefined || result.pages == 0 || list == undefined || list.length == 0) {
                $('.tips').show();
                mui('#offCanvasContentScroll').pullRefresh().disablePullupToRefresh();//禁用上拉，禁用后不显示没有更多数据tip
                return;
            } else {
                $('.tips').hide();
            }

            $.each(list, function (i, rowData) {
                var varietyName = rowData.varietyName;
                if (varietyName == null) {
                    varietyName = '其他'
                }
                var html = '<li class="mui-table-view-cell">' +
                    <!--右侧删除-->
                    '<div class="mui-slider-right mui-disabled">' +
                    '<a class="mui-btn slide-right-btn" data-id="' + rowData.id + '">删除</a>' +
                    '</div>' +
                    '<div class="mui-slider-handle list-pro">' +
                    '<div class="man-list-top2 " data-id="' + rowData.id + '">' +
                    '<h4 class="man-list-h">' + rowData.productName + '</h4>' +
                    '</div>' +
                    '<div class="man-list-bottom">' +
                    '<span>SKU编号：</span><span>' + rowData.productNo + '</span>' +
                    '<span>品类：</span><span>' + varietyName + '</span>' +
                    '<span class="mui-icon mui-icon-arrowright man-arrow-btn2"></span>' +
                    '</div>' +
                    '</div>' +
                    '</li>';
                $('.management-list ul').append(html);
            });

            initPageNumber = 1;

            if (initPageNumber >= result.pages) {//总页码等于当前页码，禁用上拉
                mui('#offCanvasContentScroll').pullRefresh().endPullupToRefresh(true);//参数为true代表没有更多数据了。
                mui('#offCanvasContentScroll').pullRefresh().disablePullupToRefresh();//禁用上拉，禁用后不显示没有更多数据tip
            } else {
                initPageNumber++;
                mui('#offCanvasContentScroll').pullRefresh().endPullupToRefresh(false);//参数为false代表还有数据，可继续上拉。
                mui('#offCanvasContentScroll').pullRefresh().enablePullupToRefresh();//启用上拉，此处启用后才会出现上拉加载更多tip
            }

        },
        errors: function (err) {
            ajaxlock = false;
            mui.toast('加载失败！', {duration: 'long', type: 'div'});
        }
    };
    $.ajax(ajaxSetting);
}

/**
 * 删除
 */
function deleteProduct(operatorId, li) {
    if (ajaxlock) {
        return;
    }
    ajaxlock = true;
    $.ajax({
        type: 'GET',
        url: Route.baseUrl + "/product/getBatchDelCheck",
        data: {'productId': operatorId},
        dataType: 'json',
        success: function (data) {
            if (!data) {
                ajaxlock = false;
                mui.toast('此产品已绑定批次,无法删除！', {duration: 'long', type: 'div'});
            } else {
                $.ajax({
                    type: 'POST',
                    url: Route.baseUrl + "/product/deletes",
                    data: {'productId': operatorId},
                    dataType: 'json',
                    success: function (data) {
                        ajaxlock = false;
                        var result = data.result;
                        if (result.resultCode === 0) {
                            li.remove();
                            mui.toast('删除成功！', {duration: 'long', type: 'div'});
                            initOperatorList(initPageNumber);
                        } else {
                            mui.toast('抱歉，此产品无法删除，请前往电脑端操作！', {duration: 'long', type: 'div'});
                        }
                    },
                    error: function (err) {
                        ajaxlock = false;
                    }
                });
            }
        },
        error: function (err) {
            ajaxlock = false;
        }
    });

}
