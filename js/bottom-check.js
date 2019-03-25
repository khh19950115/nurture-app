var $productChoiceDialog = $('.productChoiceDialog');
//主界面‘显示侧滑菜单’按钮的点击事件
$('#offCanvasShow').on('click', function() {
    if($(this).hasClass("product-none")){
        return;
    }
	$productChoiceDialog.show();
});
//菜单界面，‘关闭侧滑菜单’按钮的点击事件
$(".cancelBtn").on("click", function() {
	$productChoiceDialog.hide();
})
var $j_cbAll = $("#allSelectBtn1"), // 获取全选checkbox：jQuery对象
$cbs = $(".tableListBody1").find(":checkbox"), // 获取tbody中所有的复选框
cbsLen = $cbs.length; // 获取复选框的长度

// 给全选checkbox绑定单击事件：处理所有选项的checkbox选中状态
$j_cbAll.click(function() {
    // 判断表示全选的 复选框是否被选中
    var $this=$(this);
    var isChecked = $this.hasClass("isChecked");
    console.log(isChecked)
    // 如果是选中，那么此时值为：true；则，让所有其他的checkbox全部选中
    if (isChecked) {
    	$this.removeClass("isChecked");
         $cbs.prop("checked", false);
    } else {
    	$this.addClass("isChecked");
        $cbs.prop("checked", true);
    }
});
/*侧边筛选多选*/

var $j_cbAll2 = $("#allSelectBtn2"), // 获取全选checkbox：jQuery对象
    $cbs2 = $(".tableListBody2").find(":checkbox"), // 获取tbody中所有的复选框
    cbsLen = $cbs2.length; // 获取复选框的长度

// 给全选checkbox绑定单击事件：处理所有选项的checkbox选中状态
$j_cbAll2.click(function() {
    // 判断表示全选的 复选框是否被选中
    var $this=$(this);
    var isChecked = $this.hasClass("isChecked");
    console.log(isChecked)
    // 如果是选中，那么此时值为：true；则，让所有其他的checkbox全部选中
    if (isChecked) {
    	$this.removeClass("isChecked");
         $cbs2.prop("checked", false);
    } else {
    	$this.addClass("isChecked");
        $cbs2.prop("checked", true);
    }
});

// 给所有 tbody中的 checkbox元素 绑定click事件
$cbs2.click(function() {
    // 获取所有被选中的checkbox个数
    var $selCheckBox2 = $(".tableListBody2").find(":checkbox:checked"); // 此处只有复选框
    // 判断选中checkbox的个数 和 全部checkbox个数 是否相等
    // 如果相等，则这时候该选中 全选复选框
    if ($selCheckBox2.length === cbsLen) {
        $j_cbAll2.addClass("isChecked");
    } else {
        $j_cbAll2.removeClass("isChecked");
    }
});

mui('.mui-off-canvas-wrap').offCanvas().show();
$("#productSearchBtn").on("click",function(){
	$("#clickback").show();
	$(".slideMenu").show();
	$(".productChoiceDialog").addClass("leftConten");
	mui('.mui-off-canvas-wrap').offCanvas().show();
})
$("#resetBtn").on("click",function(){
	fnClose();
});
document.getElementById("clickback").addEventListener("tap",fnClose);
function fnClose(){
	mui('.mui-off-canvas-wrap').offCanvas().close();
	$("#clickback").hide();
	$(".slideMenu").hide();
	$(".productChoiceDialog").removeClass("leftConten");
}
