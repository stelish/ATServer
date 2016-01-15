/**
 * Created by kells4 on 2/11/2015.
 */

var createCookie = function(name, value, days) {
    var expires;
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    }
    else {
        expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
};

function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = document.cookie.length;
            }
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
}

app.controller('AdminCtrl',['$scope','$http','$filter',function($scope,$http,$filter){

    // chart options
    $scope.heroOptions = {
        animation: false,
        showScale: false,
        showTooltips: true,
        pointDot: true,
        datasetStrokeWidth: 0.5,
        bezierCurve : true,
        bezierCurveTension : 0.2,
        datasetFill: true
    };

    $scope.dashOptions = {
        animation: false,
        showScale: false,
        showTooltips: false,
        pointDot: false,
        datasetStrokeWidth: 1,
        bezierCurve : true,
        bezierCurveTension : 0.2,
        datasetFill: false
    };

    $scope.largeDashboardColours = [
        '#FF6F00', // orange
        '#BDBDBD', // light grey
        '#E91E63', // pink
        '#8BC34A', // green
        '#29B6F6', // blue
        '#26A69A', // teal
        '#8D6E63',  // brown
        '#FF7043'  // deep orange
    ];

    $scope.dashboardColours = [
        '#FFFFFF',
        '#FFFFFF',
        '#FFFFFF',
        '#FFFFFF',
        '#FFFFFF',
        '#FFFFFF',
        '#FFFFFF'
    ];

    $scope.labels = [];
    $scope.series = ['pass', 'fail'];
    $scope.durationSeries = ['duration'];
    $scope.durationLabels = [];
    $scope.durationData = [
    ];
    $scope.data = [];

    $scope.server = {};

    $scope.autointervals = [
        {'name' : 'disabled', 'value' : '0'},
        {'name' : '30min', 'value' : '30'},
        {'name' : '1hr', 'value' : '60'},
        {'name' : '1hr 30min', 'value' : '90'},
        {'name' : '2hr', 'value' : '120'},
        {'name' : '2hr 30min', 'value' : '150'},
        {'name' : '3hr', 'value' : '180'},
        {'name' : '3hr 30min', 'value' : '210'},
        {'name' : '4hr', 'value' : '240'},
        {'name' : '4hr 30min', 'value' : '270'},
        {'name' : '5hr', 'value' : '300'},
        {'name' : '5hr 30min', 'value' : '330'},
        {'name' : '6hr', 'value' : '360'},
        {'name' : '6hr 30min', 'value' : '390'},
        {'name' : '7hr', 'value' : '420'},
        {'name' : '7hr 30min', 'value' : '450'},
        {'name' : '8hr', 'value' : '480'}
    ];

    $scope.monthlyData = [
    ];

    $scope.ATTestSummary = [
        {"date" : '3 Dec 2015', "time" : '10:05am', "result" : 'pass', "id" : 'AA8765AD9FF9086FS96SF', "testTime" : 24},
        {"date" : '2 Dec 2015', "time" : '5:05pm', "result" : 'pass', "id" : 'AA8765AD9FF9086FS96SF', "testTime" : 33},
        {"date" : '2 Dec 2015', "time" : '10:05am', "result" : 'pass', "id" : 'AA8765AD9FF9086FS96SF', "testTime" : 28},
        {"date" : '1 Dec 2015', "time" : '5:05pm', "result" : 'pass', "id" : 'AA8765AD9FF9086FS96SF', "testTime" : 30},
        {"date" : '1 Dec 2015', "time" : '10:05am', "result" : 'pass', "id" : 'AA8765AD9FF9086FS96SF', "testTime" : 25},
        {"date" : '30 Nov 2015', "time" : '5:05pm', "result" : 'pass', "id" : 'AA8765AD9FF9086FS96SF', "testTime" : 40}
    ];

    $scope.totalPassData = [
    ];
    $scope.totalFailData = [
    ];

    $scope.testCompnentsSummary = [
    ];

    $scope.totalPass = 0;
    $scope.totalFail = 0;
    $scope.currentTestTime = 10.69;

    $scope.onClick = function (points, evt) {
        console.log(points, evt);
    };

    $scope.login = function(){
        if($scope.auth.username == $scope.sec[0]){
            if($scope.auth.password == $scope.sec[1]){
                $scope.showLogin = false;
                createCookie('ccadmin',true,1);
            }else{
                $scope.invalidCredentials = true;
            }
        } else {
            $scope.invalidCredentials = true;
        }
    };

    // clears model data on refresh
    $scope.clearModels = function(){
        $scope.data.length = 0;
        $scope.totalPassData.length = 0;
        $scope.totalFailData.length = 0;

        // clear duration data
        $scope.durationData.length = 0;
        $scope.durationLabels.length = 0;
    };

    //set Hero data
    $scope.setHeroData = function(passData,failData){
        var passes = [];
        var fails = [];
        var parsedPassData = JSON.parse(passData);
        var parsedFailData = JSON.parse(failData);
        // clear label data
        $scope.labels.length = 0;
        // set model
        for(var n=0; n < parsedPassData.length; n++){
            var passobj = JSON.parse(parsedPassData[n]);
            passes.push(passobj.passes);
            $scope.labels.push(passobj.date);
        }
        for(var i=0; i < parsedFailData.length; i++){
            var failobj = JSON.parse(parsedFailData[i]);
            fails.push(failobj.fails);
        }

        $scope.clearModels();

        $scope.data.push(passes);
        $scope.data.push(fails);
        $scope.totalPassData.push(passes);
        $scope.totalFailData.push(fails);
    };


    $scope.specificResultData = null;
    $scope.setSpecificResultData = function(result){
        $scope.specificResultData = result;
    };


    // sets duration data
    $scope.setDurationData = function(data,avg){
        $scope.currentTestTime = avg;
        var durations = JSON.parse(data);
        var durData = [];
        for(var i=0; i < durations.length; i++){
            var dur = JSON.parse(durations[i]);
            durData.push(new Number(dur.duration).toFixed(2));
            $scope.durationLabels.push(dur.date);
        }
        // add to data
        $scope.durationData.push(durData);
        console.log('sup');
    };

    $scope.getData = function(){
        // get dashboard data
        $http.get('https://localhost/api/getDashBoardData').then(function(res){
            $scope.testCompnentsSummary = res.data;
        });

        // get totals
        $http.get('https://localhost/api/getDashboardTotals').then(function(res){
            $scope.totalPass = res.data.totalPassed;
            $scope.totalFail = res.data.totalFailed;
            $scope.totalScreenshots = res.data.totalScreenshots;
            $scope.setHeroData(res.data.passHistory,res.data.failHistory);
            $scope.setDurationData(res.data.durationHistory,res.data.durationAverage);
        });
    };

    $scope.init = function(){
        $scope.getData();
        var ccadminCookie = getCookie('ccadmin');
        if(ccadminCookie){
            $scope.showLogin = false;
        }

        setInterval($scope.getData,30000);
    };

    $scope.init();

}]);

