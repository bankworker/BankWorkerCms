let app = angular.module('myApp', []);
app.controller('myCtrl', function ($scope, $http) {
  $scope.model = {
    accountID: '',
    account: '',
    password: '',
    newPassword: '',
    confirmPassword: '',
  };

  $scope.initPage = function () {
    $scope.model.accountID = getLoginUserInfo().accountID;
    $scope.model.account = getLoginUser();
  };

  $scope.onChangePassword = function(){
    $http.post('/', {
      account: $scope.model.account,
      password: $scope.model.password
    }).then(function successCallback(response) {
      if(response.data.err){
        bootbox.alert(response.data.msg);
        return false;
      }
      if(response.data.userInfo === null){
        bootbox.alert('您输入的旧密码不正确，请重新输入。');
        return false;
      }

      $http.put('/changePassword', {
        accountID: $scope.model.accountID,
        password: $scope.model.newPassword,
        loginUser: getLoginUser()
      }).then(function successCallback(response) {
        if(response.data.err){
          bootbox.alert(response.data.msg);
          return false;
        }
        $scope.model.password = '';
        $scope.model.newPassword = '';
        $scope.model.confirmPassword = '';
        bootbox.alert('密码修改成功！');
      }, function errorCallback(response) {
        bootbox.alert('网络异常，请检查网络设置');
      });
    }, function errorCallback(response) {
      bootbox.alert('网络异常，请检查网络设置');
    });
  };

  $scope.initPage();
});