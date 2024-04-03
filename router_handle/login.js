const db = require('../db/index')
// 导入加密中间件
const bcrypt = require('bcrypt')
// 导入jwt，用于生成token
const jwt = require('jsonwebtoken')
//导入jwt配置文件，用于加密和解密 
const jwtconfig = require('../jwt_config/index')


exports.register = (req, res) => {
  // req就是前端传过来的数据，也就是resquest,res是反悔给前端的数据，也就是result
  const reginfo = req.body
  // 第一步，判断前端传过来的账号有没有空
  if (!reginfo.account || !reginfo.password) {
    return res.send({
      status: 1,
      message: '账号或者密码不能为空'
    })
  }
  // 第二步，判断前端传过来的账号有没有已经在数据表中
  // mysql 的select语句
  const sql = 'select * from users where account = ?'
  // 第一个参数是执行语句，第二个是参数，第三个是一个函数，用来处理结果。
  // 在数据库中查询是否有前端传过来的账号
  db.query(sql, reginfo.account, (err, results) => {
    console.log(results);
    if (results.length > 0) {
      return res.send({
        status: 1,
        message: '账号已存在'
      })
    }
    // 第三步，对密码进行加密，需要使用加密中间件bcrypt.js,
    //bcrypt.hashSync第一个参数是加密的方法，第二个参数是加密后的长度。 
    reginfo.password = bcrypt.hashSync(reginfo.password, 10)
    // 将账号和密码插入到数据表里面
    const sql1 = 'insert into users set ?'
    // 初始化用户注册的身份
    const identity = '用户'
    // 创建时间
    const create_time = new Date()

    db.query(sql1, {
      account: reginfo.account,
      password: reginfo.password,
      // 身份
      identity,
      // 初始的时间
      create_time,
      // 初始未冻结状态
      status: 0,

    }, (err, results) => {
      if (err) {
        console.log('err', err);
      }
      console.log('res', results);
      // 插入失败
      // affectedRows为影响的行数，那么就没有影响的行数，行数不为一
      if (results.affectedRows !== 1) {
        return res.send({
          status: 1,
          message: '注册账号失败'
        })
      }
      res.send({
        status: 1,
        message: '注册账号成功'
      })
    })

  })
}


exports.login = (req, res) => {
  const login = req.body
  // 第一步查看数据表有没有前端传过来的账号
  const sql = 'select * from users where account = ? '
  db.query(sql, login.account, ((err, results) => {
    // 执行sql 语句失败的情况，一般的数据断开的情况会指向失败
    if (err) {
      return res.cc(err)
    }
    // 没有查询的数据，提示登录失败
    if (results.length !== 1) {
      return res.cc('登录失败')
    }

    // 第二步对前端传过来的密码进行解密
    const compareResult = bcrypt.compareSync(login.password, results[0].password)
    if (!compareResult) {
      return res.cc('登录失败')
    }
    // 第三步，对账号是否冻结做判断
    if (results[0].status === 1) {
      return res.cc('账号被冻结')
    }
    // 第四步，生成返回给前端的token
    // 删除加密后的密码，头像，创建时间，更新时间
    const user = {
      ...results[0],
      password: '',
      imageUrl: '',
      create_time: '',
      update_time: ''
    }
    // 设置token的有效时长
    const tokenStr = jwt.sign(user, jwtconfig.jwtSecretKey, {
      expiresIn: "7h"
    })
    res.send({
      results: results[0],
      status: 0,
      message: '登录成功',
      token: 'Bearer ' + tokenStr
    })
  })

  )
}