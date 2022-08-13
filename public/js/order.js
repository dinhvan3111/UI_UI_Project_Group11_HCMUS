const stateElem = document.getElementById('recv-state');

$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
    
    // State for order detail
    if (stateElem != null) {
        initState();
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