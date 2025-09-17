class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback;
    this.elements = new Set();
  }
  observe(element) {
    this.elements.add(element);
    this.callback([
      { isIntersecting: true, target: element },
      { isIntersecting: false, target: element },
    ]);
  }
  unobserve(element) {
    this.elements.delete(element);
  }
  disconnect() {
    this.elements.clear();
  }
}

global.IntersectionObserver = MockIntersectionObserver;

global.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 0);

global.cancelAnimationFrame = (id) => clearTimeout(id);

global.matchMedia = global.matchMedia || function matchMedia() {
  return {
    matches: false,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  };
};

global.scrollTo = () => {};

if (typeof HTMLMediaElement !== 'undefined') {
  Object.defineProperty(HTMLMediaElement.prototype, 'play', {
    configurable: true,
    writable: true,
    value: function play() {
      return Promise.resolve();
    },
  });
  Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
    configurable: true,
    writable: true,
    value: function pause() {
      return undefined;
    },
  });
}
