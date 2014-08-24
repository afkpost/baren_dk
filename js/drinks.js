/*globals $, bus, Mustache*/

$(bus).on("init", function (e, app) {
    "use strict";
    $.get("templates/drinks.mst", function (template) {
        var drinksElm = $('#drinks');
        
        drinksElm.on("click", "li", function (e) {
            e.preventDefault();
            $(this).toggleClass("open");
        });
        
        app.on("drinks", function (drinks) {
            var elm, ul;
            elm = $(Mustache.render(template, drinks));
            ul = elm.find("ul");
            ul.listview();
            drinksElm.empty();
            drinksElm.append(elm);
        });
    });
});