let app = angular.module('myApp', []);
app.controller('myCtrl', function ($scope, $http) {
  $scope.model = {
    resourceList: ''
  };

  $scope.initPage = function () {
    $scope.initUploadPlugins();
  };

  $scope.initUploadPlugins = function(){
    uploadUtils.initUploadPlugin('#file-upload-logo', '/branchResource/fileUpload', ['png','jpg', 'jpeg', 'mp4'], true, function (opt,data) {
      $scope.model.resourceList = data.fileList.toString();
      $scope.addData();
    });
  };

  $scope.addData = function () {
    $http.post('/branchResource', {
      resourceList: $scope.model.resourceList,
      loginUser: getLoginUser()
    }).then(function successCallback(response) {
      if(response.data.err){
        bootbox.alert(response.data.msg);
        return false;
      }
      $('#modal-resource').modal('hide');
      location.reload();
    }, function errorCallback(response) {
      bootbox.alert('网络异常，请检查网络设置');
    });
  };

  $scope.onAdd = function () {
    $('#modal-resource').modal('show');
  };


  $scope.onDelete = function (resourceID, resourceUrl) {
    bootbox.confirm({
      message: '您确定要删除资源: ' + resourceUrl.substr(resourceUrl.lastIndexOf('/')+1) + '吗？',
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
          $http.delete('/branchResource?resourceID=' + resourceID).then(function successCallback(response) {
            if(response.data.err){
              bootbox.alert(response.data.msg);
              return false;
            }
            location.reload();
          }, function errorCallback(response) {
            bootbox.alert('网络异常，请检查网络设置');
          });
        }
      }
    });
  };

  $scope.initPage();
});