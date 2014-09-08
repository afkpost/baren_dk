/*globals bus, $, Mustache*/

$(bus).on("init", function (event, app) {
    "use strict";
    $.get("templates/news.mst", function (newsTemplate) {
        var newsElm;
        newsElm = $('#news');
        
        app.on("news", function (news) {
            var html = "";
            if (news) {
                html = Mustache.render(newsTemplate, news);
            }
            newsElm.html(html);
        });
    });
});