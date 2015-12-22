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
        { "date" : 'jan',"pass" : 65,"fail" : 32},
        { "date" : 'feb',"pass" : 43,"fail" : 21 },
        { "date" : 'mar',"pass" : 70,"fail" : 11 },
        { "date" : 'apr',"pass" : 23,"fail" : 80 },
        { "date" : 'jun',"pass" : 11,"fail" : 99},
        { "date" : 'jul',"pass" : 65,"fail" : 32},
        { "date" : 'aug',"pass" : 43,"fail" : 21 },
        { "date" : 'sep',"pass" : 70,"fail" : 11 },
        { "date" : 'oct',"pass" : 23,"fail" : 80 },
        { "date" : 'nov',"pass" : 11,"fail" : 99},
    ];

    $scope.ATTestSummary = [
        {"date" : '3 Dec 2015', "time" : '10:05am', "result" : 'pass', "id" : 'AA8765AD9FF9086FS96SF', "testTime" : 24},
        {"date" : '2 Dec 2015', "time" : '5:05pm', "result" : 'pass', "id" : 'AA8765AD9FF9086FS96SF', "testTime" : 33},
        {"date" : '2 Dec 2015', "time" : '10:05am', "result" : 'pass', "id" : 'AA8765AD9FF9086FS96SF', "testTime" : 28},
        {"date" : '1 Dec 2015', "time" : '5:05pm', "result" : 'pass', "id" : 'AA8765AD9FF9086FS96SF', "testTime" : 30},
        {"date" : '1 Dec 2015', "time" : '10:05am', "result" : 'pass', "id" : 'AA8765AD9FF9086FS96SF', "testTime" : 25},
        {"date" : '30 Nov 2015', "time" : '5:05pm', "result" : 'pass', "id" : 'AA8765AD9FF9086FS96SF', "testTime" : 40}
    ];

    $scope.monthlyPass = [
        [65,43,70,23,11,65,43,70]
    ];
    $scope.monthlyFail = [
        [32,21,11,80,99,32,21,11]
    ];

    $scope.testCompnentsSummary = [
    ];

    $scope.totalPass = 0;
    $scope.totalFail = 0;
    $scope.currentTestTime = 10.69;

    $scope.sortData = function(){
        var _monthlyPass = [];
        var _monthlyFail = [];
        for(var i = 0; i < $scope.monthlyData.length; i++){
            var obj = $scope.monthlyData[i];
            $scope.labels.push(obj.date);
            //$scope.totalPass += obj.pass;
            //$scope.totalFail += obj.fail;
            _monthlyPass.push(obj.pass);
            _monthlyFail.push(obj.fail);
        }
        $scope.data.push(_monthlyPass);
        $scope.data.push(_monthlyFail);
        $scope.monthlyPass.push(_monthlyPass);
        $scope.monthlyFail.push(_monthlyFail);
    };

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

    $scope.calculateDurationAverage = function(data){

    };

    $scope.init = function(){
        var ccadminCookie = getCookie('ccadmin');
        if(ccadminCookie){
            $scope.showLogin = false;
        }
        $scope.sortData();

        // get dashboard data
        $http.get('https://localhost/api/getDashBoardData').then(function(res){
            $scope.testCompnentsSummary = res.data;
        });

        $http.get('https://localhost/api/getDashboardTotals').then(function(res){
            $scope.totalPass = res.data.totalPassed;
            $scope.totalFail = res.data.totalFailed;
            $scope.totalScreenshots = res.data.totalScreenshots;
        });
    };

    $scope.init();

}]);

