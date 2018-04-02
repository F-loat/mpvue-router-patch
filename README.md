# mpvue-router-patch
> 在 mpvue 中使用 vue-router 兼容的路由写法

[![npm package](https://img.shields.io/npm/v/mpvue-router-patch.svg)](https://npmjs.org/package/mpvue-router-patch)
[![npm downloads](http://img.shields.io/npm/dm/mpvue-router-patch.svg)](https://npmjs.org/package/mpvue-router-patch)

## 安装

``` bash
npm i mpvue-router-patch
```

## 使用

``` js
// main.js
import Vue from 'vue'
import MpvueRouterPatch from 'mpvue-router-patch'

Vue.use(MpvueRouterPatch)
```

## API
> 大部分与 vue-router 一致，具体差异之后会补全

### Router 实例

#### 属性

* $router.app
* $router.mode
* $router.currentRoute

#### 方法

* $router.push(location, onComplete?, onAbort?, onSuccess?)
* $router.replace(location, onComplete?, onAbort?, onSuccess?)
* $router.go(n)
* $router.back()

### 路由信息对象

#### 属性

* $route.path
* $route.params
* $route.query
* $route.hash
* $route.fullPath
* $route.name
