const dropdownMenu = document.querySelectorAll('.name-category-product .dropdown-menu .dropdown-item');
const btnCategory = document.querySelector('.name-category-product .dropdown-category button');
//gán giá trị category cho button
dropdownMenu.forEach(element => {
    element.addEventListener('click', (e) => {
        btnCategory.innerHTML = element.innerHTML;
    });
});


//upload ảnh sản phẩm
$("#imgThumbnail").fileinput({
    showUpload: false,
    previewFileType:'any',
    showCaption: false,
    dropZoneEnabled: false,
    maxFileCount: 1,
    allowedFileExtensions: ['png', 'jpg'],
    theme: 'fa',
    language: 'vi'});
  $("#imgsExta").fileinput({
    showUpload:false,
    previewFileType:'any',
    showCaption: false,
    dropZoneEnabled: false,
    maxFileCount: 5,
    allowedFileExtensions: ['png', 'jpg'],
    theme: 'fa',
    language: 'vi'});

//mô tả
tinymce.init({
    selector: '#description-add-product',
    height: "500",
    plugins: 'image paste link autolink lists table media',
    menubar: false,
    toolbar: [
      'undo redo | bold italic underline strikethrough | numlist bullist | alignleft aligncenter alignright | forecolor backcolor | table link image media'
    ]
  });

  tinymce.init({
    selector: '#insurance',
    height: "500",
    plugins: 'image paste link autolink lists table media',
    menubar: false,
    toolbar: [
      'undo redo | bold italic underline strikethrough | numlist bullist | alignleft aligncenter alignright | forecolor backcolor | table link image media'
    ]
  });

