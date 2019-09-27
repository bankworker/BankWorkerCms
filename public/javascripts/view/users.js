let app = angular.module('myApp', []);
app.controller('myCtrl', function ($scope, $http) {
  $scope.model = {
    pageNumber: 1,
    totalCount: 0,
    maxPageNumber: 0,
    dataList: [],
    paginationArray: []
  };

  $scope.loadData = function() {
    $http.get('/users/searchList?pageNumber=' + $scope.model.pageNumber).then(function successCallback (response) {
      if(response.data.err){
        bootbox.alert(response.data.msg);
        return false;
      }
      if(response.data.dataContent === null){
        return false;
      }

      if(response.data.dataContent.dataList !== null && response.data.dataContent.dataList.length === 0 && $scope.model.pageNumber > 1){
        $scope.model.pageNumber--;
        $scope.loadData();
        return false;
      }
      $scope.model.totalCount = response.data.dataContent.totalCount;
      $scope.model.dataList = response.data.dataContent.dataList;
      $scope.model.pageNumber = response.data.dataContent.currentPageNum;
      $scope.model.maxPageNumber = Math.ceil(response.data.dataContent.totalCount / response.data.dataContent.pageSize);
      $scope.model.paginationArray = response.data.dataContent.paginationArray;
      if(response.data.dataContent.prePageNum !== undefined){
        $scope.model.prePageNum = response.data.dataContent.prePageNum;
      }
      if(response.data.dataContent.nextPageNum !== undefined){
        $scope.model.nextPageNum = response.data.dataContent.nextPageNum;
      }
    }, function errorCallback(response) {
      bootbox.alert('网络异常，请检查网络设置');
    });
  };

  $scope.onPrePage = function(){
    $scope.model.pageNumber--;
    $scope.loadData();
  };

  $scope.onPagination = function(pageNumber){
    $scope.model.pageNumber = pageNumber;
    $scope.loadData();
  };

  $scope.onNextPage = function(){
    $scope.model.pageNumber++;
    $scope.loadData();
  };

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
            $scope.loadData();
          }, function errorCallback(response) {
            bootbox.alert('网络异常，请检查网络设置');
          });
        }
      }
    });
  };

  $scope.loadData();
});