const BASE_URL = "http://123.207.32.32:9001"

const LOGIN_BASE_URL = "http://123.207.32.32:3000"

class ATRequest {
  constructor(baseURL) {
    this.baseURL = baseURL
  }

/**
 * 
 * @param {*} url 
 * @param {*} method 
 * @param {*} params 
 * @param {*} header : 后面检查token是否过期，需要把token放在header中传递过去，这里默认header = {}
 */
  request(url, method, params,header = {}) {
    return new Promise((resolve, reject) => {
      wx.request({
        url:this.baseURL + url,
        method: method,
        data: params,
        header: header,
        success: function(res) {
          resolve(res.data)
        },
        fail: reject
      })
    })
  }

  get(url, params,header) {
    return this.request(url, "GET", params, header)
  }

  post(url, data, header) {
    return this.request(url, "POST", data, header)
  }
}

const atRequest = new ATRequest(BASE_URL)
const atLoginRequest = new ATRequest(LOGIN_BASE_URL)

export default atRequest
export {
  atLoginRequest
}