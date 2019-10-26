let app = angular.module('myApp', []);
app.controller('myCtrl', function ($scope, $http) {
  $scope.model = {
    pageNumber: 1,
    totalCount: 0,
    maxPageNumber: 0,
    dataList: [],
    paginationArray: [],
    resourceList: ''
  };

  $scope.initPage = function () {
    $scope.loadData();
    $scope.initUploadPlugins();
  };

  $scope.loadData = function(){
    $http.get('/branchResource/searchList?pageNumber=' + $scope.model.pageNumber).then(function successCallback (response) {
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
      let companyFileServerUrl = `${fileServerUrl}?bankCode=${bankCode}&branchCode=${branchCode}&dirName=newsResource`;
      uploadUtils.initUploadPlugin('#file-upload-logo', companyFileServerUrl, ['png','jpg', 'jpeg', 'mp4'], true, function (opt,data) {
        $scope.model.resourceList = data.fileUrlList.toString();
        $scope.addData();
      });

    }, function errorCallback(response) {
      bootbox.alert('网络异常，请检查网络设置');
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
      $scope.model.pageNumber = 1;
      $scope.loadData();
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