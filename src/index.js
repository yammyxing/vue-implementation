const data = {
  text: 'hello, world!',
};

let activeEffect = null;

const bucket = new WeakMap();

function track(target, key) {
  if (!activeEffect) {
    return;
  }
  let depMap = bucket.get(target);
  if (!depMap) {
    bucket.set(target, (depMap = new Map()));
  }
  let deps = depMap.get(key);
  if (!deps) {
    depMap.set(key, (deps = new Set()));
  }
  deps.add(activeEffect);
}

function trigger(target, key) {
  const depMap = bucket.get(target);
  if (!depMap) {
    return;
  }
  const effects = depMap.get(key);
  if (effects) {
    effects.forEach((fn) => fn());
  }
}

const obj = new Proxy(data, {
  get(target, key) {
    track(target, key);
    return target[key];
  },
  set(target, key, newValue) {
    // eslint-disable-next-line no-param-reassign
    target[key] = newValue;
    trigger(target, key, newValue);
    return true;
  },
});

function effect(fn) {
  activeEffect = fn;
  fn();
}

effect(() => {
  document.getElementById('app').innerHTML = obj.text;
});

window.setTimeout(() => {
  obj.ok = 'hello, vue.js';
}, 3000);
