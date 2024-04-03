// 对登录进行验证
const joi = require('joi')
// string值只能为字符串
// alphanum值为a-z A-Z 0-9
// min 是最小长度，max是最大长度
// required() 必填项
// pattern是正则

// 对这个账号进行验证
const account = joi.string().alphanum().min(6).max(12).required()
// 对密码进行验证
const password = joi.string().pattern(/^(?![0-9]+$)[a-z0-9]{1,50}$/).min(6).max(12).required()


exports.login_limit = {
  // 表示需要对req.body里面的数据进行验证
  body: {
    account,
    password
  }
}