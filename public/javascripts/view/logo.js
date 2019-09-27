let app = angular.module('myApp', []);
app.controller('myCtrl', function ($scope, $http) {
  $scope.model = {
    bankBranchLogo: '',
  };

  $scope.initPage = function () {
    $scope.initUploadPlugins();
    $scope.loadData();
  };

  $scope.initUploadPlugins = function(){
    uploadUtils.initUploadPlugin('#file-upload-logo', '/common/fileUpload', ['png','jpg', 'jpeg'], false, function (opt,data) {
      $scope.model.bankBranchLogo = data.fileUrlList[0];
      $scope.$apply();
      $scope.changeData();
      $('#modal-system-logo').modal('hide');
    });
  };

  $scope.onShowUploadLogo = function () {
    $('#modal-system-logo').modal('show');
  };


  $scope.loadData = function(){
    $http.get('/logo/detail').then(function successCallback (response) {
      if(response.data.err){
        bootbox.alert(response.data.msg);
        return false;
      }
      if(response.data.branchInfo === null){
        return false;
      }
      $scope.model.bankBranchLogo = response.data.branchInfo.branchLogo;
    }, function errorCallback(response) {
      bootbox.alert('网络异常，请检查网络设置');
    });
  };

  $scope.changeData = function () {
    $http.put('/logo', {
      branchLogo: $scope.model.bankBranchLogo,
      loginUser: getLoginUser()
    }).then(function successCallback(response) {
      if(response.data.err){
        bootbox.alert(response.data.msg);
        return false;
      }
    }, function errorCallback(response) {
      bootbox.alert('网络异常，请检查网络设置');
    });
  };

  $scope.initPage();
});