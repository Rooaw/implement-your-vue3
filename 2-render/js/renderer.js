
// simple implement

function shouldSetAsProps(el, key, value) {
  if (key === 'form' && el.tagName === 'INPUT') return false
  return key in el
}

function createRenderer(options) {

    // if we render in service side, we can use other api
    const {
        createElement,
        insert,
        setElementText,
        patchProps
    } = options

    function mountElement(vnode, container) {
        const el = vnode.el = createElement(vnode.type)
        if (typeof vnode.children === 'string') {
            setElementText(el, vnode.children)
        } else if (Array.isArray(vnode.children)) {
            vnode.children.forEach(child => {
                patch(null, child, el)
            })
        }

        if (vnode.props) {
            for (const key in vnode.props) {
                patchProps(el, key, null, vnode.props[key])
            }
        }

        insert(el, container)
    }

    function patchChildren(n1, n2, container) {
        if (typeof n2.children === 'string') {
          if (Array.isArray(n1.children)) {
            n1.children.forEach((c) => unmount(c))
          }
          setElementText(container, n2.children)
        } else if (Array.isArray(n2.children)) {
          if (Array.isArray(n1.children)) {
            n1.children.forEach(c => unmount(c))
            n2.children.forEach(c => patch(null, c, container))
          } else {
            setElementText(container, '')
            n2.children.forEach(c => patch(null, c, container))
          }
        } else {
          if (Array.isArray(n1.children)) {
            n1.children.forEach(c => unmount(c))
          } else if (typeof n1.children === 'string') {
            setElementText(container, '')
          }
        }
    }
    function patchElement(n1, n2) {
        // we have not use diff algorithm yet
        // just simple implement
        const el = n2.el = n1.el
        const oldProps = n1.props
        const newProps = n2.props
        
        for (const key in newProps) {
            if (newProps[key] !== oldProps[key]) {
                patchProps(el, key, oldProps[key], newProps[key])
            }
        }
        for (const key in oldProps) {
            if (!(key in newProps)) {
                patchProps(el, key, oldProps[key], null)
            }
        }
        patchChildren(n1, n2, el)
    }

    function unmount(vnode) {
        const parent = vnode.el.parentNode
        if (parent) {
          parent.removeChild(vnode.el)
        }
    }

    function patch(n1, n2, container) {

        if (!n1) {
            // no old vnode
            mountElement(n2, container)
        } else {
            patchElement(n1, n2)
        }
    }

    function render(vnode, container) {
        if (vnode) {
            // _vnode is the old vnode
            // we'll compare _vnode and vnode in patch if _vnode existed
            patch(container._vnode, vnode, container)
        } else {
            // there is no new vnode means we need to unmount the node
            if (container._vnode) {
                unmount(container._vnode)
            }
        }
        // store the old vnode
        container._vnode = vnode
    }
  
    return {
        render
    }
}

const renderer = createRenderer({
  createElement(tag) {
    return document.createElement(tag)
  },
  setElementText(el, text) {
    el.textContent = text
  },
  insert(el, parent, anchor = null) {
    parent.insertBefore(el, anchor)
  },
  patchProps(el, key, prevValue, nextValue) {
    if (key === 'class') {
        el.className = nextValue || ''
      } else if (shouldSetAsProps(el, key, nextValue)) {
        const type = typeof el[key]
        if (type === 'boolean' && nextValue === '') {
          el[key] = true
        } else {
          el[key] = nextValue
        }
      } else {
        el.setAttribute(key, nextValue)
      }
    }
})

export { renderer }