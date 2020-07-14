// ==UserScript==
// @name         Aliexpress coupon value getter
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Получает значение купона
// @author       Andronio
// @homepage     https://github.com/Andronio2/Aliexpress-coupon-value-getter
// @supportURL   https://github.com/Andronio2/Aliexpress-coupon-value-getter/issues
// @updateURL    https://github.com/Andronio2/Aliexpress-coupon-value-getter/raw/master/Aliexpress%20coupon%20value%20getter.user.js
// @downloadURL  https://github.com/Andronio2/Aliexpress-coupon-value-getter/raw/master/Aliexpress%20coupon%20value%20getter.user.js
// @match        https://coupon.aliexpress.com/buyer/coupon/listView.htm*
// @match        https://coupon.aliexpress.ru/buyer/coupon/listView.htm*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    let coupons = document.querySelectorAll('.coupon-ul .clearfix .coupon-ul');
    if (coupons.length) {
        for (let i = 0; i < coupons.length; i++) {
            let couponBtn = document.createElement('li');
            couponBtn.innerHTML = `<button type="button" data-coupon-number="${i}" class="use-link-button-show">Получить номинал</button>`;
            coupons[i].append(couponBtn);
        }
        document.querySelector('.use-coupons-list-container').addEventListener('click', eventHandler);
    }

    function eventHandler(ev) {
        let elem = ev.target;
        if (elem.tagName != 'BUTTON' || !elem.dataset.couponNumber) return;
        let num = +elem.dataset.couponNumber;
        let couponValue = document.querySelectorAll('.use-coupons-info-lang-price')[num].innerText;
        let couponFrom = document.querySelectorAll('.use-coupons-info-lang-limit')[num].innerText;
        let couponDate = document.querySelectorAll('.valid-period-coupon')[num].innerText;
        let str;
        if (couponValue.startsWith("US $")) {
            couponValue = couponValue.match(/\d{1,2}\.\d{2}/g)[0];
            couponFrom = couponFrom.match(/\d{1,2}\.\d{2}/g)[0];
            couponDate = couponDate.match(/(?<=PT\s-\s)(?:(\d{1,2}\s[a-zA-Zа-яё]{3})|(?:[a-zA-Zа-яё]{3}\s\d{1,2}))/)[0];
            str = `${couponValue}/${couponFrom}$ до ${couponDate}`;
        }
        if (couponValue.endsWith('руб. Off')) {
            couponValue = couponValue.match(/\d{1,4},\d{2}/g)[0];
            couponFrom = couponFrom.match(/\d{1,4},\d{2}/g)[0];
            couponDate = couponDate.match(/(?<=PT\s-\s)(?:(\d{1,2}\s[a-zA-Zа-яё]{3})|(?:[a-zA-Zа-яё]{3}\s\d{1,2}))/)[0];
            str = `${couponValue}/${couponFrom} руб. до ${couponDate}`;
        }
        navigator.clipboard.writeText(str).then(function () {
            console.log('Async: Copying to clipboard was successful!');
            elem.classList.remove("use-link-button-show");
            elem.classList.add("coupon-valid-status");
            setTimeout(() => {elem.classList.remove("coupon-valid-status"); elem.classList.add("use-link-button-show");}, 500);
        }, function (err) {
            console.error('Async: Could not copy text: ', err);
        });
    }
})();
