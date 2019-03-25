var ajaxLock = false;

var agencyOutstockInstance = {

    getAgencyOutstockCount: function (params) {
        if(ajaxLock){
            return;
        }

        ajaxLock = true;

        $.ajax({
            type: "GET",
            url: Route.baseUrl + "/stock/outstock/getAgencyOnstockCount",
            data: params,
            dataType: 'json',
            async: false,
            // contentType:"application/json",
            complete:function(){
                ajaxLock = false;
            },
            success: function (data) {
                var list = [];
                var dataText = "<tr>\n" +
                    "<th>经营户</th>\n" +
                    "<th>"+ gridTitle +"</th>\n" +
                    "</tr>";
                var total = 0;
                $.each(data.countList,function (index,item) {
                    var temp = {};
                    temp.name = item.entpName;
                    item.num=item.count;
                    if (type == 1) {
                        temp.value = item.num;
                        list.push(temp);
                        dataText = dataText + "<tr>\n" +
                            "<td>" + item.entpName + "</td>\n" +
                            "<td>" + item.num + "</td>\n" +
                            "</tr>";
                        total = total + item.num;
                    } else {
                        temp.value = (item.num * 1).toFixed(2);
                        list.push(temp);
                        dataText = dataText + "<tr>\n" +
                            "<td>" + item.entpName + "</td>\n" +
                            "<td>" + (item.num * 1).toFixed(2) + "</td>\n" +
                            "</tr>";
                        total = total + ((item.num * 1).toFixed(2) * 1);
                    }
                })
                var data = agencyOutstockInstance.getAgencyOutstockCountData(list);
                option.legend.data = data.legendData;
                option.legend.selected = data.selected;
                option.series[0].data = data.seriesData;
                $("#dataGrid").html(dataText);
                if(type == 2){
                    $("#total").html(total.toFixed(2));
                } else {
                    $("#total").html(total);
                }
                myChart.setOption(option);
            }
        })
    },

    getAgencyOutstockCountData: function (list) {
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
    }
}