// Count all of the links from the io.js build page
var jsdom = require("jsdom");
var fs = require("fs");

var targetUrl = process.argv[2];
var outputFile = process.argv[3];
if (targetUrl === undefined || outputFile === undefined) {
    console.log("iojs getCtripPlaceList.js [sourceFile] [outputFile]");
    return;
}

var cityList = require(targetUrl);

var result = [];
cityList.forEach(function(city, index) {
    var item = {};
    item['cname'] = city.cname;
    item['url'] = 'http://you.ctrip.com' + city.url;
    result.push(item);
});

var ci = 0;

var resultCallback = function(errors, window) {

    var nextCI = function() {
        ci++;
        if (ci < result.length) {
            setTimeout(function() {
                //console.log(JSON.stringify(result, null, 2));
                jsdom.env(
                    result[ci].url, ["http://vacation.eztravel.com.tw/pkgfrn/assets/bowerVendor/jquery/jquery.min.js"], resultCallback
                );
            }, 1000);
        } else {
            fs.writeFile(outputFile, JSON.stringify(result, null, 2), function(err) {
                if (err) {
                    return console.log(err);
                }
            });
        }
    }

    if (errors) {
        console.log('err code 01: ' + errors);
        nextCI();
        return;
    }

    var jquery = window.$;
    var pages = jquery('.numpage').text();
    var targets = [];
    if (pages !== "") {
        for (var i = 1; i <= pages; i++) {
            //targetPages.push(targetUrl.replace(/[^\/]*$/, '/') + 's0-p' + i + '.html');
            targets.push(result[ci].url.replace('.html', '/') + 's0-p' + i + '.html');
        };
    } else {
        targets.push(result[ci].url);
    }
    //console.log(targets);

    var cityPlaceResult = [];
    var i = 0;
    var pushResult = function(index) {
        if (index === targets.length) {
            (result[ci])["places"] = cityPlaceResult;
            console.log("finish: " + result[ci].cname);
            nextCI();
        }
    }

    var cityPlaceCallback = function(errors, window) {
        var jquery = window.$;

        jquery.each(jquery(".list_mod2"), function(index, value) {
            var item = {};
            item["cname"] = jquery(".rdetailbox > dl > dt > a", value).text();
            item["url"] = jquery(".rdetailbox > dl > dt > a", value).attr('href');
            item["s_img"] = jquery(".leftimg > a > img", value).attr('src');
            item["caddress"] = jquery(".rdetailbox > dl > dd.ellipsis", value).text().trim();
            cityPlaceResult.push(item);
        });

        i++;
        if (i < targets.length) {
            jsdom.env(
                targets[i], ["http://vacation.eztravel.com.tw/pkgfrn/assets/bowerVendor/jquery/jquery.min.js"], cityPlaceCallback
            );
        }
        pushResult(i);
    };

    jsdom.env(
        targets[i], ["http://vacation.eztravel.com.tw/pkgfrn/assets/bowerVendor/jquery/jquery.min.js"], cityPlaceCallback
    );
};


jsdom.env(
    result[ci].url, ["http://vacation.eztravel.com.tw/pkgfrn/assets/bowerVendor/jquery/jquery.min.js"], resultCallback
);
