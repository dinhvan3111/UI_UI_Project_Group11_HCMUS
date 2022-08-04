const payBtn = document.querySelector('.payment-container .pay-button');
const loader = document.querySelector('.loader');

async function sleep(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

payBtn.addEventListener('click', function (e) {
    // Xử lí ẩn hiện container cart và check-out
    const checkoutContainer = document.querySelector('.checkout-container');
    const cartContainer = document.querySelector('.cart-section');
    const title = document.querySelector('#title');
    title.innerHTML = 'Thanh Toán';
    showLoader(0.5);
    cartContainer.style.display = 'none';
    checkoutContainer.style.display = 'flex';
    window.scrollTo(0, 0);
    const productId = document.querySelectorAll('.cart-detail .cart-info .cart-product-id');
    const productQuantity = document.querySelectorAll('.cart-detail .cart-product-quantity input');
    for (let i = 0; i < productId.length; i++) {
        const productIdStr = productId[i].innerHTML;
        const productQuantityNum = productQuantity[i].value;
        var temp = {
            productId: productId,
            productQuantity: productQuantityNum
        };
        addProductCheckOut(productIdStr, productQuantityNum);
    }

});

async function showLoader(timeout) {
    loader.classList.remove('loader--hidden');
    await sleep(timeout);
    loader.classList.add('loader--hidden');
}

function remove(productId) {
    $.ajax({
        url: `/api/cart/${productId}`,
        method: "DELETE"
    }).done(function (jsonResp) {
        console.log(jsonResp);
        if (jsonResp.code === 200) {
            const inCartNum = $('#cartNum').val();
            $('#cartNum').val(inCartNum - 1);
            $('#cartNumStr').html((inCartNum - 1).toString());
            $(`#${productId}`).remove();
        }
    });
}

function addProductCheckOut(productId, quantity) {
    const img = $(`#thumb${productId}`).attr('src');
    const title = $(`#title${productId}`).html();
    const sale_price = $(`#price${productId}`).html();
    const html = `<div class="product-info" id="checkOut${productId}">
                    <img class="img-fluid" src="${img}" alt="Image">
                    <div class="product-info-text">
                        <a href="/products/${productId}">${title}</a>
                        <span class="quantity">Số lượng: ${quantity}</span>
                        <span class="sale-price">${sale_price}</span>
                    </div>
                </div>`;
    $(`#productsCheckOutList`).append(html);
}

// Xử lí khi nhấn tăng, giảm, xoá sản phẩm

$('#quantity').keypress(function( e ) {
    if(e.which === 32 || ( e.which<48 || e.which>57)) 
        return false;
});

function format_number(num) {
    num = num + '';
    for (let i = num.length - 3; i > 0; i -= 3) {
        num = num.slice(0, i) + ',' + num.slice(i);
    }
    return num;
}

const plusBtn = document.querySelectorAll('.cart-detail .cart-product-quantity .quantity-group .btn-number-plus');
const minusBtn = document.querySelectorAll('.cart-detail .cart-product-quantity .quantity-group .btn-number-sub ');
const deleteBtn =  Array.from(document.querySelectorAll('.cart-detail .cart-remove-product'));
const productsPrice = Array.from(document.querySelectorAll('.cart-detail .product-price .before-format'));
const productsPriceFormat = document.querySelectorAll('.cart-detail .product-price .format-price');
const productsQuantity = document.querySelectorAll('.cart-detail .cart-product-quantity input');
const totalPrice = document.querySelectorAll('.total-price .temp-price');
const shipPrice = document.querySelector('.total-price .ship-price');
const realTotalPrice = document.querySelectorAll('.total-price .real-total-price');
const inputQuantity = document.querySelectorAll('.cart-detail .cart-product-quantity .quantity-group input');

// Xử lí tính tiền khi mới vào cart
for(let i =0 ;i < productsPrice.length;i++){
    let price = parseInt(productsPrice[i].innerHTML);
    console.log(price);
    let quantity = parseInt(productsQuantity[i].value);
    console.log(quantity);
    let productTotalPrice = price * quantity;
    console.log(productTotalPrice);
    productsPriceFormat[i].innerHTML = format_number(productTotalPrice) + " VNĐ";
    productsPrice[i].innerHTML = productTotalPrice.toString();
}

// for(let i =0; i < productsPrice.length; i++){
//     console.log(productsPrice[i].innerHTML);
// }
inputQuantity.forEach((element, index) => {
    var quantity = parseInt(productsQuantity[index].value);
    var productPrice = parseInt(productsPrice[index].innerHTML) / quantity;
    console.log(productPrice);
    element.addEventListener('change', function(e){
        if(element.value === ""){
            element.value = '1';
        }
        console.log("-----------------------------------");
        let afterQuantity = parseInt(element.value);
        element.value = afterQuantity > 50 ? "50" : afterQuantity.toString();
        afterQuantity = afterQuantity > 50 ? 50 : afterQuantity;  
        console.log("Quantity before: " +quantity);
        console.log("Productprice: " + productPrice);
        productsQuantity[index].value = afterQuantity.toString();
        productPrice = productPrice * afterQuantity; // Tính lại giá tiền từng món
        productsPrice[index].innerHTML = productPrice.toString();
        var formatProductPrice = format_number(productPrice);
        productsPriceFormat[index].innerHTML = formatProductPrice.toString() + " VNĐ";
        var total = 0;
        for (let i = 0; i < productsPrice.length; i++) {
            total = total + parseInt(productsPrice[i].innerHTML);
        }
        var realTotal = total + parseInt(shipPrice.innerHTML);
        console.log(realTotal);
        totalPrice[0].innerHTML = format_number(total) + ' VNĐ';
        realTotalPrice[0].innerHTML = format_number(realTotal) + ' VNĐ';
        totalPrice[1].innerHTML = format_number(total) + ' VNĐ';
        realTotalPrice[1].innerHTML = format_number(realTotal) + ' VNĐ';
    });
});
var minQuantity = 1;
var maxQuantity = 50;

plusBtn.forEach((btn, index) => {
    btn.addEventListener('click', function (e) {
        var quantity = parseInt(productsQuantity[index].value);
        var productPrice = parseInt(productsPrice[index].innerHTML) / quantity;
        quantity = quantity <= 49 ? quantity + 1 : 50;
        productsQuantity[index].value = quantity.toString();
        productPrice = productPrice * quantity; // Tính lại giá tiền từng món
        productsPrice[index].innerHTML = productPrice.toString();
        var formatProductPrice = format_number(productPrice);
        productsPriceFormat[index].innerHTML = formatProductPrice.toString() + " VNĐ";
        var total = 0;
        for (let i = 0; i < productsPrice.length; i++) {
            total = total + parseInt(productsPrice[i].innerHTML);
        }
        var realTotal = total + parseInt(shipPrice.innerHTML);
        console.log(realTotal);
        totalPrice[0].innerHTML = format_number(total) + ' VNĐ';
        realTotalPrice[0].innerHTML = format_number(realTotal) + ' VNĐ';
        totalPrice[1].innerHTML = format_number(total) + ' VNĐ';
        realTotalPrice[1].innerHTML = format_number(realTotal) + ' VNĐ';
    })
});
minusBtn.forEach((btn, index) => {
    btn.addEventListener('click', function (e) {
        var quantity = parseInt(productsQuantity[index].value);
        var productPrice = parseInt(productsPrice[index].innerHTML) / quantity;
        quantity = quantity >= 2 ? quantity - 1 : 1;
        productsQuantity[index].value = quantity.toString();
        productPrice = productPrice * quantity; // Tính lại giá tiền từng món
        productsPrice[index].innerHTML = productPrice.toString();
        var formatProductPrice = format_number(productPrice);
        productsPriceFormat[index].innerHTML = formatProductPrice.toString() + " VNĐ";
        var total = 0;
        for (let i = 0; i < productsPrice.length; i++) {
            total = total + parseInt(productsPrice[i].innerHTML);
        }
        var realTotal = total + parseInt(shipPrice.innerHTML);
        console.log(realTotal);
        totalPrice[0].innerHTML = format_number(total) + ' VNĐ';
        realTotalPrice[0].innerHTML = format_number(realTotal) + ' VNĐ';
        totalPrice[1].innerHTML = format_number(total) + ' VNĐ';
        realTotalPrice[1].innerHTML = format_number(realTotal) + ' VNĐ';
    })
});
deleteBtn.forEach((btn, index) => {
    btn.addEventListener('click', function (e) {
        var total = parseInt(totalPrice[0].innerHTML.replace(/[^0-9]/g , ''));
        console.log(total);
        // var total = 0;
        // console.log(btn.parentElement.lastElementChild.lastElementChild.innerHTML);
        // for (let i = 0; i < productsPrice.length; i++) {
        //     total = total + parseInt(btn.parentElement.lastElementChild.lastElementChild.innerHTML);
        //     console.log(total);
        // }
        // console.log("------------Before :" + total);
        // Trừ số tiền sản phẩm đã xoá
        // let quantity = parseInt(btn.parentElement.querySelector('.cart-product-quantity input').value);
        console.log("Before :" + total);
        total = total - parseInt(btn.parentElement.lastElementChild.lastElementChild.innerHTML)
        console.log("After :" + total);
        var realTotal = total + parseInt(shipPrice.innerHTML);
        totalPrice[0].innerHTML = format_number(total) + ' VNĐ';
        realTotalPrice[0].innerHTML = format_number(realTotal) + ' VNĐ';
        totalPrice[1].innerHTML = format_number(total) + ' VNĐ';
        realTotalPrice[1].innerHTML = format_number(realTotal) + ' VNĐ';
        productsPrice.splice(index, 1);
        deleteBtn.splice(index,1);
        // for (let i = 0; i < productsPrice.length; i++) {
        //     console.log(productsPrice[i]);
        // }
    });
});
