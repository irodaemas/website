const buildMatchMedia = () => {
  return jest.fn((query) => {
    const base = {
      matches: false,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    };
    if (query === '(pointer:fine)') {
      return { ...base, matches: true };
    }
    if (query === '(prefers-reduced-motion: reduce)') {
      return { ...base, matches: false };
    }
    return base;
  });
};

describe('main.js behaviours', () => {
  let main;
  let originalServiceWorker;
  let originalFetch;
  let consoleWarnSpy;

  const buildDom = () => {
    document.body.innerHTML = `
      <div class="scroll-progress"></div>
      <div class="hero"></div>
      <a href="https://wa.me/123" id="wa-link" data-track="wa-main"></a>
      <div class="feature" id="feature-card"></div>
      <div class="t-card" id="t-card"></div>
      <span class="count" data-to="5"></span>
      <span class="num" data-to="10"></span>
      <img id="lazy-img" data-src="real.jpg" />
      <img id="fallback-img" />
      <video id="hero-video"></video>
      <section></section>
      <div class="feature"></div>
      <div class="card"></div>
      <div class="stat"></div>
      <div class="gallery"><img class="gallery-img"></div>
      <div id="currentDateTime"></div>
      <div id="typer"></div>
      <table><tbody id="goldPriceTable"></tbody></table>
      <div id="lmBaruHighlight" class="price-highlight">
        <div class="price-highlight-head">
          <p class="price-highlight-label">Logam Mulia (LM) Baru</p>
          <span id="lmBaruTrendBadge" class="price-badge price-neutral">Menunggu</span>
        </div>
        <div class="price-highlight-main">
          <span id="lmBaruCurrent" class="price-highlight-value">Rp —</span>
          <span class="price-highlight-unit">/gram</span>
        </div>
        <div id="lmBaruDelta" class="price-highlight-delta">
          <span class="delta-icon" data-trend="pending"></span>
          <span id="lmBaruDeltaText">Selisih menunggu data</span>
        </div>
        <div class="price-highlight-actions">
          <button id="highlight-add" type="button" class="price-highlight-add" data-add-cat="lm_baru" data-add-kadar="24">
            <span class="price-add-icon" aria-hidden="true">+</span>
            <span>Masukkan ke Kalkulator</span>
          </button>
        </div>
      </div>
      <div id="lastUpdatedInfo"></div>
      <select id="cal-cat">
        <option value="lm_baru">LM Baru</option>
        <option value="lm_lama">LM Lama</option>
        <option value="perhiasan_24">Perhiasan 24K</option>
        <option value="perhiasan_sub" selected>Perhiasan &lt;24K</option>
      </select>
      <select id="cal-kadar">
        <option value="24">24K</option>
        <option value="18" selected>18K</option>
      </select>
      <input id="cal-berat" value="3" />
      <div id="cal-total"></div>
      <a id="wa-prefill"></a>
      <div id="yr"></div>
      <div id="y"></div>
      <div id="path"></div>
      <button id="backToTop"></button>
      <nav class="menu">
        <a href="#home">Home</a>
        <a href="#services">Services</a>
      </nav>
    `;
  };

  beforeEach(async () => {
    jest.useFakeTimers();
    buildDom();
    location.hash = '#services';
    localStorage.clear();
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      configurable: true,
      value: 2000,
    });
    Object.defineProperty(document.documentElement, 'clientHeight', {
      configurable: true,
      value: 1000,
    });
    Object.defineProperty(document.documentElement, 'scrollTop', {
      configurable: true,
      writable: true,
      value: 0,
    });
    Object.defineProperty(document.body, 'scrollTop', {
      configurable: true,
      writable: true,
      value: 0,
    });
    window.gtag = jest.fn();
    window.dataLayer = { push: jest.fn() };
    window.matchMedia = buildMatchMedia();
    originalFetch = global.fetch;
    global.fetch = jest.fn(() => Promise.reject(new Error('unmocked fetch')));
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    originalServiceWorker = window.navigator.serviceWorker;
    Object.defineProperty(window.navigator, 'serviceWorker', {
      configurable: true,
      value: {
        register: jest.fn(() => Promise.resolve({
          scope: '/',
          waiting: false,
          addEventListener: jest.fn(),
          installing: null,
        })),
        ready: Promise.resolve({
          sync: { register: jest.fn(() => Promise.resolve()) },
        }),
      },
    });
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.clearAllTimers();
    jest.useRealTimers();
    document.body.innerHTML = '';
    Object.defineProperty(window.navigator, 'serviceWorker', {
      configurable: true,
      value: originalServiceWorker,
    });
    global.fetch = originalFetch;
    if (consoleWarnSpy) consoleWarnSpy.mockRestore();
  });

  const flush = async (ms = 0) => {
    if (ms) {
      jest.advanceTimersByTime(ms);
    }
    await Promise.resolve();
  };

  const loadMain = async () => {
    jest.resetModules();
    main = require('./main.js');
    window.dispatchEvent(new Event('load'));
    await Promise.resolve();
    return main;
  };

  test('updates scroll progress and hero parallax on scroll', async () => {
    await loadMain();
    await flush(16);
    const bar = document.querySelector('.scroll-progress');
    const hero = document.querySelector('.hero');
    expect(bar.classList.contains('sp-0')).toBe(true);
    expect(hero.classList.contains('par-0')).toBe(true);

    document.documentElement.scrollTop = 400;
    window.dispatchEvent(new Event('scroll'));
    await flush(16);

    expect(Array.from(bar.classList)).toEqual(expect.arrayContaining(['sp-8']));
    expect(Array.from(hero.classList)).toEqual(expect.arrayContaining(['par-8']));
  });

  test('recalc responds to resize and price updates', async () => {
    await loadMain();
    const bar = document.querySelector('.scroll-progress');
    document.documentElement.scrollTop = document.documentElement.scrollHeight;
    window.dispatchEvent(new Event('resize'));
    await flush(16);
    expect(Array.from(bar.classList)).toEqual(expect.arrayContaining(['sp-20']));

    document.documentElement.scrollTop = 0;
    document.dispatchEvent(new Event('prices:updated'));
    await flush(16);
    expect(Array.from(bar.classList)).toEqual(expect.arrayContaining(['sp-0']));
  });

  test('wa link pulse toggles on click', async () => {
    await loadMain();
    const waLink = document.getElementById('wa-link');
    waLink.click();
    expect(waLink.classList.contains('pulse')).toBe(true);
    jest.advanceTimersByTime(500);
    expect(waLink.classList.contains('pulse')).toBe(false);
  });

  test('hover tilt applies transform and resets', async () => {
    await loadMain();
    const card = document.getElementById('feature-card');
    card.getBoundingClientRect = () => ({ left: 0, top: 0, width: 100, height: 100 });
    card.dispatchEvent(new MouseEvent('mousemove', { clientX: 75, clientY: 25 }));
    card.dispatchEvent(new Event('mouseenter'));
    card.dispatchEvent(new MouseEvent('mousemove', { clientX: 75, clientY: 25 }));
    expect(card.style.transform).toContain('rotateX');
    card.dispatchEvent(new MouseEvent('mousemove', { clientX: 25, clientY: 75 }));
    card.dispatchEvent(new Event('mouseleave'));
    expect(card.style.transform).toBe('none');
  });

  test('initializers handle missing DOM gracefully', async () => {
    window.matchMedia = jest.fn(() => ({
      matches: false,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }));
    ['.scroll-progress', '.hero', '#wa-link', '#feature-card', '#t-card', '.count', '.num', '#currentDateTime', '#typer', '#goldPriceTable', '#cal-cat', '#cal-kadar', '#cal-berat', '#cal-total', '#wa-prefill', '#yr', '#y', '#path', '#backToTop'].forEach((sel) => {
      const el = document.querySelector(sel);
      if (el) el.remove();
    });
    document.querySelectorAll('[data-track]').forEach((el) => el.remove());
    const menu = document.querySelector('nav.menu');
    if (menu) menu.remove();
    await loadMain();
    expect(true).toBe(true);
  });

  test('number animations run on intersection and refresh', async () => {
    await loadMain();
    jest.advanceTimersByTime(1000);
    await Promise.resolve();
    const count = document.querySelector('.count');
    const num = document.querySelector('.num');
    expect(count.textContent).toBe('5');
    expect(num.textContent).toBe('10');

    document.dispatchEvent(new Event('prices:updated'));
    jest.advanceTimersByTime(810);
    await Promise.resolve();
    expect(num.textContent).toBe('10');
  });

  test('date badge glow toggles via interval', async () => {
    await loadMain();
    const badge = document.getElementById('currentDateTime');
    badge.classList.remove('glow');
    jest.advanceTimersByTime(60000);
    expect(badge.classList.contains('glow')).toBe(true);
    jest.advanceTimersByTime(800);
    expect(badge.classList.contains('glow')).toBe(false);
  });

  test('typewriter respects reduced motion preference', async () => {
    window.matchMedia = jest.fn((query) => {
      const base = {
        matches: false,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      };
      if (query === '(pointer:fine)') {
        return { ...base, matches: true };
      }
      if (query === '(prefers-reduced-motion: reduce)') {
        return { ...base, matches: true };
      }
      return base;
    });
    await loadMain();
    expect(document.getElementById('typer').textContent).toBe('COD ke Lokasi Anda');
  });

  test('lazy load fallback runs without IntersectionObserver', async () => {
    const originalIO = global.IntersectionObserver;
    class PartialObserver {
      constructor(callback, options) {
        if (options && options.rootMargin) {
          throw new Error('no-observer');
        }
        this.callback = callback;
      }
      observe(element) {
        this.callback([
          { isIntersecting: true, target: element },
          { isIntersecting: false, target: element },
        ]);
      }
      unobserve() {}
      disconnect() {}
    }
    global.IntersectionObserver = PartialObserver;
    try {
      await loadMain();
      const img = document.getElementById('lazy-img');
      expect(img.getAttribute('data-src')).toBeNull();
      expect(img.src).toContain('real.jpg');
      img.dispatchEvent(new Event('load'));
      expect(img.classList.contains('loaded')).toBe(true);
    } finally {
      global.IntersectionObserver = originalIO;
    }
  });

  test('media error handlers swap placeholders', async () => {
    await loadMain();
    const img = document.getElementById('fallback-img');
    img.dispatchEvent(new Event('error'));
    expect(img.src).toContain('data:image/svg+xml');

    const video = document.getElementById('hero-video');
    video.dispatchEvent(new Event('error'));
    expect(document.getElementById('hero-video')).toBeNull();
    const replaced = document.querySelector('img[alt="video unavailable"]');
    expect(replaced).not.toBeNull();

    const lazy = document.getElementById('lazy-img');
    lazy.dispatchEvent(new Event('load'));
    expect(lazy.classList.contains('loaded')).toBe(true);
  });

  test('displayFromBasePrice populates table and schema', async () => {
    await loadMain();
    const listener = jest.fn();
    document.addEventListener('prices:updated', listener);
    main.displayFromBasePrice(1000000);
    const tbody = document.getElementById('goldPriceTable');
    expect(tbody.children.length).toBeGreaterThan(0);
    const firstRow = tbody.querySelector('.price-row');
    expect(firstRow).not.toBeNull();
    expect(firstRow.getAttribute('data-info-key')).toBe('lm_lama');
    const addBtn = firstRow.querySelector('.price-add-btn');
    expect(addBtn).not.toBeNull();
    expect(addBtn.getAttribute('data-add-cat')).toBe('lm_lama');
    expect(addBtn.getAttribute('data-add-kadar')).toBe('24');
    const icon = firstRow.querySelector('.price-icon');
    expect(icon).not.toBeNull();
    expect(icon.getAttribute('data-tooltip')).toContain('Logam Mulia');
    const highlightBtn = document.getElementById('highlight-add');
    expect(highlightBtn.getAttribute('data-add-cat')).toBe('lm_baru');
    expect(listener).toHaveBeenCalled();
    const script = document.getElementById('priceItemList');
    expect(script).not.toBeNull();
    const json = JSON.parse(script.textContent);
    expect(json.itemListElement.length).toBeGreaterThan(0);
    document.removeEventListener('prices:updated', listener);
  });

  test('displayFromBasePrice updates highlight states and info text', async () => {
    await loadMain();
    const badge = document.getElementById('lmBaruTrendBadge');
    const deltaWrap = document.getElementById('lmBaruDelta');
    const current = document.getElementById('lmBaruCurrent');
    const icon = deltaWrap.querySelector('.delta-icon');
    const highlight = document.getElementById('lmBaruHighlight');
    const calcSpy = jest.spyOn(window.REI_CALC, 'setSelection');

    main.displayFromBasePrice(1000000, {
      previousPrice: 900000,
      updatedAt: '1714608000000',
      metaSuffix: ' • Uji'
    });
    await flush(20);
    expect(current.textContent).toBe('Rp 982.000');
    expect(badge.textContent).toBe('Naik');
    expect(badge.classList.contains('price-up')).toBe(true);
    expect(deltaWrap.classList.contains('trend-up')).toBe(true);
    expect(deltaWrap.classList.contains('delta-flash')).toBe(true);
    expect(icon.getAttribute('data-trend')).toBe('up');
    expect(document.getElementById('lmBaruDeltaText').textContent).toContain('Naik Rp 82.000');
    expect(current.classList.contains('value-flash')).toBe(true);
    expect(highlight.classList.contains('is-updated')).toBe(true);
    const infoText = document.getElementById('lastUpdatedInfo').textContent;
    expect(infoText).toContain('Terakhir diperbarui:');
    expect(infoText).toContain('2024');
    expect(infoText).toContain('• Uji');

    main.displayFromBasePrice(900000, {
      previousBase: 1000000,
      updatedAt: 1714694400000
    });
    await flush(20);
    expect(badge.textContent).toBe('Turun');
    expect(badge.classList.contains('price-down')).toBe(true);
    expect(deltaWrap.classList.contains('trend-down')).toBe(true);
    expect(icon.getAttribute('data-trend')).toBe('down');
    expect(document.getElementById('lmBaruDeltaText').textContent).toContain('Turun Rp');

    main.displayFromBasePrice(850000, {
      previousPrice: 0
    });
    await flush(20);
    expect(deltaWrap.classList.contains('trend-up')).toBe(true);

    const latestPrice = current.textContent.replace(/[^0-9]/g, '');
    const samePrice = Number(latestPrice);
    main.displayFromBasePrice(850000, {
      previousPrice: samePrice
    });
    await flush(20);
    expect(deltaWrap.classList.contains('trend-flat')).toBe(true);
    expect(icon.getAttribute('data-trend')).toBe('flat');

    main.displayFromBasePrice(850000, {});
    await flush(20);
    expect(deltaWrap.classList.contains('trend-pending')).toBe(true);
    expect(icon.getAttribute('data-trend')).toBe('pending');

    const highlightAdd = document.getElementById('highlight-add');
    highlightAdd.click();
    expect(calcSpy).toHaveBeenCalledWith(expect.objectContaining({ cat: 'lm_baru', kadar: '24' }));
    calcSpy.mockRestore();
  });

  test('displayFromBasePrice survives toLocaleString failures', async () => {
    await loadMain();
    const originalToLocaleString = Number.prototype.toLocaleString;
    const originalDispatch = document.dispatchEvent;
    let didThrow = false;
    Number.prototype.toLocaleString = jest.fn(function (...args) {
      if (!didThrow) {
        didThrow = true;
        throw new Error('fail');
      }
      return originalToLocaleString.apply(this, args);
    });
    document.dispatchEvent = jest.fn(() => true);
    try {
      main.displayFromBasePrice(1000000);
      await flush(20);
      expect(document.getElementById('lmBaruCurrent').textContent).toBe('Rp 982000');
    } finally {
      Number.prototype.toLocaleString = originalToLocaleString;
      document.dispatchEvent = originalDispatch;
    }
  });

  test('displayDefaultPrices falls back correctly', async () => {
    await loadMain();
    main.displayDefaultPrices();
    const tbody = document.getElementById('goldPriceTable');
    expect(tbody.children.length).toBeGreaterThan(10);
    const script = document.getElementById('priceItemList');
    expect(script).not.toBeNull();
  });

  test('save and read last base price handle storage and errors', async () => {
    await loadMain();
    main.saveLastBasePrice(1234);
    expect(main.readLastBasePrice().p).toBe(1234);
    localStorage.setItem('rei_last_base_price_v1', 'invalid');
    expect(main.readLastBasePrice()).toBeNull();

    const originalSetItem = Object.getPrototypeOf(localStorage).setItem;
    Object.getPrototypeOf(localStorage).setItem = () => { throw new Error('fail'); };
    expect(() => main.saveLastBasePrice(99)).not.toThrow();
    Object.getPrototypeOf(localStorage).setItem = originalSetItem;
  });

  test('updatePriceSchema removes script when empty', async () => {
    await loadMain();
    main.updatePriceSchema([{ name: 'Test', price: 100 }]);
    expect(document.getElementById('priceItemList')).not.toBeNull();
    main.updatePriceSchema([]);
    expect(document.getElementById('priceItemList')).toBeNull();
  });

  test('formatDateTimeIndo and displayDateTimeWIB format values', async () => {
    await loadMain();
    const date = new Date(Date.UTC(2024, 3, 5, 1, 2));
    expect(main.formatDateTimeIndo(date)).toContain('2024');
    jest.setSystemTime(new Date('2024-04-05T00:00:00Z'));
    main.displayDateTimeWIB();
    const text = document.getElementById('currentDateTime').textContent;
    expect(text).toContain('2024');
    jest.setSystemTime(new Date());
  });

  test('fetchGoldPrice updates DOM on success', async () => {
    await loadMain();
    const response = {
      json: () => Promise.resolve({
        statusCode: 200,
        data: {
          current: {
            buy: 1000000,
            priceDate: '2024-05-10T00:00:00Z',
            previous: { buy: 1000000, time: '2024-05-09T00:00:00Z' },
          },
          previous: { buy: 1020000, timestamp: 1714953600000 },
          history: [
            { buy: 1000000, priceDate: '2024-05-08T00:00:00Z' },
            { buy: 970000 },
          ],
        },
      }),
    };
    global.fetch = jest.fn(() => Promise.resolve(response));
    await main.fetchGoldPrice();
    await flush(20);
    const tbody = document.getElementById('goldPriceTable');
    expect(tbody.children.length).toBeGreaterThan(0);
    const info = document.getElementById('lastUpdatedInfo');
    expect(info.textContent).toContain('Terakhir diperbarui');
    expect(info.textContent).toContain('2024');
    const deltaWrap = document.getElementById('lmBaruDelta');
    const badge = document.getElementById('lmBaruTrendBadge');
    expect(deltaWrap.classList.contains('trend-down')).toBe(true);
    expect(document.getElementById('lmBaruDeltaText').textContent).toContain('Turun Rp 19.000');
    expect(badge.textContent).toBe('Turun');
    expect(badge.classList.contains('price-down')).toBe(true);
    expect(localStorage.getItem('rei_last_base_price_v1')).toBeTruthy();
  });

  test('fetchGoldPrice uses cached value on failure', async () => {
    await loadMain();
    main.saveLastBasePrice(800000);
    global.fetch = jest.fn(() => Promise.reject(new Error('fail')));
    await main.fetchGoldPrice();
    const tbody = document.getElementById('goldPriceTable');
    expect(tbody.children.length).toBeGreaterThan(0);
    expect(consoleWarnSpy).toHaveBeenCalled();
  });

  test('fetchGoldPrice falls back to defaults without cache', async () => {
    await loadMain();
    localStorage.removeItem('rei_last_base_price_v1');
    global.fetch = jest.fn(() => Promise.reject(new Error('fail')));
    await main.fetchGoldPrice();
    const tbody = document.getElementById('goldPriceTable');
    expect(tbody.children.length).toBeGreaterThan(0);
    expect(consoleWarnSpy).toHaveBeenCalled();
  });

  test('fetchGoldPrice uses cached price when response invalid', async () => {
    await loadMain();
    main.saveLastBasePrice(650000);
    const response = {
      json: () => Promise.resolve({ statusCode: 500 }),
    };
    global.fetch = jest.fn(() => Promise.resolve(response));
    await main.fetchGoldPrice();
    const tbody = document.getElementById('goldPriceTable');
    expect(tbody.children.length).toBeGreaterThan(0);
    const info = document.getElementById('lastUpdatedInfo');
    expect(info.textContent).toContain('cache');
  });

  test('fetchGoldPrice defaults when invalid response and no cache', async () => {
    await loadMain();
    localStorage.removeItem('rei_last_base_price_v1');
    const response = {
      json: () => Promise.resolve({ statusCode: 500 }),
    };
    global.fetch = jest.fn(() => Promise.resolve(response));
    await main.fetchGoldPrice();
    const tbody = document.getElementById('goldPriceTable');
    expect(tbody.children.length).toBeGreaterThan(0);
  });

  test('video autoplay catch handles rejection', async () => {
    const originalPlay = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = jest.fn(() => Promise.reject(new Error('fail')));
    try {
      await loadMain();
      await Promise.resolve();
      await Promise.resolve();
      expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
    } finally {
      HTMLMediaElement.prototype.play = originalPlay;
    }
  });

  test('calculator updates estimations and wa link', async () => {
    await loadMain();
    const total = document.getElementById('cal-total');
    expect(total.textContent).toContain('Rp');
    const wa = document.getElementById('wa-prefill');
    expect(wa.href).toContain('wa.me');

    const cat = document.getElementById('cal-cat');
    cat.value = 'lm_baru';
    cat.dispatchEvent(new Event('change'));
    const kadar = document.getElementById('cal-kadar');
    expect(kadar.disabled).toBe(true);

    const decodeHref = () => decodeURIComponent(document.getElementById('wa-prefill').href);
    expect(decodeHref()).toContain('Logam Mulia (LM) Baru');

    cat.value = 'lm_lama';
    cat.dispatchEvent(new Event('change'));
    expect(kadar.disabled).toBe(true);
    expect(decodeHref()).toContain('Logam Mulia (LM) Lama');

    cat.value = 'perhiasan_24';
    cat.dispatchEvent(new Event('change'));
    expect(kadar.disabled).toBe(true);
    expect(decodeHref()).toContain('Perhiasan 24K');

    cat.value = 'perhiasan_sub';
    cat.dispatchEvent(new Event('change'));
    expect(kadar.disabled).toBe(false);
    expect(decodeHref()).toContain('Perhiasan <24K');
  });

  test('footer, back to top, and nav enhancements apply', async () => {
    await loadMain();
    const year = new Date().getFullYear().toString();
    expect(document.getElementById('yr').textContent).toBe(year);
    expect(document.getElementById('y').textContent).toBe(year);
    expect(document.getElementById('path').textContent).toBe('/');

    const scrollSpy = jest.spyOn(window, 'scrollTo');
    document.getElementById('backToTop').click();
    expect(scrollSpy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    scrollSpy.mockRestore();

    const active = document.querySelector('nav.menu a[aria-current="page"]');
    expect(active.textContent).toBe('Services');
  });

  test('tracking hooks fire analytics events and sync', async () => {
    await loadMain();
    const syncRegister = jest.fn(() => Promise.resolve());
    window.navigator.serviceWorker.ready = Promise.resolve({ sync: { register: syncRegister } });
    const trackEl = document.querySelector('[data-track]');
    trackEl.click();
    await Promise.resolve();
    expect(window.gtag).toHaveBeenCalledWith('event', 'cta_click', expect.objectContaining({ event_label: 'wa-main' }));
    expect(syncRegister).toHaveBeenCalled();
  });

  test('tracking falls back to dataLayer and console logging', async () => {
    await loadMain();
    const trackEl = document.querySelector('[data-track]');
    window.gtag = undefined;
    window.dataLayer.push = jest.fn();
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    trackEl.click();
    await Promise.resolve();
    expect(window.dataLayer.push).toHaveBeenCalledWith({ event: 'cta_click', label: 'wa-main' });

    window.dataLayer = undefined;
    trackEl.click();
    await Promise.resolve();
    expect(logSpy).toHaveBeenCalledWith('[track]', 'cta_click', 'wa-main');
    logSpy.mockRestore();
    window.gtag = jest.fn();
    window.dataLayer = { push: jest.fn() };
  });

  test('service worker registration shows toast when waiting worker exists', async () => {
    await loadMain();
    const ready = Promise.resolve({ sync: { register: jest.fn(() => Promise.resolve()) } });
    const listeners = {};
    const stateListeners = [];
    const waitingReg = {
      scope: '/',
      waiting: {},
      installing: {
        state: 'installing',
        addEventListener: jest.fn((event, cb) => {
          if (event === 'statechange') {
            stateListeners.push(cb);
          }
        }),
      },
      addEventListener: jest.fn((event, cb) => {
        listeners[event] = cb;
      }),
    };
    window.navigator.serviceWorker.register = jest.fn(() => Promise.resolve(waitingReg));
    window.navigator.serviceWorker.ready = ready;
    Object.defineProperty(window.navigator.serviceWorker, 'controller', {
      configurable: true,
      value: {},
    });
    window.dispatchEvent(new Event('load'));
    await Promise.resolve();
    listeners.updatefound();
    waitingReg.installing.state = 'installed';
    stateListeners.forEach((cb) => cb());
    const toast = document.getElementById('sw-toast');
    expect(toast).not.toBeNull();
    const originalLocation = window.location;
    const reloadSpy = jest.fn();
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        reload: reloadSpy,
        hash: originalLocation.hash,
        pathname: originalLocation.pathname,
        search: originalLocation.search,
      },
    });
    const btn = toast.querySelector('button');
    btn.click();
    expect(reloadSpy).toHaveBeenCalled();
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    });
  });

  test('service worker registration catch path warns on failure', async () => {
    const registerMock = window.navigator.serviceWorker.register;
    registerMock.mockImplementationOnce(() => Promise.reject(new Error('ouch')));
    await loadMain();
    await Promise.resolve();
    expect(consoleWarnSpy).toHaveBeenCalledWith('SW registration failed', expect.any(Error));
  });
});
