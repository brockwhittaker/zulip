var hotspots = (function () {

var exports = {};

exports.show = function (hotspot_list) {
    for (var i = 0; i < hotspot_list.length; i += 1) {
        $("#hotspot_".concat(hotspot_list[i][0])).show();
    }
};

exports.initialize = function () {
    exports.show(page_params.hotspots);
};

function mark_hotspot_as_read(hotspot) {
    channel.post({
        url: '/json/users/me/hotspots',
        data: {hotspot: JSON.stringify(hotspot)},
    });
}

$(function () {
    $("#hotspot_welcome").on('click', function (e) {
        mark_hotspot_as_read("welcome");
        e.preventDefault();
        e.stopPropagation();
    });
    $("#hotspot_streams").on('click', function (e) {
        mark_hotspot_as_read("streams");
        e.preventDefault();
        e.stopPropagation();
    });
    $("#hotspot_topics").on('click', function (e) {
        mark_hotspot_as_read("topics");
        e.preventDefault();
        e.stopPropagation();
    });
    $("#hotspot_narrowing").on('click', function (e) {
        mark_hotspot_as_read("narrowing");
        e.preventDefault();
        e.stopPropagation();
    });
    $("#hotspot_replying").on('click', function (e) {
        mark_hotspot_as_read("replying");
        e.preventDefault();
        e.stopPropagation();
    });
    $("#hotspot_get_started").on('click', function (e) {
        mark_hotspot_as_read("get_started");
        e.preventDefault();
        e.stopPropagation();
    });

    var n = ["welcome", "search"];
    (() => {
        let map = {};

        page_params.hotspots[0].forEach((o, i) => {
            map[n[i]] = o;
        });

        page_params.hotspots = map;
    })();

    $("body").on("click", ".hotspot", function (e) {
        var name = $(this).attr("data-hotspot");
        $(this).html($(`
            <div class='tooltip top in'>
                <div class='tooltip-arrow'></div>
                <div class='tooltip-inner'>${page_params.hotspots[name]}</div>
            </div>
        `));
        e.preventDefault();
    });
});

return exports;
}());
if (typeof module !== 'undefined') {
    module.exports = hotspots;
}
