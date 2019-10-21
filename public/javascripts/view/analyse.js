let app = angular.module('myApp', []);
app.controller('myCtrl', function ($scope, $http) {
  $scope.model = {
    fromDate: '',
    toDate: '',
    financialBusinessAnalyse: [],
    financialCallbackAnalyse: [],
    lobbyBusinessAnalyse: [],
    lobbyCallbackAnalyse: [],
    currentSelectedFinancialIndex: 0,
    currentSelectedLobbyIndex: 0
  };

  $scope.onAnalyse = function () {
    $scope.getFinancialBusinessAnalyse();
    $scope.getLobbyBusinessAnalyse();
  };

  $scope.getFinancialBusinessAnalyse = function(){
    $http.get('/analyse/financialBusinessAnalyse?fromDate=' + $scope.model.fromDate + '&toDate=' + $scope.model.toDate).then(function successCallback (response) {
      if(response.data.err){
        bootbox.alert('服务器处理异常，请稍后再试');
        return false;
      }
      if(response.data.dataList === null){
        $scope.model.financialBusinessAnalyse.splice(0, $scope.model.financialBusinessAnalyse.length);
        $scope.model.financialCallbackAnalyse.splice(0, $scope.model.lobbyBusinessAnalyse.length);
        return false;
      }
      $scope.model.financialBusinessAnalyse = response.data.dataList;
      $scope.getFinancialCallbackAnalyse(0, response.data.dataList[0].financialID);
    }, function errorCallback(response) {
      bootbox.alert('网络异常，请检查网络设置');
    });
  };

  $scope.getLobbyBusinessAnalyse = function(){
    $http.get('/analyse/lobbyBusinessAnalyse?fromDate=' + $scope.model.fromDate + '&toDate=' + $scope.model.toDate).then(function successCallback (response) {
      if(response.data.err){
        bootbox.alert('服务器处理异常，请稍后再试');
        return false;
      }
      if(response.data.dataList === null){
        $scope.model.lobbyBusinessAnalyse.splice(0, $scope.model.lobbyBusinessAnalyse.length);
        $scope.model.lobbyCallbackAnalyse.splice(0, $scope.model.lobbyCallbackAnalyse.length);
        return false;
      }
      $scope.model.lobbyBusinessAnalyse = response.data.dataList;
      $scope.getLobbyCallbackAnalyse(0, response.data.dataList[0].lobbyID);
    }, function errorCallback(response) {
      bootbox.alert('网络异常，请检查网络设置');
    });
  };

  $scope.getFinancialCallbackAnalyse = function(index, financialID){
    $scope.model.currentSelectedFinancialIndex = index;
    $http.get('/analyse/financialCallbackAnalyse?fromDate=' + $scope.model.fromDate + '&toDate=' + $scope.model.toDate + '&financialID=' + financialID).then(function successCallback (response) {
      if(response.data.err){
        bootbox.alert('服务器处理异常，请稍后再试');
        return false;
      }
      if(response.data.dataList === null){
        $scope.model.financialCallbackAnalyse.splice(0, $scope.model.financialCallbackAnalyse.length)
        return false;
      }
      $scope.model.financialCallbackAnalyse = response.data.dataList;
    }, function errorCallback(response) {
      bootbox.alert('网络异常，请检查网络设置');
    });
  };

  $scope.getLobbyCallbackAnalyse = function(index, lobbyID){
    $scope.model.currentSelectedLobbyIndex = index;
    $http.get('/analyse/lobbyCallbackAnalyse?fromDate=' + $scope.model.fromDate + '&toDate=' + $scope.model.toDate + '&lobbyID=' + lobbyID).then(function successCallback (response) {
      if(response.data.err){
        bootbox.alert('服务器处理异常，请稍后再试');
        return false;
      }
      if(response.data.dataList === null){
        $scope.model.lobbyCallbackAnalyse.splice(0, $scope.model.lobbyCallbackAnalyse.length);
        return false;
      }
      $scope.model.lobbyCallbackAnalyse = response.data.dataList;
    }, function errorCallback(response) {
      bootbox.alert('网络异常，请检查网络设置');
    });
  };
});