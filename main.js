import { HistoryDB } from './historydb.js'

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
    let button = $content.parent('.dropdown_button')[0];
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
    let dropDownButtons = document.getElementsByClassName('dropdown_button');
    for (let button of dropDownButtons) {
        $(button).on('mouseenter', () => {
            let content = $(button).children('.dropdown_content');
            content.css('display', 'block');
            adjustDropDownContentPostion(content[0]);
        });
        $(button).on('mouseleave', () => {
            $(button).children('.dropdown_content').css('display', 'none');
        });
    }
    //绑定[送至]快捷按钮事件
    $(dropDownButtons[0]).find('.item a').on('click', function() {
        dropDownButtons[0].firstChild.textContent = '送至：' + this.textContent;
    });

    //搜索栏事件绑定
    let words = ['车主福利', '24期免息', '工具', '宠物生活', '手机好礼', '使命召唤', '体检医美', '抢神券'];
    let hottest = ['手机圣诞节', '小哥优选季', '工业年末庆'];
    let randomWords = ['行车记录仪', '保温杯', '格兰仕 微波炉'];
    let header = $('.header');
    let searchEditor = header.find('.search .editor');
    let searchRandom = searchEditor.children('.random');
    let searchInput = searchEditor.children('input');
    let hotwordsAnchor = header.find('.search .hotwords a');
    let searchHistory = header.find('.search .history');
    searchHistory.on('mouseover', () => searchHistory.opened = false);
    searchHistory.on('mouseleave', () => searchHistory.opened = true);
    searchRandom.on('click', () => searchInput.focus());
    searchInput.on('click', () => searchInput.focus());
    searchInput.on('focus', () => {
        searchRandom.addClass('active');
        searchHistory.opened = true;
        searchHistory.show();
    });
    searchInput.on('input', () => {
        if (searchInput.val()) {
            searchRandom.addClass('input');
        } else {
            searchRandom.removeClass('input');
        }
    });
    searchInput.on('blur', () => {
        if (!searchInput.val())
            searchRandom.removeClass('active').removeClass('input');
        if (searchHistory.opened) {
            searchHistory.opened = false;
            searchHistory.hide();
        }
    });
    let searchButton = searchEditor.children('.search_button');
    searchButton.on('click', () => {
        if (searchInput.val()) {
            console.log('search goods: ' + searchInput.val());
        } else {
            console.log('search goods: ' + searchRandom.text());
        }
    });
    let updateWords = () => {
        searchRandom.text(randomWords[parseInt(Math.random() * 3)]);
        $(hotwordsAnchor[0]).text(hottest[parseInt(Math.random() * 3)]);
    };
    updateWords();
    setInterval(updateWords, 4000);
    for (let i in [...hotwordsAnchor]) {
        if (i !== 0) $(hotwordsAnchor[i]).text(words[i - 1]);
    }

    //手动添加历史搜索记录
    for (let i = 0; i < 8; i++) {
        let li = $(document.createElement('li'));
        let removeButton = $(document.createElement('button'));
        removeButton.text('删除');
        removeButton.on('click', () => {
            li.remove();
            //需要重新激活input
            searchInput.focus();
        });
        li.addClass('history_item');
        li.text(`${i} item`);
        li.on('click', () => {
            searchRandom.addClass('input');
            searchInput.val(li[0].childNodes[0].nodeValue);
            searchHistory.opened = false;
            searchHistory.hide();
        });
        li.append(removeButton);
        searchHistory.append(li);
    }

    //导航事件绑定
    let navigation = document.getElementsByTagName('nav')[0];

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
        buttons.addClass('show');
    });
    carouselRight.on('mouseout', () => {
        buttons.removeClass('show');
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
    let tabView = quick_life.find('div.tab_view');
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
        if ($(e.target).parents('div.tab_view').length === 0) {
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

    //限时秒杀右侧切换视图
    let seckillSwitchView = $('.seckill .switch_view');
    let seckillButtons = seckillSwitchView.children('.flip_button');
    seckillSwitchView.on('mouseover', () => {
        seckillButtons.addClass('show');
    });
    seckillSwitchView.on('mouseout', () => {
        seckillButtons.removeClass('show');
    });
    let seckillRandom = function() {
        let images = seckillSwitchView.find('img');
        let prices = seckillSwitchView.find('.price');
        images.each(function() {
            $(this).attr('src', 'images/seckill/' + Math.floor(Math.random() * 9) + '.gif');
        });
        prices.each(function() {
            let left = $(this).children('.left');
            let right = $(this).children('.right');
            let randomPrice = parseInt(Math.random() * 9999);
            //随机立减500~2000,小于0打5折👋不愧是我(^==^)
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

    //限时秒杀最右侧轮播
    let seckillCarouselList = seckill.find('.carousel .images');
    let imageUrls = [];
    let seckillCarouselRandom = () => {
        imageUrls.length = 0;
        for (let i = 0; i < 2; i++) {
            imageUrls.push('images/seckill/' + Math.floor(Math.random() * 9) + '.gif');
        }
    }
    let runSeckillCarousel = function() {
        seckillCarouselRandom();
        seckillCarouselList.find('img').each(function(index) {
            $(this).attr('src', imageUrls[index % 2]);
        });
        let width = seckill.find('.carousel')[0].offsetWidth || -240;
        let offset = -width;
        let index = seckill.find('.carousel ul.index');
        let left = index.children('.left');
        let right = index.children('.right');
        setInterval(() => {
            seckillCarouselList.animate({ left: offset + 'px' }, 800, 'linear', () => {
                if ((offset -= width) === -width * 3){
                    seckillCarouselList.css('left', '0px');
                    offset = -width;
                }
            });
            if (left.hasClass('current')) {
                left.removeClass('current');
                right.addClass('current');
            } else {
                left.addClass('current');
                right.removeClass('current');
            }
        }, 4000);
    }
    runSeckillCarousel();

    //启动秒杀倒计时
    restartSeckill();
    let countdownTimer = setInterval(() => {
        countdownHours.text(normalizeTime(Math.floor(nextSeconds / 3600)));
        countdownMinutes.text(normalizeTime(Math.floor(nextSeconds / 60) % 60));
        countdownSeconds.text(normalizeTime(nextSeconds % 60));
        if (--nextSeconds === 0) {
            restartSeckill();
            seckillRandom();
            seckillCarouselRandom();
        }
    }, 1000);

    //特选部分
    let feature = $('.feature');
    feature.find('.container .title').hover(
        function() { $(this).children('.button').css({ color: 'white', backgroundColor: 'red' }); },
        function() { $(this).children('.button').css({ color: 'red', backgroundColor: 'white' }); }
    );
    addTabViewEvent(feature.find('.container .tab_view'));
});