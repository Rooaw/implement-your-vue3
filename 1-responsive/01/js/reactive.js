import { track, trigger } from "./effect.js"

export function reactive(raw) {
    return new Proxy(raw, handler)
}

const handler = {
    get(target, key) {
        track(target, key)
        return Reflect.get(target, key)
    },
    set(target, key, newVal) {
        let res = Reflect.set(target, key, newVal)
        trigger(target, key, newVal)
        return res
    }
}