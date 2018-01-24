// 导航
!function ($) {
    //自动获取地理位置
    // remote_ip_info.province获取当前省份 remote_ip_info.city获取当前城市位置
    $(".current-city").text(remote_ip_info.city);

    //地区弹框淡入淡出
    !function(){
        $(".header .m-left").on("click",function(event){
            event.stopPropagation();
            $(".interface").show();
            $(this).css({
                backgroundColor:"#fff"
            })
        })
        $("body").on("click", function(){
            $(".interface").hide();
            $(".header .m-left").css({
                backgroundColor: "#f2f2f2"
            })
        })
    }();

    //初始化
    function init(){
        $(".content-area").children().eq(0).show(200).siblings().hide(200);
        $(".table-select").children().eq(0).text("请选择省");
        $(".table-select").children().eq(1).text("请选择市");
        $(".citys").text("请先选择省份");
        $(".area-bar").empty();
    }
    init();

    // 清除城市
    function clearCtiy(){
        $(".content-area .citys").empty();
    }

    //省市TAB切换
    !function(){
        $(".table-select").children().on("click",function(){
            init();
            // console.log($(this).index())
            var index = $(this).index();
            $(this).addClass("active").siblings().removeClass("active");
            $(".content-area").children().eq(index).show(200).siblings().hide(200);
        })
    }()

    //遍历省份数据
    for (var i = 0; i < areaData.length; i++) {
        var proData = areaData[i];
        $(".content-area .province").append("<li>" + proData.name +"</li>")
    }

    var provinceSet = undefined; //省份参数
    var citySet = undefined;//城市参数

    //选择省份
    $(".province").children("li").on("click",function(){
        init();
        clearCtiy();
        var index = $(this).index();
        // tab按钮和内容切换到城市
        $(".table-select").children().eq(1)
        .addClass("active").siblings().removeClass("active")
        .text(areaData[index].name);
        $(".content-area").children().eq(1).show(200).siblings().hide(200);
        // 遍历城市数据
        var citysLen = areaData[index].city;
        for (var j = 0; j < citysLen.length;j++){
            var cityData = areaData[index].city[j];
            $(".content-area .citys").append("<li class='cityItem'>" + cityData.name + "</li>")
        }
        return provinceSet = index; //返回省份索引
    })
    // 选择城市
    $(".citys").unbind('click').on("click",".cityItem", function(){
        $(".area-bar").empty().css({
            left:0
        });
        var index = $(this).index();
        $(".table-select").children().eq(1).text(areaData[provinceSet].city[index].name);
        $(".current-city").text(areaData[provinceSet].city[index].name);
        $(this).text(areaData[provinceSet].city[index].name);
        // 发起ajax请求  将选择的城市参数传递
        reqAjax(areaData[provinceSet].city[index].name);
        // 传入选择的省份城市，加载装修公司所在区县
        areaLoad(areaData[provinceSet].name,areaData[provinceSet].city[index].name);
        return citySet = index; //返回城市索引
    })
    
    //ajax
    function reqAjax(set) {
        $.ajax({
            type: 'get',
            url: 'http://47.96.31.157/zhuangxiuback/front/regionshangjia.html',
            dataType: 'json',
            data:{
                province: set
            },
            success: function (data) {
                if(data.data.length == 0){
                    console.log("没有数据保持不变")
                    $(".interface").hide();
                }else{
                    console.log(data.data)
                    $(".interface").hide();
                }
            }
        });
    }
    reqAjax(remote_ip_info.city);

    //区县横向滚动加载
    function areaLoad(proName,cityName){
        //默认加载当前位置区县 // remote_ip_info.province获取当前省份 remote_ip_info.city获取当前城市位置
        var setProName = proName || remote_ip_info.province;
        var setCityName = cityName || remote_ip_info.city;
        for (var z = 0; z < areaData.length; z++) {
            var proData = areaData[z];
            if (proData.name == setProName){
                var areaLen = proData.city.length;
                for (var c = 0; c < areaLen;c++){
                    if (proData.city[c].name == setCityName){
                        // 获取该城市地区的个数
                        var areaCurLen =  proData.city[c].area.length;
                        $.each(proData.city[c].area,function(index,value){
                            $(".area-bar").append("<li>" + value + "</li>")
                        })
                    }
                    
                }
            }
        }
        // 获取每个县区li的宽度并相加为ul的宽度
        var areaUlWidths = 0;
        var areaBoxWidth = $('.area-box').outerWidth();
        for (var a = 0; a < areaCurLen; a++) {
            var areaLiWidth = $('.area-bar>li').eq(a).outerWidth();
            areaUlWidths += areaLiWidth;
        }
        $(".area-bar").css({
            width: areaUlWidths + "px"
        })
        // cur：每次点击按钮滚动的像素数
        var cur = 0;
        $(".area-base .next").on("click",function(){
            cur -= 300;
            if (cur <= -areaUlWidths + areaBoxWidth){
                cur = -areaUlWidths + areaBoxWidth
            }
            $(".area-bar").css({
                left: cur+"px"
            })
        })
        $(".area-base .prev").on("click", function(){
            cur += 300;
            if (cur >= 0) {
                cur = 0;
            }
            $(".area-bar").css({
                left: cur + "px"
            })
        })
    }
    areaLoad();

    // 计算器地区二级联动插件启动
    $('#target').distpicker();
}(jQuery);