In the 1-responsive folder, we just use the `document.body.innerHTML = obj.text` to render text on browser.

But in .vue file we use \<template> include the html code. and .vue file actually return a object like that:
```javascript
{
    components: {},
    props: {},
    render() {},
    setup() {}
    // ...
}
```

How does vue3 exactly do?

The official document have already show that, the code in template tag is a string, it will be compiled into vnode to render it.

Put the complie aside, let's start with the render first, for example the template code:
```html
<template>
    <div id="foo">
        <p>hello</p>
    </div>
</template>
```

the vnode will be:
```javascript
{
    type:"div",
    props:{
        id:"foo"
    },
    children:[
        {
            type:'p',
            children:"hello"
         }
    ]
}
```

render the vnode on browser is what we need to do in this part. 

if you rember the effect in 01-responsive:
```javascript
effect(() => {
    document.body.innerHTML = obj.text
})
```

It's abviously the `document.body.innerHTML = obj.text` is the position to render, maybe it's like:
```javascript
effect(() => {
    render(vnode, document.querySelector('#app'))
})
```

when something(the responsive data which we complete in 01-responsive) change in vnode, the effect function will run again like we said in 01-responsive.

so we just need to impplement the renderer.

The renderer do:
1. create real element by vnode
2. mount the real element to the root node which is the second parameter.
3. if responsive data change, the effect function will run
4. now we must be taken minimal changes to render the new vnode, so there is old and new vnode need to be compared and vue3 use diff algorithm.

The code will be like:
```javascript
// pseudo code

function renderer(vnode, container) {
    // 
    if(vnode) {
        // old vnode will be stored in container
        patch(container._vnode, vnode, container)
    }else {
        // unmount 
    }
    
    function patch(n1, n2, container) {
        if(!n1) {
            // mount new vnode
            mount(n2, container)
        }else {
            // compared old vnode and new vnode
        }
    }
}
```
if we have this vnode:
```javascript
const vnode = {
    type:"div",
    props:{
        id:"foo"
    },
    children:[
        {
            type:'p',
            children:"hello"
         }
    ]
}
```

mount vnode:
```javascript
function mount(vnode, container) {
    const el = createElement(vnode.type)
}

createElement(tag) {
    console.log(`create element ${tag}`)
    return { tag }
},
```