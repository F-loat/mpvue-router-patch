import queryString from 'query-string'

function parseUrl(location) {
  if (typeof location === 'string') return location

  const { path, query } = location
  const queryStr = queryString.stringify(location.query, {
    encode: false
  })

  return `${path}?${queryStr}`
}

function parseRoute($mp) {
  const _$mp = $mp || {};
  const path = _$mp.page && _$mp.page.route
  return {
    path: `/${path}`,
    params: {},
    query: _$mp.query,
    hash: '',
    fullPath: parseUrl({
      path: `/${path}`,
      query: _$mp.query
    }),
    name: path && path.replace(/\/(\w)/g, ($0, $1) => $1.toUpperCase())
  }
}

function push(location, complete, fail, success) {
  const url = parseUrl(location)
  const params = { url, complete, fail, success }

  if (location.isTab) {
    wx.switchTab(params)
    return
  }
  if (location.reLaunch) {
    wx.reLaunchTo(params)
    return
  }
  wx.navigateTo(params)
}

function replace(location, complete, fail, success) {
  const url = parseUrl(location)
  wx.redirectTo({ url, complete, fail, success })
}

function go(delta) {
  wx.navigateBack({ delta })
}

function back() {
  wx.navigateBack()
}

let routerMethods = {
  push,
  replace,
  go,
  back
}

// 首字母大写
function upperCapital(word){
  return word.replace(/^([a-z])/, (w,cap)=>cap.toUpperCase());
}
// 代理方法对象
function proxyRooter(){
  let proxyMethods = {};
  ['push','replace','go','back'].map(method=>{
    proxyMethods['$router' + upperCapital(method)] = function(){
      let args = Array.prototype.slice.call(arguments);
      routerMethods[method].apply(null,args);
    }
  });
  return proxyMethods;
}

export let _Vue

export default {
  install(Vue) {
    if (this.installed && _Vue === Vue) return
    this.installed = true

    _Vue = Vue

    const _router = {
      mode: 'history',
      ...routerMethods
    }

    Vue.mixin({
      onLoad() {
        const { $mp } = this.$root
        this._route = parseRoute($mp)
      },
      onShow() {
        _router.app = this
        _router.currentRoute = this._route
      },
      methods: {
        ...proxyRooter()
      }
    })

    Object.defineProperty(Vue.prototype, '$router', {
      get() { return _router }
    })

    Object.defineProperty(Vue.prototype, '$route', {
      get() { return this._route }
    })
  }
}
