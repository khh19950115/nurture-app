(function (window) {

    var ComConst = {
        /**
         * 企业性质(ID:20001)
         */
        ENTP_NATURE_ID: "20001",

        /**
         * 企业类型(ID:20002)
         */
        ENTP_TYPE_ID: "20002",

        /**
         * 性别(ID:10002)
         */
        SEX_TYPE_ID: "10002",

        /**
         * 每页数据条数
         */
        PAGE_SIZE: 20,

        /**
         * 初始页码
         */
        INIT_PAGE_NUMBER: 1,

        /**
         * 初始上传文件数
         */
        INIT_UPFILE_TOTAL: 0,

        /**
         * 经营户类型企业,106
         */
        SUPPLIER_NATURE_106: "106",

        /**
         * 经营户类型企业,106
         */
        SUPPLIER_NATURE_106_TEXT: "企业",

        /**
         * 经营户类型个体,107
         */
        SUPPLIER_NATURE_107: "107",

        /**
         * 经营户类型个体,107
         */
        SUPPLIER_NATURE_107_TEXT: "个体"

    };

    var FormUtil = {
        //根据共同code获取对应值，并组装成 [{text:'',value:''}]
        getOptionData: function getOptionData(codeId, successFun) {
            var url = '/core/commonCode/getCommonCodeByCodeId';
            var ajaxSetting = {
                url: Route.baseUrl + url,
                type: "GET",
                dataType: 'json',
                contentType: 'application/json;charset=utf-8;',
                data: {'codeId': codeId},
                async: true,
                success: function (data) {
                    var resultData = [];
                    $.each(data, function (i, rowData) {
                        var rows = {};
                        rows.text = rowData.codeDtlName;
                        rows.value = rowData.codeDtlId;
                        resultData.push(rows);
                    });
                    successFun(resultData);
                },
                errors: function (error) {
                    mui.toast('获取数据失败！', {duration: 'long', type: 'div'});
                }
            };
            $.ajax(ajaxSetting);
        },

        //校验表单,并且提示
        validForm: function validData() {
            var check = true;
            mui("input").each(function () {
                var hasRequired = jQuery(this).data('required');
                if (hasRequired) {
                    var description = jQuery(this).data('description');
                    if (description == undefined || description == null || description == '') {
                        description = '有必填项没有填写！';
                    }
                    if (!this.value || this.value.trim() == "") {
                        check = false;
                        mui.toast(description, {duration: 'long', type: 'div'});
                        return false;
                    }
                }

                var hasPatten = jQuery(this).attr('data-patten');
                //判断是否需要校验正则
                if (hasPatten) {
                    //如果非必填，没有值则不校验
                    if (this.value && this.value.trim() != "") {
                        var pattenDesc = jQuery(this).data('patten-desc');
                        if (pattenDesc == undefined || pattenDesc == null || pattenDesc == '') {
                            pattenDesc = '输入的字符不正确！';
                        }
                        var regExp = new RegExp(hasPatten);
                        if (!regExp.test(this.value)) {
                            check = false;
                            mui.toast(pattenDesc, {duration: 'long', type: 'div'});
                            return false;
                        }
                        //eval('var regExp = /'+ hasPatten +'/');

                        /*if(!regExp.test(this.value)) {
                            check = false;
                            mui.toast(pattenDesc, {duration: 'long', type: 'div'});
                            return false;
                        }*/
                    }
                }

            });
            return check;
        },

        //时间控件设置项，精确到,年月日，最早1900-01-01最晚日期截止至今天。适用于：出生日期
        dtPickDateOption: {
            type: 'date',
            beginDate: new Date(1900, 0, 1),
            endDate: new Date(),
            labels: ['年', '月', '日', '时', '分']
        },

        //通过地址调用百度Web API 解析出出省市区及经纬度，默认取第一个结果（返回的address是接口返回的）
        getAddressByApi: function (address, inputIds) {
            if (address == undefined || !address || address.trim() == "") {
                console.log('地址为空！');
                return false;
            }
            address = decodeURI(address);
            //decodeURIComponent(编码后字符);
            var url = 'http://api.map.baidu.com/place/v2/suggestion?query=' + address + '&region=%E5%85%A8%E5%9B%BD&city_limit=false&output=json&ak=vKv2OP8l4Ud1bV3VGTUwx5CIRaSrN61M';

            var setting = {
                url: url,
                type: 'GET',
                contentType: 'application/json;charset=utf-8;',
                dataType: 'jsonp',
                async: true,
                success: function (data) {
                    var resultData = {};
                    if (data.status == 0 && data.message == 'ok') {
                        var result = data.result;
                        if (result.length > 0) {
                            //省
                            resultData.province = result[0].province;
                            //市
                            resultData.city = result[0].city;
                            //区
                            resultData.area = result[0].district;
                            //详细地址
                            resultData.address = result[0].name;
                            //纬度 latitude
                            resultData.latitude = result[0].location.lat;
                            //经度 longitude
                            resultData.longitude = result[0].location.lng;

                            /*var resultData = [];
                            $.each(result, function (i, rowData) {
                                var rows = {};
                                //省
                                rows.province = rowData.province;
                                //市
                                rows.city = rowData.city;
                                //区
                                rows.area = rowData.district;
                                //详细地址
                                rows.address = rowData.name;
                                //纬度 latitude
                                rows.latitude = rowData.location.lat;
                                //经度 longitude
                                rows.longitude = rowData.location.lng;

                                resultData.push(rows);

                                //此处break 取api的第一个结果
                                return false;
                            });
                            successFun(resultData);*/
                        } else {
                            mui.toast('输入的地址不正确，请重新输入！', {duration: 'long', type: 'div'});
                        }
                    } else {
                        mui.toast('解析地址错误，请输入正确的地址！', {duration: 'long', type: 'div'});
                    }

                    //successFun(resultData);

                    if ($.isEmptyObject(resultData)) {
                        $('#' + inputIds.provinceId).val('');
                        $('#' + inputIds.cityId).val('');
                        $('#' + inputIds.areaId).val('');
                        $('#' + inputIds.fieldLatitude).val('');
                        $('#' + inputIds.fieldLongitude).val('');
                        //$('#' + inputIds.address).val('');
                        mui.toast('输入的地址不正确，请重新输入！', {duration: 'long', type: 'div'});
                    } else {
                        $('#' + inputIds.provinceId).val(resultData.province);
                        $('#' + inputIds.cityId).val(resultData.city);
                        $('#' + inputIds.areaId).val(resultData.area);
                        $('#' + inputIds.fieldLatitude).val(resultData.latitude);
                        $('#' + inputIds.fieldLongitude).val(resultData.longitude);
                        //$('#' + inputIds.address).val(address);
                    }

                },
                error: function (error) {
                    mui.toast('获取数据失败！', {duration: 'long', type: 'div'});
                }
            };
            $.ajax(setting);
        },

        getAddressByApi: function (address, inputIds, fun) {
            if (address == undefined || !address || address.trim() == "") {
                console.log('地址为空！');
                return false;
            }
            address = decodeURI(address);
            //decodeURIComponent(编码后字符);
            var url = 'http://api.map.baidu.com/place/v2/suggestion?query=' + address + '&region=%E5%85%A8%E5%9B%BD&city_limit=false&output=json&ak=vKv2OP8l4Ud1bV3VGTUwx5CIRaSrN61M';

            var setting = {
                url: url,
                type: 'GET',
                contentType: 'application/json;charset=utf-8;',
                dataType: 'jsonp',
                async: true,
                success: function (data) {
                    var resultData = {};
                    if (data.status == 0 && data.message == 'ok') {
                        var result = data.result;
                        if (result.length > 0) {
                            //省
                            resultData.province = result[0].province;
                            //市
                            resultData.city = result[0].city;
                            //区
                            resultData.area = result[0].district;
                            //详细地址
                            resultData.address = result[0].name;
                            //纬度 latitude
                            resultData.latitude = result[0].location.lat;
                            //经度 longitude
                            resultData.longitude = result[0].location.lng;

                            /*var resultData = [];
                            $.each(result, function (i, rowData) {
                                var rows = {};
                                //省
                                rows.province = rowData.province;
                                //市
                                rows.city = rowData.city;
                                //区
                                rows.area = rowData.district;
                                //详细地址
                                rows.address = rowData.name;
                                //纬度 latitude
                                rows.latitude = rowData.location.lat;
                                //经度 longitude
                                rows.longitude = rowData.location.lng;

                                resultData.push(rows);

                                //此处break 取api的第一个结果
                                return false;
                            });
                            successFun(resultData);*/
                        } else {
                            mui.toast('输入的地址不正确，请重新输入！', {duration: 'long', type: 'div'});
                        }
                    } else {
                        mui.toast('解析地址错误，请输入正确的地址！', {duration: 'long', type: 'div'});
                    }

                    //successFun(resultData);

                    if ($.isEmptyObject(resultData)) {
                        $('#' + inputIds.provinceId).val('');
                        $('#' + inputIds.cityId).val('');
                        $('#' + inputIds.areaId).val('');
                        $('#' + inputIds.fieldLatitude).val('');
                        $('#' + inputIds.fieldLongitude).val('');
                        //$('#' + inputIds.address).val('');
                        mui.toast('输入的地址不正确，请重新输入！', {duration: 'long', type: 'div'});
                    } else {
                        $('#' + inputIds.provinceId).val(resultData.province);
                        $('#' + inputIds.cityId).val(resultData.city);
                        $('#' + inputIds.areaId).val(resultData.area);
                        $('#' + inputIds.fieldLatitude).val(resultData.latitude);
                        $('#' + inputIds.fieldLongitude).val(resultData.longitude);
                        //$('#' + inputIds.address).val(address);
                        fun();
                    }

                },
                error: function (error) {
                    mui.toast('获取数据失败！', {duration: 'long', type: 'div'});
                }
            };
            $.ajax(setting);
        },

        //通过百度地图JS先获取地址的经纬度，再通过经纬度获取到省市区及经纬度（此方式不太准确）
        //如要用此方式需要引入百度地图<script type="text/javascript" src="http://api.map.baidu.com/api?v=2.0&ak=vKv2OP8l4Ud1bV3VGTUwx5CIRaSrN61M"></script>
        getAddressByDom: function (address, inputIds) {
            var result = {};
            if (address == undefined || !address || address.trim() == "") {
                console.log('输入的地址为空!');
                return false;
            }
            var geocoder = new BMap.Geocoder();
            geocoder.getPoint(address, function (point) {
                //纬度 latitude
                //result.latitude = point.lat;
                //经度 longitude
                //result.longitude = point.lng;
                geocoder.getLocation(point, function (rs) {
                    var addComp = rs.addressComponents;
                    //省
                    result.province = addComp.province;
                    //市
                    result.city = addComp.city;
                    //区
                    result.area = addComp.district;
                    //街道 + 门牌号
                    result.address = addComp.street + addComp.streetNumber;
                    //纬度 latitude
                    result.latitude = rs.point.lat;
                    //经度 longitude
                    result.longitude = rs.point.lng;
                });
            });

            //returnFun(result);

            if ($.isEmptyObject(result)) {
                $('#' + inputIds.provinceId).val('');
                $('#' + inputIds.cityId).val('');
                $('#' + inputIds.areaId).val('');
                $('#' + inputIds.fieldLatitude).val('');
                $('#' + inputIds.fieldLongitude).val('');
                $('#' + inputIds.address).val('');
                mui.toast('输入的地址不正确，请重新输入！', {duration: 'long', type: 'div'});
            } else {
                $('#' + inputIds.provinceId).val(resultData.province);
                $('#' + inputIds.cityId).val(resultData.city);
                $('#' + inputIds.areaId).val(resultData.area);
                $('#' + inputIds.fieldLatitude).val(resultData.latitude);
                $('#' + inputIds.fieldLongitude).val(resultData.longitude);
                //$('#' + inputIds.address).val(address);
            }

        }
    };

    var PageUtil = {
        //下拉刷新
        pullRefreshDownSettings: {
            height: 100,//可选,默认50.触发下拉刷新拖动距离,
            auto: false,//可选,默认false.首次加载自动下拉刷新一次
            contentdown: "下拉可以刷新",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
            contentover: "释放立即刷新",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
            contentrefresh: "正在刷新...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
            callback: function () {
                window.location.reload();
                //this.endPulldownToRefresh();//下拉加载完毕,隐藏正在加载...
            } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
        },
        //上拉加载更多
        pullRefreshUpSettings: {
            offset: 150, //距离底部高度(到达该高度即触发)
            auto: true,//可选,默认false.自动上拉加载一次
            show: true,
            contentinit: '上拉加载更多',
            contentdown: '上拉加载更多',
            contentrefresh: "正在加载...",//可选，正在加载状态时，上拉加载控件上显示的标题内容
            contentnomore: '没有更多数据了',//可选，请求完毕若没有更多数据时显示的提醒内容；
            callback: function () {
                refreshUp();
                this.endPullupToRefresh();//上拉加载完毕,隐藏正在加载...
            }//必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
        }
    };

    (function (mui, doc, $) {

        if (mui.os.android) {
            PageUtil.pullRefreshUpSettings["style"] = 'circle';
            PageUtil.pullRefreshUpSettings["color"] = '#2BD009';
            PageUtil.pullRefreshDownSettings["style"] = 'circle';//必选,下拉刷新样式,目前支持原生5+"circle"样式
            PageUtil.pullRefreshDownSettings["color"] = '#2BD009';//可选，默认“#2BD009” 下拉刷新控件颜色
        }else{
			$("#upload").removeAttr("capture");
		}

    }(mui, document, jQuery));

    var FileUtil = {
        //上传文件
        uploadFile: function (file, successFun) {
            var url = Route.baseUrl + "/core/fileInfo/uploader";
            var formData = new FormData();
            formData.append("file_data", file);
            var settings = {
                url: url,
                type: "POST",
                data: formData,
                contentType: false,
                processData: false,
                success: function (data) {
                    var file = data.files[0];
                    var result = {};
                    result.id = file.id;
                    result.url = file.url.split(',')[1];
                    successFun(result);
                },
                error: function () {
                    mui.toast('上传失败！', {duration: 'long', type: 'div'});
                }
            };
            $.ajax(settings);
        },

        //通过ID获取文件全路径
        getFileFullPath: function (id, successFun) {
            var url = Route.baseUrl + '/core/fileInfo/getFileFullPath/' + id;

            var settings = {
                url: url,
                type: "GET",
                dataType: 'json',
                contentType: 'application/json;charset=utf-8;',
                async: true,
                success: function (data) {
                    var filePullPath = data.fileFullPath;
                    successFun(filePullPath);
                },
                errors: function (error) {
                    mui.toast('获取数据失败！', {duration: 'long', type: 'div'});
                }
            };

            $.ajax(settings);
        },

        /*uploadFileList : function (successFun) {
            var formData = new FormData();
            formData.append("file_data", $("#pushFileForm").files);
            var settings = {
                url: "/core/fileInfo/uploader",
                type: "POST",
                data: formData,
                contentType: false,
                processData: false,
                success: function (data) {
                    var fileList = data.files;
                    var resultList = [];
                    $.each(fileList, function (i, rowData) {
                        var file = {};
                        file.index = i;
                        file.id = rowData.id;
                        file.url = rowData.url.split(',')[1];
                        resultList.push(file);
                    });
                    successFun(resultList);
                },
                error: function () {
                    mui.toast('上传失败！', {duration: 'long', type: 'div'});
                }
            };
            $.ajax(settings);
        }*/

        /*
        三个参数
        file：一个是文件(类型是图片格式)，
        w：一个是文件压缩的后宽度，宽度越小，字节越小
        objDiv：一个是容器或者回调函数
         */
		
        photoCompress: function (file, w, objDiv) {
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function () {
                var re = this.result;
                FileUtil.canvasDataURL(re, w, objDiv)
            };
        },
        //android
        photoCompressForAndroid: function (file, w, objDiv) {
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function () {
                var re = window.URL.createObjectURL(file)
                FileUtil.canvasDataURL(re, w, objDiv)
            };
        },
//压缩
        canvasDataURL: function (path, obj, callback) {
            var img = new Image();
            img.src = path;
            img.onload = function () {
                var that = this;
                // 默认按比例压缩
                var w = that.width,
                    h = that.height,
                    scale = w / h;
                w = obj.width || w;
                h = obj.height || (w / scale);
                var quality = 0.7;  // 默认图片质量为0.7
                //生成canvas
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                // 创建属性节点
                var anw = document.createAttribute("width");
                anw.nodeValue = w;
                var anh = document.createAttribute("height");
                anh.nodeValue = h;
                canvas.setAttributeNode(anw);
                canvas.setAttributeNode(anh);
                ctx.drawImage(that, 0, 0, w, h);
                // 图像质量
                if (obj.quality && obj.quality <= 1 && obj.quality > 0) {
                    quality = obj.quality;
                }
                // quality值越小，所绘制出的图像越模糊
                var base64 = canvas.toDataURL('image/jpeg', quality);
                // 回调函数返回base64的值
                callback(base64);
            }
        },
        //放大图片
        enlargeImg: function () {
            var imgs = document.querySelectorAll("img");  //获取点击需要方法的图片
            var enlarge = document.querySelector(".click-enlarge");//获取遮罩层容器
            var clienthight = document.documentElement.clientHeight;//获取屏幕的宽高
            var clientwidth = document.documentElement.clientWidth;
            enlarge.style.width = clientwidth + 'px';　//使遮罩层铺满屏幕
            enlarge.style.height = clienthight + 'px';
            $(imgs).each(function (v, i) {//循环获取的图片并绑定点击事件
                $(this).click(function () {
                    enlarge.classList.add("imgActive");
                    var imgsrc = $(this).attr("src");
                    var newimg = document.createElement("img");
                    newimg.src = imgsrc;
                    newimg.style.width = '100%';
                    enlarge.innerHTML = "";
                    enlarge.appendChild(newimg);
                })
            });
            enlarge.onclick = function () {
                this.classList.remove("imgActive");
            };

        },

        /**
         * 将以base64的图片url数据转换为Blob
         *  用url方式表示的base64图片数据
         */
        convertBase64UrlToBlob: function (urlData, fileName) {
            var arr = urlData.split(','), mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new File([u8arr], fileName, {type: mime});
        }

    };

    window.FormUtil = FormUtil;

    window.ComConst = ComConst;

    window.PageUtil = PageUtil;

    window.FileUtil = FileUtil;

})(window);