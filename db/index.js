// 导入mysql数据库
const mysql = require('mysql')

// 创建与数据库的连接
const db = mysql.createPool(

  {
    host: 'localhost', // 主机名
    port: 3306,        // MySQL 默认端口为 3306
    user: 'root',          // 使用 root 用户登入 MySQL
    password: '123456', // MySQL 密码，用你自己的
    database: 'backsystem' // 使用数据库

  }
)

// 对外暴露数据库
module.exports = db


