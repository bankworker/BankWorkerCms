let app = angular.module('myApp', []);
app.controller('myCtrl', function ($scope, $http) {
  $scope.model = {
    mediaDetailID: 0,
    mediaModuleID: 0,
    mediaModuleTitle: '',
    mediaModuleVideoUrl: '',
    add: true
  };

  $scope.initPage = function () {
    $scope.initUploadPlugins();
    $scope.loadData();
  };

  $scope.initUploadPlugins = function(){
    uploadUtils.initUploadPlugin('#file-upload-video', '/common/fileUpload', ['mp4','MP4', 'webm'], false, function (opt,data) {
      $scope.model.mediaModuleVideoUrl = data.fileUrlList[0];
      $scope.$apply();
      $('#video-upload-modal').modal('hide');
    });
  };

  $scope.loadData = function(){
    let mediaModuleID = document.getElementById('hidden_mediaModuleID').value;
    if(mediaModuleID === ''){
      return false;
    }
    $http.get('/mediaModule/search?mediaModuleID=' + mediaModuleID).then(function successCallback (response) {
      if(response.data.err){
        bootbox.alert(response.data.msg);
        return false;
      }
      if(response.data.dataDetail === null){
        return false;
      }

      $scope.model.mediaModuleID = response.data.dataDetail.mediaModuleID;
      $scope.model.mediaModuleTitle = response.data.dataDetail.mediaModuleName;
      $scope.model.mediaModuleVideoUrl = response.data.dataDetail.mediaModuleDetailList[0].mediaDetailContent;
      $scope.model.mediaDetailID = response.data.dataDetail.mediaModuleDetailList[0].mediaDetailID;
      $scope.model.add = false;
    }, function errorCallback(response) {
      bootbox.alert('网络异常，请检查网络设置');
    });
  };

  $scope.getDetailJson = function(){
    let detailArray = [];
    let detailContent = {};
    detailContent.mediaDetailID = $scope.model.mediaDetailID;
    detailContent.bankCode = document.getElementById('hidden_bankCode').value;
    detailContent.branchCode = document.getElementById('hidden_branchCode').value;
    detailContent.mediaModuleID = document.getElementById('hidden_mediaModuleID').value;
    detailContent.mediaDetailType = 'V';
    detailContent.mediaDetailContent = $scope.model.mediaModuleVideoUrl;
    detailArray.push(detailContent);
    return JSON.stringify(detailArray);
  };

  $scope.addData = function () {
    $http.post('/mediaModule', {
      mediaModuleName: $scope.model.mediaModuleTitle,
      mediaModuleType: 'V',
      detailJson: $scope.getDetailJson(),
      loginUser: getLoginUser()
    }).then(function successCallback(response) {
      if(response.data.err){
        bootbox.alert(response.data.msg);
        return false;
      }
      location.href = '/mediaModule';
    }, function errorCallback(response) {
      bootbox.alert('网络异常，请检查网络设置');
    });
  };

  $scope.changeData = function () {
    $http.put('/mediaModule', {
      mediaModuleID: $scope.model.mediaModuleID,
      mediaModuleName: $scope.model.mediaModuleTitle,
      mediaModuleType: 'V',
      detailJson: $scope.getDetailJson(),
      loginUser: getLoginUser()
    }).then(function successCallback(response) {
      if(response.data.err){
        bootbox.alert(response.data.msg);
        return false;
      }
      location.href = '/mediaModule';
    }, function errorCallback(response) {
      bootbox.alert('网络异常，请检查网络设置');
    });
  };

  $scope.onShowUploadVideoDialog = function () {
    $('#video-upload-modal').modal('show');
  };

  $scope.onSave = function(){
    if($scope.model.mediaModuleID === 0){
      $scope.addData();
    }else{
      $scope.changeData();
    }
  };

  $scope.onDelete = function () {
    bootbox.confirm({
      message: '您确定要删除该媒体资源吗？',
      buttons: {
        confirm: {
          label: '确认',
          className: 'btn-danger'
        },
        cancel: {
          label: '取消',
          className: 'btn-default'
        }
      },
      callback: function (result) {
        if(result) {
          $http.delete('/mediaModule?mediaModuleID=' + $scope.model.mediaModuleID).then(function successCallback(response) {
            if(response.data.err){
              bootbox.alert(response.data.msg);
              return false;
            }
            location.href = '/mediaModule';
          }, function errorCallback(response) {
            bootbox.alert('网络异常，请检查网络设置');
          });
        }
      }
    });
  };

  $scope.initPage();
});