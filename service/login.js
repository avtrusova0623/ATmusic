import { atLoginRequest} from "./index"

export function getLoginCode() {
  return new Promise((resolve, reject) => {
    wx.login({
      timeout: 1000,
      success: res => {
        const code = res.code
        resolve(code)
      },
      fail: err => {
        console.log(err)
        reject(err)
      }
    })
  })
}

// code--token
export function codeToToken(code) {
  return atLoginRequest.post("/login", { code })
}

// 检查token是否过期
export function checkToken(token) {
  // 这里要传递header，里面包含token
  return atLoginRequest.post("/auth", {}, {
    token
  })
}

// 检查Session是否过期
export function checkSession() {
  return new Promise((resolve) => {
    wx.checkSession({
      success: () => {
        resolve(true)
      },
      fail: () => {
        resolve(false)
      }
    })
  })
}


export function getUserInfo() {
  return new Promise((resolve, reject) => {
    wx.getUserProfile({
      desc: '你好啊,李银河',
      success: (res) => {
        resolve(res)
      },
      fail: (err) => {
        // reject(err)
        resolve(err)
      }
    })
  })
}
