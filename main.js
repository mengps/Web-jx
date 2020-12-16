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
    console.log(buttonLeft, contentWidth, w.offsetWidth + w.offsetLeft);
    if ((buttonLeft + contentWidth) > (w.offsetWidth + w.offsetLeft)) {
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
    let carouselRight = $('nav .carousel_right');
    let buttons = carouselRight.children('.flip_button');
    carouselRight.on('mouseover', () => {
        buttons.removeClass('hide');
        buttons.addClass('show');
    });
    carouselRight.on('mouseout', () => {
        buttons.removeClass('show');
        buttons.addClass('hide');
    });
    let randomCarousel = function() {
        let images = carouselRight.find('img');
        let list = carouselRight.find('li');
        list.each(function() {
            $(this).css('background-color', randomColor(128, 255));
        })
        images.each(function() {
            $(this).attr('src', 'images/carousel_right/' + Math.floor(Math.random() * 9) + '.webp');
        }); 
    }
    buttons.on('click', randomCarousel);
    //自动轮换
    let rightCarouselTimer = setInterval(randomCarousel, 8000);
    //启动第一次
    randomCarousel();

    //最右侧其他栏事件绑定
    let quick_life = $('nav .other .quick_life');
    let imageList = quick_life.children('ul').children('li');
    let tabView = quick_life.find('div.tabView');
    addTabViewEvent(tabView);
    imageList.on('mouseover', function() {
        let $this = $(this);
        $this.children('img:first-child').hide();
        $this.children('img.hover').show();
        if ($this.index() < 4) tabView.addClass('show');
    });
    imageList.on('mouseleave', function() {
        $(this).children('img:first-child').show();
        $(this).children('img.hover').hide();
    });
    tabView.on('mouseleave', function() {
        tabView.removeClass('show');
    });
    //点击其他地方也会隐藏tabView
    window.addEventListener('click', (e) => {
        if ($(e.target).parents('div.tabView').length === 0) {
            tabView.removeClass('show');
        }
    });

    //限时秒杀部分
    let seckill = $('div.seckill');
    let seckillTime = seckill.find('p.time');
    let countdown = seckill.find('.countdown');
    let countdownHours = countdown.children('.hours');
    let countdownMinutes = countdown.children('.minutes');
    let countdownSeconds = countdown.children('.seconds');

    //限时秒杀右侧轮播图
    let seckillCarousel = $('.seckill .carousel');
    let seckillButtons = seckillCarousel.children('.flip_button');
    seckillCarousel.on('mouseover', () => {
        seckillButtons.removeClass('hide');
        seckillButtons.addClass('show');
    });
    seckillCarousel.on('mouseout', () => {
        seckillButtons.removeClass('show');
        seckillButtons.addClass('hide');
    });
    let seckillRandom = function() {
        let images = seckillCarousel.find('img');
        let prices = seckillCarousel.find('.price');
        images.each(function() {
            $(this).attr('src', 'images/seckill/' + Math.floor(Math.random() * 9) + '.gif');
        });
        prices.each(function() {
            let left = $(this).children('.left');
            let right = $(this).children('.right');
            let randomPrice = parseInt(Math.random() * 9999);
            //随机立减500~2000,为0打5折👋
            let nowPrice = parseInt(randomPrice - (Math.random() * 1500 + 500));
            nowPrice = Math.max(parseInt(randomPrice / 2), nowPrice);
            left.text('￥' + nowPrice + '.00');
            right.text('￥' + randomPrice + '.00');
        })
    }
    seckillButtons.on('click', seckillRandom);
    seckillRandom();

    //限时秒杀倒计时
    let nextSeconds = 0;
    let normalizeTime = x => x < 10 ? '0' + x : x;
    let restartSeckill = () => {
        let date = new Date();
        //距离下一场的小时(+2~4)
        let nextDiff = parseInt(Math.random() * 3 + 2);
        //距离下一场的秒数
        nextSeconds = nextDiff * 3600 + (59 - date.getMinutes()) * 60 + 60 - date.getSeconds();
        //下一场秒杀时间(整点)
        let nextSeckill = normalizeTime((date.getHours() + nextDiff) % 24);
        seckillTime.text(nextSeckill + ':00');
    }
    //启动倒计时
    restartSeckill();
    let countdownTimer = setInterval(() => {
        countdownHours.text(normalizeTime(Math.floor(nextSeconds / 3600)));
        countdownMinutes.text(normalizeTime(Math.floor(nextSeconds / 60) % 60));
        countdownSeconds.text(normalizeTime(nextSeconds % 60));
        if (--nextSeconds === 0) {
            restartSeckill();
            seckillRandom();
        }
    }, 1000);
});