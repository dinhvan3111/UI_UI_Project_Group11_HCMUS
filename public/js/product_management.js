const dropdownMenuManage = document.querySelectorAll('.management-header .dropdown-menu .dropdown-item');
const btnCategoryManage = document.querySelector('.management-header .dropdown-category button');
//gán giá trị category cho button
dropdownMenuManage.forEach(element => {
    element.addEventListener('click', (e) => {
        btnCategoryManage.innerHTML = element.innerHTML;
    });
});

//đỗ tên sản phẩm lên modall body
const btnManagement = document.querySelectorAll('.product-list .btn-management');
const bodyModal = document.querySelector('#manageProductModal .modal-body b');
btnManagement.forEach(element => {
    element.addEventListener('click', () =>{
        const parentElement = element.parentElement;// lấy element cha của btn
        const name = parentElement.querySelector('.name').innerText;
        bodyModal.innerText = name;
    });
});