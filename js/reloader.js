/*globals bus*/
bus.on("page", function (e, app, log, page) {
    "use strict";
    switch (page) {
    case "ranks":
        app.updateRanks();
        break;
    case "offers":
        app.updateOffers();
        app.updateUpcommingOffers();
        break;
    default:
        break;
    }
});