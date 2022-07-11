let bucket = new WeakMap()
let activeEffect = undefined

export function effect(fn) {
    activeEffect = fn
    fn()
}


export function track(target, key) {
    if(!activeEffect) return

    let depsMap = bucket.get(target)
    if(!depsMap) {
        bucket.set(target, (depsMap = new Map()))
    }
    let deps = depsMap.get(key)
    if(!deps) {
        depsMap.set(key, (deps = new Set()))
    }
    deps.add(activeEffect)
}

export function trigger(target, key, newVal) {

    let depsMap = bucket.get(target)
    if(!depsMap) return
    let deps = depsMap.get(key)
    
    deps && deps.forEach(fn => {
        fn()
    });
}