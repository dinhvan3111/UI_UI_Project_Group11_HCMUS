const stateElem = document.getElementById('recv-state');
const stateList = document.querySelectorAll('.order-table tbody tr td:nth-child(4)');
console.log(stateList);

$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
    
    // State for order detail
    if (stateElem != null) {
        initState();
    }

    if (stateList) {
        console.log('set color');
        setStateColor();
    }
});

function initState() {
    const state = stateElem.value;
    const progressBar = document.querySelector('.order-detail-form .progress .progress-bar');
    
    switch (parseInt(state)) {
        case 0:
            progressBar.style.width = '25%';
            break;
        case 1:
            progressBar.style.width = '45%';
            break;
        case 2:
            progressBar.style.width = '70%';
            break;
        case 3:
            progressBar.style.width = '100%';
            break;
        case 4:
            progressBar.style.width = '100%';
            progressBar.style.backgroundColor  = 'var(--back-color)%';
            break;

        default:
            progressBar.style.width = '0%';
            break;
    }
}

function updateBtnType(adjButton) {
    // Get order Id being clicked upon
    const reqOrderId = adjButton.dataset.orderId;

    // Set value for hidden field to return to server
    document.getElementById(reqOrderId + '-type').value = parseInt(adjButton.value);

    const params = new URLSearchParams(window.location.search)  // url param(s)
    document.getElementById(reqOrderId + '-page').value = parseInt(params.get('page'));
}

function getColor(stateDesc) {
    let color = undefined;
    switch (stateDesc) {
        case 'Chờ xác nhận':
            color = 'var(--pending-color)';
            break;
        case 'Đã xác nhận':
        case 'Đang giao':
            color = 'var(--approved-color)';
            break;
        case 'Giao thành công':
            color = 'var(--success-color)';
            break;
        case 'Bị hủy':
            color = 'var(--failed-color)';
            break;

        default:
            color = 'black';
            break;
    }
    return color;
}

function setStateColor() {
    for (let i = 0; i < stateList.length; i++) {
        stateList[i].children[0].style.color = getColor(stateList[i].children[1].innerHTML);
    }
}