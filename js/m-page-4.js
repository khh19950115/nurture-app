(function (mui, $) {
    //门店报表
	$("#storeReport li").each(function(k,v){
		v.addEventListener('tap',function(){
			mui.openWindow({
				url: 'm-page-4-analysis.html#'+this.dataset.attribute,
                createNew: true,
                styles: {
                    cachemode:"noCache"
                }
			});
		});
	});

	var systemId = StorageItem.getSystemId();

	if(systemId == SYSTEM_ID_WHOLESALEMARKET || systemId == SYSTEM_ID_QUICKTRACENM){
		if(!common.isOperating){
			$('#operatorsPurchase').show();
			$('#operatorDelivery').show();
		}
	} else if(systemId == SYSTEM_ID_FARMERSMARKET){
		//农贸系统没有出库
		if(!common.isOperating){
			$('#operatorsPurchase').show();
		}
	}

}(mui, jQuery));