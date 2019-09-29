$(document).ready(function () {
  setAlertBell();
  setActiveNav();
  addCommonEvent();
  showLoginUser();
  setSystemTitle();
  setAuthorizedSystem();
});

function setSystemTitle() {
  let cookie = getCookie('secmsUser');
  if(cookie !== null){
    let loginUser = JSON.parse(cookie);
    let branchName = loginUser.branchName;
    $('#branchName4System').text(branchName);
  }
}
function setAuthorizedSystem() {
  let accountID = getLoginUserInfo().accountID;
  if(accountID === undefined){
    return false;
  }
  $.ajax({
    url: '/users/authorizedSystem?accountID=' + accountID,
    type: 'get',
    success: function(res){
      if(res.err){
        layer.msg(res.msg);
        return false;
      }

      if(res.dataList === null || res.dataList.length === 0){
        return false;
      }

      let noAuthorizedNav = [];
      $.each($('ul.nav-list li.system-fun'), function (index, li) {
        let hasAuthorized = false;
        let systemID = $(li).attr('data-system-id');
        $.each(res.dataList, function (index, data) {
          if(parseInt(systemID) === data.systemID){
            hasAuthorized = true;
            $(li).removeClass('hide');
          }
        });
        if(!hasAuthorized){
          noAuthorizedNav.push(li);
        }
      });

      $.each(noAuthorizedNav, function (index, nav) {
        $(nav).remove();
      });


    },
    error: function(XMLHttpRequest){
      bootbox.alert('无法连接远程服务器，请检查网络状态。');
    }
  });
}

function setAlertBell() {
  let alertCount = 8;
  if(alertCount > 0){
    $('.icon-bell-alt').addClass('icon-animated-bell');
  }
}

function setActiveNav() {
  var pathname = window.location.pathname;
  if(pathname.indexOf('news') >= 0
      || pathname.indexOf('editNews') >= 0){
    pathname = '/news';
  }

  if(pathname.indexOf('advertise') >= 0){
    pathname = '/advertise';
  }

  if(pathname.indexOf('users') >= 0){
    pathname = '/users';
  }

  if(pathname.indexOf('archive') >= 0){
    pathname = '/archive';
  }
  if(pathname.indexOf('mediaModule') >= 0){
    pathname = '/mediaModule';
  }
  $('.nav-list li.active').removeClass('active');
  $('.nav-list li.open').removeClass('open').removeClass('active');
  var element = $('.nav-list a[href="' + pathname + '"]');
  $(element).parent().addClass('active');
  $(element).parent().parent().parent().addClass('open active');
}

function addCommonEvent() {
  $('li.logout').click(function () {
    delCookie('secmsUser');
    delCookie('secmsUserID');
    // delCookie('secmsBankCode');
    // delCookie('secmsBranchCode');
    location.href = '/';
  });
}

function showLoginUser() {
  var cookie = getCookie('secmsUser');
  if(cookie !== null){
    var loginUser = JSON.parse(cookie);
    $('li.light-blue span.user-info>span').text(loginUser.branchName);
  }
}

function getLoginUserInfo() {
  var cookie = getCookie('secmsUser');
  if(cookie !== null){
    return JSON.parse(cookie);
  }

  return '';
}

function getLoginUser() {
  var cookie = getCookie('secmsUser');
  if(cookie !== null){
    var loginUser = JSON.parse(cookie);
    return loginUser.account;
  }

  return 'unknown';
}

function setCookie(name,value) {
  var days = 30;
  var exp = new Date();
  exp.setTime(exp.getTime() + days*24*60*60*1000);
  document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}

function getCookie(name) {
  var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
  if(arr=document.cookie.match(reg))
    return unescape(arr[2]);
  else
    return null;
}

function delCookie(name) {
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  var cval=getCookie(name);
  if(cval!=null)
    document.cookie= name + "="+cval+";expires="+exp.toGMTString();
}

function isDecimal(v) {
  var regu = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
  var reg = new RegExp(regu);
  return reg.test(v);
}

function isRate(v) {
  var regu = "^0+[\.][0-9]{0,2}$";
  var re = new RegExp(regu);
  return re.test(v);
}