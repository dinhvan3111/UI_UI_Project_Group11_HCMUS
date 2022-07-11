$(document).ready(function () {
    $('.slider-content').owlCarousel({
        loop: true,
        margin: 10,
        nav: false,
        navText: ['<span class="btn-prev"><i class="icon-prev fas fa-chevron-left"></i><span>', '<span class="btn-next"><i class="icon-next fas fa-chevron-right"></i><span>'],
        navClass: ['owl-prev', 'owl-next'],
        autoplay: true,
        autoplayTimeout: 5000,
        autoHeight: 350,
        center: true,
        dots: false,
        responsive: {
            0: {
                items: 1,
                dots: false
            },
            600: {
                items: 1,
                dots: false
            },
            1000: {
                items: 1
            }
        }
    })
});


function handleBestSelling(width, products) {
    products.forEach(element => {
        const thumbnail = element.querySelector('.thumbnail');
        if (width < 1200 && width >= 460) {
            element.classList.add('product-item--col');
            const tag = document.createElement("div");
            tag.classList.add('icon-action');
            const html = `
                <div class="icon-action__item"><i class="fa-solid fa-eye"></i></div>
                <div class="icon-action__item"><i class="fa-solid fa-basket-shopping"></i></div>
                <div class="icon-action__item"><i class="fa-solid fa-heart"></i></div>
                `
            tag.innerHTML = html;
            thumbnail.appendChild(tag);

        }
        else {
            element.classList.remove('product-item--col');
            const icon = thumbnail.querySelector('.icon-action');
            icon.remove();
        }
    });

}

//responsive
let width = window.innerWidth;
const products = document.querySelectorAll('.best-selling__content .product-item');
handleBestSelling(width, products);
window.addEventListener('resize', function (e) {
    width = window.innerWidth
    handleBestSelling(width, products);
    //to do in the afternoon
});



