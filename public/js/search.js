const dropdownCategories = document.querySelectorAll('.sort-container .dropdown-menu .dropdown-item');
const btnCategoryList = document.querySelector('.sort-container .dropdown-category button');
//gán giá trị category cho button
dropdownCategories.forEach(element => {
    element.addEventListener('click', (e) => {
        btnCategoryList.innerHTML = element.innerHTML;
    });
});