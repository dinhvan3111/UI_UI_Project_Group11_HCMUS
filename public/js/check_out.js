const paymentForm = document.querySelector('#payment-form');
const payBtnCheckout = document.querySelector('.checkout-container .pay-button');
const productCheckOutBody = document.querySelector('.products-checkout-body');
const paymentMethodItems = document.querySelectorAll('.payment-method ul .payment-method-item');
const navigationTabs = document.querySelectorAll('.receive-address .navigation-tab');

//Min max là số kí tự tối thiểu và tối đa của họ và tên
let min = 6;
let max = 15;

// Datetimepicker

jQuery('#datetimepicker').datetimepicker();

$('#datetimepicker').datetimepicker({
    format: 'd.m.Y',
    minDate: 0,
    minTime: 1,
    format: 'd/m/Y',
    mask: true,
    timepicker: false,
});

// Xử lí scroll khi đơn hàng quá 4 sản phẩm khác nhau
if (productCheckOutBody.childElementCount > 4) {
    productCheckOutBody.style.overflowY = 'scroll';
    productCheckOutBody.style.height = '40rem';
}
var currentActivePaymentMethod = document.querySelector('.payment-method-item.active');
const activeIcon = document.querySelector('.payment-method-item.active > span');
const activeTag = document.querySelector('.payment-method-item.active div');

// Xử lí click chọn địa phương thức thanh toán
paymentMethodItems.forEach((item) => {
    item.addEventListener('click', function (e) {
        if (currentActivePaymentMethod != item) {
            currentActivePaymentMethod.classList.remove('active');
            item.classList.add('active');
            item.appendChild(activeTag);
            item.appendChild(activeIcon);
        }
        currentActivePaymentMethod = item;
    });
});


// Xử lí click chọn địa điểm giao hàng
var currentActiveTab = document.querySelector('.receive-address .navigation-tab.active');
const receivePlace = document.querySelectorAll('.receive-address .receive-address-content');
var currentReceivePlace = receivePlace[0];
navigationTabs.forEach((tab, index) => {
    tab.addEventListener('click', function (e) {
        if (currentActiveTab != tab) {
            currentActiveTab.classList.remove('active');
            currentReceivePlace.style.display = 'none';
            tab.classList.add('active');
            receivePlace[index].style.display = 'block';
            currentReceivePlace = receivePlace[index];
        }
        currentActiveTab = tab;
    });
});


// Xử lí chặn không cho submit thanh toán khi chưa điền đủ thông tin ở "Nhận hàng tại nhà"

const fullName = document.querySelector('input[name="fullname"]');
const phoneNumber = document.querySelector('input[name="phonenumber"]');
const receiveAddress = document.querySelector('input[name="address"]');

const errFullName = document.querySelector('.err-message__fullname');
const errPhoneNum = document.querySelector('.err-message__phonenumber');
const errAddress = document.querySelector('.err-message__address');


//Kiểm tra độ dài
function checkLength(item, min, max) {
    if (item.value.length < min || item.value.length > max) return false;
    return true;
}

//Xử lý thông báo và màu border input
function handleErrorMessage(item, msg) {
    if (checkLength(item, min, max)) {
        item.style.border = '1px solid green';
        msg.style.display = 'none';
    }
    else {
        item.style.border = '1px solid red';
        // if (item.name === "username")
        //     msg.innerText = `Tài khoản phải từ ${min} đến ${max} kí tự.`;
        // else if (item.name === "password") {
        //     msg.innerText = `Mật khẩu phải từ ${min} đến ${max} kí tự.`;
        // }
        msg.style.display = 'block';
    }
}

function handleErrorMessageForSelect(item, msg) {
    if (item.value != "") {
        item.style.border = '1px solid green';
        msg.style.display = 'none';
    }
    else {
        item.style.border = '1px solid red';
        // if (item.name === "username")
        //     msg.innerText = `Tài khoản phải từ ${min} đến ${max} kí tự.`;
        // else if (item.name === "password") {
        //     msg.innerText = `Mật khẩu phải từ ${min} đến ${max} kí tự.`;
        // }
        msg.style.display = 'block';
    }
}

function handleErrorMessageForDate(item, msg) {
    if (item.value != "__/__/____" && item.value != "") {
        item.style.border = '1px solid green';
        msg.style.display = 'none';
    }
    else {
        item.style.border = '1px solid red';
        // if (item.name === "username")
        //     msg.innerText = `Tài khoản phải từ ${min} đến ${max} kí tự.`;
        // else if (item.name === "password") {
        //     msg.innerText = `Mật khẩu phải từ ${min} đến ${max} kí tự.`;
        // }
        msg.style.display = 'block';
    }
}

// Xử lí chặn không cho submit thanh toán khi chưa điền đủ thông tin ở "Nhận hàng tại cửa hàng"
const fullName2 = document.querySelector('.receive-address-content.at-store .infor-field input[name="fullname"]');
const phoneNumber2 = document.querySelector('.receive-address-content.at-store .infor-field input[name="phonenumber"]');
const receiveStore = document.querySelector('select[name="store"]');
const receiveDate = document.querySelector('input[name="receivedate"]');

const errFullName2 = document.querySelector('.at-store .err-message__fullname');
const errPhoneNum2 = document.querySelector('.at-store .err-message__phonenumber');
const errStore = document.querySelector('.err-message__store');
const errDate = document.querySelector('.err-message__date');



payBtnCheckout.addEventListener('click', function (e) {
    // const fullname = document.querySelector('.receive-address-content.at-store input[name="fullname"]');
    // const phoneNum = document.querySelector('.receive-address-content.at-store input[name="phonenumber"]');
    // const email = document.querySelector('.receive-address-content.at-store input[name="email"]');
    // const store = document.querySelector('.receive-address-content.at-store .infor-field select[name="store"]');
    // const receiveDate = document.querySelector('.receive-address-content.at-store .infor-field input[name="receivedate"]');
    // const paymentMethod = document.querySelector('.payment-method .payment-method-item.active h4');
    // const productResult = postCheckoutProductsToServer();
    // console.log("Full name:" + fullname.value);
    // console.log("Phone number:" + phoneNum.value);
    // console.log("Email " + email.value);
    // console.log("Payment method " + paymentMethod.innerHTML);
    // console.log("Products " + productResult[0].productId);
    // console.log("Store " + store.value);
    // console.log("Receive date " + receiveDate.value);
    const activeTab = document.querySelector('.receive-address .navigation-tab.active');
    if (activeTab.innerHTML == 'Nhận hàng tại nhà') {
        const isValidFullName = checkLength(fullName, min, max);
        const isValidPhoneNumber = checkLength(phoneNumber, 10, 10);
        const isValidAddress = checkLength(receiveAddress, min, max);
        if (!isValidFullName || !isValidPhoneNumber || !isValidAddress) {
            handleErrorMessage(fullName, errFullName);
            handleErrorMessage(phoneNumber, errPhoneNum);
            handleErrorMessage(receiveAddress, errAddress);
            e.preventDefault();
        }
        else {
            const fullname = document.querySelector('.receive-address-content.at-your-place input[name="fullname"]');
            const phoneNum = document.querySelector('.receive-address-content.at-your-place input[name="phonenumber"]');
            const email = document.querySelector('.receive-address-content.at-your-place input[name="email"]');
            const address = document.querySelector('.receive-address-content.at-your-place .infor-field input[name="address"]');
            const paymentMethod = document.querySelector('.payment-method .payment-method-item.active h4');
            const productResult = checkoutProductsToServer();
            var checkoutInfo = {
                "recvDay": null,
                "name": fullname.value,
                "phone": phoneNum.value,
                "email": email.value,
                "address": address.value,
                "receiveAt": "0", // 0: tại nhà, 1: tại cửa hàng
                "products": productResult,
            }
            var xhr = new XMLHttpRequest();
            xhr.onload = function () {
                var result = JSON.parse(this.responseText);
                if (result["code"] === 200) {
                    window.location.href = "/order-confirm?id=" + result["data"];
                }
                else if (result["code"] === 400) {
                    window.location.href = "/order-failed";
                }
            };
            xhr.open('POST', '/api/cart/check-out');
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify(checkoutInfo));
        };
    }
    else {
        const isValidFullName = checkLength(fullName2, min, max);
        const isValidPhoneNumber = checkLength(phoneNumber2, 10, 10);
        const isValidStore = receiveStore.value != "" ? true : false;
        const isValidDate = receiveDate.value != "__/__/____ __:__" ? true : false;
        if (!isValidFullName || !isValidPhoneNumber || !isValidStore || !isValidDate) {
            handleErrorMessage(fullName2, errFullName2);
            handleErrorMessage(phoneNumber2, errPhoneNum2);
            handleErrorMessageForSelect(receiveStore, errStore);
            handleErrorMessageForDate(receiveDate, errDate);
            e.preventDefault();
        }
        else {
            const fullname = document.querySelector('.receive-address-content.at-store input[name="fullname"]');
            const phoneNum = document.querySelector('.receive-address-content.at-store input[name="phonenumber"]');
            const email = document.querySelector('.receive-address-content.at-store input[name="email"]');
            const store = document.querySelector('.receive-address-content.at-store .infor-field select[name="store"]');
            const receiveDate = document.querySelector('.receive-address-content.at-store .infor-field input[name="receivedate"]');
            const paymentMethod = document.querySelector('.payment-method .payment-method-item.active h4');
            const productResult = checkoutProductsToServer();
            var checkoutInfo = {
                "recvDay": receiveDate.value,
                "name": fullname.value,
                "phone": phoneNum.value,
                "email": email.value,
                "address": store.options[store.selectedIndex].text,
                "receiveAt": "1", // 0: tại nhà, 1: tại cửa hàng
                "products": productResult,
            }
            var xhr = new XMLHttpRequest();
            xhr.onload = function () {
                var result = JSON.parse(this.responseText);
                if (result["code"] === 200) {
                    window.location.href = "/order-confirm";
                }
                else if (result["code"] === 400) {
                    window.location.href = "/order-failed";
                }
            };
            xhr.open('POST', '/api/cart/check-out');
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify(checkoutInfo));
        };
    }
});

function checkoutProductsToServer() {
    // Post về server chi tiết để check-out
    const productId = document.querySelectorAll('.cart-detail .cart-info .cart-product-id');
    // const productName = document.querySelectorAll('.cart-detail .cart-info .cart-product-name');
    const productQuantity = document.querySelectorAll('.cart-detail .cart-product-quantity input');

    const productResult = [];
    for (let i = 0; i < productId.length; i++) {
        const productIdStr = productId[i].innerHTML;
        const productQuantityNum = productQuantity[i].value;
        var temp = {
            "id": productIdStr,
            "quantity": productQuantityNum
        };
        productResult.push(temp);
    }
    for (let i = 0; i < productResult.length; i++) {
        console.log(productResult[i]);
    }
    return productResult;
}




