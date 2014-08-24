/*globals $, bus, Mustache*/

$(bus).on("init", function (event, app, log) {
    "use strict";
    var elm = $("#offers");
    
    $.get("templates/offers.html", function (html) {
        elm.html(html);
        
        $.get("templates/offers.mst", function (offersTemplate) {
            var elmOffers, elmUpcomming;
            elmOffers = elm.find('#actual_offers');
            elmUpcomming = elm.find('#upcomming_offers');
            
            app.on("offers", function (offers) {
                var html = Mustache.render(offersTemplate, offers);
                elmOffers.html(html);
            });

            app.on("upcommingOffers", function (offers) {
                elmUpcomming.html(Mustache.render(offersTemplate, offers));
            });
        });

        elm.on('click', '.offer button', function () {
            var id = $(this).data("id");
            app.useOffer(id).fail(function () {
                log.error("Kunne ikke indløse tilbud");
            });
        });
    });
});