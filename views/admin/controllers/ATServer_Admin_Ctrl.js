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

    $scope.labels = [];
    $scope.series = ['pass', 'fail'];
    $scope.data = [];

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

    $scope.monthlyPass = [];
    $scope.monthlyFail = [];
    $scope.totalPass = 0;
    $scope.totalFail = 0;

    $scope.sortData = function(){
        var _monthlyPass = [];
        var _monthlyFail = [];
        for(var i = 0; i < $scope.monthlyData.length; i++){
            var obj = $scope.monthlyData[i];
            $scope.labels.push(obj.date);
            $scope.totalPass += obj.pass;
            $scope.totalFail += obj.fail;
            _monthlyPass.push(obj.pass);
            _monthlyFail.push(obj.fail);
        }
        $scope.data.push(_monthlyPass);
        $scope.data.push(_monthlyFail);
        $scope.monthlyPass = _monthlyPass; $scope.monthlyPass.push([]);
        $scope.monthlyFail = _monthlyFail; $scope.monthlyFail.push([]);
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

    $scope.init = function(){
        var ccadminCookie = getCookie('ccadmin');
        if(ccadminCookie){
            $scope.showLogin = false;
        }
        $scope.sortData();
    };

    $scope.init();

}]);

