// Extracted from inline scripts in index.html

function normalizeSearchText(value) {
  if (!value && value !== 0) return '';
  var text = String(value);
  try {
    if (text.normalize) {
      text = text.normalize('NFD');
    }
  } catch (e) {}
  return text.replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function applyAlternateSectionBackgrounds(doc) {
  var rootDoc = doc || (typeof document !== 'undefined' ? document : null);
  if (!rootDoc) return [];
  var mainEl = rootDoc.querySelector ? rootDoc.querySelector('main') : null;
  if (!mainEl) return [];
  var sections;
  try {
    sections = Array.prototype.slice.call(mainEl.querySelectorAll(':scope > section'));
  } catch (_err) {
    var childNodes = mainEl.children ? Array.prototype.slice.call(mainEl.children) : [];
    sections = childNodes.filter(function(node) {
      return node && typeof node.tagName === 'string' && node.tagName.toLowerCase() === 'section';
    });
  }
  var assignments = [];
  var useSecondary = true;

  sections.forEach(function(section) {
    if (!section || !section.style) return;
    try {
      section.style.backgroundColor = '';
    } catch (_e) {}
    if (section.classList && section.classList.contains('has-alt-background')) {
      section.classList.remove('has-alt-background');
    }
    if (section.dataset && section.dataset.altBgIndex) {
      try {
        delete section.dataset.altBgIndex;
      } catch (_err) {}
    }
  });

  var getStyle = null;
  if (rootDoc && rootDoc.defaultView && typeof rootDoc.defaultView.getComputedStyle === 'function') {
    getStyle = function(node) {
      try {
        return rootDoc.defaultView.getComputedStyle(node);
      } catch (_err) {
        return null;
      }
    };
  } else if (typeof window !== 'undefined' && typeof window.getComputedStyle === 'function') {
    getStyle = function(node) {
      try {
        return window.getComputedStyle(node);
      } catch (_err) {
        return null;
      }
    };
  } else {
    getStyle = function() {
      return null;
    };
  }

  sections.forEach(function(section) {
    if (!section || !section.style || !section.classList) return;
    if (section.classList.contains('hero')) return;
    if (section.dataset && (section.dataset.altSkip === 'true' || section.dataset.skipAlt === 'true')) return;
    if (section.hasAttribute && section.hasAttribute('data-alt-skip')) return;
    if (section.hidden || (section.hasAttribute && section.hasAttribute('hidden'))) return;

    var style = getStyle(section);
    if (style && (style.display === 'none' || style.visibility === 'hidden')) return;

    var color = useSecondary ? 'var(--bg-secondary)' : 'var(--bg-primary)';
    try {
      section.style.backgroundColor = color;
      section.classList.add('has-alt-background');
      if (section.dataset) {
        section.dataset.altBgIndex = useSecondary ? 'odd' : 'even';
      }
      assignments.push({
        element: section,
        color: color
      });
    } catch (_err) {}
    useSecondary = !useSecondary;
  });

  return assignments;
}

const SEARCH_INDEX = (function() {
  const entries = [{
      id: 'home',
      url: '/',
      title: 'Sentral Emas – Terima Jual Emas & Berlian COD',
      description: 'Menerima jual emas, berlian, jam tangan mewah, batu mulia via COD aman se-Jabodetabek. Ikuti harga pasar, proses cepat, transparan, terpercaya.',
      excerpt: 'Layanan buyback emas, berlian, jam tangan mewah, serta batu mulia dengan COD aman dan appraisal transparan.',
      type: 'Halaman',
      category: 'Layanan',
      date: '2025-01-05',
      readingTime: '',
      keywords: ['jual emas', 'jual emas jabodetabek', 'buyback emas', 'cod', 'berlian', 'jam tangan mewah', 'batu mulia', 'jual emas tanpa surat'],
      priority: 6,
      content: 'Sentral Emas menyediakan konsultasi buyback emas, berlian, jam tangan mewah, dan batu mulia dengan penjemputan COD Jabodetabek, estimasi harga pasar, proses appraisal terbuka, serta layanan cepat dan aman melalui WhatsApp.'
    },
    {
      id: 'harga',
      url: '/harga/',
      title: 'Harga Buyback Emas COD | Sentral Emas',
      description: 'Cek harga buyback emas, logam mulia, dan perhiasan terkini. Dilengkapi kalkulator estimasi dan kontak WhatsApp untuk update real-time.',
      excerpt: 'Update harga buyback emas & logam mulia lengkap dengan kalkulator estimasi COD Sentral Emas.',
      type: 'Halaman',
      category: 'Harga',
      date: '2025-10-03',
      readingTime: '',
      keywords: ['harga emas hari ini', 'harga buyback', 'kalkulator emas', 'logam mulia'],
      priority: 5,
      content: 'Halaman harga buyback menghadirkan tabel perhiasan, logam mulia baru dan lama, highlight pergerakan harga harian, waktu update WIB, tombol WhatsApp, dan kalkulator berat serta kadar emas untuk simulasi COD.'
    },
    {
      id: 'blog',
      url: '/blog/',
      title: 'Blog Sentral Emas – Tips Jual Beli Emas COD',
      description: 'Artikel dan panduan Sentral Emas seputar tips jual beli emas & berlian via COD yang aman dan transparan.',
      excerpt: 'Kumpulan artikel, panduan, dan insight jual beli emas, berlian, serta layanan COD Sentral Emas.',
      type: 'Blog',
      category: 'Blog',
      date: '2025-10-03',
      readingTime: '',
      keywords: ['blog emas', 'tips jual emas', 'panduan berlian', 'keaslian emas'],
      priority: 4,
      content: 'Blog Sentral Emas menyajikan edukasi jual beli emas dan berlian, referensi keaslian, strategi transaksi COD aman, hingga insight perhiasan, harga pasar, dan cara jual emas tanpa surat.'
    },
    {
      id: 'panduan-jual-emas-tanpa-surat',
      url: '/blog/panduan-jual-emas-tanpa-surat/',
      title: 'Panduan Jual Emas Tanpa Surat: Syarat, Risiko, dan Solusi Aman',
      description: 'Pelajari cara jual emas tanpa surat resmi beserta syarat minimum, risiko yang perlu diwaspadai, dan solusi aman via COD Sentral Emas.',
      excerpt: 'Strategi menjual emas tanpa surat lengkap dengan dokumen pendukung, mitigasi risiko, dan tips memaksimalkan nilai COD.',
      type: 'Blog',
      category: 'Panduan',
      date: '2025-10-03',
      readingTime: '±9 menit',
      keywords: ['jual emas tanpa surat', 'syarat jual emas', 'risiko jual emas', 'cod emas aman'],
      priority: 8,
      content: 'Panduan menyajikan langkah menyiapkan identitas dan bukti pendukung, alur konsultasi WhatsApp, strategi mitigasi risiko, hingga proses COD transparan bersama Sentral Emas.'
    },
    {
      id: 'checklist-foto-emas-cod',
      url: '/blog/checklist-foto-emas-cod/',
      title: 'Checklist Foto & Dokumen Emas Sebelum Konsultasi COD',
      description: 'Lengkapi permintaan buyback Sentral Emas dengan foto dan dokumen yang tepat agar estimasi COD lebih cepat dan akurat.',
      excerpt: 'Panduan menyiapkan foto detail, bukti pendukung, dan tips pengambilan gambar agar appraisal COD berjalan cepat.',
      type: 'Blog',
      category: 'Panduan',
      date: '2025-09-23',
      readingTime: '±8 menit',
      keywords: ['checklist foto emas', 'dokumen buyback', 'persiapan cod emas', 'foto perhiasan'],
      priority: 7,
      content: 'Artikel menjelaskan foto yang dibutuhkan, dokumen tambahan seperti bukti pembelian atau servis, teknik foto smartphone, dan kesalahan umum yang perlu dihindari sebelum konsultasi COD.'
    },
    {
      id: 'panduan-buyback-berlian',
      url: '/blog/panduan-buyback-berlian/',
      title: 'Panduan Buyback Berlian: Kenali 4C, Bentuk, & Sertifikat',
      description: 'Pelajari 4C berlian, variasi bentuk populer, dan panduan sertifikat untuk buyback berlian COD di Sentral Emas.',
      excerpt: 'Ringkasan kualitas berlian, skala warna komersial, bentuk favorit, dan tips menyiapkan sertifikat saat buyback.',
      type: 'Blog',
      category: 'Panduan',
      date: '2025-09-17',
      readingTime: '±10 menit',
      keywords: ['berlian', '4c', 'sertifikat gia', 'buyback berlian', 'panduan berlian'],
      priority: 7,
      content: 'Artikel membahas empat pilar 4C (cut, color, clarity, carat), tabel warna D sampai K, bentuk round, princess, cushion, hingga tips sertifikat GIA, perawatan, dan persiapan konsultasi buyback berlian COD bersama Sentral Emas.'
    },
    {
      id: 'panduan-keaslian-emas',
      url: '/blog/panduan-menilai-keaslian-emas-sebelum-cod/',
      title: 'Panduan Menilai Keaslian Emas Sebelum COD',
      description: 'Cara sederhana memeriksa keaslian emas di rumah sebelum transaksi COD bersama Sentral Emas. Lengkap dengan tips dokumentasi dan kapan perlu ahli.',
      excerpt: 'Langkah memeriksa stempel, warna, densitas, uji magnet, dan dokumentasi sebelum transaksi emas COD.',
      type: 'Blog',
      category: 'Panduan',
      date: '2025-09-12',
      readingTime: '±7 menit',
      keywords: ['keaslian emas', 'uji emas', 'uji magnet', 'uji asam', 'sentral emas'],
      priority: 6,
      content: 'Panduan menilai emas asli mencakup pemeriksaan stempel, perubahan warna, uji magnet dan uji asam, cara menimbang berat, menyiapkan foto atau video sebelum buyback, serta kapan berkonsultasi dengan tim Sentral Emas.'
    },
    {
      id: 'keuntungan-jual-emas-cod',
      url: '/blog/keuntungan-jual-emas-cod/',
      title: 'Keuntungan Jual Emas via COD yang Aman',
      description: 'Pelajari keuntungan menggunakan layanan buyback emas COD Sentral Emas beserta tips menyiapkan transaksi agar proses aman dan transparan.',
      excerpt: 'Keunggulan transaksi buyback emas COD, keamanan penjemputan, dan tips menyiapkan barang sebelum tim datang.',
      type: 'Blog',
      category: 'Panduan',
      date: '2025-09-05',
      readingTime: '±6 menit',
      keywords: ['jual emas cod', 'buyback emas', 'keamanan cod', 'tips jual emas'],
      priority: 5,
      content: 'Artikel merangkum manfaat buyback COD seperti appraisal transparan, pembayaran instan, transaksi di lokasi pelanggan, serta saran menata perhiasan dan dokumen sebelum tim Sentral Emas tiba.'
    }
  ];

  return entries.map(function(entry, index) {
    const keywordList = Array.isArray(entry.keywords) ? entry.keywords : String(entry.keywords || '').split(',');
    const keywords = keywordList.map(function(k) {
      return String(k || '').trim();
    }).filter(function(k) {
      return k.length;
    });
    const normalizedTitle = normalizeSearchText(entry.title);
    const normalizedDescription = normalizeSearchText(entry.description || '');
    const normalizedContent = normalizeSearchText(entry.content || '');
    const normalizedKeywords = normalizeSearchText(keywords.join(' '));
    const normalized = [normalizedTitle, normalizedDescription, normalizedContent, normalizedKeywords].join(' ').trim();
    return {
      id: entry.id || ('search-' + index),
      url: entry.url,
      title: entry.title,
      description: entry.description || '',
      excerpt: entry.excerpt || entry.description || '',
      type: entry.type || 'Halaman',
      category: entry.category || entry.type || 'Halaman',
      date: entry.date || '',
      readingTime: entry.readingTime || '',
      keywords: keywords,
      priority: entry.priority || 0,
      content: entry.content || '',
      normalized: normalized,
      normalizedTitle: normalizedTitle,
      normalizedDescription: normalizedDescription,
      normalizedContent: normalizedContent,
      normalizedKeywords: normalizedKeywords
    };
  });
})();

if (typeof window !== 'undefined') {
  window.SENTRAL_EMAS_SEARCH_INDEX = SEARCH_INDEX;
}

/* istanbul ignore next */
(function() {
  // ---- Scroll progress + Parallax (class-based; minimize reflow) ----
  var bar = document.querySelector('.scroll-progress');
  var hero = document.querySelector('.hero');
  var parallaxRoot = hero && hero.hasAttribute('data-parallax-root') ? hero : null;
  var parallaxLayers = [];
  var parallaxRefreshPending = false;
  var reduceMotionQuery = null;
  var prefersReducedMotion = false;
  var heroRevealed = false;
  var root = document.scrollingElement || document.documentElement || document.body;
  var lastSP = -1,
    lastPar = -1,
    ticking = false,
    maxScroll = 1,
    maxPending = false;
  var schedule = window.requestAnimationFrame ? function(cb) {
    return window.requestAnimationFrame(cb);
  } : function(cb) {
    return setTimeout(cb, 16);
  };

  function updateMaxScroll() {
    maxPending = false;
    var h = root || document.documentElement;
    var docEl = document.documentElement;
    var body = document.body;
    if (!h && !docEl && !body) return;
    var scrollHeight = (h && h.scrollHeight) || (docEl && docEl.scrollHeight) || (body && body.scrollHeight) || 0;
    var clientHeight = (h && h.clientHeight) || (docEl && docEl.clientHeight) || window.innerHeight || 0;
    maxScroll = Math.max(1, scrollHeight - clientHeight);
    if (!ticking) {
      onScroll();
    }
  }

  function scheduleMaxScroll() {
    if (maxPending) return;
    maxPending = true;
    schedule(updateMaxScroll);
  }

  function applyScrollEffects() {
    var scroller = root || document.documentElement;
    var scrollTop = 0;
    if (scroller && typeof scroller.scrollTop === 'number') {
      scrollTop = scroller.scrollTop;
    } else {
      scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    }
    var denom = maxScroll > 0 ? maxScroll : 1;
    var p = (scrollTop / denom) * 100;
    var sp = Math.max(0, Math.min(20, Math.round(p / 5))); // 0..20
    if (bar && sp !== lastSP) {
      if (lastSP >= 0) bar.classList.remove('sp-' + lastSP);
      bar.classList.add('sp-' + sp);
      lastSP = sp;
    }
    // Parallax hero translate mapped to classes (no inline style)
    var parallaxBase = Math.min(40, scrollTop * 0.04);
    var par = Math.max(0, Math.min(20, Math.round(parallaxBase / 2)));
    if (hero && par !== lastPar) {
      if (lastPar >= 0) hero.classList.remove('par-' + lastPar);
      hero.classList.add('par-' + par);
      lastPar = par;
    }
    applyParallaxShift(parallaxBase);
    if (!heroRevealed && hero) {
      try {
        var viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
        var rect = typeof hero.getBoundingClientRect === 'function' ? hero.getBoundingClientRect() : null;
        if (!rect || typeof rect.top !== 'number' || viewportHeight === 0 || rect.top <= viewportHeight * 0.75) {
          hero.classList.add('hero-ready');
          heroRevealed = true;
        }
      } catch (_err) {
        hero.classList.add('hero-ready');
        heroRevealed = true;
      }
    }
    ticking = false;
  }

  function applyParallaxShift(amount) {
    if (!parallaxLayers.length || prefersReducedMotion) return;
    var viewportWidth = window.innerWidth || document.documentElement.clientWidth || 0;
    var viewportFactor = 1;
    if (viewportWidth && viewportWidth < 600) {
      viewportFactor = 0.55;
    } else if (viewportWidth && viewportWidth < 1024) {
      viewportFactor = 0.75;
    }
    var effective = amount * viewportFactor;
    parallaxLayers.forEach(function(layer) {
      if (!layer || !layer.el) return;
      var depth = layer.depth;
      if (!depth) {
        if (layer.current !== 0 && layer.el.style && layer.el.style.setProperty) {
          layer.current = 0;
          layer.el.style.setProperty('--parallax-shift', '0px');
        }
        return;
      }
      var shift = effective * depth * -1;
      if (layer.max !== null && shift > layer.max) shift = layer.max;
      if (layer.min !== null && shift < layer.min) shift = layer.min;
      if (shift > 80) shift = 80;
      if (shift < -80) shift = -80;
      if (Math.abs(shift - layer.current) < 0.1) return;
      layer.current = shift;
      if (layer.el.style && layer.el.style.setProperty) {
        layer.el.style.setProperty('--parallax-shift', shift.toFixed(2) + 'px');
      }
    });
  }

  function disableParallax() {
    if (!parallaxRoot) return;
    parallaxRoot.classList.add('is-parallax-disabled');
    var nodes = parallaxRoot.querySelectorAll('[data-parallax-layer]');
    nodes.forEach(function(node) {
      if (node && node.style && node.style.removeProperty) {
        node.style.removeProperty('--parallax-shift');
      }
    });
    parallaxLayers = [];
  }

  function refreshParallaxLayers() {
    if (!parallaxRoot) return;
    if (prefersReducedMotion) {
      disableParallax();
      return;
    }
    parallaxRoot.classList.remove('is-parallax-disabled');
    var nodes;
    try {
      nodes = Array.prototype.slice.call(parallaxRoot.querySelectorAll('[data-parallax-layer]'));
    } catch (_err) {
      nodes = [];
    }
    parallaxLayers = nodes.map(function(node) {
      var depthAttr = node ? (node.getAttribute('data-parallax-depth') || (node.dataset && node.dataset.parallaxDepth)) : 0;
      var maxAttr = node ? (node.getAttribute('data-parallax-max') || (node.dataset && node.dataset.parallaxMax)) : null;
      var minAttr = node ? (node.getAttribute('data-parallax-min') || (node.dataset && node.dataset.parallaxMin)) : null;
      var depth = parseFloat(depthAttr);
      if (!isFinite(depth)) depth = 0;
      var max = parseFloat(maxAttr);
      if (!isFinite(max)) max = null;
      var min = parseFloat(minAttr);
      if (!isFinite(min)) min = null;
      if (node && node.style && node.style.setProperty) {
        node.style.setProperty('--parallax-shift', '0px');
      }
      return {
        el: node,
        depth: depth,
        max: max,
        min: min,
        current: 0
      };
    });
  }

  function queueParallaxRefresh() {
    if (!parallaxRoot || prefersReducedMotion) return;
    if (parallaxRefreshPending) return;
    parallaxRefreshPending = true;
    schedule(function() {
      parallaxRefreshPending = false;
      refreshParallaxLayers();
      if (!prefersReducedMotion) {
        onScroll();
      }
    });
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    schedule(applyScrollEffects);
  }
  window.addEventListener('scroll', onScroll, {
    passive: true
  });
  window.addEventListener('resize', scheduleMaxScroll, {
    passive: true
  });
  window.addEventListener('resize', queueParallaxRefresh, {
    passive: true
  });
  document.addEventListener('prices:updated', scheduleMaxScroll);
  if ('ResizeObserver' in window) {
    try {
      var ro = new ResizeObserver(scheduleMaxScroll);
      if (root) {
        ro.observe(root);
      } else {
        ro.observe(document.documentElement);
      }
    } catch (e) {}
  }
  if ('ResizeObserver' in window && parallaxRoot) {
    try {
      var parallaxObserver = new ResizeObserver(queueParallaxRefresh);
      parallaxObserver.observe(parallaxRoot);
    } catch (_err) {}
  }
  scheduleMaxScroll();
  onScroll();

  if (window.matchMedia) {
    try {
      reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      prefersReducedMotion = !!reduceMotionQuery.matches;
      var handleMotionPreference = function(event) {
        prefersReducedMotion = !!(event && event.matches);
        if (prefersReducedMotion) {
          disableParallax();
        } else {
          queueParallaxRefresh();
        }
      };
      if (typeof reduceMotionQuery.addEventListener === 'function') {
        reduceMotionQuery.addEventListener('change', handleMotionPreference);
      } else if (typeof reduceMotionQuery.addListener === 'function') {
        reduceMotionQuery.addListener(handleMotionPreference);
      }
    } catch (_err) {}
  }

  if (parallaxRoot) {
    if (prefersReducedMotion) {
      disableParallax();
    } else {
      queueParallaxRefresh();
    }
  }

  // ---- WA click pulse (no inline styles) ----
  document.querySelectorAll('a[href^="https://wa.me"], [data-track^="wa-"]').forEach(function(el) {
    el.addEventListener('click', function() {
      el.classList.add('pulse');
      setTimeout(function() {
        el.classList.remove('pulse');
      }, 500);
    });
  });

  // ---- Hover tilt (desktop only) ----
  if (window.matchMedia && window.matchMedia('(pointer:fine)').matches) {
    var cards = document.querySelectorAll('.feature, .t-card');
    cards.forEach(function(card) {
      var rect;
      card.addEventListener('mouseenter', function() {
        rect = card.getBoundingClientRect();
      });
      card.addEventListener('mousemove', function(ev) {
        if (!rect) rect = card.getBoundingClientRect();
        var px = (ev.clientX - rect.left) / rect.width - .5;
        var py = (ev.clientY - rect.top) / rect.height - .5;
        var rx = (py * -4);
        var ry = (px * 6);
        card.style.transform = 'perspective(700px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateZ(0)';
      });
      card.addEventListener('mouseleave', function() {
        card.style.transform = 'none';
      });
    });
  }
})();

/* istanbul ignore next */
(function() {
  if (typeof document === 'undefined') return;
  var mainEl = document.querySelector('main');
  if (!mainEl) return;

  var apply = function() {
    applyAlternateSectionBackgrounds(document);
  };

  apply();

  if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
    window.addEventListener('DOMContentLoaded', apply);
    window.addEventListener('load', apply, {
      once: true
    });
  }

  if (typeof window !== 'undefined' && typeof window.MutationObserver === 'function') {
    try {
      var observer = new MutationObserver(function(mutations) {
        for (var i = 0; i < mutations.length; i++) {
          var mutation = mutations[i];
          if (mutation.type !== 'attributes' || mutation.attributeName !== 'hidden') continue;
          var target = mutation.target;
          if (!target || typeof target.tagName !== 'string') continue;
          if (target.tagName.toLowerCase() !== 'section') continue;
          if (typeof target.closest === 'function' ? target.closest('main') !== mainEl : target.parentNode !== mainEl) continue;
          apply();
          break;
        }
      });
      observer.observe(mainEl, {
        attributes: true,
        subtree: true,
        attributeFilter: ['hidden']
      });
    } catch (_err) {}
  }

  if (typeof window !== 'undefined') {
    window.SENTRAL_EMAS_APPLY_SECTION_BACKGROUNDS = apply;
  }
})();

/* istanbul ignore next */
(function() {
  const ease = function(t) {
    return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t
  };

  function animateNumber(el, to, duration) {
    const from = Number(el.getAttribute('data-from') || 0);
    let start = null;
    el.classList.add('pulse');

    function step(ts) {
      if (!start) start = ts;
      const p = Math.min(1, (ts - start) / duration);
      const v = Math.round(from + (to - from) * ease(p));
      el.textContent = v.toLocaleString('id-ID');
      if (p < 1) {
        requestAnimationFrame(step);
        return;
      }
      el.textContent = to.toLocaleString('id-ID');
      el.classList.remove('pulse');
      el.setAttribute('data-from', to);
    }
    requestAnimationFrame(step);
  }

  // Observe numbers on first view
  const io = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        const el = e.target;
        const to = Number(el.getAttribute('data-to') || 0);
        animateNumber(el, to, 900);
        io.unobserve(el);
      }
    });
  }, {
    threshold: .3
  });
  document.querySelectorAll('.count, .num').forEach(function(n) {
    io.observe(n);
  });

  // Re-animate numbers after price table refresh
  document.addEventListener('prices:updated', function() {
    document.querySelectorAll('.num').forEach(function(n) {
      const to = Number(n.getAttribute('data-to') || 0);
      if (!n.getAttribute('data-from')) n.setAttribute('data-from', '0');
      animateNumber(n, to, 800);
    });
  });
})();

// Fallback untuk gambar/video + lazy load + reveal + date badge + typewriter
/* istanbul ignore next */
(function() {
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
  document.querySelectorAll('img[data-src]').forEach(function(img) {
    if (!img.src) img.src = placeholder;
  });
  document.querySelectorAll('img').forEach(function(img) {
    img.addEventListener('error', function() {
      img.src = placeholder;
      img.style.objectFit = 'cover';
      img.style.background = '#013D39';
    }, {
      once: true
    });
  });
  // Videos
  document.querySelectorAll('video').forEach(function(v) {
    try {
      v.setAttribute('poster', placeholder);
    } catch (e) {}
    v.addEventListener('error', function() {
      const img = document.createElement('img');
      img.src = placeholder;
      img.alt = 'video unavailable';
      img.style.objectFit = 'cover';
      img.style.background = '#013D39';
      v.replaceWith(img);
    }, {
      once: true
    });
    try {
      v.removeAttribute('controls');
      v.controls = false;
    } catch (e) {}
    v.muted = true;
    v.loop = true;
    v.playsInline = true;
    v.classList.add('reveal');
  });
  // Autoplay/pause when visible
  try {
    const vio = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        const vid = e.target;
        if (e.isIntersecting) {
          if (vid.preload !== 'auto') {
            vid.preload = 'auto';
          }
          vid.play().catch(() => {});
        } else {
          vid.pause();
        }
      });
    }, {
      threshold: 0.5
    });
    document.querySelectorAll('video').forEach(v => vio.observe(v));
  } catch (_) {}
  // Lazy load images with blur-up
  try {
    const iio = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const img = e.target;
        const real = img.getAttribute('data-src');
        if (real) {
          img.addEventListener('load', function() {
            img.classList.add('loaded');
          }, {
            once: true
          });
          img.src = real;
          img.removeAttribute('data-src');
        }
        iio.unobserve(img);
      });
    }, {
      rootMargin: '200px 0px'
    });
    document.querySelectorAll('img[data-src]').forEach(img => iio.observe(img));
  } catch (_) {
    document.querySelectorAll('img[data-src]').forEach(function(img) {
      const real = img.getAttribute('data-src');
      if (real) {
        img.addEventListener('load', function() {
          img.classList.add('loaded');
        }, {
          once: true
        });
        img.src = real;
        img.removeAttribute('data-src');
      }
    });
  }

  // Lazy load background images (e.g., hostess card)
  const loadBackground = function(el) {
    if (!el) return;
    const src = el.getAttribute('data-bg');
    if (!src) return;
    el.removeAttribute('data-bg');
    const img = new Image();
    try {
      img.decoding = 'async';
    } catch (_) {
      /* noop */ }
    if ('fetchPriority' in img) {
      img.fetchPriority = 'low';
    }
    img.addEventListener('load', function() {
      try {
        el.style.backgroundImage = 'url(' + JSON.stringify(src) + ')';
      } catch (_) {
        el.style.backgroundImage = 'url("' + src.replace(/"/g, '\\"') + '")';
      }
      el.classList.add('bg-loaded');
      const fallback = el.querySelector('.bg-hostess__fallback');
      if (fallback) {
        fallback.classList.add('is-hidden');
        const cleanup = function() {
          if (fallback && fallback.parentNode) {
            fallback.parentNode.removeChild(fallback);
          }
        };
        fallback.addEventListener('transitionend', cleanup, {
          once: true
        });
        setTimeout(cleanup, 700);
      }
    }, {
      once: true
    });
    img.addEventListener('error', function() {
      el.classList.add('bg-error');
    }, {
      once: true
    });
    img.src = src;
  };
  try {
    const bio = new IntersectionObserver((entries) => {
      entries.forEach(function(e) {
        if (!e.isIntersecting) return;
        const el = e.target;
        loadBackground(el);
        bio.unobserve(el);
      });
    }, {
      rootMargin: '200px 0px'
    });
    document.querySelectorAll('[data-bg]').forEach(function(el) {
      bio.observe(el);
    });
  } catch (_) {
    document.querySelectorAll('[data-bg]').forEach(loadBackground);
  }
  // Scroll reveal
  const revealables = Array.from(document.querySelectorAll('section, .feature, .card, .stat, .gallery img, .gallery video'));
  revealables.forEach(el => el.classList.add('reveal'));
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, {
      threshold: .12
    });
    revealables.forEach(el => io.observe(el));
  } else {
    revealables.forEach(el => el.classList.add('visible'));
  }

  const initPageScrollTimeline = () => {
    const sections = Array.from(document.querySelectorAll('[data-scroll-section]'));
    if (!sections.length) return;

    const heroIndex = sections.findIndex(section => section.id === 'home');
    let timelineSections = heroIndex >= 0 ? sections.slice(heroIndex + 1) : sections.slice();

    const isVisibleSection = (section) => {
      if (!section || !section.id) return false;
      if (section.hasAttribute('hidden')) return false;
      if (section.dataset.scrollTimeline === 'ignore') return false;
      const style = window.getComputedStyle(section);
      return style.display !== 'none' && style.visibility !== 'hidden';
    };

    timelineSections = timelineSections.filter(isVisibleSection);
    if (timelineSections.length < 2) return;

    const getScrollTop = () => window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
    const getScrollLeft = () => window.scrollX || window.pageXOffset || document.documentElement.scrollLeft || 0;

    const findAnchor = (section) => {
      if (!section) return null;
      const labelledId = section.getAttribute('aria-labelledby');
      if (labelledId) {
        const labelled = document.getElementById(labelledId);
        if (labelled) return labelled;
      }
      return section.querySelector('h2, h3, h1, [role="heading"]') || section;
    };

    const getLabelText = (section) => {
      const labelledId = section.getAttribute('aria-labelledby');
      if (labelledId) {
        const labelled = document.getElementById(labelledId);
        if (labelled) {
          const text = labelled.textContent || labelled.innerText;
          if (text) return text.trim();
        }
      }
      const heading = section.querySelector('h2, h3, h1');
      if (heading) {
        const text = heading.textContent || heading.innerText;
        if (text) return text.trim();
      }
      return section.dataset.timelineLabel || section.id.replace(/[-_]+/g, ' ');
    };

    const timeline = document.createElement('aside');
    timeline.className = 'page-timeline';
    timeline.setAttribute('role', 'navigation');
    timeline.setAttribute('aria-label', 'Navigasi bagian halaman');

    const line = document.createElement('div');
    line.className = 'page-timeline__line';
    const progressEl = document.createElement('div');
    progressEl.className = 'page-timeline__line-progress';
    line.appendChild(progressEl);

    const list = document.createElement('ol');
    list.className = 'page-timeline__nodes';

    timeline.appendChild(line);
    timeline.appendChild(list);
    document.body.appendChild(timeline);

    const HEADROOM = 56;
    const TAILROOM = 96;

    const nodeData = timelineSections.map((section) => {
      const item = document.createElement('li');
      item.className = 'page-timeline__item';

      const link = document.createElement('a');
      link.className = 'page-timeline__node';
      link.href = '#' + section.id;
      const label = getLabelText(section);
      link.setAttribute('aria-label', label);
      link.title = label;
      item.appendChild(link);
      list.appendChild(item);

      return {
        section,
        item,
        link,
        position: 0
      };
    });

    const getAnchorOffsetTop = (el) => {
      if (!el) return 0;
      const rect = el.getBoundingClientRect();
      return rect.top + getScrollTop();
    };

    let timelineTop = 0;
    let timelineHeight = 0;
    let lastSectionBottom = 0;
    let activeIndex = -1;

    const updateLayout = () => {
      const firstSection = nodeData[0].section;
      const lastSection = nodeData[nodeData.length - 1].section;

      const firstAnchor = findAnchor(firstSection);
      const lastAnchor = findAnchor(lastSection);

      const firstTop = getAnchorOffsetTop(firstAnchor);
      const lastTop = getAnchorOffsetTop(lastAnchor);

      const totalRange = Math.max(1, lastTop - firstTop);

      timelineTop = firstTop - HEADROOM;
      timelineHeight = totalRange + HEADROOM + TAILROOM;

      const container = firstSection.querySelector('.container') || firstSection;
      const containerRect = container.getBoundingClientRect();
      const containerLeft = containerRect.left + getScrollLeft();
      const desiredLeft = containerLeft - 72;
      const clampedLeft = Math.max(16, desiredLeft);
      timeline.style.left = clampedLeft + 'px';
      timeline.style.top = timelineTop + 'px';
      timeline.style.height = timelineHeight + 'px';

      nodeData.forEach((data) => {
        const anchor = findAnchor(data.section);
        const anchorTop = getAnchorOffsetTop(anchor);
        const relative = (anchorTop - firstTop) / totalRange;
        const positionPx = HEADROOM + relative * totalRange;
        data.position = positionPx;
        data.item.style.top = positionPx + 'px';
      });

      const lastRect = lastSection.getBoundingClientRect();
      lastSectionBottom = lastRect.bottom + getScrollTop();
    };

    const updateProgress = () => {
      if (!timelineHeight) return;

      let newIndex = -1;

      nodeData.forEach((data, idx) => {
        const anchor = findAnchor(data.section);
        const rect = anchor.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.45) {
          newIndex = idx;
        }
      });

      let targetHeight = 0;
      if (newIndex >= 0) {
        targetHeight = nodeData[newIndex].position;
      }

      const viewportBottom = getScrollTop() + window.innerHeight;
      if (viewportBottom >= lastSectionBottom - 80) {
        targetHeight = timelineHeight;
        newIndex = nodeData.length - 1;
      }

      if (targetHeight > timelineHeight) {
        targetHeight = timelineHeight;
      }

      progressEl.style.height = targetHeight + 'px';

      if (newIndex !== activeIndex) {
        activeIndex = newIndex;
        nodeData.forEach((data, idx) => {
          data.item.classList.toggle('is-active', idx === activeIndex && activeIndex >= 0);
          data.item.classList.toggle('is-past', idx <= activeIndex && activeIndex >= 0);
        });
      } else {
        nodeData.forEach((data, idx) => {
          const isPast = targetHeight >= data.position - 2;
          data.item.classList.toggle('is-past', isPast);
        });
      }
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        updateProgress();
        ticking = false;
      });
    };

    let layoutFrame = null;
    const requestLayoutUpdate = () => {
      if (layoutFrame) {
        window.cancelAnimationFrame(layoutFrame);
      }
      layoutFrame = window.requestAnimationFrame(() => {
        updateLayout();
        updateProgress();
      });
    };

    requestLayoutUpdate();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', requestLayoutUpdate);
    window.addEventListener('orientationchange', requestLayoutUpdate);
    window.addEventListener('load', requestLayoutUpdate, { once: true });
  };

  initPageScrollTimeline();

  const timeline = document.querySelector('.value-steps');
  if (timeline) {
    const activateTimeline = () => timeline.classList.add('is-animated');
    if ('IntersectionObserver' in window) {
      const timelineObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            activateTimeline();
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: .25
      });
      timelineObserver.observe(timeline);
    } else {
      activateTimeline();
    }
  }
  // Date badge minute tick glow
  const badge = document.getElementById('currentDateTime');
  if (badge) {
    setInterval(() => {
      badge.classList.add('glow');
      setTimeout(() => badge.classList.remove('glow'), 800);
    }, 60000);
  }

  // Typewriter
  const el = document.getElementById('typer');
  if (el) {
    const phrases = ['COD ke Lokasi Anda', 'Harga Pasar Harian', 'Dana Cair ±5 Menit'];
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = phrases[0];
    } else {
      let i = 0,
        j = 0,
        deleting = false;
      (function tick() {
        const cur = phrases[i];
        if (!deleting) {
          j++;
          el.textContent = cur.slice(0, j);
          if (j === cur.length) {
            deleting = true;
            return setTimeout(tick, 1400);
          }
          return setTimeout(tick, 60);
        } else {
          j--;
          el.textContent = cur.slice(0, j);
          if (j === 0) {
            deleting = false;
            i = (i + 1) % phrases.length;
            return setTimeout(tick, 400);
          }
          return setTimeout(tick, 35);
        }
      })();
    }
  }
})();

// Harga emas: fetch + fallback + waktu W.I.B
const PRICE_ADJUST_IDR = -20000;
const PRICE_TIMEOUT_MS = 5000;
const LM_HISTORY_RANGE_CONFIG = {
  '7': {
    key: '7',
    days: 7,
    label: '7 hari terakhir',
    displayLabel: '7 Hari Terakhir'
  },
  '30': {
    key: '30',
    days: 30,
    label: '30 hari terakhir',
    displayLabel: '30 Hari Terakhir'
  }
};
const LM_HISTORY_DEFAULT_RANGE_KEY = '7';
const LM_HISTORY_RANGE_KEYS = Object.keys(LM_HISTORY_RANGE_CONFIG);
const LM_HISTORY_DAYS_LIMIT = LM_HISTORY_RANGE_KEYS.reduce(function(max, key) {
  var config = LM_HISTORY_RANGE_CONFIG[key];
  var days = config && typeof config.days === 'number' ? config.days : 0;
  return days > max ? days : max;
}, 0);
const ENTRY_TIME_FIELDS = [
  'priceDate',
  'time',
  'timestamp',
  'date',
  'updatedAt',
  'updated_at',
  'lastUpdatedAt',
  'last_updated_at'
];
let REI_LAST_BASE_P = null;
const LAST_PRICE_KEY = 'rei_last_base_price_v1';
const LAST_SERIES_KEY = 'rei_lm_sparkline_series_v1';
const FACTOR_LM_BARU = 0.932;
const FACTOR_LM_LAMA = 0.917;
const PRICE_ADJUST_LM_IDR = -240000;
const FACTOR_PERHIASAN_24K = 0.862;
const FACTOR_PERHIASAN_SUB = 0.786;
const GOLD_ROW_PRIMARY = 'var(--accent-green)';
const GOLD_ROW_SECONDARY = 'var(--accent-green-light)';

function getGmtPlus7DateString() {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const gmt7Time = new Date(utc + (3600000 * 7));
  const year = gmt7Time.getUTCFullYear();
  const month = String(gmt7Time.getUTCMonth() + 1).padStart(2, '0');
  const day = String(gmt7Time.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getGlobalGoldEndpoints(dateStr) {
  const date = dateStr || getGmtPlus7DateString();
  return [
    `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${date}/v1/currencies/xau.json`,
    `https://${date}.currency-api.pages.dev/v1/currencies/xau.json`,
    'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/xau.json',
    'https://latest.currency-api.pages.dev/v1/currencies/xau.json'
  ];
}
const TROY_OUNCE_IN_GRAMS = 31.1034768;
let GLOBAL_GOLD_SPOT_CACHE = null;
let GLOBAL_GOLD_SPOT_PROMISE = null;
const GOLD_KARAT_SERIES = [{
    karat: 24,
    purity: 1
  },
  {
    karat: 23,
    purity: 0.9583
  },
  {
    karat: 22,
    purity: 0.9167
  },
  {
    karat: 21,
    purity: 0.875
  },
  {
    karat: 20,
    purity: 0.8333
  },
  {
    karat: 19,
    purity: 0.7917
  },
  {
    karat: 18,
    purity: 0.75
  },
  {
    karat: 17,
    purity: 0.7083
  },
  {
    karat: 16,
    purity: 0.6667
  },
  {
    karat: 15,
    purity: 0.625
  },
  {
    karat: 14,
    purity: 0.5833
  },
  {
    karat: 12,
    purity: 0.5
  },
  {
    karat: 10,
    purity: 0.4167
  },
  {
    karat: 9,
    purity: 0.375
  },
  {
    karat: 8,
    purity: 0.3333
  },
  {
    karat: 6,
    purity: 0.25
  },
  {
    karat: 5,
    purity: 0.2083
  }
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
const GOLD_UNIT_DEFS = [{
    id: 'gram',
    label: 'Gram (g)',
    toGram: 1
  },
  {
    id: 'ameh',
    label: 'Ameh (2,5 g)',
    toGram: 2.5
  },
  {
    id: 'suku',
    label: 'Suku (3,75 g)',
    toGram: 3.75
  },
  {
    id: 'mayam',
    label: 'Mayam (±3,33 g)',
    toGram: 3.33
  },
  {
    id: 'tael',
    label: 'Tael (37,5 g)',
    toGram: 37.5
  },
  {
    id: 'troy',
    label: 'Troy Ounce (31,103 g)',
    toGram: 31.1034768
  },
  {
    id: 'tola',
    label: 'Tola (11,664 g)',
    toGram: 11.6638038
  },
  {
    id: 'baht',
    label: 'Baht (15,244 g)',
    toGram: 15.244
  },
  {
    id: 'kupang',
    label: 'Kupang (0,6 g)',
    toGram: 0.6
  }
];
const DEFAULT_PRICE_TABLE = {
  lmBaru: 1916000,
  lmLama: 1886000,
  perhiasan: [{
      karat: 24,
      price: 1776000
    },
    {
      karat: 23,
      price: 1558000
    },
    {
      karat: 22,
      price: 1493000
    },
    {
      karat: 21,
      price: 1427000
    },
    {
      karat: 20,
      price: 1361000
    },
    {
      karat: 19,
      price: 1296000
    },
    {
      karat: 18,
      price: 1230000
    },
    {
      karat: 17,
      price: 1165000
    },
    {
      karat: 16,
      price: 1099000
    },
    {
      karat: 15,
      price: 1034000
    },
    {
      karat: 14,
      price: 968000
    },
    {
      karat: 12,
      price: 837000
    },
    {
      karat: 10,
      price: 706000
    },
    {
      karat: 9,
      price: 640000
    },
    {
      karat: 8,
      price: 575000
    },
    {
      karat: 6,
      price: 444000
    },
    {
      karat: 5,
      price: 378000
    }
  ]
};

function saveLastBasePrice(p) {
  try {
    localStorage.setItem(LAST_PRICE_KEY, JSON.stringify({
      p,
      t: Date.now()
    }));
  } catch (_) {}
}

function readLastBasePrice() {
  try {
    const o = JSON.parse(localStorage.getItem(LAST_PRICE_KEY) || ''); /* istanbul ignore next */
    if (o && typeof o.p === 'number') return o;
  } catch (_) {}
  return null;
}

function saveLastSparklineSeries(series) {
  try {
    if (!Array.isArray(series) || !series.length) {
      localStorage.removeItem(LAST_SERIES_KEY);
      return;
    }
    const payload = series.map(function(point) {
      if (point == null) return null;
      const baseValue = typeof point.base === 'number' ? point.base : (typeof point === 'number' ? point : null);
      if (baseValue === null || !isFinite(baseValue)) return null;
      let timeValue = null;
      if (point.time instanceof Date && !isNaN(point.time.getTime())) {
        timeValue = point.time.getTime();
      } else if (typeof point.time === 'number' && isFinite(point.time)) {
        timeValue = point.time;
      }
      return [timeValue, baseValue];
    }).filter(Boolean);
    if (payload.length) {
      localStorage.setItem(LAST_SERIES_KEY, JSON.stringify(payload));
    } else {
      localStorage.removeItem(LAST_SERIES_KEY);
    }
  } catch (_) {}
}

function readLastSparklineSeries() {
  try {
    const raw = JSON.parse(localStorage.getItem(LAST_SERIES_KEY) || '[]');
    if (!Array.isArray(raw)) return [];
    return raw.map(function(entry) {
      if (!Array.isArray(entry) || entry.length < 2) return null;
      const baseValue = safeNumber(entry[1]);
      if (baseValue === null) return null;
      const timeValue = entry[0] == null ? null : resolveDate(entry[0]);
      return {
        base: baseValue,
        price: computeLmBaruPrice(baseValue),
        time: timeValue instanceof Date && !isNaN(timeValue.getTime()) ? timeValue : null
      };
    }).filter(Boolean);
  } catch (_) {
    return [];
  }
}
let LM_BARU_PRICE_SERIES = readLastSparklineSeries();
let LM_BARU_ACTIVE_RANGE = LM_HISTORY_DEFAULT_RANGE_KEY;
let LM_BARU_SERIES_BY_RANGE = LM_HISTORY_RANGE_KEYS.reduce(function(acc, key) {
  acc[key] = [];
  return acc;
}, {});
const DEFAULT_SPARKLINE_PERIOD = (LM_HISTORY_RANGE_CONFIG[LM_BARU_ACTIVE_RANGE] && LM_HISTORY_RANGE_CONFIG[LM_BARU_ACTIVE_RANGE].label) || '7 hari terakhir';
let LM_BARU_SPARKLINE_META = {
  periodLabel: DEFAULT_SPARKLINE_PERIOD,
  hasSeries: false
};
let LM_BARU_SPARKLINE_RESIZE_FRAME = null;
let LM_BARU_SPARKLINE_POINTS = [];
let LM_BARU_SPARKLINE_ACTIVE_INDEX = -1;
let LM_BARU_SPARKLINE_TOOLTIP_LOCKED = false;
let LM_BARU_SPARKLINE_EVENTS_BOUND = false;

if (Array.isArray(LM_BARU_PRICE_SERIES) && LM_BARU_PRICE_SERIES.length) {
  resetRangeSeriesCache(LM_BARU_PRICE_SERIES);
  LM_BARU_PRICE_SERIES = LM_BARU_SERIES_BY_RANGE[LM_BARU_ACTIVE_RANGE].slice();
} else {
  LM_BARU_PRICE_SERIES = [];
}

function updatePriceSchema(items) {
  try {
    var el = document.getElementById('priceItemList');
    /* istanbul ignore next */
    if (!items || !items.length) {
      if (el) el.remove();
      return;
    }
    var data = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "@id": "https://sentralemas.com/#price-list",
      "name": "Referensi Harga Buyback Emas & Perhiasan",
      "itemListElement": items.map(function(item, idx) {
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
            "itemOffered": {
              "@id": "https://sentralemas.com/#service"
            }
          }
        };
      })
    };
    /* istanbul ignore next */
    if (!el) {
      el = document.createElement('script');
      el.type = 'application/ld+json';
      el.id = 'priceItemList';
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(data);
  } catch (_) {}
}

function roundUpPrice(n, step) {
  var s = step || 1000;
  return Math.ceil(n / s) * s;
}

function computeLmBaruPrice(basePrice) {
  return roundUpPrice(basePrice * FACTOR_LM_BARU + PRICE_ADJUST_LM_IDR);
}

function computeLmLamaPrice(basePrice) {
  return roundUpPrice(basePrice * FACTOR_LM_LAMA + PRICE_ADJUST_LM_IDR);
}

function safeNumber(v) {
  var num = Number(v);
  return Number.isFinite(num) ? num : null;
}

function resolveDate(value) {
  if (!value) return null;
  var dateCandidate = null;
  if (value instanceof Date) {
    dateCandidate = value;
  } else if (typeof value === 'number') {
    dateCandidate = new Date(value);
  } else if (typeof value === 'string') {
    var trimmed = value.trim();
    if (!trimmed) return null;
    if (/^\d+$/.test(trimmed)) dateCandidate = new Date(Number(trimmed));
    else dateCandidate = new Date(trimmed);
  }
  return dateCandidate && !isNaN(dateCandidate.getTime()) ? dateCandidate : null;
}

function resolveEntryTime(entry) {
  if (!entry || typeof entry !== 'object') return null;
  for (var i = 0; i < ENTRY_TIME_FIELDS.length; i++) {
    var key = ENTRY_TIME_FIELDS[i];
    var candidate = entry[key];
    if (candidate === undefined || candidate === null || candidate === '') continue;
    var resolved = resolveDate(candidate);
    if (resolved) return resolved;
  }
  return null;
}

function formatCurrencyIDR(value) {
  try {
    return Number(value || 0).toLocaleString('id-ID');
  } catch (_) {
    return String(value || 0);
  }
}

function formatPercentID(value, fractionDigits) {
  var digits = typeof fractionDigits === 'number' && fractionDigits >= 0 ? fractionDigits : 2;
  try {
    return Number(value || 0).toLocaleString('id-ID', {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits
    });
  } catch (_) {
    return String(value || 0);
  }
}

function formatSignedPercentID(value, fractionDigits) {
  if (typeof value !== 'number' || !isFinite(value)) return null;
  var normalized = value === 0 ? 0 : value;
  var formatted = formatPercentID(Math.abs(normalized), fractionDigits);
  if (normalized > 0) return '+' + formatted + '%';
  if (normalized < 0) return '-' + formatted + '%';
  return formatted + '%';
}

function escapeAttr(value) {
  return String(value == null ? '' : value).replace(/"/g, '&quot;');
}

function escapeHTML(value) {
  return String(value == null ? '' : value).replace(/[&<>]/g, function(chr) {
    if (chr === '&') return '&amp;';
    if (chr === '<') return '&lt;';
    return '&gt;';
  });
}

function updateLmBaruHighlight(currentPrice, options) {
  options = options || {};
  var valueEl = document.getElementById('lmBaruCurrent');
  var badgeEl = document.getElementById('lmBaruTrendBadge');
  var deltaWrap = document.getElementById('lmBaruDelta');
  var deltaTextEl = document.getElementById('lmBaruDeltaText');
  var iconEl = deltaWrap ? deltaWrap.querySelector('.delta-icon') : null;

  if (valueEl) {
    if (typeof currentPrice === 'number' && isFinite(currentPrice)) {
      valueEl.textContent = 'Rp ' + formatCurrencyIDR(currentPrice);
    } else {
      valueEl.textContent = 'Rp —';
    }
    valueEl.classList.remove('value-flash');
    requestAnimationFrame(function() {
      valueEl.classList.add('value-flash');
    });
  }

  if (!deltaWrap) return;

  var badgeLabel = options.badgeLabel || 'Menunggu';
  var badgeState = options.badgeState || 'price-neutral';
  var deltaMessage = options.deltaText || 'Selisih menunggu data sebelumnya';
  var hasCurrent = typeof currentPrice === 'number' && isFinite(currentPrice);
  var prevPrice = typeof options.previousPrice === 'number' && isFinite(options.previousPrice) ? options.previousPrice : null;
  var iconState = 'pending';

  deltaWrap.classList.remove('trend-up', 'trend-down', 'trend-flat', 'trend-pending');

  if (hasCurrent && prevPrice !== null) {
    var diff = Math.round(currentPrice - prevPrice);
    var absDiff = Math.abs(diff);
    if (diff > 0) {
      deltaWrap.classList.add('trend-up');
      deltaMessage = options.deltaText || ('Naik Rp ' + formatCurrencyIDR(absDiff) + ' dibanding kemarin');
      iconState = 'up';
      badgeLabel = options.badgeLabel || 'Naik';
      badgeState = options.badgeState || 'price-up';
    } else if (diff < 0) {
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

  if (deltaTextEl) deltaTextEl.textContent = deltaMessage;
  if (iconEl) {
    iconEl.textContent = '';
    iconEl.setAttribute('data-trend', iconState);
  }
  if (badgeEl) {
    badgeEl.classList.remove('price-up', 'price-down', 'price-neutral');
    badgeEl.classList.add(badgeState);
    badgeEl.textContent = badgeLabel;
  }
  deltaWrap.classList.remove('delta-flash');
  requestAnimationFrame(function() {
    deltaWrap.classList.add('delta-flash');
  });
  var highlightCard = document.getElementById('lmBaruHighlight');
  if (highlightCard) {
    highlightCard.classList.remove('is-updated');
    requestAnimationFrame(function() {
      highlightCard.classList.add('is-updated');
    });
  }
}

function getRangeConfig(rangeKey) {
  var key = rangeKey == null ? '' : String(rangeKey).trim();
  if (key && Object.prototype.hasOwnProperty.call(LM_HISTORY_RANGE_CONFIG, key)) {
    return LM_HISTORY_RANGE_CONFIG[key];
  }
  return LM_HISTORY_RANGE_CONFIG[LM_HISTORY_DEFAULT_RANGE_KEY] || null;
}

function deriveSeriesForRange(series, config) {
  if (!Array.isArray(series)) return [];
  var sanitized = series.filter(function(point) {
    return point && typeof point.price === 'number' && isFinite(point.price);
  });
  if (!sanitized.length) return [];
  var limit = config && typeof config.days === 'number' && config.days > 0 ? config.days : sanitized.length;
  if (sanitized.length > limit) {
    return sanitized.slice(sanitized.length - limit);
  }
  return sanitized.slice();
}

function resetRangeSeriesCache(series) {
  var normalized = Array.isArray(series) ? series.slice() : [];
  LM_HISTORY_RANGE_KEYS.forEach(function(key) {
    var rangeConfig = getRangeConfig(key);
    LM_BARU_SERIES_BY_RANGE[key] = deriveSeriesForRange(normalized, rangeConfig);
  });
}

function updateRangeToggleState(activeKey) {
  var toggle = document.getElementById('lmBaruRangeToggle');
  if (!toggle) return;
  var buttons = toggle.querySelectorAll('button[data-range]');
  Array.prototype.forEach.call(buttons, function(button) {
    var key = (button.getAttribute('data-range') || '').trim();
    var isActive = key === String(activeKey || '');
    if (isActive) {
      button.classList.add('is-active');
      button.setAttribute('aria-pressed', 'true');
    } else {
      button.classList.remove('is-active');
      button.setAttribute('aria-pressed', 'false');
    }
  });
}

function refreshRangeMetrics(series, meta) {
  meta = meta || {};
  var activeKey = meta.rangeKey || LM_BARU_ACTIVE_RANGE;
  var config = meta.rangeConfig || getRangeConfig(activeKey);
  var highlightCard = document.getElementById('lmBaruHighlight');
  if (highlightCard && config && config.key) {
    highlightCard.setAttribute('data-active-range', config.key);
  }
  var rangeLabel = document.getElementById('lmBaruRangeValue');
  var displayLabel = meta.displayLabel || (config && (config.displayLabel || config.label)) || DEFAULT_SPARKLINE_PERIOD;
  if (rangeLabel) rangeLabel.textContent = displayLabel;
  var values = Array.isArray(series) ? series.map(function(point) {
    return point && typeof point.price === 'number' && isFinite(point.price) ? Math.round(point.price) : null;
  }).filter(function(value) {
    return value !== null;
  }) : [];
  var lowEl = document.getElementById('lmBaruRangeLow');
  var highEl = document.getElementById('lmBaruRangeHigh');
  var min = values.length ? Math.min.apply(null, values) : null;
  var max = values.length ? Math.max.apply(null, values) : null;
  if (lowEl) lowEl.textContent = min !== null ? 'Rp ' + formatCurrencyIDR(min) : 'Rp —';
  if (highEl) highEl.textContent = max !== null ? 'Rp ' + formatCurrencyIDR(max) : 'Rp —';

  var compareLabelEl = document.getElementById('lmBaruRangeCompareLabel');
  var compareValueEl = document.getElementById('lmBaruRangeCompareValue');
  var compareDeltaEl = document.getElementById('lmBaruRangeCompareDelta');
  var compareWrap = document.getElementById('lmBaruRangeCompare');
  var firstPrice = null;
  var lastPrice = null;

  if (Array.isArray(series)) {
    for (var idx = 0; idx < series.length; idx++) {
      var candidate = series[idx];
      if (!candidate || typeof candidate.price !== 'number' || !isFinite(candidate.price)) continue;
      var rounded = Math.round(candidate.price);
      if (firstPrice === null) firstPrice = rounded;
      lastPrice = rounded;
    }
  }

  var compareLabelText = 'Delta';
  if (compareLabelEl) compareLabelEl.textContent = compareLabelText;
  if (compareValueEl) {
    compareValueEl.textContent = firstPrice !== null ? 'Rp ' + formatCurrencyIDR(firstPrice) : 'Rp —';
  }

  var deltaState = 'pending';
  var deltaText = 'Menunggu data rentang';
  var percentDeltaValue = null;
  if (firstPrice !== null && lastPrice !== null) {
    var diff = lastPrice - firstPrice;
    var absDiff = Math.abs(diff);
    if (firstPrice !== 0) {
      percentDeltaValue = (diff / firstPrice) * 100;
    }
    var percentSuffix = percentDeltaValue !== null ? ' (' + formatSignedPercentID(percentDeltaValue, 2) + ')' : '';
    if (diff > 0) {
      deltaState = 'up';
      deltaText = 'Naik Rp ' + formatCurrencyIDR(absDiff) + percentSuffix + ' dibanding awal rentang';
    } else if (diff < 0) {
      deltaState = 'down';
      deltaText = 'Turun Rp ' + formatCurrencyIDR(absDiff) + percentSuffix + ' dibanding awal rentang';
    } else {
      deltaState = 'flat';
      deltaText = 'Stabil dibanding awal rentang' + (percentSuffix ? percentSuffix : '');
    }
  }
  if (compareDeltaEl) {
    compareDeltaEl.textContent = deltaText;
    compareDeltaEl.setAttribute('data-trend', deltaState);
  }
  if (compareWrap) {
    compareWrap.setAttribute('data-trend', deltaState);
  }
  if (highlightCard) {
    highlightCard.setAttribute('data-range-compare-trend', deltaState);
  }
  updateRangeToggleState(activeKey);
}

function setActiveSparklineRange(rangeKey, metaOptions) {
  var config = getRangeConfig(rangeKey);
  var key = config && config.key ? config.key : LM_HISTORY_DEFAULT_RANGE_KEY;
  LM_BARU_ACTIVE_RANGE = key;
  if (!Array.isArray(LM_BARU_SERIES_BY_RANGE[key])) {
    LM_BARU_SERIES_BY_RANGE[key] = [];
  }
  LM_BARU_PRICE_SERIES = LM_BARU_SERIES_BY_RANGE[key].slice();
  var options = Object.assign({}, metaOptions || {}, {
    periodLabel: config && config.label ? config.label : DEFAULT_SPARKLINE_PERIOD,
    displayLabel: config && config.displayLabel ? config.displayLabel : undefined,
    rangeKey: key,
    rangeConfig: config
  });
  updateLmBaruSparkline(LM_BARU_PRICE_SERIES, options);
}

function setupHighlightRangeControls() {
  var toggle = document.getElementById('lmBaruRangeToggle');
  if (!toggle || toggle.dataset.bound === 'true') return;
  toggle.dataset.bound = 'true';
  toggle.addEventListener('click', function(ev) {
    var button = ev.target.closest('button[data-range]');
    if (!button) return;
    var rangeKey = button.getAttribute('data-range');
    if (!rangeKey || rangeKey === LM_BARU_ACTIVE_RANGE) return;
    setActiveSparklineRange(rangeKey);
  });
  updateRangeToggleState(LM_BARU_ACTIVE_RANGE);
}

function prepareLmBaruHistorySeries(source, currentBase, limit) {
  var limitValue = typeof limit === 'number' && limit > 0 ? limit : LM_HISTORY_DAYS_LIMIT;
  var entries = [];
  var order = 0;

  function pushEntry(entry, role) {
    if (!entry) return;
    var baseValue = safeNumber(entry.buy);
    if (baseValue === null) return;
    entries.push({
      base: baseValue,
      time: resolveEntryTime(entry),
      order: order++,
      role: role || null
    });
  }
  if (source) {
    if (Array.isArray(source.history)) source.history.forEach(function(item) {
      pushEntry(item, 'history');
    });
    pushEntry(source.previous, 'previous');
    if (source.current && source.current.previous) pushEntry(source.current.previous, 'current-previous');
    pushEntry(source.current, 'current');
  }
  if (typeof currentBase === 'number' && isFinite(currentBase)) {
    var alreadyIncluded = entries.some(function(entry) {
      return Math.abs(entry.base - currentBase) < 0.5;
    });
    if (!alreadyIncluded) {
      entries.push({
        base: currentBase,
        time: null,
        order: order++,
        role: 'current-fallback'
      });
    }
  }
  if (!entries.length) return [];
  entries.sort(function(a, b) {
    if (a.time && b.time) {
      return a.time.getTime() - b.time.getTime();
    }
    if (a.time && !b.time) return -1;
    if (!a.time && b.time) return 1;
    return a.order - b.order;
  });
  var seenTimes = new Set();
  var reversed = [];
  for (var idx = entries.length - 1; idx >= 0; idx--) {
    var entry = entries[idx];
    if (!entry) continue;
    var timeKey = entry.time ? entry.time.getTime() : null;
    if (timeKey !== null) {
      if (seenTimes.has(timeKey)) continue;
      seenTimes.add(timeKey);
    }
    reversed.push({
      base: entry.base,
      price: computeLmBaruPrice(entry.base),
      time: entry.time,
      role: entry.role || null
    });
  }
  if (!reversed.length) return [];
  reversed.reverse();
  if (reversed.length > limitValue) {
    reversed = reversed.slice(reversed.length - limitValue);
  }
  return reversed;
}

function findLmBaruSeriesPair(series, currentBase) {
  var result = {
    current: null,
    previous: null
  };
  if (!Array.isArray(series) || !series.length) {
    if (typeof currentBase === 'number' && isFinite(currentBase)) {
      result.current = {
        base: currentBase,
        price: computeLmBaruPrice(currentBase),
        time: null
      };
    }
    return result;
  }
  var points = series.filter(function(point) {
    return point && typeof point.base === 'number' && isFinite(point.base);
  });
  if (!points.length) {
    if (typeof currentBase === 'number' && isFinite(currentBase)) {
      result.current = {
        base: currentBase,
        price: computeLmBaruPrice(currentBase),
        time: null
      };
    }
    return result;
  }
  var currentIndex = -1;
  for (var idx = points.length - 1; idx >= 0; idx--) {
    var candidate = points[idx];
    if (!candidate) continue;
    var role = candidate.role || '';
    if (role === 'current' || role === 'current-fallback') {
      currentIndex = idx;
      result.current = candidate;
      break;
    }
    if (currentIndex === -1 && !result.current) {
      currentIndex = idx;
      result.current = candidate;
    }
  }
  if (currentIndex === -1) {
    currentIndex = points.length - 1;
    result.current = points[currentIndex] || null;
  }
  if (result.current) {
    for (var j = currentIndex - 1; j >= 0; j--) {
      var previousCandidate = points[j];
      if (!previousCandidate) continue;
      var shareSameTimestamp = false;
      if (previousCandidate.time instanceof Date && result.current.time instanceof Date) {
        shareSameTimestamp = previousCandidate.time.getTime() === result.current.time.getTime();
      }
      if (shareSameTimestamp) continue;
      result.previous = previousCandidate;
      break;
    }
    if (!result.previous) {
      for (var k = points.length - 1; k >= 0; k--) {
        if (k === currentIndex) continue;
        var fallbackCandidate = points[k];
        if (!fallbackCandidate) continue;
        result.previous = fallbackCandidate;
        break;
      }
    }
  }
  if (typeof currentBase === 'number' && isFinite(currentBase)) {
    if (!result.current || Math.abs(result.current.base - currentBase) > 0.5) {
      result.current = {
        base: currentBase,
        price: computeLmBaruPrice(currentBase),
        time: result.current ? result.current.time : null
      };
    }
  }
  if (result.previous && typeof result.previous.price !== 'number') {
    result.previous = Object.assign({}, result.previous, {
      price: computeLmBaruPrice(result.previous.base)
    });
  }
  return result;
}

function describeSparklineSeries(series, periodLabel) {
  if (!Array.isArray(series) || series.length < 2) return 'Riwayat harga tidak tersedia.';
  var firstPoint = series[0];
  var lastPoint = series[series.length - 1];
  if (!firstPoint || !lastPoint) return 'Riwayat harga tidak tersedia.';
  var firstPrice = Number(firstPoint.price);
  var lastPrice = Number(lastPoint.price);
  if (!isFinite(firstPrice) || !isFinite(lastPrice)) return 'Riwayat harga tidak tersedia.';
  var diff = Math.round(lastPrice - firstPrice);
  var absDiff = Math.abs(diff);
  var label = typeof periodLabel === 'string' && periodLabel.trim() ? periodLabel : DEFAULT_SPARKLINE_PERIOD;
  if (diff > 0) {
    return 'Harga naik Rp ' + formatCurrencyIDR(absDiff) + ' selama ' + label + ', dari Rp ' + formatCurrencyIDR(firstPrice) + ' menjadi Rp ' + formatCurrencyIDR(lastPrice) + '.';
  }
  if (diff < 0) {
    return 'Harga turun Rp ' + formatCurrencyIDR(absDiff) + ' selama ' + label + ', dari Rp ' + formatCurrencyIDR(firstPrice) + ' menjadi Rp ' + formatCurrencyIDR(lastPrice) + '.';
  }
  return 'Harga relatif stabil selama ' + label + ' di sekitar Rp ' + formatCurrencyIDR(lastPrice) + '.';
}

function formatSparklinePointTooltip(point) {
  if (!point) return '';
  var priceValue = Number(point.price);
  var priceText = isFinite(priceValue) ? 'Rp ' + formatCurrencyIDR(Math.round(priceValue)) : 'Rp —';
  var dateText = '';
  if (point.time instanceof Date && !isNaN(point.time.getTime())) {
    dateText = formatDateOnlyIndo(point.time);
  }
  return dateText ? dateText + '\n' + priceText : priceText;
}

function formatSparklinePointAnnouncement(point) {
  if (!point) return '';
  var priceValue = Number(point.price);
  var priceText = isFinite(priceValue) ? 'Rp ' + formatCurrencyIDR(Math.round(priceValue)) : 'harga tidak tersedia';
  if (point.time instanceof Date && !isNaN(point.time.getTime())) {
    var dateOnly = formatDateOnlyIndo(point.time);
    if (dateOnly) {
      return 'Harga ' + priceText + ' pada ' + dateOnly + '.';
    }
  }
  return 'Harga ' + priceText + '.';
}

function updateSparklinePointSummary(message) {
  var summaryEl = document.getElementById('lmBaruSparklinePointSummary');
  if (summaryEl) {
    summaryEl.textContent = message || '';
  }
}

function updateSparklineMarker(point, rect) {
  var marker = document.getElementById('lmBaruSparklineMarker');
  if (!marker) return;
  if (!point || typeof point.x !== 'number' || typeof point.y !== 'number') {
    marker.classList.remove('is-visible');
    marker.setAttribute('aria-hidden', 'true');
    marker.style.left = '';
    marker.style.top = '';
    delete marker.dataset.x;
    delete marker.dataset.y;
    return;
  }
  var container = marker.parentElement;
  var width = rect && rect.width ? rect.width : (container ? container.clientWidth : 0);
  var height = rect && rect.height ? rect.height : (container ? container.clientHeight : 0);
  var x = point.x;
  var y = point.y;
  var markerHalfWidth = (marker.offsetWidth || marker.clientWidth || 12) / 2;
  var markerHalfHeight = (marker.offsetHeight || marker.clientHeight || 12) / 2;
  if (width > 0) {
    var minX = markerHalfWidth;
    var maxX = width - markerHalfWidth;
    if (minX > maxX) {
      x = width / 2;
    } else {
      if (x < minX) x = minX;
      else if (x > maxX) x = maxX;
    }
  }
  if (height > 0) {
    var minY = markerHalfHeight;
    var maxY = height - markerHalfHeight;
    if (minY > maxY) {
      y = height / 2;
    } else {
      if (y < minY) y = minY;
      else if (y > maxY) y = maxY;
    }
  }
  marker.style.left = x + 'px';
  marker.style.top = y + 'px';
  marker.setAttribute('aria-hidden', 'false');
  marker.classList.add('is-visible');
  marker.dataset.x = String(x);
  marker.dataset.y = String(y);
}

function hideSparklineTooltip(options) {
  var tooltip = document.getElementById('lmBaruSparklineTooltip');
  if (tooltip) {
    tooltip.classList.remove('is-visible', 'is-flip');
    tooltip.setAttribute('aria-hidden', 'true');
    tooltip.style.left = '';
    tooltip.style.top = '';
    tooltip.textContent = '';
    tooltip.style.removeProperty('--sparkline-arrow-position');
    delete tooltip.dataset.index;
  }
  updateSparklineMarker(null);
  if (!options || options.clearSummary !== false) {
    updateSparklinePointSummary('');
  }
  if (!options || options.unlock !== false) {
    LM_BARU_SPARKLINE_TOOLTIP_LOCKED = false;
  }
  LM_BARU_SPARKLINE_ACTIVE_INDEX = -1;
}

function showSparklineTooltip(point, index, rect) {
  if (!point) return;
  var tooltip = document.getElementById('lmBaruSparklineTooltip');
  if (!tooltip) return;
  var container = tooltip.parentElement;
  var width = rect && rect.width ? rect.width : (container ? container.clientWidth : 0);
  var height = rect && rect.height ? rect.height : (container ? container.clientHeight : 0);
  var x = typeof point.x === 'number' ? point.x : (width > 0 ? width / 2 : 0);
  var y = typeof point.y === 'number' ? point.y : (height > 0 ? height / 2 : 0);
  if (typeof point.x === 'number' && typeof point.y === 'number') {
    updateSparklineMarker({
      x: point.x,
      y: point.y
    }, rect);
    var marker = document.getElementById('lmBaruSparklineMarker');
    if (marker) {
      var dataX = Number(marker.dataset.x);
      if (isFinite(dataX)) x = dataX;
      var dataY = Number(marker.dataset.y);
      if (isFinite(dataY)) y = dataY;
    }
  } else {
    updateSparklineMarker(null);
  }
  var verticalMargin = 12;
  if (height > 0) {
    var minY = verticalMargin;
    var maxY = height - verticalMargin;
    if (minY > maxY) {
      y = height / 2;
    } else {
      if (y < minY) y = minY;
      else if (y > maxY) y = maxY;
    }
  }
  tooltip.classList.remove('is-visible');
  var shouldFlip = y < 32;
  var tooltipMessage = formatSparklinePointTooltip(point);
  if (tooltip.textContent !== tooltipMessage) {
    tooltip.textContent = tooltipMessage;
  }
  tooltip.style.removeProperty('--sparkline-arrow-position');
  var containerWidth = width > 0 ? width : (container ? container.clientWidth : 0);
  var tooltipWidth = tooltip.offsetWidth || tooltip.clientWidth || 0;
  var adjustedX = x;
  var arrowPosition = null;
  if (containerWidth > 0 && tooltipWidth > 0) {
    var halfWidth = tooltipWidth / 2;
    var margin = 12;
    var minX = halfWidth + margin;
    var maxX = containerWidth - halfWidth - margin;
    if (minX > maxX) {
      adjustedX = containerWidth / 2;
    } else {
      if (adjustedX < minX) adjustedX = minX;
      else if (adjustedX > maxX) adjustedX = maxX;
    }
    var anchorOffset = x - adjustedX + halfWidth;
    if (!isFinite(anchorOffset)) anchorOffset = halfWidth;
    var arrowPadding = Math.min(14, Math.max(8, Math.round(tooltipWidth * 0.08)));
    var minArrow = arrowPadding;
    var maxArrow = tooltipWidth - arrowPadding;
    if (minArrow > maxArrow) {
      arrowPosition = halfWidth;
    } else {
      if (anchorOffset < minArrow) anchorOffset = minArrow;
      else if (anchorOffset > maxArrow) anchorOffset = maxArrow;
      arrowPosition = anchorOffset;
    }
  }
  tooltip.style.top = y + 'px';
  tooltip.style.left = adjustedX + 'px';
  if (arrowPosition !== null && isFinite(arrowPosition)) {
    tooltip.style.setProperty('--sparkline-arrow-position', arrowPosition + 'px');
  }
  tooltip.setAttribute('aria-hidden', 'false');
  tooltip.classList.toggle('is-flip', shouldFlip);
  if (typeof index === 'number') tooltip.dataset.index = String(index);
  else delete tooltip.dataset.index;
  requestAnimationFrame(function() {
    tooltip.classList.add('is-visible');
  });
  updateSparklinePointSummary(formatSparklinePointAnnouncement(point));
  LM_BARU_SPARKLINE_ACTIVE_INDEX = typeof index === 'number' ? index : -1;
}

function showSparklinePointAtIndex(index, canvas, lockSelection) {
  if (!Array.isArray(LM_BARU_SPARKLINE_POINTS)) return;
  var total = LM_BARU_SPARKLINE_POINTS.length;
  if (total <= 0) return;
  var targetIndex = typeof index === 'number' ? index : total - 1;
  if (targetIndex < 0) targetIndex = 0;
  if (targetIndex >= total) targetIndex = total - 1;
  var point = LM_BARU_SPARKLINE_POINTS[targetIndex];
  if (!point) return;
  var targetCanvas = canvas || document.getElementById('lmBaruSparkline');
  if (!targetCanvas) return;
  var rect = targetCanvas.getBoundingClientRect();
  showSparklineTooltip(point, targetIndex, rect);
  if (lockSelection) {
    LM_BARU_SPARKLINE_TOOLTIP_LOCKED = true;
  }
}

function handleSparklinePointerEvent(ev, lockSelection) {
  if (!Array.isArray(LM_BARU_SPARKLINE_POINTS) || !LM_BARU_SPARKLINE_POINTS.length) return;
  var canvas = ev && ev.currentTarget ? ev.currentTarget : document.getElementById('lmBaruSparkline');
  if (!canvas) return;
  var rect = canvas.getBoundingClientRect();
  var clientX = typeof ev.clientX === 'number' ? ev.clientX : (rect.left + rect.width);
  var localX = clientX - rect.left;
  if (!isFinite(localX)) return;
  var nearestIndex = 0;
  var nearestDistance = Infinity;
  for (var i = 0; i < LM_BARU_SPARKLINE_POINTS.length; i++) {
    var point = LM_BARU_SPARKLINE_POINTS[i];
    if (!point) continue;
    var distance = Math.abs(localX - point.x);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestIndex = i;
    }
  }
  showSparklinePointAtIndex(nearestIndex, canvas, lockSelection);
}

function handleSparklineKeyNavigation(ev) {
  if (!Array.isArray(LM_BARU_SPARKLINE_POINTS) || !LM_BARU_SPARKLINE_POINTS.length) return;
  var canvas = ev.currentTarget || document.getElementById('lmBaruSparkline');
  if (!canvas) return;
  var handled = false;
  var targetIndex = LM_BARU_SPARKLINE_ACTIVE_INDEX;
  if (ev.key === 'ArrowRight') {
    handled = true;
    targetIndex = targetIndex < 0 ? 0 : targetIndex + 1;
  } else if (ev.key === 'ArrowLeft') {
    handled = true;
    targetIndex = targetIndex < 0 ? LM_BARU_SPARKLINE_POINTS.length - 1 : targetIndex - 1;
  } else if (ev.key === 'Home') {
    handled = true;
    targetIndex = 0;
  } else if (ev.key === 'End') {
    handled = true;
    targetIndex = LM_BARU_SPARKLINE_POINTS.length - 1;
  } else if (ev.key === 'Escape') {
    handled = true;
    hideSparklineTooltip({
      unlock: true
    });
  }
  if (handled) {
    ev.preventDefault();
    if (ev.key !== 'Escape') {
      showSparklinePointAtIndex(targetIndex, canvas, true);
    }
  }
}

function attachSparklineInteractions() {
  if (LM_BARU_SPARKLINE_EVENTS_BOUND) return;
  var canvas = document.getElementById('lmBaruSparkline');
  if (!canvas) return;
  LM_BARU_SPARKLINE_EVENTS_BOUND = true;
  canvas.addEventListener('pointerenter', function(ev) {
    if (LM_BARU_SPARKLINE_TOOLTIP_LOCKED) return;
    handleSparklinePointerEvent(ev, false);
  });
  canvas.addEventListener('pointermove', function(ev) {
    if (ev.pointerType === 'touch' && !LM_BARU_SPARKLINE_TOOLTIP_LOCKED) return;
    handleSparklinePointerEvent(ev, false);
  });
  canvas.addEventListener('pointerdown', function(ev) {
    handleSparklinePointerEvent(ev, true);
  });
  canvas.addEventListener('click', function(ev) {
    handleSparklinePointerEvent(ev, true);
  });
  canvas.addEventListener('pointerleave', function() {
    if (LM_BARU_SPARKLINE_TOOLTIP_LOCKED) return;
    hideSparklineTooltip({
      unlock: false
    });
  });
  canvas.addEventListener('focus', function() {
    showSparklinePointAtIndex(LM_BARU_SPARKLINE_POINTS.length - 1, canvas, true);
  });
  canvas.addEventListener('blur', function() {
    hideSparklineTooltip({
      unlock: true
    });
  });
  canvas.addEventListener('keydown', handleSparklineKeyNavigation);
  document.addEventListener('pointerdown', function(ev) {
    if (!LM_BARU_SPARKLINE_TOOLTIP_LOCKED) return;
    if (canvas.contains(ev.target)) return;
    var tooltip = document.getElementById('lmBaruSparklineTooltip');
    if (tooltip && tooltip.contains(ev.target)) return;
    hideSparklineTooltip({
      unlock: true
    });
  }, true);
}

function getSparklineReuseOptions() {
  if (!LM_BARU_SPARKLINE_META) return {
    periodLabel: DEFAULT_SPARKLINE_PERIOD,
    rangeKey: LM_BARU_ACTIVE_RANGE,
    displayLabel: (getRangeConfig(LM_BARU_ACTIVE_RANGE) && getRangeConfig(LM_BARU_ACTIVE_RANGE).displayLabel) || DEFAULT_SPARKLINE_PERIOD
  };
  return {
    periodLabel: LM_BARU_SPARKLINE_META.periodLabel || DEFAULT_SPARKLINE_PERIOD,
    summaryText: typeof LM_BARU_SPARKLINE_META.summaryText === 'string' ? LM_BARU_SPARKLINE_META.summaryText : undefined,
    summarySuffix: typeof LM_BARU_SPARKLINE_META.summarySuffix === 'string' ? LM_BARU_SPARKLINE_META.summarySuffix : undefined,
    fallbackText: typeof LM_BARU_SPARKLINE_META.fallbackText === 'string' ? LM_BARU_SPARKLINE_META.fallbackText : undefined,
    rangeKey: LM_BARU_SPARKLINE_META.rangeKey || LM_BARU_ACTIVE_RANGE,
    displayLabel: LM_BARU_SPARKLINE_META.displayLabel || (getRangeConfig(LM_BARU_SPARKLINE_META.rangeKey || LM_BARU_ACTIVE_RANGE) && getRangeConfig(LM_BARU_SPARKLINE_META.rangeKey || LM_BARU_ACTIVE_RANGE).displayLabel) || DEFAULT_SPARKLINE_PERIOD
  };
}

function updateLmBaruSparkline(series, options) {
  options = options || {};
  var previousLabel = (LM_BARU_SPARKLINE_META && typeof LM_BARU_SPARKLINE_META.periodLabel === 'string') ? LM_BARU_SPARKLINE_META.periodLabel : DEFAULT_SPARKLINE_PERIOD;
  var previousRangeKey = (LM_BARU_SPARKLINE_META && typeof LM_BARU_SPARKLINE_META.rangeKey === 'string') ? LM_BARU_SPARKLINE_META.rangeKey : LM_BARU_ACTIVE_RANGE;
  var requestedRangeKey = typeof options.rangeKey === 'string' && options.rangeKey.trim() ? options.rangeKey.trim() : '';
  var activeRangeKey = requestedRangeKey || previousRangeKey;
  var rangeConfig = options.rangeConfig && options.rangeConfig.key ? options.rangeConfig : getRangeConfig(activeRangeKey);
  var displayLabelCandidate = typeof options.displayLabel === 'string' && options.displayLabel.trim() ? options.displayLabel.trim() : null;
  var renderOptions = {
    periodLabel: typeof options.periodLabel === 'string' && options.periodLabel.trim() ? options.periodLabel : previousLabel,
    summaryText: typeof options.summaryText === 'string' ? options.summaryText : undefined,
    summarySuffix: typeof options.summarySuffix === 'string' ? options.summarySuffix : undefined,
    fallbackText: typeof options.fallbackText === 'string' ? options.fallbackText : undefined,
    rangeKey: activeRangeKey,
    displayLabel: displayLabelCandidate || (LM_BARU_SPARKLINE_META && LM_BARU_SPARKLINE_META.displayLabel) || (rangeConfig && (rangeConfig.displayLabel || rangeConfig.label)) || DEFAULT_SPARKLINE_PERIOD
  };
  var highlightCard = document.getElementById('lmBaruHighlight');
  var canvas = document.getElementById('lmBaruSparkline');
  var fallbackEl = document.getElementById('lmBaruChartFallback');
  var summaryEl = document.getElementById('lmBaruTrendSummary');
  var hasSeries = Array.isArray(series) && series.length >= 2 && series.every(function(point) {
    return point && typeof point.price === 'number' && isFinite(point.price);
  });

  refreshRangeMetrics(series, {
    rangeKey: activeRangeKey,
    rangeConfig: rangeConfig,
    periodLabel: renderOptions.periodLabel,
    displayLabel: renderOptions.displayLabel
  });

  if (!hasSeries) {
    LM_BARU_SPARKLINE_POINTS = [];
    LM_BARU_SPARKLINE_ACTIVE_INDEX = -1;
    hideSparklineTooltip({
      unlock: true
    });
    if (canvas) {
      try {
        var ctxClear = canvas.getContext && canvas.getContext('2d');
        if (ctxClear) {
          ctxClear.setTransform(1, 0, 0, 1, 0, 0);
          ctxClear.clearRect(0, 0, canvas.width || 0, canvas.height || 0);
        }
      } catch (_) {}
      canvas.classList.remove('sparkline-visible');
      canvas.setAttribute('aria-hidden', 'true');
    }
    if (fallbackEl) {
      var fallbackText = renderOptions.fallbackText || 'Riwayat harga belum tersedia.';
      fallbackEl.textContent = fallbackText;
      fallbackEl.classList.add('is-visible');
    }
    if (summaryEl) {
      var summaryText = renderOptions.summaryText || renderOptions.fallbackText || 'Riwayat harga belum tersedia.';
      if (renderOptions.summarySuffix) {
        summaryText += ' ' + renderOptions.summarySuffix;
      }
      summaryEl.textContent = summaryText;
    }
    if (highlightCard) highlightCard.setAttribute('data-sparkline-state', 'empty');
    LM_BARU_SPARKLINE_META = Object.assign({}, renderOptions, {
      hasSeries: false
    });
    return;
  }

  hideSparklineTooltip({
    unlock: true
  });
  if (highlightCard) highlightCard.setAttribute('data-sparkline-state', 'ready');
  if (fallbackEl) {
    fallbackEl.textContent = '';
    fallbackEl.classList.remove('is-visible');
  }
  if (canvas) {
    canvas.removeAttribute('aria-hidden');
    var rect = canvas.getBoundingClientRect();
    var width = Math.max(1, rect.width || canvas.clientWidth || 160);
    var height = Math.max(32, rect.height || canvas.clientHeight || 48);
    var dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    var ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(dpr, dpr);
      var prices = series.map(function(point) {
        return Number(point.price) || 0;
      });
      var min = Math.min.apply(null, prices);
      var max = Math.max.apply(null, prices);
      if (!isFinite(min) || !isFinite(max)) {
        min = max = 0;
      }
      var range = max - min;
      if (range <= 0) {
        range = 1;
      }
      var verticalPadding = Math.max(4, Math.min(height * 0.24, height * 0.18));
      if (verticalPadding * 2 >= height) {
        verticalPadding = Math.max(4, height * 0.1);
      }
      var usableHeight = height - verticalPadding * 2;
      if (usableHeight <= 0) {
        verticalPadding = 4;
        usableHeight = Math.max(8, height - 8);
      }
      var step = prices.length > 1 ? width / (prices.length - 1) : width;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';

      var points = [];
      ctx.beginPath();
      prices.forEach(function(price, idx) {
        var x = idx * step;
        var norm = (price - min) / range;
        var y = height - verticalPadding - norm * usableHeight;
        var basePoint = series[idx] || {};
        var baseValue = typeof basePoint.base === 'number' ? basePoint.base : null;
        var timeValue = basePoint.time instanceof Date && !isNaN(basePoint.time.getTime()) ? basePoint.time : (basePoint.time ? resolveDate(basePoint.time) : null);
        points.push({
          x: x,
          y: y,
          price: price,
          base: baseValue,
          time: timeValue
        });
        if (idx === 0) ctx.moveTo(x, y);
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
      prices.forEach(function(price, idx) {
        var x = idx * step;
        var norm = (price - min) / range;
        var y = height - verticalPadding - norm * usableHeight;
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = 'rgba(88, 255, 169, 0.95)';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.lineWidth = 1.1;
      points.forEach(function(plotPoint, idx) {
        if (!plotPoint) return;
        ctx.beginPath();
        ctx.arc(plotPoint.x, plotPoint.y, idx === points.length - 1 ? 3.4 : 2.4, 0, Math.PI * 2);
        ctx.fillStyle = idx === points.length - 1 ? 'rgba(88, 255, 169, 1)' : 'rgba(88, 255, 169, 0.62)';
        ctx.strokeStyle = idx === points.length - 1 ? 'rgba(1, 33, 30, 0.72)' : 'rgba(1, 33, 30, 0.4)';
        ctx.fill();
        ctx.stroke();
      });

      canvas.classList.add('sparkline-visible');
      LM_BARU_SPARKLINE_POINTS = points;
      LM_BARU_SPARKLINE_ACTIVE_INDEX = -1;
      LM_BARU_SPARKLINE_TOOLTIP_LOCKED = false;
      attachSparklineInteractions();
    }
  }
  if (summaryEl) {
    var summaryMessage = renderOptions.summaryText || describeSparklineSeries(series, renderOptions.periodLabel);
    if (renderOptions.summarySuffix) {
      summaryMessage += ' ' + renderOptions.summarySuffix;
    }
    summaryEl.textContent = summaryMessage;
  }
  LM_BARU_SPARKLINE_META = Object.assign({}, renderOptions, {
    hasSeries: true
  });
}

function applySparklineFromCache(summarySuffix, fallbackText) {
  var activeSeries = LM_BARU_SERIES_BY_RANGE[LM_BARU_ACTIVE_RANGE];
  if (!Array.isArray(activeSeries) || activeSeries.length < 2) {
    var storedSeries = readLastSparklineSeries();
    if (Array.isArray(storedSeries) && storedSeries.length) {
      resetRangeSeriesCache(storedSeries);
      activeSeries = LM_BARU_SERIES_BY_RANGE[LM_BARU_ACTIVE_RANGE];
    }
  }
  if (Array.isArray(activeSeries) && activeSeries.length >= 2) {
    setActiveSparklineRange(LM_BARU_ACTIVE_RANGE, {
      summarySuffix: summarySuffix
    });
  } else {
    resetRangeSeriesCache(activeSeries || []);
    LM_BARU_PRICE_SERIES = Array.isArray(activeSeries) ? activeSeries.slice() : [];
    var message = typeof fallbackText === 'string' ? fallbackText : (typeof summarySuffix === 'string' ? summarySuffix : 'Grafik riwayat tidak tersedia.');
    updateLmBaruSparkline(null, {
      fallbackText: message,
      summaryText: message,
      rangeKey: LM_BARU_ACTIVE_RANGE,
      displayLabel: (getRangeConfig(LM_BARU_ACTIVE_RANGE) && getRangeConfig(LM_BARU_ACTIVE_RANGE).displayLabel) || DEFAULT_SPARKLINE_PERIOD
    });
  }
}

function extractPreviousBase(data, currentBase) {
  if (!data) return null;
  var currentVal = safeNumber(currentBase);
  if (currentVal === null && data.current) {
    var derived = safeNumber(data.current.buy);
    if (derived !== null) currentVal = derived;
  }
  var candidates = [];
  var order = 0;

  function pushCandidate(entry, priority) {
    if (!entry) return;
    var val = safeNumber(entry.buy);
    if (val === null) return;
    var timeDate = resolveEntryTime(entry);
    var timeValue = timeDate instanceof Date && !isNaN(timeDate.getTime()) ? timeDate.getTime() : null;
    candidates.push({
      value: val,
      time: timeValue,
      priority: priority || 0,
      order: order++
    });
  }
  if (data.current) {
    pushCandidate(data.current.previous, 3);
  }
  pushCandidate(data.previous, 1);
  if (Array.isArray(data.history)) {
    data.history.forEach(function(item) {
      pushCandidate(item, 1);
    });
  }
  if (!candidates.length) return null;
  candidates.sort(function(a, b) {
    if (a.priority !== b.priority) return b.priority - a.priority;
    if (a.time !== null && b.time !== null && a.time !== b.time) return b.time - a.time;
    if (a.time !== null && b.time === null) return -1;
    if (a.time === null && b.time !== null) return 1;
    return b.order - a.order;
  });
  var seenValues = new Set();
  for (var i = 0; i < candidates.length; i++) {
    var candidate = candidates[i];
    if (!candidate) continue;
    var value = candidate.value;
    if (currentVal !== null && Math.abs(value - currentVal) < 1) {
      if (candidate.priority >= 3) {
        return value;
      }
      continue;
    }
    var key = String(value);
    if (seenValues.has(key)) continue;
    seenValues.add(key);
    return value;
  }
  return null;
}

function buildPerhiasanPricesFromBase(basePrice) {
  return GOLD_KARAT_SERIES.map(function(entry) {
    var factor = entry.karat === 24 ? FACTOR_PERHIASAN_24K : FACTOR_PERHIASAN_SUB;
    var adjustment = entry.karat === 24 ? PRICE_ADJUST_LM_IDR : PRICE_ADJUST_IDR;
    var harga = roundUpPrice(basePrice * entry.purity * factor + adjustment);
    return {
      karat: entry.karat,
      price: harga,
      infoKey: 'karat-' + entry.karat
    };
  });
}

function renderPriceTable(rows) {
  var tbody = document.getElementById('goldPriceTable');
  /* istanbul ignore next */
  if (!tbody) return;
  tbody.setAttribute('aria-busy', 'true');
  tbody.innerHTML = '';
  var priceEntries = [];
  rows.forEach(function(row) {
    if (!row || typeof row.price !== 'number' || !isFinite(row.price)) return;
    var color = row.color || GOLD_ROW_PRIMARY;
    var infoAttr = row.infoKey ? ` data-info-key="${row.infoKey}" tabindex="0" role="button" aria-label="Detail ${row.label}"` : '';
    var iconTooltip = row.iconTooltip || row.label;
    var tooltipAttr = iconTooltip ? ` data-tooltip="${escapeAttr(iconTooltip)}"` : '';
    var iconAriaAttr = iconTooltip ? ` role="img" aria-label="${escapeAttr(iconTooltip)}"` : ' aria-hidden="true"';
    var iconHtml = row.icon ? `<span class="price-icon price-icon--${row.icon} tooltip"${tooltipAttr}${iconAriaAttr}></span>` : '';
    var addAttrs = '';
    if (row.addCat) {
      addAttrs += ` data-add-cat="${row.addCat}"`;
    }
    if (row.addKadar !== undefined && row.addKadar !== null) {
      addAttrs += ` data-add-kadar="${row.addKadar}"`;
    }
    var addTooltip = `Tambahkan ${row.label} ke kalkulator`;
    var addBtn = row.addCat ? `<button type="button" class="price-add-btn tooltip"${addAttrs} aria-label="${escapeAttr(addTooltip)}" data-tooltip="${escapeAttr(addTooltip)}"><span class="price-add-icon" aria-hidden="true">+</span></button>` : '';
    var labelHtml = `<div class="price-label">${row.label}</div>`;
    var priceHtml = `<div class="price-amount">Rp <span class="num" data-to="${row.price}">0</span></div>`;
    var actionHtml = row.addCat ? addBtn : '';
    var indicatorIcon = row.infoKey ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>` : '';
    tbody.insertAdjacentHTML('beforeend', `<tr class="price-row"${infoAttr}><td class="kadar">${iconHtml}${labelHtml}</td><td class="price-cell">${priceHtml}</td><td class="price-action">${actionHtml}</td></tr>`);
    priceEntries.push({
      name: row.schemaName || row.label,
      price: row.price
    });
  });
  tbody.setAttribute('aria-busy', 'false');
  updatePriceSchema(priceEntries);
  document.dispatchEvent(new CustomEvent('prices:updated'));
}

function getGlobalGoldElements() {
  if (typeof document === 'undefined') return {};
  return {
    card: document.getElementById('globalGoldPriceCard'),
    perGram: document.getElementById('globalGoldPricePerGram'),
    date: document.getElementById('globalGoldPriceDate'),
    note: document.getElementById('globalGoldPriceNote'),
    tableBody: document.getElementById('globalGoldPriceTable'),
    tableNote: document.getElementById('globalGoldPriceTableNote')
  };
}

function setGlobalGoldBusy(elements, busy) {
  var target = elements || getGlobalGoldElements();
  var value = busy ? 'true' : 'false';
  if (target.card) target.card.setAttribute('aria-busy', value);
  if (target.tableBody) target.tableBody.setAttribute('aria-busy', value);
}

function setGlobalNoteText(noteEl, message) {
  if (!noteEl) return;
  var currentText = noteEl.textContent || '';
  if (noteEl.dataset) {
    if (!noteEl.dataset.defaultText) {
      noteEl.dataset.defaultText = currentText.trim();
    }
    if (typeof message === 'string' && message.length) {
      noteEl.textContent = message;
    } else {
      noteEl.textContent = noteEl.dataset.defaultText || currentText;
    }
  } else {
    var stored = noteEl.getAttribute('data-default-text');
    if (!stored) {
      noteEl.setAttribute('data-default-text', currentText.trim());
      stored = noteEl.getAttribute('data-default-text');
    }
    if (typeof message === 'string' && message.length) {
      noteEl.textContent = message;
    } else {
      noteEl.textContent = stored || currentText;
    }
  }
}

function normalizeGlobalGoldPayload(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Payload harga dunia kosong');
  }
  var rates = payload.xau || {};
  var idrValue = typeof rates.idr === 'number' ? rates.idr : Number(rates.idr);
  if (!isFinite(idrValue) || idrValue <= 0) {
    throw new Error('Nilai XAU → IDR tidak valid');
  }
  var date = resolveDate(payload.date);
  var dateLabel = '';
  if (date) {
    dateLabel = formatDateOnlyIndo(date);
  } else if (typeof payload.date === 'string' && payload.date.trim()) {
    dateLabel = payload.date.trim();
  }
  return {
    perOunce: idrValue,
    perGram: idrValue / TROY_OUNCE_IN_GRAMS,
    date: date || null,
    dateLabel: dateLabel
  };
}

function renderGlobalGoldSpot(data, targetElements) {
  var elements = targetElements || getGlobalGoldElements();
  if (!elements.card && !elements.tableBody) return;
  if (elements.card) elements.card.removeAttribute('data-state');
  if (elements.tableBody) elements.tableBody.removeAttribute('data-state');

  var perGramValue = (typeof data.perGram === 'number' && isFinite(data.perGram)) ? Math.round(data.perGram) : null;
  var perOunceValue = (typeof data.perOunce === 'number' && isFinite(data.perOunce)) ? Math.round(data.perOunce) : null;
  var dateLabel = data.dateLabel || (data.date ? formatDateOnlyIndo(data.date) : '');

  if (elements.perGram) {
    elements.perGram.textContent = perGramValue !== null ? 'Rp ' + formatCurrencyIDR(perGramValue) : 'Rp —';
  }
  if (elements.date) {
    elements.date.textContent = dateLabel || '—';
  }

  setGlobalNoteText(elements.note, null);
  setGlobalNoteText(elements.tableNote, null);

  if (elements.tableBody) {
    var rows = [];
    if (perOunceValue !== null) {
      rows.push('<tr><td>Per Troy Ounce (31,103 gram)</td><td align="right">Rp ' + formatCurrencyIDR(perOunceValue) + '</td></tr>');
    }
    if (perGramValue !== null) {
      rows.push('<tr><td>Per Gram</td><td align="right">Rp ' + formatCurrencyIDR(perGramValue) + '</td></tr>');
    }
    if (!rows.length) {
      rows.push('<tr><td colspan="2" class="text-note">Data harga emas dunia belum tersedia.</td></tr>');
    }
    elements.tableBody.innerHTML = rows.join('');
  }
}

function renderGlobalGoldError(message, targetElements) {
  var elements = targetElements || getGlobalGoldElements();
  if (!elements.card && !elements.tableBody) return;
  var fallback = typeof message === 'string' && message.length ? message : 'Harga emas dunia belum tersedia.';

  if (elements.perGram) {
    elements.perGram.textContent = 'Rp —';
  }
  if (elements.date) {
    elements.date.textContent = '—';
  }

  setGlobalNoteText(elements.note, fallback);
  setGlobalNoteText(elements.tableNote, fallback);

  if (elements.tableBody) {
    elements.tableBody.innerHTML = '<tr><td colspan="2" class="text-note">' + escapeHTML(fallback) + '</td></tr>';
    elements.tableBody.setAttribute('data-state', 'error');
  }
  if (elements.card) {
    elements.card.setAttribute('data-state', 'error');
  }
}

async function fetchGlobalGoldSpot() {
  if (typeof fetch !== 'function') return null;
  var elements = getGlobalGoldElements();
  if (!elements.card && !elements.tableBody) return null;

  if (GLOBAL_GOLD_SPOT_CACHE) {
    renderGlobalGoldSpot(GLOBAL_GOLD_SPOT_CACHE, elements);
    return GLOBAL_GOLD_SPOT_CACHE;
  }

  setGlobalGoldBusy(elements, true);
  if (!GLOBAL_GOLD_SPOT_PROMISE) {
    GLOBAL_GOLD_SPOT_PROMISE = (async function() {
      let lastError = null;
      for (const endpoint of getGlobalGoldEndpoints()) {
        try {
          const response = await fetch(endpoint, {
            cache: 'no-store'
          });
          if (!response.ok) {
            throw new Error('Gagal memuat harga dunia: ' + response.status);
          }
          const payload = await response.json();
          const normalized = normalizeGlobalGoldPayload(payload);
          GLOBAL_GOLD_SPOT_CACHE = normalized;
          return normalized;
        } catch (error) {
          lastError = error;
          console.warn('Gagal mengambil dari ' + endpoint + ', mencoba fallback...');
        }
      }
      throw lastError || new Error('Semua endpoint harga dunia gagal.');
    })();
  }

  try {
    var result = await GLOBAL_GOLD_SPOT_PROMISE;
    renderGlobalGoldSpot(result, elements);
    return result;
  } catch (err) {
    /* istanbul ignore next */
    console.warn('Harga emas dunia gagal dimuat dari semua sumber:', err?.message || err);
    renderGlobalGoldError('Harga emas dunia belum tersedia. Silakan coba lagi.', elements);
    return null;
  } finally {
    setGlobalGoldBusy(elements, false);
    GLOBAL_GOLD_SPOT_PROMISE = null;
  }
}

var HIGHLIGHT_ADD_BOUND = false;

var SHARE_LOGO_PROMISE = null;

function loadShareLogo() {
  if (SHARE_LOGO_PROMISE) return SHARE_LOGO_PROMISE;
  SHARE_LOGO_PROMISE = new Promise(function(resolve) {
    try {
      var img = new Image();
      img.decoding = 'async';
      img.crossOrigin = 'anonymous';
      img.onload = function() {
        resolve(img);
      };
      img.onerror = function() {
        resolve(null);
      };
      img.src = '/assets/icons/logo-192.png';
    } catch (_) {
      resolve(null);
    }
  });
  return SHARE_LOGO_PROMISE;
}

async function copyImageBlob(blob) {
  if (!blob) return false;
  if (typeof navigator === 'undefined') return false;
  var clipboard = navigator.clipboard;
  if (typeof window === 'undefined') return false;
  if (!clipboard || typeof clipboard.write !== 'function' || typeof window.ClipboardItem !== 'function') {
    return false;
  }
  try {
    var item = new ClipboardItem({
      'image/png': blob
    });
    await clipboard.write([item]);
    return true;
  } catch (_) {
    return false;
  }
}

async function copyTextToClipboard(text) {
  if (!text || typeof navigator === 'undefined') return false;
  var clipboard = navigator.clipboard;
  if (!clipboard || typeof clipboard.writeText !== 'function') return false;
  try {
    await clipboard.writeText(text);
    return true;
  } catch (_) {
    return false;
  }
}

function buildCalcSelectionOptionsFromButton(addBtn) {
  if (!addBtn) return null;
  var options = {};
  var catAttr = addBtn.getAttribute('data-add-cat');
  var kadarAttr = addBtn.getAttribute('data-add-kadar');
  if (catAttr) options.cat = catAttr;
  if (kadarAttr !== null) options.kadar = kadarAttr;
  return options;
}

function triggerCalculatorSelection(addBtn, overrides) {
  if (!addBtn) return;
  var options = buildCalcSelectionOptionsFromButton(addBtn) || {};
  if (overrides) {
    options = Object.assign(options, overrides);
  }
  if (window.REI_CALC && typeof window.REI_CALC.setSelection === 'function') {
    window.REI_CALC.setSelection(options);
  }
}

function bindHighlightAddButton() {
  if (HIGHLIGHT_ADD_BOUND) return;
  var highlightAdd = document.getElementById('highlight-add');
  if (!highlightAdd) return;
  highlightAdd.addEventListener('click', function(ev) {
    ev.preventDefault();
    triggerCalculatorSelection(highlightAdd);
  });
  HIGHLIGHT_ADD_BOUND = true;
}

function collectSharePriceRows() {
  var tbody = document.getElementById('goldPriceTable');
  if (!tbody) return [];
  var rows = Array.prototype.slice.call(tbody.querySelectorAll('tr.price-row'));
  return rows.map(function(row) {
    var labelEl = row.querySelector('.price-label');
    var priceEl = row.querySelector('.price-amount .num');
    var label = labelEl ? labelEl.textContent.trim() : '';
    var valueAttr = priceEl ? priceEl.getAttribute('data-to') : null;
    var parsedValue = Number(valueAttr);
    if (!Number.isFinite(parsedValue) && priceEl) {
      var digits = priceEl.textContent.replace(/[^0-9]/g, '');
      parsedValue = Number(digits);
    }
    if (!label || !Number.isFinite(parsedValue)) return null;
    return {
      label: label,
      value: parsedValue,
      priceText: 'Rp ' + formatCurrencyIDR(parsedValue)
    };
  }).filter(Boolean);
}

function buildShareMetaInfo() {
  var now = new Date();
  var cached = null;
  try {
    cached = readLastBasePrice();
  } catch (_) {}
  if (cached && typeof cached.t === 'number') {
    var cachedDate = new Date(cached.t);
    if (!isNaN(cachedDate.getTime())) {
      now = cachedDate;
    }
  }
  var dateLabel = formatDateTimeIndo(now);
  var dateBadge = document.getElementById('currentDateTime');
  var badgeText = dateBadge && dateBadge.textContent ? dateBadge.textContent.trim() : '';
  if (badgeText && badgeText !== '—') {
    dateLabel = badgeText;
  }
  var infoEl = document.getElementById('lastUpdatedInfo');
  var noteText = infoEl && infoEl.textContent ? infoEl.textContent.trim() : '';
  if (noteText && noteText.charAt(0) === '*') {
    noteText = noteText.substring(1).trim();
  }
  if (noteText && noteText.toLowerCase().indexOf('terakhir diperbarui') !== -1) {
    noteText = '';
  }
  var iso = now.toISOString();
  var fileStamp = iso.slice(0, 10).replace(/-/g, '') + '-' + iso.slice(11, 16).replace(/:/g, '');
  var shareCaption = 'Cek info lengkap di https://sentralemas.com/#harga';
  return {
    title: 'Harga Buyback Emas',
    subtitle: 'Sentral Emas',
    updatedLabel: 'Update: ' + dateLabel,
    updatedFooter: 'Terakhir diperbarui: ' + dateLabel,
    updatedAt: now,
    note: noteText,
    shareTitle: 'Harga Buyback Emas - Sentral Emas',
    shareText: 'Update harga buyback emas Sentral Emas per ' + formatDateTimeIndo(now) + '.\n' + shareCaption,
    footer: 'sentralemas.com/#harga',
    fileName: 'sentral-emas-harga-' + fileStamp + '.png'
  };
}

function drawRoundedRect(ctx, x, y, width, height, radius, mode) {
  var r = Math.max(0, Math.min(radius, Math.min(width, height) / 2));
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  if (mode === 'stroke') ctx.stroke();
  else if (mode === 'fill-stroke') {
    ctx.fill();
    ctx.stroke();
  } else {
    ctx.fill();
  }
}


function truncateTextToWidth(ctx, text, maxWidth) {
  if (!ctx || !text) return '';
  var ellipsis = '...';
  var content = text.trim();
  if (!content) return '';
  if (ctx.measureText(content).width <= maxWidth) return content;
  while (content.length > 1 && ctx.measureText(content + ellipsis).width > maxWidth) {
    content = content.slice(0, -1).trim();
  }
  return content.length ? content + ellipsis : ellipsis;
}

function wrapTextLinesLimited(ctx, text, maxWidth, maxLines) {
  if (!ctx || !text) return [];
  var words = text.split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  var limit = typeof maxLines === 'number' && maxLines > 0 ? maxLines : 1;
  var lines = [];
  var index = 0;
  while (index < words.length && lines.length < limit) {
    var line = words[index];
    index++;
    while (index < words.length) {
      var candidate = line + ' ' + words[index];
      if (ctx.measureText(candidate).width <= maxWidth) {
        line = candidate;
        index++;
      } else {
        break;
      }
    }
    lines.push(line);
  }
  if (index < words.length && lines.length) {
    var remainder = lines.pop() + ' ' + words.slice(index).join(' ');
    lines.push(truncateTextToWidth(ctx, remainder, maxWidth));
  }
  return lines;
}

function drawPriceShareCanvas(rows, meta, logoImage) {
  if (!Array.isArray(rows) || !rows.length) return null;
  var width = 1080;
  var headerHeight = 260;
  var footerHeight = 132;
  var cardOffsetTop = 56;
  var cardPaddingX = 90;
  var cardPaddingY = 72;
  var rowHeight = 108;
  var rowGap = 12;
  var noteLineHeight = 34;
  var infoSpacingTop = 26;
  var infoSpacingBottom = 34;
  var noteGap = 12;
  var labelPadding = 24;
  var minPriceSpace = 320;
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');
  if (!ctx) return null;

  var tableWidth = width - 128 - cardPaddingX * 2;
  var tableHeight = rows.length * rowHeight + Math.max(0, rows.length - 1) * rowGap;
  ctx.font = '400 28px "Inter", "Helvetica Neue", Arial, sans-serif';
  var noteLinesForHeight = meta.note ? wrapTextLinesLimited(ctx, meta.note, tableWidth, 4) : [];
  var noteHeight = noteLinesForHeight.length ? noteLinesForHeight.length * noteLineHeight : 0;
  var infoBlockHeight = 0;
  if (meta.updatedFooter) infoBlockHeight += noteLineHeight;
  if (noteLinesForHeight.length) infoBlockHeight += noteGap + noteHeight;
  var cardHeight = cardPaddingY * 2 + tableHeight + (infoBlockHeight ? infoSpacingTop + infoBlockHeight + infoSpacingBottom : 20);
  var canvasHeight = headerHeight + cardOffsetTop + cardHeight + footerHeight;
  canvas.width = width;
  canvas.height = canvasHeight;

  // Background
  ctx.fillStyle = '#F4ECE0';
  ctx.fillRect(0, 0, width, canvasHeight);

  // Header gradient
  var gradient = ctx.createLinearGradient(0, 0, 0, headerHeight + 120);
  gradient.addColorStop(0, '#02413C');
  gradient.addColorStop(1, '#0F6E66');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, headerHeight);

  // Decorative glow
  ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
  ctx.beginPath();
  ctx.ellipse(width / 2, headerHeight - 12, width * 0.6, 120, 0, 0, Math.PI * 2);
  ctx.fill();

  // Card base with shadow
  var cardX = 64;
  var cardY = headerHeight - 40 + cardOffsetTop;
  ctx.fillStyle = '#FFFFFF';
  ctx.save();
  ctx.shadowColor = 'rgba(10, 60, 52, 0.28)';
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 26;
  drawRoundedRect(ctx, cardX, cardY, width - cardX * 2, cardHeight, 38);
  ctx.restore();

  // Card fill
  ctx.fillStyle = '#FFFFFF';
  drawRoundedRect(ctx, cardX, cardY, width - cardX * 2, cardHeight, 38);

  // Card border
  ctx.strokeStyle = '#F0E7D8';
  ctx.lineWidth = 2;
  drawRoundedRect(ctx, cardX + 1, cardY + 1, width - cardX * 2 - 2, cardHeight - 2, 36, 'stroke');

  // Header texts
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.font = '700 64px "Inter", "Helvetica Neue", Arial, sans-serif';
  ctx.fillText(meta.title, 80, 78);
  ctx.font = '500 38px "Inter", "Helvetica Neue", Arial, sans-serif';
  ctx.fillText(meta.subtitle, 80, 146);

  if (logoImage) {
    var logoSize = 118;
    var logoX = width - cardX - logoSize - 40;
    var logoY = 82;
    var logoCenterX = logoX + logoSize / 2;
    var logoCenterY = logoY + logoSize / 2;
    ctx.save();
    ctx.beginPath();
    ctx.arc(logoCenterX, logoCenterY, logoSize / 2 + 14, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.arc(logoCenterX, logoCenterY, logoSize / 2, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.clip();
    ctx.drawImage(logoImage, logoX, logoY, logoSize, logoSize);
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.arc(logoCenterX, logoCenterY, logoSize / 2, 0, Math.PI * 2);
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'rgba(13, 106, 99, 0.45)';
    ctx.stroke();
    ctx.restore();
  }

  var tableX = cardX + cardPaddingX;
  var tableY = cardY + cardPaddingY;
  ctx.textBaseline = 'middle';
  var rowBodyRadius = 30;
  var rowBodyPadX = 28;
  var rowBodyPadY = 10;
  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    var rowTop = tableY + i * (rowHeight + rowGap);
    var rowBg = '#FFFFFF';
    if (i === 0) rowBg = '#E3F3F0';
    else if (i === 1) rowBg = '#F4EEE2';
    else if (i % 2 === 0) rowBg = '#FCF7EE';
    ctx.fillStyle = rowBg;
    drawRoundedRect(ctx, tableX - rowBodyPadX, rowTop + rowBodyPadY, tableWidth + rowBodyPadX * 2, rowHeight - rowBodyPadY * 2, rowBodyRadius);

    var textY = rowTop + rowHeight / 2;
    var highlightRow = i <= 1;
    var priceFont = highlightRow ? '700 52px "Inter", "Helvetica Neue", Arial, sans-serif' : '700 50px "Inter", "Helvetica Neue", Arial, sans-serif';

    ctx.font = priceFont;
    ctx.textAlign = 'right';
    ctx.fillStyle = '#0D6A63';
    var priceX = tableX + tableWidth - labelPadding;
    var priceWidth = ctx.measureText(row.priceText).width;
    var priceSpace = Math.max(minPriceSpace, priceWidth + labelPadding * 2);
    var priceStart = priceX - priceSpace + labelPadding;
    if (priceStart < tableX + labelPadding * 2) {
      priceStart = tableX + labelPadding * 2;
      priceSpace = priceX - priceStart + labelPadding;
    }
    ctx.fillText(row.priceText, priceX, textY);

    var labelMaxWidth = Math.max(140, priceStart - (tableX + labelPadding));
    var labelFontSingle = highlightRow ? '600 44px "Inter", "Helvetica Neue", Arial, sans-serif' : '500 42px "Inter", "Helvetica Neue", Arial, sans-serif';
    var labelFontMulti = highlightRow ? '600 40px "Inter", "Helvetica Neue", Arial, sans-serif' : '500 38px "Inter", "Helvetica Neue", Arial, sans-serif';
    ctx.font = labelFontSingle;
    ctx.textAlign = 'left';
    ctx.fillStyle = '#1F2E2A';

    var forcedLines = null;
    if (highlightRow && /\(LM\)/.test(row.label)) {
      var split = row.label.split(/\(LM\)/);
      var firstPart = (split[0] || '').trim();
      var remainder = split.slice(1).join('(LM)').trim();
      if (firstPart) {
        forcedLines = [(firstPart + ' (LM)').trim()];
        if (remainder) forcedLines.push(remainder);
      }
    }

    var labelLines;
    if (forcedLines) {
      ctx.font = labelFontMulti;
      labelLines = forcedLines.map(function(line) {
        return truncateTextToWidth(ctx, line, labelMaxWidth);
      }).filter(Boolean);
    } else {
      labelLines = wrapTextLinesLimited(ctx, row.label, labelMaxWidth, 2);
      if (labelLines.length > 1) {
        ctx.font = labelFontMulti;
        labelLines = wrapTextLinesLimited(ctx, row.label, labelMaxWidth, 2);
      }
      if (!labelLines.length) {
        labelLines = [truncateTextToWidth(ctx, row.label, labelMaxWidth)];
      }
    }
    var isMultiLine = labelLines.length > 1;
    var lineGap = isMultiLine ? (highlightRow ? 42 : 36) : 0;
    var labelBlockHeight = (labelLines.length - 1) * lineGap;
    var labelBaseY = textY - labelBlockHeight / 2;
    ctx.save();
    ctx.beginPath();
    ctx.rect(tableX + labelPadding, rowTop + rowBodyPadY, labelMaxWidth, rowHeight - rowBodyPadY * 2);
    ctx.clip();
    for (var lineIndex = 0; lineIndex < labelLines.length; lineIndex++) {
      ctx.fillText(labelLines[lineIndex], tableX + labelPadding, labelBaseY + lineIndex * lineGap);
    }
    ctx.restore();

    if (i < rows.length - 1) {
      var dividerY = rowTop + rowHeight - rowBodyPadY + rowGap / 2;
      ctx.beginPath();
      ctx.moveTo(tableX - rowBodyPadX + 16, dividerY);
      ctx.lineTo(tableX + tableWidth + rowBodyPadX - 16, dividerY);
      ctx.strokeStyle = '#E4D9C3';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  if (infoBlockHeight) {
    var infoY = tableY + tableHeight + infoSpacingTop;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    var noteLines = noteLinesForHeight;
    if (meta.updatedFooter) {
      ctx.font = '500 30px "Inter", "Helvetica Neue", Arial, sans-serif';
      ctx.fillStyle = '#415749';
      ctx.fillText(meta.updatedFooter, tableX, infoY);
      infoY += noteLineHeight;
    }
    if (noteLines.length) {
      if (meta.updatedFooter) infoY += noteGap;
      ctx.font = '400 28px "Inter", "Helvetica Neue", Arial, sans-serif';
      ctx.fillStyle = '#6A5C3E';
      noteLines.forEach(function(line, idx) {
        ctx.fillText(line, tableX, infoY + idx * noteLineHeight);
      });
    }
  }

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '500 34px "Inter", "Helvetica Neue", Arial, sans-serif';
  ctx.fillStyle = '#615335';
  ctx.fillText('Sentral Emas • ' + meta.footer, width / 2, canvasHeight - footerHeight / 2);

  return canvas;
}

function canvasToBlob(canvas) {
  return new Promise(function(resolve, reject) {
    if (!canvas) {
      reject(new Error('Canvas tidak tersedia'));
      return;
    }
    if (typeof canvas.toBlob === 'function') {
      canvas.toBlob(function(blob) {
        if (blob) resolve(blob);
        else reject(new Error('Gagal membuat blob')); // coverage
      }, 'image/png', 0.95);
      return;
    }
    try {
      var dataUrl = canvas.toDataURL('image/png');
      var parts = dataUrl.split(',');
      var base64 = parts[1] || '';
      var binary = atob(base64);
      var len = binary.length;
      var buffer = new Uint8Array(len);
      for (var i = 0; i < len; i++) {
        buffer[i] = binary.charCodeAt(i);
      }
      resolve(new Blob([buffer], {
        type: 'image/png'
      }));
    } catch (err) {
      reject(err);
    }
  });
}

function triggerDownload(blob, filename) {
  var link = document.createElement('a');
  var url = URL.createObjectURL(blob);
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  setTimeout(function() {
    URL.revokeObjectURL(url);
    document.body.removeChild(link);
  }, 0);
}

function toggleShareFallbackMessage(visible, message) {
  var fallbackEl = document.getElementById('sharePriceFallback');
  if (!fallbackEl) return;
  if (message) {
    fallbackEl.textContent = message;
  } else if (fallbackEl.dataset && fallbackEl.dataset.default) {
    fallbackEl.textContent = fallbackEl.dataset.default;
  }
  if (visible) {
    fallbackEl.removeAttribute('hidden');
  } else {
    fallbackEl.setAttribute('hidden', '');
  }
}

async function sharePriceTable(button) {
  var rows = collectSharePriceRows();
  if (!rows.length) {
    toggleShareFallbackMessage(true, 'Data harga belum siap. Mohon coba lagi setelah tabel termuat.');
    return;
  }
  var originalLabel = button.textContent;
  button.disabled = true;
  button.setAttribute('aria-busy', 'true');
  button.textContent = 'Menyiapkan...';
  try {
    var meta = buildShareMetaInfo();
    var logoImage = await loadShareLogo().catch(function() {
      return null;
    });
    var canvas = drawPriceShareCanvas(rows, meta, logoImage);
    if (!canvas) throw new Error('Canvas tidak dapat dibuat');
    var blob = await canvasToBlob(canvas);
    var fileName = meta.fileName;
    var shareData = null;
    var copiedCaptionForFallback = false;
    var canUseShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';
    if (canUseShare && typeof File === 'function') {
      try {
        var shareFile = new File([blob], fileName, {
          type: 'image/png'
        });
        var basePayload = {
          files: [shareFile]
        };
        var payloadWithText = Object.assign({}, basePayload);
        if (meta.shareText) payloadWithText.text = meta.shareText;
        if (meta.shareTitle) payloadWithText.title = meta.shareTitle;
        var canShareWithText = true;
        if (navigator.canShare && !navigator.canShare(payloadWithText)) {
          canShareWithText = false;
        }
        if (canShareWithText) {
          shareData = payloadWithText;
        } else {
          var canShareBase = true;
          if (navigator.canShare && !navigator.canShare(basePayload)) {
            canShareBase = false;
          }
          if (canShareBase) {
            shareData = basePayload;
            if (meta.shareText) {
              copiedCaptionForFallback = await copyTextToClipboard(meta.shareText);
            }
          } else {
            shareData = null;
          }
        }
      } catch (_) {
        shareData = null;
      }
    }
    if (shareData) {
      try {
        await navigator.share(shareData);
        if (copiedCaptionForFallback) {
          toggleShareFallbackMessage(true, 'Caption sudah disalin. Tempel manual setelah kirim gambar.');
        } else {
          toggleShareFallbackMessage(false);
        }
        return;
      } catch (shareErr) {
        var name = shareErr && shareErr.name;
        if (name === 'AbortError' || name === 'NotAllowedError' || name === 'SecurityError') {
          toggleShareFallbackMessage(false);
          return;
        }
        console.error(shareErr); // eslint-disable-line no-console
      }
    }
    var copied = await copyImageBlob(blob);
    if (copied) {
      toggleShareFallbackMessage(true, 'Gambar harga sudah disalin. Tempel langsung di aplikasi tujuan.');
      return;
    }
    triggerDownload(blob, fileName);
    toggleShareFallbackMessage(true);
  } catch (err) {
    toggleShareFallbackMessage(true, 'Gagal menyiapkan gambar bagikan. Silakan coba lagi.');
    console.error(err); // eslint-disable-line no-console
  } finally {
    button.disabled = false;
    button.removeAttribute('aria-busy');
    button.textContent = originalLabel;
  }
}

function setupSharePriceButton() {
  var button = document.getElementById('sharePriceTable');
  if (!button) return;
  var fallbackEl = document.getElementById('sharePriceFallback');
  if (fallbackEl && fallbackEl.dataset && !fallbackEl.dataset.default) {
    fallbackEl.dataset.default = fallbackEl.textContent.trim();
  }
  var updateAvailability = function() {
    var hasData = collectSharePriceRows().length > 0;
    button.disabled = !hasData;
    if (hasData) {
      button.removeAttribute('aria-disabled');
    } else {
      button.setAttribute('aria-disabled', 'true');
    }
  };
  updateAvailability();
  document.addEventListener('prices:updated', updateAvailability);
  button.addEventListener('click', function() {
    sharePriceTable(button);
  });
}

function renderPriceTableFromNumbers(lmBaru, lmLama, perhiasanEntries) {
  var rows = [];
  if (typeof lmBaru === 'number' && isFinite(lmBaru)) {
    rows.push({
      label: 'Logam Mulia (LM) Baru',
      schemaName: 'Logam Mulia (LM) Baru',
      price: lmBaru,
      color: GOLD_ROW_PRIMARY,
      infoKey: 'lm_baru',
      icon: 'lm',
      iconTitle: 'Keping logam mulia',
      iconTooltip: 'Logam Mulia (LM) Baru',
      addCat: 'lm_baru',
      addKadar: '24'
    });
  }
  if (typeof lmLama === 'number' && isFinite(lmLama)) {
    rows.push({
      label: 'Logam Mulia (LM) Lama',
      schemaName: 'Logam Mulia (LM) Lama',
      price: lmLama,
      color: GOLD_ROW_SECONDARY,
      infoKey: 'lm_lama',
      icon: 'lm',
      iconTitle: 'Keping logam mulia',
      iconTooltip: 'Logam Mulia (LM) Lama',
      addCat: 'lm_lama',
      addKadar: '24'
    });
  }
  (perhiasanEntries || []).forEach(function(entry) {
    var iconType = 'jewelry';
    var iconTitle = 'Perhiasan emas';
    var iconTooltip = `Perhiasan ${entry.karat}K`;
    if (entry.karat && Number(entry.karat) < 17) {
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

function displayFromBasePrice(basePrice, options) {
  options = options || {};
  var normalizedBase = Number(basePrice);
  if (!Number.isFinite(normalizedBase)) return;
  var lmBaru = computeLmBaruPrice(normalizedBase);
  var lmLama = computeLmLamaPrice(normalizedBase);
  renderPriceTableFromNumbers(lmBaru, lmLama, buildPerhiasanPricesFromBase(normalizedBase));

  var prevPrice = null;
  if (Number.isFinite(options.previousPrice)) prevPrice = Math.round(options.previousPrice);
  else if (Number.isFinite(options.previousBase)) prevPrice = computeLmBaruPrice(options.previousBase);

  var highlightCard = document.getElementById('lmBaruHighlight');
  if (highlightCard) highlightCard.setAttribute('aria-busy', 'false');

  updateLmBaruHighlight(lmBaru, {
    previousPrice: prevPrice,
    updatedAt: options.updatedAt,
    deltaText: options.deltaText,
    badgeLabel: options.badgeLabel,
    badgeState: options.badgeState
  });

  var info = document.getElementById('lastUpdatedInfo');
  if (info) {
    if (typeof options.infoText === 'string') {
      info.textContent = options.infoText;
    } else {
      var infoDate = resolveDate(options.updatedAt) || new Date();
      var infoText = 'Terakhir diperbarui: ' + formatDateTimeIndo(infoDate);
      if (options.metaSuffix) infoText += options.metaSuffix;
      info.textContent = infoText;
    }
  }
  bindHighlightAddButton();
}

function handleGoldPriceFallback(summarySuffix, fallbackSummary) {
  var last = readLastBasePrice();
  /* istanbul ignore next */
  if (last) {
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
  } else {
    displayDefaultPrices();
  }
}

async function fetchGoldPrice() {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), PRICE_TIMEOUT_MS);
  try {
    const response = await fetch(`https://pluang.com/api/asset/gold/pricing?daysLimit=${LM_HISTORY_DAYS_LIMIT}`, {
      signal: ctl.signal
    });
    const data = await response.json();
    if (data && data.statusCode === 200 && data.data && data.data.current) {
      const currentBase = safeNumber(data.data.current.buy);
      if (currentBase !== null) {
        let previousBase = extractPreviousBase(data.data, currentBase);
        const updatedAt = resolveEntryTime(data.data.current) || new Date();
        const historySeries = prepareLmBaruHistorySeries(data.data, currentBase, LM_HISTORY_DAYS_LIMIT);
        const pair = findLmBaruSeriesPair(historySeries, currentBase);
        let previousPrice = null;
        if (pair.previous && typeof pair.previous.base === 'number') {
          previousBase = pair.previous.base;
          previousPrice = pair.previous.price;
        } else if (Number.isFinite(previousBase)) {
          previousPrice = computeLmBaruPrice(previousBase);
        }
        REI_LAST_BASE_P = currentBase;
        saveLastBasePrice(currentBase);
        if (Array.isArray(historySeries)) {
          resetRangeSeriesCache(historySeries);
          if (historySeries.length >= 2) {
            saveLastSparklineSeries(historySeries);
          }
        } else {
          resetRangeSeriesCache([]);
        }
        LM_BARU_PRICE_SERIES = LM_BARU_SERIES_BY_RANGE[LM_BARU_ACTIVE_RANGE].slice();
        const displayOptions = {
          updatedAt: updatedAt
        };
        if (Number.isFinite(previousBase)) displayOptions.previousBase = previousBase;
        if (Number.isFinite(previousPrice)) displayOptions.previousPrice = Math.round(previousPrice);
        displayFromBasePrice(currentBase, displayOptions);
        var sparklineOptions = {};
        if (!Array.isArray(historySeries) || historySeries.length < 2) {
          sparklineOptions.fallbackText = 'Riwayat harga belum tersedia dari penyedia data.';
        }
        setActiveSparklineRange(LM_BARU_ACTIVE_RANGE, sparklineOptions);
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
  var approxBase = (DEFAULT_PRICE_TABLE.lmBaru - PRICE_ADJUST_LM_IDR) / FACTOR_LM_BARU;
  REI_LAST_BASE_P = approxBase;
  var highlightCard = document.getElementById('lmBaruHighlight');
  if (highlightCard) highlightCard.setAttribute('aria-busy', 'false');
  resetRangeSeriesCache([]);
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
  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const day = days[date.getDay()];
  const dateNum = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}, ${dateNum} ${month} ${year} ${hours}:${minutes} WIB`;
}

function formatDateOnlyIndo(date) {
  if (!(date instanceof Date) || isNaN(date.getTime())) return '';
  var days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  var monthsShort = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  var dayLabel = days[date.getDay()] || '';
  var monthLabel = monthsShort[date.getMonth()] || '';
  if (!dayLabel || !monthLabel) return '';
  var dateNum = date.getDate();
  var year = date.getFullYear();
  return dayLabel + ', ' + dateNum + ' ' + monthLabel + ' ' + year;
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
setupSharePriceButton();

function shouldFetchGoldPrice() {
  return !!(document.getElementById('goldPriceTable') || document.getElementById('lmBaruCurrent'));
}

function shouldFetchGlobalGoldPrice() {
  return !!(document.getElementById('globalGoldPriceCard') || document.getElementById('globalGoldPriceTable'));
}
setupHighlightRangeControls();
if (shouldFetchGoldPrice()) {
  fetchGoldPrice();
}
if (shouldFetchGlobalGoldPrice()) {
  fetchGlobalGoldSpot();
}

window.addEventListener('resize', function() {
  if (!LM_BARU_SPARKLINE_META || !LM_BARU_SPARKLINE_META.hasSeries) return;
  if (!Array.isArray(LM_BARU_PRICE_SERIES) || LM_BARU_PRICE_SERIES.length < 2) return;
  if (LM_BARU_SPARKLINE_RESIZE_FRAME) {
    cancelAnimationFrame(LM_BARU_SPARKLINE_RESIZE_FRAME);
  }
  LM_BARU_SPARKLINE_RESIZE_FRAME = requestAnimationFrame(function() {
    LM_BARU_SPARKLINE_RESIZE_FRAME = null;
    updateLmBaruSparkline(LM_BARU_PRICE_SERIES, getSparklineReuseOptions());
  });
}, {
  passive: true
});

// Modal detail kadar emas dari tabel harga
/* istanbul ignore next */
(function() {
  var table = document.getElementById('goldPriceTable');
  var modal = document.getElementById('goldInfoModal');
  if (!table || !modal) return;

  var titleEl = modal.querySelector('[data-modal-title]');
  var metaEl = modal.querySelector('[data-modal-meta]');
  var descEl = modal.querySelector('[data-modal-desc]');
  var tipsEl = modal.querySelector('[data-modal-tips]');
  var tipsWrap = modal.querySelector('[data-modal-tips-wrap]');
  var closeBtn = modal.querySelector('[data-modal-close]');
  var dialog = modal.querySelector('[data-modal-dialog]');
  var lastFocusEl = null;

  if (dialog && !dialog.hasAttribute('tabindex')) {
    dialog.setAttribute('tabindex', '-1');
  }

  function resolveInfo(key) {
    return GOLD_INFO_CONTENT[key] || GOLD_INFO_CONTENT[key?.toLowerCase?.()] || GOLD_INFO_CONTENT.default;
  }

  function renderContent(data) {
    if (!data) return;
    if (titleEl) titleEl.textContent = data.title || 'Detail Kadar Emas';
    if (metaEl) {
      metaEl.textContent = data.meta || '';
      metaEl.style.display = data.meta ? '' : 'none';
    }
    if (descEl) {
      descEl.textContent = data.description || '';
      descEl.style.display = data.description ? '' : 'none';
    }
    if (tipsEl) {
      tipsEl.innerHTML = '';
      var tips = Array.isArray(data.tips) ? data.tips : [];
      tips.forEach(function(tip) {
        var li = document.createElement('li');
        li.textContent = tip;
        tipsEl.appendChild(li);
      });
      if (tipsWrap) {
        tipsWrap.style.display = tips.length ? '' : 'none';
      }
    }
  }

  function getFocusable() {
    return Array.prototype.slice.call(modal.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])'));
  }

  function trapFocus(ev) {
    if (ev.key !== 'Tab') return;
    var focusable = getFocusable();
    if (!focusable.length) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (ev.shiftKey && document.activeElement === first) {
      ev.preventDefault();
      last.focus();
    } else if (!ev.shiftKey && document.activeElement === last) {
      ev.preventDefault();
      first.focus();
    }
  }

  function openModal(key, trigger) {
    var content = resolveInfo(key);
    if (!content) return;
    lastFocusEl = trigger || null;
    renderContent(content);
    modal.hidden = false;
    modal.classList.add('is-visible');
    document.body.classList.add('modal-open');
    var focusTarget = closeBtn || dialog;
    if (focusTarget && typeof focusTarget.focus === 'function') {
      focusTarget.focus();
    }
  }

  function closeModal() {
    if (modal.classList.contains('is-visible')) {
      modal.classList.remove('is-visible');
      modal.hidden = true;
      document.body.classList.remove('modal-open');
      if (lastFocusEl && typeof lastFocusEl.focus === 'function') {
        requestAnimationFrame(function() {
          lastFocusEl.focus();
        });
      }
    }
  }

  table.addEventListener('click', function(ev) {
    var addBtn = ev.target.closest('button[data-add-cat]');
    if (addBtn) {
      ev.preventDefault();
      ev.stopPropagation();
      triggerCalculatorSelection(addBtn);
      return;
    }
    var row = ev.target.closest('tr[data-info-key]');
    if (!row) return;
    ev.preventDefault();
    openModal(row.getAttribute('data-info-key'), row);
  });

  table.addEventListener('keydown', function(ev) {
    if (ev.key !== 'Enter' && ev.key !== ' ' && ev.key !== 'Spacebar') return;
    if (ev.target.closest('button')) return;
    var row = ev.target.closest('tr[data-info-key]');
    if (!row) return;
    ev.preventDefault();
    openModal(row.getAttribute('data-info-key'), row);
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', function() {
      closeModal();
    });
  }

  modal.addEventListener('click', function(ev) {
    if (ev.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', function(ev) {
    if (ev.key === 'Escape') {
      closeModal();
    }
  });

  modal.addEventListener('keydown', trapFocus);
  if (dialog) {
    dialog.addEventListener('click', function(ev) {
      ev.stopPropagation();
    });
  }
})();

// Kalkulator Emas + WA Prefill
/* istanbul ignore next */
(function() {
  var cat = document.getElementById('cal-cat');
  var kadar = document.getElementById('cal-kadar');
  var berat = document.getElementById('cal-berat');
  var current = document.getElementById('cal-current');
  var total = document.getElementById('cal-total');
  var count = document.getElementById('cal-count');
  var addBtn = document.getElementById('cal-add');
  var itemsBody = document.getElementById('cal-items-body');
  var emptyState = document.getElementById('cal-empty');
  var tableWrap = document.getElementById('cal-table-wrap');
  var wa = document.getElementById('wa-prefill');
  if (!cat || !kadar || !berat || !total || !wa) return;

  var items = [];
  var lastPreview = null;
  var idCounter = 1;

  function ceilStep(n, step) {
    step = step || 1000;
    return Math.ceil(n / step) * step;
  }

  function formatIDR(n) {
    try {
      return n.toLocaleString('id-ID');
    } catch (_) {
      return String(n);
    }
  }

  function formatWeight(value) {
    var num = Number(value);
    if (!Number.isFinite(num)) return '0';
    try {
      return num.toLocaleString('id-ID', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      });
    } catch (_) {
      return String(num);
    }
  }

  function formatWeightInput(value) {
    var num = Number(value);
    if (!Number.isFinite(num)) return '0';
    var clamped = Math.max(0, num);
    var rounded = Math.round(clamped * 100) / 100;
    return String(rounded);
  }

  function purityFromK(k) {
    return Math.max(0, Math.min(1, Number(k || 24) / 24));
  }

  function labelCat(c) {
    switch (c) {
      case 'lm_baru':
        return 'Logam Mulia (LM) Baru';
      case 'lm_lama':
        return 'Logam Mulia (LM) Lama';
      case 'perhiasan_24':
        return 'Perhiasan 24K';
      default:
        return 'Perhiasan <24K';
    }
  }

  function calculateValues(catValue, kadarValue, beratValue) {
    var base = REI_LAST_BASE_P || (readLastBasePrice()?.p) || 1200000;
    var c = catValue || 'perhiasan_sub';
    var k = Number(kadarValue || 24);
    var g = Math.max(0, Number(beratValue || 0));
    g = Math.round(g * 100) / 100;
    var FACTOR_LM_BARU = 0.932;
    var FACTOR_LM_LAMA = 0.917;
    var FACTOR_24K = 0.862;
    var FACTOR_SUB = 0.786;
    var ADJ_LM = PRICE_ADJUST_LM_IDR;
    var ADJ_PERHIASAN = PRICE_ADJUST_IDR;
    var perGram;
    if (c === 'lm_baru') {
      perGram = ceilStep(base * FACTOR_LM_BARU + ADJ_LM);
      k = 24;
    } else if (c === 'lm_lama') {
      perGram = ceilStep(base * FACTOR_LM_LAMA + ADJ_LM);
      k = 24;
    } else if (c === 'perhiasan_24') {
      perGram = ceilStep(base * FACTOR_24K + ADJ_LM);
      k = 24;
    } else {
      perGram = ceilStep(base * FACTOR_SUB * purityFromK(k) + ADJ_PERHIASAN);
    }
    var est = g > 0 ? ceilStep(perGram * g, 1000) : 0;
    return {
      cat: c,
      kadar: k,
      berat: g,
      estimasi: est
    };
  }

  function updateWaLink() {
    if (!wa) return;
    var baseUrl = 'https://wa.me/6285591088503?text=';
    var message;
    if (items.length) {
      var totalValue = items.reduce(function(sum, item) {
        return sum + (item.estimasi || 0);
      }, 0);
      var lines = items.map(function(item, index) {
        return (index + 1) + '. ' + labelCat(item.cat) + ' • ' + item.kadar + 'K • ' + formatWeight(item.berat) + ' gram • Estimasi: Rp ' + formatIDR(item.estimasi || 0);
      });
      var parts = ['Halo Sentral Emas,', '', 'Saya ingin konsultasi buyback. Berikut daftar barang:']
        .concat(lines, ['', 'Total estimasi: Rp ' + formatIDR(totalValue), '', 'Mohon info lebih lanjut, terima kasih.']);
      message = parts.join('\n');
    } else if (lastPreview) {
      message = [
        'Halo Sentral Emas,',
        '',
        'Saya ingin konsultasi buyback:',
        '- Kategori: ' + labelCat(lastPreview.cat),
        '- Kadar: ' + lastPreview.kadar + 'K',
        '- Berat: ' + formatWeight(lastPreview.berat) + ' gram',
        '- Estimasi: Rp ' + formatIDR(lastPreview.estimasi),
        '',
        'Mohon info lebih lanjut, terima kasih.'
      ].join('\n');
    } else {
      message = [
        'Halo Sentral Emas,',
        '',
        'Saya ingin konsultasi buyback. Mohon info lebih lanjut, terima kasih.'
      ].join('\n');
    }
    wa.href = baseUrl + encodeURIComponent(message);
  }

  function refreshList() {
    var totalValue = 0;
    if (itemsBody) {
      itemsBody.innerHTML = '';
    }
    items.forEach(function(item) {
      var computed = calculateValues(item.cat, item.kadar, item.berat);
      item.kadar = computed.kadar;
      item.berat = computed.berat;
      item.estimasi = computed.estimasi;
      totalValue += item.estimasi;
      if (!itemsBody) return;
      var row = document.createElement('tr');
      row.setAttribute('data-item-id', String(item.id));

      var mainCell = document.createElement('td');
      var name = document.createElement('div');
      name.className = 'calc-item-name';
      name.textContent = labelCat(item.cat);
      var meta = document.createElement('div');
      meta.className = 'calc-item-meta';
      meta.textContent = 'Kadar ' + item.kadar + 'K';
      mainCell.appendChild(name);
      mainCell.appendChild(meta);

      var weightCell = document.createElement('td');
      var weightField = document.createElement('div');
      weightField.className = 'calc-weight-field';
      var weightInput = document.createElement('input');
      weightInput.type = 'number';
      weightInput.min = '0';
      weightInput.step = '0.01';
      weightInput.inputMode = 'decimal';
      weightInput.value = formatWeightInput(item.berat);
      weightInput.setAttribute('data-edit-id', String(item.id));
      weightInput.setAttribute('aria-label', 'Ubah berat ' + labelCat(item.cat) + ' dalam gram');
      var weightSuffix = document.createElement('span');
      weightSuffix.className = 'calc-weight-suffix';
      weightSuffix.textContent = 'g';
      weightField.appendChild(weightInput);
      weightField.appendChild(weightSuffix);
      weightCell.appendChild(weightField);

      var estimateCell = document.createElement('td');
      estimateCell.textContent = 'Rp ' + formatIDR(item.estimasi);

      var actionCell = document.createElement('td');
      var removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'calc-remove';
      removeBtn.setAttribute('data-remove-id', String(item.id));
      removeBtn.setAttribute('aria-label', 'Hapus ' + labelCat(item.cat));
      removeBtn.textContent = 'Hapus';
      actionCell.appendChild(removeBtn);

      row.appendChild(mainCell);
      row.appendChild(weightCell);
      row.appendChild(estimateCell);
      row.appendChild(actionCell);

      itemsBody.appendChild(row);
    });
    if (emptyState) {
      emptyState.hidden = items.length > 0;
    }
    if (tableWrap) {
      tableWrap.hidden = items.length === 0;
    }
    if (total) {
      total.textContent = 'Rp ' + formatIDR(totalValue);
    }
    if (count) {
      count.textContent = items.length ? items.length + ' barang' : '0 barang';
    }
    updateWaLink();
  }

  function updatePreview() {
    var computed = calculateValues(cat.value, kadar.value, berat.value);
    if (current) {
      current.textContent = 'Rp ' + formatIDR(computed.estimasi);
    }
    if (computed.berat > 0 && computed.estimasi > 0) {
      lastPreview = {
        cat: cat.value,
        kadar: computed.kadar,
        berat: computed.berat,
        estimasi: computed.estimasi
      };
    } else {
      lastPreview = null;
    }
    if (!items.length) {
      updateWaLink();
    }
  }

  function addItem(catValue, kadarValue, beratValue) {
    var computed = calculateValues(catValue, kadarValue, beratValue);
    if (computed.berat <= 0 || computed.estimasi <= 0) {
      return false;
    }
    items.push({
      id: idCounter++,
      cat: computed.cat,
      kadar: computed.kadar,
      berat: computed.berat,
      estimasi: computed.estimasi
    });
    refreshList();
    return true;
  }

  function removeItem(id) {
    var index = items.findIndex(function(item) {
      return item.id === id;
    });
    if (index === -1) return;
    items.splice(index, 1);
    refreshList();
    if (!items.length) {
      updatePreview();
    }
  }

  function updateItemWeight(id, nextWeight, options) {
    var item = items.find(function(entry) {
      return entry.id === id;
    });
    if (!item) return;
    var numeric = Number(nextWeight);
    if (!Number.isFinite(numeric)) return;
    var sanitized = Math.max(0, numeric);
    sanitized = Math.round(sanitized * 100) / 100;
    var changed = item.berat !== sanitized;
    item.berat = sanitized;
    var restoreFocus = options && options.restoreFocus;
    var selectionStart = null;
    var selectionEnd = null;
    if (restoreFocus && options && options.source && typeof options.source.selectionStart === 'number') {
      selectionStart = options.source.selectionStart;
      selectionEnd = options.source.selectionEnd;
    }
    if (!changed && !restoreFocus && !(options && options.forceRefresh)) {
      updateWaLink();
      return;
    }
    refreshList();
    if (restoreFocus) {
      var focusInput = itemsBody && itemsBody.querySelector('input[data-edit-id="' + id + '"]');
      if (focusInput) {
        focusInput.focus();
        var len = focusInput.value.length;
        if (selectionStart !== null && selectionEnd !== null) {
          var safeStart = Math.min(selectionStart, len);
          var safeEnd = Math.min(selectionEnd, len);
          try {
            focusInput.setSelectionRange(safeStart, safeEnd);
          } catch (_) {
            try {
              focusInput.setSelectionRange(len, len);
            } catch (__) {}
          }
        } else {
          try {
            focusInput.setSelectionRange(len, len);
          } catch (_) {}
        }
      }
    }
  }

  function toggleKadar() {
    var disable = (cat.value === 'lm_baru' || cat.value === 'lm_lama' || cat.value === 'perhiasan_24');
    kadar.disabled = disable;
    if (disable) {
      kadar.value = '24';
    }
  }

  ['input', 'change'].forEach(function(ev) {
    berat.addEventListener(ev, updatePreview);
    kadar.addEventListener(ev, updatePreview);
  });
  cat.addEventListener('change', function() {
    toggleKadar();
    updatePreview();
  });
  cat.addEventListener('input', function() {
    toggleKadar();
    updatePreview();
  });

  if (addBtn) {
    addBtn.addEventListener('click', function() {
      if (!addItem(cat.value, kadar.value, berat.value) && berat) {
        berat.focus();
      }
      updatePreview();
    });
  }

  if (itemsBody) {
    itemsBody.addEventListener('click', function(ev) {
      var btn = ev.target.closest('button[data-remove-id]');
      if (!btn) return;
      var id = Number(btn.getAttribute('data-remove-id'));
      removeItem(id);
    });
    itemsBody.addEventListener('input', function(ev) {
      var field = ev.target.closest('input[data-edit-id]');
      if (!field) return;
      var raw = field.value;
      if (raw === '' || raw === '-' || raw.endsWith('.')) return;
      var id = Number(field.getAttribute('data-edit-id'));
      if (!Number.isFinite(id)) return;
      updateItemWeight(id, raw, {
        restoreFocus: true,
        source: field
      });
    });
    itemsBody.addEventListener('change', function(ev) {
      var field = ev.target.closest('input[data-edit-id]');
      if (!field) return;
      var id = Number(field.getAttribute('data-edit-id'));
      if (!Number.isFinite(id)) return;
      var raw = field.value === '' ? '0' : field.value;
      updateItemWeight(id, raw, {
        forceRefresh: true
      });
    });
    itemsBody.addEventListener('keydown', function(ev) {
      if (ev.key !== 'Enter') return;
      var field = ev.target.closest('input[data-edit-id]');
      if (!field) return;
      ev.preventDefault();
      var id = Number(field.getAttribute('data-edit-id'));
      if (!Number.isFinite(id)) return;
      var raw = field.value === '' ? '0' : field.value;
      updateItemWeight(id, raw, {
        forceRefresh: true
      });
      field.blur();
    });
  }

  document.addEventListener('prices:updated', function() {
    refreshList();
    if (!items.length) {
      updatePreview();
    }
  });

  toggleKadar();
  refreshList();
  updatePreview();

  function setSelection(options) {
    if (!options) return;
    var previousState = {
      cat: cat.value,
      kadar: kadar.value,
      berat: berat.value,
      kadarDisabled: !!kadar.disabled
    };
    if (options.cat) {
      var desired = String(options.cat);
      var hasOption = Array.prototype.some.call(cat.options, function(opt) {
        return opt.value === desired;
      });
      if (hasOption) {
        cat.value = desired;
      }
      toggleKadar();
    }
    if (options.kadar !== undefined && options.kadar !== null) {
      var val = String(options.kadar);
      var hasKadar = Array.prototype.some.call(kadar.options, function(opt) {
        return opt.value === val;
      });
      if (hasKadar || kadar.disabled) {
        kadar.value = val;
      }
    }
    if (options.berat !== undefined && options.berat !== null) {
      berat.value = String(options.berat);
    }
    updatePreview();
    var shouldAdd = options.addToList !== false;
    if (shouldAdd) {
      var weightValue = (options.berat !== undefined && options.berat !== null) ? options.berat : berat.value;
      addItem(cat.value, kadar.value, weightValue);
    }
    if (options.restoreForm !== false) {
      var needsRestore = previousState.cat !== cat.value || previousState.kadar !== kadar.value || previousState.berat !== berat.value || previousState.kadarDisabled !== !!kadar.disabled;
      if (needsRestore) {
        cat.value = previousState.cat;
        toggleKadar();
        if (previousState.kadar !== undefined && previousState.kadar !== null) {
          kadar.value = previousState.kadar;
        }
        if (previousState.berat !== undefined && previousState.berat !== null) {
          berat.value = previousState.berat;
        }
        if (previousState.kadarDisabled) {
          kadar.disabled = true;
        }
        updatePreview();
      }
    }
    if (options.skipScroll) return;
    var section = document.getElementById('kalkulator');
    if (section) {
      section.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  if (typeof window !== 'undefined') {
    window.testing = window.testing || {};
    window.testing.updateWaLink = updateWaLink;
    Object.defineProperty(window.testing, 'lastPreview', {
      configurable: true,
      get: function() {
        return lastPreview;
      },
      set: function(value) {
        lastPreview = value;
        if (!items.length) {
          updateWaLink();
        }
      }
    });
  }

  window.REI_CALC = window.REI_CALC || {};
  window.REI_CALC.setSelection = setSelection;
})();

// Konverter satuan emas
/* istanbul ignore next */
(function() {
  var fromValue = document.getElementById('conv-from-value');
  var toValue = document.getElementById('conv-to-value');
  var fromUnit = document.getElementById('conv-from-unit');
  var toUnit = document.getElementById('conv-to-unit');
  var swapBtn = document.getElementById('conv-swap');
  if (!fromValue || !toValue || !fromUnit || !toUnit) return;

  var updating = false;

  function populate(select) {
    select.innerHTML = '';
    GOLD_UNIT_DEFS.forEach(function(unit) {
      var opt = document.createElement('option');
      opt.value = unit.id;
      opt.textContent = unit.label;
      select.appendChild(opt);
    });
  }

  function unitById(id) {
    return GOLD_UNIT_DEFS.find(function(u) {
      return u.id === id;
    }) || GOLD_UNIT_DEFS[0];
  }

  function sanitize(value) {
    var num = Number(value);
    return Number.isFinite(num) ? num : 0;
  }

  function format(number) {
    if (!Number.isFinite(number)) return '0';
    var abs = Math.abs(number);
    var decimals = abs >= 100 ? 2 : abs >= 1 ? 3 : 5;
    var fixed = number.toFixed(decimals);
    var trimmedNum = Number(fixed);
    if (Number.isFinite(trimmedNum)) {
      var str = trimmedNum.toString();
      if (str.indexOf('e') >= 0) return fixed.replace(/\.?0+$/, '');
      return str;
    }
    return fixed.replace(/(\.\d*?)0+$/, '$1').replace(/\.0+$/, '');
  }

  function convertFrom() {
    if (updating) return;
    updating = true;
    var amount = sanitize(fromValue.value);
    var from = unitById(fromUnit.value);
    var to = unitById(toUnit.value);
    var grams = amount * from.toGram;
    var converted = grams / to.toGram;
    toValue.value = format(converted);
    updating = false;
  }

  function convertTo() {
    if (updating) return;
    updating = true;
    var amount = sanitize(toValue.value);
    var from = unitById(fromUnit.value);
    var to = unitById(toUnit.value);
    var grams = amount * to.toGram;
    var converted = grams / from.toGram;
    fromValue.value = format(converted);
    updating = false;
  }

  function swap() {
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
  if (swapBtn) {
    swapBtn.addEventListener('click', function() {
      swap();
    });
  }
})();

// Tahun pada footer + 404 helpers
/* istanbul ignore next */
(function() {
  var nowY = new Date().getFullYear().toString();
  var yrEl = document.getElementById('yr');
  if (yrEl) {
    yrEl.textContent = nowY;
  }
  var yEl = document.getElementById('y');
  if (yEl) {
    yEl.textContent = nowY;
  }
  var p = document.getElementById('path');
  if (p) {
    p.textContent = (location.pathname + location.search) || '/';
  }
})();

// Tracking klik CTA (WA/telepon)
/* istanbul ignore next */
(function() {
  const ENABLE_BEACON = false;

  function track(evt, label) {
    try {
      var v = (typeof window.REI_AB_VARIANT === 'string') ? ('|' + window.REI_AB_VARIANT) : '';
      var full = label + v;
      if (window.gtag) {
        window.gtag('event', evt, {
          'event_label': full
        });
      } else if (window.dataLayer) {
        window.dataLayer.push({
          'event': evt,
          'label': full
        });
      } else {
        console.log('[track]', evt, label);
      }
    } catch (e) {}
  }
  document.querySelectorAll('[data-track]').forEach(function(el) {
    el.addEventListener('click', function() {
      var label = el.getAttribute('data-track');
      track('cta_click', label);
      if (label && label.indexOf('wa-') === 0 && 'serviceWorker' in navigator) {
        try {
          navigator.serviceWorker.ready.then(function(reg) {
            var tag = 'wa-click:' + label + ':' + Date.now();
            if ('sync' in reg) {
              reg.sync.register(tag).catch( /* istanbul ignore next */ function() {});
            }
            /* istanbul ignore next */
            if (ENABLE_BEACON && navigator.sendBeacon) {
              try {
                navigator.sendBeacon('/track', new Blob([JSON.stringify({
                  e: 'wa',
                  label: label,
                  t: Date.now()
                })], {
                  type: 'application/json'
                }));
              } catch (e) {}
            }
          });
        } catch (e) {}
      }
    });
  });
})();

/* istanbul ignore next */
(function() {
  var searchSection = document.getElementById('searchResults');
  var body = document.body || document.documentElement;
  var docEl = document.documentElement;
  var resultsList = searchSection ? searchSection.querySelector('[data-search-results]') : null;
  var summary = searchSection ? searchSection.querySelector('[data-search-summary]') : null;
  var emptyState = searchSection ? searchSection.querySelector('[data-search-empty]') : null;
  var emptyQueryEl = searchSection ? searchSection.querySelector('[data-search-empty-query]') : null;
  var resetLink = searchSection ? searchSection.querySelector('[data-search-reset]') : null;
  var suggestionsWrap = searchSection ? searchSection.querySelector('[data-search-suggestions]') : null;
  var suggestionButtons = suggestionsWrap ? Array.prototype.slice.call(suggestionsWrap.querySelectorAll('[data-search-suggestion]')) : [];
  var headerSearch = document.querySelector('[data-header-search]');
  var headerToggle = headerSearch ? headerSearch.querySelector('[data-search-toggle]') : null;
  var toggleOpenLabel = headerToggle ? (headerToggle.getAttribute('aria-label') || 'Buka pencarian') : 'Buka pencarian';
  var toggleCloseLabel = headerToggle ? (headerToggle.getAttribute('data-close-label') || 'Tutup pencarian') : 'Tutup pencarian';
  var headerForm = headerSearch ? headerSearch.querySelector('[data-search-form]') : null;
  var headerInput = headerSearch ? headerSearch.querySelector('[data-search-input]') : null;
  var searchSectionForm = searchSection ? searchSection.querySelector('[data-search-form]') : null;
  var mobileMedia = null;
  try {
    if (window.matchMedia) {
      mobileMedia = window.matchMedia('(max-width: 720px)');
    }
  } catch (e) {}
  var mobileBackdrop = null;
  var forms = Array.prototype.slice.call(document.querySelectorAll('[data-search-form]'));
  var inputs = Array.prototype.slice.call(document.querySelectorAll('[data-search-input]'));

  function addSearchActiveClass() {
    if (body && body.classList) {
      body.classList.add('search-active');
    }
    if (docEl && docEl.classList) {
      docEl.classList.add('search-active');
    }
  }

  function removeSearchActiveClass() {
    if (body && body.classList) {
      body.classList.remove('search-active');
    }
    if (docEl && docEl.classList) {
      docEl.classList.remove('search-active');
    }
  }

  if (headerToggle) {
    headerToggle.addEventListener('click', function() {
      if (isHeaderSearchOpen()) {
        closeHeaderSearch();
      } else {
        openHeaderSearch();
      }
    });
  }

  if (mobileMedia) {
    var handleMediaChange = function(ev) {
      if (ev && ev.matches === false) {
        closeHeaderSearch();
      }
    };
    if (typeof mobileMedia.addEventListener === 'function') {
      mobileMedia.addEventListener('change', handleMediaChange);
    } else if (typeof mobileMedia.addListener === 'function') {
      mobileMedia.addListener(handleMediaChange);
    }
  }

  if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
    window.addEventListener('resize', function() {
      if (!isMobile()) {
        closeHeaderSearch();
      }
    }, {
      passive: true
    });
  }

  if (typeof document !== 'undefined' && typeof document.addEventListener === 'function') {
    document.addEventListener('keydown', function(ev) {
      if (!ev) return;
      var key = ev.key || ev.keyCode;
      if ((key === 'Escape' || key === 'Esc' || key === 27) && isHeaderSearchOpen()) {
        closeHeaderSearch();
        if (headerToggle && typeof headerToggle.focus === 'function') {
          try {
            headerToggle.focus();
          } catch (_) {}
        }
      }
    });
  }

  var hasSearchParam = false;
  var rawQuery = '';

  try {
    var params = new URLSearchParams(window.location.search || '');
    if (params.has('s')) {
      hasSearchParam = true;
      rawQuery = params.get('s') || '';
    }
  } catch (e) {
    if (window.location.search && window.location.search.indexOf('s=') !== -1) {
      hasSearchParam = true;
      rawQuery = window.location.search.split('s=')[1] || '';
    }
  }

  rawQuery = (rawQuery || '').replace(/\+/g, ' ').trim();

  inputs.forEach(function(input) {
    if (!input) return;
    input.value = rawQuery;
  });

  if (!hasSearchParam) {
    if (searchSection) {
      searchSection.hidden = true;
    }
    removeSearchActiveClass();
    if (resetLink) {
      resetLink.hidden = true;
    }
  } else {
    if (searchSection) {
      searchSection.hidden = false;
    }

    if (rawQuery) {
      addSearchActiveClass();
      if (resetLink) {
        resetLink.hidden = false;
      }
      renderResults(rawQuery);
      updatePageTitle(rawQuery);
      if (searchSection && typeof searchSection.focus === 'function') {
        try {
          searchSection.focus();
        } catch (_) {}
      }
    } else {
      removeSearchActiveClass();
      if (resetLink) {
        resetLink.hidden = true;
      }
      updateSummary('Masukkan kata kunci pencarian untuk melihat hasil.');
      if (emptyState) {
        emptyState.hidden = true;
      }
    }
  }

  forms.forEach(function(form) {
    if (!form) return;
    form.addEventListener('submit', function(ev) {
      var input = form.querySelector('[data-search-input]');
      if (!input) return;
      var value = (input.value || '').trim();
      if (!value) {
        ev.preventDefault();
        updateSummary('Masukkan kata kunci pencarian untuk melihat hasil.');
        if (emptyState) {
          emptyState.hidden = true;
        }
        input.focus();
      } else if (form === headerForm) {
        closeHeaderSearch();
      }
    });
  });

  suggestionButtons.forEach(function(button) {
    button.addEventListener('click', function() {
      var value = button.getAttribute('data-search-suggestion') || '';
      if (!value) return;
      inputs.forEach(function(input) {
        if (input) {
          input.value = value;
        }
      });
      var primary = searchSectionForm || forms[0];
      closeHeaderSearch();
      if (primary) {
        if (typeof primary.requestSubmit === 'function') {
          primary.requestSubmit();
        } else {
          primary.submit();
        }
      } else {
        var url = new URL(window.location.href);
        url.search = '?s=' + encodeURIComponent(value);
        window.location.assign(url.toString());
      }
    });
  });

  function ensureBackdrop() {
    if (mobileBackdrop || !document || !document.body) return;
    mobileBackdrop = document.createElement('div');
    mobileBackdrop.className = 'site-search-backdrop';
    mobileBackdrop.setAttribute('data-search-backdrop', '');
    mobileBackdrop.addEventListener('click', closeHeaderSearch);
    document.body.appendChild(mobileBackdrop);
  }

  function focusHeaderInput() {
    if (!headerInput) return;
    var attempt = 0;
    var maxAttempts = 3;
    var delays = [0, 60, 120];

    function tryFocus() {
      attempt++;
      try {
        if (typeof headerInput.focus === 'function') {
          if (attempt === 1) {
            try {
              headerInput.focus({
                preventScroll: true
              });
            } catch (_) {
              headerInput.focus();
            }
          } else {
            headerInput.focus();
          }
        }
        if (typeof headerInput.select === 'function') {
          headerInput.select();
        }
      } catch (e) {}
      if ((typeof document !== 'undefined' && document.activeElement !== headerInput) && attempt < maxAttempts) {
        setTimeout(tryFocus, delays[attempt] || 0);
      }
    }
    tryFocus();
  }

  function openHeaderSearch() {
    if (!headerSearch) return;
    if (headerSearch.classList) {
      headerSearch.classList.add('header-search--expanded');
    }
    if (headerToggle) {
      headerToggle.setAttribute('aria-expanded', 'true');
      headerToggle.setAttribute('aria-label', toggleCloseLabel);
    }
    if (isMobile()) {
      ensureBackdrop();
      if (mobileBackdrop) {
        mobileBackdrop.classList.add('is-visible');
      }
      if (body && body.classList) {
        body.classList.add('has-mobile-search');
      }
    }
    focusHeaderInput();
  }

  function closeHeaderSearch() {
    if (!headerSearch) return;
    if (headerSearch.classList) {
      headerSearch.classList.remove('header-search--expanded');
    }
    if (headerToggle) {
      headerToggle.setAttribute('aria-expanded', 'false');
      headerToggle.setAttribute('aria-label', toggleOpenLabel);
    }
    if (mobileBackdrop) {
      mobileBackdrop.classList.remove('is-visible');
    }
    if (body && body.classList) {
      body.classList.remove('has-mobile-search');
    }
  }

  function isMobile() {
    if (mobileMedia && typeof mobileMedia.matches === 'boolean') {
      return mobileMedia.matches;
    }
    if (typeof window !== 'undefined' && typeof window.innerWidth === 'number') {
      return window.innerWidth <= 720;
    }
    return false;
  }

  function isHeaderSearchOpen() {
    return !!(headerSearch && headerSearch.classList && headerSearch.classList.contains('header-search--expanded'));
  }

  function updateSummary(text) {
    if (summary) {
      summary.textContent = text;
    }
  }

  function renderResults(query) {
    if (!resultsList) return;
    var normalizedQuery = normalizeSearchText(query);
    var tokens = normalizedQuery.split(/\s+/).filter(Boolean);
    var highlightTokens = query.split(/\s+/).filter(Boolean);
    var matches = [];

    if (tokens.length) {
      SEARCH_INDEX.forEach(function(entry) {
        if (!entry || !entry.normalized) return;
        var matchesAll = tokens.every(function(token) {
          return entry.normalized.indexOf(token) !== -1;
        });
        if (!matchesAll) return;
        var score = computeScore(entry, tokens, normalizedQuery);
        matches.push({
          entry: entry,
          score: score
        });
      });
    }

    matches.sort(function(a, b) {
      if (b.score !== a.score) return b.score - a.score;
      var priorityDiff = (b.entry.priority || 0) - (a.entry.priority || 0);
      if (priorityDiff) return priorityDiff;
      var dateA = a.entry.date ? Date.parse(a.entry.date) : 0;
      var dateB = b.entry.date ? Date.parse(b.entry.date) : 0;
      if (dateB !== dateA) return dateB - dateA;
      return a.entry.title.localeCompare(b.entry.title, 'id');
    });

    resultsList.innerHTML = '';

    if (!matches.length) {
      updateSummary('Tidak ada hasil untuk "' + query + '".');
      if (emptyState) {
        emptyState.hidden = false;
      }
      if (emptyQueryEl) {
        emptyQueryEl.textContent = query;
      }
      return;
    }

    var frag = document.createDocumentFragment();
    matches.forEach(function(match) {
      var entry = match.entry;
      var item = document.createElement('li');
      item.className = 'search-result card';

      var link = document.createElement('a');
      link.className = 'search-result__link';
      link.href = entry.url;

      var metaText = buildMeta(entry);
      if (metaText) {
        var meta = document.createElement('p');
        meta.className = 'search-result__meta';
        meta.textContent = metaText;
        link.appendChild(meta);
      }

      var title = document.createElement('h2');
      title.className = 'search-result__title';
      title.innerHTML = highlightText(entry.title, highlightTokens);
      link.appendChild(title);

      var excerptSource = entry.excerpt || entry.description || entry.content;
      if (excerptSource) {
        var excerpt = document.createElement('p');
        excerpt.className = 'search-result__excerpt';
        excerpt.innerHTML = highlightText(excerptSource, highlightTokens);
        link.appendChild(excerpt);
      }

      item.appendChild(link);
      frag.appendChild(item);
    });

    resultsList.appendChild(frag);
    updateSummary('Menampilkan ' + matches.length + ' hasil untuk "' + query + '".');
    if (emptyState) {
      emptyState.hidden = true;
    }
    if (emptyQueryEl) {
      emptyQueryEl.textContent = query;
    }
  }

  function computeScore(entry, tokens, fullQuery) {
    var score = entry.priority || 0;
    tokens.forEach(function(token) {
      if (entry.normalizedTitle && entry.normalizedTitle.indexOf(token) !== -1) score += 10;
      if (entry.normalizedKeywords && entry.normalizedKeywords.indexOf(token) !== -1) score += 6;
      if (entry.normalizedDescription && entry.normalizedDescription.indexOf(token) !== -1) score += 4;
      if (entry.normalizedContent && entry.normalizedContent.indexOf(token) !== -1) score += 2;
    });
    if (fullQuery && entry.normalizedTitle && entry.normalizedTitle.indexOf(fullQuery) !== -1) {
      score += 5;
    }
    return score;
  }

  function buildMeta(entry) {
    var parts = [];
    if (entry.category) parts.push(entry.category);
    if (entry.date) {
      var formatted = formatDate(entry.date);
      if (formatted) parts.push(formatted);
    }
    if (entry.readingTime) parts.push(entry.readingTime);
    return parts.join(' • ');
  }

  function highlightText(text, tokens) {
    if (!text) return '';
    var safe = escapeHtml(text);
    if (!tokens || !tokens.length) return safe;
    var escapedTokens = tokens.map(function(token) {
      return token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }).filter(Boolean);
    if (!escapedTokens.length) return safe;
    var pattern = new RegExp('(' + escapedTokens.join('|') + ')', 'gi');
    return safe.replace(pattern, '<mark>$1</mark>');
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function(ch) {
      switch (ch) {
        case '&':
          return '&amp;';
        case '<':
          return '&lt;';
        case '>':
          return '&gt;';
        case '"':
          return '&quot;';
        case "'":
          return '&#39;';
        default:
          return ch;
      }
    });
  }

  function formatDate(value) {
    if (!value) return '';
    var date = new Date(value);
    if (isNaN(date.getTime())) return '';
    if (typeof Intl !== 'undefined' && Intl.DateTimeFormat) {
      try {
        return new Intl.DateTimeFormat('id-ID', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        }).format(date);
      } catch (e) {}
    }
    var months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    var month = months[date.getMonth()] || '';
    var day = ('0' + date.getDate()).slice(-2);
    return month ? day + ' ' + month + ' ' + date.getFullYear() : '';
  }

  function updatePageTitle(query) {
    if (!query) return;
    try {
      var base = document.title || '';
      if (base.toLowerCase().indexOf('sentral emas') !== -1) {
        document.title = 'Cari "' + query + '" | Sentral Emas';
      }
    } catch (e) {}
  }
})();

// Service worker register
// SW register + Update Toast
/* istanbul ignore next */
if ('serviceWorker' in navigator) {
  var hadController = !!navigator.serviceWorker.controller;
  var isReloadingAfterUpdate = false;

  navigator.serviceWorker.addEventListener('controllerchange', function() {
    if (!hadController || isReloadingAfterUpdate) return;
    isReloadingAfterUpdate = true;
    window.location.reload();
  });

  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      })
      .then(function(reg) {
        if (!hadController) return;
        if (reg.waiting) {
          if (typeof reg.waiting.postMessage === 'function') {
            try {
              reg.waiting.postMessage({ type: 'SKIP_WAITING' });
            } catch (_) {}
          }
          if (!isReloadingAfterUpdate) {
            isReloadingAfterUpdate = true;
            window.location.reload();
          }
        }
        reg.addEventListener('updatefound', function() {
          var nw = reg.installing;
          if (nw) {
            nw.addEventListener('statechange', function() {
              if (nw.state === 'installed' && navigator.serviceWorker.controller) {
                if (typeof nw.postMessage === 'function') {
                  try {
                    nw.postMessage({ type: 'SKIP_WAITING' });
                  } catch (_) {}
                }
                if (!isReloadingAfterUpdate) {
                  isReloadingAfterUpdate = true;
                  window.location.reload();
                }
              }
            });
          }
        });
      })
      .catch(function(err) {
        console.warn('SW registration failed', err);
      });
  });
}

// Back to top button (remove inline handler)
/* istanbul ignore next */
(function() {
  var btn = document.getElementById('backToTop');
  if (!btn) return;
  btn.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // Toggle visibility based on scroll position
  var scrollThreshold = 200; // Show after scrolling 200px
  var lastVisible = null;
  var togglePending = false;
  var schedule = window.requestAnimationFrame ? function(cb) {
    return window.requestAnimationFrame(cb);
  } : function(cb) {
    return setTimeout(cb, 16);
  };

  function getScrollTop() {
    var scroller = document.scrollingElement || document.documentElement || document.body;
    if (scroller && typeof scroller.scrollTop === 'number') {
      return scroller.scrollTop;
    }
    return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
  }

  function applyToggle() {
    togglePending = false;
    var shouldShow = getScrollTop() > scrollThreshold;
    if (shouldShow !== lastVisible) {
      btn.classList.toggle('visible', shouldShow);
      lastVisible = shouldShow;
    }
  }

  function requestToggle() {
    if (togglePending) return;
    togglePending = true;
    schedule(applyToggle);
  }
  window.addEventListener('scroll', requestToggle, {
    passive: true
  });
  requestToggle(); // Check initial state
})();

// Nav aria-current
/* istanbul ignore next */
(function() {
  var links = Array.from(document.querySelectorAll('nav.menu a'));

  function apply() {
    var h = location.hash || '#home';
    links.forEach(function(a) {
      a.removeAttribute('aria-current');
    });
    var cur = links.find(function(a) {
      return a.getAttribute('href') === h;
    });
    if (cur) {
      cur.setAttribute('aria-current', 'page');
    }
  }
  window.addEventListener('hashchange', apply);
  apply();
})();

// Scroll reveal for sections
/* istanbul ignore next */
(function() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  function revealSections() {
    if (!document.body) return;
    document.body.classList.add('js-enabled');

    var sections = Array.prototype.slice.call(document.querySelectorAll('[data-scroll-section]'));
    if (!sections.length) return;

    if (!('IntersectionObserver' in window)) {
      sections.forEach(function(section) {
        section.classList.add('is-visible');
      });
      return;
    }

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        var target = entry.target;
        if (!target || !entry.isIntersecting) return;
        target.classList.add('is-visible');
        observer.unobserve(target);
      });
    }, {
      threshold: 0.2,
      rootMargin: '0px 0px -10% 0px'
    });

    sections.forEach(function(section) {
      if (!section.classList.contains('is-visible')) {
        observer.observe(section);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', revealSections, {
      once: true
    });
  } else {
    revealSections();
  }
})();

// PWA Install Prompt
/* istanbul ignore next */
(function() {
  let deferredPrompt;

  window.addEventListener('beforeinstallprompt', (e) => {
    const prompt = document.getElementById('pwaPrompt');
    if (!prompt) {
      return; // let browser handle prompt when custom UI is absent
    }
    e.preventDefault();
    deferredPrompt = e;
    prompt.hidden = false;
    prompt.setAttribute('data-state', 'install');
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

// Dark Mode Toggle
/* istanbul ignore next */
(function() {
  const THEME_KEY = 'sentral_emas_theme';
  const toggle = document.getElementById('darkModeToggle');

  if (!toggle) return;

  function applyTheme(theme) {
    let isDark;
    if (theme === 'auto') {
      isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    } else {
      isDark = theme === 'dark';
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    }
  }

  function updateToggleIcon(theme) {
    toggle.setAttribute('data-theme-mode', theme);
  }

  function cycleTheme() {
    const currentTheme = localStorage.getItem(THEME_KEY) || 'auto';
    let newTheme;
    if (currentTheme === 'light') {
      newTheme = 'dark';
    } else if (currentTheme === 'dark') {
      newTheme = 'auto';
    } else {
      newTheme = 'light';
    }
    localStorage.setItem(THEME_KEY, newTheme);
    applyTheme(newTheme);
    updateToggleIcon(newTheme);
  }

  // Initialize
  const savedTheme = localStorage.getItem(THEME_KEY) || 'auto';
  applyTheme(savedTheme);
  updateToggleIcon(savedTheme);

  // Event listeners
  toggle.addEventListener('click', cycleTheme);

  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function() {
      const currentTheme = localStorage.getItem(THEME_KEY) || 'auto';
      if (currentTheme === 'auto') {
        applyTheme('auto');
      }
    });
  }
})();

/* istanbul ignore next */
(function() {
  if (typeof window === 'undefined') return;

  var hasScheduled = false;

  function loadWebVitals() {
    if (hasScheduled) return;
    hasScheduled = true;

    if (document.querySelector('script[data-web-vitals]')) return;

    var script = document.createElement('script');
    script.type = 'module';
    script.src = '/assets/js/web-vitals.js';
    script.setAttribute('data-web-vitals', 'true');

    if ('fetchPriority' in script) {
      script.fetchPriority = 'low';
    } else {
      script.setAttribute('fetchpriority', 'low');
    }

    document.head.appendChild(script);
  }

  function scheduleLoad() {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(function() {
        loadWebVitals();
      });
    } else {
      setTimeout(loadWebVitals, 0);
    }
  }

  if (document.readyState === 'complete') {
    scheduleLoad();
  } else {
    window.addEventListener('load', scheduleLoad, {
      once: true
    });
  }
})();

if (typeof window !== 'undefined') {
  var testingApi = window.testing || (window.testing = {});
  testingApi.saveLastBasePrice = saveLastBasePrice;
  testingApi.readLastBasePrice = readLastBasePrice;
  testingApi.updatePriceSchema = updatePriceSchema;
  testingApi.refreshRangeMetrics = refreshRangeMetrics;
  testingApi.displayFromBasePrice = displayFromBasePrice;
  testingApi.fetchGoldPrice = fetchGoldPrice;
  testingApi.fetchGlobalGoldSpot = fetchGlobalGoldSpot;
  testingApi.displayDefaultPrices = displayDefaultPrices;
  testingApi.formatDateTimeIndo = formatDateTimeIndo;
  testingApi.displayDateTimeWIB = displayDateTimeWIB;
  testingApi.applyAlternateSectionBackgrounds = applyAlternateSectionBackgrounds;
}

// Expose selected helpers for testing under Node/Jest without affecting browser usage
/* istanbul ignore else */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    SEARCH_INDEX,
    normalizeSearchText,
    PRICE_ADJUST_LM_IDR,
    PRICE_ADJUST_IDR,
    PRICE_TIMEOUT_MS,
    saveLastBasePrice,
    readLastBasePrice,
    updatePriceSchema,
    refreshRangeMetrics,
    displayFromBasePrice,
    fetchGoldPrice,
    displayDefaultPrices,
    formatDateTimeIndo,
    displayDateTimeWIB,
    applyAlternateSectionBackgrounds,
  };
}
