class FeatureCardData {
    url;
    time;
    image;
    desc;
    oldPrice;
    newPrice;
    soldNum;

    constructor(url, time, image, desc, oldPrice, newPrice, soldNum) {
        this.url = url;
        this.time = time;
        this.image = image;
        this.desc = desc;
        this.oldPrice = oldPrice;
        this.newPrice = newPrice;
        this.soldNum = soldNum;
    }
};

class FeatureCardContent {
    static createCard(data) {
        return $(
            `<a class="card fl" href="${data.url}">
                <span class="time">${data.time}天最低价</span>
                <img class="fl hcenter" src="${data.image}"/>
                <span class="desc ellipsis">${data.desc}</span>
                <div class="price fl hcenter">
                    <span class="new fl">￥${data.newPrice}</span>
                    <span class="old fl">￥${data.oldPrice}</span>
                </div>
            </a>`
        );
    }

    static createSmallCard(data) {
        return $(
            `<a class="card_small fl" href="${data.url}">
                <img class="fl" src="${data.image}"/>
                <span class="time">${data.time}天最低价</span>
                <span class="desc fl">${data.desc}</span>
                <div class="price fl">
                    <span class="new fl">￥${data.newPrice}</span>
                    <span class="old fl">￥${data.oldPrice}</span>
                </div>
                <span class="sold_msg">
                    已抢
                    <span class="sold_number">${data.soldNum}</span>
                    件
                </span>
            </a>`
        );
    }
};

export { 
    FeatureCardData,
    FeatureCardContent
};