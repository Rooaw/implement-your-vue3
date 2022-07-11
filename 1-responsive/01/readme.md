If run this:
```javascript
const obj = { text: 'hello, world' }
document.body.innerText = obj.text
```

we'll see "hello, world" on the browser, and we expect as long as we change the obj.text, the text on browser will follow the change

 for example:
```javascript
// code1.html

const obj = { text: 'hello, world' }
document.body.innerText = obj.text

// change obj.text
obj.text = 'hello, vue3'
// we hope the browser will show "hello, vue3"
// so, how to do it?
// just run that code again
document.body.innerText = obj.text
```

of course, we need to optimize the code, maybe we can put the render code in a function, because we use it often:
```javascript

function effect() {
    document.body.innerText = obj.text
}
```
but it's not enough, why don't make the effect run automatically as we change the obj.text. 

How?

vue2 use Object.defineProperty, The vue3 use [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy). 

so we can store the effect function in the get() handler, and run effect function in the set() handler, then it's automatically:
```javascript

// stroe the effect function in somewhere
// The Set object lets you store unique values of any type
const bucket = new Set()

// some object we might change in somewhere
const obj = { text: 'hello, world' }
// create a Proxy for these object
// then we can do something we want before we set or get the proxy object
const proxyObj = new Proxy(obj, handler)

const handler = {
    get(target, key) {
        // store effect as we get values
        bucket.add(effect)
        return target[key]
    },
    set(target, key, newVal) {
        // if we change obj.text
        // we can run effect after changes
        target[key] = newVal
        bucket.forEach(effect => {
            effect()
        });
        return true
    }
}
```

but, the effect function is hard code now, we need to modify it: 
```javascript
// define a global variable 
let activeEffect
function effect(fn) {
    // then we can do more about it if we need
    activeEffect = fn
    fn()
}
``` 

it seems worked, but it'll run every effect function in bucket even if there is no connection between the key and current effect.

we need to change the bucket structure, it have to like that:

```javascript
obj1(Map) 
  |---key1(Set)
       |---effectFn1
  |---key2(Set)
       |---effectFn2
       |---effectFn3 
obj2(Map) 
  |---key1(Set)
       |---effectFn4
  |---key2(Set)
       |---effectFn3
       |---effectFn4
```

       
We use [WeakMap](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap) here. 

WeakMap does not prevent the object from being garbage collected.
```javascript
const bucket = new WeakMap()
```

then the handler object need to be changed, because we save or get a effect function in a WeakMap:
```javascript
const handler = {
    get(target, key) {
        // track this key's effectFn when get it
        track(target, key)
        return Reflect.get(target, key)
    },
    set(target, key, newVal) {
        let res = Reflect.set(target, key, newVal)
        // trigger this key's effectFn when set it
        trigger(target, key, newVal)
        return res
    }
}

function track(target, key) {
    if(!activeEffect) return
        // if the obj exist 
        let depsMap = bucket.get(target)
        if(!depsMap) {
            bucket.set(target, (depsMap = new Map()))
        }
        // if the obj.key exist
        // the structure:
        // key
        //   |----effectFn1
        //   |----effectFn2
        let deps = depsMap.get(key)
        if(!deps) {
            depsMap.set(key, (deps = new Set()))
        }
        deps.add(activeEffect)
}

function trigger(target, key) {
    const depsMap = bucket.get(target)
    // if no this object in bucket, no need to do anything
    if(!depsMap) return
    const effectFns = depsMap.get(key)
    // run all effectFn which belongs this key
    effectFns && effectFns.forEach(effect => {
        effect()
    });
}
```

Implemeting the reactive function we often use only need to return the proxy:
```javascript
function reactive(raw) {
    return new Proxy(raw, handler)
}
```

finally we can imitate the useage in vue3 to reconstructed the code style. The code is in the same folder as this file.

if you want run these code on browser, you can install "live Server" in vscode, then open the index.html, right clicking, select "open with live Server".