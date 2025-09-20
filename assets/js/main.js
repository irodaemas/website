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
      <text x="50%" y="52%" font-family="Inter,Arial" font-size="28" fill="white" text-anchor="middle">Sentral Emas</text>\
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
const LM_HISTORY_DAYS_LIMIT = 7;
let REI_LAST_BASE_P = null;
const LAST_PRICE_KEY = 'rei_last_base_price_v1';
const LAST_SERIES_KEY = 'rei_lm_sparkline_series_v1';
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
const GOLD_INFO_CONTENT = {
  'lm_baru': {
    title: 'Logam Mulia (LM) Baru',
    meta: 'Kemurnian 99,99% (24K) • Sertifikat resmi pabrik',
    description: 'LM baru mencakup keping/gramasi produksi terbaru Antam, UBS, atau pabrikan resmi lain. Kondisi fisik mulus dan sertifikat utuh membantu menjaga nilai buyback maksimal.',
    tips: [
      'Sertakan sertifikat/packaging asli saat transaksi.',
      'Pastikan nomor seri keping sesuai dengan yang tertera di sertifikat.',
      'Hindari menyentuh permukaan emas secara langsung agar tidak meninggalkan noda.'
    ]
  },
  'lm_lama': {
    title: 'Logam Mulia (LM) Lama',
    meta: 'Kemurnian 91%–99% • Cetakan lama / non-smartpackage',
    description: 'LM lama mengacu pada cetakan sebelum kemasan terbaru atau produk yang telah keluar dari segel. Nilainya tetap tinggi selama berat dan kemurnian terjaga.',
    tips: [
      'Bawa bukti pembelian atau nota jika masih tersedia.',
      'Simpan dalam plastik zip atau kapsul untuk menghindari gores.',
      'Siapkan waktu pengecekan fisik lebih lama karena perlu ditimbang ulang.'
    ]
  },
  'karat-24': {
    title: 'Perhiasan 24K',
    meta: 'Kemurnian ±99,9% • Sangat lunak dan kuning terang',
    description: 'Perhiasan 24K identik dengan kadar emas tertinggi. Biasanya berbentuk gelang/cincin polos atau emas batangan kecil dengan ornamen minim.',
    tips: [
      'Tunjukkan cap kadar (999/24K) jika masih terbaca.',
      'Gunakan kotak atau kain lembut karena material sangat mudah lecet.',
      'Jika dibeli dari luar negeri, siapkan kwitansi untuk percepatan verifikasi.'
    ]
  },
  'karat-23': {
    title: 'Perhiasan 23K',
    meta: 'Kemurnian ±95,8% • Favorit perhiasan tradisional',
    description: 'Kadar 23K banyak dipakai untuk gelang dan cincin adat karena warnanya tetap kuning pekat namun lebih kokoh dari 24K.',
    tips: [
      'Cek stempel 950/23K di bagian dalam perhiasan.',
      'Bersihkan ringan dengan kain kering, hindari chemical berlebihan.',
      'Foto detail ukiran atau motif sebagai referensi saat konsultasi.'
    ]
  },
  'karat-22': {
    title: 'Perhiasan 22K',
    meta: 'Kemurnian ±91,7% • Umum untuk perhiasan sehari-hari',
    description: 'Kadar 22K menawarkan keseimbangan antara warna pekat dan ketahanan. Banyak ditemukan pada gelang rantai, kalung, dan cincin kawin.',
    tips: [
      'Perlihatkan cap 916/22K jika masih jelas.',
      'Catat berat kotor bila terdapat batu/ornamen tambahan.',
      'Hindari menyolder sendiri karena dapat mengubah komposisi campuran.'
    ]
  },
  'karat-21': {
    title: 'Perhiasan 21K',
    meta: 'Kemurnian ±87,5% • Perhiasan campuran emas-perak',
    description: 'Perhiasan 21K kerap memiliki warna sedikit lebih pucat. Komposisi tambahan logam membuatnya lebih kuat untuk penggunaan rutin.',
    tips: [
      'Sertakan informasi jika ada batu permata supaya penilaian lebih akurat.',
      'Bersihkan debu pada sela-sela ornamen sebelum tim melakukan pengecekan.',
      'Waspadai hasil solder ulang; informasikan jika pernah diperbaiki.'
    ]
  },
  'karat-20': {
    title: 'Perhiasan 20K',
    meta: 'Kemurnian ±83,3% • Warna emas agak muda',
    description: 'Kadar 20K sering ditemui pada perhiasan impor atau desain lama. Campuran logam tambahan memberi kekuatan namun mengurangi kilau kuning pekat.',
    tips: [
      'Lampirkan surat toko apabila masih ada untuk mengonfirmasi kadar.',
      'Jika ada batu, sebutkan apakah ingin dijual beserta atau terpisah.',
      'Simak proses uji asam yang mungkin dilakukan untuk memastikan kadar.'
    ]
  },
  'karat-19': {
    title: 'Perhiasan 19K',
    meta: 'Kemurnian ±79,1% • Campuran logam tinggi',
    description: 'Kadar 19K relatif jarang namun tetap beredar pada koleksi lawas. Warna emas cenderung pucat dengan sedikit kilau kehijauan.',
    tips: [
      'Beritahu jika perhiasan pernah dilapisi ulang untuk memperkuat warna.',
      'Siapkan waktu pengecekan sedikit lebih lama karena kadar perlu diuji.',
      'Gunakan pouch terpisah agar tidak bergesekan dengan perhiasan lain.'
    ]
  },
  'karat-18': {
    title: 'Perhiasan 18K',
    meta: 'Kemurnian ±75% • Standar butik & brand global',
    description: 'Perhiasan 18K populer di butik internasional karena kuat dan cocok memegang batu permata. Warna emas lebih netral sehingga cocok untuk berbagai desain.',
    tips: [
      'Cantumkan merek/bukti pembelian bila berasal dari butik ternama.',
      'Periksa baut atau clasp agar tidak longgar saat penimbangan.',
      'Untuk cincin berlian, informasikan karat batu jika ingin dihitung terpisah.'
    ]
  },
  'karat-17': {
    title: 'Perhiasan 17K',
    meta: 'Kemurnian ±70,8% • Banyak dijumpai pada perhiasan rumahan',
    description: 'Campuran logam lebih tinggi membuat 17K cukup tahan banting dan berwarna kuning muda. Umum dipakai untuk kalung dan gelang harian.',
    tips: [
      'Jika ada bekas patri, sebutkan agar penaksir tahu bagian mana yang diperbaiki.',
      'Bersihkan minyak atau lotion yang menempel sebelum pengecekan.',
      'Simpan dalam kantong terpisah agar tidak tergores aksesoris lain.'
    ]
  },
  'karat-16': {
    title: 'Perhiasan 16K',
    meta: 'Kemurnian ±66,7% • Warna keemasan lebih lembut',
    description: 'Perhiasan 16K kerap dijadikan aksesori fashion dengan harga terjangkau namun tetap memuat kandungan emas signifikan.',
    tips: [
      'Ingatkan tim jika terdapat cat/lapisan tambahan di permukaan.',
      'Foto perhiasan sebelum diserahkan untuk dokumentasi personal.',
      'Siapkan waktu pengetesan karena kadar perlu dikonfirmasi ulang.'
    ]
  },
  'karat-15': {
    title: 'Perhiasan 15K',
    meta: 'Kemurnian ±62,5% • Biasanya buatan lama atau impor',
    description: 'Kadar 15K tidak lagi diproduksi massal namun masih ditemukan pada koleksi warisan. Warna condong kuning pucat dengan campuran perak tinggi.',
    tips: [
      'Sampaikan jika ingin menjual logam saja atau termasuk batu hias.',
      'Jaga agar tidak terkena parfum/kimia sebelum penilaian.',
      'Siapkan surat warisan atau bukti asal jika masih disimpan.'
    ]
  },
  'karat-14': {
    title: 'Perhiasan 14K',
    meta: 'Kemurnian ±58,3% • Favorit cincin tunangan',
    description: 'Kadar 14K populer karena kuat, tidak mudah berubah warna, dan aman untuk pemakaian sehari-hari. Sering dipakai brand internasional dengan batu berlian.',
    tips: [
      'Bawa kartu garansi/asli brand bila tersedia.',
      'Informasikan kadar batu permata supaya appraisal dapat dipisahkan.',
      'Pastikan screw/baut anting tidak hilang untuk menjaga nilai.'
    ]
  },
  'karat-12': {
    title: 'Perhiasan 12K',
    meta: 'Kemurnian ±50% • Campuran logam hampir setengah',
    description: 'Perhiasan 12K sering berupa fashion jewelry lama. Kandungan emasnya masih bernilai, namun uji kadar wajib dilakukan untuk kepastian.',
    tips: [
      'Beritahu jika warna sudah memudar atau pernah dilapis ulang.',
      'Pisahkan rantai tipis agar tidak kusut ketika diukur.',
      'Siapkan kesabaran karena proses uji kadar memerlukan beberapa menit.'
    ]
  },
  'karat-10': {
    title: 'Perhiasan 10K',
    meta: 'Kemurnian ±41,6% • Umum di pasar Amerika',
    description: 'Kadar 10K memiliki warna lebih putih dan keras. Banyak dijual di luar negeri sebagai alternatif ekonomis namun tetap berunsur emas.',
    tips: [
      'Bawa bukti pembelian luar negeri jika ada untuk mempercepat verifikasi.',
      'Warna pucat adalah normal karena campuran tembaga/perak cukup tinggi.',
      'Jika terdapat batu besar, siapkan assessment khusus untuk memperhitungkan nilainya.'
    ]
  },
  'karat-9': {
    title: 'Perhiasan 9K',
    meta: 'Kemurnian ±37,5% • Kandungan emas rendah',
    description: 'Perhiasan 9K termasuk kategori emas muda dengan kandungan emas di bawah 40%. Nilai buyback fokus pada berat bersih emas setelah dikurangi campuran.',
    tips: [
      'Harapkan proses uji kadar lebih intensif untuk memastikan kandungan emas.',
      'Sampaikan bila terdapat bagian berlapis rhodium atau coating lain.',
      'Kemas rapi agar detail ornamen tidak rusak saat transportasi.'
    ]
  },
  'karat-8': {
    title: 'Perhiasan 8K',
    meta: 'Kemurnian ±33,3% • Lebih mirip logam campuran',
    description: 'Dengan kandungan emas sepertiga, perhiasan 8K sering dijual sebagai fashion jewelry. Buyback menilai kandungan emas bersih melalui uji kadar.',
    tips: [
      'Beritahu jika produk awalnya dijual sebagai gold-filled atau gold-plated.',
      'Siapkan waktu karena proses penimbangan akan dikombinasi dengan uji asam.',
      'Jika hanya ingin menjual logam emasnya, sampaikan sejak awal.'
    ]
  },
  'karat-6': {
    title: 'Perhiasan 6K',
    meta: 'Kemurnian ±25% • Biasanya warisan lama',
    description: '6K memiliki kandungan emas seperempat. Banyak ditemukan pada koleksi antik yang telah melewati generasi.',
    tips: [
      'Sertakan cerita asal-usul jika ada; membantu menilai potensi nilai koleksi.',
      'Harap maklum bila terdapat potongan untuk menguji kandungan.',
      'Sediakan wadah aman karena struktur logam bisa rapuh.'
    ]
  },
  'karat-5': {
    title: 'Perhiasan 5K',
    meta: 'Kemurnian ±20,8% • Konten emas sangat rendah',
    description: 'Perhiasan 5K lebih banyak terdiri dari logam campuran. Nilai buyback fokus pada kandungan emas murni yang tersisa.',
    tips: [
      'Pahami bahwa estimasi harga akan jauh di bawah perhiasan kadar tinggi.',
      'Jika ada nilai sentimental, pertimbangkan apakah ingin dijual seluruhnya.',
      'Bersiap untuk uji asam lebih dari sekali guna memastikan kadar tepat.'
    ]
  },
  'default': {
    title: 'Detail Kadar Emas',
    meta: 'Informasi umum kadar emas',
    description: 'Silakan hubungi tim kami via WhatsApp untuk penjelasan lebih lanjut mengenai kadar atau jenis perhiasan yang Anda pilih.',
    tips: [
      'Cantumkan foto barang dari beberapa sudut.',
      'Tulis berat perkiraan dan kondisi (ada retak, solder, atau batu).',
      'Kami bantu cek lebih detail saat janji temu COD.'
    ]
  }
};
const GOLD_UNIT_DEFS = [
  { id: 'gram', label: 'Gram (g)', toGram: 1 },
  { id: 'ameh', label: 'Ameh (2,5 g)', toGram: 2.5 },
  { id: 'suku', label: 'Suku (3,75 g)', toGram: 3.75 },
  { id: 'mayam', label: 'Mayam (±3,33 g)', toGram: 3.33 },
  { id: 'tael', label: 'Tael (37,5 g)', toGram: 37.5 },
  { id: 'troy', label: 'Troy Ounce (31,103 g)', toGram: 31.1034768 },
  { id: 'tola', label: 'Tola (11,664 g)', toGram: 11.6638038 },
  { id: 'baht', label: 'Baht (15,244 g)', toGram: 15.244 },
  { id: 'kupang', label: 'Kupang (0,6 g)', toGram: 0.6 }
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
function saveLastSparklineSeries(series){
  try{
    if(!Array.isArray(series) || !series.length){ localStorage.removeItem(LAST_SERIES_KEY); return; }
    const payload = series.map(function(point){
      if(point == null) return null;
      const baseValue = typeof point.base === 'number' ? point.base : (typeof point === 'number' ? point : null);
      if(baseValue === null || !isFinite(baseValue)) return null;
      let timeValue = null;
      if(point.time instanceof Date && !isNaN(point.time.getTime())){ timeValue = point.time.getTime(); }
      else if(typeof point.time === 'number' && isFinite(point.time)){ timeValue = point.time; }
      return [timeValue, baseValue];
    }).filter(Boolean);
    if(payload.length){ localStorage.setItem(LAST_SERIES_KEY, JSON.stringify(payload)); }
    else { localStorage.removeItem(LAST_SERIES_KEY); }
  }catch(_){ }
}
function readLastSparklineSeries(){
  try{
    const raw = JSON.parse(localStorage.getItem(LAST_SERIES_KEY) || '[]');
    if(!Array.isArray(raw)) return [];
    return raw.map(function(entry){
      if(!Array.isArray(entry) || entry.length < 2) return null;
      const baseValue = safeNumber(entry[1]);
      if(baseValue === null) return null;
      const timeValue = entry[0] == null ? null : resolveDate(entry[0]);
      return {
        base: baseValue,
        price: computeLmBaruPrice(baseValue),
        time: timeValue instanceof Date && !isNaN(timeValue.getTime()) ? timeValue : null
      };
    }).filter(Boolean);
  }catch(_){
    return [];
  }
}
let LM_BARU_PRICE_SERIES = readLastSparklineSeries();
const DEFAULT_SPARKLINE_PERIOD = `${LM_HISTORY_DAYS_LIMIT} hari terakhir`;
let LM_BARU_SPARKLINE_META = { periodLabel: DEFAULT_SPARKLINE_PERIOD, hasSeries: false };
let LM_BARU_SPARKLINE_RESIZE_FRAME = null;
function updatePriceSchema(items){
  try{
    var el = document.getElementById('priceItemList');
    /* istanbul ignore next */
    if(!items || !items.length){ if(el) el.remove(); return; }
    var data = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "@id": "https://sentralemas.com/#price-list",
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
            "itemOffered": {"@id": "https://sentralemas.com/#service"}
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
function computeLmBaruPrice(basePrice){
  return roundUpPrice(basePrice * FACTOR_LM_BARU + PRICE_ADJUST_IDR);
}
function computeLmLamaPrice(basePrice){
  return roundUpPrice(basePrice * FACTOR_LM_LAMA + PRICE_ADJUST_IDR);
}
function safeNumber(v){
  var num = Number(v);
  return Number.isFinite(num) ? num : null;
}
function resolveDate(value){
  if(!value) return null;
  var dateCandidate = null;
  if(value instanceof Date){
    dateCandidate = value;
  } else if(typeof value === 'number'){ dateCandidate = new Date(value); }
  else if(typeof value === 'string'){
    var trimmed = value.trim();
    if(!trimmed) return null;
    if(/^\d+$/.test(trimmed)) dateCandidate = new Date(Number(trimmed));
    else dateCandidate = new Date(trimmed);
  }
  return dateCandidate && !isNaN(dateCandidate.getTime()) ? dateCandidate : null;
}
function formatCurrencyIDR(value){
  try{ return Number(value || 0).toLocaleString('id-ID'); }
  catch(_){ return String(value || 0); }
}
function escapeAttr(value){
  return String(value == null ? '' : value).replace(/"/g, '&quot;');
}
function updateLmBaruHighlight(currentPrice, options){
  options = options || {};
  var valueEl = document.getElementById('lmBaruCurrent');
  var badgeEl = document.getElementById('lmBaruTrendBadge');
  var deltaWrap = document.getElementById('lmBaruDelta');
  var deltaTextEl = document.getElementById('lmBaruDeltaText');
  var iconEl = deltaWrap ? deltaWrap.querySelector('.delta-icon') : null;

  if(valueEl){
    if(typeof currentPrice === 'number' && isFinite(currentPrice)){
      valueEl.textContent = 'Rp ' + formatCurrencyIDR(currentPrice);
    } else {
      valueEl.textContent = 'Rp —';
    }
    valueEl.classList.remove('value-flash');
    requestAnimationFrame(function(){ valueEl.classList.add('value-flash'); });
  }

  if(!deltaWrap) return;

  var badgeLabel = options.badgeLabel || 'Menunggu';
  var badgeState = options.badgeState || 'price-neutral';
  var deltaMessage = options.deltaText || 'Selisih menunggu data sebelumnya';
  var hasCurrent = typeof currentPrice === 'number' && isFinite(currentPrice);
  var prevPrice = typeof options.previousPrice === 'number' && isFinite(options.previousPrice) ? options.previousPrice : null;
  var iconState = 'pending';

  deltaWrap.classList.remove('trend-up','trend-down','trend-flat','trend-pending');

  if(hasCurrent && prevPrice !== null){
    var diff = Math.round(currentPrice - prevPrice);
    var absDiff = Math.abs(diff);
    if(diff > 0){
      deltaWrap.classList.add('trend-up');
      deltaMessage = options.deltaText || ('Naik Rp ' + formatCurrencyIDR(absDiff) + ' dibanding kemarin');
      iconState = 'up';
      badgeLabel = options.badgeLabel || 'Naik';
      badgeState = options.badgeState || 'price-up';
    } else if(diff < 0){
      deltaWrap.classList.add('trend-down');
      deltaMessage = options.deltaText || ('Turun Rp ' + formatCurrencyIDR(absDiff) + ' dibanding kemarin');
      iconState = 'down';
      badgeLabel = options.badgeLabel || 'Turun';
      badgeState = options.badgeState || 'price-down';
    } else {
      deltaWrap.classList.add('trend-flat');
      deltaMessage = options.deltaText || 'Tidak berubah dibanding kemarin';
      iconState = 'flat';
      badgeLabel = options.badgeLabel || 'Stabil';
      badgeState = options.badgeState || 'price-neutral';
    }
  } else {
    deltaWrap.classList.add('trend-pending');
    iconState = 'pending';
  }

  if(deltaTextEl) deltaTextEl.textContent = deltaMessage;
  if(iconEl){
    iconEl.textContent = '';
    iconEl.setAttribute('data-trend', iconState);
  }
  if(badgeEl){
    badgeEl.classList.remove('price-up','price-down','price-neutral');
    badgeEl.classList.add(badgeState);
    badgeEl.textContent = badgeLabel;
  }
  deltaWrap.classList.remove('delta-flash');
  requestAnimationFrame(function(){ deltaWrap.classList.add('delta-flash'); });
  var highlightCard = document.getElementById('lmBaruHighlight');
  if(highlightCard){
    highlightCard.classList.remove('is-updated');
    requestAnimationFrame(function(){ highlightCard.classList.add('is-updated'); });
  }
}
function prepareLmBaruHistorySeries(source, currentBase, limit){
  var limitValue = typeof limit === 'number' && limit > 0 ? limit : LM_HISTORY_DAYS_LIMIT;
  var entries = [];
  var order = 0;
  function pushEntry(entry){
    if(!entry) return;
    var baseValue = safeNumber(entry.buy);
    if(baseValue === null) return;
    entries.push({
      base: baseValue,
      time: resolveDate(entry.priceDate || entry.time || entry.timestamp || entry.date || entry.updatedAt),
      order: order++
    });
  }
  if(source){
    if(Array.isArray(source.history)) source.history.forEach(pushEntry);
    pushEntry(source.previous);
    if(source.current && source.current.previous) pushEntry(source.current.previous);
    pushEntry(source.current);
  }
  if(typeof currentBase === 'number' && isFinite(currentBase)){
    var alreadyIncluded = entries.some(function(entry){ return Math.abs(entry.base - currentBase) < 0.5; });
    if(!alreadyIncluded){ entries.push({ base: currentBase, time: null, order: order++ }); }
  }
  if(!entries.length) return [];
  entries.sort(function(a, b){
    if(a.time && b.time){ return a.time.getTime() - b.time.getTime(); }
    if(a.time && !b.time) return -1;
    if(!a.time && b.time) return 1;
    return a.order - b.order;
  });
  var seenTimes = new Set();
  var normalized = [];
  entries.forEach(function(entry){
    var timeKey = entry.time ? entry.time.getTime() : null;
    if(timeKey !== null){ if(seenTimes.has(timeKey)) return; seenTimes.add(timeKey); }
    normalized.push({
      base: entry.base,
      price: computeLmBaruPrice(entry.base),
      time: entry.time
    });
  });
  if(normalized.length > limitValue){ normalized = normalized.slice(normalized.length - limitValue); }
  return normalized;
}
function describeSparklineSeries(series, periodLabel){
  if(!Array.isArray(series) || series.length < 2) return 'Riwayat harga tidak tersedia.';
  var firstPoint = series[0];
  var lastPoint = series[series.length - 1];
  if(!firstPoint || !lastPoint) return 'Riwayat harga tidak tersedia.';
  var firstPrice = Number(firstPoint.price);
  var lastPrice = Number(lastPoint.price);
  if(!isFinite(firstPrice) || !isFinite(lastPrice)) return 'Riwayat harga tidak tersedia.';
  var diff = Math.round(lastPrice - firstPrice);
  var absDiff = Math.abs(diff);
  var label = typeof periodLabel === 'string' && periodLabel.trim() ? periodLabel : DEFAULT_SPARKLINE_PERIOD;
  if(diff > 0){
    return 'Harga naik Rp ' + formatCurrencyIDR(absDiff) + ' selama ' + label + ', dari Rp ' + formatCurrencyIDR(firstPrice) + ' menjadi Rp ' + formatCurrencyIDR(lastPrice) + '.';
  }
  if(diff < 0){
    return 'Harga turun Rp ' + formatCurrencyIDR(absDiff) + ' selama ' + label + ', dari Rp ' + formatCurrencyIDR(firstPrice) + ' menjadi Rp ' + formatCurrencyIDR(lastPrice) + '.';
  }
  return 'Harga relatif stabil selama ' + label + ' di sekitar Rp ' + formatCurrencyIDR(lastPrice) + '.';
}
function getSparklineReuseOptions(){
  if(!LM_BARU_SPARKLINE_META) return { periodLabel: DEFAULT_SPARKLINE_PERIOD };
  return {
    periodLabel: LM_BARU_SPARKLINE_META.periodLabel || DEFAULT_SPARKLINE_PERIOD,
    summaryText: typeof LM_BARU_SPARKLINE_META.summaryText === 'string' ? LM_BARU_SPARKLINE_META.summaryText : undefined,
    summarySuffix: typeof LM_BARU_SPARKLINE_META.summarySuffix === 'string' ? LM_BARU_SPARKLINE_META.summarySuffix : undefined,
    fallbackText: typeof LM_BARU_SPARKLINE_META.fallbackText === 'string' ? LM_BARU_SPARKLINE_META.fallbackText : undefined
  };
}
function updateLmBaruSparkline(series, options){
  options = options || {};
  var previousLabel = (LM_BARU_SPARKLINE_META && typeof LM_BARU_SPARKLINE_META.periodLabel === 'string') ? LM_BARU_SPARKLINE_META.periodLabel : DEFAULT_SPARKLINE_PERIOD;
  var renderOptions = {
    periodLabel: typeof options.periodLabel === 'string' && options.periodLabel.trim() ? options.periodLabel : previousLabel,
    summaryText: typeof options.summaryText === 'string' ? options.summaryText : undefined,
    summarySuffix: typeof options.summarySuffix === 'string' ? options.summarySuffix : undefined,
    fallbackText: typeof options.fallbackText === 'string' ? options.fallbackText : undefined
  };
  var highlightCard = document.getElementById('lmBaruHighlight');
  var canvas = document.getElementById('lmBaruSparkline');
  var fallbackEl = document.getElementById('lmBaruChartFallback');
  var summaryEl = document.getElementById('lmBaruTrendSummary');
  var hasSeries = Array.isArray(series) && series.length >= 2 && series.every(function(point){ return point && typeof point.price === 'number' && isFinite(point.price); });

  if(!hasSeries){
    if(canvas){
      try{
        var ctxClear = canvas.getContext && canvas.getContext('2d');
        if(ctxClear){ ctxClear.setTransform(1,0,0,1,0,0); ctxClear.clearRect(0,0,canvas.width || 0, canvas.height || 0); }
      }catch(_){ }
      canvas.classList.remove('sparkline-visible');
      canvas.setAttribute('aria-hidden','true');
    }
    if(fallbackEl){
      var fallbackText = renderOptions.fallbackText || 'Riwayat harga belum tersedia.';
      fallbackEl.textContent = fallbackText;
      fallbackEl.classList.add('is-visible');
    }
    if(summaryEl){
      var summaryText = renderOptions.summaryText || renderOptions.fallbackText || 'Riwayat harga belum tersedia.';
      if(renderOptions.summarySuffix){ summaryText += ' ' + renderOptions.summarySuffix; }
      summaryEl.textContent = summaryText;
    }
    if(highlightCard) highlightCard.setAttribute('data-sparkline-state','empty');
    LM_BARU_SPARKLINE_META = Object.assign({}, renderOptions, { hasSeries: false });
    return;
  }

  if(highlightCard) highlightCard.setAttribute('data-sparkline-state','ready');
  if(fallbackEl){
    fallbackEl.textContent = '';
    fallbackEl.classList.remove('is-visible');
  }
  if(canvas){
    canvas.removeAttribute('aria-hidden');
    var rect = canvas.getBoundingClientRect();
    var width = Math.max(1, rect.width || canvas.clientWidth || 160);
    var height = Math.max(32, rect.height || canvas.clientHeight || 48);
    var dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    var ctx = canvas.getContext('2d');
    if(ctx){
      ctx.setTransform(1,0,0,1,0,0);
      ctx.clearRect(0,0,canvas.width, canvas.height);
      ctx.scale(dpr, dpr);
      var prices = series.map(function(point){ return Number(point.price) || 0; });
      var min = Math.min.apply(null, prices);
      var max = Math.max.apply(null, prices);
      if(!isFinite(min) || !isFinite(max)){ min = max = 0; }
      var range = max - min;
      if(range <= 0){ range = 1; }
      var verticalPadding = Math.max(4, Math.min(height * 0.24, height * 0.18));
      if(verticalPadding * 2 >= height){ verticalPadding = Math.max(4, height * 0.1); }
      var usableHeight = height - verticalPadding * 2;
      if(usableHeight <= 0){ verticalPadding = 4; usableHeight = Math.max(8, height - 8); }
      var step = prices.length > 1 ? width / (prices.length - 1) : width;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';

      ctx.beginPath();
      prices.forEach(function(price, idx){
        var x = idx * step;
        var norm = (price - min) / range;
        var y = height - verticalPadding - norm * usableHeight;
        if(idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      var gradient = ctx.createLinearGradient(0, verticalPadding, 0, height);
      gradient.addColorStop(0, 'rgba(88, 255, 169, 0.22)');
      gradient.addColorStop(1, 'rgba(88, 255, 169, 0)');
      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.beginPath();
      prices.forEach(function(price, idx){
        var x = idx * step;
        var norm = (price - min) / range;
        var y = height - verticalPadding - norm * usableHeight;
        if(idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = 'rgba(88, 255, 169, 0.95)';
      ctx.lineWidth = 2;
      ctx.stroke();

      var lastIndex = prices.length - 1;
      var lastX = lastIndex * step;
      var lastNorm = (prices[lastIndex] - min) / range;
      var lastY = height - verticalPadding - lastNorm * usableHeight;
      ctx.beginPath();
      ctx.arc(lastX, lastY, 3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(88, 255, 169, 1)';
      ctx.fill();

      canvas.classList.add('sparkline-visible');
    }
  }
  if(summaryEl){
    var summaryMessage = renderOptions.summaryText || describeSparklineSeries(series, renderOptions.periodLabel);
    if(renderOptions.summarySuffix){ summaryMessage += ' ' + renderOptions.summarySuffix; }
    summaryEl.textContent = summaryMessage;
  }
  LM_BARU_SPARKLINE_META = Object.assign({}, renderOptions, { hasSeries: true });
}
function applySparklineFromCache(summarySuffix, fallbackText){
  if(!Array.isArray(LM_BARU_PRICE_SERIES) || LM_BARU_PRICE_SERIES.length < 2){
    var storedSeries = readLastSparklineSeries();
    if(Array.isArray(storedSeries) && storedSeries.length >= 2){ LM_BARU_PRICE_SERIES = storedSeries; }
  }
  if(Array.isArray(LM_BARU_PRICE_SERIES) && LM_BARU_PRICE_SERIES.length >= 2){
    updateLmBaruSparkline(LM_BARU_PRICE_SERIES, {
      periodLabel: (LM_BARU_SPARKLINE_META && LM_BARU_SPARKLINE_META.periodLabel) || DEFAULT_SPARKLINE_PERIOD,
      summarySuffix: summarySuffix
    });
  } else {
    var message = typeof fallbackText === 'string' ? fallbackText : (typeof summarySuffix === 'string' ? summarySuffix : 'Grafik riwayat tidak tersedia.');
    updateLmBaruSparkline(null, {
      fallbackText: message,
      summaryText: message
    });
  }
}
function extractPreviousBase(data, currentBase){
  if(!data) return null;
  var entries = [];
  var order = 0;
  function pushEntry(entry, isCurrent){
    if(!entry) return;
    var val = safeNumber(entry.buy);
    if(val === null) return;
    entries.push({
      value: val,
      time: resolveDate(entry.priceDate || entry.time || entry.timestamp || entry.date || entry.updatedAt),
      order: order++,
      isCurrent: !!isCurrent
    });
  }
  pushEntry(data.current, true);
  pushEntry(data.previous, false);
  if(data.current && data.current.previous) pushEntry(data.current.previous, false);
  if(Array.isArray(data.history)) data.history.forEach(function(item){ pushEntry(item, false); });
  if(!entries.length) return null;
  entries.sort(function(a,b){
    if(a.time && b.time){ return b.time.getTime() - a.time.getTime(); }
    if(a.time && !b.time) return -1;
    if(!a.time && b.time) return 1;
    return b.order - a.order;
  });
  var currentVal = safeNumber(currentBase);
  var currentEntry = entries.find(function(entry){ return entry.isCurrent; }) || entries[0];
  if(currentEntry && currentVal === null) currentVal = currentEntry.value;
  return entries.find(function(entry){
    if(currentEntry && entry === currentEntry) return false;
    if(currentVal !== null && Math.abs(entry.value - currentVal) < 1) return false;
    return true;
  })?.value || null;
}
function buildPerhiasanPricesFromBase(basePrice){
  return GOLD_KARAT_SERIES.map(function(entry){
    var factor = entry.karat === 24 ? FACTOR_PERHIASAN_24K : FACTOR_PERHIASAN_SUB;
    var harga = roundUpPrice(basePrice * entry.purity * factor + PRICE_ADJUST_IDR);
    return { karat: entry.karat, price: harga, infoKey: 'karat-' + entry.karat };
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
    var infoAttr = row.infoKey ? ` data-info-key="${row.infoKey}" tabindex="0" role="button" aria-label="Detail ${row.label}"` : '';
    var iconTooltip = row.iconTooltip || row.label;
    var tooltipAttr = iconTooltip ? ` data-tooltip="${escapeAttr(iconTooltip)}"` : '';
    var iconAriaAttr = iconTooltip ? ` role="img" aria-label="${escapeAttr(iconTooltip)}"` : ' aria-hidden="true"';
    var iconHtml = row.icon ? `<span class="price-icon price-icon--${row.icon} tooltip"${tooltipAttr}${iconAriaAttr}></span>` : '';
    var addAttrs = '';
    if(row.addCat){ addAttrs += ` data-add-cat="${row.addCat}"`; }
    if(row.addKadar !== undefined && row.addKadar !== null){ addAttrs += ` data-add-kadar="${row.addKadar}"`; }
    var addTooltip = `Tambahkan ${row.label} ke kalkulator`;
    var addBtn = row.addCat ? `<button type="button" class="price-add-btn tooltip"${addAttrs} aria-label="${escapeAttr(addTooltip)}" data-tooltip="${escapeAttr(addTooltip)}"><span class="price-add-icon" aria-hidden="true">+</span></button>` : '';
    var labelHtml = `<div class="price-label">${row.label}</div>`;
    var priceHtml = `<div class="price-amount" style="color:${color}">Rp <span class="num" data-to="${row.price}">0</span></div>`;
    var actionHtml = row.addCat ? addBtn : '';
    var indicatorIcon = row.infoKey ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>` : '';
    tbody.insertAdjacentHTML('beforeend', `<tr class="price-row"${infoAttr}><td class="kadar">${iconHtml}${labelHtml}</td><td class="price-cell">${priceHtml}</td><td class="price-action">${actionHtml}</td><td class="price-indicator-cell">${indicatorIcon}</td></tr>`);
    priceEntries.push({ name: row.schemaName || row.label, price: row.price });
  });
  tbody.setAttribute('aria-busy','false');
  updatePriceSchema(priceEntries);
  document.dispatchEvent(new CustomEvent('prices:updated'));
}
function renderPriceTableFromNumbers(lmBaru, lmLama, perhiasanEntries){
  var rows = [
    { label: 'Logam Mulia (LM) Baru', schemaName: 'Logam Mulia (LM) Baru', price: lmBaru, color: GOLD_ROW_PRIMARY, infoKey: 'lm_baru', icon: 'lm', iconTitle: 'Keping logam mulia', iconTooltip: 'Logam Mulia (LM) Baru', addCat: 'lm_baru', addKadar: '24' },
    { label: 'Logam Mulia (LM) Lama', schemaName: 'Logam Mulia (LM) Lama', price: lmLama, color: GOLD_ROW_SECONDARY, infoKey: 'lm_lama', icon: 'lm', iconTitle: 'Keping logam mulia', iconTooltip: 'Logam Mulia (LM) Lama', addCat: 'lm_lama', addKadar: '24' }
  ];
  (perhiasanEntries || []).forEach(function(entry){
    var iconType = 'jewelry';
    var iconTitle = 'Perhiasan emas';
    var iconTooltip = `Perhiasan ${entry.karat}K`;
    if(entry.karat && Number(entry.karat) < 17){
      iconType = 'jewelry-low';
      iconTitle = 'Perhiasan kadar menengah';
    }
    var catValue = entry.karat === 24 ? 'perhiasan_24' : 'perhiasan_sub';
    rows.push({
      label: `${entry.karat}K`,
      schemaName: `Perhiasan ${entry.karat}K`,
      price: entry.price,
      color: entry.color || GOLD_ROW_PRIMARY,
      infoKey: entry.infoKey || ('karat-' + entry.karat),
      icon: entry.icon || iconType,
      iconTitle: entry.iconTitle || iconTitle,
      iconTooltip: entry.iconTooltip || iconTooltip,
      addCat: entry.addCat || catValue,
      addKadar: entry.addKadar || String(entry.karat)
    });
  });
  renderPriceTable(rows);
}
function displayFromBasePrice(basePrice, options){
  options = options || {};
  var normalizedBase = Number(basePrice);
  if(!Number.isFinite(normalizedBase)) return;
  var lmBaru = computeLmBaruPrice(normalizedBase);
  var lmLama = computeLmLamaPrice(normalizedBase);
  renderPriceTableFromNumbers(lmBaru, lmLama, buildPerhiasanPricesFromBase(normalizedBase));

  var prevPrice = null;
  if(Number.isFinite(options.previousPrice)) prevPrice = Math.round(options.previousPrice);
  else if(Number.isFinite(options.previousBase)) prevPrice = computeLmBaruPrice(options.previousBase);

  var highlightCard = document.getElementById('lmBaruHighlight');
  if(highlightCard) highlightCard.setAttribute('aria-busy', 'false');

    var highlightCard = document.getElementById('lmBaruHighlight');
  if(highlightCard) highlightCard.setAttribute('aria-busy', 'false');

  updateLmBaruHighlight(lmBaru, {
    previousPrice: prevPrice,
    updatedAt: options.updatedAt,
    deltaText: options.deltaText,
    badgeLabel: options.badgeLabel,
    badgeState: options.badgeState
  });

  var info = document.getElementById('lastUpdatedInfo');
  if(info){
    if(typeof options.infoText === 'string'){
      info.textContent = options.infoText;
    } else {
      var infoDate = resolveDate(options.updatedAt) || new Date();
      var infoText = 'Terakhir diperbarui: ' + formatDateTimeIndo(infoDate);
      if(options.metaSuffix) infoText += options.metaSuffix;
      info.textContent = infoText;
    }
  }
}

function handleGoldPriceFallback(summarySuffix, fallbackSummary){
  var last = readLastBasePrice();
  /* istanbul ignore next */
  if(last){
    REI_LAST_BASE_P = last.p;
    displayFromBasePrice(last.p, {
      updatedAt: last.t,
      infoText: last.t ? 'Terakhir diperbarui (cache): ' + formatDateTimeIndo(new Date(last.t)) : 'Terakhir diperbarui: data cache',
      badgeLabel: 'Cache',
      badgeState: 'price-neutral'
    });
    applySparklineFromCache(
      typeof summarySuffix === 'string' ? summarySuffix : 'Menggunakan riwayat harga yang tersimpan.',
      typeof fallbackSummary === 'string' ? fallbackSummary : 'Grafik riwayat tidak tersedia saat data cache digunakan.'
    );
  }
  else { displayDefaultPrices(); }
}

async function fetchGoldPrice() {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), PRICE_TIMEOUT_MS);
  try {
    const response = await fetch(`https://pluang.com/api/asset/gold/pricing?daysLimit=${LM_HISTORY_DAYS_LIMIT}`, { signal: ctl.signal });
    const data = await response.json();
    if (data && data.statusCode === 200 && data.data && data.data.current) {
      const currentBase = safeNumber(data.data.current.buy);
      if(currentBase !== null){
        const previousBase = extractPreviousBase(data.data, currentBase);
        const updatedAtRaw = resolveDate(data.data.current.priceDate || data.data.current.time || data.data.current.timestamp || data.data.current.updatedAt);
        const updatedAt = updatedAtRaw || new Date();
        const historySeries = prepareLmBaruHistorySeries(data.data, currentBase, LM_HISTORY_DAYS_LIMIT);
        REI_LAST_BASE_P = currentBase;
        saveLastBasePrice(currentBase);
        if(Array.isArray(historySeries)){
          LM_BARU_PRICE_SERIES = historySeries.slice();
          if(historySeries.length >= 2){ saveLastSparklineSeries(historySeries); }
        } else {
          LM_BARU_PRICE_SERIES = [];
        }
        displayFromBasePrice(currentBase, { previousBase: previousBase, updatedAt: updatedAt });
        updateLmBaruSparkline(historySeries, {
          periodLabel: DEFAULT_SPARKLINE_PERIOD,
          fallbackText: 'Riwayat harga belum tersedia dari penyedia data.'
        });
        return;
      }
    }
    handleGoldPriceFallback('Menggunakan riwayat harga yang tersimpan dari cache.', 'Grafik riwayat tidak tersedia karena respons layanan tidak lengkap.');
  } catch (err) {
    /* istanbul ignore next */
    console.warn('Harga gagal dimuat, pakai default:', err?.name || err);
    handleGoldPriceFallback('Menggunakan riwayat harga terakhir yang tersimpan.', 'Grafik riwayat tidak tersedia karena koneksi bermasalah.');
  } finally {
    clearTimeout(t);
  }
}
function displayDefaultPrices() {
  var approxBase = (DEFAULT_PRICE_TABLE.lmBaru - PRICE_ADJUST_IDR) / FACTOR_LM_BARU;
  REI_LAST_BASE_P = approxBase;
  var highlightCard = document.getElementById('lmBaruHighlight');
  if(highlightCard) highlightCard.setAttribute('aria-busy', 'false');
    var highlightCard = document.getElementById('lmBaruHighlight');
  if(highlightCard) highlightCard.setAttribute('aria-busy', 'false');
  LM_BARU_PRICE_SERIES = [];
  displayFromBasePrice(approxBase, {
    previousPrice: null,
    infoText: 'Terakhir diperbarui: menggunakan harga default',
    deltaText: 'Gunakan data live untuk melihat perbandingan',
    badgeLabel: 'Menunggu',
    badgeState: 'price-neutral'
  });
  updateLmBaruSparkline(null, {
    fallbackText: 'Grafik riwayat tidak tersedia saat menggunakan harga default.',
    summaryText: 'Grafik riwayat tidak tersedia saat menggunakan harga default.'
  });
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

window.addEventListener('resize', function(){
  if(!LM_BARU_SPARKLINE_META || !LM_BARU_SPARKLINE_META.hasSeries) return;
  if(!Array.isArray(LM_BARU_PRICE_SERIES) || LM_BARU_PRICE_SERIES.length < 2) return;
  if(LM_BARU_SPARKLINE_RESIZE_FRAME){ cancelAnimationFrame(LM_BARU_SPARKLINE_RESIZE_FRAME); }
  LM_BARU_SPARKLINE_RESIZE_FRAME = requestAnimationFrame(function(){
    LM_BARU_SPARKLINE_RESIZE_FRAME = null;
    updateLmBaruSparkline(LM_BARU_PRICE_SERIES, getSparklineReuseOptions());
  });
}, { passive: true });

// Modal detail kadar emas dari tabel harga
/* istanbul ignore next */
(function(){
  var table = document.getElementById('goldPriceTable');
  var modal = document.getElementById('goldInfoModal');
  if(!table || !modal) return;

  var titleEl = modal.querySelector('[data-modal-title]');
  var metaEl = modal.querySelector('[data-modal-meta]');
  var descEl = modal.querySelector('[data-modal-desc]');
  var tipsEl = modal.querySelector('[data-modal-tips]');
  var tipsWrap = modal.querySelector('[data-modal-tips-wrap]');
  var closeBtn = modal.querySelector('[data-modal-close]');
  var dialog = modal.querySelector('[data-modal-dialog]');
  var lastFocusEl = null;

  if(dialog && !dialog.hasAttribute('tabindex')){
    dialog.setAttribute('tabindex', '-1');
  }

  function resolveInfo(key){
    return GOLD_INFO_CONTENT[key] || GOLD_INFO_CONTENT[key?.toLowerCase?.()] || GOLD_INFO_CONTENT.default;
  }

  function renderContent(data){
    if(!data) return;
    if(titleEl) titleEl.textContent = data.title || 'Detail Kadar Emas';
    if(metaEl){
      metaEl.textContent = data.meta || '';
      metaEl.style.display = data.meta ? '' : 'none';
    }
    if(descEl){
      descEl.textContent = data.description || '';
      descEl.style.display = data.description ? '' : 'none';
    }
    if(tipsEl){
      tipsEl.innerHTML = '';
      var tips = Array.isArray(data.tips) ? data.tips : [];
      tips.forEach(function(tip){
        var li = document.createElement('li');
        li.textContent = tip;
        tipsEl.appendChild(li);
      });
      if(tipsWrap){ tipsWrap.style.display = tips.length ? '' : 'none'; }
    }
  }

  function getFocusable(){
    return Array.prototype.slice.call(modal.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])'));
  }

  function trapFocus(ev){
    if(ev.key !== 'Tab') return;
    var focusable = getFocusable();
    if(!focusable.length) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if(ev.shiftKey && document.activeElement === first){
      ev.preventDefault();
      last.focus();
    } else if(!ev.shiftKey && document.activeElement === last){
      ev.preventDefault();
      first.focus();
    }
  }

  function openModal(key, trigger){
    var content = resolveInfo(key);
    if(!content) return;
    lastFocusEl = trigger || null;
    renderContent(content);
    modal.hidden = false;
    modal.classList.add('is-visible');
    document.body.classList.add('modal-open');
    var focusTarget = closeBtn || dialog;
    if(focusTarget && typeof focusTarget.focus === 'function'){
      focusTarget.focus();
    }
  }

  function closeModal(){
    if(modal.classList.contains('is-visible')){
      modal.classList.remove('is-visible');
      modal.hidden = true;
      document.body.classList.remove('modal-open');
      if(lastFocusEl && typeof lastFocusEl.focus === 'function'){
        requestAnimationFrame(function(){ lastFocusEl.focus(); });
      }
    }
  }

  table.addEventListener('click', function(ev){
    var addBtn = ev.target.closest('button[data-add-cat]');
    if(addBtn){
      ev.preventDefault();
      ev.stopPropagation();
      var options = {};
      var catAttr = addBtn.getAttribute('data-add-cat');
      var kadarAttr = addBtn.getAttribute('data-add-kadar');
      if(catAttr) options.cat = catAttr;
      if(kadarAttr !== null) options.kadar = kadarAttr;
      if(window.REI_CALC && typeof window.REI_CALC.setSelection === 'function'){
        window.REI_CALC.setSelection(options);
      }
      return;
    }
    var row = ev.target.closest('tr[data-info-key]');
    if(!row) return;
    ev.preventDefault();
    openModal(row.getAttribute('data-info-key'), row);
  });

  table.addEventListener('keydown', function(ev){
    if(ev.key !== 'Enter' && ev.key !== ' ' && ev.key !== 'Spacebar') return;
    if(ev.target.closest('button')) return;
    var row = ev.target.closest('tr[data-info-key]');
    if(!row) return;
    ev.preventDefault();
    openModal(row.getAttribute('data-info-key'), row);
  });

  if(closeBtn){
    closeBtn.addEventListener('click', function(){ closeModal(); });
  }

  modal.addEventListener('click', function(ev){
    if(ev.target === modal){ closeModal(); }
  });

  document.addEventListener('keydown', function(ev){
    if(ev.key === 'Escape'){ closeModal(); }
  });

  modal.addEventListener('keydown', trapFocus);
  if(dialog){
    dialog.addEventListener('click', function(ev){ ev.stopPropagation(); });
  }
})();

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
    var msg = `Halo Sentral Emas,%0A%0ASaya ingin konsultasi buyback:%0A- Kategori: ${labelCat(c)}%0A- Kadar: ${k}K%0A- Berat: ${g} gram%0A- Estimasi: Rp ${formatIDR(est)}%0A%0AMohon info lebih lanjut, terima kasih.`;
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

  function setSelection(options){
    if(!options) return;
    if(options.cat){
      var desired = String(options.cat);
      var hasOption = Array.prototype.some.call(cat.options, function(opt){ return opt.value === desired; });
      if(hasOption) cat.value = desired;
      toggleKadar();
    }
    if(options.kadar !== undefined && options.kadar !== null){
      var val = String(options.kadar);
      var hasKadarOption = Array.prototype.some.call(kadar.options, function(opt){ return opt.value === val; });
      if(hasKadarOption || kadar.disabled){
        kadar.value = val;
      }
    }
    if(options.berat !== undefined && options.berat !== null){
      berat.value = String(options.berat);
    }
    compute();
    var section = document.getElementById('kalkulator');
    if(section){ section.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  }

  window.REI_CALC = window.REI_CALC || {};
  window.REI_CALC.setSelection = setSelection;
})();

// Konverter satuan emas
/* istanbul ignore next */
(function(){
  var fromValue = document.getElementById('conv-from-value');
  var toValue = document.getElementById('conv-to-value');
  var fromUnit = document.getElementById('conv-from-unit');
  var toUnit = document.getElementById('conv-to-unit');
  var swapBtn = document.getElementById('conv-swap');
  if(!fromValue || !toValue || !fromUnit || !toUnit) return;

  var updating = false;

  function populate(select){
    select.innerHTML = '';
    GOLD_UNIT_DEFS.forEach(function(unit){
      var opt = document.createElement('option');
      opt.value = unit.id;
      opt.textContent = unit.label;
      select.appendChild(opt);
    });
  }

  function unitById(id){
    return GOLD_UNIT_DEFS.find(function(u){ return u.id === id; }) || GOLD_UNIT_DEFS[0];
  }

function sanitize(value){
  var num = Number(value);
  return Number.isFinite(num) ? num : 0;
}

function format(number){
  if(!Number.isFinite(number)) return '0';
  var abs = Math.abs(number);
  var decimals = abs >= 100 ? 2 : abs >= 1 ? 3 : 5;
  var fixed = number.toFixed(decimals);
  var trimmedNum = Number(fixed);
  if(Number.isFinite(trimmedNum)){
    var str = trimmedNum.toString();
    if(str.indexOf('e') >= 0) return fixed.replace(/\.?0+$/,'');
    return str;
  }
  return fixed.replace(/(\.\d*?)0+$/,'$1').replace(/\.0+$/,'');
}

  function convertFrom(){
    if(updating) return;
    updating = true;
    var amount = sanitize(fromValue.value);
    var from = unitById(fromUnit.value);
    var to = unitById(toUnit.value);
    var grams = amount * from.toGram;
    var converted = grams / to.toGram;
    toValue.value = format(converted);
    updating = false;
  }

  function convertTo(){
    if(updating) return;
    updating = true;
    var amount = sanitize(toValue.value);
    var from = unitById(fromUnit.value);
    var to = unitById(toUnit.value);
    var grams = amount * to.toGram;
    var converted = grams / from.toGram;
    fromValue.value = format(converted);
    updating = false;
  }

  function swap(){
    var fromId = fromUnit.value;
    fromUnit.value = toUnit.value;
    toUnit.value = fromId;
    convertFrom();
  }

  populate(fromUnit);
  populate(toUnit);
  fromUnit.value = 'gram';
  toUnit.value = 'ameh';
  convertFrom();

  fromValue.addEventListener('input', convertFrom);
  fromUnit.addEventListener('change', convertFrom);
  toUnit.addEventListener('change', convertFrom);
  toValue.addEventListener('input', convertTo);
  if(swapBtn){ swapBtn.addEventListener('click', function(){ swap(); }); }
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

  // Toggle visibility based on scroll position
  var scrollThreshold = 200; // Show after scrolling 200px
  function toggleBackToTop() {
    if (window.scrollY > scrollThreshold) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }
  window.addEventListener('scroll', toggleBackToTop, { passive: true });
  toggleBackToTop(); // Check initial state
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

// PWA Install Prompt
/* istanbul ignore next */
(function(){
  let deferredPrompt;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const prompt = document.getElementById('pwaPrompt');
    if (prompt) {
      prompt.hidden = false;
      prompt.setAttribute('data-state', 'install');
    }
  });

  window.addEventListener('appinstalled', () => {
    const prompt = document.getElementById('pwaPrompt');
    if (prompt) {
      prompt.hidden = true;
    }
    deferredPrompt = null;
  });

  document.addEventListener('click', (e) => {
    const action = e.target.closest('[data-action]');
    if (!action) return;
    const act = action.getAttribute('data-action');
    const prompt = document.getElementById('pwaPrompt');
    if (act === 'install' && deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        deferredPrompt = null;
        if (prompt) prompt.hidden = true;
      });
    } else if (act === 'close') {
      if (prompt) prompt.hidden = true;
    } else if (act === 'open') {
      if (prompt) prompt.hidden = true;
    }
  });
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
