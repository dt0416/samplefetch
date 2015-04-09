// Count all of the links from the io.js build page
var jsdom = require("jsdom");

var targetUrl = process.argv[2];
if (targetUrl === undefined) {
    console.log("ERROR: no target url.");
    return;
}


jsdom.env(
    targetUrl, ["http://vacation.eztravel.com.tw/pkgfrn/assets/bowerVendor/jquery/jquery.min.js"],
    function(errors, window) {
        var jquery = window.$;
        var pages = jquery('.numpage').text();

        var targets = [];

        if (pages !== "") {
            for (var i = 1; i <= pages; i++) {
                //for (var i = 1; i <= 1; i++) {
                //targetPages.push(targetUrl.replace(/[^\/]*$/, '/') + 's0-p' + i + '.html');
                targets.push(targetUrl.replace('.html', '/') + 'p' + i + '.html');
            };
        } else {
            targets.push(targetUrl);
        }

        //console.log(targets);

        var result = [];
        var i = 0;
        var printResult = function(index) {
            if (index === targets.length) {
                console.log(JSON.stringify(result, null, 2));
            }
        }

        var callback = function(errors, window) {
            var jquery = window.$;

            jquery.each(jquery(".list_mod1"), function(index, value) {
                var item = {};
                item["cname"] = jquery(jquery('dl > dt > a', value)).text();
                item["suggest_places"] = [];
                jquery('dl > dd.ellipsis > a', value).each(function(i, v) {
                    var kv = {};
                    kv['cname'] = jquery(v).text();
                    kv['url'] = jquery(v).attr('href');

                    item["suggest_places"].push(kv);
                });
                if (jquery('dl > dd.ellipsis', value).length > 0) {
                    item["url"] = jquery('a', jquery('dl > dd', value)[1]).attr('href');
                } else {
                    item["url"] = jquery('a', jquery('dl > dd', value)[0]).attr('href');
                }

                result.push(item);
            });

            i++;
            if (i < targets.length) {
                jsdom.env(
                    targets[i], ["http://vacation.eztravel.com.tw/pkgfrn/assets/bowerVendor/jquery/jquery.min.js"], callback
                );
            }
            printResult(i);
        };


        jsdom.env(
            targets[i], ["http://vacation.eztravel.com.tw/pkgfrn/assets/bowerVendor/jquery/jquery.min.js"], callback
        );

    });
