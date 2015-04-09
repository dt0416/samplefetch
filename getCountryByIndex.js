var jsdom = require("jsdom");
var exec = require('child_process').exec;

jsdom.env(
    'http://you.ctrip.com/place/', ["http://vacation.eztravel.com.tw/pkgfrn/assets/bowerVendor/jquery/jquery.min.js"],
    function(errors, window) {
        var jquery = window.$;



        jquery('li > a', jquery('.countrylist > .item')[7]).each(function(i, v) {
            var url = jquery(v).attr('href');
            var fname = (url.split('/')[2]).split('.')[0] + '.json';
            var cmd = 'iojs getCtripAllCity.js http://you.ctrip.com/countrysightlist/' + url.split('/')[2] + ' > ./citys/AN/' + fname;            

            var child = exec(cmd, function(error, stdout, stderr) {

                if (error !== null) {
                    console.log('exec error: ' + error);
                }else{
                    console.log('done: ' + cmd);
                    
                    var subCmd = 'iojs getCtripPlaceList ./citys/AN/' + fname + ' ./an/' + fname;
                    console.log(subCmd);
                    var subChild = exec(subCmd, function(sub_error, sub_stdout, sub_stderr){
                        if(error !== null) {
                            console.log('sub exec error: ' + error);
                        }
                    });
                }
            });

        });

    }
);
