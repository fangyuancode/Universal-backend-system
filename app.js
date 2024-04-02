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

// 绑定和侦听主机使用的端口
app.listen(3000, () => {
  console.log('http://127.0.0.1', 3000);
})

