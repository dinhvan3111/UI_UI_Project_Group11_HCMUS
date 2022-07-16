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

            
            $('#addToCartModal .modal-body img').attr("src","/assets/img/check.png");
            $('#addToCartModal .modal-body p').html("Sản phẩm đã được thêm vào giỏ hàng!");

            // Display Modal
            $('#addToCartModal').modal('show'); 
        }
        else{
            $('#addToCartModal .modal-body img').attr("src","/assets/img/error.png");
            $('#addToCartModal .modal-body p').html("Thêm giỏ hàng thất bại!");

            // Display Modal
            $('#addToCartModal').modal('show'); 
        }
    });
}

  
