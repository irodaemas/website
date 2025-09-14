// Extracted from inline scripts in index.html

(function(){
  // ---- Scroll progress + Parallax ----
  var bar = document.querySelector('.scroll-progress');
  var ticking = false;
  function onScroll(){
    if(ticking) return; ticking = true;
    requestAnimationFrame(function(){
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight; var p = max>0 ? (h.scrollTop/max)*100 : 0;
      if(bar) bar.style.width = p + '%';
      // Parallax hero translate
      var y = h.scrollTop || document.body.scrollTop; var par = Math.min(40, y*0.04);
      var hero = document.querySelector('.hero');
      if(hero){ hero.style.setProperty('--pary', par+'px'); hero.style.setProperty('--parx', (par*-.2)+'px'); }
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  // ---- Confetti on WA click ----
  function confettiBurst(x,y){
    var c = document.createElement('div'); c.className='confetti'; document.body.appendChild(c);
    var colors = ['#D4AF37','#F2D16B','#ffffff','#9be7e1'];
    for(var i=0;i<22;i++){
      var p = document.createElement('i');
      p.style.left = x + 'px'; p.style.top = y + 'px';
      p.style.background = colors[i%colors.length];
      c.appendChild(p);
      (function(p){
        var dx = (Math.random()*2-1)*140; var dy = (Math.random()*-1)*220 - 80; var rz = (Math.random()*360)|0; var t = 700 + Math.random()*500;
        p.animate([
          { transform: 'translate3d(0,0,0) rotate(0deg)' },
          { transform: 'translate3d('+dx+'px,'+dy+'px,0) rotate('+rz+'deg)', opacity:.1 }
        ], { duration: t, easing:'cubic-bezier(.22,.61,.36,1)' }).onfinish = function(){ p.remove(); };
      })(p);
    }
    setTimeout(function(){ c.remove(); }, 1200);
  }
  document.querySelectorAll('a[href^="https://wa.me"], [data-track^="wa-"]').forEach(function(el){
    el.addEventListener('click', function(){
      var r = el.getBoundingClientRect(); confettiBurst(r.left + r.width/2, r.top + window.scrollY);
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
function saveLastBasePrice(p){ try{ localStorage.setItem(LAST_PRICE_KEY, JSON.stringify({ p, t: Date.now() })); }catch(_){} }
function readLastBasePrice(){ try{ const o = JSON.parse(localStorage.getItem(LAST_PRICE_KEY)||''); if(o && typeof o.p==='number') return o; }catch(_){} return null; }
function displayFromBasePrice(P){
  const PRICE_ADJUST_IDR = +50000;
  const FACTOR_LM_BARU = 0.932; const FACTOR_LM_LAMA = 0.917; const FACTOR_24K_PERHIASAN = 0.862; const FACTOR_SUB_24K_PERHIASAN = 0.786;
  const ceilStep = (n, step = 1000) => Math.ceil(n / step) * step;
  const tbody = document.getElementById('goldPriceTable'); if(!tbody) return;
  tbody.innerHTML = '';
  const lmBaru = ceilStep(P * FACTOR_LM_BARU + PRICE_ADJUST_IDR);
  const lmLama = ceilStep(P * FACTOR_LM_LAMA + PRICE_ADJUST_IDR);
  tbody.insertAdjacentHTML('beforeend', `<tr style="height:34px"><td class="kadar">Logam Mulia (LM) Baru</td><td style="text-align:right;font-weight:700;color:#0E4D47">Rp <span class="num" data-to="${lmBaru}">0</span></td></tr>`);
  tbody.insertAdjacentHTML('beforeend', `<tr style="height:34px"><td class="kadar">Logam Mulia (LM) Lama</td><td style="text-align:right;font-weight:700;color:#335e5a">Rp <span class="num" data-to="${lmLama}">0</span></td></tr>`);
  const karatList = [
    {karat:24,purity:1},{karat:23,purity:0.9583},{karat:22,purity:0.9167},{karat:21,purity:0.875},{karat:20,purity:0.8333},{karat:19,purity:0.7917},{karat:18,purity:0.75},{karat:17,purity:0.7083},{karat:16,purity:0.6667},{karat:15,purity:0.625},{karat:14,purity:0.5833}
  ];
  karatList.forEach(({ karat, purity }) => {
    const factor = (karat === 24) ? FACTOR_24K_PERHIASAN : FACTOR_SUB_24K_PERHIASAN;
    const harga = ceilStep(P * purity * factor + PRICE_ADJUST_IDR);
    const label = karat === 24 ? '24K' : `${karat}K`;
    tbody.insertAdjacentHTML('beforeend', `<tr style="height:34px"><td class="kadar">${label}</td><td style="text-align:right;font-weight:700;color:#0E4D47">Rp <span class="num" data-to="${harga}">0</span></td></tr>`);
  });
  document.dispatchEvent(new CustomEvent('prices:updated'));
}

async function fetchGoldPrice() {
  try {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), PRICE_TIMEOUT_MS);
    const response = await fetch('https://pluang.com/api/asset/gold/pricing?daysLimit=1', { signal: ctl.signal });
    clearTimeout(t);
    const data = await response.json();
    if (data && data.statusCode === 200 && data.data && data.data.current) {
      const hargaEmas24Karat = Number(data.data.current.buy);
      REI_LAST_BASE_P = hargaEmas24Karat; saveLastBasePrice(hargaEmas24Karat);
      const FACTOR_LM_BARU = 0.932;
      const FACTOR_LM_LAMA = 0.917;
      const FACTOR_24K_PERHIASAN = 0.862;
      const FACTOR_SUB_24K_PERHIASAN = 0.786;
      const ceilStep = (n, step = 1000) => Math.ceil(n / step) * step;
      const P = hargaEmas24Karat;
      const tbody = document.getElementById('goldPriceTable');
      if(!tbody) return;
      tbody.innerHTML = '';
      const lmBaru = ceilStep(P * FACTOR_LM_BARU + PRICE_ADJUST_IDR);
      const lmLama = ceilStep(P * FACTOR_LM_LAMA + PRICE_ADJUST_IDR);
      tbody.insertAdjacentHTML('beforeend', `<tr style="height:34px"><td class="kadar">Logam Mulia (LM) Baru</td><td style="text-align:right;font-weight:700;color:#0E4D47">Rp <span class="num" data-to="${lmBaru}">0</span></td></tr>`);
      tbody.insertAdjacentHTML('beforeend', `<tr style="height:34px"><td class="kadar">Logam Mulia (LM) Lama</td><td style="text-align:right;font-weight:700;color:#335e5a">Rp <span class="num" data-to="${lmLama}">0</span></td></tr>`);
      const karatList = [
        {karat:24,purity:1},{karat:23,purity:0.9583},{karat:22,purity:0.9167},{karat:21,purity:0.875},{karat:20,purity:0.8333},{karat:19,purity:0.7917},{karat:18,purity:0.75},{karat:17,purity:0.7083},{karat:16,purity:0.6667},{karat:15,purity:0.625},{karat:14,purity:0.5833},{karat:12,purity:0.5},{karat:10,purity:0.4167},{karat:9,purity:0.375},{karat:8,purity:0.3333},{karat:6,purity:0.25},{karat:5,purity:0.2083}
      ];
      karatList.forEach(({ karat, purity }) => {
        const factor = (karat === 24) ? FACTOR_24K_PERHIASAN : FACTOR_SUB_24K_PERHIASAN;
        const harga = ceilStep(P * purity * factor + PRICE_ADJUST_IDR);
        const label = karat === 24 ? '24K' : `${karat}K`;
        tbody.insertAdjacentHTML('beforeend', `<tr style="height:34px"><td class="kadar">${label}</td><td style="text-align:right;font-weight:700;color:#0E4D47">Rp <span class="num" data-to="${harga}">0</span></td></tr>`);
      });
      document.dispatchEvent(new CustomEvent('prices:updated'));
      // Inform last updated
      var info = document.getElementById('lastUpdatedInfo'); if(info){ info.textContent = 'Terakhir diperbarui: ' + formatDateTimeIndo(new Date()); }
    } else {
      const last = readLastBasePrice();
      if(last){ displayFromBasePrice(last.p); var info = document.getElementById('lastUpdatedInfo'); if(info){ info.textContent = 'Terakhir diperbarui (cache): ' + formatDateTimeIndo(new Date(last.t)); } }
      else { displayDefaultPrices(); }
    }
  } catch (err) {
    console.warn('Harga gagal dimuat, pakai default:', err?.name || err);
    const last = readLastBasePrice();
    if(last){ displayFromBasePrice(last.p); var info = document.getElementById('lastUpdatedInfo'); if(info){ info.textContent = 'Terakhir diperbarui (cache): ' + formatDateTimeIndo(new Date(last.t)); } }
    else { displayDefaultPrices(); }
  }
}
function displayDefaultPrices() {
  // Fixed default prices (IDR)
  const LM_BARU_DEFAULT = 1916000;
  const LM_LAMA_DEFAULT = 1886000;
  const defaults = [
    { karat: 24, baru: 1776000 },
    { karat: 23, baru: 1558000 },
    { karat: 22, baru: 1493000 },
    { karat: 21, baru: 1427000 },
    { karat: 20, baru: 1361000 },
    { karat: 19, baru: 1296000 },
    { karat: 18, baru: 1230000 },
    { karat: 17, baru: 1165000 },
    { karat: 16, baru: 1099000 },
    { karat: 15, baru: 1034000 },
    { karat: 14, baru: 968000 },
    { karat: 12, baru: 837000 },
    { karat: 10, baru: 706000 },
    { karat: 9,  baru: 640000 },
    { karat: 8,  baru: 575000 },
    { karat: 6,  baru: 444000 },
    { karat: 5,  baru: 378000 }
  ];
  const tbody = document.getElementById('goldPriceTable');
  if(!tbody) return;
  tbody.innerHTML = '';
  // Exact LM rows (no adjustment)
  tbody.insertAdjacentHTML('beforeend', `<tr style="height:34px"><td class="kadar">Logam Mulia (LM) Baru</td><td style="text-align:right;font-weight:700;color:#0E4D47">Rp <span class="num" data-to="${LM_BARU_DEFAULT}">0</span></td></tr>`);
  tbody.insertAdjacentHTML('beforeend', `<tr style="height:34px"><td class="kadar">Logam Mulia (LM) Lama</td><td style="text-align:right;font-weight:700;color:#335e5a">Rp <span class="num" data-to="${LM_LAMA_DEFAULT}">0</span></td></tr>`);
  // Per-karat rows (no adjustment)
  defaults.forEach(({karat, baru}) => {
    tbody.insertAdjacentHTML('beforeend', `<tr style=\"height:34px\"><td class=\"kadar\">${karat}K</td><td style=\"text-align:right;font-weight:700;color:#0E4D47\">Rp <span class=\"num\" data-to=\"${baru}\">0</span></td></tr>`);
  });
  document.dispatchEvent(new CustomEvent('prices:updated'));
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
  toggleKadar(); compute();
})();

// Tahun pada footer
var yrEl = document.getElementById('yr'); if(yrEl){ yrEl.textContent = new Date().getFullYear().toString(); }

// Tracking klik CTA (WA/telepon)
(function(){
  const ENABLE_BEACON = false;
  function track(evt, label){
    try{
      if (window.gtag) { window.gtag('event', evt, { 'event_label': label }); }
      else if (window.dataLayer) { window.dataLayer.push({ 'event': evt, 'label': label }); }
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
            if('sync' in reg){ reg.sync.register(tag).catch(function(){}); }
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
if ('serviceWorker' in navigator) {
  function showUpdateToast(){
    var t = document.getElementById('sw-toast');
    if(!t){ t = document.createElement('div'); t.id='sw-toast'; t.style.cssText='position:fixed;left:50%;transform:translateX(-50%);bottom:16px;background:#013D39;color:#fff;border:1px solid rgba(255,255,255,.18);box-shadow:0 8px 24px rgba(0,0,0,.25);border-radius:999px;padding:.6rem .9rem;display:flex;align-items:center;gap:.8rem;z-index:200;'; t.innerHTML = '<span>Versi baru tersedia</span>'; var b=document.createElement('button'); b.className='btn btn-gold'; b.style.cssText='padding:.4rem .7rem;font-size:.95rem'; b.textContent='Refresh'; b.onclick=function(){ location.reload(); }; t.appendChild(b); document.body.appendChild(t);} else { t.style.display='flex'; }
  }
  window.addEventListener('load', function(){
    navigator.serviceWorker.register('./sw.js', { scope: './' })
      .then(function(reg){
        console.info('SW registered:', reg.scope);
        if(reg.waiting){ showUpdateToast(); }
        reg.addEventListener('updatefound', function(){
          var nw = reg.installing;
          if(nw){ nw.addEventListener('statechange', function(){ if(nw.state==='installed' && navigator.serviceWorker.controller){ showUpdateToast(); } }); }
        });
      })
      .catch(function(err){ console.warn('SW registration failed', err); });
  });
}

// Nav aria-current
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
