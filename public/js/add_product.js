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
const inputCat = btnDropdown.querySelector("#id_category");
const itemCat = btnDropdown.querySelectorAll('.dropdown-item');
itemCat.forEach(item => {
	item.addEventListener('click', () => {
		let id = item.querySelector('p').innerText;
		inputCat.value = id;
		console.log(inputCat.value);
	});
});


//kiểm tra dữ liệu submit
$('#addProductForm').on('submit', function (e) {
	
	var numFilesThumb = $('#imgThumbnail')[0].files.length;
	var numFilesExtra = $('#imgsExta')[0].files.length;
	var realPrice = document.getElementById('price');
	var salePrice = document.getElementById('sale_price');

	//parse the price before post
	realPrice.value = realPrice.value.replace(/[^0-9]/g, '');
	salePrice.value = salePrice.value.replace(/[^0-9]/g, '');
	
	if(realPrice.value * 1 < salePrice.value * 1) {
		let msg = document.querySelector('#addProductForm .overload-price');
		msg.style.display = 'block';
		e.preventDefault();
		return;
	}
	else{
		let msg = document.querySelector('#addProductForm .overload-price');
		msg.style.display = 'none';
	}

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


//chỉ nhập số ở stock
$(document).ready(function(){
    $('#stock').keypress(function( e ) {
        if(e.which === 32 || ( e.which<48 || e.which>57)) 
            return false;
    });
})


//kiểm tra dữ liệu submit
$('#editProductForm').on('submit', function (e) {
	

	var realPrice = document.getElementById('price');
	var salePrice = document.getElementById('sale_price');
	console.log(realPrice,salePrice);

	//parse the price before post
	realPrice.value = realPrice.value.replace(/[^0-9]/g, '');
	salePrice.value = salePrice.value.replace(/[^0-9]/g, '');
	console.log(realPrice.value * 1 , salePrice.value * 1);
	if(realPrice.value * 1 < salePrice.value * 1) {
		let msg = document.querySelector('#editProductForm  .overload-price');
		console.log(msg.innerText);
		msg.style.display = 'block';
		e.preventDefault();
		return;
	}
	else{
		let msg = document.querySelector('#editProductForm .overload-price');
		msg.style.display = 'none';
	}

	
	$('#editProductForm').off('submit').submit();
});

