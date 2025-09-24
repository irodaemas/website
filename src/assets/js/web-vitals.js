const dataLayer = window.dataLayer || (window.dataLayer = []);

function sendToDataLayer(metric){
  const name = metric && metric.name ? metric.name : 'metric';
  const delta = metric && typeof metric.delta === 'number' ? metric.delta : 0;
  const id = metric && metric.id ? metric.id : generateMetricId(name);
  const attribution = metric && metric.attribution ? metric.attribution : {};
  dataLayer.push({
    event: 'web-vitals',
    event_category: 'Web Vitals',
    event_action: name,
    event_value: Math.round(name === 'CLS' ? delta * 1000 : delta),
    event_label: id,
    ...attribution
  });
}

function generateMetricId(name){
  const prefix = name || 'metric';
  return prefix + '-' + Date.now() + '-' + Math.floor(Math.random() * 900000 + 100000);
}

function whenDocumentHidden(callback){
  if(typeof document === 'undefined'){
    return function noop(){};
  }
  let triggered = false;
  function onHidden(event){
    if(triggered) return;
    if(event.type === 'pagehide' || document.visibilityState === 'hidden'){
      triggered = true;
      removeEventListener('visibilitychange', onHidden, true);
      removeEventListener('pagehide', onHidden, true);
      callback(event);
    }
  }
  addEventListener('visibilitychange', onHidden, true);
  addEventListener('pagehide', onHidden, true);
  if(document.visibilityState === 'hidden'){
    onHidden({type: 'visibilitychange'});
  }
  return function stop(){
    triggered = true;
    removeEventListener('visibilitychange', onHidden, true);
    removeEventListener('pagehide', onHidden, true);
  };
}

function observe(type, options, handler){
  if(typeof PerformanceObserver === 'undefined') return null;
  try {
    const observer = new PerformanceObserver(function(list){
      handler(list.getEntries());
    });
    observer.observe(Object.assign({type: type, buffered: true}, options || {}));
    return observer;
  } catch(err) {
    return null;
  }
}

function onCLS(callback){
  let value = 0;
  let entries = [];
  let sessionValue = 0;
  let sessionEntries = [];
  const id = generateMetricId('CLS');
  const observer = observe('layout-shift', null, function(observed){
    observed.forEach(function(entry){
      if(entry.hadRecentInput) return;
      const lastEntry = sessionEntries[sessionEntries.length - 1];
      const firstEntry = sessionEntries[0];
      const gapMoreThan1s = lastEntry && (entry.startTime - lastEntry.startTime > 1000);
      const sessionLongerThan5s = firstEntry && (entry.startTime - firstEntry.startTime > 5000);
      if(gapMoreThan1s || sessionLongerThan5s){
        sessionValue = 0;
        sessionEntries = [];
      }
      sessionValue += entry.value;
      sessionEntries.push(entry);
      if(sessionValue > value){
        value = sessionValue;
        entries = sessionEntries.slice();
      }
    });
  });

  const report = function(){
    if(observer) observer.disconnect();
    const lastEntry = entries[entries.length - 1];
    const attribution = {};
    if(lastEntry){
      attribution.largestShiftValue = value || 0;
      attribution.largestShiftTime = lastEntry.startTime || 0;
      if(lastEntry.sources && lastEntry.sources.length){
        const source = lastEntry.sources[0];
        const node = source.node || source.element || null;
        if(node && node.tagName){
          attribution.largestShiftTarget = node.tagName.toLowerCase();
        } else if(source.id){
          attribution.largestShiftTarget = source.id;
        } else if(source.node && source.node.className){
          attribution.largestShiftTarget = String(source.node.className).split(/\s+/)[0];
        }
      }
    }
    callback({name: 'CLS', delta: value, id: id, attribution: attribution});
  };

  if(!observer){
    callback({name: 'CLS', delta: value, id: id, attribution: {}});
    return;
  }

  whenDocumentHidden(report);
}

function onFID(callback){
  const id = generateMetricId('FID');
  const observer = observe('first-input', null, function(entries){
    const entry = entries && entries[0];
    if(!entry) return;
    if(observer) observer.disconnect();
    const value = entry.processingStart > 0 ? entry.processingStart - entry.startTime : entry.duration;
    const node = entry.target || null;
    const attribution = {
      eventTarget: node && node.tagName ? node.tagName.toLowerCase() : '',
      eventType: entry.name
    };
    callback({name: 'FID', delta: value, id: id, attribution: attribution});
  });

  if(!observer){
    callback({name: 'FID', delta: 0, id: id, attribution: {}});
    return;
  }

  whenDocumentHidden(function(){
    if(observer) observer.disconnect();
  });
}

function onLCP(callback){
  const id = generateMetricId('LCP');
  let lastEntry = null;
  const observer = observe('largest-contentful-paint', null, function(entries){
    if(entries && entries.length){
      lastEntry = entries[entries.length - 1];
    }
  });

  const report = function(){
    if(observer) observer.disconnect();
    if(!lastEntry){
      callback({name: 'LCP', delta: 0, id: id, attribution: {}});
      return;
    }
    const value = lastEntry.startTime || 0;
    const element = lastEntry.element || null;
    const attribution = {
      element: element && element.tagName ? element.tagName.toLowerCase() : '',
      url: lastEntry.url || (element && (element.currentSrc || element.src)) || '',
      size: lastEntry.size
    };
    const navEntries = (typeof performance !== 'undefined' && performance.getEntriesByType) ? performance.getEntriesByType('navigation') : [];
    const navEntry = navEntries && navEntries[0];
    if(navEntry){
      const ttfb = navEntry.responseStart || 0;
      attribution.timeToFirstByte = ttfb;
      attribution.resourceLoadDelay = Math.max(0, value - ttfb);
    }
    callback({name: 'LCP', delta: value, id: id, attribution: attribution});
  };

  if(!observer){
    callback({name: 'LCP', delta: 0, id: id, attribution: {}});
    return;
  }

  whenDocumentHidden(report);
}

onCLS(sendToDataLayer);
onFID(sendToDataLayer);
onLCP(sendToDataLayer);
