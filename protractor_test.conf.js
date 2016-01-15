/**
 * Created by kells4 on 18/12/2015.
 */
/**
 * Created by Steve Kelly on 20/05/2015
 * for AirNZ
 *
 *
 * NOTES:
 *
 * Run protractor suite tests i.e:
 * protractor protractor_test.conf --suite lff,slider
 *
 * All describes should have one word names, i.e:
 * lff or slider
 * For two words use underscore i.e:
 * flights_page_lff
 */


// returns duration in seconds
var getDuration = function(obj) {
    if (!obj._started || !obj._finished) {
        return 0;
    }
    var duration = (obj._finished - obj._started) / 1000;
    return (duration < 1) ? duration : Math.round(duration);
};

var generateRandomnId = function(){
    return Math.floor(Math.random()*900000) + 1000000;
};

var fs = require('fs');
// var Promise = require('promise');
var mkdirp = require('mkdirp');
var path = require("path");

// redis interface
var redis = require('redis');
var client = redis.createClient('6379','localhost'); //creates a new client

// Redis Configuration
client.on('connect', function() {
    console.log('redis connected');
});
// used to capture test start time
var curTestStartTime = 0;

var gasReporter = {
    suiteData : {
        startTime : 0,
        finishTime : 0
    },
    jasmineStarted: function(suiteInfo) {
        console.log('************* Running suite with ' + suiteInfo.totalSpecsDefined);
    },

    suiteStarted: function(result) {
        console.log('********* Suite started: ' + result.description + ' whose full description is: ' + result.fullName);
        curTestStartTime = new Date();
    },

    specStarted: function(result) {
        console.log('************* Spec started: ' + result.description + ' whose full description is: ' + result.fullName);
    },
    specDone: function(result) {
        var currentTime = new Date().getHours().toString() + new Date().getMinutes().toString() + new Date().getSeconds().toString()
            + new Date().getDate().toString() + new Date().getMonth().toString() + new Date().getYear().toString();
        var screenshotPath = '';
        // iterate and handle failed results
        protractor.promise.all(result.failedExpectations.map(function(failedResult){
            console.log('******** INSIDE PROMISE ***********');
                    // take screenshot
                    browser.takeScreenshot().then(function (png) {
                        console.log('taking screenshot');
                        browser.getCapabilities().then(function (capabilities) {
                            var browserName = capabilities.caps_.browserName.toUpperCase();
                            var fileName = currentTime + '.png';

                            screenshotPath = path.join(__dirname,'reports/' + browserName+'_reports/', fileName);
                            console.log('************** screenshotPath is '+screenshotPath);

                            mkdirp(path.dirname(screenshotPath), function(err) {
                                if(err) {
                                    throw new Error('Could not create directory for ' + screenshotPath);
                                }
                                var stream = fs.createWriteStream('reports/' + browserName+'_reports/' + fileName);
                                stream.write(new Buffer(png, 'base64'));
                                stream.end();
                            });
                        });
                    });
            console.log('******** END OF PROMISE ***********');
        })).then(function(res){
            // add date to result
            result['date'] = new Date().toDateString();
            result['time'] = new Date().toTimeString();
            result['id'] = result['fullName'].split(' ')[0];
            result['screenshotPath'] = screenshotPath;

            // get test time
            var duration = (new Date() - curTestStartTime) / 1000;
            result['duration'] = duration;//(duration < 1) ? duration : Math.round(duration);

            // Check keys exist
            // if not add them
            client.exists('totalPassed', function(err, reply) {
                if (reply !== 1) {
                    client.set('totalPassed',0, function (err, res) {
                        if(err){console.log(err);}
                        if(res){
                            console.log('totalPassed' + ' ' + res);
                        }
                    });
                }
            });

            client.exists('totalFailed', function(err, reply) {
                if (reply !== 1) {
                    client.set('totalFailed',0, function (err, res) {
                        if(err){console.log(err);}
                        if(res){
                            console.log('totalFailed' + ' ' + res);
                        }
                    });
                }
            });

            // increment keys
            if(result.passedExpectations && result.failedExpectations){
                // pass / fail history
                var passItem = {
                    'passes' : result.passedExpectations.length.toString(),
                    'date' : new Date().toString()
                };
                var failItem = {
                    'fails' : result.failedExpectations.length.toString(),
                    'date' : new Date().toString()
                };
                var durationItem = {
                    'duration' : duration.toString(),
                    'date' : new Date().toString()
                };

                client.multi()
                    .incrby('totalPassed',result.passedExpectations.length)
                    .incrby('totalFailed',result.failedExpectations.length)
                    .sadd(['passHistory',JSON.stringify( passItem )])
                    .sadd(['failHistory',JSON.stringify( failItem )])
                    .sadd(['testDurations',JSON.stringify( durationItem )])
                    .exec(function(err,replies){
                        if(err){
                            console.log("err="+err);
                        }
                        console.log('reply is '+replies);

                    });
            }
            // do stuff
            console.log('protractor.promise.all finished: '+JSON.stringify(result));
            var session_arr = [
                "type:suite",JSON.stringify(result)
            ];

            client.sadd(session_arr, function (err, res) {
                if(err){
                    console.log(err);
                }
                if(res){
                    console.log('added: '+res);
                }
            });
        });
    },
    suiteDone: function(result) {
        console.log('Suite: ' + JSON.stringify(result));
    },
    jasmineDone: function() {
        console.log('************* Finished suite');
    }

};

/**
 CONFIG FILE
 **/
exports.config = {
    // The address of a running selenium server.
    seleniumAddress: 'http://localhost:4444/wd/hub',
    seleniumPort: 4444,
    seleniumArgs: ['-browserTimeout=60'],
    troubleshoot: true,
    baseUrl: 'grabaseat.co.nz',

    multiCapabilities: [
        {
            'browserName': 'chrome',
            // set corp proxy here
            // set magic proxy
            proxy: {
                proxyType: 'manual',
                httpProxy: 'icecrown:3128',
                sslProxy: 'icecrown:3128'
            }
        },
        // {
        //    'browserName': 'firefox',
        //    // set corp proxy here
        //    // set magic proxy
        //    proxy: {
        //        proxyType: 'manual',
        //        httpProxy: '10.65.61.157:3128',
        //        sslProxy: '10.65.61.157:3128'
        //    }
        // },
        //{
        //    'browserName': 'internet explorer',
        //    'platform': 'ANY',
        //    'version': '11',
        //    // set corp proxy here
        //    // set magic proxy
        //    proxy: {
        //        proxyType: 'manual',
        //        httpProxy: '10.65.61.157:3128',
        //        sslProxy: '10.65.61.157:3128'
        //    }
        //}
    ],

    // Spec patterns are relative to the configuration file location passed
    // to proractor (in this example conf.js).
    // They may include glob patterns.
    suites: {
        sca : 'tests/sca/SCA_Main_Crtl_Spec.js',
        login : 'tests/header/Header_Login_Crtl_Spec.js',
        header_nav : 'tests/header/Header_Nav_Crtl_Spec.js',
        footer_nav : 'tests/footer/Footer_Main_Crtl_Spec.js',
        ad : 'tests/ad/ThirdPartyAds_Crtl_Spec.js',
        lff : 'tests/lff/LFF_Main_Crtl_Spec.js',
        slider : 'tests/slider/Slider_Main_Crtl_Spec.js',
        gld : 'tests/gld/GLD_Main_Crtl_Spec.js',
        flava: 'tests/flava/Flava_Main_Crtl_Spec.js',
    },
    //specs: ['../@static@/common/js/app/widgets/lff/e2e/LFF_Main_Crtl_Spec.js'],

    framework: 'jasmine2',

    // Options to be passed to Jasmine-node.
    jasmineNodeOpts: {
        // If true, print colors to the terminal.
        showColors: true,
        defaultTimeoutInterval: 60000,
        isVerbose: false,
        includeStackTrace: true
    },


    onPrepare: function() {
        jasmine.getEnv().addReporter(gasReporter);
    },

    onComplete: function(runner, log) {
    }
};