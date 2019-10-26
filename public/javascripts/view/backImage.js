let app = angular.module('myApp', []);
app.controller('myCtrl', function ($scope, $http) {
  $scope.model = {
    branchBackImage: '',
  };

  $scope.initPage = function () {
    $scope.initUploadPlugins();
    $scope.loadData();
  };

  $scope.initUploadPlugins = function(){
    $http.get('/common/serviceSetting').then(function successCallback (response) {
      if(response.data.err){
        bootbox.alert('无法获取上传地址，请稍后再试。');
        return false;
      }
      if(response.data.serviceSetting === null){
        bootbox.alert('未设置上传地址，请联系管理员设置上传地址。');
        return false;
      }
      let fileServerUrl = response.data.serviceSetting.serverFileUploadUrl;
      let bankCode = getCookie('secmsBankCode');
      let branchCode = getCookie('secmsBranchCode');
      let dirName = 'BackImage';
      let uploadServerUrl = `${fileServerUrl}?bankCode=${bankCode}&branchCode=${branchCode}&dirName=${dirName}`;
      uploadUtils.initUploadPlugin('#file-upload-logo', uploadServerUrl, ['png','jpg', 'jpeg'], false, function (opt,data) {
        $scope.model.branchBackImage = data.fileUrlList[0];
        $scope.$apply();
        $scope.changeData();
        $('#modal-back-image').modal('hide');
      });

    }, function errorCallback(response) {
      bootbox.alert('网络异常，请检查网络设置');
    });
  };

  $scope.onShowDialog = function () {
    $('#modal-back-image').modal('show');
  };


  $scope.loadData = function(){
    $http.get('/backImage/detail').then(function successCallback (response) {
      if(response.data.err){
        bootbox.alert(response.data.msg);
        return false;
      }
      if(response.data.branchInfo === null){
        return false;
      }
      $scope.model.branchBackImage = response.data.branchInfo.branchBackImage;
    }, function errorCallback(response) {
      bootbox.alert('网络异常，请检查网络设置');
    });
  };

  $scope.changeData = function () {
    $http.put('/backImage', {
      branchBackImage: $scope.model.branchBackImage,
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