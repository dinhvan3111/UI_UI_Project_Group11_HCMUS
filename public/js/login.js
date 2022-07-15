const loginBtn = document.querySelector('.login-btn');
const urs = document.querySelector('input[name="username"]');
const pwd = document.querySelector('input[name="password"]');

const errUrs = document.querySelector('.err-message__urs');
const errPwd = document.querySelector('.err-message__pwd');
//Min max là số kí tự tối thiểu và tối đa của tài khoản và mật khẩu
let min = 6;
let max = 15;

//Xử lý ẩn hiện mật khẩu
const eyes = document.querySelector('.icon-hide-show');
eyes.addEventListener('click', function(e) {
    const pwd = document.querySelector('input[name="password"]');
    const iconHide = eyes.querySelector('.icon-hide');
    const iconShow = eyes.querySelector('.icon-show');
    if(pwd.type === 'password') {
        pwd.type = 'text';
        iconHide.style.display = 'none';
        iconShow.style.display = 'block';
    }
    else{
        pwd.type = 'password';
        iconHide.style.display = 'block';
        iconShow.style.display = 'none';
    }
});

//Kiểm tra độ dài
function checkLength(item,min,max){
    if(item.value.length < min || item.value.length > max) return false;
    return true;
}

//Xử lý thông báo và màu border input
function handleErrorMessage(item,msg){
    if(checkLength(item,min,max)){
        item.style.border = '1px solid green';
        msg.style.display = 'none';
    }
    else{
        item.style.border = '1px solid red';
        if(item.name==="username")
            msg.innerText = `Tài khoản phải từ ${min} đến ${max} kí tự.`;
        else if(item.name==="password"){
            msg.innerText = `Mật khẩu phải từ ${min} đến ${max} kí tự.`;
        }
        msg.style.display = 'block';
    }
}

// Lỗi độ dài của input
urs.addEventListener('focusout', (e) => {
    handleErrorMessage(urs, errUrs);
    
    
});


pwd.addEventListener('focusout', (e) => {
    
    handleErrorMessage(pwd, errPwd);
});

//Chặn đăng nhập khi lỗi
loginBtn.addEventListener('click', function(e) {
    const isValidUrs = checkLength(urs,min,max);
    const isValidPwd = checkLength(pwd,min,max);
    if(!isValidUrs || !isValidPwd){
        handleErrorMessage(urs,errUrs);
        handleErrorMessage(pwd,errPwd);
        e.preventDefault();
    };
});

// chặn nút space
$(document).ready(function(){
    $('input').keypress(function( e ) {
        if(e.which === 32) 
            return false;
    });
});
