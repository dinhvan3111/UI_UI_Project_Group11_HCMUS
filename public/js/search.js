const dropdownCategories = document.querySelectorAll('.sort-container .dropdown-menu .dropdown-item');
const btnCategoryList = document.querySelector('.sort-container .dropdown-category button');
const sortChoiceItems = document.querySelectorAll('.sort-container .sort-choice .sort-item');
//gán giá trị category cho button
dropdownCategories.forEach(element => {
    element.addEventListener('click', (e) => {
        btnCategoryList.innerHTML = element.innerHTML;
    });
});


// Xử lí click chọn loại sắp xếp
var currentSortItem = document.querySelector('.sort-container .sort-choice .sort-item');
const activeIcon = document.querySelector('.sort-item.active > span');
const activeTag = document.querySelector('.sort-item.active.active .sort-active');
console.log(activeIcon);
console.log(activeTag);

sortChoiceItems.forEach((item) => {
    item.addEventListener('click', function(e){
        if(currentSortItem != item){
            currentSortItem.classList.remove('active');
            item.classList.add('active');
            item.appendChild(activeTag);
            item.appendChild(activeIcon);
        }
        currentSortItem = item;
    })
})
