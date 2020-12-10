function randomColor(min = 0, max = 255) {
    min = Math.max(0, min);
    max = Math.min(255, max);
    let random = () => parseInt(Math.random() * (max - min) + min);
    return 'rgb(' + random() + ',' + random() + ',' + random() + ')';
}

function getOffsetLeft(element, end = { endKey : 'tagName', endName : 'BODY' }) {
    let endKey = end.endKey, endName = end.endName;
    let recursion = (element) => {
        if (element !== null && element[endKey] !== endName) {
            return element.offsetLeft + recursion(element.parentNode);
        } else return 0;
    }

    return recursion(element);
}

function adjustDropDownContentPostion(content) {
    let w = $('.w')[0];
    let contentWidth = content.offsetWidth;
    let $content = $(content);
    let button = $content.parent('.dropDownButton')[0];
    let buttonLeft = button.offsetLeft;
    console.log(buttonLeft, contentWidth, w.offsetWidth);
    if ((buttonLeft + contentWidth) > (w.offsetWidth)) {
        $content.css('left', button.offsetLeft - contentWidth + button.offsetWidth 
            + -parseInt($content.css('margin-left')) + 'px');
    }
}

function addTabViewEvent(tabView) {
    let tabs = tabView.children('ul').children();
    let contents = tabView.children('.content');
    tabs.on('mouseover', function() {
        let $this = $(this);
        tabs.children('div').removeClass('current');
        $this.children('div').addClass('current');
        contents.removeClass('current');
        $(contents[$this.index()]).addClass('current');
    })
}

$(document).ready(() => {
    //快捷栏事件绑定
    let dropDownButtons = document.getElementsByClassName('dropDownButton');
    for (let button of dropDownButtons) {
        $(button).on('mouseenter', () => {
            let content = $(button).children('.dropDownContent');
            content.css('display', 'block');
            adjustDropDownContentPostion(content[0]);
        });
        $(button).on('mouseleave', () => {
            $(button).children('.dropDownContent').css('display', 'none');
        });
    }
    //绑定[送至]快捷按钮事件
    $(dropDownButtons[0]).find('.item a').on('click', function() {
        dropDownButtons[0].firstChild.textContent = '送至：' + this.textContent;
    });

    //导航事件绑定
    let navigation = document.getElementsByClassName('nav')[0];

    //中间轮播图事件绑定
    let playing = false;
    let currentIndex = 0;
    let autoPlayTimer = 0;
    let carousel = $('nav div.carousel');
    let images = carousel.children('ul:first');
    let indices = carousel.children('ol.index');
    let move = function(index) {
        images.children().removeClass('show');
        images.children().eq(index).addClass('show');
        indices.children().removeClass('current');
        indices.children().eq(index).addClass('current');
    }
    let startPlay = function() {
        if (!playing) {
            playing = true;
            autoPlayTimer = setInterval(() => move(++currentIndex % 5), 1800);
        }
    }
    let stopPlay = function() {
        if (playing) {
            playing = false;
            clearInterval(autoPlayTimer);
        }
    }
    indices.children().on('mouseover', function() {
        stopPlay();
        currentIndex = $(this).index();
        move(currentIndex);
    });
    //移出时重启自动播放
    indices.on('mouseleave', startPlay);
    startPlay();

    //右侧轮播图事件绑定
    let carousel_right = $('nav div.carousel_right');
    let buttons = carousel_right.children('button');
    carousel_right.on('mouseover', () => {
        buttons.removeClass('hide');
        buttons.addClass('show');
    });
    carousel_right.on('mouseout', () => {
        buttons.removeClass('show');
        buttons.addClass('hide');
    });
    let random_carousel = function() {
        let images = carousel_right.find('img');
        let list = carousel_right.find('li');
        list.each(function() {
            $(this).css('background-color', randomColor(128, 255));
        })
        images.each(function() {
            $(this).attr('src', 'images/carousel_right/' + Math.floor(Math.random() * 9) + '.webp');
        }); 
    }
    buttons.on('click', random_carousel);
    //自动轮换
    let rightCarouselTimer = setInterval(random_carousel, 8000);
    //启动第一次
    random_carousel();

    //最右侧其他栏事件绑定
    let quick_life = $('nav .other .quick_life');
    let imageList = quick_life.children('ul').children('li');
    let tab_view = quick_life.find('div.tab_view');
    addTabViewEvent(tab_view);
    imageList.on('mouseover', function() {
        let $this = $(this);
        $this.children('img:first-child').hide();
        $this.children('img.hover').show();
        if ($this.index() < 4) tab_view.addClass('show');
    });
    imageList.on('mouseleave', function() {
        $(this).children('img:first-child').show();
        $(this).children('img.hover').hide();
    });
    tab_view.on('mouseleave', function() {
        tab_view.removeClass('show');
    });
    //点击其他地方也会隐藏tab_view
    window.addEventListener('click', (e) => {
        if ($(e.target).parents('div.tab_view').length === 0) {
            tab_view.removeClass('show');
        }
    });
});