/*globals bus, $, cordova, console*/

bus.on("init", function (e, app) {
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
        app.checkin(result.text);
    }
    
    
    function error(err) {
        console.log(err);
    }
    
    $('#checkin').click(function () {
        scan(success, error);
    });
});