const bucket = new WeakMap();

export function track(target, key, activeEffect) {
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

export function trigger(target, key) {
  const depMap = bucket.get(target);
  if (!depMap) {
    return;
  }
  const effects = depMap.get(key);
  if (effects) {
    effects.forEach((fn) => fn());
  }
}
