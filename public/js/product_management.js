const dropdownMenuManage = document.querySelectorAll('.management-header .dropdown-menu .dropdown-item');
const btnCategoryManage = document.querySelector('.management-header .dropdown-category button');
//gán giá trị category cho button
dropdownMenuManage.forEach(element => {
    element.addEventListener('click', (e) => {
        btnCategoryManage.innerHTML = element.innerHTML;
    });
});

//đỗ tên sản phẩm lên modall body
const btnDelete = document.querySelectorAll('.product-list .btn-delete');
const bodyModal = document.querySelector('#manageProductModal .modal-body b');
btnDelete.forEach(element => {
    element.addEventListener('click', () =>{
        const parentElement = element.parentElement;// lấy element cha của btn
        const name = parentElement.querySelector('.name').innerText;
        bodyModal.innerText = name;
    });
});