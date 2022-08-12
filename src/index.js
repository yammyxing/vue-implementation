// eslint-disable-next-line import/extensions
import { track, trigger } from './proxy.js';

const data = {
  text: 'hello, world!',
};

let activeEffect = null;

const obj = new Proxy(data, {
  get(target, key) {
    track(target, key, activeEffect);
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
  obj.text = 'hello, vue.js';
}, 3000);
