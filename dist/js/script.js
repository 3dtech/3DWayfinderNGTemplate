var responsive = function() {
    if ($(document).width() < 1000) {
        $(".lang-menu").addClass('compact');
        $(".lang-menu ul").css('display', 'block');
    } else {
        $(".lang-menu").removeClass('compact');
        $(".lang-menu ul").css('display', 'block');
    }
    var headerHeight = $('.header').height();
    
/*    $(".container").height($(window).innerHeight());
      $(".content-container").height($(".container").innerHeight() * 0.5);
        $(".header").height(headerHeight);
        $(".map-container").height($(".content-container").innerHeight() - headerHeight);
      $(".nav-menu").height($(".container").innerHeight() * 0.5);
        $(".tabs").height($(".nav-menu").innerHeight());*/
          /*$(".tab-heads").height($(".tabs").innerHeight() * 0.2);*/
            /*$(".tab-head").height($(".tab-heads").height()-5);
            $(".tab-head").width($(".tab-heads").height()-5);
            $(".tab-head").css('line-height',$(".tab-head").height()+'px');*/
          /*$(".tab-contents").height($(".tabs").innerHeight() * 0.8);*/

    /*console.log("windowHeight:",$(window).innerHeight());
    console.log("contentHeight:", $(".container").height());
    console.log("  contentContainerHeight:", $(".content-container").height());
    console.log("    headerHeight:", $(".header").height());
    console.log("    mapTabHeight:", $(".map-container").height());
    console.log("  tabsContainerHeight:", $(".nav-menu").height());
    console.log("    tabHeadsHeight:", $(".tab-heads").height());
    console.log("    tabContentsHeight:", $(".tab-contents").height());*/
};

$(document).ready(function() {
    responsive();
    $('#menu-btn a').click(function(event) {
        event.preventDefault();
        var elem = $('.nav-menu');
        if (elem.hasClass('active')) {
            elem.removeClass('active').css('min-height', 0);
            $(this).removeClass('active')
        } else {
            elem.addClass('active');
            $(this).addClass('active')
            responsive();
        }
    });
    $('.lang-current').click(function(event) {
        event.preventDefault();
        if ($('.lang-menu ul').hasClass('active')) {
            $('.lang-menu ul').toggleClass('active').slideUp(300);
        } else {
            $('.lang-menu ul').toggleClass('active').slideDown(300);
        }
        $(this).toggleClass('active');
    });
    $('.floor-button').click(function(event) {
        console.log("button pressed");
        event.preventDefault();
        if ($('.floor-buttons ul').hasClass('current-floor')) {
            $('.floor-buttons ul').toggleClass('current-floor');
        }
        $(this).toggleClass('current-floor')

    });
    $(document).mouseup(function(event) {
        if (!$(".lang-menu").is(event.target) && $(".lang-current").has(event.target).length === 0) {
            $(".lang-menu.compact ul").removeClass('active').slideUp(300);
        }
        if ($(".search").is(":focus")) {
            $('#keyboard').css('display', 'block');
        } else if (!$("#keyboard").is(event.target) && $("#keyboard").has(event.target).length === 0) {
            $('#keyboard').css('display', 'none');
        }
    });
    $('input').on('keyup', function() {
        $('.search').filter(function() {
            this.value != '' ? $('.search-btn').addClass('clear-search') : $('.search-btn').removeClass('clear-search')
        });
    });
    $('.search-btn').click(function() {
        $(this).prev('input').val('').focus();
        $(this).removeClass('clear-search');
        $('#keyboard').css('display', 'block');
    });
});

$(window).resize(function() {
    responsive();
});
