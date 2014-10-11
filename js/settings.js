/*globals bus, $*/
bus.on("init", function (e, app, log) {
    "use strict";
    var elm = $('#settings');
    
    function buildClans(select) {
        var i;
        select.empty();
        select.append($("<option>").html("Ingen valgt"));
        for (i = 11; i <= 53; i += 2) {
            select.append($("<option>").val(i).html("Blok " + i));
        }
        select.append($("<option>").val("N/A").html("Bor ikke på kollegiet"));
        
        select.on("change", function () {
            app.updateUser({
                clan: select.val()
            });
        });
    }
    
    $.get("templates/settings.html").done(function (html) {
        elm.html(html);
        var elms = {
            usernameInp: elm.find("input.user"),
            clanInp: elm.find("select.clan")
        };
        buildClans(elms.clanInp);
         
        app.on("user", function (user) {
            if (user) {
                elms.clanInp.selectmenu();
                elms.usernameInp.val(user.name);
                if (typeof user.clan === "string") {
                    elms.clanInp.selectmenu("disable");
                    elms.clanInp.val(user.clan);
                } else {
                    elms.clanInp.selectmenu("enable");
                }
                elms.clanInp.selectmenu("refresh");
            } else {
                elms.usernameInp.val(null);
            }
        });
        
        elms.usernameInp.focusout(function () {
            app.updateUser({
                name: elms.usernameInp.val()
            });
        });
        
        elm.enhanceWithin();
    });
});