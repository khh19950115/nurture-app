var ajaxlock = false;

var initPageNumber = ComConst.INIT_PAGE_NUMBER;

(function (mui, doc, $) {
    //新增经营户pro-add
    mui('body').on('tap', '.pro-add', function () {
        mui.openWindow({
            url: 'l-page-1-add.html',
            createNew: true,
            styles: {
                cachemode:"noCache"
            }
        });
    });

    //跳转产品
    mui('body').on('tap', '.man-list-bottom', function () {
        var id = jQuery(this).data('id');
        mui.openWindow({
            url: 'l-page-2.html?id='+id,
            id: new Date().getTime(),
            createNew: true,
            styles: {
                cachemode:"noCache"
            }
        });
    });

    //编辑经营户--企业
    mui('body').on('tap', '.go-company', function () {
        var operatorType = jQuery(this).find(".badge-left").text();
        var id = jQuery(this).data('id');
        if (operatorType == ComConst.SUPPLIER_NATURE_106_TEXT) {
            mui.openWindow({
                url: 'l-page-company-edit.html?id='+id,
                createNew: true,
                styles: {
                    cachemode:"noCache"
                }
            });
        } else {
            mui.openWindow({
                url: 'l-page-personal-edit.html?id='+id,
                createNew: true,
                styles: {
                    cachemode:"noCache"
                }
            });
        }
    });


    mui('body').on('tap', '.screen-btn', function () {
        var searchParam = jQuery('.search-ipt').val();
        //if(jQuery.trim(searchParam) == ''){
        //mui.toast('请填写需要检索的关键字！', {duration: 'long', type: 'div'});
        //} else {
        //initOperatorList(1, searchParam);
        searchInitOperatorList(1, searchParam);
        //}
    });

    mui.init({
        pullRefresh: {
            container: "#refreshContainer",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
            down: PageUtil.pullRefreshDownSettings,
            up: PageUtil.pullRefreshUpSettings
        }
    });
	
	

}(mui, document, jQuery));

(function ($) {
    //初始化经营户列表
    //initOperatorList(initPageNumber);

    //删除弹窗
    //var btnArray = ['确认', '取消'];
    $('.management-list').on('tap', '.mui-btn', function (event) {
        var elem = this;
        var li = elem.parentNode.parentNode;
        mui.confirm('确认删除？', '删除确认', CONFIRM_BTN_LIST, function (e) {
            if (e.index == CONFIRM_BTN_YES) {
                var id = jQuery(elem).data('id');
                deleteOperator(id, li);
            } else {
                setTimeout(function () {
                    $.swipeoutClose(li);
                }, 0);
            }
        });
    });
    

})(mui);

function refreshDown() {
    //initOperatorList(1, "");
    //this.endPullupToRefresh(true);
    //mui('.management-list').pullRefresh().endPulldown();
    //mui('.management-list').pullRefresh().endPulldownToRefresh();
    window.location.reload();
}

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
    initOperatorList(initPageNumber, searchParam);
}

/**
 * 初始化经营户列表
 */
function initOperatorList(pageNumber, searchParam) {

    if (ajaxlock) {
        return;
    }
    ajaxlock = true;

    pageNumber = (pageNumber == null || pageNumber == undefined) ? 1 : pageNumber;
    searchParam = (searchParam == null || searchParam == undefined) ? '' : searchParam;

    var url = '/entp/agency/search?pageSize=' + ComConst.PAGE_SIZE + '&pageNumber=' + pageNumber + '&searchParam=' + searchParam;

    var ajaxSetting = {
        type: "GET",
        dataType: 'json',
        contentType: 'application/json;charset=utf-8;',
        url: Route.baseUrl + url,
        async: true,
        success: function (result) {
            ajaxlock = false;
            //$('.management-list ul').empty();
            //jQuery('.management-list').find('li').remove();
            var list = result.list;

            if(result == undefined || result.pages == 0 || list == undefined || list.length == 0){
                $('.tips').show();
                return;
            }

            $.each(list, function (i, rowData) {
                //var li = document.createElement('li');
                //li.className = 'mui-table-view-cell';
                var type = ComConst.SUPPLIER_NATURE_106_TEXT;

                if (rowData.supplierNature == ComConst.SUPPLIER_NATURE_107) {
                    type = ComConst.SUPPLIER_NATURE_107_TEXT;
                }
                var html = '<li class="mui-table-view-cell">' +
                    <!--右侧删除-->
                    '<div class="mui-slider-right mui-disabled">' +
                    '<a class="mui-btn slide-right-btn" data-id="' + rowData.id + '">删除</a>' +
                    '</div>' +
                    '<div class="mui-slider-handle">' +
                    '<div class="man-list-top go-company" data-id="' + rowData.id + '">' +
                    '<span class="badge-left">' + type + '</span>' +
                    '<h4 class="man-list-h">' + rowData.entpName + '</h4>' +
                    '<span class="man-edit-btn">编辑经营户</span>' +
                    '</div>' +
                    '<div class="man-list-bottom" data-id="' + rowData.id + '">' +
                    '<span>产品经营数：</span><span>' + rowData.systemReserve1 + '</span>' +
                    '<span class="mui-icon mui-icon-arrowright man-arrow-btn"></span>' +
                    '</div>' +
                    '</div>' +
                    '</li>';

                $('.management-list ul').append(html);

            });

            if(initPageNumber >= result.pages){//总页码等于当前页码，禁用上拉
                mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);//参数为true代表没有更多数据了。
                //mui('#refreshContainer').pullRefresh().disablePullupToRefresh();//禁用上拉，禁用后不显示没有更多数据tip
            } else {
                initPageNumber++;
                mui('#refreshContainer').pullRefresh().endPullupToRefresh(false);//参数为false代表还有数据，可继续上拉。
                mui('#refreshContainer').pullRefresh().enablePullupToRefresh();//启用上拉，此处启用后才会出现上拉加载更多tip
            }

        },
        errors: function (err) {
            ajaxlock = false;
            mui.toast('加载失败！', {duration: 'long', type: 'div'});
            mui('#refreshContainer').pullRefresh().endPullupToRefresh();//加载完毕,隐藏正在加载...参数为true代表没有更多数据了
        }
    };

    $.ajax(ajaxSetting);

}

/**
 * 初始化经营户列表
 */
function searchInitOperatorList(pageNumber, searchParam) {

    if (ajaxlock) {
        return;
    }
    ajaxlock = true;

    pageNumber = (pageNumber == null || pageNumber == undefined) ? 1 : pageNumber;
    searchParam = (searchParam == null || searchParam == undefined) ? '' : searchParam;

    var url = '/entp/agency/search?pageSize=' + ComConst.PAGE_SIZE + '&pageNumber=' + pageNumber + '&searchParam=' + searchParam;

    var ajaxSetting = {
        type: "GET",
        dataType: 'json',
        contentType: 'application/json;charset=utf-8;',
        url:Route.baseUrl + url,
        async: true,
        success: function (result) {
            ajaxlock = false;
            //$('.management-list ul').empty();
            jQuery('.management-list').find('li').remove();

            var list = result.list;

            if(result == undefined || result.pages == 0 || list==undefined || list.length == 0){
                $('.tips').show();
                mui('#refreshContainer').pullRefresh().disablePullupToRefresh();//禁用上拉，禁用后不显示没有更多数据tip
                return;
            } else {
                $('.tips').hide();
            }

            $.each(list, function (i, rowData) {
                //var li = document.createElement('li');
                //li.className = 'mui-table-view-cell';
                var type = ComConst.SUPPLIER_NATURE_106_TEXT;

                if (rowData.supplierNature == ComConst.SUPPLIER_NATURE_107) {
                    type = ComConst.SUPPLIER_NATURE_107_TEXT;
                }
                var html = '<li class="mui-table-view-cell">' +
                    <!--右侧删除-->
                    '<div class="mui-slider-right mui-disabled">' +
                    '<a class="mui-btn slide-right-btn" data-id="' + rowData.id + '">删除</a>' +
                    '</div>' +
                    '<div class="mui-slider-handle">' +
                    '<div class="man-list-top go-company" data-id="' + rowData.id + '">' +
                    '<span class="badge-left">' + type + '</span>' +
                    '<h4 class="man-list-h">' + rowData.entpName + '</h4>' +
                    '<span class="man-edit-btn">编辑经营户</span>' +
                    '</div>' +
                    '<div class="man-list-bottom" data-id="' + rowData.id + '">' +
                    '<span>产品经营数：</span><span>' + rowData.systemReserve1 + '</span>' +
                    '<span class="mui-icon mui-icon-arrowright man-arrow-btn"></span>' +
                    '</div>' +
                    '</div>' +
                    '</li>';

                $('.management-list ul').append(html);

            });

            initPageNumber = 1;

            if(initPageNumber >= result.pages){//总页码等于当前页码，禁用上拉
                mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);//参数为true代表没有更多数据了。
                mui('#refreshContainer').pullRefresh().disablePullupToRefresh();//禁用上拉，禁用后不显示没有更多数据tip
            } else {
                initPageNumber ++;
                mui('#refreshContainer').pullRefresh().endPullupToRefresh(false);//参数为false代表还有数据，可继续上拉。
                mui('#refreshContainer').pullRefresh().enablePullupToRefresh();//启用上拉，此处启用后才会出现上拉加载更多tip
            }

        },
        errors: function (err) {
            ajaxlock = false;
            mui.toast('加载失败！', {duration: 'long', type: 'div'});
            mui('#refreshContainer').pullRefresh().endPulldownToRefresh();//加载完毕,隐藏正在加载...
            mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);//参数为true代表没有更多数据了
        }
    };

    $.ajax(ajaxSetting);

}

/**
 * 删除经营户
 */
function deleteOperator(operatorId, li) {

    if (ajaxlock) {
        return;
    }
    ajaxlock = true;

    var url = '/entp/agency/delete';

    var ajaxSetting = {
        url: Route.baseUrl +url,
        type: "POST",
        dataType: 'json',
        //contentType: 'application/json;charset=utf-8;',
        data: {'id': operatorId},
        async: true,
        success: function (data) {
            ajaxlock = false;
            if (data.result.resultCode === 0) {
                li.parentNode.removeChild(li);
                mui.toast('删除成功！', {duration: 'long', type: 'div'});
                searchInitOperatorList(initPageNumber,"");
            } else {
                mui.toast('删除失败！', {duration: 'long', type: 'div'});
            }
        },
        errors: function (err) {
            ajaxlock = false;
            mui.toast('删除失败！', {duration: 'long', type: 'div'});
        }
    };

    $.ajax(ajaxSetting);
}

