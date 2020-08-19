// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"epB2":[function(require,module,exports) {
var siteList = document.querySelector('#siteList');
var addButton = document.querySelector('#addIcon');
var option = document.querySelector('#option');
var searchInput = document.querySelector('#searchInput');
var submit = document.querySelector('#submit');
var siteData = JSON.parse(localStorage.getItem('siteData'));
var hashMap = siteData || [{
  url: 'https://segmentfault.com/',
  color: '#009A61'
}, {
  url: 'https://www.bilibili.com/',
  color: '#fb7299'
}, {
  url: 'https://www.zhihu.com/',
  color: '#0084ff'
}];
var showDelete = false;

var simplifyUrl = function simplifyUrl(url) {
  return url.replace('https://', '').replace('http://', '').replace('www.', '').replace(/\/.*/, '');
};

var getRamdomLightColor = function getRamdomLightColor() {
  var r = Math.floor(Math.random() * 255 + 1);
  var g = Math.floor(Math.random() * 255 + 1);
  var b = Math.floor(Math.random() * 255 + 1);

  while (r + g < 350 && r + b < 350 && g + b < 350 || r + g > 440 && r + b > 440 && g + b > 440) {
    r = Math.floor(Math.random() * 255 + 1);
    g = Math.floor(Math.random() * 255 + 1);
    b = Math.floor(Math.random() * 255 + 1);
  }

  return "rgb(".concat(r, ", ").concat(g, ", ").concat(b, ")");
};

var createElement = function createElement(el) {
  var template = document.createElement('template');
  template.innerHTML = el.trim();
  return template.content.firstChild;
};

var render = function render() {
  Array.from(siteList.children).forEach(function (x) {
    if (x.className === 'site') {
      siteList.removeChild(x);
    }
  });
  hashMap.forEach(function (node, index) {
    var simpleUrl = simplifyUrl(node.url);
    var li = createElement("<li class=\"site\">\n    <div class=\"wrap\" style=\"background: ".concat(node.color, "\">\n      <div class=\"logo\">").concat(simpleUrl[0].toUpperCase(), "</div>\n      <div class=\"title\">").concat(simpleUrl[0].toUpperCase() + simpleUrl.slice(1), "</div>\n      <div class=\"delete\" style=\"display: ").concat(showDelete ? 'block' : 'none', "\">\n        <svg class=\"icon\">\n          <use xlink:href=\"#icon-delete\"></use>\n        </svg>\n      </div>\n    </div>\n  </li>"));
    siteList.insertBefore(li, siteList.lastElementChild);
    li.querySelector('.wrap').addEventListener('click', function () {
      window.open(node.url);
    });
    li.querySelector('.delete').addEventListener('click', function (e) {
      e.stopPropagation();
      hashMap.splice(index, 1);
      localStorage.setItem('siteData', JSON.stringify(hashMap));
      render();
    });
  });
};

addButton.addEventListener('click', function () {
  var url = window.prompt('请输入要添加的网址');

  if (url) {
    if (url.indexOf('http') !== 0) {
      url = 'https://' + url;
    }

    hashMap.push({
      url: url,
      color: getRamdomLightColor()
    });
    localStorage.setItem('siteData', JSON.stringify(hashMap));
    render();
  }
});
option.addEventListener('click', function () {
  showDelete = !showDelete;
  render();
});
submit.addEventListener('click', function () {
  console.log(searchInput.value);
  window.open('https://www.baidu.com/s?wd=' + searchInput.value);
});
render();
},{}]},{},["epB2"], null)
//# sourceMappingURL=main.98eb70d4.js.map