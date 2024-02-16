/**
 * Created by Anton on 22.06.2015.
 */
(function() {
  "use strict";
  var opera = {
    color: '-webkit-linear-gradient(top,#29b8e0 0,#0669bb 100%)',
    run: function() {
      var href = location.href;
      if (!/\/extensions\/details\//.test(href)) {
        return;
      }

      var ctr = document.querySelector('.sidebar > .get-opera');
      if (ctr) {
        ctr = ctr.parentNode;
      }
      var slug = document.querySelector('meta[property="aoc:slug"]');
      var appId = document.querySelector('meta[property="aoc:app_id"]');
      slug = slug && slug.getAttribute('content');
      appId = appId && appId.getAttribute('content');

      if (!ctr || !slug || !appId) {
        return;
      }

      var installBtn = document.createElement('div');
      installBtn.href = '#';
      installBtn.textContent = 'Add to Chameleon';
      installBtn.classList.add("btn-install");
      installBtn.classList.add("chameleon-btn");
      installBtn.classList.add("btn-with-plus");
      installBtn.dataset.i18nInstalling = "Installing";
      installBtn.dataset.i18nInstalled = "Installed";
      installBtn.dataset.i18nError = "Error";
      installBtn.dataset.i18nInstallError = "Installing error:";
      installBtn.style.margin = "15px 0";
      installBtn.style.background = opera.color;
      installBtn.style.cursor = 'pointer';
      installBtn.addEventListener('click', opera.onBtnClick.bind(installBtn, slug));

      chrome.extension.sendMessage({action: 'sb', sub: 'getAppId'}, function(data) {
        if (data.appId === appId) {
          installBtn.classList.add('installed');
          installBtn.textContent = installBtn.dataset.i18nInstalled;
        }
        if (location.hash === '#chameleon-install') {
          location.hash = '';
          if (!data.hasExt) {
            installBtn.dispatchEvent(new CustomEvent('click', {cancelable: true, bubbles: false}));
          }
        }

        opera.rmOldBtn();
        ctr.appendChild(installBtn);
      });
    }
  };
  opera.rmOldBtn = function() {
    var exBtn = document.querySelector('.chameleon-btn');
    if (exBtn) {
      exBtn.parentNode.removeChild(exBtn);
      exBtn = null;
    }
  };
  opera.onMessage = function(msg) {
    if (msg.action !== 'sb' && msg.sub !== 'installStatus') {
      return;
    }
    chrome.extension.onMessage.removeListener(opera.onMessage);

    this.classList.remove('progress');

    if (msg.status === 'error') {
      this.classList.add('error');
      this.textContent = this.dataset.i18nInstallError + ' ' + msg.text;
    } else {
      this.classList.add('installed');
      this.textContent = this.dataset.i18nInstalled;
      this.style.background = opera.color;
    }
  };
  opera.onBtnClick = function(slug, e) {
    e.preventDefault();
    e.stopPropagation();
    if (this.classList.contains('progress')) {
      return;
    }

    opera.ping(function() {
      this.classList.remove('installed');
      this.classList.remove('error');
      this.classList.add('progress');

      this.style.background = null;

      this.textContent = this.dataset.i18nInstalling;

      chrome.extension.onMessage.addListener(opera.onMessage.bind(this));

      chrome.extension.sendMessage({action: 'sb', sub: 'install', slug: slug});
    }.bind(this));
  };
  opera.ping = function(cb) {
    try {
      chrome.extension.sendMessage({action: 'sb', sub: 'ping'}, cb);
    } catch(e) {
      location.hash = '#chameleon-install';
      location.reload();
    }
  };
  opera.run();
})();