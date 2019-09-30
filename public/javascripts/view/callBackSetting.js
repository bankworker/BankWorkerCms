let app = angular.module('myApp', []);
app.controller('myCtrl', function ($scope, $http) {
  $scope.model = {
    pageNumber: 1,
    totalCount: 0,
    maxPageNumber: 0,
    dataList: [],
    paginationArray: [],
    callbackID: 0,
    callbackMsg: '',
    isCallbackMsgValid: false,
    showCallbackMsgExistMessage: false,
    add: true
  };

  $scope.initPage = function () {
    $scope.loadData();
  };

  $scope.loadData = function(){
    $http.get('/callBackSetting/searchList?pageNumber=' + $scope.model.pageNumber).then(function successCallback (response) {
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

  $scope.addData = function () {
    $http.post('/callBackSetting', {
      callbackMsg: $scope.model.callbackMsg,
      loginUser: getLoginUser()
    }).then(function successCallback(response) {
      if(response.data.err){
        bootbox.alert(response.data.msg);
        return false;
      }
      $('#modal-callback').modal('hide');
      $scope.model.callbackMsg = '';
      $scope.model.pageNumber = 1;
      $scope.loadData();
    }, function errorCallback(response) {
      bootbox.alert('网络异常，请检查网络设置');
    });
  };

  $scope.changeData = function () {
    $http.put('/callBackSetting', {
      callbackID: $scope.model.callbackID,
      callbackMsg: $scope.model.callbackMsg,
      loginUser: getLoginUser()
    }).then(function successCallback(response) {
      if(response.data.err){
        bootbox.alert(response.data.msg);
        return false;
      }
      $('#modal-callback').modal('hide');
      $scope.model.callbackMsg = '';
      $scope.model.pageNumber = 1;
      $scope.loadData();
    }, function errorCallback(response) {
      bootbox.alert('网络异常，请检查网络设置');
    });
  };

  $scope.onAdd = function () {
    $scope.model.callbackID = 0;
    $scope.model.callbackMsg = '';
    $scope.model.isCallbackMsgValid = false;
    $scope.model.showCallbackMsgExistMessage = false;
    $scope.model.add = true;
    $('#modal-callback').modal('show');
  };

  $scope.onChange = function (callBackID, callBackMsg) {
    $scope.model.callbackID = callBackID;
    $scope.model.callbackMsg = callBackMsg;
    $scope.model.isCallbackMsgValid = false;
    $scope.model.showCallbackMsgExistMessage = false;
    $scope.model.add = false;
    $('#modal-callback').modal('show');
  };

  $scope.onCallBackMsgChange = function (){
    if($scope.model.callbackMsg === '' || $scope.model.callbackMsg === undefined) {
      $scope.model.isCallbackMsgValid = false;
      $scope.model.showCallbackMsgExistMessage = false;
      return false;
    }
  };

  $scope.onCallBackMsgBlur = function () {
    $scope.model.callbackMsg = $scope.model.callbackMsg.replace(/\s+/g, '');
    if($scope.model.callbackMsg === '') {
      $scope.model.isCallbackMsgValid = false;
      $scope.model.showCallbackMsgExistMessage = false;
      return false;
    }

    $http.get('/callBackSetting/exist?callbackMessage=' + $scope.model.callbackMsg).then(function successCallback (response) {
      if(response.data.err){
        bootbox.alert(response.data.msg);
        return false;
      }

      $scope.model.isCallbackMsgValid = response.data.result === 0;
      $scope.model.showCallbackMsgExistMessage = response.data.result > 0;
    }, function errorCallback(response) {
      bootbox.alert('网络异常，请检查网络设置');
    });
  };

  $scope.onSave = function(){
    if($scope.model.callbackID === 0){
      $scope.addData();
    }else{
      $scope.changeData();
    }
  };

  $scope.onDelete = function (callBackID, callBackMsg) {
    bootbox.confirm({
      message: '您确定要删除回呼类型【' + callBackMsg + '】吗？',
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
          $http.delete('/callBackSetting?callBackID=' + callBackID).then(function successCallback(response) {
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

  $scope.initPage();
});