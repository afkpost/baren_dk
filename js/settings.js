/*globals bus, $*/
bus.on("init", function (e, app, log) {
    "use strict";
    var elm = $('#settings');
    
    function buildClans(select) {
        var i;
        select.empty();
        select.append($("<option>").val("").html("Ingen valgt"));
        for (i = 11; i <= 53; i += 2) {
            select.append($("<option>").val(i).html("Blok " + i));
        }
        
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
                elms.usernameInp.val(user.name);
                elms.clanInp.attr("disabled", typeof user.clan === "string");
                elms.clanInp.val(user.clan);
            } else {
                elms.usernameInp.val(null);
            }
        });
        
        elms.usernameInp.change(function () {
            app.updateUser({
                name: elms.usernameInp.val()
            });
        });
    });
    
    $('#btn_create_user').click(function () {
        app.updateUser({
            name: $("#inp_username").val(),
            clan: $("#inp_clan").val()
        }, function () {
            $('#popupLogin').popup("close");
        });
    });
});