// 导航
! function($) {
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
    console.log(inheritProvince, inheritCity);
    // 选择城市后，在a连接中携带地址参数；######mark
    function navAddString(province, city) {
        $(".nav-list li a,.cover-bar-box>a,.quote-list li .skip,.suggest .skip").attr("href", function() {
            var url = this.href;
            // console.log(url);
            var newUrl = url.replace(url.substring(url.indexOf('.html') + 5, url.length), "");
            // console.log(newUrl);
            return newUrl + "?province=" + province + "&city=" + city;
        });
    }
    navAddString(inheritProvince, inheritCity); //######mark
    //自动获取地理位置
    // remote_ip_info.province获取当前省份 remote_ip_info.city获取当前城市位置
    $(".current-city").text(inheritCity || remote_ip_info.city); //######mark

    //判断地址栏有没有地址参数  如没有 则重定向 #####mark
    if (!inheritCity) {
        window.location.href = "index.html?province=" + remote_ip_info.province + "&city=" + remote_ip_info.city;
    }
    //锚点链接跳转过渡
    $(function() {
            $('a[href*=#],area[href*=#]').click(function() {
                if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
                    var $target = $(this.hash);
                    $target = $target.length && $target || $('[name=' + this.hash.slice(1) + ']');
                    if ($target.length) {
                        var targetOffset = $target.offset().top;
                        $('html,body').animate({
                                scrollTop: targetOffset
                            },
                            300);
                        return false;
                    }
                }
            });
        })
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

    // banner图片加载
    ! function() {
        // $.get("http://47.96.31.157/", function(data) {
        //     // console.log(inheritCity, style, layout, min, max);
        //     console.log(JSON.parse(data).data);
        // });
        // $(".ma5slider").append(`
        // `);
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
        // 选择城市  => 关联areaLoad/reqAjax
    $(".citys").unbind('click').on("click", ".cityItem", function() {
        $(".area-bar").empty().css({
            left: 0
        });
        var index = $(this).index();
        // 改变城市选择内容
        $(".table-select").children().eq(1).text(areaData[provinceSet].city[index].name);
        // 改变当前城市内容
        $(".current-city").text(areaData[provinceSet].city[index].name);
        $(this).text(areaData[provinceSet].city[index].name);
        // 发起ajax请求  将选择的城市参数传递
        reqAjax(areaData[provinceSet].name, areaData[provinceSet].city[index].name, undefined, 'http://47.96.31.157/zhuangxiuback/front/businead.html'); //######mark
        navAddString(areaData[provinceSet].name, areaData[provinceSet].city[index].name); //######mark
        //重定向刷新当前页面   ######mark
        window.location.href = "index.html?province=" + areaData[provinceSet].name + "&city=" + areaData[provinceSet].city[index].name;
        // 传入选择的省份城市，加载装修公司所在区县
        areaLoad(areaData[provinceSet].name, areaData[provinceSet].city[index].name);
        return citySet = index; //返回城市索引
    })


    //ajax######mark
    function reqAjax(prov, city, area, url, companyID) { //######mark
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
                    console.log("没有数据");
                    $(".company-list").text("抱歉，该地区暂无数据！");
                    $(".interface").hide();
                    $(".company-list").css({
                        background: "none"
                    });

                } else {
                    company(data.data, prov, city);
                    $(".interface").hide();
                    $(".company-list").css({
                        background: "none"
                    });
                }
            },
            error: function() {
                $(".interface").hide();
            }
        });
    }
    reqAjax(inheritProvince, inheritCity || remote_ip_info.city, undefined, 'http://47.96.31.157/zhuangxiuback/front/businead.html'); //######mark

    //区县横向滚动加载
    function areaLoad(proName, cityName) {
        //默认加载当前位置区县 // remote_ip_info.province获取当前省份 remote_ip_info.city获取当前城市位置
        var setProName = proName || inheritProvince || remote_ip_info.province; //######mark
        var setCityName = cityName || inheritCity || remote_ip_info.city; //######mark
        for (var z = 0; z < areaData.length; z++) {
            var proData = areaData[z];
            if (proData.name == setProName) {
                var areaLen = proData.city.length;
                for (var c = 0; c < areaLen; c++) {
                    if (proData.city[c].name == setCityName) {
                        // 获取该城市地区的个数
                        var areaCurLen = proData.city[c].area.length;
                        $.each(proData.city[c].area, function(index, value) {
                            $(".area-bar").append("<li>" + value + "</li>");
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
        $(".area-base .next").on("click", function() {
            cur -= 300;
            if (cur <= -areaUlWidths + areaBoxWidth) {
                cur = -areaUlWidths + areaBoxWidth
            }
            $(".area-bar").css({
                left: cur + "px"
            })
        })
        $(".area-base .prev").on("click", function() {
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
    //动态渲染广告位（默认）
    function company(data, prov, city) {
        $(".company-list").empty();
        //###ES6模版字符串###记得用babel转ES5
        $.each(data, function(index, value) {
            // console.log(data[index].id, data[index].im[0].casepicture, data[index].img, data[index].compa)
            $(".company-list").append(`
                <li>
                    <a href="company-list.html?province=${prov}&city=${city}&id=${data[index].id}">
                        <i class="recommend"></i>
                        <img class="pic" src="http://47.96.31.157/zhuangxiuback/files/images/${data[index].im[0].casepicture}" alt="暂无图片数据">
                        <div class="logo-box">
                            <img class="logo" src="http://47.96.31.157/zhuangxiuback/files/images/${data[index].img}" alt="暂无商家logo">
                        </div>
                        <div class="content">
                            <p class="company-name">${data[index].compa}</p>
                            <p class="prestige">
                                好评率：<span>99%</span>
                                设计方案：<span>666</span> 
                                业主评论：<span>888</span>
                            </p>
                            <div class="button">免费设计</div>
                        </div>
                    </a>
                </li>
            `);
        })
    }
    $(".company-list").css({
        background: "url(images/loading1.gif) 684px 150px no-repeat"
    });
    //点击地区加载广告位
    function areaClick() {
        $(".area-bar").unbind('click').on("click", "li", function() {
            $(this).addClass("area-active").siblings().removeClass("area-active");
            $(".company-list").empty();
            console.log($(this).index());
            var prov = inheritProvince;
            var city = $(".current-city").text();
            var area = $(this).text();
            $(".company-list").css({
                background: "url(images/loading1.gif) 684px 150px no-repeat"
            });
            reqAjax(prov, city, area, 'http://47.96.31.157/zhuangxiuback/front/businead.html'); //######mark
        });
        $(".area-bar").unbind('mouseenter').on("mouseenter", "li", function() {
            $(this).addClass("area-hover").siblings().removeClass("area-hover");
        });
        $(".area-bar").on("mouseleave", function() {
            $(this).children("li").removeClass("area-hover");
        });
    }
    areaClick();
    //加载新闻列表
    function newsList() {
        $.get("http://47.96.31.157/zhuangxiuback/front/newslist.html", function(data) {
            var newsData = JSON.parse(data).data;
            var dataLen = newsData.length;
            var len = 8;
            if (dataLen < 8) {
                len = dataLen;
            }
            for (var i = 0; i < len; i++) {
                $(".article-list").append(`
                    <a href="decorate-notice.html?province=${inheritProvince}&city=${inheritCity}&newsid=${newsData[i].newsid}">
                        <p class="tit">《${newsData[i].newstitle}》</p>
                    </a>
                `);

            }
        });
    }
    newsList();
    // 计算器地区二级联动插件启动
    $('#target').distpicker();
}(jQuery);