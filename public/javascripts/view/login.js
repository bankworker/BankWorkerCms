let app = angular.module('myApp', []);
app.controller('myCtrl', function ($scope, $http) {
  $scope.model = {
    account: '',
    password: '',
    branchLogoUrl: '',
    branchBackImageStyle: {}
  };

  $scope.setBranchSetting = function(){
    let bankCode = getCookie('secmsBankCode');
    let branchCode = getCookie('secmsBranchCode');
    if(bankCode === null || branchCode === null){
      return false;
    }
    $http.get('/login/backImageSetting').then(function successCallback (response) {
      if(response.data.err){
        bootbox.alert(response.data.msg);
        return false;
      }
      if(response.data.branchInfo === null){
        return false;
      }

      if(response.data.branchInfo.branchBackImage !== ''){
        $scope.model.branchBackImageStyle = {
          "background": "url(" + response.data.branchInfo.branchBackImage + ") no-repeat center center fixed",
          "background-size": "100%"
        };
      }

      $scope.model.branchLogoUrl = response.data.branchInfo.branchLogo;

    }, function errorCallback(response) {
      bootbox.alert('网络异常，请检查网络设置');
    });
  };

  $scope.onLogin = function () {
    if($scope.model.account.length === 0 || $scope.model.password.length === 0){
      return false;
    }
    $http.post('/', {
      account: $scope.model.account,
      password: $scope.model.password
    }).then(function successCallback(response) {
      if(response.data.err){
        bootbox.alert(response.data.msg);
        return false;
      }
      if(response.data.userInfo === null){
        bootbox.alert('您输入的用户名密码不存在！');
        return false;
      }
      //记录Cookie
      setCookie('secmsUser', JSON.stringify(response.data.userInfo));
      setCookie('secmsUserID', response.data.userInfo.accountID);
      setCookie('secmsBankCode', response.data.userInfo.bankCode);
      setCookie('secmsBranchCode', response.data.userInfo.branchCode);
      location.href = '/index';
    }, function errorCallback(response) {
      bootbox.alert('网络异常，请检查网络设置');
    });
  };

  $scope.setBranchSetting();
});