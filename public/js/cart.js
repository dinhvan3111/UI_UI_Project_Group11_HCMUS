const payBtn = document.querySelector('.payment-container .pay-button');

payBtn.addEventListener('click', function (e) {
    const productId = document.querySelectorAll('.cart-detail .cart-info .cart-product-id');
    // const productName = document.querySelectorAll('.cart-detail .cart-info .cart-product-name');
    const productQuantity = document.querySelectorAll('.cart-detail .cart-product-quantity input');

    const result = [];
    for (let i = 0; i < productId.length; i++) {
        var temp = {productId: productId[i].innerHTML , productQuantity: productQuantity[i].value };
        result.push(temp);
    }
    for (let i = 0; i < result.length; i++) {
        console.log(result[i]);
    }

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/cart');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(result));

    // fetch('/cart', {
    //     method : 'POST',
    //     body: JSON.stringify(result)
    // }).then(response => console.log(response.json));
});

