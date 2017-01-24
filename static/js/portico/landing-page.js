// this will either smooth scroll to an anchor where the `name`
// is the same as the `scroll-to` reference, or to a px height
// (as specified like `scroll-to='0px'`).
var ScrollTo = function () {
    $("[scroll-to]").click(function () {
        var sel = $(this).attr("scroll-to");

        // if the `scroll-to` is a parse-able pixel value like `50px`,
        // then use that as the scrollTop, else assume it is a selector name
        // and find the `offsetTop`.
        var top = /\dpx/.test(sel) ?
                parseInt(sel, 10) :
                $("[name='" + sel + "']").offset().top;

        $("body").animate({ scrollTop: top + "px" }, 300);
    });
};

var events = function () {
    ScrollTo();

    $("a").click(function (e) {
        e.preventDefault();
        $("#app").removeClass("show");
        setTimeout(function () {
            window.location.href = $(this).attr("href");
        }.bind(this), 500);
    });
};

// run this callback when the page is determined to have loaded.
var load = function () {
    // show the .portico-landing when the document is loaded.
    $(".portico-landing").addClass("show");

    (function () {
        // switch the hero images once every 4 seconds.
        setInterval(function () {
            $("x-grad").toggleClass("orange-grad blue-grad");
        }, 4000);
    }());

    // display the `x-grad` element a second after load so that the slide up
    // transition on the .portico-landing is nice and smooth.
    setTimeout(function () {
        $("x-grad").addClass("show");
    }, 1000);

    // Set events.
    events();
});
