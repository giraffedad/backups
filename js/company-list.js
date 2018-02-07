//轮播图启动
;
$(window).on('load', function() {
    $('.ma5slider').ma5slider();
});
//获取地址栏参数
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}
// 继承的省份参数/公司ID
var inheritProvince = getQueryString("province");
var inheritCity = getQueryString("city");
var conmanyID = getQueryString("id");
console.log(inheritProvince, inheritCity);
// 选择城市后，在a连接中携带地址参数；######mark
function navAddString(province, city) {
    $(".nav-list li a").attr("href", function() {
        var url = this.href;
        // console.log(url);
        var newUrl = url.replace(url.substring(url.indexOf('.html') + 5, url.length), "");
        // console.log(newUrl);
        // redirect("?province=" + province + "&city=" + city);
        return newUrl + "?province=" + province + "&city=" + city;
    });
}
navAddString(inheritProvince, inheritCity);
// 导航
//自动获取地理位置
// remote_ip_info.province获取当前省份 remote_ip_info.city获取当前城市位置#如果上个页面选择过则继承地址
$(".current-city").text(inheritCity || remote_ip_info.city);
//判断地址栏有没有地址参数  如没有 则重定向 #####mark
if (!inheritCity) {
    window.location.href = "company-list.html?province=" + remote_ip_info.province + "&city=" + remote_ip_info.city;
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
    $(".district-serve ul").empty();
    var index = $(this).index();
    // 改变城市选择内容
    $(".table-select").children().eq(1).text(areaData[provinceSet].city[index].name);
    // 改变当前城市内容
    $(".current-city").text(areaData[provinceSet].city[index].name);
    $(this).text(areaData[provinceSet].city[index].name);
    // 发起ajax请求  将选择的城市参数传递
    reqAjax(areaData[provinceSet].name, areaData[provinceSet].city[index].name, undefined, 'http://47.96.31.157/zhuangxiuback/front/regionshangjia.html');
    // 传入选择的省份城市，加载装修公司所在区县
    console.log(areaData[provinceSet].city[index].area);
    navAddString(areaData[provinceSet].name, areaData[provinceSet].city[index].name);
    //装修公司地区
    areaLoad(areaData[provinceSet].name, areaData[provinceSet].city[index].name);
    //重定向刷新当前页面   ######mark
    window.location.href = "company-list.html?province=" + areaData[provinceSet].name + "&city=" + areaData[provinceSet].city[index].name;
    return citySet = index; //返回城市索引
})

//如果是从首页广告位进入  则优先显示该公司
function reqPrior() {
    if (conmanyID) {
        $.get("http://47.96.31.157/zhuangxiuback/front/bompsiness.html?id=" + conmanyID, function(data) {
            console.log(JSON.parse(data).data);
            prior(JSON.parse(data).data);
        });
    }
}
reqPrior();

function prior(data) {
    $(".prior").append(`
        <li class="clearfix">
            <a href="company-detail.html?province=${inheritProvince}&city=${inheritCity}&id=${data[0].id}">
                <div class="company-logo">
                    <img src="http://47.96.31.157/zhuangxiuback/files/images/${data[0].img}" alt="暂无图片">
                    <p>已有<span>25742</span>人咨询</p>
                </div>
                <div class="company-detail">
                    <div class="clearfix">
                        <div class="detail-left">
                            <div class="tit">
                                <h3>${data[0].compa}</h3>
                                <p>${data[0].address}</p>
                            </div>
                            <div class="tag">
                                <img src="images/company-list/资质认证.png" alt="">
                                <img src="images/company-list/优质公司.png" alt="">
                                <img src="images/company-list/诚信认证.png" alt="">
                            </div>
                        </div>
                        <div class="detail-right">
                            <div class="design-btn active">免费帮我做设计</div>
                            <div class="price-btn">免费帮我出价格</div>
                        </div>
                    </div>
                    <p class="note"><a href="##">业主真实经历《第一次装修用心记》已更新至24篇：十一期间不让装修不让装修修不让装修一期间修修不让装修一期修修不让装修一期修修不让装修一期不让装修不让装修修让装修</a></p>
                </div>
            </a>
        </li>
    `);
}

//ajax
function reqAjax(prov, city, area, url) {
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
                console.log(data.data);
                $(".interface").hide();
                $(".company-list ul").text("抱歉，该地区暂无数据！");
            } else {
                $(".company-list ul").empty().text("");
                company(data.data, prov, city); //默认加载首屏6组数据
                console.log(data.data);
                $(".interface").hide();
                paging(data.data, data.data.length);
            }
        },
        error: function() {
            $(".interface").hide();
        }
    });
}
reqAjax(inheritProvince, inheritCity || remote_ip_info.city, undefined, 'http://47.96.31.157/zhuangxiuback/front/regionshangjia.html', conmanyID);





//区县加载
function areaLoad(proName, cityName) {
    //默认加载当前位置区县 // remote_ip_info.province获取当前省份 remote_ip_info.city获取当前城市位置
    var setProName = proName || inheritProvince || remote_ip_info.province;
    var setCityName = cityName || inheritCity || remote_ip_info.city;
    for (var z = 0; z < areaData.length; z++) {
        var proData = areaData[z];
        if (proData.name == setProName) {
            var areaLen = proData.city.length;
            for (var c = 0; c < areaLen; c++) {
                if (proData.city[c].name == setCityName) {
                    // 获取该城市地区的个数
                    var areaCurLen = proData.city[c].area.length;
                    // 遍历县区
                    $.each(proData.city[c].area, function(index, value) {
                        $(".district-serve ul").append("<li>" + value + "</li>")
                    })
                }
            }
        }
    }
}
areaLoad();


//动态渲染公司列表
function company(data, prov, city) {
    $(".company-list ul").empty();
    //默认首屏6组数据
    var len = 6;
    if (data.length < 6) {
        len = data.length;
    }
    for (var i = 0; i < len; i++) {
        //###ES6模版字符串###记得用babel转ES5
        $(".company-list ul").append(`
            <li class="clearfix">
                <a href="company-detail.html?province=${inheritProvince}&city=${inheritCity}&id=${data[i].id}">
                    <div class="company-logo">
                        <img src="http://47.96.31.157/zhuangxiuback/files/images/${data[i].id}/${data[i].img}" alt="暂无图片">
                        <p>已有<span>25742</span>人咨询</p>
                    </div>
                    <div class="company-detail">
                        <div class="clearfix">
                            <div class="detail-left">
                                <div class="tit">
                                    <h3>${data[i].compa}</h3>
                                    <p>${data[i].address}</p>
                                </div>
                                <div class="tag">
                                    <img src="images/company-list/资质认证.png" alt="">
                                    <img src="images/company-list/优质公司.png" alt="">
                                    <img src="images/company-list/诚信认证.png" alt="">
                                </div>
                            </div>
                            <div class="detail-right">
                                <div class="design-btn active">免费帮我做设计</div>
                                <div class="price-btn">免费帮我出价格</div>
                            </div>
                        </div>
                        <p class="note"><a href="##">业主真实经历《第一次装修用心记》已更新至24篇：十一期间不让装修不让装修修不让装修一期间修修不让装修一期修修不让装修一期修修不让装修一期不让装修不让装修修让装修</a></p>
                    </div>
                </a>
            </li>
        `);
    }
}
//点击地区加载公司列表
function areaClick() {
    $(".district-box").unbind('click').on("click", "li", function() {
        $(this).addClass("search-active").siblings().removeClass("search-active");
        var area = $(this).text();
        reqAjax(undefined, inheritCity, area, 'http://47.96.31.157/zhuangxiuback/front/regionshangjia.html');
    });
}
areaClick();



function paging(data, dataLen) {
    //分页插件
    $('#box').paging({
            initPageNo: 1, // 初始页码
            totalPages: Math.ceil(dataLen / 6), //总页数  向上取整
            // totalCount: '合计1条数据', // 条目总数
            slideSpeed: 600, // 缓动速度。单位毫秒 
            callback: function(page) { // 回调函数 
                // console.log(page);
            }
        })
        // var cur=0;
        // // 下一页按钮
        // $('#box').on("click","#nextPage",function(){
        //     cur+=6;
        //     company(data,cur); //一次加载6组数据
        // })
        // // 上一页按钮
        // $('#box').on("click", "#prePage", function () {
        //     cur-=6;
        //     company(data, cur); //一次加载6组数据
        // })
}