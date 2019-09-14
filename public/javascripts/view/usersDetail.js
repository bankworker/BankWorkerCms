let app = angular.module('myApp', []);
app.controller('myCtrl', function ($scope, $http) {
  $scope.model = {
    staffID: 0,
    staffName: '',
    staffCellphoneOriginal: '',
    staffCellphone: '',
    staffPostID: 0,
    selectedStaffPost: null,
    staffPostList: [{staffPostID: 0, staffPostName: '请选择员工岗位'}],
    staffPhotoUrl: '/images/userPhoto.png',
    staffResumeUrl: '/images/timg.jpeg',
    isCellphoneValid: false,
    isShowCellphoneExistMessage: false,
    add: true
  };

  $scope.initPage = function () {
    $scope.initUploadPlugins();
    $scope.loadData();
  };

  $scope.loadStaffPost = function() {
    $http.get('/users/edit/staffPost').then(function successCallback (response) {
      if(response.data.err){
        bootbox.alert(response.data.msg);
        return false;
      }
      if(response.data.staffPostList === null){
        $scope.model.selectedStaffPost = $scope.model.staffPostList[0];
        return false;
      }

      angular.forEach(response.data.staffPostList, function (staffPost) {
        $scope.model.staffPostList.push({
          staffPostID: staffPost.staffPostID,
          staffPostName: staffPost.staffPostName
        });
      });

      angular.forEach($scope.model.staffPostList, function (staffPost) {
        if(staffPost.staffPostID === $scope.model.staffPostID){
          $scope.model.selectedStaffPost = staffPost;
        }
      });
    }, function errorCallback(response) {
      bootbox.alert('网络异常，请检查网络设置');
    });
  };

  $scope.initUploadPlugins = function(){
    uploadUtils.initUploadPlugin('#file-upload-image', '/users/edit/fileUpload', ['png','jpg', 'jpeg'], false, function (opt,data) {
      $scope.model.staffPhotoUrl = data.fileUrl[0];
      $scope.$apply();
      $('#photo-upload-modal').modal('hide');
    });
    uploadUtils.initUploadPlugin('#file-upload-resume', '/users/edit/fileUpload', ['png','jpg', 'jpeg'], false, function (opt,data) {
      $scope.model.staffResumeUrl = data.fileUrl[0];
      $scope.$apply();
      $('#resume-upload-modal').modal('hide');
    });
  };

  $scope.onShowUploadPhotoDialog = function () {
    $('#photo-upload-modal').modal('show');
  };

  $scope.onShowUploadResumeDialog = function () {
    $('#resume-upload-modal').modal('show');
  };

  $scope.onCellphoneBlur = function(){
    if($scope.model.staffCellphone === ''){
      $scope.model.isCellphoneValid = false;
      return false;
    }
    if($scope.model.staffCellphoneOriginal === $scope.model.staffCellphone){
      $scope.model.isCellphoneValid = true;
      return false;
    }

    $http.get('/users/edit/cellphone?cellphone=' + $scope.model.staffCellphone).then(function successCallback (response) {
      if(response.data.err){
        bootbox.alert(response.data.msg);
        return false;
      }

      $scope.model.isCellphoneValid = response.data.result === 0;
      $scope.model.isShowCellphoneExistMessage = response.data.result > 0;
    }, function errorCallback(response) {
      bootbox.alert('网络异常，请检查网络设置');
    });
  };

  $scope.loadData = function(){
    let staffID = document.getElementById('hidden_staffID').value;
    if(staffID === ''){
      $scope.loadStaffPost();
      return false;
    }
    $http.get('/users/edit/detail?staffID='+staffID).then(function successCallback (response) {
      if(response.data.err){
        bootbox.alert(response.data.msg);
        return false;
      }
      if(response.data.staffInfo === null){
        return false;
      }

      $scope.model.staffID = response.data.staffInfo.staffID;
      $scope.model.staffName = response.data.staffInfo.staffName;
      $scope.model.staffCellphoneOriginal = response.data.staffInfo.staffCellphone;
      $scope.model.staffCellphone = response.data.staffInfo.staffCellphone;
      $scope.model.staffPostID = response.data.staffInfo.staffPostID;
      $scope.model.staffPhotoUrl = response.data.staffInfo.staffPhotoUrl;
      $scope.model.staffResumeUrl = response.data.staffInfo.staffResumeUrl;
      $scope.model.isCellphoneValid = true;
      $scope.model.add = false;
      $scope.loadStaffPost();
    }, function errorCallback(response) {
      bootbox.alert('网络异常，请检查网络设置');
    });
  };

  $scope.addData = function () {
    $http.post('/users/edit', {
      staffName: $scope.model.staffName,
      staffCellphone: $scope.model.staffCellphone,
      staffPostID: $scope.model.selectedStaffPost.staffPostID,
      staffPhotoUrl: $scope.model.staffPhotoUrl,
      staffResumeUrl: $scope.model.staffResumeUrl,
      loginUser: getLoginUser()
    }).then(function successCallback(response) {
      if(response.data.err){
        bootbox.alert(response.data.msg);
        return false;
      }
      location.href = '/users';
    }, function errorCallback(response) {
      bootbox.alert('网络异常，请检查网络设置');
    });
  };

  $scope.changeData = function () {
    $http.put('/users/edit', {
      staffID: $scope.model.staffID,
      staffName: $scope.model.staffName,
      staffCellphone: $scope.model.staffCellphone,
      staffPostID: $scope.model.selectedStaffPost.staffPostID,
      staffPhotoUrl: $scope.model.staffPhotoUrl,
      staffResumeUrl: $scope.model.staffResumeUrl,
      loginUser: getLoginUser()
    }).then(function successCallback(response) {
      if(response.data.err){
        bootbox.alert(response.data.msg);
        return false;
      }
      location.href = '/users';
    }, function errorCallback(response) {
      bootbox.alert('网络异常，请检查网络设置');
    });
  };

  $scope.onSave = function(){
    if($scope.model.staffID === 0){
      $scope.addData();
    }else{
      $scope.changeData();
    }
  };

  $scope.initPage();
});