let app = angular.module('myApp', []);
app.controller('myCtrl', function ($scope, $http) {
  $scope.model = {
    pageNumber: 1,
    totalCount: 0,
    maxPageNumber: 0,
    dataList: [],
    paginationArray: [],
    staffPostID: 0,
    staffPostName: '',
    isStaffPostValid: false,
    showStaffPostExistMessage: false,
    add: true
  };

  $scope.loadData = function(){
    $http.get('/staffPost/searchList?pageNumber=' + $scope.model.pageNumber).then(function successCallback (response) {
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

  $scope.onAdd = function () {
    $scope.model.staffPostID = 0;
    $scope.model.staffPostName = '';
    $scope.model.add = true;
    $('#edit-dialog').modal('show');
  };

  $scope.onChange = function (staffPostID, staffPostName) {
    $scope.model.staffPostID = staffPostID;
    $scope.model.staffPostName = staffPostName;
    $scope.model.add = false;
    $('#edit-dialog').modal('show');
  };

  $scope.onStaffPostChange = function (){
    if($scope.model.staffPostName === '' || $scope.model.staffPostName === undefined) {
      $scope.model.isStaffPostValid = false;
      $scope.model.showStaffPostExistMessage = false;
      return false;
    }
  };

  $scope.onStaffPostBlur = function () {
    if($scope.model.staffPostName === '' || $scope.model.staffPostName === undefined) {
      $scope.model.isStaffPostValid = false;
      $scope.model.showStaffPostExistMessage = false;
      return false;
    }

    $scope.model.staffPostName = $scope.model.staffPostName.replace(/\s+/g, '');
    if($scope.model.staffPostName === ''){
      $scope.model.isStaffPostValid = false;
      $scope.model.showStaffPostExistMessage = false;
      return false;
    }

    $http.get('/staffPost/exist?staffPostName=' + $scope.model.staffPostName).then(function successCallback (response) {
      if(response.data.err){
        bootbox.alert(response.data.msg);
        return false;
      }

      $scope.model.isStaffPostValid = response.data.result === 0;
      $scope.model.showStaffPostExistMessage = response.data.result > 0;
    }, function errorCallback(response) {
      bootbox.alert('网络异常，请检查网络设置');
    });
  };

  $scope.addData = function() {
    $http.post('/staffPost', {
      staffPostName: $scope.model.staffPostName,
      loginUser: getLoginUser()
    }).then(function successCallback(response) {
      if(response.data.err){
        bootbox.alert(response.data.msg);
        return false;
      }
      $('#edit-dialog').modal('hide');
      $scope.loadData();
    }, function errorCallback(response) {
      bootbox.alert('网络异常，请检查网络设置');
    });
  };

  $scope.changeData = function() {
    $http.put('/staffPost', {
      staffPostID: $scope.model.staffPostID,
      staffPostName: $scope.model.staffPostName,
      loginUser: getLoginUser()
    }).then(function successCallback(response) {
      if(response.data.err){
        bootbox.alert(response.data.msg);
        return false;
      }
      $('#edit-dialog').modal('hide');
      $scope.loadData();
    }, function errorCallback(response) {
      bootbox.alert('网络异常，请检查网络设置');
    });
  };

  $scope.onSubmit = function(){
    if($scope.model.add){
      $scope.addData();
    }else{
      $scope.changeData();
    }
  };

  $scope.onDelete = function (staffPostID, staffPostName) {
    $http.get('/staffPost/isUsing?staffPostID=' + staffPostID).then(function successCallback (response) {
      if(response.data.err){
        bootbox.alert(response.data.msg);
        return false;
      }
      if(response.data.isUsing){
        bootbox.alert(staffPostName + '正在使用中，不能删除。');
        return false;
      }
      bootbox.confirm({
        message: '您确定要删除岗位: ' + staffPostName + '吗？',
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
            $http.delete('/staffPost?staffPostID=' + staffPostID).then(function successCallback(response) {
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
    }, function errorCallback(response) {
      bootbox.alert('网络异常，请检查网络设置');
    });
  };

  $scope.loadData();
});