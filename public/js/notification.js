const toastLiveExample = document.getElementById('liveToast');
const notiContent = document.getElementById('notiContent');

function removeShake() {
  let notiItems = document.querySelector('.dropdown-noti .icon .fa-shake');
  if (notiItems) {
    notiItems.classList.remove("fa-shake");
  }
}

function showToast(message) {
  if (toastLiveExample) {
    const toast = new bootstrap.Toast(toastLiveExample);
    notiContent.innerHTML = message;
    toast.show();
  }
}

// Xử lí thông báo
const notiDropdown = document.querySelector(".dropdown-noti .dropdown-menu");
const notificationsContainer = document.querySelector(".dropdown-noti .dropdown-menu .item-container");
var notifications = document.querySelectorAll(".dropdown-noti .dropdown-menu .item-container .item");
var notificationsState = document.querySelectorAll(".dropdown-noti .dropdown-menu .item-container .item .dropdown-item span");
makeNotiState();
// console.log(notificationsState);
// // Xử lí chỉ cho phép hiện tối đa 10 thông báo
var nextPage = 2;
const totalItem = document.querySelector(".dropdown-noti .dropdown-menu .item-container .total-item");
console.log(totalItem.innerHTML);
var totalDisplayItem = notifications.length >= 10 ? 10 : notifications.length;
// const restItem = [];
// for(let i =0; i < notifications.length;i++){
//     if(i > 10){
//         restItem.push(notifications[i]);
//         notifications[i].style.display = 'none';

//     }
// }

// console.log(restItem.length);

// Xử lí trạng thái đơn hàng của thông báo
function makeNotiState(){
    for (let i = 0; i < notificationsState.length; i++) {
        switch (notificationsState[i].innerHTML) {
            case "Chờ xác nhận":
                notificationsState[i].classList.add("state-pending");
                break;
            case "Đã xác nhận":
                notificationsState[i].classList.add("state-approve");
                break;
            case "Đang giao":
                notificationsState[i].classList.add("state-approve");
                break;
            case "Bị huỷ":
                notificationsState[i].classList.add("state-failed ");
                break;
        }
    }
}

// Load thêm thông báo
const dropdownMenu = document.querySelector(".dropdown-noti .dropdown-menu");
const loadMoreNotisBtn = document.querySelector(".dropdown-noti .dropdown-menu .noti-control");
loadMoreNotisBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    if(notifications.length < parseInt(totalItem.innerHTML)){
        var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        const result = JSON.parse(this.responseText);
        if(result['code'] === 200){
            const additonalItems = result['data']['data'];
            const totalItem = result['data']['total'][0]['count'];
            for(let i =0; i < additonalItems.length;i++){
                console.log(additonalItems[i]['notifications']);
               notificationsContainer.innerHTML +=  `<li class="item">
               <a class="dropdown-item" href="/order/detail/` + additonalItems[i]['notifications']['_id'] + `">
                   <img
                       src="https://cdn.shopify.com/s/files/1/0024/9803/5810/products/517518-Product-0-I-637756975358868585_a1f8076b-3e38-4c5b-8f52-3a088f73731e_540x540.jpg?v=1658208964">
                   <div class="order-info">
                       <p>`+ additonalItems[i]['notifications']['title'] + `</p>
                       <small class="text-muted">Thời gian đặt hàng: `+ additonalItems[i]['notifications']['date'] + `</small>
                   </div>
                   <span class="ms-4">`+ additonalItems[i]['notifications']['description'] + `</span>
               </a>
           </li>`
           notificationsState = document.querySelectorAll(".dropdown-noti .dropdown-menu .item-container .item .dropdown-item span");
           makeNotiState();
            }
            notifications = document.querySelectorAll(".dropdown-noti .dropdown-menu .item-container .item");
            if(notifications.length >= totalItem){
                loadMoreNotisBtn.style.display = 'none';
            }
            nextPage = nextPage++;
        }
        else{
            console.log("Có lỗi xảy ra");
        }
    };
    xhr.open('GET', '/api/notifications?page=' + nextPage);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send();     
    }
    // if(totalDisplayItem < parseInt(totalItem.innerHTML)){
    //     for(let i = totalDisplayItem; i < totalDisplayItem + 10; i++){
    //         notifications[i].style.display = 'block';
    //     }
    // }
});

// Chặn ẩn noti khi bấm vào




// Xoá tất cả thông báo
// const deleteNotisBtn = document.querySelector(".dropdown-noti .dropdown-menu .noti-control");
// deleteNotisBtn.addEventListener('click', function () {
//     console.log("Van");
//     var xhr = new XMLHttpRequest();
//     xhr.onload = function () {
//         notifications.forEach(e => e.remove());
//         notiDropdown.
//         notificationsContainer.innerHTML = `<div class="empty-notification">
//           Không có thông báo nào
//       </div > `;
//     };
//     xhr.open('POST', '/delete-notis');
//     xhr.setRequestHeader('Content-Type', 'application/json');
//     xhr.send(JSON.stringify({ "Delete": true }));
// });