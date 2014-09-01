/*globals $, Mustache, console, App, ServerConnection*/
var bus = $('<bus>');
$(document).on('deviceready', function (e) {
    "use strict";
    var elms = {
        page: "home",
        panel: $("#menu"),
        menu: $("#menu li"),
        header: $(".ui-header .ui-title"),
        content: $('.ui-content'),
        error: $(".error-log")
    }, app, history = [], log;
    
    elms.menu.each(function () {
        var li = $(this),
            page = li.data("page"),
            div = $("<div>").attr("id", page).addClass("page");
        elms.content.append(div);
        if (page === elms.page) {
            elms.page = div;
            
        }
    });
    
    log = function (msg) {
        console.log(msg);
    };
    
    log.error = function (msg) {
        if (elms.error.html() === "") {
            elms.error.html(msg);
            elms.error.fadeIn();
            setTimeout(function () {
                elms.error.fadeOut(function () {
                    elms.error.empty();
                });
            }, 5000);
        }
    };
    
    app = new App(new ServerConnection("https://baren.dk", log), log);
    bus.trigger("init", [app, log]);
    elms.page.show();
    
    function navigateTo(newPage, title) {
        elms.header.html(title);
        elms.panel.panel('close');
        elms.page.hide();
        elms.page = newPage;
        bus.trigger("page", [app, log, elms.page.attr("id")]);
        elms.page.fadeIn('slow');
    }
    
    $(document).on("backbutton", function (e) {
        e.preventDefault();
        if (history.length === 0) {
            navigator.app.exitApp();
        } else {
            navigateTo(history.pop());
        }
    });
    
    
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
        history.push(elms.page);
        navigateTo(newPage, $(this).html());
        
    });
});