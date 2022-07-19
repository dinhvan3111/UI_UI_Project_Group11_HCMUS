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

$(document).ready(function() {

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
        .on('initialized.owl.carousel', function() {
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

    sync2.on("click", ".owl-item", function(e) {
        e.preventDefault();
        var number = $(this).index();
        sync1.data('owl.carousel').to(number, 300, true);
    });
});


function logout(){
    console.log('hit');
    $.ajax({
        url: `/logout`,
        method: "POST"
    })
    .done(function( jsonResp ) {
        if(jsonResp.code === 200){
            window.location.replace("/login");
        }
    });
}

$(function() {
    $("#searchBox").autocomplete({
        source: function(req, res) {
            console.log('req: ', req);
            const encoded = encodeURI(req.term);
            $.ajax({
                url: `/products/search-autocomplete?q=${encoded}`,
                dataType: "json",
                type: "GET"
            })
            .done(function(resp) {
                console.log(resp);
                let products = [];
                for(let i = 0; i < resp.data.length; i++) {
                    products.push({
                        url: `/products/${resp.data[i]._id}`,
                        label: resp.data[i].title,
                        thumb: resp.data[i].thumb
                    });
                }
                products.push({
                    url: `/products?q=${encoded}`,
                    label: 'Xem tất cả'
                })
                res(products);
            })
            .fail(function(err) {
                console.log(err.status);
            });
        },
        minLength: 2,
        open: function() {
            var that = $(this);
            var $li = $("<li>");
            that.data("min-len", that.autocomplete("option", "minLength"));
        },
        select: function( event, ui ) {
            if(ui.item){
                // $('#searchBox').text(ui.item.label);
                window.location.href = ui.item.url;
            }
        },
      
    })
    .data("ui-autocomplete")._renderItem = function(ul, item) {
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