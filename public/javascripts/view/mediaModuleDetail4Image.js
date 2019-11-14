let app = angular.module('myApp', []);
app.controller('myCtrl', function ($scope, $http) {
  $scope.model = {
    mediaModuleID: 0,
    mediaModuleTitle: '',
    mediaModuleImageList: [],
    mediaModuleAudioUrl: '',
    mediaModuleMemo: '',
    add: true
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
      let uploadImageServerUrl = buildUploadRemoteUri(response.data.serviceSetting.serverFileUploadUrl, 'mediaImage');
      let uploadAudioServerUrl = buildUploadRemoteUri(response.data.serviceSetting.serverFileUploadUrl, 'mediaAudio');

      uploadUtils.initUploadPlugin('#file-upload-image', uploadImageServerUrl, ['png','jpg', 'jpeg'], true, function (opt,data) {
        angular.forEach(data.fileUrlList, function (fileUrl) {
          $scope.model.mediaModuleImageList.push({
            mediaDetailID: 0,
            mediaDetailName: fileUrl.substr(fileUrl.lastIndexOf('/')+1),
            mediaDetailContent: fileUrl
          });
        });
        $scope.$apply();
        $('#image-upload-modal').modal('hide');
      });

      uploadUtils.initUploadPlugin('#file-upload-audio', uploadAudioServerUrl, ['mp3'], false, function (opt,data) {
        $scope.model.mediaModuleAudioUrl = data.fileUrlList[0];
        $scope.$apply();
        $('#audio-upload-modal').modal('hide');
      });
    }, function errorCallback(response) {
      bootbox.alert('网络异常，请检查网络设置');
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

      angular.forEach(response.data.dataDetail.mediaModuleDetailList, function (detail) {
        if(detail.mediaDetailType === 'I'){
          $scope.model.mediaModuleImageList.push({
            mediaDetailID: detail.mediaDetailID,
            mediaDetailName: detail.mediaDetailContent.substr(detail.mediaDetailContent.lastIndexOf('/')+1),
            mediaDetailContent: detail.mediaDetailContent
          });
        }
        if(detail.mediaDetailType === 'A'){
          $scope.model.mediaModuleAudioUrl = detail.mediaDetailContent;
        }
        if(detail.mediaDetailType === 'T'){
          $scope.model.mediaModuleMemo = detail.mediaDetailContent;
        }
      });
      $scope.model.add = false;
    }, function errorCallback(response) {
      bootbox.alert('网络异常，请检查网络设置');
    });
  };

  $scope.getDetailJson = function(){
    let detailArray = [];
    //1、图片列表
    angular.forEach($scope.model.mediaModuleImageList, function (image) {
      detailArray.push({
        mediaDetailID: 0,
        bankCode: document.getElementById('hidden_bankCode').value,
        branchCode: document.getElementById('hidden_branchCode').value,
        mediaModuleID: document.getElementById('hidden_mediaModuleID').value,
        mediaDetailType: 'I',
        mediaDetailContent: image.mediaDetailContent
      });
    });
    //2、背景音乐
    detailArray.push({
      mediaDetailID: 0,
      bankCode: document.getElementById('hidden_bankCode').value,
      branchCode: document.getElementById('hidden_branchCode').value,
      mediaModuleID: document.getElementById('hidden_mediaModuleID').value,
      mediaDetailType: 'A',
      mediaDetailContent: $scope.model.mediaModuleAudioUrl
    });

    //3、说明文字
    detailArray.push({
      mediaDetailID: 0,
      bankCode: document.getElementById('hidden_bankCode').value,
      branchCode: document.getElementById('hidden_branchCode').value,
      mediaModuleID: document.getElementById('hidden_mediaModuleID').value,
      mediaDetailType: 'T',
      mediaDetailContent: $scope.model.mediaModuleMemo
    });
    return JSON.stringify(detailArray);
  };

  $scope.addData = function () {
    $http.post('/mediaModule', {
      mediaModuleName: $scope.model.mediaModuleTitle,
      mediaModuleType: 'I',
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
      mediaModuleType: 'I',
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

  $scope.onShowUploadImageDialog = function () {
    $('#image-upload-modal').modal('show');
  };

  $scope.onShowUploadAudioDialog = function () {
    $('#audio-upload-modal').modal('show');
  };

  $scope.onRemove = function(index){
    $scope.model.mediaModuleImageList.splice(index,1);
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