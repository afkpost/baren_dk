/*globals $*/
$(function () {
    "use strict";
    var
        elms = {
            header: $("header"),
            nav: $("nav")
        },
        callbacks = {
            menu: function () {
                elms.nav.toggle("slide", {
                    direction: elms.nav.hasClass("mobile-right") ? "right" : "left"
                });
            }
        };
    
    elms.header.click(function (e) {
        if (e.pageX <= 48) {
            elms.header.trigger("left");
        } else if (window.innerWidth - e.pageX <= 48) {
            elms.header.trigger("right");
        }
    });
    
    elms.header.attr("class").split(" ").forEach(function (clss) {
        clss = clss.split("-");
        var framework = clss[0],
            type = clss[1],
            side = clss[2],
            callback;
        
        if (framework === "mobile") {
            callback = callbacks[type];
            if (callback) {
                elms.header.on(side, callback);
            }
        }
    });
    
    elms.nav.click(function () {
        elms.nav.hide("slide");
    });
});