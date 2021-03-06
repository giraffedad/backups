! function() {
    var slideLi = $(".banner .slides .item");

    function slideInit() {
        $(".banner .slides").children(".item").eq(0).show().siblings().hide();
        $(".banner .item img").eq(0).addClass("img-active");
        $(".banner .tit").eq(0).addClass("titActive");
        $(".banner .text").eq(0).addClass("textActive");
        $(".banner .btn").eq(0).addClass("btnActive");
    }
    slideInit();
    var len = $(".banner .slides").children().length;
    var cur = 0;
    var timer = setInterval(function() {
        cur++;
        if (cur >= len) {
            cur = 0;
        }
        slideLi.eq(cur).fadeIn(1000).siblings().fadeOut(1000);
        $(".banner .item img").removeClass("img-active").eq(cur).addClass("img-active");
        $(".banner .tit").removeClass("titActive").eq(cur).addClass("titActive");
        $(".banner .text").removeClass("textActive").eq(cur).addClass("textActive");
        $(".banner .btn").removeClass("btnActive").eq(cur).addClass("btnActive");
    }, 4000);
}();
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
// console.log(inheritProvince, inheritCity);
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
    window.location.href = "decorate-case.html?province=" + remote_ip_info.province + "&city=" + remote_ip_info.city;
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
    $(".area-bar").empty();
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
    window.location.href = "decorate-case.html?province=" + areaData[provinceSet].name + "&city=" + areaData[provinceSet].city[index].name;
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
                $(".interface").hide();
                // paging(data.data, data.data.length);
            }
        },
        error: function() {
            $(".interface").hide();
        }
    });
}
reqAjax(inheritProvince, inheritCity || remote_ip_info.city, undefined, 'http://47.96.31.157/zhuangxiuback/front/regionshangjia.html'); //######mark


// 请求检索参数数据
function reqClass(style, layout, min, max) {
    //条件判断  设置url字符串
    var styleUrl, layoutUrl, minUrl, maxUrl;
    style ? styleUrl = "&style=" + style : styleUrl = "";
    layout ? layoutUrl = "&layout=" + layout : layoutUrl = "";
    min ? minUrl = "&area=" + min : minUrl = "";
    max ? maxUrl = "&area1=" + max : maxUrl = "";
    console.log("http://47.96.31.157/zhuangxiuback/front/regionshangja.html?province=" + inheritCity + styleUrl + layoutUrl + minUrl + maxUrl);
    $.get("http://47.96.31.157/zhuangxiuback/front/regionshangja.html?province=" + inheritCity + styleUrl + layoutUrl + minUrl + maxUrl, function(data) {
        // console.log(inheritCity, style, layout, min, max);
        // console.log(JSON.parse(data).data);
        $(".decorate-case").css({
            background: "none"
        });
        companyShow(JSON.parse(data).data);
    });
}
reqClass();

var styleSet,
    layoutSet,
    minAreaSet,
    maxAreaSet;
// 选择风格
$(".decorate-style ul").unbind('click').on("click", "li", function() {
    $(".decorate-case .piece-middle").empty();
    $(".decorate-case").css({
        background: "url(images/loading1.gif) 750px 250px no-repeat"
    });
    var styleData = $(this).attr("style-data");
    $(this).addClass("li-active").siblings().removeClass("li-active");
    styleSet = styleData;
    reqClass(styleSet, layoutSet, minAreaSet, maxAreaSet);
});
// 选择户型
$(".decorate-type ul").unbind('click').on("click", "li", function() {
    $(".decorate-case .piece-middle").empty();
    $(".decorate-case").css({
        background: "url(images/loading1.gif) 750px 250px no-repeat"
    });
    var layoutData = $(this).attr("layout-data");
    $(this).addClass("li-active").siblings().removeClass("li-active");
    layoutSet = layoutData;
    reqClass(styleSet, layoutSet, minAreaSet, maxAreaSet);
});
// 选择面积
$(".decorate-proportion ul").unbind('click').on("click", "li", function() {
    $(".decorate-case .piece-middle").empty();
    $(".decorate-case").css({
        background: "url(images/loading1.gif) 750px 250px no-repeat"
    });
    $(this).addClass("li-active").siblings().removeClass("li-active");
    var minData = $(this).attr("min-data");
    var maxData = $(this).attr("max-data");
    minAreaSet = minData;
    maxAreaSet = maxData;
    reqClass(styleSet, layoutSet, minAreaSet, maxAreaSet);
});

//渲染数据
function companyShow(data) {
    console.log(data);
    // var len = 3;
    var dataLen = data.length
        // $(".design-proposal .proposal-num").text(dataLen);
        // if (dataLen < 3) {
        //     len = dataLen;
        // }
    for (var i = 0; i < dataLen; i++) {
        $(".decorate-case .piece-middle").append(`
            <a href="company-detail.html?province=${inheritProvince}&city=${inheritCity}&desiid=${data[i].busin_id}">
                <div class="case-info">
                    <div class="cover-box">
                        <p class="tit">${data[i].imgname}</p>
                        <p class="info">${data[i].price}万打造${data[i].area}㎡${data[i].style}风格的家</p>
                        <p class="company">所属公司：${data[i].compa}</p>
                        <div class="btn">查看详情</div>
                    </div>
                    <img src="http://47.96.31.157/zhuangxiuback/files/images/${data[i].busin_id}/${data[i].casepicture}" alt="">
                </div>
            </a>
        `);
    }
}

// function paging(data, dataLen) {
//     //分页插件
//     $('#box').paging({
//         initPageNo: 1, // 初始页码
//         totalPages: Math.ceil(dataLen / 6), //总页数  向上取整
//         // totalCount: '合计1条数据', // 条目总数
//         slideSpeed: 600, // 缓动速度。单位毫秒 
//         callback: function(page) { // 回调函数 
//             // console.log(page);
//         }
//     })
// }