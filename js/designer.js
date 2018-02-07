//获取地址栏参数######mark
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}
// 继承的城市参数######mark
var inheritProvince = getQueryString("province");
var inheritCity = getQueryString("city");
var desiId = getQueryString("desiid");
console.log(inheritProvince, inheritCity);
// 选择城市后，在a连接中携带地址参数；######mark
function navAddString(province, city) {
    $(".nav-list li a").attr("href", function() {
        var url = this.href;
        // console.log(url);
        var newUrl = url.replace(url.substring(url.indexOf('.html') + 5, url.length), "");
        // console.log(newUrl);
        return newUrl + "?province=" + province + "&city=" + city;
    });
}
navAddString(inheritProvince, inheritCity); //######mark
// 导航
//自动获取地理位置
// remote_ip_info.province获取当前省份 remote_ip_info.city获取当前城市位置
$(".current-city").text(inheritCity || remote_ip_info.city); //######mark
//判断地址栏有没有地址参数  如没有 则重定向 #####mark
if (!inheritCity) {
    window.location.href = "designer.html?province=" + remote_ip_info.province + "&city=" + remote_ip_info.city;
}
//地区弹框on/off
! function() {
    $(".header .m-left").on("click", function(event) {
        event.stopPropagation();
        $(".interface").show();
        $(this).css({
            backgroundColor: "#fff"
        })
    })
    $("body").on("click", function() {
        $(".interface").hide();
        $(".header .m-left").css({
            backgroundColor: "#f2f2f2"
        })
    })
}();

//初始化
function init() {
    $(".content-area").children().eq(0).show(200).siblings().hide(200);
    $(".table-select").children().eq(0).text("请选择省");
    $(".table-select").children().eq(1).text("请选择市");
    $(".citys").text("请先选择省份");
}
init();

// 清除城市
function clearCtiy() {
    $(".content-area .citys").empty();
}

//省市TAB切换
! function() {
    $(".table-select").children().on("click", function() {
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
    $(".content-area .province").append("<li>" + proData.name + "</li>")
}

var provinceSet = undefined; //省份参数
var citySet = undefined; //城市参数

//选择省份
$(".province").children("li").on("click", function() {
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
        for (var j = 0; j < citysLen.length; j++) {
            var cityData = areaData[index].city[j];
            $(".content-area .citys").append("<li class='cityItem'>" + cityData.name + "</li>")
        }
        return provinceSet = index; //返回省份索引
    })
    // 选择城市
$(".citys").unbind('click').on("click", ".cityItem", function() {
    $(".district-serve ul").empty()
    var index = $(this).index();
    // 改变城市选择内容
    $(".table-select").children().eq(1).text(areaData[provinceSet].city[index].name);
    // 改变当前城市内容
    $(".current-city").text(areaData[provinceSet].city[index].name);
    $(this).text(areaData[provinceSet].city[index].name);
    // 发起ajax请求  将选择的城市参数传递
    reqAjax(areaData[provinceSet].name, areaData[provinceSet].city[index].name, undefined, 'http://47.96.31.157/zhuangxiuback/front/regionshangjia.html'); //######mark
    navAddString(areaData[provinceSet].name, areaData[provinceSet].city[index].name); //######mark
    //重定向刷新当前页面   ######mark
    window.location.href = "designer.html?province=" + areaData[provinceSet].name + "&city=" + areaData[provinceSet].city[index].name;
    return citySet = index; //返回城市索引
})

//ajax
function reqAjax(prov, city, area, url, companyID) {
    $.ajax({
        type: 'get',
        url: url,
        dataType: 'json',
        data: {
            province: city,
            ctounty: area
        },
        success: function(data) {
            if (data.data.length == 0) {
                console.log("没有数据保持不变");
                $(".interface").hide();
            } else {
                $(".company-list ul").empty().text("");
                console.log(data.data)
                $(".interface").hide();
            }
        },
        error: function() {
            $(".interface").hide();
        }
    });
}
reqAjax(inheritProvince, inheritCity || remote_ip_info.city, undefined, 'http://47.96.31.157/zhuangxiuback/front/regionshangjia.html'); //######mark

//设计师详情页  数据渲染
function reqDesi(desiSet) {
    $.get("http://47.96.31.157/zhuangxiuback/front/findlist.html?id=" + desiSet, function(data) {
        var desiData = JSON.parse(data).data[0];
        console.log(desiData);
        desiInfo(desiData);
        desiDetail(desiData);
    });
}
reqDesi(desiId);

//头部设计师信息
function desiInfo(data) {
    $(".designer-photo .pic img").attr("src", "http://47.96.31.157/zhuangxiuback/files/images/" + data.busi_id + "/" + data.portrait); //设计师头像
    $(".designer-photo h2").text(data.name);
}

//个人介绍
function desiDetail(data) {
    $(".container .info .m-left").append(`
        <img src="http://47.96.31.157/zhuangxiuback/files/images/${data.busi_id}/${data.portrait}" alt="暂无图片">
        <div class="cont">
            <h3>${data.name}</h3>
            <p>资深设计师</p>
            <p>${data.person}</p>
            <p class="num">擅长户型：${data.layout}</p>
            <p>擅长风格：${data.style}</p>
            <p>从业经历：${data.practi}年</p>
        </div>
    `);
}