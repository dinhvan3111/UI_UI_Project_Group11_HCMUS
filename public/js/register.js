const registerForm = document.querySelector('#register-form');
const registerBtn = document.querySelector('.register-btn');
// const urs = document.querySelector('input[name="username"]');
const fullName = document.querySelector('input[name="fullname"]');
const address = document.querySelector('input[name="address"]');
const email = document.querySelector('input[name="email"]');
const pwd = document.querySelector('input[name="password"]');
const renEnterPwd = document.querySelector('input[name="re-enter-password"]');


// const errUrs = document.querySelector('.err-message__urs');
const errFullName = document.querySelector('.err-message__fullname');
const errAddress = document.querySelector('.err-message__address');
const errEmail = document.querySelector('.err-message__email');
const errPwd = document.querySelector('.err-message__pwd');
const errReEnterPwd = document.querySelector('.err-message__re-enter-pwd');
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

const reEnterEyes = document.querySelector('.icon-hide-show.re-enter');
reEnterEyes.addEventListener('click', function(e) {
    const pwd = document.querySelector('input[name="re-enter-password"]');
    const iconHide = reEnterEyes.querySelector('.icon-hide');
    const iconShow = reEnterEyes.querySelector('.icon-show');
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



// Kiểm tra độ dài
function checkLength(item,min,max){
    if(item.value.length < min || item.value.length > max) return false;
    return true;
}


// Kiểm tra field đã được nhập hay chưa
function checkIfFieldHasChar(item){
    if(item.value.length > 0){
        return true;
    }
    return false;
}

// Kiểm tra email đã tồn tại hay chưa
async function isEmailNotExist(email){
    const data = {
        email: email,
    };
    let ret = false;
    await $.ajax({
        url: `/api/auth/email`,
        method: "POST",
        data: data,
    })
    .done(function( jsonResp ) {
        if(jsonResp.code === 200){
            ret = jsonResp.data;
        }
    });
    return !ret;
}

function isValidEmail(email){
    const regex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    return regex.test(email);
}

//Xử lý thông báo và màu border input
async function handleErrorMessage(item,msg){
    if(checkLength(item,min,max) || item.name === "email"){
        if(item.name === "email"){
            if(!isValidEmail(item.value)){
                msg.innerText = 'Email không hợp lệ'; 
                msg.style.display = 'block';
                item.style.border = '1px solid red';
                return;
            }
            if(await isEmailNotExist(item.value)){ // Nếu email chưa tồn tại
                item.style.border = '1px solid green';
                msg.style.display = 'none';
            }
            else{ // Nếu email đã tồn tồn tại
                msg.innerText = 'Email đã tồn tại'; 
                msg.style.display = 'block';
                console.log('here');
            }
        }
        else{
            item.style.border = '1px solid green';
            msg.style.display = 'none';
        }   
    }
    else{
        item.style.border = '1px solid red';
        // if(item.name==="username")
        //     msg.innerText = `Tài khoản phải từ ${min} đến ${max} kí tự.`;
        if(item.name==="password"){
            msg.innerText = `Mật khẩu phải từ ${min} đến ${max} kí tự.`;
        }
        msg.style.display = 'block';
    }
}

function checkReEnterPassword(password, reEnterPassword){
    if(password.value == reEnterPassword.value){
        return true;
    }
    return false;
}

function handleReEnterPassword(password, reEnterPassword, msg){
    if(checkReEnterPassword(password, reEnterPassword)){
        reEnterPassword.style.border = '1px solid green';
        msg.style.display = 'none';
    }
    else{
        reEnterPassword.style.border = '1px solid red';
        msg.style.display = 'block';
    }
}

// Lỗi độ dài của input
// urs.addEventListener('focusout', (e) => {
//     handleErrorMessage(urs, errUrs);
    
    
// });

fullName.addEventListener('focusout', (e) => {
    handleErrorMessage(fullName, errFullName);
})

address.addEventListener('focusout', (e) => {
    handleErrorMessage(address, errAddress);
})

email.addEventListener('focusout', async function (e) {
    await handleErrorMessage(email, errEmail);
})


pwd.addEventListener('focusout', (e) => {
    handleErrorMessage(pwd, errPwd);
});


// Lỗi nhập lại mật khẩu không khớp
renEnterPwd.addEventListener('focusout', (e) => {
    handleReEnterPassword(pwd,renEnterPwd, errReEnterPwd);
});


//Chặn đăng nhập khi lỗi
registerBtn.addEventListener('click', async function (e) {
    // const isValidUrs = checkLength(urs,min,max);
    const isValidFullName = checkLength(fullName,min,max);
    const isValidAddress = checkLength(address,min,max);
    const isValidEmail = checkLength(email,min,max) && await isEmailNotExist(email); 
    const isValidPwd = checkLength(pwd,min,max);
    const isValidReEnterPwd = checkReEnterPassword(pwd,renEnterPwd);
    
    if(!isValidFullName || !isValidAddress || !isValidEmail || !isValidPwd || !isValidReEnterPwd){
        // handleErrorMessage(urs,errUrs);
        handleErrorMessage(fullName,errFullName);
        handleErrorMessage(address,errAddress);
        await handleErrorMessage(email,errEmail);
        handleErrorMessage(pwd,errPwd);
        handleReEnterPassword(pwd,renEnterPwd,errReEnterPwd);
        e.preventDefault();
    }
});

// chặn nút space
// $('input[name="username"]').keypress(function( e ) {
//     if(e.which === 32) 
//         return false;
// });
$('input[name="password"]').keypress(function( e ) {
    if(e.which === 32) 
        return false;
});
$('input[name="re-enter-password"]').keypress(function( e ) {
    if(e.which === 32) 
        return false;
});
