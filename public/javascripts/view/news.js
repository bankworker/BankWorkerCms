let app = angular.module('myApp', []);
app.controller('myCtrl', function ($scope, $http) {

  $scope.onShow = function(newsTitle, newsContent){
    bootbox.dialog({
      title: newsTitle,
      message: newsContent,
      buttons: {
        Cancel: {
          label: "关闭",
          className: "btn-default"
        }
      }
    });
  };

  $scope.onChange = function (newsID) {
    location.href = '/news/edit?newsID=' + newsID;
  };

  $scope.onDelete = function (newsID, newsTitle) {
    bootbox.confirm({
      message: '您确定要删除新闻: ' + newsTitle + '吗？',
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
          $http.delete('/news?newsID=' + newsID).then(function successCallback(response) {
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