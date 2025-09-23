import {onCLS, onFID, onLCP} from 'https://unpkg.com/web-vitals@3/dist/web-vitals.attribution.js?module';

const dataLayer = window.dataLayer || (window.dataLayer = []);

function sendToDataLayer({name, delta, id, attribution}) {
  dataLayer.push({
    event: 'web-vitals',
    event_category: 'Web Vitals',
    event_action: name,
    event_value: Math.round(name === 'CLS' ? delta * 1000 : delta),
    event_label: id,
    ...attribution,
  });
}

onCLS(sendToDataLayer);
onFID(sendToDataLayer);
onLCP(sendToDataLayer);
