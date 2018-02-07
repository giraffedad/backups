// 加强版（兼容性基本完好）
! function() {

    //goToTop距浏览器顶端的距离，这个距离可以根据你的需求修改
    var topDistance = 300;

    //距离浏览器顶端多少距离开始显示goToTop按钮，这个距离也可以修改，但不能超过浏览器默认高度，为了兼容不同分辨率的浏览器，我建议在这里设置值为1；
    var showDistance = 1;

    //定义一个变量，方便后面加入在html元素标签中插入这个goToTop按钮的标签
    var goToTopButton = $('<div id="goToTop"><a href="javascript:;">顶部</a></div>');

    var thisTop = $(window).scrollTop() + topDistance;

    //在container的div里插入我们前面定义好的html标签元素
    $('body').append(goToTopButton);

    //设置goToTop按钮top的css属性和属性值
    // $('#goToTop').css('top', thisTop);
    // console.log($(window).scrollTop(), showDistance)
    if ($(window).scrollTop() < topDistance) {
        $('#goToTop').hide();
    }

    // 给窗口绑定一个滚动事件，当窗口滚动条滚动时执行
    $(window).scroll(function() {

        // console.log($(this).scrollTop());

        thisTop = $(this).scrollTop() + topDistance; //获取当前window向上滚动的距离
        // $('#goToTop').css('top', thisTop); //修改goToTop按钮的top距离

        if ($(this).scrollTop() > topDistance) {
            $('#goToTop').fadeIn();
        } else {
            $('#goToTop').fadeOut();
        }

    });
    // 给按钮绑定一个click事件，点击按钮时，返回顶部
    $('#goToTop a').click(function() {
        $('html ,body').animate({ scrollTop: 0 }, 300);
        return false;
    })
}();