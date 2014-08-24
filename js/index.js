/*globals $, Mustache, console, App, ServerConnection*/
var bus = $('<bus>');
$(document).on('deviceready', function (e) {
    "use strict";
    var elms = {
        page: "offers",
        panel: $("#menu"),
        menu: $("#menu li"),
        header: $(".ui-header .ui-title"),
        content: $('.ui-content')
    }, app;
    
    elms.menu.each(function () {
        var li = $(this),
            page = li.data("page"),
            div = $("<div>").attr("id", page).addClass("page");
        elms.content.append(div);
        if (page === elms.page) {
            elms.page = div;
            
        }
    });
    
    function log(msg) {
        console.log(msg);
    }
    
    app = new App(new ServerConnection("https://baren.dk", log), log);
    bus.trigger("init", [app, log]);
    elms.page.show();
    
    
    
    
    elms.menu.click(function (e) {
        var page, newPage;
        e.preventDefault();
        page = $(this).data("page");
        if (page === null) {
            console.log("No page");
            return;
        }
        page = "#" + page;
        newPage = $(page);
        if (newPage.size() !== 1) {
            console.log(page + " not found");
            return;
        }
        if (newPage.get(0) === elms.page.get(0)) {
            console.log("Navigating to the same page. No transition...");
            elms.panel.panel('close');
            return;
        }
        
        elms.header.html($(this).html());
        elms.panel.panel('close');
        elms.page.hide();
        elms.page = newPage;
        bus.trigger("page", [app, log, elms.page.attr("id")]);
        elms.page.fadeIn('slow');
        
    });
});