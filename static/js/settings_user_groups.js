var settings_user_groups = (function () {

var exports = {};

var meta = {
    loaded: false,
};

exports.reset = function () {
    meta.loaded = false;
};

exports.set_up = function () {
    meta.loaded = true;

    var group_map = {
        // user ids
        Backend: [32, 33, 34, 35, 36],
        Frontend: [37, 33, 38, 39],
        API: [34, 35, 40],
    };

    $("[data-group-pills]").each(function () {
        var $this = $(this);
        var pills = input_pill($this);
        var group_name = $this.data("group-pills");

        if (Array.isArray(group_map[group_name])) {
            group_map[group_name].forEach(function (user_id) {
                var user = people.get_person_from_user_id(user_id);

                if (user) {
                    pills.pill.append(user.full_name, user_id);
                }
            });
        }
    });
};

return exports;
}());

if (typeof module !== 'undefined') {
    module.exports = settings_user_groups;
}
