const purchasedItem = document.querySelectorAll('.purchased-item');

const parseMoney = (money) => {
    return money.slice(0, money.length - 1).split('.').join('') * 1;
}

purchasedItem.forEach(function (item) {
    const productPrice = item.querySelectorAll('.content .content-item .price');
    const totalElement = item.querySelector('.footer .total-price');
    let total = 0;
    productPrice.forEach(function (price) {
        const priceProductItem = price.innerText * 1;
        price.innerText = priceProductItem.toLocaleString('vi', { style: 'currency', currency: 'VND' });//chuyển vè định dạng tiền tệ
        total += parseMoney(price.innerText);//tính tổng tiền
    })
    total = total.toLocaleString('vi', { style: 'currency', currency: 'VND' });
    totalElement.innerHTML = `Tổng tiền: <b>${total}</b>`;
});

const btnDropdownOrder = document.querySelector('.dropdown-type-order');
const inputOrder = btnDropdownOrder.querySelector("#id_type_order");
const itemOrder = btnDropdownOrder.querySelectorAll('.dropdown-item');
itemOrder.forEach(item => {
	item.addEventListener('click', () => {
		let id = item.innerText;
		// inputOrder.innerText = id;
		// console.log(inputOrder.value);
        btnDropdownOrder.querySelector('button').innerText = id;
	});
});