const toastLiveExample = document.getElementById('liveToast')

function removeShake() {
  let notiItems = document.querySelector('.dropdown-noti .icon .fa-shake');
  if (notiItems) {
    notiItems.classList.remove("fa-shake")
  }

  showToast();  // Test toast
}

function showToast() {
  if (toastLiveExample) {
    const toast = new bootstrap.Toast(toastLiveExample)
    toast.show()
  }
}