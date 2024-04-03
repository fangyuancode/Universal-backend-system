// 引入express框架，并使用express
const express = require('express')
// 创建实例
const app = express()
// 导入cors中间件
const cors = require('cors')
// 对cors进行全局挂载
app.use(cors())

const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded，设置编码格式，
// extended为fasle,值为数组或者字符串，为true时，可以是任意类型
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json，处理json数据
app.use(bodyParser.json())

// 错误处理中间件
app.use((req, res, next) => {
  // status=0,为成功，=1为失败，默认设为1，方便处理失败的情况
  res.cc = (err, status = 1) => {
    res.send({
      status,
      // 判断这个err是错误对象还是字符串
      message: err instanceof Error ? err.message : err
    })
  }
  next()
})

// 导入jwt的配置文件
const jwtconfig = require('./jwt_config/index')
// 导入express-jwt
const { expressjwt: jwt } = require('express-jwt')

//使用中间件去排除不需要再请求端发送的接口
app.use(jwt({
  secret: jwtconfig.jwtSecretKey, algorithms: ['HS256']
}).unless({
  path: [/^\/api\//]
})
)


// 后端的每一个路由，指向一个实现的逻辑
// 引入登录的路由
const loginRouter = require('./router/login')
const Joi = require('joi')
app.use('/api', loginRouter)


// 对不符合joi规则的中间件进行报错  
app.use((req, res, next) => {
  if (err instanceof Joi.ValidationError) {
    return res.cc(err)
  }
})









// 绑定和侦听主机使用的端口
app.listen(3000, () => {
  console.log('http://127.0.0.1', 3000);
})


