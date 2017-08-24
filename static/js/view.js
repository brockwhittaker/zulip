var View = (() => {
    var funcs = {
        // traverse all levels of an object recursively and give a callback with
        // the object level and key.
        traverse_object: function (obj, callback) {
            var seen = [];

            var __traverse_object = function (obj, callback) {
                for (var key in obj) {
                    if (typeof obj[key] !== "object") {
                        callback(obj, key);
                    } else if (obj[key] !== null) {
                        // this prevents infinite loops in objects with circular references.
                        if (seen.indexOf(obj[key]) === -1) {
                            funcs.traverse_object(obj[key], callback);
                            seen.push(obj[key]);
                        }
                    }
                }
            };

            return __traverse_object(obj, callback);
        },

        // this takes a core object `o1` and an object of properties to apply to
        // `o1` (`o2`) in a mutable fashion, and provides a callback with each
        // relative level object and key.
        assign_deep: function (o1, o2, callback) {
            var seen = [];

            var __assign_deep = function (o1, o2, callback) {
                for (var key in o2) {
                    if (typeof o2[key] !== "object") {
                        callback(o1, o2, key);
                    } else if (o2[key] !== null) {
                        // this prevents infinite loops in objects with circular references.
                        if (seen.indexOf(o2[key]) === -1) {
                            if (typeof o1[key] === "undefined") {
                                // we will eventually have to add defineProperty to this.
                                o1[key] = {};
                            }
                            funcs.traverse_object(o1[key], o2[key], callback);
                            seen.push(o2[key]);
                        }
                    }
                }
            };

            return __assign_deep(o1, o2, callback);
        },

        // define a property with a getter and setter given an object and a key.
        // this essentially just creates a closure that allows for the object
        // to continue to act normally while also having a callback.
        define_prop: function (obj, key, callback, object, parent) {
            var value = obj[key];

            Object.defineProperty(obj, key, {
                get: () => value,
                set: (new_value) => {
                    if (new_value instanceof funcs.NO_RENDER) {
                        value = new_value.get();
                    } else if (new_value !== value) {
                        value = new_value;
                        parent.innerHTML = callback(object);
                    }
                },
            });
        },

        // this is a class to specially identify objects that are set and tell
        // them not to update/rerender the HTML.
        NO_RENDER: function (data) {
            this.data = data;
        },
    };

    // return the data set. this is just a class formality to reach the data.
    funcs.NO_RENDER.prototype.get = function () {
        return this.data;
    };

    // use the class method for this because there's lots of these things floating
    // around so we don't want to create multiple prototypes.
    const Node = function (parent, do_render, object) {
        this.parent = parent;
        this.do_render = do_render;
        this.object = object;

        funcs.traverse_object(object, function (object, key) {
            funcs.define_prop(object, key, do_render, object, parent);
        });

        // run an initial pass render.
        this.render();
    };

    Node.prototype = {
        assign: function (object) {
            // this will take the props from the provided object assign and will
            // attempt to update the keys with an instance of `funcs.NO_RENDER`.
            // the purpose of this is so that it can be identified as a group
            // update and will not re-render at every set like it normally does.
            funcs.assign_deep(this.object, object, function (o1, o2, key) {
                o1[key] = new funcs.NO_RENDER(o2[key]);
            });

            // now manually trigger an update of the HTML.
            this.parent.innerHTML = this.do_render(this.object);

            return this;
        },

        // general render function that can be called at any time.
        render: function () {
            this.parent.innerHTML = this.do_render(this.object);
        },
    };

    // return this to the variable `View`.
    return Node;
})();
