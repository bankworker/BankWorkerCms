let app = angular.module('myApp', []);
app.controller('myCtrl', function ($scope, $http) {

  $scope.onChange = function (staffID) {
    location.href = '/users/edit?staffID=' + staffID;
  };

  $scope.onDelete = function (staffID, staffName) {
    bootbox.confirm({
      message: '您确定要删除 ' + staffName + '的信息及帐号吗？',
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
          $http.delete('/users?staffID=' + staffID).then(function successCallback(response) {
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
});