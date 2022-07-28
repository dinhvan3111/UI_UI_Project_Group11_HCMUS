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
	previewFileType: 'any',
	showCaption: false,
	dropZoneEnabled: false,
	maxFileCount: 1,
	allowedFileExtensions: ['png', 'jpg', 'jpeg'],
	theme: 'fa',
	language: 'vi'
});
$("#imgsExta").fileinput({
	showUpload: false,
	previewFileType: 'any',
	showCaption: false,
	dropZoneEnabled: false,
	maxFileCount: 5,
	allowedFileExtensions: ['png', 'jpg', 'jpeg'],
	theme: 'fa',
	language: 'vi'
});

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


//gán dữ liệu từ dropdown
const btnDropdown = document.querySelector('.name-category-product');
const inputCat = btnDropdown.querySelector("#add_category");
const itemCat = btnDropdown.querySelectorAll('.dropdown-item');
itemCat.forEach(item => {
	item.addEventListener('click', () => {
		inputCat.value = item.innerText;
	});
});


//kiểm tra dữ liệu submit
$('#addProductForm').on('submit', function (e) {
	
	var numFilesThumb = $('#imgThumbnail')[0].files.length;
	var numFilesExtra = $('#imgsExta')[0].files.length;
	
	if(numFilesThumb === 0){
		$('#dangerThumb').html('Chưa có hình ảnh thumbnail cho sản phẩm!');
		e.preventDefault();
		return;
	}
	else{
		$('#dangerThumb').html('');
	}
	if(numFilesExtra === 0){
		$('#dangerExtra').html('Chưa có hình ảnh phụ cho sản phẩm!');
		e.preventDefault();
		return;
	}
	else if(numFilesExtra < 3){
		$('#dangerExtra').html('Chưa đủ hình ảnh phụ cho sản phẩm!!');
		e.preventDefault();
		return;
	}
	else{
		$('#dangerExtra').html('');
	}
	$(this) = JSON.stringify($(this).serialize())
		alert(this);
	$('#addProductForm').off('submit').submit();
});



$("input[data-type='currency']").on({
	keyup: function() {
	  formatCurrency($(this));
	}
});


function formatNumber(n) {
  // format number 1000000 to 1,234,567
  return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}


function formatCurrency(input) {

  var input_val = input.val();
  if (input_val === "") { return; }
  
  var original_len = input_val.length;

  var caret_pos = input.prop("selectionStart");
	
  // check for decimal
  if (input_val.indexOf(".") >= 0) {

	input_val = input_val.replace('.', '');

  } else {
	input_val = formatNumber(input_val);
	input_val = "(đ) " + input_val;
  }
  
  input.val(input_val);

  var updated_len = input_val.length;
  caret_pos = updated_len - original_len + caret_pos;
  input[0].setSelectionRange(caret_pos, caret_pos);
}


