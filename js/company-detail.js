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
var conmanyID = getQueryString("id");
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
    window.location.href = "company-detail.html?province=" + remote_ip_info.province + "&city=" + remote_ip_info.city;
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
    window.location.href = "company-detail.html?province=" + areaData[provinceSet].name + "&city=" + areaData[provinceSet].city[index].name;
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
                // console.log(data.data)
                $(".interface").hide();
            }
        },
        error: function() {
            $(".interface").hide();
        }
    });
}
reqAjax(inheritProvince, inheritCity || remote_ip_info.city, undefined, 'http://47.96.31.157/zhuangxiuback/front/regionshangjia.html'); //######mark

//公司详情页  数据渲染
function reqPrior() {
    if (conmanyID) {
        $.get("http://47.96.31.157/zhuangxiuback/front/bompsiness.html?id=" + conmanyID, function(data) {
            var companyData = JSON.parse(data).data[0];
            // console.log(companyData)
            $(".design-proposal .proposal-box").css({ background: "none" });
            $(".designer .designer-box").css({ background: "none" });
            // ##公司信息
            companyInfo(companyData);
            proposal(companyData);
            designerInfo(companyData);
            workSite(companyData);
            measuring(companyData);
        });
    }
}
reqPrior();

//公司简介信息
function companyInfo(data) {
    var companyName = data.compa; //公司名称
    var companyProfile = data.profile; //公司简介
    var companyImg = data.img; //公司图片
    // console.log(companyName, companyProfile, companyImg);
    $(".introduction .content-box h2").text(companyName);
    $(".introduction .content-box .cont").text(companyProfile);
    $(".introduction .pic-box img").attr("src", "http://47.96.31.157/zhuangxiuback/files/images/" + data.id + "/" + companyImg);
}

// 时间戳转换
function gettime(t) {
    var _time = new Date(t);
    var year = _time.getFullYear(); //2017
    var month = _time.getMonth() + 1; //7
    var date = _time.getDate(); //10
    var hour = _time.getHours(); //10
    var minute = _time.getMinutes(); //56
    var second = _time.getSeconds(); //15
    return year + "年" + month + "月" + date + "日   " + hour + ":" + minute + ":" + second; //这里自己按自己需要的格式拼接
}
//设计方案
function proposal(companyData) {
    // console.log(companyData)
    var len = 3;
    var dataLen = companyData.im.length
    $(".design-proposal .proposal-num").text(dataLen);
    if (dataLen < 3) {
        len = dataLen;
    }
    for (var i = 0; i < len; i++) {
        var desiId = companyData.im[i].desi_id;
        $(".design-proposal .proposal-box").append(`
            <li>
                <a href="designer.html?province=${inheritProvince}&city=${inheritCity}&desiid=${desiId}">
                    <div class="m-top">
                        <img src="http://47.96.31.157/zhuangxiuback/files/images/${companyData.id}/${companyData.im[i].casepicture}" alt="暂无图片数据">
                        <div class="cover">
                            ${companyData.im[i].area}平米&nbsp;&nbsp;${companyData.im[i].style} &nbsp;${companyData.im[i].price}万&nbsp; ${companyData.im[i].address} &nbsp;${gettime(companyData.im[i].upload_time)}上传
                        </div>
                    </div>
                    <div class="m-bottom clearfix">
                        <div class="pic">
                            <img src="" alt="暂无图片数据">
                        </div>
                        <div class="text">
                            <p class="name"></p>
                            <p>
                                <span class="layout"></span>
                                <span>|</span>
                                <span class="style"></span>
                                <span>|</span>
                                <span class="service"></span>
                                <span>|</span>
                                <span class="price"></span>
                            </p>
                        </div>
                    </div>
                </a>
            </li>
        `);
        // 请求设计师数据
        console.log(desiId);
        $.get("http://47.96.31.157/zhuangxiuback/front/findlist.html?id=" + desiId, function(data) {
            var desiData = JSON.parse(data).data[0];
            // var set = desiData.img[0].service || undefined;
            console.log(desiData, desiData.busi_id)
            $(".design-proposal .proposal-box .text .name").text(desiData.name); //设计师名字
            $(".design-proposal .proposal-box .pic img").attr("src", "http://47.96.31.157/zhuangxiuback/files/images/" + desiData.busi_id + "/" + desiData.portrait); //设计师头像
            $(".design-proposal .proposal-box .text .layout").text(desiData.layout); //擅长户型
            $(".design-proposal .proposal-box .text .style").text(desiData.style); //擅长风格
            $(".design-proposal .proposal-box .text .service").text(desiData.img[0].service); //服务
            $(".design-proposal .proposal-box .text .price").text(desiData.img[0].price + "万"); //价格
        });
    }
};
// <!-- 设计师 -->
function designerInfo(data) {
    var desiLen = data.designer.length;
    $(".designer .designer-num").text(desiLen);
    var len = 4;
    if (desiLen < 4) {
        len = desiLen;
    }
    for (var i = 0; i < len; i++) {
        console.log(data.designer[i].id);
        var desiId = data.designer[i].id;
        $(".designer .designer-box").append(`
            <a href="designer.html?province=${inheritProvince}&city=${inheritCity}&desiid=${desiId}">
                <li>
                    <div class="m-left clearfix">
                        <div class="pic">
                            <img src="http://47.96.31.157/zhuangxiuback/files/images/${data.id}/${data.designer[i].portrait}" alt="暂无图片数据">
                        </div>
                        <div class="text">
                            <p class="name">${data.designer[i].name}&nbsp;&nbsp;|&nbsp;&nbsp;[13案例]</p>
                            <p>擅长户型：${data.designer[i].layout}</p>
                            <p>擅长风格：${data.designer[i].style}</p>
                            <div class="btn">预约此设计师</div>
                        </div>
                    </div>
                    <div class="m-right">
                        <img src="http://47.96.31.157/zhuangxiuback/files/images/${data.id}/${data.designer[i].img}" alt="暂无图片数据">
                    </div>
                </li>
            </a>
        `);
    }
}
// 装修工地
function workSite(data) {
    var len = 3;
    var dataLen = data.im.length
    if (dataLen < 3) {
        len = dataLen;
    }
    for (var i = 0; i < len; i++) {
        console.log(data.im[i]);
        $(".site-box").append(`
            <li class="clearfix">
                <div class="m-left">
                    <img src="http://47.96.31.157/zhuangxiuback/files/images/${data.id}/${data.im[i].casepicture}" alt="暂无图片数据">
                </div>
                <div class="m-middle">
                    <h2>${data.im[i].imgname}</h2>
                    <p>
                        <span>${data.im[i].province}</span>
                        <span>${data.im[i].address}</span>
                        <span>${data.im[i].price}万</span>
                        <span>${data.im[i].service}</span>
                        <span>${data.im[i].area}㎡</span>
                        <span>${data.im[i].style}</span>
                    </p>
                </div>
                <div class="m-right">
                    <a href="#">
                        <div>免费预约参观</div>
                    </a>
                </div>
            </li>
        `);
    }
}
//免费量房
function measuring(data) {
    var len = 10;
    var dataLen = data.t.length
    if (dataLen < 10) {
        len = dataLen;
    }
    for (var i = 0; i < len; i++) {
        // console.log(data.t[i]);
        $(".measuring-house .list").append(`
            <li class="clearfix">
                <p>${data.t[i].tm_owner}</p>
                <p>${data.t[i].tm_region}</p>
                <p>${data.t[i].tm_layout}</p>
                <p>${data.t[i].tm_area}㎡</p>
                <p>${data.t[i].tm_budget}万</p>
            </li>
        `);
    }
}