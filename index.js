import queryString from 'query-string'

function parseUrl(location) {
  if (typeof location === 'string') return location

  const { path, query } = location
  const queryStr = queryString.stringify(location.query)

  return `${path}?${queryStr}`
}

function parseRoute($mp) {
  const path = $mp.page && $mp.page.route
  return {
    path,
    params: {},
    query: $mp.query,
    hash: '',
    fullPath: parseUrl({
      path,
      query: $mp.query
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

export default {
  install(Vue) {
    Vue.mixin({
      mounted() {
        const { $mp } = this.$root
        this.$route = parseRoute($mp)
        this.$router = {
          app: this,
          mode: 'history',
          currentRoute: this.$route,
          push,
          replace,
          go,
          back
        }
      }
    })
  }
}
