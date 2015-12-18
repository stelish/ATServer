/**
 * Created by kells4 on 18/12/2015.
 */
/**
 * Created by Steve Kelly on 20/05/2015
 * for AirNZ
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

var gasReporter = {
    jasmineStarted: function(suiteInfo) {
        console.log('Running suite with ' + suiteInfo.totalSpecsDefined);
    },

    suiteStarted: function(result) {
        console.log('Suite started: ' + result.description + ' whose full description is: ' + result.fullName);
    },

    specStarted: function(result) {
        console.log('Spec started: ' + result.description + ' whose full description is: ' + result.fullName);
    },
    specDone: function(result) {
        if(result.status !== 'passed'){
            // take screenshot
            browser.takeScreenshot().then(function (png) {
                browser.getCapabilities().then(function (capabilities) {
                    var browserName = caps.caps_.browserName.toUpperCase();
                    var screenshotPath = path.join('reports/' + browserName+'_reports', spec.filename);
                    console.log('screenshotPath is '+screenshotPath);

                    mkdirp(path.dirname(screenshotPath), function(err) {
                        if(err) {
                            throw new Error('Could not create directory for ' + screenshotPath);
                        }
                        var stream = fs.createWriteStream('reports/' + browserName+'_reports' + spec.filename);
                        stream.write(new Buffer(png, 'base64'));
                        stream.end();
                    });
                });
            });
        }
        console.log('Spec: ' + result.description + ' was ' + result.status);
        for(var i = 0; i < result.failedExpectations.length; i++) {
            console.log('Failure: ' + result.failedExpectations[i].message);
            console.log(result.failedExpectations[i].stack);
        }
        console.log('result.passedExpectations: '+result.passedExpectations.length);

    },
    suiteDone: function(result) {
        console.log('Suite: ' + result.description + ' was ' + result.status);
        for(var i = 0; i < result.failedExpectations.length; i++) {
            console.log('AfterAll ' + result.failedExpectations[i].message);
            console.log(result.failedExpectations[i].stack);
        }
    },
    jasmineDone: function() {
        console.log('Finished suite');
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
    //directConnect: true,
    //chromeOnly: true,
    //chromeDriver: 'C:\Users\kells4.ISIS\AppData\Roaming\npm\node_modules\protractor\selenium\chromedriver',

    baseUrl: 'grabaseat.co.nz',

    multiCapabilities: [
        {
            'browserName': 'chrome',
            // set corp proxy here
            // set magic proxy
            proxy: {
                proxyType: 'manual',
                httpProxy: '10.65.61.156:3128',
                sslProxy: '10.65.61.156:3128'
            }
        },
        // {
        //    'browserName': 'firefox',
        //    // set corp proxy here
        //    // set magic proxy
        //    proxy: {
        //        proxyType: 'manual',
        //        httpProxy: '10.65.61.156:3128',
        //        sslProxy: '10.65.61.156:3128'
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
    specs: ['tests/LFF_Main_Crtl_Spec.js'],
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
        // jasmine.getEnv().addReporter(new HtmlScreenshotReporter({
        //    dest: 'reports/' + browserName+'_reports',
        //    filename: browserName+'_report.html',
        //    reportOnlyFailedSpecs: true,
        // 			   captureOnlyFailedSpecs: true,
        // 			   metadataBuilder: function(currentSpec, suites, browserCapabilities) {
        // 			   		console.log('************************************');
        // 			   		console.log('inside metadataBuilder');
        // 			   		console.log('************************************');
        //    					//return { id: currentSpec.id, os: browserCapabilities.get('browserName') };
        // 			   }
        //   }));
        //  	});
    },

    onComplete: function(runner, log) {
        // console.log('*** 1. PREPARING TO SEND EMAIL ***');
        // browser.driver.getSession().then(function(session) {

        //    			console.log("SauceOnDemandSessionID=" + session.getId() + " job-name=Web - My Account - Address Update");
        //  		});
        //       var htmlContent = null;
        //       var proceed = true;
        //       var browserName = '';
        //       var browserVersion = '';

        //       // get capabilites
        //  		var browserPromise = browser.getCapabilities();

        //  		browserPromise.then( function(caps){

        //   		browserName = caps.caps_.browserName.toUpperCase();
        //           browserVersion = caps.caps_.version;

        //           var reportDir = 'reports/' + browserName + '_reports';

        //           // get html content for email
        //           htmlContent = retrieveHMTLContent('reports/' + browserName+'_reports/' + browserName+'_report.html');

        //           // zip up report
        //           //zipUpReport(reportDir,browserName);

        //     // timeout due to delay in processing fs and easyzip
        //     setTimeout(function() {
        //     	//emailReport(htmlContent, browserName, browserVersion);
        //     	//cleanupFolders(browserName);
        //     },2000);

        //      	});
    }
};