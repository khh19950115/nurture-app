function setData(ctrl, field, url, data, opt) {
    field = field || "text";

    function fn(array) {
        var selectedIndex = -1;
        var selectedItem = -1;
        $.each(array, function (index, value) {
            value.text = value[field];
            if (opt.id && opt.container && opt.id == value.id) {
                selectedIndex = index;
                selectedItem = value;
            }
        })
        if(!array || ($.isArray(array)&&array.length<1)){
            array=[{
                text:"<span class='no-data'>无更多数据</span>"
            }];
        }
        ctrl.setData(array);
        if (selectedIndex >= 0) {
            ctrl.pickers[0].setSelectedIndex(selectedIndex);
            opt.container.val(selectedItem[field]).data("val", selectedItem.id);
        }
        if ($.isFunction(opt.fn)) {
            opt.fn(array, selectedItem);
        }
    }

    if (typeof url == "string") {
        if (!url.startsWith(Route.baseUrl)) {
            url = Route.baseUrl + url;
        }
        opt = $.extend({}, {
            cache: false,
            type: 'get',
            url: url,
            data: data || {},
            success: function (data) {
                if ($.isArray(data)) {
                    fn(data);
                }
            }
        }, opt);
        $.ajax(opt);
    } else if ($.isArray(url)) {
        fn(url);
    }

}

function validate(object, type) {
    var success = true;
    $.each(type, function (name, value) {
        if (!object[name]) {
            mui.alert(value, 'Error', function () {
            });
            success = false;
            return false;
        }
    })
    return success;
}

$("button.all-select-btn").click(function () {
    // 判断表示全选的 复选框是否被选中
    var $this = $(this);
    var isChecked = $this.hasClass("isChecked");
    // 如果是选中，那么此时值为：true；则，让所有其他的checkbox全部选中
    if (isChecked) {
        $this.addClass("isChecked");
        $this.closest("div").find("input[type=checkbox]").prop("checked", false);
    } else {
        $this.removeClass("isChecked");
        $this.closest("div").find("input[type=checkbox]").prop("checked", true);
    }
})

function uuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    //s[8] = s[13] = s[18] = s[23] = "-";

    return s.join("");
}

var detail_tpl = "<li class=\"itemBox mui-table-view-cell\" style=\"padding-top: 0;padding-bottom: 0;\"> \n" +
    "  <div class=\"mui-slider-right mui-disabled\"> \n" +
    "    <a class=\"mui-btn slide-right-btn\" style=\"transform: translate(0px, 0px);\">删除</a> \n" +
    "  </div>  \n" +
    "  <div class=\"mui-slider-handle go-detail\"> \n" +
    "    <div class=\"IncomingPrice\" style=\"padding-bottom: 0;\"> \n" +
    "      <div class=\"commodityCode\"/>  \n" +
    "      <div class=\"commodityName\"/>  \n" +
    "      <div class=\"commodityNum\"> \n" +
    "        <input class=\"selectNum\" type=\"number\" data-patten='^([0-9]+(\\.\\d+)?|0\\.\\d+)$' data-patten-desc='请填写正确的数值！'/>  \n" +
    "        <span>kg</span> \n" +
    "      </div>  \n" +
    "      <div class=\"commodityPrice\"> \n" +
    "        <input class=\"selectMoney\" type=\"number\" data-patten='^([0-9]+(\\.\\d+)?|0\\.\\d+)$' data-patten-desc='请填写正确的数值！'/>  \n" +
    "        <span>元</span> \n" +
    "      </div> \n" +
    "    </div>  \n" +
    "    <div class=\"InfoBox aDisabled\"></div> \n" +
    "  </div> \n" +
    "</li>";

var outstock_detail_tpl = "<li class=\"itemBox mui-table-view-cell\" style=\"padding-top: 0;padding-bottom: 0;\"> \n" +
    "  <div class=\"mui-slider-right mui-disabled\"> \n" +
    "    <a class=\"mui-btn slide-right-btn\" style=\"transform: translate(0px, 0px);\">删除</a> \n" +
    "  </div>  \n" +
    "  <div class=\"mui-slider-handle go-detail\"> \n" +
    "    <div class=\"IncomingPrice\" style=\"padding-bottom: 0;\"> \n" +
    "      <div class=\"commodityCode\"/>  \n" +
    "      <div class=\"commodityName\"/>  \n" +
    "      <div class=\"commodityNum\"> \n" +
    "        <input class=\"selectNum\" type=\"number\" data-patten='^([0-9]+(\\.\\d+)?|0\\.\\d+)$' data-patten-desc='请填写正确的数值！'/>  \n" +
    "        <span>kg</span> \n" +
    "      </div>  \n" +
    "      <div class=\"commodityPrice\"> \n" +
    "        <input class=\"selectMoney\" type=\"number\" data-patten='^([0-9]+(\\.\\d+)?|0\\.\\d+)$' data-patten-desc='请填写正确的数值！'/>  \n" +
    "        <span>元</span> \n" +
    "      </div> \n" +
    "    </div>  \n" +
    "    <div class=\"InfoBox aDisabled\"> \n" +
    "      <input class=\"batchInp mui-btn mui-btn-block\" type=\"text\" value=\"最新批次\" disabled=\"disabled\" name=\"batchId\"/> \n" +
    "    </div> \n" +
    "  </div> \n" +
    "</li>";


var product_tpl = "<li class=\"mui-table-view-cell mui-checkbox mui-left listItem\">\n" +
    "                    <p><input class='product-id' name=\"productId\" type=\"checkbox\"></p>\n" +
    "                    <p class='product-no'></p>\n" +
    "                    <p class='product-name'></p>\n" +
    "                </li>";


var variety_tpl = "<li class=\"mui-table-view-cell mui-checkbox mui-left listItem\">\n" +
    "                    <p><input class='product-id' name=\"productId\" type=\"checkbox\"></p>\n" +
    // "                    <p class='product-no'></p>\n" +
    "                    <p class='product-name'></p>\n" +
    "                </li>";

var product_filter_tpl = "<li class=\"mui-table-view-cell mui-checkbox mui-left listItem\">\n" +
    "                            <p><input name=\"checkbox\" type=\"checkbox\"></p>\n" +
    "                            <p></p>\n" +
    "                        </li>";


var agency_tpl = "<div class=\"mui-input-row mui-checkbox mui-left slide-checkipt\">\n" +
    "                            <label class=\"check-name\"></label>\n" +
    "                            <input name=\"checkbox2\" value=\"\" type=\"checkbox\">\n" +
    "                        </div>";

var list_tpl = "<li class=\"mui-table-view-cell\">\n" +
    "               <div class=\"mui-slider-right mui-disabled\">\n" +
    "                   <a class=\"mui-btn slide-right-btn del_btn\">删除</a>\n" +
    "                   <a class=\"mui-btn slide-right-btn copy_btn\">复制</a>\n" +
    "               </div>\n" +
    "               <div class=\"mui-slider-handle go-detail\">\n" +
    "                   <div class=\"man-list-top2 go-company\">\n" +
    "                       <h4 class=\"man-list-h\"></h4>\n" +
    "                   </div>\n" +
    "                   <div class=\"man-list-bottom\">\n" +
    "                       <span class='time-label'>进货时间：</span><span class=\"time\"></span>\n" +
    "                       <span class='user-label'>登记人：</span><span class=\"user\"></span>\n" +
    "                   </div>\n" +
    "                   <span class=\"mui-icon mui-icon-arrowright man-arrow-btn2\"></span>\n" +
    "               </div>\n" +
    "           </li>";

var list_tpl_detection = "<li class=\"mui-table-view-cell\">\n" +
    "               <div class=\"mui-slider-right mui-disabled\">\n" +
    "                   <a class=\"mui-btn slide-right-btn del_btn\">删除</a>\n" +
    "               </div>\n" +
    "               <div class=\"mui-slider-handle go-detail\">\n" +
    "                   <div class=\"man-list-top2 go-company\">\n" +
    "                       <h4 class=\"man-list-h\"></h4>\n" +
    "                   </div>\n" +
    "                   <div class=\"man-list-bottom\">\n" +
    "                       <span class='time-label'>进货时间：</span><span class=\"time\"></span>\n" +
    "                       <span class='user-label'>登记人：</span><span class=\"user\"></span>\n" +
    "                   </div>\n" +
    "                   <span class=\"mui-icon mui-icon-arrowright man-arrow-btn2\"></span>\n" +
    "               </div>\n" +
    "           </li>";

var detection_detail_tpl = "<li class=\"itemBox mui-table-view-cell\" style=\"padding-bottom:5px;\"> \n" +
    "  <div class=\"mui-slider-right mui-disabled\"> \n" +
    "    <a class=\"mui-btn slide-right-btn\">删除</a> \n" +
    "  </div>  \n" +
    "  <div class=\"mui-slider-handle go-detail\"> \n" +
    "    <div class=\"IncomingPrice\" style=\"padding-bottom: 0;\"> \n" +
    "      <div class=\"commodityCode\"/>  \n" +
    "      <div class=\"commodityName\"/>  \n" +
    "      <div class=\"batch-tap commodityNum\" style=\"width: 50%;\"> \n" +
    "        <input class=\"batchInp mui-btn mui-btn-block\" name=\"batchId\" type=\"text\" value=\"\" disabled=\"disabled\"/> \n" +
    "      </div> \n" +
    "    </div> \n" +
    "  </div>\n" +
    "</li>\n";