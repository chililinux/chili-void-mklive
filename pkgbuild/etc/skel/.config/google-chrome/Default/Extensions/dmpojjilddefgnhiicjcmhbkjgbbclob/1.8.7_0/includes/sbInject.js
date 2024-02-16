/**
 * Created by Anton on 17.06.2015.
 */
chrome.runtime.sendMessage({action: 'sb', sub: 'getCode', page: {url: location.href}}, function(msg) {
  if (msg && msg.action === 'sb' && msg.sub === 'code' && msg.data) {
    if (msg.i18n) {
      var lang = msg.i18n;
      var prevFunction = chrome.i18n.getMessage.bind(chrome.i18n);
      chrome.i18n.getMessage = function(word, substitutions) {
        if (!lang.hasOwnProperty(word)) {
          return prevFunction.apply(null, arguments);
        }
        if (typeof word !== 'string' ||
          (substitutions && !Array.isArray(substitutions) && substitutions.length > 9)) {
          return undefined;
        }
        var value = lang[word] && lang[word].message;
        if (substitutions) {
          value = value.replace(/\$(\d+)/g, function (text, index) {
            return substitutions[index - 1] || text;
          });
        }
        return value;
      };
    }
    if (msg.data.css) {
      var style = document.createElement('style');
      style.textContent = msg.data.css;
      document.body.appendChild(style);
    }
    if (msg.data.js) {
      (new Function('', msg.data.js))();
    }
  }
});