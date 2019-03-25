var ajaxlock = false;
mui.init();
var initPageNumber = ComConst.INIT_PAGE_NUMBER;;
//新增供应商
(function(mui, doc,$) {
    //添加供应商
    mui('body').on('tap','.pro-add',function(){
        mui.openWindow({
            url: 'l-page-3-edit.html',
            createNew: true,
            styles: {
                cachemode:"noCache"
            }
        });
	});
	//编辑供应商
	mui('body').on('tap','.list-type2',function(){
        var id = jQuery(this).find('.man-list-top2').data('id');
        mui.openWindow({
            url: 'l-page-3-edit.html?id='+id,
            createNew: true,
            styles: {
                cachemode:"noCache"
            }
        });
	});
    //筛选框
    mui('body').on('tap' , '.screen-btn' , function () {
        var searchParam = jQuery('.search-ipt').val();
        initOperatorList(1 , searchParam);
    });
    mui.init({
        pullRefresh: {
            container: "#refreshContainer",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
            down: PageUtil.pullRefreshDownSettings,
            up: PageUtil.pullRefreshUpSettings
        }
    });

}(mui, document,jQuery));
(function($) {
	////初始化供应商列表
    //initList(initPageNumber,"");
	//删除弹窗
	//var btnArray = ['确认', '取消'];
	$('.management-list').on('tap', '.mui-btn', function(event) {
		var elem = this;
		var li = elem.parentNode.parentNode;
		mui.confirm('确认删除？', '删除确认', CONFIRM_BTN_LIST, function(e) {
			if (e.index == CONFIRM_BTN_YES) {
				//li.parentNode.removeChild(li);
                var id = jQuery(elem).data('id');
                deleteEntp(id,li);
			} else {
				setTimeout(function() {
					$.swipeoutClose(li);
				}, 0);
			}
		});
	});
})(mui);

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
    initList(initPageNumber, searchParam);
}


//初始化供应商列表
function initList(pageNumber , searchParam) {
    if (ajaxlock) {
        return;
    }
    ajaxlock = true;
    pageNumber = (pageNumber == null || pageNumber == undefined)? 1 : pageNumber;
    searchParam = (searchParam == null || searchParam == undefined) ? '' : searchParam;
    var url = '/entp/supplier/search?pageSize=' + ComConst.PAGE_SIZE + '&pageNumber=' + pageNumber + '&searchParam=' + searchParam;
    var ajaxSetting = {
        type: "GET",
        dataType: 'json',
        contentType: 'application/json;charset=utf-8;',
        url:Route.baseUrl + url,
        async: true,
        success: function (result) {
            ajaxlock = false;
            var list = result.list;

            if(result == undefined || result.pages == 0 || list == undefined || list.length == 0){
                $('.tips').show();
                mui('#refreshContainer').pullRefresh().disablePullupToRefresh();//禁用上拉，禁用后不显示没有更多数据tip
                return;
            }

            $.each(list, function (i, rowData) {
                var html = '<li class="mui-table-view-cell">' +
                    <!--右侧删除-->
                    '<div class="mui-slider-right mui-disabled">' +
                    '<a class="mui-btn slide-right-btn" data-id="' + rowData.id + '">删除</a>' +
                    '</div>' +
                    '<div class="mui-slider-handle list-type2">' +
                    '<div class="man-list-top2 " data-id="' + rowData.id + '">' +
                    '<h4 class="man-list-h">' + rowData.entpName + '</h4>' +
                    '</div>' +
                    '<div class="man-list-bottom">' +
                    '<span>地址：</span><span>' + rowData.fullAddress + '</span>' +
                    '<span class="mui-icon mui-icon-arrowright man-arrow-btn2"></span>' +
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
        }
    };
    $.ajax(ajaxSetting);


}
function initOperatorList(pageNumber , searchParam) {
    if (ajaxlock) {
        return;
    }
    ajaxlock = true;
    pageNumber = (pageNumber == null || pageNumber == undefined)? 1 : pageNumber;
    searchParam = (searchParam == null || searchParam == undefined) ? '' : searchParam;
    var url = '/entp/supplier/search?pageSize=' + ComConst.PAGE_SIZE + '&pageNumber=' + pageNumber + '&searchParam=' + searchParam;
    var ajaxSetting = {
        type: "GET",
        dataType: 'json',
        contentType: 'application/json;charset=utf-8;',
        url:Route.baseUrl + url,
        async: true,
        success: function (result) {
            ajaxlock = false;
            $('.management-list ul').empty();
            var list = result.list;

            if(result == undefined || result.pages == 0 || list == undefined || list.length == 0){
                $('.tips').show();
                mui('#refreshContainer').pullRefresh().disablePullupToRefresh();//禁用上拉，禁用后不显示没有更多数据tip
                return;
            } else {
                $('.tips').hide();
            }

            $.each(list, function (i, rowData) {
                var html = '<li class="mui-table-view-cell">' +
                    <!--右侧删除-->
                    '<div class="mui-slider-right mui-disabled">' +
                    '<a class="mui-btn slide-right-btn" data-id="' + rowData.id + '">删除</a>' +
                    '</div>' +
                    '<div class="mui-slider-handle list-type2">' +
                    '<div class="man-list-top2 " data-id="' + rowData.id + '">' +
                    '<h4 class="man-list-h">' + rowData.entpName + '</h4>' +
                    '</div>' +
                    '<div class="man-list-bottom">' +
                    '<span>地址：</span><span>' + rowData.fullAddress + '</span>' +
                    '<span class="mui-icon mui-icon-arrowright man-arrow-btn2"></span>' +
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
        }
    };
    $.ajax(ajaxSetting);
}

/**
 * 删除
 */
function deleteEntp(operatorId, li) {
    if (ajaxlock) {
        return;
    }
    ajaxlock = true;
    var url = '/entp/supplier/delete';
    var ajaxSetting = {
        url:Route.baseUrl + url,
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
                initOperatorList(initPageNumber);
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

