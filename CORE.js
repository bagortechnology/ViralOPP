!(function s(o, n, r) {
    function p(e, t) {
        if (!n[e]) {
            if (!o[e]) {
                var i = "function" == typeof require && require;
                if (!t && i) return i(e, !0);
                if (h) return h(e, !0);
                throw (((i = new Error("Cannot find module '" + e + "'")).code = "MODULE_NOT_FOUND"), i);
            }
            (i = n[e] = { exports: {} }),
                o[e][0].call(
                    i.exports,
                    function (t) {
                        return p(o[e][1][t] || t);
                    },
                    i,
                    i.exports,
                    s,
                    o,
                    n,
                    r
                );
        }
        return n[e].exports;
    }
    for (var h = "function" == typeof require && require, t = 0; t < r.length; t++) p(r[t]);
    return p;
})(
    {
        1: [
            function (t, e, i) {
                "use strict";
                var s, o, h, r, n;
                (s = window),
                    (o = n = "PsGiphyComment"),
                    (h = s.jQuery),
                    (r = t("./giphy.js")),
                    (o = peepso.createClass(o, {
                        __constructor: function () {
                            (this.template = peepsogiphydata.dialogGiphyTemplate),
                                peepso.observer.addFilter("comment_show_button", this.shouldShowButton, 10, 1),
                                peepso.observer.addFilter("comment_can_submit", this.isSubmittable, 10, 1),
                                peepso.observer.addFilter("comment_req", this.filterRequest, 10, 2),
                                peepso.observer.addAction("comment_edit", this.onEdit, 10, 2),
                                h(h.proxy(this.onDocumentLoaded, this));
                        },
                        onDocumentLoaded: function () {
                            h(document).on("click", ".ps-js-comment-giphy", h.proxy(this.onAttach, this)),
                                h(document).on("click", ".ps-js-addon-giphy .ps-js-remove", h.proxy(this.onRemove, this)),
                                h(document).on("ps_comment_aftersave", h.proxy(this.onSaved, this));
                        },
                        onAttach: _.throttle(function (t) {
                            var e,
                                i = "ps-giphy-initialized",
                                s = "ps-giphy-loading",
                                o = peepso.rtl,
                                n = h(t.currentTarget);
                            function r(t) {
                                t.show(),
                                    t[0].focus(),
                                    t.css({ backgroundColor: peepso.getLinkColor() }),
                                    t.css({ transition: "background-color 3s ease" }),
                                    setTimeout(() => {
                                        t.css({ backgroundColor: "" });
                                    }, 500);
                            }
                            t.preventDefault(),
                                t.stopPropagation(),
                                (n = n.closest(".ps-js-comment-new, .ps-js-comment-edit")),
                                (e = n.prev(".ps-js-giphy-container")).length ||
                                    ((e = h(this.template)).data("act-id", n.data("id")),
                                    e.find(".ps-js-giphy-list").css("transition", `margin-${o ? "right" : "left"} .5s`),
                                    e.hide().insertBefore(n),
                                    e.on("input", ".ps-js-giphy-query", h.proxy(this.onSearch, this)),
                                    e.on("click", ".ps-js-giphy-list img", h.proxy(this.onSelectImage, this)),
                                    e.on("click", ".ps-js-giphy-nav-left", (t) => this.onScroll(t, "left")),
                                    e.on("click", ".ps-js-giphy-nav-right", (t) => this.onScroll(t, "right"))),
                                e.is(":visible")
                                    ? e.hide()
                                    : (e.show(),
                                      e.data(i) || e.data(s)
                                          ? r(e.find(".ps-js-giphy-query"))
                                          : (e.data(s, !0),
                                            this.search(e).done(
                                                h.proxy(function () {
                                                    e.data(i, !0), e.removeData(s), r(e.find(".ps-js-giphy-query"));
                                                }, this)
                                            )));
                        }, 1e3),
                        search: function (o, n) {
                            return h.Deferred(
                                h.proxy(function (e) {
                                    var t = r.getInstance(),
                                        i = o.find(".ps-js-giphy-loading").show(),
                                        s = o.find(".ps-js-giphy-list").hide();
                                    t.search(n).done(
                                        h.proxy(function (t) {
                                            this.render(o, t), i.hide(), s.show(), e.resolveWith(this);
                                        }, this)
                                    );
                                }, this)
                            );
                        },
                        render: function (t, e) {
                            var i = t.find(".ps-js-giphy-list"),
                                t = t.find(".ps-js-giphy-list-item"),
                                r = peepso.template(t.html()),
                                p = peepsogiphydata.giphy_rendition_comments || "fixed_width",
                                e = _.map(e, function (t, e) {
                                    var i,
                                        s = t.images,
                                        o = s[p],
                                        n = "";
                                    return o && (i = s.preview_gif || s.downsized_still || s.fixed_width_still || s.original_still) && (h.extend(t, { src: o.url, preview: i.url }), (n = r(t))), n;
                                });
                            i.html(e.join(""));
                        },
                        onSearch: function (t) {
                            var e = h(t.currentTarget),
                                i = e.closest(".ps-js-giphy-container"),
                                s = i.find(".ps-js-giphy-list"),
                                o = i.find(".ps-js-giphy-loading"),
                                t = peepso.rtl;
                            s.hide().css(t ? "marginRight" : "marginLeft", 0), o.show(), this._onSearch(i, e);
                        },
                        _onSearch: _.debounce(function (t, e) {
                            this.search(t, h.trim(e.val()));
                        }, 1e3),
                        onSelectImage: function (t) {
                            var e = h(t.currentTarget),
                                i = e.closest(".ps-js-giphy-container"),
                                t = e.attr("src"),
                                e = e.attr("data-url");
                            this.select(i, t, e), i.hide();
                        },
                        onScroll: function (t, e) {
                            var i = peepso.rtl,
                                s = h(t.currentTarget).closest(".ps-js-slider"),
                                o = s.find(".ps-js-giphy-list"),
                                t = s.width(),
                                s = parseInt(o.css(i ? "marginRight" : "marginLeft")) || 0;
                            e === (i ? "right" : "left")
                                ? (s = Math.min(s + t, 0))
                                : e === (i ? "left" : "right") && ((e = o.children(".ps-js-giphy-item").last()), (e = i ? Math.abs(e.position().left) : e.position().left + e.width() - t), (s -= Math.min(t, e))),
                                o.css(i ? "marginRight" : "marginLeft", s);
                        },
                        select: function (t, e, i) {
                            t = t.siblings(".ps-js-comment-new, .ps-js-comment-edit").find(".ps-js-addons").find(".ps-js-addon-giphy");
                            t.find(".ps-js-remove").show(), t.find(".ps-js-img").attr("src", e).attr("data-url", i).show(), t.show(), h(document).trigger("ps_comment_addon_added", t);
                        },
                        onRemove: function (t) {
                            t = h(t.currentTarget).closest(".ps-js-addon-giphy");
                            t.find(".ps-js-remove").hide(), t.find(".ps-js-img").attr("src", "").attr("data-url", "").hide(), t.hide(), h(document).trigger("ps_comment_addon_removed", t);
                        },
                        shouldShowButton: function (t) {
                            var e,
                                i = h(t.el).closest(".ps-js-comment-new, .ps-js-comment-edit").find(".ps-js-addon-giphy");
                            return i.is(":visible") && (e = i.find(".ps-js-img")).length && e.attr("src") && (t.show = !0), t;
                        },
                        isSubmittable: function (t) {
                            var e,
                                i = h(t.el).closest(".ps-js-comment-new, .ps-js-comment-edit").find(".ps-js-addon-giphy");
                            return i.is(":visible") && (e = i.find(".ps-js-img")).length && e.attr("src") && (t.can_submit = !0), t;
                        },
                        filterRequest: function (t, e) {
                            var i,
                                e = h(e).closest(".ps-js-comment-new, .ps-js-comment-edit").find(".ps-js-addon-giphy");
                            return e.is(":visible") && (i = e.find(".ps-js-img")).length && i.attr("data-url") && ((t.giphy = i.attr("data-url")), (t.giphy = t.giphy.replace(/^[a-z]+:\/\//i, ""))), t;
                        },
                        onSaved: function (t, e, i) {
                            i = h(i).closest(".ps-js-comment-new, .ps-js-comment-edit").find(".ps-js-addon-giphy");
                            i.find(".ps-js-remove").hide(), i.find(".ps-js-img").attr("src", "").hide(), i.hide(), h(document).trigger("ps_comment_addon_removed", i);
                        },
                        onEdit: function (t, e) {
                            var i = h(e).find(".ps-js-addon-giphy"),
                                e = i.find(".ps-js-img");
                            e.length && e.attr("src")
                                ? (i.find(".ps-js-remove").show(), i.find(".ps-js-img").show(), i.show(), h(document).trigger("ps_comment_addon_added", i))
                                : (i.find(".ps-js-remove").hide(), i.find(".ps-js-img").hide(), i.hide(), h(document).trigger("ps_comment_addon_removed", i));
                        },
                    })),
                    "object" == typeof e && e.exports ? (e.exports = o) : (s[n] = o),
                    new o();
            },
            { "./giphy.js": 2 },
        ],
        2: [
            function (t, e, i) {
                "use strict";
                var s, o, n, r, p;
                (s = window),
                    (n = "PsGiphy"),
                    (o = s.jQuery),
                    (r = peepso.createClass(n, {
                        __constructor: function () {
                            (this.apiKey = peepsogiphydata.giphy_api_key), (this.displayLimit = peepsogiphydata.giphy_display_limit), (this.rating = peepsogiphydata.giphy_rating);
                        },
                        search: function (i) {
                            return (
                                (i = o.trim(i || "")),
                                o.Deferred(
                                    o.proxy(function (e) {
                                        this._result || (this._result = {});
                                        var t = this._result[i];
                                        t
                                            ? e.resolveWith(this, [t])
                                            : this._giphy(i).done(
                                                  o.proxy(function (t) {
                                                      (this._result[i] = t.data), e.resolveWith(this, [t.data]);
                                                  }, this)
                                              );
                                    }, this)
                                )
                            );
                        },
                        _giphy: function (t) {
                            var e = "https://api.giphy.com/v1/gifs/trending",
                                i = { api_key: this.apiKey, limit: this.displayLimit };
                            return this.rating && (i.rating = this.rating), t && ((e = "https://api.giphy.com/v1/gifs/search"), (i = _.extend(i, { q: t, offset: 0 }))), o.get(e, i);
                        },
                    })),
                    (p = {
                        getInstance: function () {
                            return this._instance || (this._instance = new r()), this._instance;
                        },
                    }),
                    "object" == typeof e && e.exports ? (e.exports = p) : (s[n] = p);
            },
            {},
        ],
        3: [
            function (o, t, e) {
                !function (i) {
                    !function () {
                        "use strict";
                        var t,
                            s = (t = "undefined" != typeof window ? window.jQuery : void 0 !== i ? i.jQuery : null) && t.__esModule ? t : { default: t },
                            e = "undefined" != typeof window ? window.peepso : void 0 !== i ? i.peepso : null;
                        o("./comment"),
                            o("./message"),
                            o("./postbox"),
                            e.observer.addFilter(
                                "human_friendly_extras",
                                function (t, e, i) {
                                    return e || !i || i.querySelector(".ps-js-post-header") || ((i = (0, s.default)(i).find(".ps-comment-media .ps-js-giphy [data-preview]")).length && t.push(i.data("preview"))), t;
                                },
                                20,
                                3
                            );
                    }.call(this);
                }.call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
            },
            { "./comment": 1, "./message": 4, "./postbox": 5 },
        ],
        4: [
            function (t, e, i) {
                "use strict";
                var s, o, h, r, n;
                (s = window),
                    (o = n = "PsGiphyMessage"),
                    (h = s.jQuery),
                    (r = t("./giphy.js")),
                    (o = peepso.createClass(o, {
                        __constructor: function () {
                            h(h.proxy(this.onDocumentLoaded, this));
                        },
                        onDocumentLoaded: function () {
                            h(document).on("click", ".ps-js-chat-window .ps-js-giphy-trigger", h.proxy(this.onToggle, this));
                        },
                        onToggle: function (t) {
                            var e = h(t.currentTarget).siblings(".ps-js-giphy-container"),
                                i = "ps-giphy-initialized",
                                s = "ps-giphy-loading";
                            function o(t) {
                                t.show(),
                                    t[0].focus(),
                                    t.css({ backgroundColor: peepso.getLinkColor() }),
                                    t.css({ transition: "background-color 3s ease" }),
                                    setTimeout(() => {
                                        t.css({ backgroundColor: "" });
                                    }, 500);
                            }
                            t.preventDefault(),
                                t.stopPropagation(),
                                e.is(":visible")
                                    ? e.hide()
                                    : (e.show(),
                                      e.data(i) || e.data(s)
                                          ? o(e.find(".ps-js-giphy-query"))
                                          : (e.data(s, !0),
                                            e.on("input", ".ps-js-giphy-query", h.proxy(this.onSearch, this)),
                                            e.on("click", ".ps-js-giphy-list img", h.proxy(this.onSelectImage, this)),
                                            e.on("click", ".ps-js-giphy-nav-left", (t) => this.onScroll(t, "left")),
                                            e.on("click", ".ps-js-giphy-nav-right", (t) => this.onScroll(t, "right")),
                                            this.search(e).done(
                                                h.proxy(function () {
                                                    e.data(i, !0), e.removeData(s), o(e.find(".ps-js-giphy-query"));
                                                }, this)
                                            )));
                        },
                        search: function (o, n) {
                            return h.Deferred(
                                h.proxy(function (e) {
                                    var t = r.getInstance(),
                                        i = o.find(".ps-js-giphy-loading").show(),
                                        s = o.find(".ps-js-giphy-list").hide();
                                    t.search(n).done(
                                        h.proxy(function (t) {
                                            this.render(o, t), i.hide(), s.show(), e.resolveWith(this);
                                        }, this)
                                    );
                                }, this)
                            );
                        },
                        render: function (t, e) {
                            var i = t.find(".ps-js-giphy-list"),
                                t = t.find(".ps-js-giphy-list-item"),
                                r = peepso.template(t.html()),
                                p = peepsogiphydata.giphy_rendition_messages || "fixed_width",
                                e = _.map(e, function (t, e) {
                                    var i,
                                        s = t.images,
                                        o = s[p],
                                        n = "";
                                    return o && (i = s.preview_gif || s.downsized_still || s.fixed_width_still || s.original_still) && (h.extend(t, { src: o.url, preview: i.url }), (n = r(t))), n;
                                });
                            i.html(e.join(""));
                        },
                        onSearch: function (t) {
                            var e = h(t.currentTarget),
                                i = e.closest(".ps-js-giphy-container"),
                                s = i.find(".ps-js-giphy-list"),
                                t = i.find(".ps-js-giphy-loading");
                            s.hide().css({ marginLeft: "", marginRight: "" }), t.show(), this._onSearch(i, e);
                        },
                        _onSearch: _.debounce(function (t, e) {
                            this.search(t, h.trim(e.val()));
                        }, 1e3),
                        onSelectImage: function (t) {
                            var e = h(t.currentTarget),
                                i = e.closest(".ps-js-giphy-container"),
                                t = i.closest(".ps-js-chat-window").data("id"),
                                e = e.attr("data-url");
                            i.hide(), this.post(t, e);
                        },
                        onScroll: function (t, e) {
                            var i = peepso.rtl,
                                s = h(t.currentTarget).closest(".ps-js-slider"),
                                o = s.find(".ps-js-giphy-list"),
                                t = s.width(),
                                s = parseInt(o.css(i ? "marginRight" : "marginLeft")) || 0;
                            e === (i ? "right" : "left")
                                ? (s = Math.min(s + t, 0))
                                : e === (i ? "left" : "right") && ((e = o.children(".ps-js-giphy-item").last()), (e = i ? Math.abs(e.position().left) : e.position().left + e.width() - t), (s -= Math.min(t, e))),
                                o.css(i ? "marginRight" : "marginLeft", s);
                        },
                        post: function (t, e) {
                            peepso.observer.doAction("msgso_send_message", t, "", { type: "giphy", giphy: e });
                        },
                    })),
                    "object" == typeof e && e.exports ? (e.exports = o) : (s[n] = o),
                    new o(),
                    peepso.observer.addFilter(
                        "giphy_rendition_posts",
                        function (t, e) {
                            return (t = "messagesajax.add_message" === e.opts.save_url ? window.peepsogiphydata.giphy_rendition_messages || "fixed_width" : t);
                        },
                        10,
                        2
                    );
            },
            { "./giphy.js": 2 },
        ],
        5: [
            function (n, t, e) {
                !function (o) {
                    !function () {
                        "use strict";
                        var r = t("undefined" != typeof window ? window.jQuery : void 0 !== o ? o.jQuery : null),
                            e = t("undefined" != typeof window ? window._ : void 0 !== o ? o._ : null),
                            p = (function (t, e) {
                                if (!e && t && t.__esModule) return t;
                                if (null === t || ("object" != typeof t && "function" != typeof t)) return { default: t };
                                e = h(e);
                                if (e && e.has(t)) return e.get(t);
                                var i,
                                    s = {},
                                    o = Object.defineProperty && Object.getOwnPropertyDescriptor;
                                for (i in t) {
                                    var n;
                                    "default" !== i && Object.prototype.hasOwnProperty.call(t, i) && ((n = o ? Object.getOwnPropertyDescriptor(t, i) : null) && (n.get || n.set) ? Object.defineProperty(s, i, n) : (s[i] = t[i]));
                                }
                                (s.default = t), e && e.set(t, s);
                                return s;
                            })("undefined" != typeof window ? window.peepso : void 0 !== o ? o.peepso : null),
                            i = t(n("./giphy"));
                        function h(t) {
                            if ("function" != typeof WeakMap) return null;
                            var e = new WeakMap(),
                                i = new WeakMap();
                            return (h = function (t) {
                                return t ? i : e;
                            })(t);
                        }
                        function t(t) {
                            return t && t.__esModule ? t : { default: t };
                        }
                        class s {
                            constructor(t) {
                                (this.$postbox = t),
                                    (this.$postboxTab = this.$postbox.$posttabs),
                                    (this.$postboxStatusTextarea = this.$postbox.$textarea),
                                    (this.$postboxStatus = this.$postboxStatusTextarea.closest(".ps-postbox-status")),
                                    (this.$postboxGiphy = this.$postbox.find(".ps-postbox-tabs [data-tab-id=giphy]")),
                                    (this.$preview = this.$postboxGiphy.find(".ps-js-giphy-preview").hide()),
                                    (this.$selector = this.$postboxGiphy.find(".ps-js-giphy-container").show()),
                                    (this.$loading = this.$selector.find(".ps-js-giphy-loading")),
                                    (this.$query = this.$selector.find(".ps-js-giphy-query")),
                                    (this.$result = this.$selector.find(".ps-js-giphy-list")),
                                    (this.$slider = this.$result.parent()),
                                    (this.onScroll = e.default.throttle(this.onScroll, 500)),
                                    this.$preview.on("click", ".ps-js-giphy-change", (t) => this.onChangeImage(t)),
                                    this.$query.on("input", (t) => this.onInput(t)),
                                    this.$result.on("click", "img", (t) => this.onSelect(t.target)),
                                    this.$slider.find(".ps-js-giphy-nav-left").on("click", () => this.onScroll("left")),
                                    this.$slider.find(".ps-js-giphy-nav-right").on("click", () => this.onScroll("right")),
                                    (this.giphy = null),
                                    (this.itemTemplate = p.default.template(this.$slider.find(".ps-js-giphy-list-item").html())),
                                    this.$postboxTab.on("peepso_posttabs_show-giphy", r.default.proxy(this.show, this)),
                                    this.$postboxTab.on("peepso_posttabs_cancel-giphy", r.default.proxy(this.cancel, this)),
                                    this.$postboxTab.on("peepso_posttabs_submit-giphy", r.default.proxy(this.post, this)),
                                    p.observer.addAction("postbox_type_set", r.default.proxy(this.actionPostboxTypeSet, this), 10, 2),
                                    p.observer.addFilter("peepso_postbox_can_submit", r.default.proxy(this.filterCanSubmit, this), 10, 2);
                            }
                            show() {
                                function t(t) {
                                    t.show(),
                                        t[0].focus(),
                                        t.css({ backgroundColor: p.default.getLinkColor() }),
                                        t.css({ transition: "background-color 3s ease" }),
                                        setTimeout(() => {
                                            t.css({ backgroundColor: "" });
                                        }, 500);
                                }
                                this.$postboxStatus.show(), this.$postboxGiphy.show(), this.giphy ? t(this.$query) : ((this.giphy = i.default.getInstance()), this.search().done(() => t(this.$query)));
                            }
                            cancel() {
                                (this.selectedImage = null), this.$postboxGiphy.hide(), this.$preview.hide(), this.$selector.show(), this.$postbox.on_change();
                            }
                            post() {
                                var t = "postbox_req_" + this.$postbox.guid;
                                p.observer.addFilter(t, this.filterPostboxReq, 10, 1, this), this.$postbox.save_post(), p.observer.removeFilter(t, this.filterPostboxReq, 10);
                            }
                            value() {
                                let t;
                                return this.selectedImage && (t = this.selectedImage), t;
                            }
                            search(t = "") {
                                return (
                                    this.$result.hide(),
                                    this.$loading.show(),
                                    r.default.Deferred((e) => {
                                        clearTimeout(this.searchDelay);
                                        let i = (this.searchDelay = setTimeout(() => {
                                            this.giphy.search(t).done((t) => {
                                                this.searchDelay === i && (this.render(t), this.$loading.hide(), this.$result.show(), this.$query.show()), e.resolveWith(this);
                                            });
                                        }, 1e3));
                                    })
                                );
                            }
                            render(t) {
                                let n = p.observer.applyFilters("giphy_rendition_posts", peepsogiphydata.giphy_rendition_posts || "fixed_width", this.$postbox),
                                    e = t.map((t) => {
                                        var e,
                                            i = t.images,
                                            s = i[n],
                                            o = "";
                                        return s && (e = i.preview_gif || i.downsized_still || i.fixed_width_still || i.original_still) && (r.default.extend(t, { src: s.url, preview: e.url }), (o = this.itemTemplate(t))), o;
                                    });
                                this.$result.html(e.join(""));
                            }
                            select(t, e) {
                                (this.selectedImage = e), this.$selector.hide(), this.$preview.find("img").attr("src", t), this.$preview.show(), this.$postbox.on_change();
                            }
                            scroll(t) {
                                let e = p.default.rtl,
                                    i = this.$selector.find(".ps-js-slider"),
                                    s = i.find(".ps-js-giphy-list"),
                                    o = i.width(),
                                    n = parseInt(s.css(e ? "marginRight" : "marginLeft")) || 0,
                                    r;
                                t === (e ? "right" : "left")
                                    ? (n = Math.min(n + o, 0))
                                    : t === (e ? "left" : "right") && ((t = s.children(".ps-js-giphy-item").last()), (r = e ? Math.abs(t.position().left) : t.position().left + t.width() - o), (n -= Math.min(o, r))),
                                    s.css(e ? "marginRight" : "marginLeft", n);
                            }
                            onChangeImage(t) {
                                t.preventDefault(), t.stopPropagation(), (this.selectedImage = null), this.$postbox.on_change(), this.$preview.hide(), this.$selector.show();
                            }
                            onInput(t) {
                                let e = t.target.value;
                                this.$result.hide(), this.$loading.show(), this.search(e.trim());
                            }
                            onScroll(t) {
                                this.scroll(t);
                            }
                            onSelect(t) {
                                this.select(t.src, t.getAttribute("data-url"));
                            }
                            filterPostboxReq(t) {
                                var e = this.value();
                                return e && ((t.type = "giphy"), (t.giphy = e)), t;
                            }
                            filterCanSubmit(t, e) {
                                return this.$postbox === e && "giphy" === this.$postboxTab.current_tab_id && t.hard.push(!!this.value()), t;
                            }
                            actionPostboxTypeSet(t, e) {
                                t === this.$postbox && "giphy" === e && "giphy" !== this.$postboxTab.current_tab_id && this.$postbox.find("[data-tab=giphy]").trigger("click");
                            }
                        }
                        p.observer.addAction(
                            "peepso_postbox_addons",
                            (t) => {
                                return (
                                    t.push({
                                        init() {},
                                        set_postbox(t) {
                                            t.find("[data-tab-id=giphy]").length && new s(t);
                                        },
                                    }),
                                    t
                                );
                            },
                            10,
                            1
                        );
                    }.call(this);
                }.call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
            },
            { "./giphy": 2 },
        ],
    },
    {},
    [3]
);
