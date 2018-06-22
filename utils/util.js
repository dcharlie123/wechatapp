const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
};

function json2Form(json) {
  var str = [];
  for (var p in json) {
    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]));
  }
  return str.join("&");
};
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const $get = (url, data, options) => {
  return new Promise((resolve, reject) => {
    wx.request({
      method: "POST",
      url,
      data,
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: resolve,
      fail: reject
    })
  })
};

function playVideo(e) {
  e.videoContext.play()
};

function getQueryString(url, name) {
  var vars = url.split("?")[1];
  // console.log(vars);s
  var match = RegExp('[?&]' + name + '=([^&]*)').exec(vars);
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}
/*获取当前页url*/
function getCurrentPageUrl() {
  var pages = getCurrentPages()    //获取加载的页面
  var currentPage = pages[pages.length - 1]    //获取当前页面的对象
  var url = currentPage.route    //当前页面url
  return url
}

/*获取当前页带参数的url*/
function getCurrentPageUrlWithArgs() {
  var pages = getCurrentPages()    //获取加载的页面
  var currentPage = pages[pages.length - 1]    //获取当前页面的对象
  var url = currentPage.route    //当前页面url
  var options = currentPage.options    //如果要获取url中所带的参数可以查看options

  //拼接url的参数
  var urlWithArgs = url + '?'
  for (var key in options) {
    var value = options[key]
    urlWithArgs += key + '=' + value + '&'
  }
  urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1)

  return urlWithArgs
}

module.exports = {
  formatTime: formatTime,
  playVideo,
  $get,
  json2Form,
  getQueryString,
  getCurrentPageUrl: getCurrentPageUrl,
  getCurrentPageUrlWithArgs: getCurrentPageUrlWithArgs
}