let app = angular.module('myApp', []);
app.controller('myCtrl', function ($scope, $http) {
  $scope.model = {
    branchName: '',
    isArchiveEnabled: false,
    isWorkBalanceEnabled: false,
    isMediaModuleEnabled: false
  };

  $scope.initPage = function () {
    $scope.setBranchName();
    $scope.setFunctionEnable();
  };

  $scope.setBranchName = function(){
    let cookie = getCookie('secmsUser');
    if(cookie !== null){
      let loginUser = JSON.parse(cookie);
      $scope.model.branchName = loginUser.branchName;
    }
  };

  $scope.setFunctionEnable = function(){
    let accountID = getLoginUserInfo().accountID;
    if(accountID === undefined){
      return false;
    }
    $http.get('/users/authorizedSystem?accountID='+accountID).then(function successCallback (response) {
      if(response.data.err){
        bootbox.alert(response.data.msg);
        return false;
      }
      if(response.data.dataList === null || response.data.dataList.length === 0){
        return false;
      }

      angular.forEach(response.data.dataList, function (authorizedSystem) {
        if(authorizedSystem.systemID === 1){
          $scope.model.isArchiveEnabled = true;
        }
        if(authorizedSystem.systemID === 2){
          $scope.model.isWorkBalanceEnabled = true;
        }
        if(authorizedSystem.systemID === 3){
          $scope.model.isMediaModuleEnabled = true;
        }
      });

    }, function errorCallback(response) {
      bootbox.alert('网络异常，请检查网络设置');
    });
  };

  $scope.initPage();
});