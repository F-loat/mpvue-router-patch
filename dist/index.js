import querystring from 'querystring';

function parseUrl(location) {
  if (typeof location === 'string') return location;

  var path = location.path,
      query = location.query;

  var queryStr = querystring.stringify(query);

  if (!queryStr) {
    return path;
  }

  return path + '?' + queryStr;
}

function parseRoute($mp) {
  var _$mp = $mp || {};
  var path = _$mp.page && _$mp.page.route;
  return {
    path: '/' + path,
    params: {},
    query: _$mp.query,
    hash: '',
    fullPath: parseUrl({
      path: '/' + path,
      query: _$mp.query
    }),
    name: path && path.replace(/\/(\w)/g, function ($0, $1) {
      return $1.toUpperCase();
    })
  };
}

function push(location, complete, fail, success) {
  var url = parseUrl(location);
  var params = { url: url, complete: complete, fail: fail, success: success };

  if (location.isTab) {
    wx.switchTab(params);
    return;
  }
  if (location.reLaunch) {
    wx.reLaunch(params);
    return;
  }
  wx.navigateTo(params);
}

function replace(location, complete, fail, success) {
  var url = parseUrl(location);
  wx.redirectTo({ url: url, complete: complete, fail: fail, success: success });
}

function go(delta) {
  wx.navigateBack({ delta: delta });
}

function back() {
  wx.navigateBack();
}

var _Vue = void 0;

var index = {
  install: function install(Vue) {
    if (this.installed && _Vue === Vue) return;
    this.installed = true;

    _Vue = Vue;

    var _router = {
      mode: 'history',
      push: push,
      replace: replace,
      go: go,
      back: back
    };

    Vue.mixin({
      onLoad: function onLoad() {
        var $mp = this.$root.$mp;

        this._route = parseRoute($mp);
      },
      onShow: function onShow() {
        _router.app = this;
        _router.currentRoute = this._route;
      }
    });

    Object.defineProperty(Vue.prototype, '$router', {
      get: function get() {
        return _router;
      }
    });

    Object.defineProperty(Vue.prototype, '$route', {
      get: function get() {
        return this._route;
      }
    });
  }
};

export default index;
export { _Vue };
