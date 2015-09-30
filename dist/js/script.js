var responsive = function() {
    if ($(document).width() < 1000) {
        $(".lang-menu").addClass('compact');
        $(".lang-menu ul").css('display','none');
    } else {
        $(".lang-menu").removeClass('compact');
        $(".lang-menu ul").css('display','block');
    }
    var elem = $('.facilities-menu');
    var offset = elem.offset();
    var height = elem.outerHeight();
    var winHeight = $(window).height();
    var headerHeight = $('.header').height();
    $('.nav-menu.active').css('min-height', (offset.top + height + headerHeight));
    $('.map-container').css('height', (winHeight - headerHeight));
};

$(document).ready( function() {
    responsive();
    $('#menu-btn a').click( function(event) {
        event.preventDefault();
        var elem = $('.nav-menu');
        if (elem.hasClass('active')) {
            elem.removeClass('active').css('min-height',0);
            $(this).removeClass('active')
        } else {
            elem.addClass('active');
            $(this).addClass('active')
            responsive();
        }
    });
    $('.lang-current').click( function(event) {
        event.preventDefault();
        if ($('.lang-menu ul').hasClass('active')) {
            $('.lang-menu ul').toggleClass('active').slideUp(300);
        } else {
            $('.lang-menu ul').toggleClass('active').slideDown(300);
        }
        $(this).toggleClass('active');
    });
    $(document).mouseup(function(event) {
        if (!$(".lang-menu").is(event.target) && $(".lang-current").has(event.target).length === 0) {
            $(".lang-menu.compact ul").removeClass('active').slideUp(300);
        }
        if ($(".search").is(":focus")) {
            $('#keyboard').css('display','block');
        } else if(!$("#keyboard").is(event.target) && $("#keyboard").has(event.target).length === 0) {
            $('#keyboard').css('display','none');
        }
    });
    $('input').on('keyup', function () {
        $('.search').filter(function () {
            this.value != '' ? $('.search-btn').addClass('clear-search') : $('.search-btn').removeClass('clear-search')
        });
    });
    $('.search-btn').click( function() {
        $(this).prev('input').val('').focus();
        $(this).removeClass('clear-search');
        $('#keyboard').css('display','block');
    });
});

$(window).resize( function() {
    responsive();
});
