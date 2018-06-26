const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
};

function timestampToTime(timestamp) {
  var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
  var h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':';
  var m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes());
  var s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());;
  return Y + M + D + h + m;
};
function debounce(fn, delay = 1000) {
  let timer;

  // 返回一个函数，这个函数会在一个时间区间结束后的 delay 毫秒时执行 func 函数
  return function () { 

    // 保存函数调用时的上下文和参数，传递给func
    var context = this
    var args = arguments

    // 函数被调用，清除定时器
    clearTimeout(timer)

    // 当返回的函数被最后一次调用后（也就是用户停止了某个连续的操作），
    // 再过 delay 毫秒就执行 func
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  }
};
function throttle(func, wait = 100) {
  // 利用闭包保存定时器和上次执行时间
  let timer = null;
  let previous; // 上次执行时间
  return function() {
      // 保存函数调用时的上下文和参数，传递给 fn
      const context = this;
      const args = arguments;
      const now = +new Date();
      if (previous && now < previous + wait) { // 周期之中
          clearTimeout(timer);
        timer = setTimeout(function() {
            previous = now;
            func.apply(context, args);
        }, wait);
      } else {
          previous = now;
          func.apply(context, args);
      }
  };
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
        "content-type": "application/x-www-form-urlencoded",
        "ndusertoken": wx.getStorageSync('nd_usertoken')
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
  var pages = getCurrentPages() //获取加载的页面
  var currentPage = pages[pages.length - 1] //获取当前页面的对象
  var url = currentPage.route //当前页面url
  return url
}

/*获取当前页带参数的url*/
function getCurrentPageUrlWithArgs() {
  var pages = getCurrentPages() //获取加载的页面
  var currentPage = pages[pages.length - 1] //获取当前页面的对象
  var url = currentPage.route //当前页面url
  var options = currentPage.options //如果要获取url中所带的参数可以查看options

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
  timestampToTime,
  playVideo,
  throttle,
  $get,
  json2Form,
  debounce,
  getQueryString,
  getCurrentPageUrl: getCurrentPageUrl,
  getCurrentPageUrlWithArgs: getCurrentPageUrlWithArgs
}