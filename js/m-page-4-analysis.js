var oHerf = window.location.hash.substring(1);
var nowDate = "";
var startDate = "";
var endDate = "";
var entpId = "";
var entpType = "1"
var option = null;
var myChart = null;
var type = "1";
var gridTitle = "进货次数";
(function(mui, $) {
	//门店报表分析和报表
	var dataList = {
		incomingStatistics: {
			title: "进货统计报表",
			pie: false
		},
		purchaseCategory: {
			title: "进货品类分析",
			pie: true
		},
		sourceOfPurchase: {
			title: "进货来源分析",
			pie: true
		},
		operatorsPurchase: {
			title: "经营户进货分析",
			pie: true
		},
		operatorDelivery: {
			title: "经营户出货分析",
			pie: true
		},
		transactionStatistics: {
			title: "交易统计报表",
			pie: true
		},
		tradingCategory: {
			title: "交易品类分析",
			pie: true
		}
	}
	//Title
	for (let k in dataList) {
		if (k == oHerf) {
			entpId = StorageItem.getEntpId();
			var systemId = StorageItem.getSystemId();
			var supplierNature = StorageItem.getSupplierNature();
			if (systemId == 'wholesalemarket' || systemId == 'farmersmarket' || systemId == 'quickTraceNm') {
				if (supplierNature == '101') {
					entpType = '2';
				}
			}
			startDate = getBeforeDate(6);
			endDate = getBeforeDate(0);
			nowDate = getBeforeDate(0);
			$("#startTimePicker").text(startDate);
			$("#endTimePicker").text(endDate);
			$("#storeReportTitle").text(dataList[k].title);
			fnTimeTap();
			fn(dataList[k]);
			getAllData();
		}
	}
	mui(document).on("tap", "#latelyTap span", function() {
		$("#Last7days").css({"position": "relative","z-index": "9"});
		$(".store-report-data").css("overflow", "auto");
		$(this).addClass("active").siblings("span").removeClass("active");

	});

	mui(document).on("tap", "#screen", function() {
		$("#Last7days").css({"position": "relative","z-index": "9"});
		$(".store-report-data").css("overflow", "auto");
		getAllData();
		$("#daysText").html(startDate + "-" + endDate);
	});
	mui(document).on("tap", "#Last7days", function() {
		var timeTap = $("#timeTap");
		if ($(timeTap).css("display") == 'none') {
			$(this).children("img").addClass("active");
			$("#timeTapbj").show();
			$(timeTap).slideDown();
			$(this).css({"position": "fixed","z-index": "10"});
			$(".store-report-data").css("overflow", "hidden");
		} else {
			$(timeTap).slideUp();
			$("#timeTapbj").hide();
			$(this).children("img").removeClass("active");
			$(this).css({"position": "relative","z-index": "9"});
			$(".store-report-data").css("overflow", "auto");
		}
	});

	mui(document).on("tap", "#sevenDays", function() {
		startDate = getBeforeDate(6);
		endDate = getBeforeDate(0);
		$("#startTimePicker").text(startDate);
		$("#endTimePicker").text(endDate);
		$("#daysText").html("最近7天");
		getAllData();
	});

	mui(document).on("tap", "#thisMonth", function() {
		startDate = getBeforeDate((getBeforeDate(0).substr(8, 2) * 1) - 1);
		endDate = getBeforeDate(0);
		$("#startTimePicker").text(startDate);
		$("#endTimePicker").text(endDate);
		$("#daysText").html("本月");
		getAllData();
	});

	mui(document).on("tap", "#lastMonth", function() {
		startDate = getLastMonthFirstAndLastDay().startDate;
		endDate = getLastMonthFirstAndLastDay().endDate;
		$("#startTimePicker").text(startDate);
		$("#endTimePicker").text(endDate);
		$("#daysText").html("上月");
		getAllData();
	});

	mui(document).on("tap", "#number", function() {
		type = "1";
		gridTitle = "进货次数";
		if (oHerf == 'operatorDelivery') {
			gridTitle = "出货次数";
		}
		getAllData();
	});

	mui(document).on("tap", "#price", function() {
		type = "2";
		gridTitle = "进货总价（元）";
		if (oHerf == 'operatorDelivery') {
			gridTitle = "出货总价（元）";
		}
		getAllData();
	});

	mui(document).on("tap", "#timeTapbj", function() {
		$("#timeTap").slideUp();
		$("#timeTapbj").hide();
		$("#Last7days").css({"position": "relative","z-index": "9"});
		$("#Last7days img").removeClass("active");
		$(".store-report-data").css("overflow", "auto");
	});

	mui(document).on("tap", "#categoryPurchaseButton span", function() {
		$(this).addClass("active").siblings("span").removeClass("active");
	});

	function fnTimeTap() {
		//开始时间选择初始化
		fnTimePicker("startTimePicker");
		fnTimePicker("endTimePicker");
	}

	function fnTimePicker(id) {
		//时间选择
		var timePicker = document.getElementById(id);
		timePicker.addEventListener('tap', function() {
			var _self = this;
			var optionsJson = this.getAttribute('data-options') || '{}';
			var options = JSON.parse(optionsJson);
			_self.picker = new mui.DtPicker({
				type: "date",
				endDate: new Date(nowDate.substr(0, 4) * 1, (nowDate.substr(5, 2) - 1) * 1, (nowDate.substr(8, 2)) * 1)
			});
			_self.picker.show(function(rs) {
				if (id == "startTimePicker") {
					if (endDate < rs.text) {
						mui.alert('结束时间不能早于开始时间，请修改！', '警告', function() {});
					} else {
						if (dateInterval(rs.text, endDate) > 90) {
							mui.alert('时间范围不可超过90天，请修改！', '警告', function() {});
						} else {
							startDate = rs.text;
							timePicker.innerHTML = rs.text;
						}
					}
				}
				if (id == "endTimePicker") {
					if (rs.text < startDate) {
						mui.alert('结束时间不能早于开始时间，请修改！', '警告', function() {});
					} else {
						if (dateInterval(startDate, rs.text) > 90) {
							mui.alert('时间范围不可超过90天，请修改！', '警告', function() {});
						} else {
							endDate = rs.text;
							timePicker.innerHTML = rs.text;
						}
					}
				}
				_self.picker.dispose();
				_self.picker = null;
			});
		}, false);
	}

	function fn(obj) {
		// 饼图
		var dom = document.getElementById("container");
		myChart = echarts.init(dom);
		if (obj.pie) {
			$("#categoryPurchaseButton").show();
			if (oHerf == "sourceOfPurchase" || oHerf == "operatorsPurchase") {
				$("#number").text("进货次数");
				$("#price").text("进货总价");
			} else if (oHerf == "operatorDelivery") {
				$("#number").text("出货次数");
				$("#price").text("出货总价");
			} else {
				$("#number").text("品类进货次数");
				$("#price").text("品类进货总价");
			}
			$("#containerTitle").text("");
			var data = {};
			option = {
				tooltip: {
					trigger: 'item',
					// formatter: "{b} : {d}%",
					formatter: function(item) {
						if (type == "1") {
							return (item.name || "") + " : " + (item.percent || 0) + "%";
						} else {
							return (item.name || "") + " : " + (parseFloat(item.value) || 0).toFixed(2);
						}
					}
				},
				color: ['#4572c4', '#ed7d31', '#a5a5a5', '#ffc003', '#5b9bd5', '#70ad47', '#264478', '#9e480e', '#636363'],
				legend: {
					type: 'scroll',
					// orient: 'vertical',
					x: 'center',
					selectedMode: false,
					bottom: '4%',
					padding: [0, 10, 0, 10],
					data: data.legendData,
					selected: data.selected,
					itemHeight: 8,
					textStyle: {
						fontSize: 12,
						color: "#000",
					}
				},
				series: [{
					name: '姓名',
					type: 'pie',
					radius: '75%',
					center: ['50%', '50%'],
					data: data.seriesData,
					itemStyle: {
						emphasis: {
							shadowBlur: 10,
							shadowOffsetX: 0,
							shadowColor: 'rgba(0, 0, 0, 0.5)'
						}
					},
					label: {
						normal: {
							position: 'inner',
							show: false
						},
					}
				}]
			};
		} else {
			$("#categoryPurchaseButton").hide();
			$("#containerTitle").text("趋势图");
			option = {
				tooltip: {},
				grid: {
					top: "14%",
					left: '10',
					right: '10',
					bottom: '10',
					containLabel: true
				},
				xAxis: {
					type: 'category',
					axisLabel: {
						rotate: 40,
						fontSize: 12,
					},
					data: [],
				},
				yAxis: {
					type: 'value'
				},
				series: [{
					data: [],
					type: 'line'
				}]
			};
		}
		if (option && typeof option === "object") {
			myChart.setOption(option, true);
		}
	}

	function genData(list) {
		var nameList = list;
		var legendData = [];
		var seriesData = [];
		var selected = {};
		for (var i = 0; i < nameList.length; i++) {
			legendData.push({
				name: nameList[i].name,
				//				icon: 'circle'
			});
			seriesData.push({
				name: nameList[i].name,
				value: nameList[i].value
			});
			selected[nameList[i].name] = true;
		}
		return {
			legendData: legendData,
			seriesData: seriesData,
			selected: selected
		};
	};

	function getAllData() {
		if (oHerf == "incomingStatistics") {
			getInStockCountInfo();
		}
		if (oHerf == "purchaseCategory") {
			getInstockCategoryCount();
		}
		if (oHerf == "sourceOfPurchase") {
			getInstockOriginCount();
		}
		if (oHerf == "operatorsPurchase") {
			agencyInstance.getAgencyInstockCount({
				"startDate": startDate,
				"endDate": endDate,
				"entpId": entpId,
				"entpType": entpType,
				"type": type
			});
		}
		if (oHerf == "operatorDelivery") {
			if (type == "1") {
				gridTitle = "出货次数";
			}
			getOperatorOutStockCount();
		}
		$("#timeTap").slideUp();
		$("#timeTapbj").hide();
		$(this).children("img").removeClass("active");
		myChart.dispatchAction({
			type: 'downplay',
		});
		myChart.dispatchAction({
			type: 'hideTip',
		});
		myChart.setOption(option, true);
	}

	function getInStockCountInfo() {
		$.ajax({
			type: "GET",
			url: Route.baseUrl + "/stock/instock/getInStockCountInfo",
			data: {
				"startDate": startDate,
				"endDate": endDate,
				"entpId": entpId,
				"entpType": entpType
			},
			dataType: 'json',
			async: false,
			// contentType:"application/json",
			success: function(data) {
				//日期
				var xAxisData = [];
				//数值
				var yAxisData = [];
				var dataText = "<tr>\n" +
					"<th>日期</th>\n" +
					"<th>进货次数</th>\n" +
					"</tr>";
				var total = 0;
				for (var i = 0; i < data.result.length; i++) {
					xAxisData.push(data.result[i].transdate);
					yAxisData.push(data.result[i].num);
					option.xAxis.data = xAxisData;
					option.series[0].data = yAxisData;

				}
				for (var i = data.result.length - 1; i > -1; i--) {
					dataText = dataText + "<tr>\n" +
						"<td>" + data.result[i].transdate + "</td>\n" +
						"<td>" + data.result[i].num + "</td>\n" +
						"</tr>";
					total = total + data.result[i].num;
				}
				$("#dataGrid").html(dataText);
				$("#total").html(total);
				myChart.setOption(option, true);
			}
		})
	}

	function getInstockCategoryCount() {
		$.ajax({
			type: "GET",
			url: Route.baseUrl + "/stock/instock/getInstockCategoryCount",
			data: {
				"startDate": startDate,
				"endDate": endDate,
				"entpId": entpId,
				"entpType": entpType,
				"type": type
			},
			dataType: 'json',
			async: false,
			// contentType:"application/json",
			success: function(data) {
				var list = [];
				var dataText = "<tr>\n" +
					"<th>品类名称</th>\n" +
					"<th>" + gridTitle + "</th>\n" +
					"</tr>";
				var total = 0;
				for (var i = 0; i < data.countList.length; i++) {
					var temp = {};
					temp.name = data.countList[i].variety_name;
					if (type == 2) {
						temp.value = (data.countList[i].num * 1).toFixed(2);
						list.push(temp);
						dataText = dataText + "<tr>\n" +
							"<td>" + data.countList[i].variety_name + "</td>\n" +
							"<td>" + (data.countList[i].num * 1).toFixed(2) + "</td>\n" +
							"</tr>";
						total = (total * 1) + ((data.countList[i].num * 1).toFixed(2) * 1);
					} else {
						temp.value = data.countList[i].num;
						list.push(temp);
						dataText = dataText + "<tr>\n" +
							"<td>" + data.countList[i].variety_name + "</td>\n" +
							"<td>" + data.countList[i].num + "</td>\n" +
							"</tr>";
						total = total + (data.countList[i].num * 1);
					}
				}
				var data = genData(list);
				option.legend.data = data.legendData;
				option.legend.selected = data.selected;
				option.series[0].data = data.seriesData;
				$("#dataGrid").html(dataText);
				if (type == 2) {
					$("#total").html(total.toFixed(2));
				} else {
					$("#total").html(total);
				}
				myChart.setOption(option, true);
			}
		})
	}

	function getInstockOriginCount() {
		$.ajax({
			type: "GET",
			url: Route.baseUrl + "/stock/instock/getInstockOriginCount",
			data: {
				"startDate": startDate,
				"endDate": endDate,
				"entpId": entpId,
				"entpType": entpType,
				"type": type
			},
			dataType: 'json',
			async: false,
			// contentType:"application/json",
			success: function(data) {
				var list = [];
				var dataText = "<tr>\n" +
					"<th>来源</th>\n" +
					"<th>" + gridTitle + "</th>\n" +
					"</tr>";
				var total = 0;
				for (var i = 0; i < data.countList.length; i++) {
					var temp = {};
					temp.name = data.countList[i].ENTP_NAME;
					if (type == 1) {
						temp.value = data.countList[i].num;
						list.push(temp);
						dataText = dataText + "<tr>\n" +
							"<td>" + data.countList[i].ENTP_NAME + "</td>\n" +
							"<td>" + data.countList[i].num + "</td>\n" +
							"</tr>";
						total = total + data.countList[i].num;
					} else {
						temp.value = (data.countList[i].num * 1).toFixed(2);
						list.push(temp);
						dataText = dataText + "<tr>\n" +
							"<td>" + data.countList[i].ENTP_NAME + "</td>\n" +
							"<td>" + (data.countList[i].num * 1).toFixed(2) + "</td>\n" +
							"</tr>";
						total = total + ((data.countList[i].num * 1).toFixed(2) * 1);
					}
				}
				var data = genData(list);
				option.legend.data = data.legendData;
				option.legend.selected = data.selected;
				option.series[0].data = data.seriesData;
				$("#dataGrid").html(dataText);
				if (type == 2) {
					$("#total").html(total.toFixed(2));
				} else {
					$("#total").html(total);
				}
				myChart.setOption(option, true);
			}
		})
	}

	function getBeforeDate(n) {
		var n = n;
		var d = new Date();
		var year = d.getFullYear();
		var mon = d.getMonth() + 1;
		var day = d.getDate();
		if (day <= n) {
			if (mon > 1) {
				mon = mon - 1;
			} else {
				year = year - 1;
				mon = 12;
			}
		}
		d.setDate(d.getDate() - n);
		year = d.getFullYear();
		mon = d.getMonth() + 1;
		day = d.getDate();
		s = year + "-" + (mon < 10 ? ('0' + mon) : mon) + "-" + (day < 10 ? ('0' + day) : day);
		return s;
	}

	function dateInterval(startDate, endDate) {
		var s1 = startDate;
		s1 = new Date(s1.replace(/-/g, "/"));
		var s2 = endDate;
		s2 = new Date(s2.replace(/-/g, "/"));
		var days = s2.getTime() - s1.getTime();
		var time = parseInt(days / (1000 * 60 * 60 * 24));
		return time;
	}

	function getLastMonthFirstAndLastDay() {
		var nowdays = new Date();
		var year = nowdays.getFullYear();
		var month = nowdays.getMonth();
		var result = {};
		if (month == 0) {
			month = 12;
			year = year - 1;

		}
		if (month < 10) {
			month = '0' + month;
		}

		var myDate = new Date(year, month, 0);

		var startDate = year + '-' + month + '-01'; //上个月第一天
		var endDate = year + '-' + month + '-' + myDate.getDate(); //上个月最后一天
		result.startDate = startDate;
		result.endDate = endDate;
		return result;
	}

	function getOperatorOutStockCount() {

		agencyOutstockInstance.getAgencyOutstockCount({
			"startDate": startDate,
			"endDate": endDate,
			"entpId": entpId,
			"entpType": entpType,
			"type": type
		});

	}
}(mui, jQuery));
