/**
 * Created by Anton on 17.06.2015.
 */
var chrome = window.chrome || {};
chrome.tabs = {};

chrome.windows = {};

chrome.i18n = {};
chrome.i18n.lang = {};

chrome.i18n.getUILanguage = function() {
  "use strict";
  return chrome.i18n.getUILanguage.data;
};

chrome.i18n.getMessage = function(word, substitutions) {
  "use strict";
  if (typeof word !== 'string' ||
    (substitutions && !Array.isArray(substitutions) && substitutions.length > 9)) {
    return undefined;
  }
  var value = chrome.i18n.lang[word] && chrome.i18n.lang[word].message || '';
  if (substitutions) {
    value = value.replace(/\$(\d+)/g, function(text, index) {
      return substitutions[index - 1] || text;
    });
  }
  return value;
};

chrome.runtime = chrome.runtime || {};
chrome.runtime.onMessage = {};
chrome.runtime.sendMessage = undefined;
chrome.runtime.getManifest = function() {
  "use strict";
  return JSON.parse(JSON.stringify(chrome.runtime.getManifest.data || {}));
};
chrome.runtime.getBackgroundPage = function(cb) {
  "use strict";
  cb(window);
};
chrome.runtime.getURL = function(path) {
  "use strict";
  return chrome.runtime.getURL.url + path;
};
chrome.runtime.getURL.url = '';
chrome.extension = {};
chrome.extension.onMessage = chrome.runtime.onMessage;
chrome.app = chrome.app || {};
chrome.app.getDetails = function() {
  "use strict";
  return JSON.parse(JSON.stringify(chrome.app.getDetails.data || {}));
};
chrome.extension.getURL = chrome.runtime.getURL;

(function() {
  "use strict";
  var debug = false;
  var debugLocalStorage = false;
  var debugLocalStorageSync = false;
  var debugReadyState = false;

  var getTime = function () {
    return parseInt(Date.now() / 1000);
  };

  var env = {
    sb: null,
    wrapMsgTools: function(sb) {
      var debug = false;
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
          return function callResponse(msg) {
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
        debug && console.log('sb send', message);
        if (cb) {
          message.callbackId = msgTools.getId();
          msgTools.wait(message.callbackId, cb);
        }
        sb.sendMessage.send(message);
      };

      sb.onMessage = function(cb) {
        sb.onMessage.on(function onMessage(message, response) {
          debug && console.log('sb msg', message);
          if (message.responseId) {
            msgTools.callCb(message);
          } else {
            cb(message.data, msgTools.mkResponse(response, message.callbackId));
          }
        });
      };
    },
    initSandbox: function() {
      var sb = {};

      this.wrapMsgTools(sb);

      var api = {
        mkResponse: function(source, origin) {
          return function sendMessageEvent(msg) {
            source.postMessage(JSON.parse(JSON.stringify({w:msg})).w, origin);
          }
        },
        on: function(cb) {
          var _this = this;
          window.addEventListener("message", function onMessageEvent(event) {
            var msg = event.data;
            var response = _this.mkResponse(event.source, event.origin);
            cb(msg, response);
          });
        },
        send: function(msg) {
          parent.postMessage(JSON.parse(JSON.stringify({w:msg})).w, '*');
        }
      };

      sb.onMessage.on = api.on.bind(api);
      sb.sendMessage.send = api.send.bind(api);

      return sb;
    },
    wrapXhr: function() {
      var parseXhrHeader = function(head) {
        if (!head) {
          return {};
        }
        head = head.replace(/\r?\n/g, '\n').split('\n');
        var obj = {};
        for (var i = 0, len = head.length; i < len; i++) {
          var keyValue = head[i].split(':');
          if (keyValue.length < 2) {
            continue;
          }
          var key = keyValue[0].trim().toLowerCase();
          obj[key] = keyValue[1].trim();
        }
        return obj;
      };
      window.sbXMLHttpRequest = function () {
        var xhr = {
          id: Date.now() + '_' + Math.floor((Math.random() * 10000) + 1)
        };

        var vXhr = {};
        vXhr.abort = function() {
          if (vXhr.hasOwnProperty('status')) return;
          env.sb.sendMessage({action: 'xhrAbort', id: xhr.id});
        };
        vXhr.open = function(method, url, async) {
          xhr.method = method;
          xhr.url = url;
          xhr.async = async;
        };
        var postProcess = function(a){return a;};
        vXhr.overrideMimeType = function(mimeType) {
          if (mimeType === 'text/xml') {
            postProcess = function(a) {
              var parser=new DOMParser();
              vXhr.responseXML = parser.parseFromString(a, 'text/xml');
              return vXhr.responseXML;
            };
            postProcess.mimeType = mimeType;
            vXhr.responseType = 'text';
          } else {
            xhr.mimeType = mimeType;
          }
        };
        vXhr.setRequestHeader = function(key, value) {
          if (!xhr.headers) {
            xhr.headers = {};
          }
          xhr.headers[key] = value;
        };
        vXhr.send = function(data) {
          xhr.data = data;
          xhr.timeout = vXhr.timeout;
          xhr.responseType = vXhr.responseType;

          env.sb.sendMessage({action: 'xhr', data: xhr}, function xhrResponse(xhr) {
            vXhr.status = xhr.status;
            vXhr.statusText = xhr.statusText;
            vXhr.responseURL = xhr.responseURL;
            vXhr.readyState = xhr.readyState;

            vXhr.getAllResponseHeaders = function() {
              return xhr.responseHeaders;
            };
            vXhr.getResponseHeader = function(name) {
              name = name.toLowerCase();
              if (vXhr.responseHeaders === undefined) {
                vXhr.responseHeaders = parseXhrHeader(xhr.responseHeaders);
              }
              return vXhr.responseHeaders[name];
            };

            if (xhr.responseType) {
              vXhr.response = postProcess(xhr.response);
            } else {
              vXhr.responseText = xhr.responseText;
            }

            vXhr.onreadystatechange && vXhr.onreadystatechange();

            if (vXhr[xhr.cbType]) {
              vXhr[xhr.cbType](vXhr);
            }
          });
        };
        return vXhr;
      };
    },
    debounce: function(func, wait, immediate) {
      var timeout;
      return function() {
        var context = this, args = arguments;
        var later = function() {
          timeout = null;
          if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
      };
    },
    localStorage: {
      syncChangesDebounce: null,
      syncChanges: function() {
        debugLocalStorageSync && console.debug('syncChangesDebounce');

        if (this.syncChangesDebounce) {
          return this.syncChangesDebounce();
        }

        var _this = this;

        this.syncChangesDebounce = env.debounce(function(){
          debugLocalStorageSync && console.debug('sendChanges');

          var time = _this.lastSyncTime = Date.now();
          env.sb.sendMessage({action: 'localStorageChange', storage: _this.storage, time: time});
        }, 50);

        this.syncChangesDebounce();
      },
      storage: Object.create(Object.defineProperties({
        getItem: function(key) {
          debugLocalStorage && console.debug('getItem', key);

          if (arguments.length < 1) {
            throw "1 arguments required, but only 0 present.";
          }

          var value = null;
          if (this.hasOwnProperty(key) && typeof this[key] === 'string') {
            value = this[key];
          }
          return value;
        },
        setItem: function(key, value) {
          debugLocalStorage && console.debug('setItem', key, value);

          if (arguments.length < 2) {
            throw "2 arguments required, but only 1 present.";
          }

          this[key] = String(value);
        },
        removeItem: function(key) {
          debugLocalStorage && console.debug('removeItem', key);

          if (arguments.length < 1) {
            throw "1 arguments required, but only 0 present.";
          }

          if (this.hasOwnProperty(key)) {
            delete this[key];
          }
        },
        clear: function() {
          debugLocalStorage && console.debug('clear');

          for (var key in this) {
            if (this.hasOwnProperty(key)) {
              delete this[key];
            }
          }
        },
        key: function(index) {
          debugLocalStorage && console.debug('key', index);

          if (arguments.length < 1) {
            throw "1 arguments required, but only 0 present.";
          }

          var key = Object.keys(this)[index];

          var value = null;
          if (this.hasOwnProperty(key)) {
            value = key;
          }
          return value;
        }
      }, {
        length: {
          get: function () {
            return Object.keys(this).length;
          },
          set: function() {}
        }
      })),
      onChange: {
        set: function(obj, prop, value) {
          debugLocalStorageSync && console.debug('set', prop, value);

          var _this = env.localStorage;

          var oldValue = obj.getItem(prop);

          obj.setItem(prop, value);
          var currentValue = obj.getItem(prop);

          if (oldValue !== currentValue) {
            _this.syncChanges();
          }

          return true;
        },
        deleteProperty: function(obj, prop) {
          debugLocalStorageSync && console.debug('delete', prop);

          var _this = env.localStorage;

          var oldValue = obj.getItem(prop);

          obj.removeItem(prop);
          var currentValue = obj.getItem(prop);

          if (oldValue !== currentValue) {
            _this.syncChanges();
          }

          return true;
        }
      },
      origStorage: {},
      addWatcher: function() {
        var change, i, hasChanges, origStorage, value;
        var _this = this;
        var storage = this.storage;
        Object.observe(storage, function(changeList) {
          hasChanges = false;
          origStorage = _this.origStorage;
          for (change, i = 0; change = changeList[i]; i++) {
            value = storage.getItem(change.name);
            if (['add', 'update'].indexOf(change.type) !== -1) {
              if (typeof storage[change.name] !== 'string') {
                storage[change.name] = String(storage[change.name]);
                continue;
              }
              if (origStorage[change.name] !== value) {
                debugLocalStorageSync && console.debug('set', change.name, value);

                origStorage[change.name] = value;
                hasChanges = true;
              }
            } else
            if (change.type === 'delete') {
              if (origStorage[change.name] !== undefined) {
                debugLocalStorageSync && console.debug('delete', change.name);

                delete origStorage[change.name];
                hasChanges = true;
              }
            }
          }

          hasChanges && _this.syncChanges();
        });
      },
      create: function(time, origStorage) {
        debugLocalStorageSync && console.debug('create', origStorage);

        this.sync(time, origStorage);

        if (typeof Proxy !== 'undefined') {
          window.sbLocalStorage = new Proxy(this.storage, this.onChange);
        } else {
          window.sbLocalStorage = this.storage;
          this.origStorage = origStorage;
          this.addWatcher();
        }

        try {
          delete window.localStorage;
          window.localStorage = window.sbLocalStorage;
        } catch (e){}
      },
      lastSyncTime: 0,
      sync: function(time, origStorage) {
        debugLocalStorageSync && console.debug('sync', origStorage);

        if (this.lastSyncTime >= time) {
          debugLocalStorageSync && console.debug('syncTimeout');
          return;
        }
        this.lastSyncTime = time;

        var key = null;

        this.origStorage = origStorage;

        for (key in this.storage) {
          if (!this.storage.hasOwnProperty(key)) {
            continue;
          }
          if (!origStorage.hasOwnProperty(key)) {
            this.storage.removeItem(key);
          }
        }

        for (key in origStorage) {
          if (!origStorage.hasOwnProperty(key)) {
            continue;
          }
          if (typeof this.storage[key] === 'function' && !this.storage.hasOwnProperty(key)) {
            continue;
          }
          this.storage.setItem(key, origStorage[key]);
        }
      }
    },
    preloadCode: function() {
      env.wrapXhr();
      var lsFunc = function() {
        var localStorage = window.sbLocalStorage;
        var XMLHttpRequest = window.sbXMLHttpRequest;
      };
      lsFunc = lsFunc.toString();
      var pos = lsFunc.indexOf('{') + 1;
      return lsFunc.substr(pos, lsFunc.lastIndexOf('}') - pos);
    },
    callApi: (function () {
      var localFnList = {};
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
            var item = localFnList[id];
            if (!item.l && item.t + expire < now) {
              delete localFnList[id];
            }
          });
        }
      };

      var assignFunctionId = function (fn, isListener) {
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
          if (isListener) {
            id = 'listener_' + id;
          }
          localFnList[id] = {
            id: id,
            fn: fn,
            t: getTime(),
            l: isListener,
            c: 1
          };
        }
        gc();
        return id;
      };

      var removeFunctionById = function (id) {
        var item = localFnList[id];
        if (item && !item.l) {
          if (--item.c === 0) {
            delete localFnList[id];
          }
        }
      };

      var getFunctionById = function (id) {
        var item = localFnList[id];
        return item && item.fn;
      };

      var getRemoteFn = function (id) {
        return function remoteFn() {
          var result = serializeArgs(arguments);
          var rArgs = result[0];
          var fnArr = result[1];
          sb.sendMessage({
            action: 'callFuncById',
            id: id,
            args: rArgs
          }, fnArr.length && function () {
            for (var i = 0, len = fnArr.length; i < len; i++) {
              removeFunctionById(fnArr[i]);
            }
          });
          return true;
        };
      };

      var serializeArgs = function (args, isListener) {
        var fnArr = [];
        var len = args.length;
        var argsArr = new Array(len);
        var obj;
        for (var i = 0; i < len; i++) {
          var value = args[i];
          if (typeof value === 'function') {
            obj = {t: 'f', v: assignFunctionId(value, isListener), l: isListener};
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
            return getRemoteFn(value);
          } else {
            return value;
          }
        });
      };

      return {
        localFnList: localFnList,
        pathListeners: {},
        getListenerFn: function (details, funcPath, funcName) {
          var _this = this;
          var listeners = _this.pathListeners[funcPath];
          if (!listeners) {
            listeners = _this.pathListeners[funcPath] = [];
          }
          var remoteFn = _this.getRemoteFn(details);
          switch (funcName) {
            case 'addListener': return function addListener(listener) {
              if (listeners.indexOf(listener) === -1) {
                listeners.push(listener);
              }
              remoteFn.apply(null, arguments);
            };
            case 'removeListener': return function removeListener(listener) {
              var pos = listeners.indexOf(listener);
              if (pos !== -1) {
                listeners.splice(pos, 1);
              }
              remoteFn.apply(null, arguments);
            };
            case 'hasListener': return function hasListener(listener) {
              return listeners.indexOf(listener) !== -1;
            };
            case 'hasListeners': return function hasListeners() {
              return listeners.length > 0;
            };
            case 'dispatch': return function dispatch() {};
            case 'dispatchToListener': return function dispatchToListener() {};
          }
        },
        callSbFuncById: function (details, response) {
          var args = deSerializeArgs(details.args);
          var id = details.id;
          var fn = getFunctionById(id);
          var result = fn.apply(null, args);
          removeFunctionById(id);
          return response(result);
        },
        getRemoteFn: function (details) {
          return function callApi() {
            var remoteArgs = serializeArgs(arguments, details.isListener)[0];
            sb.sendMessage({action: 'callChromeApi', path: details.fullPath, args: remoteArgs});
          }
        }
      };
    })()
  };

  var sb = env.sb = env.initSandbox(window);
  env.preloadCode = env.preloadCode();

  var pageReady = function(scriptFunc) {
    debugReadyState && console.debug('loading');

    if (document.readyState === 'loading') {
      return scriptFunc();
    }

    // loading, interactive, complete
    var customReadyState = 'loading';
    var setCustomReadyState = function() {
      debugReadyState && console.debug('setCustomReadyState');

      Object.defineProperties(document, {
        readyState: {
          get: function(){
            return customReadyState;
          },
          set: function(){}
        }
      });
    };

    var setReadyState = function(state) {
      debugReadyState && console.debug('setReadyState', state);

      customReadyState = state;

      document.onreadystatechange && document.onreadystatechange();

      if (customReadyState === 'interactive') {
        document.dispatchEvent(new CustomEvent('DOMContentLoaded', {bubbles: true, cancelable: false}));
      }

      if (customReadyState === 'complete') {
        window.dispatchEvent(new CustomEvent('load', {bubbles: false, cancelable: false}));
      }
    };

    var onComplete = function() {
      debugReadyState && console.debug('onComplete');

      setCustomReadyState();

      scriptFunc();

      setReadyState('interactive');

      setTimeout(function () {
        setReadyState('complete');
      }, 0);
    };

    if (document.readyState === 'complete') {
      return onComplete();
    }

    onComplete = (function(origCb) {
      document.removeEventListener('load', onComplete);

      return origCb();
    }).bind(null, onComplete);

    document.addEventListener('load', onComplete);
  };

  var tabOnUpdated = {
    cbList: [],
    onTabUpdate: function(tabId, changeInfo, tab) {
      for (var i = 0, func; func = this.cbList[i]; i++) {
        func(tabId, changeInfo, tab);
      }
    },
    addListener: function(cb) {
      this.cbList.push(cb);
      this.checkListening();
    },
    removeListener: function(cb) {
      this.cbList.splice(this.cbList.indexOf(cb), 1);
      this.checkListening();
    },
    checkListening: function() {
      sb.sendMessage({action: 'tabsOnUpdate', state: !!this.cbList.length});
    }
  };
  chrome.tabs.onUpdated = {};
  chrome.tabs.onUpdated.addListener = tabOnUpdated.addListener.bind(tabOnUpdated);
  chrome.tabs.onUpdated.removeListener = tabOnUpdated.removeListener.bind(tabOnUpdated);

  var popupResizeMonitor = function() {
    var lastWidth = 0;
    var lastHeight = 0;

    var onTimer = function() {
      var bodyStyle = window.getComputedStyle(document.body);
      var htmlStyle = window.getComputedStyle(document.body.parentNode);
      var width = parseFloat(bodyStyle.width) || parseFloat(htmlStyle.width)
        || document.body.offsetWidth || document.body.scrollWidth;
      var height = parseFloat(bodyStyle.height) || parseFloat(htmlStyle.height)
        || document.body.offsetHeight || document.body.scrollHeight;

      if (lastWidth === width && lastHeight === height) {
        return;
      }

      env.sb.sendMessage({
        action: 'resizePopup',
        width: width,
        height: height
      }, function(ready) {
        if (ready) {
          lastWidth = width;
          lastHeight = height;
        }
      });
    };

    onTimer();

    setTimeout(function() {
      onTimer();
    }, 150);

    clearInterval(popupResizeMonitor.interval);
    popupResizeMonitor.interval = setInterval(onTimer, 1000);

    window.addEventListener('resize', function() {
      onTimer();
    });
  };

  var bindApi = function (api) {
    var listenerList = ['addListener', 'removeListener', 'hasListener'
      , 'hasListeners', 'dispatch', 'dispatchToListener'
    ];
    var go = function (obj, cloneObj, path) {
      var value;
      var pathKey;
      var details;
      var isListener;
      for (var key in obj) {
        pathKey = path + (path?'.':'') + key;
        value = obj[key];
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          if (!cloneObj.hasOwnProperty(key)) {
            cloneObj[key] = {};
          }
          go(value, cloneObj[key], pathKey);
        } else
        if (cloneObj[key] === undefined) {
          if (value === '[Function]') {
            isListener = listenerList.indexOf(key) !== -1;
            details = {
              fullPath: pathKey,
              isListener: isListener
            };
            if (isListener) {
              cloneObj[key] = env.callApi.getListenerFn(details, path, key);
            } else {
              cloneObj[key] = env.callApi.getRemoteFn(details);
            }
          } else {
            cloneObj[key] = value;
          }
        }
      }
    };
    go(api, chrome, '');
    if (location.hash !== '#bg') {
      delete chrome.runtime.getBackgroundPage;
      delete chrome.extension.getBackgroundPage;
    }
  };

  sb.onMessage(function execMessageCommand(msg, response) {
    if (msg.action === 'callSbFuncById') {
      env.callApi.callSbFuncById(msg, response);
    } else
    if (msg.action === 'tabOnUpdated') {
      tabOnUpdated.onTabUpdate.apply(tabOnUpdated, msg.args);
    } else
    if (msg.action === 'exec') {
      pageReady(function pageReady() {
        (new Function('', env.preloadCode + msg.script))();
      });
    } else
    if (msg.action === 'i18n') {
      chrome.i18n.lang = msg.lang;
    } else
    if (msg.action === 'setManifest') {
      chrome.runtime.getManifest.data = msg.data;
    } else
    if (msg.action === 'setDetails') {
      chrome.app.getDetails.data = msg.data;
    } else
    if (msg.action === 'setUILanguage') {
      chrome.i18n.getUILanguage.data = msg.data;
    } else
    if (msg.action === 'setHtmlContent') {
      document.head.parentNode.innerHTML = msg.html;
    } else
    if (msg.action === 'setStyle') {
      var style = document.createElement('style');
      style.textContent = msg.css;
      document.head.appendChild(style);
    } else
    if (msg.action === 'isPopup') {
      window.close = function() {
        sb.sendMessage({action: 'closePopup'});
      };
    } else
    if (msg.action === 'chromeApi') {
      bindApi(msg.api);
    } else
    if (msg.action === 'getPopupSize') {
      popupResizeMonitor();
    } else
    if (msg.action === 'getPageTitle') {
      response(document.title);
    } else
    if (msg.action === 'setLocalStorage') {
      env.localStorage.create(msg.time, msg.storage);
    } else
    if (msg.action === 'localStorageUpdate') {
      env.localStorage.sync(msg.time, msg.storage);
    } else
    if (msg.action === 'setURL') {
      chrome.runtime.getURL.url = msg.url;
    }
  });
})();
