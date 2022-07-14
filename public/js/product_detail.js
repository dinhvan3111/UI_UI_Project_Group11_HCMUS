function addToCart(productId) {
    const quantity = $(`#quantity`).val();
    const stock = $(`#stock`).val();
    if(quantity > stock){
        alert('Het hang roi con trai');
        return;
    }
    const data = {
        productId: productId,
        quantity: quantity
    }
    $.ajax({
        url: `/api/cart`,
        method: "POST",
        data: data
    })
    .done(function( jsonResp ) {
        if(jsonResp.code === 200){
            $('#cartNum').val(jsonResp.totalInCart);
            $('#cartNumStr').html(jsonResp.totalInCart.toString());
            alert(jsonResp.message);
        }
        else{
            alert(jsonResp.message);
        }
    });
}