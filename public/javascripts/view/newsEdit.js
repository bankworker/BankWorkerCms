let app = angular.module('myApp', []);
app.controller('myCtrl', function ($scope, $http) {
  $scope.model = {
    optionType: 'add',
    newsID: 0,
    newsTitle: '',
    newsThumbnailUrl: '/images/news-demo.png',
    newsDate: '',
    newsContent: '',
    add: true
  };

  $scope.initCkEditor = function(){
    CKEDITOR.config.height = 400;
    CKEDITOR.config.width = 'auto';
    CKEDITOR.config.extraPlugins = 'html5video';
    CKEDITOR.config.image_previewText = ' ';
    CKEDITOR.replace( 'detailContent');
  };

  $scope.initUploadPlugins = function(){
    uploadUtils.initUploadPlugin('#file-upload-thumbnail', '/common/fileUpload', ['png','jpg', 'jpeg'], false, function (opt,data) {
      $scope.model.newsThumbnailUrl = data.fileUrlList[0];
      $scope.$apply();
      $('#modal-newsThumbnail').modal('hide');
    });
  };

  $scope.checkData = function(){
    $scope.model.newsContent = CKEDITOR.instances.detailContent.getData();
    if($scope.model.newsThumbnailUrl === '/images/news-demo.png'){
      bootbox.alert('请上传新闻缩略图');
      return false;
    }
    if($scope.model.newsContent === ''){
      bootbox.alert('请编辑新闻内容');
      return false;
    }
    return true;
  };

  $scope.addData = function () {
    $http.post('/news/edit', {
      newsTitle: $scope.model.newsTitle,
      newsDate: $scope.model.newsDate,
      thumbnailUrl: $scope.model.newsThumbnailUrl,
      newsContent: $scope.model.newsContent,
      loginUser: getLoginUser()
    }).then(function successCallback(response) {
      if(response.data.err){
        bootbox.alert(response.data.msg);
        return false;
      }
      location.href = '/news';
    }, function errorCallback(response) {
      bootbox.alert('网络异常，请检查网络设置');
    });
  };

  $scope.changeData = function () {
    $http.put('/news/edit', {
      newsID: $scope.model.newsID,
      newsTitle: $scope.model.newsTitle,
      newsDate: $scope.model.newsDate,
      thumbnailUrl: $scope.model.newsThumbnailUrl,
      newsContent: $scope.model.newsContent,
      loginUser: getLoginUser()
    }).then(function successCallback(response) {
      if(response.data.err){
        bootbox.alert(response.data.msg);
        return false;
      }
      location.href = '/news';
    }, function errorCallback(response) {
      bootbox.alert('网络异常，请检查网络设置');
    });
  };

  $scope.onInit = function () {
    $scope.initCkEditor();
    $scope.initUploadPlugins();
    $scope.onLoadData();
  };

  $scope.onLoadData = function(){
    let newsID = document.getElementById('hidden-newsID').value;
    if(newsID === ''){
      return false;
    }

    $http.get('/news/edit/detail?newsID=' + newsID).then(function successCallback (response) {
      if(response.data.err){
        bootbox.alert(response.data.msg);
        return false;
      }
      if(response.data.newsInfo === null){
        return false;
      }

      $scope.model.newsID = response.data.newsInfo.newsID;
      $scope.model.newsTitle = response.data.newsInfo.newsTitle;
      $scope.model.newsDate = new Date(response.data.newsInfo.newsDate);
      $scope.model.newsThumbnailUrl = response.data.newsInfo.thumbnailUrl;
      $scope.model.newsContent = response.data.newsInfo.newsContent;
      CKEDITOR.instances.detailContent.setData(response.data.newsInfo.newsContent);
      $scope.model.add = false;
    }, function errorCallback(response) {
      bootbox.alert('网络异常，请检查网络设置');
    });
  };

  $scope.onShowDialog = function(){
    $('#modal-newsThumbnail').modal('show');
  };

  $scope.onSave = function(){
    if(!$scope.checkData()){
      return false;
    }
    if($scope.model.newsID === 0){
      $scope.addData();
    }else{
      $scope.changeData();
    }
  };

  $scope.onInit();
});