// Extracted from inline scripts in index.html

/* istanbul ignore next */
(function(){
  // ---- Scroll progress + Parallax (class-based; minimize reflow) ----
  var bar = document.querySelector('.scroll-progress');
  var hero = document.querySelector('.hero');
  var lastSP = -1, lastPar = -1, ticking = false, maxScroll = 1;
  function recalc(){
    var h = document.documentElement;
    maxScroll = Math.max(1, h.scrollHeight - h.clientHeight);
  }
  function onScroll(){
    if(ticking) return; ticking = true;
    requestAnimationFrame(function(){
      var h = document.documentElement;
      var p = (h.scrollTop / maxScroll) * 100;
      var sp = Math.max(0, Math.min(20, Math.round(p/5))); // 0..20
      if(bar && sp !== lastSP){ if(lastSP>=0) bar.classList.remove('sp-'+lastSP); bar.classList.add('sp-'+sp); lastSP = sp; }
      // Parallax hero translate mapped to classes (no inline style)
      var y = h.scrollTop || document.body.scrollTop; var par = Math.max(0, Math.min(20, Math.round(Math.min(40, y*0.04)/2)));
      if(hero && par !== lastPar){ if(lastPar>=0) hero.classList.remove('par-'+lastPar); hero.classList.add('par-'+par); lastPar = par; }
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  window.addEventListener('resize', function(){ recalc(); onScroll(); }, {passive:true});
  document.addEventListener('prices:updated', function(){ recalc(); onScroll(); });
  recalc(); onScroll();

  // ---- WA click pulse (no inline styles) ----
  document.querySelectorAll('a[href^="https://wa.me"], [data-track^="wa-"]').forEach(function(el){
    el.addEventListener('click', function(){
      el.classList.add('pulse');
      setTimeout(function(){ el.classList.remove('pulse'); }, 500);
    });
  });

  // ---- Hover tilt (desktop only) ----
  if(window.matchMedia && window.matchMedia('(pointer:fine)').matches){
    var cards = document.querySelectorAll('.feature, .t-card');
    cards.forEach(function(card){
      var rect;
      card.addEventListener('mouseenter', function(){ rect = card.getBoundingClientRect(); });
      card.addEventListener('mousemove', function(ev){
        if(!rect) rect = card.getBoundingClientRect();
        var px = (ev.clientX - rect.left)/rect.width - .5;
        var py = (ev.clientY - rect.top)/rect.height - .5;
        var rx = (py * -4); var ry = (px * 6);
        card.style.transform = 'perspective(700px) rotateX('+rx+'deg) rotateY('+ry+'deg) translateZ(0)';
      });
      card.addEventListener('mouseleave', function(){ card.style.transform = 'none'; });
    });
  }
})();

/* istanbul ignore next */
(function(){
  const ease = function (t) {
    return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t
  };

  function animateNumber(el, to, duration){
    const from = Number(el.getAttribute('data-from') || 0);
    let start = null;
    el.classList.add('pulse');
    function step(ts){
      if(!start) start = ts;
      const p = Math.min(1, (ts - start) / duration);
      const v = Math.round(from + (to - from) * ease(p));
      el.textContent = v.toLocaleString('id-ID');
      if(p<1){ requestAnimationFrame(step); return; }
      el.textContent = to.toLocaleString('id-ID');
      el.classList.remove('pulse');
      el.setAttribute('data-from', to);
    }
    requestAnimationFrame(step);
  }

  // Observe numbers on first view
  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        const el = e.target;
        const to = Number(el.getAttribute('data-to') || 0);
        animateNumber(el, to, 900);
        io.unobserve(el);
      }
    });
  }, {threshold: .3});
  document.querySelectorAll('.count, .num').forEach(function(n){ io.observe(n); });

  // Re-animate numbers after price table refresh
  document.addEventListener('prices:updated', function(){
    document.querySelectorAll('.num').forEach(function(n){
      const to = Number(n.getAttribute('data-to') || 0);
      if(!n.getAttribute('data-from')) n.setAttribute('data-from', '0');
      animateNumber(n, to, 800);
    });
  });
})();

// Fallback untuk gambar/video + lazy load + reveal + date badge + typewriter
/* istanbul ignore next */
(function(){
  const placeholder = 'data:image/svg+xml;charset=utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 480">\
      <defs>\
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">\
          <stop offset="0" stop-color="#D4AF37"/><stop offset="1" stop-color="#013D39"/>\
        </linearGradient>\
      </defs>\
      <rect width="800" height="480" fill="url(#g)"/>\
      <text x="50%" y="52%" font-family="Inter,Arial" font-size="28" fill="white" text-anchor="middle">Roda Emas Indonesia</text>\
    </svg>'
  );
  // Seed placeholder for LQIP images
  document.querySelectorAll('img[data-src]').forEach(function(img){ if(!img.src) img.src = placeholder; });
  document.querySelectorAll('img').forEach(function(img){
    img.addEventListener('error', function(){ img.src = placeholder; img.style.objectFit = 'cover'; img.style.background = '#013D39'; }, { once: true });
  });
  // Videos
  document.querySelectorAll('video').forEach(function(v){
    try{ v.setAttribute('poster', placeholder); }catch(e){}
    v.addEventListener('error', function(){ const img = document.createElement('img'); img.src = placeholder; img.alt = 'video unavailable'; img.style.objectFit='cover'; img.style.background='#013D39'; v.replaceWith(img); }, { once: true });
    try{ v.removeAttribute('controls'); v.controls = false; }catch(e){}
    v.muted = true; v.loop = true; v.playsInline = true; v.classList.add('reveal');
  });
  // Autoplay/pause when visible
  try{
    const vio = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{ const vid = e.target; if(e.isIntersecting){ if(vid.preload !== 'auto'){ vid.preload = 'auto'; } vid.play().catch(()=>{}); } else { vid.pause(); } });
    }, {threshold: 0.5});
    document.querySelectorAll('video').forEach(v=>vio.observe(v));
  }catch(_){}
  // Lazy load images with blur-up
  try{
    const iio = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{ if(!e.isIntersecting) return; const img = e.target; const real = img.getAttribute('data-src'); if(real){ img.addEventListener('load', function(){ img.classList.add('loaded'); }, { once:true }); img.src = real; img.removeAttribute('data-src'); } iio.unobserve(img); });
    }, { rootMargin: '200px 0px' });
    document.querySelectorAll('img[data-src]').forEach(img=>iio.observe(img));
  }catch(_){
    document.querySelectorAll('img[data-src]').forEach(function(img){ const real = img.getAttribute('data-src'); if(real){ img.addEventListener('load', function(){ img.classList.add('loaded'); }, { once:true }); img.src = real; img.removeAttribute('data-src'); } });
  }
  // Scroll reveal
  const revealables = Array.from(document.querySelectorAll('section, .feature, .card, .stat, .gallery img, .gallery video'));
  revealables.forEach(el => el.classList.add('reveal'));
  const io = new IntersectionObserver((entries)=>{ entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target);} }); }, {threshold: .12});
  revealables.forEach(el => io.observe(el));
  // Date badge minute tick glow
  const badge = document.getElementById('currentDateTime'); if (badge){ setInterval(()=>{ badge.classList.add('glow'); setTimeout(()=>badge.classList.remove('glow'), 800); }, 60000); }

  // Typewriter
  const el = document.getElementById('typer');
  if(el){
    const phrases = ['COD ke Lokasi Anda', 'Harga Pasar Harian', 'Dana Cair ±5 Menit'];
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches){ el.textContent = phrases[0]; }
    else {
      let i = 0, j = 0, deleting = false;
      (function tick(){
        const cur = phrases[i];
        if(!deleting){ j++; el.textContent=cur.slice(0,j); if(j===cur.length){ deleting=true; return setTimeout(tick,1400); } return setTimeout(tick,60); }
        else { j--; el.textContent=cur.slice(0,j); if(j===0){ deleting=false; i=(i+1)%phrases.length; return setTimeout(tick,400); } return setTimeout(tick,35); }
      })();
    }
  }
})();

// Harga emas: fetch + fallback + waktu W.I.B
const PRICE_ADJUST_IDR = +50000;
const PRICE_TIMEOUT_MS = 5000;
let REI_LAST_BASE_P = null;
const LAST_PRICE_KEY = 'rei_last_base_price_v1';
const FACTOR_LM_BARU = 0.932;
const FACTOR_LM_LAMA = 0.917;
const FACTOR_PERHIASAN_24K = 0.862;
const FACTOR_PERHIASAN_SUB = 0.786;
const GOLD_ROW_PRIMARY = '#0E4D47';
const GOLD_ROW_SECONDARY = '#335e5a';
const GOLD_KARAT_SERIES = [
  { karat: 24, purity: 1 },
  { karat: 23, purity: 0.9583 },
  { karat: 22, purity: 0.9167 },
  { karat: 21, purity: 0.875 },
  { karat: 20, purity: 0.8333 },
  { karat: 19, purity: 0.7917 },
  { karat: 18, purity: 0.75 },
  { karat: 17, purity: 0.7083 },
  { karat: 16, purity: 0.6667 },
  { karat: 15, purity: 0.625 },
  { karat: 14, purity: 0.5833 },
  { karat: 12, purity: 0.5 },
  { karat: 10, purity: 0.4167 },
  { karat: 9, purity: 0.375 },
  { karat: 8, purity: 0.3333 },
  { karat: 6, purity: 0.25 },
  { karat: 5, purity: 0.2083 }
];
const DEFAULT_PRICE_TABLE = {
  lmBaru: 1916000,
  lmLama: 1886000,
  perhiasan: [
    { karat: 24, price: 1776000 },
    { karat: 23, price: 1558000 },
    { karat: 22, price: 1493000 },
    { karat: 21, price: 1427000 },
    { karat: 20, price: 1361000 },
    { karat: 19, price: 1296000 },
    { karat: 18, price: 1230000 },
    { karat: 17, price: 1165000 },
    { karat: 16, price: 1099000 },
    { karat: 15, price: 1034000 },
    { karat: 14, price: 968000 },
    { karat: 12, price: 837000 },
    { karat: 10, price: 706000 },
    { karat: 9, price: 640000 },
    { karat: 8, price: 575000 },
    { karat: 6, price: 444000 },
    { karat: 5, price: 378000 }
  ]
};
function saveLastBasePrice(p){ try{ localStorage.setItem(LAST_PRICE_KEY, JSON.stringify({ p, t: Date.now() })); }catch(_){} }
function readLastBasePrice(){ try{ const o = JSON.parse(localStorage.getItem(LAST_PRICE_KEY)||''); /* istanbul ignore next */ if(o && typeof o.p==='number') return o; }catch(_){} return null; }
function updatePriceSchema(items){
  try{
    var el = document.getElementById('priceItemList');
    /* istanbul ignore next */
    if(!items || !items.length){ if(el) el.remove(); return; }
    var data = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "@id": "https://rodaemasindonesia.com/#price-list",
      "name": "Referensi Harga Buyback Emas & Perhiasan",
      "itemListElement": items.map(function(item, idx){
        return {
          "@type": "ListItem",
          "position": idx + 1,
          "name": item.name,
          "item": {
            "@type": "Offer",
            "name": item.name + " Buyback",
            "price": item.price,
            "priceCurrency": "IDR",
            "availability": "https://schema.org/InStock",
            "itemOffered": {"@id": "https://rodaemasindonesia.com/#service"}
          }
        };
      })
    };
    /* istanbul ignore next */
    if(!el){
      el = document.createElement('script');
      el.type = 'application/ld+json';
      el.id = 'priceItemList';
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(data);
  }catch(_){ }
}
function roundUpPrice(n, step){
  var s = step || 1000;
  return Math.ceil(n / s) * s;
}
function buildPerhiasanPricesFromBase(basePrice){
  return GOLD_KARAT_SERIES.map(function(entry){
    var factor = entry.karat === 24 ? FACTOR_PERHIASAN_24K : FACTOR_PERHIASAN_SUB;
    var harga = roundUpPrice(basePrice * entry.purity * factor + PRICE_ADJUST_IDR);
    return { karat: entry.karat, price: harga };
  });
}
function renderPriceTable(rows){
  var tbody = document.getElementById('goldPriceTable');
  /* istanbul ignore next */
  if(!tbody) return;
  tbody.setAttribute('aria-busy','true');
  tbody.innerHTML = '';
  var priceEntries = [];
  rows.forEach(function(row){
    if(!row || typeof row.price !== 'number' || !isFinite(row.price)) return;
    var color = row.color || GOLD_ROW_PRIMARY;
    tbody.insertAdjacentHTML('beforeend', `<tr style="height:34px"><td class="kadar">${row.label}</td><td style="text-align:right;font-weight:700;color:${color}">Rp <span class="num" data-to="${row.price}">0</span></td></tr>`);
    priceEntries.push({ name: row.schemaName || row.label, price: row.price });
  });
  tbody.setAttribute('aria-busy','false');
  updatePriceSchema(priceEntries);
  document.dispatchEvent(new CustomEvent('prices:updated'));
}
function renderPriceTableFromNumbers(lmBaru, lmLama, perhiasanEntries){
  var rows = [
    { label: 'Logam Mulia (LM) Baru', schemaName: 'Logam Mulia (LM) Baru', price: lmBaru, color: GOLD_ROW_PRIMARY },
    { label: 'Logam Mulia (LM) Lama', schemaName: 'Logam Mulia (LM) Lama', price: lmLama, color: GOLD_ROW_SECONDARY }
  ];
  (perhiasanEntries || []).forEach(function(entry){
    rows.push({
      label: `${entry.karat}K`,
      schemaName: `Perhiasan ${entry.karat}K`,
      price: entry.price,
      color: GOLD_ROW_PRIMARY
    });
  });
  renderPriceTable(rows);
}
function displayFromBasePrice(P){
  var lmBaru = roundUpPrice(P * FACTOR_LM_BARU + PRICE_ADJUST_IDR);
  var lmLama = roundUpPrice(P * FACTOR_LM_LAMA + PRICE_ADJUST_IDR);
  renderPriceTableFromNumbers(lmBaru, lmLama, buildPerhiasanPricesFromBase(P));
}

async function fetchGoldPrice() {
  try {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), PRICE_TIMEOUT_MS);
    const response = await fetch('https://pluang.com/api/asset/gold/pricing?daysLimit=1', { signal: ctl.signal });
    clearTimeout(t);
    const data = await response.json();
    /* istanbul ignore else */
    if (data && data.statusCode === 200 && data.data && data.data.current) {
      const hargaEmas24Karat = Number(data.data.current.buy);
      REI_LAST_BASE_P = hargaEmas24Karat; saveLastBasePrice(hargaEmas24Karat);
      displayFromBasePrice(hargaEmas24Karat);
      // Inform last updated
      var info = document.getElementById('lastUpdatedInfo'); /* istanbul ignore next */ if(info){ info.textContent = 'Terakhir diperbarui: ' + formatDateTimeIndo(new Date()); }
    } else {
      const last = readLastBasePrice();
      /* istanbul ignore next */
      if(last){ displayFromBasePrice(last.p); var info = document.getElementById('lastUpdatedInfo'); /* istanbul ignore next */ if(info){ info.textContent = 'Terakhir diperbarui (cache): ' + formatDateTimeIndo(new Date(last.t)); } }
      else { displayDefaultPrices(); }
    }
  } catch (err) {
    /* istanbul ignore next */
    console.warn('Harga gagal dimuat, pakai default:', err?.name || err);
    const last = readLastBasePrice();
    /* istanbul ignore next */
    if(last){ displayFromBasePrice(last.p); var info = document.getElementById('lastUpdatedInfo'); /* istanbul ignore next */ if(info){ info.textContent = 'Terakhir diperbarui (cache): ' + formatDateTimeIndo(new Date(last.t)); } }
    else { displayDefaultPrices(); }
  }
}
function displayDefaultPrices() {
  renderPriceTableFromNumbers(DEFAULT_PRICE_TABLE.lmBaru, DEFAULT_PRICE_TABLE.lmLama, DEFAULT_PRICE_TABLE.perhiasan);
}
function formatDateTimeIndo(date) {
  const days = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
  const months = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
  const day = days[date.getDay()];
  const dateNum = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2,'0');
  const minutes = String(date.getMinutes()).padStart(2,'0');
  return `${day}, ${dateNum} ${month} ${year} ${hours}:${minutes} WIB`;
}
function displayDateTimeWIB() {
  const now = new Date();
  const wibOffset = 7; // WIB = UTC+7
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const wibTime = new Date(utc + (3600000 * wibOffset));
  const el = document.getElementById("currentDateTime");
  if (el) el.textContent = formatDateTimeIndo(wibTime);
}
displayDateTimeWIB();
setInterval(displayDateTimeWIB, 60000);
fetchGoldPrice();

// Kalkulator Emas + WA Prefill
/* istanbul ignore next */
(function(){
  var cat = document.getElementById('cal-cat');
  var kadar = document.getElementById('cal-kadar');
  var berat = document.getElementById('cal-berat');
  var total = document.getElementById('cal-total');
  var wa = document.getElementById('wa-prefill');
  if(!cat || !kadar || !berat || !total || !wa) return;
  function ceilStep(n, step){ step = step||1000; return Math.ceil(n/step)*step; }
  function formatIDR(n){ try{ return n.toLocaleString('id-ID'); }catch(_){ return String(n); } }
  function purityFromK(k){ return Math.max(0, Math.min(1, Number(k||24)/24)); }
  function compute(){
    var P = REI_LAST_BASE_P || (readLastBasePrice()?.p) || 1200000; // fallback base
    var c = cat.value;
    var k = Number(kadar.value||24);
    var g = Math.max(0, Number(berat.value||0));
    var FACTOR_LM_BARU = 0.932, FACTOR_LM_LAMA=0.917, FACTOR_24K=0.862, FACTOR_SUB=0.786, ADJ=50000;
    var perGram;
    if(c==='lm_baru'){ perGram = ceilStep(P*FACTOR_LM_BARU + ADJ); k=24; }
    else if(c==='lm_lama'){ perGram = ceilStep(P*FACTOR_LM_LAMA + ADJ); k=24; }
    else if(c==='perhiasan_24'){ perGram = ceilStep(P*FACTOR_24K + ADJ); k=24; }
    else { perGram = ceilStep(P*FACTOR_SUB*purityFromK(k) + ADJ); }
    var est = ceilStep(perGram * g, 1000);
    total.textContent = 'Rp ' + formatIDR(est);
    var msg = `Halo Roda Emas Indonesia,%0A%0ASaya ingin konsultasi buyback:%0A- Kategori: ${labelCat(c)}%0A- Kadar: ${k}K%0A- Berat: ${g} gram%0A- Estimasi: Rp ${formatIDR(est)}%0A%0AMohon info lebih lanjut, terima kasih.`;
    wa.href = 'https://wa.me/6285591088503?text=' + msg;
  }
  function labelCat(c){
    switch(c){
      case 'lm_baru': return 'Logam Mulia (LM) Baru';
      case 'lm_lama': return 'Logam Mulia (LM) Lama';
      case 'perhiasan_24': return 'Perhiasan 24K';
      default: return 'Perhiasan <24K';
    }
  }
  ['input','change'].forEach(function(ev){ cat.addEventListener(ev, compute); kadar.addEventListener(ev, compute); berat.addEventListener(ev, compute); });
  // Disable kadar when not needed
  function toggleKadar(){ var disable = (cat.value==='lm_baru'||cat.value==='lm_lama'||cat.value==='perhiasan_24'); kadar.disabled = disable; }
  cat.addEventListener('change', function(){ toggleKadar(); compute(); });
  document.addEventListener('prices:updated', compute);
  toggleKadar(); compute();
})();

// Tahun pada footer + 404 helpers
/* istanbul ignore next */
(function(){
  var nowY = new Date().getFullYear().toString();
  var yrEl = document.getElementById('yr'); if(yrEl){ yrEl.textContent = nowY; }
  var yEl = document.getElementById('y'); if(yEl){ yEl.textContent = nowY; }
  var p = document.getElementById('path'); if(p){ p.textContent = (location.pathname + location.search) || '/'; }
})();

// Tracking klik CTA (WA/telepon)
/* istanbul ignore next */
(function(){
  const ENABLE_BEACON = false;
  function track(evt, label){
    try{
      var v = (typeof window.REI_AB_VARIANT === 'string') ? ('|' + window.REI_AB_VARIANT) : '';
      var full = label + v;
      if (window.gtag) { window.gtag('event', evt, { 'event_label': full }); }
      else if (window.dataLayer) { window.dataLayer.push({ 'event': evt, 'label': full }); }
      else { console.log('[track]', evt, label); }
    }catch(e){}
  }
  document.querySelectorAll('[data-track]').forEach(function(el){
    el.addEventListener('click', function(){
      var label = el.getAttribute('data-track');
      track('cta_click', label);
      if(label && label.indexOf('wa-')===0 && 'serviceWorker' in navigator){
        try{
          navigator.serviceWorker.ready.then(function(reg){
            var tag = 'wa-click:' + label + ':' + Date.now();
            if('sync' in reg){ reg.sync.register(tag).catch(/* istanbul ignore next */ function(){}); }
            /* istanbul ignore next */
            if(ENABLE_BEACON && navigator.sendBeacon){
              try{ navigator.sendBeacon('/track', new Blob([JSON.stringify({e:'wa', label:label, t:Date.now()})], {type:'application/json'})); }catch(e){}
            }
          });
        }catch(e){}
      }
    });
  });
})();

// Service worker register
// SW register + Update Toast
/* istanbul ignore next */
if ('serviceWorker' in navigator) {
  function showUpdateToast(){
    var t = document.getElementById('sw-toast');
    if(!t){ t = document.createElement('div'); t.id='sw-toast'; t.style.cssText='position:fixed;left:50%;transform:translateX(-50%);bottom:16px;background:#013D39;color:#fff;border:1px solid rgba(255,255,255,.18);box-shadow:0 8px 24px rgba(0,0,0,.25);border-radius:999px;padding:.6rem .9rem;display:flex;align-items:center;gap:.8rem;z-index:200;'; t.innerHTML = '<span>Versi baru tersedia</span>'; var b=document.createElement('button'); b.className='btn btn-gold'; b.style.cssText='padding:.4rem .7rem;font-size:.95rem'; b.textContent='Refresh'; b.onclick=function(){ location.reload(); }; t.appendChild(b); document.body.appendChild(t);} else { t.style.display='flex'; }
  }
  window.addEventListener('load', function(){
    navigator.serviceWorker.register('/sw.js', { scope: '/' })
      .then(function(reg){
        if(reg.waiting){ showUpdateToast(); }
        reg.addEventListener('updatefound', function(){
          var nw = reg.installing;
          if(nw){ nw.addEventListener('statechange', function(){ if(nw.state==='installed' && navigator.serviceWorker.controller){ showUpdateToast(); } }); }
        });
      })
      .catch(function(err){ console.warn('SW registration failed', err); });
  });
}

// Back to top button (remove inline handler)
/* istanbul ignore next */
(function(){
  var btn = document.getElementById('backToTop');
  if(!btn) return;
  btn.addEventListener('click', function(){ window.scrollTo({ top: 0, behavior: 'smooth' }); });
})();

// Nav aria-current
/* istanbul ignore next */
(function(){
  var links = Array.from(document.querySelectorAll('nav.menu a'));
  function apply(){
    var h = location.hash || '#home';
    links.forEach(function(a){ a.removeAttribute('aria-current'); });
    var cur = links.find(function(a){ return a.getAttribute('href') === h; });
    if(cur){ cur.setAttribute('aria-current', 'page'); }
  }
  window.addEventListener('hashchange', apply);
  apply();
})();

// Expose selected helpers for testing under Node/Jest without affecting browser usage
/* istanbul ignore else */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    PRICE_ADJUST_IDR,
    PRICE_TIMEOUT_MS,
    saveLastBasePrice,
    readLastBasePrice,
    updatePriceSchema,
    displayFromBasePrice,
    fetchGoldPrice,
    displayDefaultPrices,
    formatDateTimeIndo,
    displayDateTimeWIB,
  };
}
