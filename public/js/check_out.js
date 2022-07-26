const paymentForm = document.querySelector('#payment-form');
const payBtn = document.querySelector('.checkout-container .pay-button');
const productCheckOutBody = document.querySelector('.products-checkout-body');
const paymentMethodItems = document.querySelectorAll('.payment-method ul .payment-method-item');
const navigationTabs = document.querySelectorAll('.receive-address .navigation-tab')

//Min max là số kí tự tối thiểu và tối đa của họ và tên
let min = 6;
let max = 15;

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

function handleErrorMessageForSelct(item, msg) {
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

// Xử lí chặn không cho submit thanh toán khi chưa điền đủ thông tin ở "Nhận hàng tại cửa hàng"
const fullName2 = document.querySelector('.receive-address-content.at-store .infor-field input[name="fullname"]');
const phoneNumber2 = document.querySelector('.receive-address-content.at-store .infor-field input[name="phonenumber"]');
const receiveStore = document.querySelector('select[name="store"]');
// const receiveDate = document.querySelector('input[name="date"]');

const errFullName2 = document.querySelector('.at-store .err-message__fullname');
const errPhoneNum2 = document.querySelector('.at-store .err-message__phonenumber');
const errStore = document.querySelector('.err-message__store');



payBtn.addEventListener('click', function (e) {
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
            paymentForm.submit();
        };
    }
    else {
        const isValidFullName = checkLength(fullName2, min, max);
        const isValidPhoneNumber = checkLength(phoneNumber2, 10, 10);
        const isValidStore = receiveStore.value != "" ? true : false;
        if (!isValidFullName || !isValidPhoneNumber || !isValidStore) {
            handleErrorMessage(fullName2, errFullName2);
            handleErrorMessage(phoneNumber2, errPhoneNum2);
            handleErrorMessageForSelct(receiveStore, errStore);
            e.preventDefault();
        }
        else {
            paymentForm.submit();
        };
    }
});



