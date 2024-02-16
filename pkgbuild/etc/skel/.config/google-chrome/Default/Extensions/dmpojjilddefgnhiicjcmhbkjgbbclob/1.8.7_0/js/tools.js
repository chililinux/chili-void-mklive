/**
 * Created by Anton on 20.06.2015.
 */
var tools = {};
tools.sandbox = null;
tools.engine = null;
tools.b64toBlob = function (content) {
  "use strict";
  var m = content.match(/^[^:]+:([^;]+);[^,]+,(.+)$/);
  if (!m) {
    m = ['', '', ''];
  }
  var contentType = m[1];
  var b64Data = m[2];
  m = null;
  content = null;

  var sliceSize = 256;
  var byteCharacters = atob(b64Data);
  var byteCharacters_len = byteCharacters.length;
  var byteArrays = new Array(Math.ceil(byteCharacters_len / sliceSize));
  var n = 0;
  for (var offset = 0; offset < byteCharacters_len; offset += sliceSize) {
    var slice = byteCharacters.slice(offset, offset + sliceSize);
    var slice_len = slice.length;
    var byteNumbers = new Array(slice_len);
    for (var i = 0; i < slice_len; i++) {
      byteNumbers[i] = slice.charCodeAt(i) & 0xff;
    }
    byteArrays[n] = new Uint8Array(byteNumbers);
    n++;
  }
  return new Blob(byteArrays, {type: contentType});
};

tools.b64toUrl = function(content) {
  "use strict";
  var blob = tools.b64toBlob(content);
  return URL.createObjectURL(blob);
};

tools.getTime = function () {
  return parseInt(Date.now() / 1000);
};

tools.wrapMsgTools = function(sb) {
  "use strict";
  var debug = false;

  var getTime = tools.getTime;

  var msgTools = {
    async: {},
    id: 0,
    idPrefix: Math.floor(Math.random()*1000),
    getId: function () {
      return this.idPrefix + '_' + (++this.id);
    },
    wait: function (id, responseCallback) {
      this.async[id] = {
        fn: responseCallback,
        time: getTime()
      };
      this.gc();
    },
    callCb: function(message) {
      var item = this.async[message.responseId];
      var fn = item && item.fn;
      if (fn) {
        delete this.async[message.responseId];
        fn(message.data);
      }
    },
    mkResponse: function(response, callbackId) {
      return function (msg) {
        if (callbackId) {
          response({
            data: msg,
            responseId: callbackId
          });
          callbackId = null;
          response = null;
        }
      };
    },
    gcTimeout: 0,
    gc: function () {
      var now = getTime();
      if (this.gcTimeout < now) {
        var expire = 180;
        var async = this.async;
        this.gcTimeout = now + expire;
        Object.keys(async).forEach(function (responseId) {
          if (async[responseId].time + expire < now) {
            delete async[responseId];
          }
        });
      }
    }
  };

  sb.waitResponse = msgTools.async;

  sb.sendMessage = function(msg, cb) {
    var message = {
      data: msg,
      idPrefix: msgTools.idPrefix
    };
    debug && console.log('send', message);
    if (cb) {
      message.callbackId = msgTools.getId();
      msgTools.wait(message.callbackId, cb);
    }
    sb.sendMessage.send(message);
  };

  sb.onMessage = function(cb) {
    sb.onMessage.on(function(message, response) {
      debug && console.log('msg', message);
      if (message.responseId) {
        msgTools.callCb(message);
      } else {
        cb(message.data, msgTools.mkResponse(response, message.callbackId));
      }
    });
  };
};
tools.initSandboxMsg = function(frameContentWindow) {
  "use strict";
  var sb = {};

  tools.wrapMsgTools(sb);

  var api = {
    mkResponse: function(source) {
      return function(msg) {
        source.postMessage(msg, '*');
      }
    },
    on: function(cb) {
      var _this = this;
      window.addEventListener("message", function(event) {
        var msg = event.data;
        var response = _this.mkResponse(event.source);
        cb(msg, response);
      });
    },
    send: function(msg) {
      frameContentWindow.postMessage(msg, '*');
    }
  };

  sb.onMessage.on = api.on.bind(api);
  sb.sendMessage.send = api.send.bind(api);

  return sb;
};
tools.initSandbox = function(engine, onReady) {
  "use strict";
  this.engine = engine;

  var frame = document.createElement('iframe');
  var hash = window.location.pathname === '/_generated_background_page.html' ? '#bg' : '';
  frame.src = 'sandbox.html' + hash;
  frame.onload = function () {
    var sandbox = tools.sandbox = tools.initSandboxMsg(frame.contentWindow);
    engine.ext.setSandboxApi(sandbox, tools);
    onReady(sandbox);
  };

  document.body.appendChild(frame);
};
tools.getPath = function(filename) {
  "use strict";
  var pos = filename.lastIndexOf('/');
  if (pos !== -1) {
    filename = filename.substr(0, pos + 1);
  } else {
    filename = '';
  }
  return filename;
};

tools.fileNameNormalize = function(filename, path) {
  "use strict";
  if (!filename) {
    return filename;
  }

  path = path || '';

  filename = filename.split(/[?#]/)[0];

  if (filename.substr(0, 19) === 'chrome-extension://') {
    path = '';
    filename = filename.substr(filename.indexOf('/', 20));
  }

  if (filename[0] === '/') {
    path = '';
  }

  var fileNameList = path.split('/').concat(filename.split('/')).filter(function(item) {
    return item && item !== '.';
  });

  var list = [];
  for (var i = 0, len = fileNameList.length; i < len; i++) {
    var item = fileNameList[i];
    if (item === '..') {
      list.splice(-1);
      continue;
    }
    list.push(item);
  }

  return list.join('/').toLowerCase();
};
tools.localUrl2b64 = function(url) {
  "use strict";
  var pos, hasUrl, id = chrome.runtime.id;
  if (url.substr(0, 4) === 'http' || (hasUrl = (url.substr(0, 19) === 'chrome-extension://')) && (pos = url.indexOf(id)) === -1) {
    return url;
  }
  if (hasUrl) {
    url = url.substr(pos + 1 + id.length);
  }
  var localContent = tools.engine.ext.getFile(url);
  if (!localContent) {
    console.log('Local file is not found!', url);
    url = '404';
  } else {
    url = tools.b64toUrl(localContent);
  }
  return url;
};
tools.vXhr = {
  xhrList: {},
  xhr: function(message, response) {
    "use strict";
    var xhrList = this.xhrList;
    var wait = true;
    var getVXhr = function(cbType) {
      if (!wait) {
        return;
      }
      wait = false;

      delete xhrList[id];

      vXhr.status = xhr.status;
      vXhr.statusText = xhr.statusText;
      vXhr.responseURL = xhr.responseURL;
      vXhr.readyState = xhr.readyState;
      vXhr.responseHeaders = xhr.getAllResponseHeaders();

      if (vXhr.responseType) {
        vXhr.response = xhr.response;
      } else {
        vXhr.responseText = xhr.responseText;
      }
      vXhr.cbType = cbType;

      response(vXhr);
    };

    var vXhr = message.data;
    var id = vXhr.id;
    var xhr = xhrList[id] = new XMLHttpRequest();
    if (vXhr.url && vXhr.url.substr(0, 4) !== 'http') {
      vXhr.url = tools.localUrl2b64(vXhr.url);
    }
    if (vXhr.withCredentials) {
      xhr.withCredentials = true;
    }
    xhr.open(vXhr.method, vXhr.url, true);
    vXhr.mimeType && xhr.overrideMimeType(vXhr.mimeType);
    for (var key in vXhr.headers) {
      xhr.setRequestHeader(key, vXhr.headers[key]);
    }
    if (vXhr.timeout) {
      xhr.timeout = vXhr.timeout;
      xhr.ontimeout = getVXhr.bind(null, 'ontimeout')
    }
    if (vXhr.responseType && vXhr.async) {
      xhr.responseType = vXhr.responseType;
    }

    xhr.onload = getVXhr.bind(null, 'onload');

    xhr.onerror = getVXhr.bind(null, 'onerror');

    xhr.onabort = getVXhr.bind(null, 'onabort');

    xhr.send(vXhr.data);
  },
  xhrAbort: function(message) {
    "use strict";
    var xhrList = this.xhrList;
    var id = message.id;
    if (xhrList.hasOwnProperty(id)) {
      xhrList[id].abort();
      delete xhrList[id];
    }
  }
};
tools.tabsOnUpdate = {
  listener: function(tabId, changeInfo, tab) {
    "use strict";
    if (changeInfo.status !== 'loading') { // complete or loading
      return;
    }

    tools.sandbox.sendMessage({action: 'tabOnUpdated', args: [tabId, changeInfo, tab]});
  },
  setState: function(state) {
    "use strict";
    chrome.tabs.onUpdated.removeListener(this.listener);
    if (state) {
      chrome.tabs.onUpdated.addListener(this.listener);
    }
  }
};
tools.dDblFileInclude = function(filename) {
  "use strict";
  var code = tools.engine.ext.getTextFile(filename);
  return ('if(!@sb){@sb=[];}if (@sb.indexOf("@fn") === -1) {@sb.push("{@fn}");\n' + code + '\n}')
    .replace(/@sb/g, 'window.sbScriptList').replace(/@fn/g, filename);
};
tools.callApi = (function () {
  var localFnList = {};
  var remoteFnList = {};
  var index = 0;

  var getTime = function () {
    return parseInt(Date.now() / 1000);
  };

  var gcTimeout = 0;
  var gc = function () {
    var now = getTime();
    if (gcTimeout < now) {
      var expire = 180;
      gcTimeout = now + expire;
      Object.keys(localFnList).forEach(function (id) {
        if (localFnList[id].t + expire < now) {
          delete localFnList[id];
        }
      });
    }
  };

  var assignFunctionId = function (fn) {
    var id;
    var item;
    for (var key in localFnList) {
      item = localFnList[key];
      if (item.fn === fn) {
        id = item.id;
        item.c++;
        break;
      }
    }
    if (!id) {
      id = ++index;
      localFnList[id] = {
        id: id,
        fn: fn,
        t: getTime(),
        c: 1
      };
    }
    gc();
    return id;
  };

  var getFunctionById = function (id) {
    var item = localFnList[id];
    return item && item.fn;
  };

  var removeFunctionById = function (id) {
    var item = localFnList[id];
    if (item) {
      if (--item.c === 0) {
        delete localFnList[id];
      }
    }
  };

  var getRemoteFn = function (id, isListener) {
    return function remoteFn() {
      var result = serializeArgs(arguments);
      var rArgs = result[0];
      var fnArr = result[1];
      tools.sandbox.sendMessage({
        action: 'callSbFuncById',
        id: id,
        args: rArgs
      }, fnArr.length && function (result) {
        if (!isListener || result !== true) {
          for (var i = 0, len = fnArr.length; i < len; i++) {
            removeFunctionById(fnArr[i]);
          }
        }
      });
      return true;
    };
  };

  var assignRemoteFunctionId = function (id, isListener) {
    var item = remoteFnList[id];
    if (!item) {
      item = remoteFnList[id] = {
        id: id,
        fn: getRemoteFn(id, isListener)
      };
    }
    return item && item.fn;
  };

  var serializeArgs = function (args) {
    var fnArr = [];
    var len = args.length;
    var argsArr = new Array(len);
    var obj;
    for (var i = 0; i < len; i++) {
      var value = args[i];
      if (typeof value === 'function') {
        obj = {t: 'f', v: assignFunctionId(value)};
        fnArr.push(obj.v);
      } else {
        obj = {t: 'v', v: value};
      }
      argsArr[i] = obj;
    }
    return [argsArr, fnArr];
  };

  var deSerializeArgs = function (rArgs) {
    return rArgs.map(function (item) {
      var type = item.t;
      var value = item.v;
      if (type === 'f') {
        var remoteFn;
        var listener = item.l;
        if (listener) {
          remoteFn = assignRemoteFunctionId(value, listener);
        } else {
          remoteFn = getRemoteFn(value);
        }
        return remoteFn;
      } else {
        return value;
      }
    });
  };

  var modify = {};
  modify['tabs.executeScript'] = function (args) {
    var details = args[1];
    if (details.file) {
      var filename = details.file;
      delete details.file;
      details.code = details.code || '';
      details.code += tools.dDblFileInclude(filename);
    }
  };
  modify['tabs.create'] = function (args) {
    var createProperties = args[0];
    if (createProperties.url.substr(0, 4) !== 'http') {
      createProperties.url = 'options.html#' + createProperties.url;
    }
  };
  modify['browserAction.setIcon'] = function (args) {
    var details = args[0];
    if (details) {
      var path = details.path;
      if (typeof path === 'string') {
        details.path = tools.localUrl2b64(path);
      } else
      if (typeof path === 'object') {
        for (var key in path) {
          path[key] = tools.localUrl2b64(path[key]);
        }
      }
    }
  };
  modify['storage.local.set'] = modify['storage.sync.set'] = function (args) {
    var details = args[0];
    if (details.hasOwnProperty('__chamelionStorage__')) {
      delete details.__chamelionStorage__;
    }
  };
  modify['storage.local.remove'] = modify['storage.sync.remove'] = function (args) {
    var details = args[0];
    if (Array.isArray(details)) {
      var pos = details.indexOf('__chamelionStorage__');
      if (pos !== -1) {
        details.splice(pos, 1);
      }
    } else
    if (details === '__chamelionStorage__') {
      args[0] = [];
    }
  };
  modify['storage.local.clear'] = modify['storage.sync.clear'] = function (args) {
    var _callback = args[0];
    args[0] = function () {
      tools.engine.save();
      _callback && _callback();
    };
  };

  var callCache = {};

  return {
    localFnList: localFnList,
    remoteFnList: remoteFnList,
    callFuncById: function (details, response) {
      var args = deSerializeArgs(details.args);
      var id = details.id;
      var fn = getFunctionById(id);
      fn.apply(null, args);
      removeFunctionById(id);
      return response();
    },
    callChromeApi: function (details) {
      var path = details.path;
      var args = deSerializeArgs(details.args);

      var modFn = modify[path];
      if (modFn) {
        modFn(args);
      }

      var func = callCache[path];

      if (!func) {
        var props = path.split('.');
        var ctx = null;
        func = chrome;
        while (props.length) {
          ctx = func;
          func = ctx[props.shift()];
        }

        func = callCache[path] = func.bind(ctx);
      }

      func.apply(null, args);
    }
  }
})();
tools.ls = {
  timeout: null,
  getStorage: function() {
    "use strict";
    return JSON.parse(JSON.stringify(localStorage));
  },
  updateStorage: function(time, newStorage) {
    "use strict";
    var key, value;
    var hasChanges = false;
    for (key in localStorage) {
      if (newStorage[key] === undefined) {
        localStorage.removeItem(key);
        hasChanges = true;
      }
    }

    for (key in newStorage) {
      if (!newStorage.hasOwnProperty(key)) {
        continue;
      }
      value = localStorage.getItem(key);
      if (value !== newStorage[key]) {
        localStorage.setItem(key, newStorage[key]);
        hasChanges = true;
      }
    }

    if (hasChanges) {
      var _this = this;
      _this.timeout && clearTimeout(_this.timeout);
      _this.timeout = setTimeout(function() {
        _this.timeout = null;
        chrome.runtime.sendMessage({action: 'sb', sub: 'localStorageUpdate', storage: _this.getStorage(), time: time});
      }, 50);
    }
  }
};
tools.onMessageFromFrame = function(msg, response) {
  "use strict";
  if (msg.action === 'callFuncById') {
    tools.callApi.callFuncById(msg, response);
  } else
  if (msg.action === 'callChromeApi') {
    tools.callApi.callChromeApi(msg);
  } else
  if (msg.action === 'xhr') {
    tools.vXhr.xhr(msg, response);
  } else
  if (msg.action === 'tabsOnUpdate') {
    tools.tabsOnUpdate.setState(msg.state);
  } else
  if (msg.action === 'xhrAbort') {
    tools.vXhr.xhrAbort(msg);
  } else
  if (msg.action === 'localStorageChange') {
    tools.ls.updateStorage(msg.time, msg.storage);
  }
};
tools.apiCacheToArray = function (api) {
  var pathList = [];
  var writeTemplate = function(obj, path) {
    for (var key in obj) {
      var pathKey = path + (path?'.':'') + key;
      var item = obj[key];
      var type = typeof item;
      if (type === 'object' && item !== null && !Array.isArray(item)) {
        writeTemplate(item, pathKey);
      } else
      if (item === '[Function]') {
        var arr = [path, key, item];
        if (['contextMenus.create',
            'contextMenus.update'
          ].indexOf(pathKey) !== -1) {
          arr.push('without **onclick** function, use chrome.contextMenus.**onClicked**');
        }
        if (['runtime.getBackgroundPage',
            'extension.getBackgroundPage'
          ].indexOf(pathKey) !== -1) {
          arr.push('background page only');
        }
        pathList.push(arr);
      } else {
        pathList.push([path, key, null]);
      }
    }
  };
  writeTemplate(api, '');
  return pathList;
};
tools.getApiTemplate = function() {
  "use strict";
  var skipKey = [
    // Unsupported functions name
    'prototype',
    'constructor'
  ];
  var skipFnKey = [
    // Unsupported functions name
    'addRules',
    'removeRules',
    'getRules'
  ];
  var skipFnPathKey = [
    // Exists functions
    'loadTimes', 'csi', 'Event',
    'app.getIsInstalled',
    'app.getDetailsForFrame',
    'app.runningState',
    'app.installState',
    // Unsupported api functions
    'extension.getViews',
    'extension.getExtensionTabs',
    'runtime.getPackageDirectoryEntry',
    'extension.setUpdateUrlData'
  ];
  var skipFnPath = [
    // Unsupported api objects
    'extension.onConnect',
    'runtime.onConnect',
    'extension.onConnectExternal',
    'runtime.onConnectExternal'
  ];
  var isEmptyObj = function (obj) {
    for (var key in obj) {
      return false;
    }
    return true;
  };

  var objectList = [];
  var mirrorList = [];

  var go = function (obj, path) {
    var cloneObj = {};
    var value;
    var pathKey;
    var subObj;
    var pos;
    for (var key in obj) {
      if (skipKey.indexOf(key) !== -1) {
        continue;
      }
      pathKey = path + (path?'.':'') + key;
      value = obj[key];

      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        pos = objectList.indexOf(value);
        if (pos === -1) {
          objectList.push(value);
          subObj = go(value, pathKey);
          if (!isEmptyObj(subObj)) {
            cloneObj[key] = subObj;
          }
          mirrorList.push(cloneObj[key]);
        } else {
          cloneObj[key] = mirrorList[pos];
        }
      } else
      if (typeof value === 'function') {
        if (
          skipFnKey.indexOf(key) !== -1 ||
          skipFnPathKey.indexOf(pathKey) !== -1 ||
          skipFnPath.indexOf(path) !== -1
        ) {
          continue;
        }
        cloneObj[key] = '[Function]';
      } else {
        cloneObj[key] = value;
      }
    }
    return cloneObj;
  };

  var api;
  var time = tools.getTime();
  var storage = tools.engine && tools.engine.storage || {};
  if (!storage.apiCache || storage.apiCache.expire < time) {
    api = go(chrome, '');
    api = JSON.parse(JSON.stringify(api));
    storage.apiCache = {
      expire: tools.getTime() + 86400 * 7,
      api: api
    };
    tools.engine && tools.engine.save();
  } else {
    api = storage.apiCache.api;
  }

  return api;
};
tools.setFavicon = function() {
  "use strict";
  var icon = tools.engine.ext.getIcon();

  if (!icon) {
    return;
  }

  var favicon = document.createElement('link');
  favicon.rel = 'icon';
  favicon.href = icon;
  document.head.appendChild(favicon);
};
tools.processManifestTemplate = function(text) {
  "use strict";
  var m = text.match(/^__MSG_(.+)__$/);
  m = m && m[1] || text;
  return m;
};