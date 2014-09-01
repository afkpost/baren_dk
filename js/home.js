/*globals bus, $, Mustache*/
bus.on("init", function (e, app, log) {
    "use strict";
    
    var page = $('#home');
    
    $.get("templates/home.html").done(function (html) {
        page.html(html);
        var elms = {
            offers: page.find('.offers'),
            score: page.find(".score")
        }, held = false;
        elms.offers.on('taphold', '.offer button', function () {
            held = true;
            var id = $(this).data("id");
            app.useOffer(id).fail(function () {
                log.error("Kunne ikke indløse tilbud");
            });
        });

        elms.offers.on("tap", '.offer button', function () {
            if (!held) {
                log.error("Lad bartenderen trykke");
            }
            held = false;
        });
        
        $.get("templates/offers.mst").done(function (template) {
            app.on("offers", function (offers) {
                var html = Mustache.render(template, offers);
                elms.offers.html(html);
            });
        });
        
        app.on("score", function (score) {
            elms.score.html(score.score);
        });
        
        

    });
    
});