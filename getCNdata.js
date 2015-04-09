var jsdom = require("jsdom");
var exec = require('child_process').exec;

jsdom.env(
    'http://you.ctrip.com/sitemap/placedis/c110000', ["http://vacation.eztravel.com.tw/pkgfrn/assets/bowerVendor/jquery/jquery.min.js"],
    function (errors, window) {
        var jquery = window.$;

        jquery('.sitemap_toptag a').each(function (i, v) { // for 省

            if (i === 28) { //total 27 , 23 = taiwan 

                //jquery('a', jquery('.sitemap_block')[0]).each(function(i, v) { // for 直轄市
                console.log(jquery(v).attr('href'));
                var url = jquery(v).attr('href');
                var fname = (url.split('/')[4]).split('.')[0] + '.json';

                var cmd = 'iojs getCtripAllCity.js http://you.ctrip.com/countrysightlist/' + url.split('/')[4] + ' > ./citys/CN/' + fname; //for 省
                //var cmd = 'iojs getCtripAllCity.js http://you.ctrip.com/place/' + url.split('/')[4] + ' > ./citys/CN/' + fname;
                //console.log(cmd);


                var child = exec(cmd, function (error, stdout, stderr) {

                    if (error !== null) {
                        console.log('exec error: ' + error);
                    } else {
                        console.log('done: ' + cmd);

                        var subCmd = 'iojs getCtripPlaceList ./citys/CN/' + fname + ' ./cn/' + fname;
                        console.log(subCmd);
                        var subChild = exec(subCmd, function (sub_error, sub_stdout, sub_stderr) {
                            if (error !== null) {
                                console.log('sub exec error: ' + error);
                            } else {
                                console.log("sout: " + sub_stdout);
                            }
                        });
                    }
                });

            }


        });

    }
);