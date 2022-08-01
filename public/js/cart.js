const payBtn = document.querySelector('.payment-container .pay-button');
const loader = document.querySelector('.loader');

async function sleep(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

payBtn.addEventListener('click', function (e) {
    // const productId = document.querySelectorAll('.cart-detail .cart-info .cart-product-id');
    // // const productName = document.querySelectorAll('.cart-detail .cart-info .cart-product-name');
    // const productQuantity = document.querySelectorAll('.cart-detail .cart-product-quantity input');

    // const result = [];
    // for (let i = 0; i < productId.length; i++) {
    //     var temp = { productId: productId[i].innerHTML, productQuantity: productQuantity[i].value };
    //     result.push(temp);
    // }
    // for (let i = 0; i < result.length; i++) {
    //     console.log(result[i]);
    // }

    // var xhr = new XMLHttpRequest();
    // xhr.open('POST', '/cart');
    // xhr.setRequestHeader('Content-Type', 'application/json');
    // xhr.send(JSON.stringify(result));
    const checkoutContainer = document.querySelector('.checkout-container');
    const cartContainer = document.querySelector('.cart-section');
    const title = document.querySelector('#title');
    title.innerHTML = 'Thanh Toán';
    showLoader(0.5);
    cartContainer.style.display = 'none';
    checkoutContainer.style.display = 'flex';
    window.scrollTo(0, 0);
});

async function showLoader(timeout){
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