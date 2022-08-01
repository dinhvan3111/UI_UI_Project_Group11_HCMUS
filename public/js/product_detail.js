
//Xử lý nút cộng trừ số lượng
const plusBtn = document.querySelector('.btn-number-plus');
const subBtn = document.querySelector('.btn-number-sub');
const quantity = document.querySelector('#quantity');
plusBtn.addEventListener('click', function (e) {
    let currentValue = quantity.value;
    quantity.value = +currentValue + 1;
});
subBtn.addEventListener('click', function (e) {
    let currentValue = quantity.value;
    if (quantity.value > 1) {
        quantity.value = +currentValue - 1;
    }
});

//read more
const readMoreElement = document.querySelector('.read-more');
const readMoreBtn = document.querySelector('.read-more button');
const gradient = document.querySelector('.gradient');
const desWrap = document.querySelector('.des-wrap');
if (desWrap.offsetHeight <= 500) {
    readMoreElement.style.display = 'none';
    gradient.style.display = 'none';
}
else {
    readMoreElement.style.display = 'flex';
    desWrap.style.height = '50rem';
}

readMoreBtn.addEventListener('click', function (e) {
    if (readMoreBtn.innerText === 'Xem thêm') {
        readMoreBtn.innerText = "Ẩn bớt nội dung";
        gradient.style.display = 'none';
        desWrap.style.height = '100%';
    }
    else {
        readMoreBtn.innerText = "Xem thêm";
        gradient.style.display = 'block';
        desWrap.style.height = '50rem';
    }
});




