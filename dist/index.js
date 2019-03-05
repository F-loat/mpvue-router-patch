var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var stringifyPrimitive = function stringifyPrimitive(v) {
  switch (typeof v === 'undefined' ? 'undefined' : _typeof(v)) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

function stringify(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object') {
    return Object.keys(obj).map(function (k) {
      var ks = stringifyPrimitive(k) + eq;
      if (Array.isArray(obj[k])) {
        return obj[k].map(function (v) {
          return ks + stringifyPrimitive(v);
        }).join(sep);
      } else {
        return ks + stringifyPrimitive(obj[k]);
      }
    }).filter(Boolean).join(sep);
  }

  if (!name) return '';
  return stringifyPrimitive(name) + eq + stringifyPrimitive(obj);
}

function parseUrl(location) {
  if (typeof location === 'string') return location;

  var path = location.path,
      query = location.query;

  var queryStr = stringify(query);

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
    mpvue.switchTab(params);
    return;
  }
  if (location.reLaunch) {
    mpvue.reLaunch(params);
    return;
  }
  mpvue.navigateTo(params);
}

function replace(location, complete, fail, success) {
  var url = parseUrl(location);
  mpvue.redirectTo({ url: url, complete: complete, fail: fail, success: success });
}

function go(delta) {
  mpvue.navigateBack({ delta: delta });
}

function back() {
  mpvue.navigateBack();
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
