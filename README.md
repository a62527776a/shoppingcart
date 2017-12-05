# shoppingcart

## 实现功能 

1. 下拉刷新
2. 上拉加载
3. 图片懒加载
4. 选中商品价格实时变化
5. 全选/全不选
6. 商品全部/单个删除
7. reload数据不清空


## 目录结构

```
src
 ├── assets 静态资源目录
 ├── components 页面
 |   ├── shopcart.vue 购物车页面
 |   └── shoplist.vue 商品列表
 ├── plugins 中间件
 |   ├── index.js
 |   ├── cacheControl.js 缓存控制
 |   └── filters.js 千分位过滤器
 ├── router 路由
 |   └── index.js
 ├── service ajax请求封装
 |   ├── base.service.js ajax请求封装
 |   └── index.js
 ├── store vuex 状态管理
 |   ├── data 数据类
 |   |   └── index.js
 |   ├── mvs.js 商品类的状态管理 包括常用的CURD操作和一系列业务操作
 |   └── index.js
 ├── App.vue
 ├── config.js 常用配置项
 └── main.js 入口文件
```

## 数据来源 

[网易云音乐API](https://github.com/Binaryify/NeteaseCloudMusicApi)

```
$ git clone https://github.com/Binaryify/NeteaseCloudMusicApi
$ cd NeteaseCloudMusicApi && npm install
$ npm run start
```

## 安装 && 运行

```
$ git clone https://github.com/a62527776a/shoppingcart.git
$ cd shoppingcart && npm install
$ npm run dev
```
