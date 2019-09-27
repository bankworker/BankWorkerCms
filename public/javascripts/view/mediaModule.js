let app = angular.module('myApp', []);
app.controller('myCtrl', function ($scope, $http) {
  $scope.model = {
    pageNumber: 1,
    totalCount: 0,
    maxPageNumber: 0,
    dataList: [],
    paginationArray: []
  };

  $scope.onLoadData = function(){
    $http.get('/mediaModule/searchList?pageNumber=' + $scope.model.pageNumber).then(function successCallback (response) {
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
    $scope.onLoadData();
  };

  $scope.onPagination = function(pageNumber){
    $scope.model.pageNumber = pageNumber;
    $scope.onLoadData();
  };

  $scope.onNextPage = function(){
    $scope.model.pageNumber++;
    $scope.onLoadData();
  };

  $scope.changeStatus = function(mediaModuleID, dataStatus){
    $http.put('/mediaModule/changeStatus', {
      mediaModuleID: mediaModuleID,
      dataStatus: dataStatus,
      loginUser: getLoginUser()
    }).then(function successCallback(response) {
      if(response.data.err){
        bootbox.alert(response.data.msg);
        return false;
      }
      $scope.onLoadData();
    }, function errorCallback(response) {
      bootbox.alert('网络异常，请检查网络设置');
    });
  };

  $scope.onAddImage = function(){
    location.href = '/mediaModule/edit/image';
  };

  $scope.onAddVideo = function(){
    location.href = '/mediaModule/edit/video';
  };

  $scope.onEdit = function(mediaModuleID, mediaModuleType){
    if(mediaModuleType === 'I'){
      location.href = '/mediaModule/edit/image?mediaModuleID=' + mediaModuleID;
    }else{
      location.href = '/mediaModule/edit/video?mediaModuleID=' + mediaModuleID;
    }
  };

  $scope.onActive = function (mediaModuleID) {
    $scope.changeStatus(mediaModuleID, 'A');
  };

  $scope.onDisabled = function (mediaModuleID) {
    $scope.changeStatus(mediaModuleID, 'D');
  };

  $scope.onLoadData();
});