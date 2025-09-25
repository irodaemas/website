(function(w, d, s, l, i) {
  w[l] = w[l] || [];
  w[l].push({
    'gtm.start': new Date().getTime(),
    event: 'gtm.js'
  });

  var loaded = false;
  var events = ['scroll', 'pointerdown', 'keydown'];
  var opts = {
    once: true,
    passive: true
  };

  function cleanup() {
    events.forEach(function(evt) {
      d.removeEventListener(evt, trigger, opts);
    });
  }

  function loadGTM() {
    if (loaded) {
      return;
    }
    loaded = true;
    cleanup();

    var f = d.getElementsByTagName(s)[0];
    var j = d.createElement(s);
    var dl = l !== 'dataLayer' ? '&l=' + l : '';
    j.async = true;
    j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
    f.parentNode.insertBefore(j, f);
  }

  function trigger() {
    loadGTM();
  }

  events.forEach(function(evt) {
    d.addEventListener(evt, trigger, opts);
  });

  if (w.requestIdleCallback) {
    w.requestIdleCallback(function() {
      loadGTM();
    }, {
      timeout: 4000
    });
  } else {
    w.setTimeout(loadGTM, 4000);
  }
})(window, document, 'script', 'dataLayer', 'GTM-5D39RVL3');
