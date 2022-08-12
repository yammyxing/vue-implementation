const data = {
  text: 'hello, world!',
};

let activeEffect = null;

const bucket = new Set();

const obj = new Proxy(data, {
  get(target, key) {
    if (activeEffect) {
      bucket.add(activeEffect);
    }
    return target[key];
  },
  set(target, key, newValue) {
    // eslint-disable-next-line no-param-reassign
    target[key] = newValue;
    bucket.forEach((fn) => fn());
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
  obj.text = 'hello, vue.js';
}, 3000);
