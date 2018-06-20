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
}

function playVideo(e) {
  e.videoContext.play()
}
module.exports = {
  formatTime: formatTime,
  playVideo,
  $get,
  json2Form
}