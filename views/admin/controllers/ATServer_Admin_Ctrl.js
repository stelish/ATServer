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

    $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
    $scope.series = ['Series A', 'Series B'];
    $scope.data = [
        [65, 59, 80, 81, 56, 55, 40],
        [28, 48, 40, 19, 86, 27, 90]
    ];

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
    };

    $scope.init();

}]);

