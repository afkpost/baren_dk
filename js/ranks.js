/*globals bus, $, Mustache*/
bus.on("init", function (e, app) {
    "use strict";
    var div = $("#ranks");
    $.get("templates/ranks.mst").done(function (template) {
        app.on("ranks", function (ranks) {
            div.html(Mustache.render(template, ranks));
        });
    });
    
    div.on("click", "ol", function () {
        $(this).toggleClass("open");
    });
});