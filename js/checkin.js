/*globals bus, $, cordova, console*/

bus.on("init", function (e, app, log) {
    "use strict";
    
    if (typeof cordova === "undefined" || cordova.plugins === "undefined") {
        console.warn("No plugins found");
        return;
    }
    
    if (typeof cordova.plugins.barcodeScanner === "undefined") {
        console.warn("Barcode scanner plugin not found");
        return;
    }
    var scan = cordova.plugins.barcodeScanner.scan;
    
    
    function success(result) {
        console.log(result);
        app.checkin(result.text).fail(function () {
            log.error("Kunne ikke checke ind");
        });
    }
    
    
    function error(err) {
        console.log(err);
    }
    
    $('#checkin').tap(function () {
        scan(success, error);
    });
});