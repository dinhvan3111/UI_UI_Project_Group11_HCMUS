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
            //alert(jsonResp.message);
            notify("success",jsonResp.message);
        }
        else{
            notify("error",jsonResp.message);
        }
    });
}

function notify(type,message){
    (()=>{
      let n = document.createElement("div");
      let id = Math.random().toString(36).substr(2,10);
      n.setAttribute("id",id);
      n.classList.add("notification",type);
      n.innerText = message;
      document.getElementById("notification-area").appendChild(n);
      setTimeout(()=>{
        var notifications = document.getElementById("notification-area").getElementsByClassName("notification");
        for(let i=0;i<notifications.length;i++){
          if(notifications[i].getAttribute("id") == id){
            notifications[i].remove();
            break;
          }
        }
      },5000);
    })();
  }
  
