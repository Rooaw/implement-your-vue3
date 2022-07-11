# Implement-your-Vue3
Implement a simple Vue3 to understand Vue3.

You'd better have Vue experience or at least have read Vue docs. 

This is a simple demo on Vue3:
```html
<!-- html -->

<div id="app">
  <button @click="count++">{{ count }}</button>
</div>
```

```javascript
// js

import { createApp } from 'vue'

const app = createApp({
  data() {
    return {
      count: 0
    }
  }
})

app.mount('#app')
```
when we click the button, the number on the browser will change. 

why? 

I think this question can be a good start to let's go deep into vue. 

