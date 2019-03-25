(function(mui, doc, $) {
	mui.init({
		pullRefresh: {
			container: "#offCanvasContentScroll", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
			down: PageUtil.pullRefreshDownSettings,
			up: PageUtil.pullRefreshUpSettings
		}
	});

	var offCanvasSideScreen = document.querySelector("#offCanvasSideScreen");

	offCanvasSideScreen.addEventListener('tap', function() {
		document.activeElement.blur();
		mui("#offCanvasContentScroll").pullRefresh().setStopped(true);
		$("#offCanvasContentScroll").removeClass("scrollWrapper").addClass("offCanvasContentScroll");
		$("#offCanvasWrapper").addClass("mui-off-canvas-wrap2 mui-active");
		$("#offCanvasSide").addClass("mui-transitioning mui-active off-right");
	})

	//交易登记
	mui('body').on('tap', '.go-detail', function() {
		var row = $(this).closest(".mui-table-view-cell").data("row");
		mui.openWindow({
			url: 'supermarket-detection-edit.html?id=' + row.id,
			createNew: true,
			styles: {
				cachemode: "noCache"
			}
		});
	});
	//交易登记头部
	mui('body').on('tap', '.pro-add', function() {
		mui.openWindow({
			url: 'supermarket-detection-edit.html',
			createNew: true,
			styles: {
				cachemode: "noCache"
			}
		});
	});


	//时间选择
	//开始时间选择初始化
	var startTimePicker = doc.getElementById('startTimePicker');
	startTimePicker.addEventListener('tap', function() {
		var _self = this;
		if (_self.picker) {
			_self.picker.show(function(rs) {
				/*result.innerText = '选择结果: ' + rs.text;*/
				startTimePicker.value = rs.text;
				_self.picker.dispose();
				_self.picker = null;
			});
		} else {
			var optionsJson = this.getAttribute('data-options') || '{}';
			var options = JSON.parse(optionsJson);
			var id = this.getAttribute('id');
			_self.picker = new mui.DtPicker(options);
			_self.picker.show(function(rs) {
				startTimePicker.value = rs.text;
				_self.picker.dispose();
				_self.picker = null;
			});
		}
	}, false);
	//结束时间选择初始化
	var endTimePicker = doc.getElementById('endTimePicker');
	endTimePicker.addEventListener('tap', function() {
		var _self = this;
		if (_self.picker) {
			_self.picker.show(function(rs) {
				/*result.innerText = '选择结果: ' + rs.text;*/
				endTimePicker.value = rs.text;
				_self.picker.dispose();
				_self.picker = null;
			});
		} else {
			var optionsJson = this.getAttribute('data-options') || '{}';
			var options = JSON.parse(optionsJson);
			var id = this.getAttribute('id');
			_self.picker = new mui.DtPicker(options);
			_self.picker.show(function(rs) {
				endTimePicker.value = rs.text;
				_self.picker.dispose();
				_self.picker = null;
			});
		}
	}, false);


	//全选1
	$("#agency").on("click", "input[type='checkbox']", function() {
		var sum = $("#agency input[type='checkbox']").length;
		var count = $("#agency input[type='checkbox']:checked").length;
		if (sum == count) {
			$(".agency-check-all").addClass('check-none');
			$(".agency-check-all").text('取消全选');
		} else {
			$(".agency-check-all").removeClass('check-none');
			$(".agency-check-all").text('全选');
		}
	});

	$(".agency-check-all").click(function() {
		if ($(this).hasClass('check-none')) {
			$(this).removeClass('check-none');
			$("#agency input[type='checkbox']").prop("checked", false);
			$(".agency-check-all").text('全选');
		} else {
			$(this).addClass('check-none');
			$("#agency input[type='checkbox']").prop("checked", true);
			$(".agency-check-all").text('取消全选');
		}
	});

	//全选2
	$("#detectionType").on("click", "input[type='checkbox']", function() {
		var sum = $("#detectionType input[type='checkbox']").length;
		var count = $("#detectionType input[type='checkbox']:checked").length;
		if (sum == count) {
			$(".detectionType-check-all").addClass('check-none');
			$(".detectionType-check-all").text('取消全选');
		} else {
			$(".detectionType-check-all").removeClass('check-none');
			$(".detectionType-check-all").text('全选');
		}
	})
	$(".detectionType-check-all").click(function() {
		if ($(this).hasClass('check-none')) {
			$(this).removeClass('check-none');
			$("#detectionType input[type='checkbox']").prop("checked", false);
			$(".detectionType-check-all").text('全选');
		} else {
			$(this).addClass('check-none');
			$("#detectionType input[type='checkbox']").prop("checked", true);
			$(".detectionType-check-all").text('取消全选');
		}
	});

	//全选3
	$("#isQualified").on("click", "input[type='checkbox']", function() {
		var sum = $("#isQualified input[type='checkbox']").length;
		var count = $("#isQualified input[type='checkbox']:checked").length;
		if (sum == count) {
			$(".isQualified-check-all").addClass('check-none');
			$(".isQualified-check-all").text('取消全选');
		} else {
			$(".isQualified-check-all").removeClass('check-none');
			$(".isQualified-check-all").text('全选');
		}
	})
	$(".isQualified-check-all").click(function() {
		if ($(this).hasClass('check-none')) {
			$(this).removeClass('check-none');
			$("#detectionType input[type='checkbox']").prop("checked", false);
			$(".isQualified-check-all").text('全选');
		} else {
			$(this).addClass('check-none');
			$("#isQualified input[type='checkbox']").prop("checked", true);
			$(".isQualified-check-all").text('取消全选');
		}
	});

	$("#filterBtn").on('click', function(event) {
		fnClick();
	});

	$("#resetBtn").on('click', function(event) {
		$(
			"#agency input[type='checkbox']:checked,#detectionType input[type='checkbox']:checked,#isQualified input[type='checkbox']:checked"
		).prop("checked", false);
		$("#startTimePicker").val(null).data("val", null);
		$("#endTimePicker").val(null).data("val", null);
		$("#product-sku").val(null);
		fnClick();
	});

	document.getElementById('clickback').addEventListener('tap',fnClick);

	function fnClick() {
		mui("#offCanvasContentScroll").pullRefresh().setStopped(false);
		$("#offCanvasContentScroll").addClass("scrollWrapper").removeClass("offCanvasContentScroll");
		$("#offCanvasWrapper").removeClass("mui-off-canvas-wrap2 mui-active");
		$("#offCanvasSide").removeClass("mui-transitioning mui-active off-right");
		reload();
	}

}(mui, document, jQuery));

//
(function($) {
	//删除弹窗
	$('.management-list').on('tap', '.mui-btn', function(event) {
		var row = jQuery(this).closest("li").data("row");
		var elem = this;
		var li = elem.parentNode.parentNode;
		(function(row, li) {
			mui.confirm('确认删除？', '删除确认', CONFIRM_BTN_LIST, function(e) {
				if (e.index == CONFIRM_BTN_YES) {
					$.ajax({
						cache: false,
						type: 'post',
						url: Route.baseUrl + "/batch/detection/delete/" + row.id,
						success: function(data) {
							reload();
						}
					});
				} else {
					setTimeout(function() {
						$.swipeoutClose(li);
					}, 0);
				}
			});
		}(row, li))
	});
})(mui);


var initPageNumber = ComConst.INIT_PAGE_NUMBER;
var _init_ = false;

function refreshUp() {
	reload(initPageNumber);
}

function reload(pageNumber, flag) {
	if (_init_) {
		return;
	}

	var agencyIds = [];
	var isQualifiedIds = [];
	var detectionTypeIds = [];
	var startDate = "";
	var endDate = "";

	if (!flag) {
		agencyIds = $("#agency input[type='checkbox']:checked").map(function() {
			return $(this).val();
		}).get();
		isQualifiedIds = $("#isQualified input[type='checkbox']:checked").map(function() {
			return $(this).val();
		}).get();
		detectionTypeIds = $("#detectionType input[type='checkbox']:checked").map(function() {
			return $(this).val();
		}).get();
		startDate = $("#startTimePicker").val();
		endDate = $("#endTimePicker").val();
	}

	var queryContent = $("#product-sku").val();
	_init_ = true;
	pageNumber = pageNumber || 1;
	$.ajax({
		cache: false,
		type: 'get',
		url: Route.baseUrl + "/batch/detection/search",
		data: {
			pageSize: 10,
			pageNumber: pageNumber,
			queryContent: queryContent,
			sysRegTmspStart: startDate,
			sysRegTmspEnd: endDate,
			// "agencyIds[]": agencyIds.join(","),
			isQualified: isQualifiedIds.join(","),
			"detectionTypeList[]": detectionTypeIds.join(",")
		},
		complete: function() {
			_init_ = false;
		},
		success: function(data) {
			if (pageNumber == 1) {
				initPageNumber = 1;
				$(".management-list ul").empty();
			}
			if (data) {
				if (data.list && data.list.length > 0) {
					$.each(data.list, function(index, value) {
						var itpl = $(list_tpl_detection);
						itpl.find("h4.man-list-h").html("检测名称：" + (value.detectionName || ""));
						itpl.find("span.time-label").html("检测日期:");
						itpl.find("span.user-label").html("检测结果:");
						itpl.find("span.time").html(value.detectionDate);
						itpl.find("span.user").html(value.isQualified == "101" ? "合格" : "不合格");
						itpl.data("row", value);
						$(".management-list ul").append(itpl);
					})
				}

				if (initPageNumber >= data.pages) { //总页码等于当前页码，禁用上拉
					mui('#offCanvasContentScroll').pullRefresh().endPullupToRefresh(true); //参数为true代表没有更多数据了。
					if (pageNumber == 1) {
						mui('#offCanvasContentScroll').pullRefresh().disablePullupToRefresh(); //禁用上拉，禁用后不显示没有更多数据tip
					}
				} else {
					initPageNumber++;
					mui('#offCanvasContentScroll').pullRefresh().endPullupToRefresh(false); //参数为false代表还有数据，可继续上拉。
					mui('#offCanvasContentScroll').pullRefresh().enablePullupToRefresh(); //启用上拉，此处启用后才会出现上拉加载更多tip
				}
			}

			common.toggleDisplay();
		}
	});
}
