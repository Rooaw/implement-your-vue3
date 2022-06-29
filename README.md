# Implement-your-Vue3
Implement a simple Vue3 to understand Vue3.
You'd better have Vue experience or at least read Vue docs. 

First,let's see the basic useage for Vue3(using the vue-cli):
```vue
// this is a Vue file
// App.vue

<template>
    <button @click="increment">Count is: {{ count }}</button>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// reactive state
const count = ref(0)

// functions that mutate state and trigger updates
function increment() {
    count.value++
}

// lifecycle hooks
onMounted(() => {
    console.log(`The initial count is ${count.value}.`)
})
</script>
```

```javascript
// main.js
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App).mount('#app')
```

then, we can get some information:
1. The vue Object has some important functions like createApp()、mount()、ref()、onMounted() etc, we can infer that all things(function) Vue3 do is in one Object:
    ```javascript
    const vue = {
        createApp(){},
        mount(){},
        onMounted(){},
        ref(){},
        // ...
    }
    ```

2. the Vue file will export a JS Object in the end, so we can import it in js file. 
It's obviously In the vue file, Vue3 need to translate the HTML in the template tag into javascript Object to make it's able to run with the js code in the vue file, then Vue3 need show something on the browser, so it's also need to translate the final javascript Object into HTML, then can render it.

so the Vue3's processing steps will be like:
```javascript
const vue = {
    // 1. compile html into a javascript Object
    compileHtmlToJs(html) {
        // return a javascript Object
    }
    // 2. run the js code in this vue file with this javascript Object
    runJs(Object) {
        // processing this Object
        // return this Object 
    }
    // 3. compile this Object into HTML
    compileObjToHtml(Object) {
        // return some code can render on the browser directly
    }
    // 4. render
    render() {}
}
```

now, we can try to make a Vue3