/*globals bus, $, Mustache*/
$(bus).on("init", function (event, app) {
    "use strict";
    $.get("templates/events.mst", function (template) {
        var eventsElm;
        eventsElm = $('#events');
        
        app.on("events", function (events) {
            var elm, ul;
            elm = $(Mustache.render(template, events));
            ul = elm.find("ul");
            ul.listview();
            eventsElm.empty();
            eventsElm.append(elm);
        });
    });
});