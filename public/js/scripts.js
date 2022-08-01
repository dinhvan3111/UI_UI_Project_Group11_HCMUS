function change_image(image) {
    var container = document.getElementById("main-image");
    container.src = image.src;
}

// owl carousel
// $(document).ready(function(){
//     $('.owl-carousel').owlCarousel({
//         margin:10,
//         nav:false,
//         dots:false,
//         items:4,
//     })
// });

$(document).ready(function () {

    var sync1 = $("#sync1");
    var sync2 = $("#sync2");
    var slidesPerPage = 4; //globaly define number of elements per page
    var syncedSecondary = true;

    sync1.owlCarousel({
        items: 1,
        slideSpeed: 2000,
        autoplay: false,
        dots: false,
        loop: true,
        responsiveRefreshRate: 200,
    }).on('changed.owl.carousel', syncPosition);

    sync2
        .on('initialized.owl.carousel', function () {
            sync2.find(".owl-item").eq(0).addClass("current");
        })
        .owlCarousel({
            items: slidesPerPage,
            dots: false,
            nav: false,
            smartSpeed: 200,
            slideSpeed: 500,
            slideBy: slidesPerPage, //alternatively you can slide by 1, this way the active slide will stick to the first item in the second carousel
            responsiveRefreshRate: 100
        }).on('changed.owl.carousel', syncPosition2);

    function syncPosition(el) {
        //if you set loop to false, you have to restore this next line
        //var current = el.item.index;

        //if you disable loop you have to comment this block
        var count = el.item.count - 1;
        var current = Math.round(el.item.index - (el.item.count / 2) - .5);

        if (current < 0) {
            current = count;
        }
        if (current > count) {
            current = 0;
        }

        //end block

        sync2
            .find(".owl-item")
            .removeClass("current")
            .eq(current)
            .addClass("current");
        var onscreen = sync2.find('.owl-item.active').length - 1;
        var start = sync2.find('.owl-item.active').first().index();
        var end = sync2.find('.owl-item.active').last().index();

        if (current > end) {
            sync2.data('owl.carousel').to(current, 100, true);
        }
        if (current < start) {
            sync2.data('owl.carousel').to(current - onscreen, 100, true);
        }
    }

    function syncPosition2(el) {
        if (syncedSecondary) {
            var number = el.item.index;
            sync1.data('owl.carousel').to(number, 100, true);
        }
    }

    sync2.on("click", ".owl-item", function (e) {
        e.preventDefault();
        var number = $(this).index();
        sync1.data('owl.carousel').to(number, 300, true);
    });
});

function addToCart(productId, quantityParam = -1) {
    let quantity = 1;
    if (quantityParam === -1) {
        quantity = $(`#quantity`).val();
        const stock = $(`#stock`).val();
        if (quantity > stock) {
            $('#addToCartModal .modal-body img').attr("src", "/assets/img/error.png");
            $('#addToCartModal .modal-body p').html("Sản phẩm đã hết hàng!");

            // Display Modal
            $('#addToCartModal').modal('show');
            return;
        }
    }

    const data = {
        productId: productId,
        quantity: quantity
    }
    $.ajax({
        url: `/api/cart`,
        method: "POST",
        data: data
    })
        .done(function (jsonResp) {
            console.log(jsonResp);
            if (jsonResp.code === 200) {
                $('#cartNum').val(jsonResp.totalInCart);
                $('#cartNumStr').html(jsonResp.totalInCart.toString());


                $('#addToCartModal .modal-body img').attr("src", "/assets/img/check.png");
                $('#addToCartModal .modal-body p').html("Sản phẩm đã được thêm vào giỏ hàng!");

                // Display Modal
                $('#addToCartModal').modal('show');
            }
            else {
                $('#addToCartModal .modal-body img').attr("src", "/assets/img/error.png");
                $('#addToCartModal .modal-body p').html("Thêm giỏ hàng thất bại!");

                // Display Modal
                $('#addToCartModal').modal('show');
            }
        });
}

function logout() {
    $.ajax({
        url: `/logout`,
        method: "POST"
    })
        .done(function (jsonResp) {
            if (jsonResp.code === 200) {
                window.location.replace("/login");
            }
        });
}

$(function () {
    $("#searchBox").autocomplete({
        source: function (req, res) {
            console.log('req: ', req);
            const encoded = encodeURI(req.term);
            $.ajax({
                url: `/products/search-autocomplete?q=${encoded}`,
                dataType: "json",
                type: "GET"
            })
                .done(function (resp) {
                    console.log(resp);
                    let products = [];
                    for (let i = 0; i < resp.data.length; i++) {
                        products.push({
                            url: `/products/${resp.data[i]._id}`,
                            label: resp.data[i].title,
                            thumb: resp.data[i].thumb
                        });
                    }
                    products.push({
                        url: `/products?q=${encoded}`,
                        label: 'Xem tất cả'
                    });
                    res(products);
                })
                .fail(function (err) {
                    console.log(err.status);
                });
        },
        minLength: 2,
        open: function () {
            var that = $(this);
            var $li = $("<li>");
            that.data("min-len", that.autocomplete("option", "minLength"));
        },
        select: function (event, ui) {
            if (ui.item) {
                // $('#searchBox').text(ui.item.label);
                window.location.href = ui.item.url;
            }
        },

    })
        .data("ui-autocomplete")._renderItem = function (ul, item) {
            // console.log('ok', item)
            var $div = $("<div>", {
                class: "item-autocomplete-wrap"
            });

            $("<img>", {
                src: item.thumb
            }).appendTo($div);

            $("<span>", {
                class: "item-label"
            }).text(item.label).appendTo($div);

            return $("<li>").append($div).appendTo(ul);
        };
});

//paging
function createData(totalProducts) {
    var arr = [];
    var i = 0;

    while (i < totalProducts) {
        arr.push("Item: " + i.toString());
        i++;
    }

    return arr;
}

function dataFunc(done) {
    var data = [];

    while (data.length < itemsPerPage) {
        var num = Math.floor(Math.random() * 100);
        data.push(num);
    }

    var handler = function () {
        done(data, 100);
    };
    setTimeout(handler, 1000);
}

function renderer(data) {
    $('#content').empty();

    $.each(data, function (i, v) {
        $('#content').append("<p>" + v + "</p>");
    });
};

