const isObject = (val) => {
    return val !== null && typeof val === 'object';
};

// 创建组件实例
function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type,
        setupState: {},
    };
    return component;
}
function setupComponent(instacnce) {
    // initProps
    // initSlots
    // 初始化有状态的组件
    setupStatefulComponent(instacnce);
}
function setupStatefulComponent(instance) {
    const Component = instance.type;
    instance.proxy = new Proxy({}, {
        get(target, key) {
            // setupState
            const { setupState } = instance;
            if (key in setupState) {
                return setupState[key];
            }
        },
    });
    const { setup } = Component;
    if (setup) {
        // 可以是function、object
        const setupResult = setup();
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
    if (typeof setupResult === 'object') {
        instance.setupState = setupResult;
    }
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    const Component = instance.type;
    instance.render = Component.render;
}

function render(vnode, container) {
    // patch
    // 是 element 那就处理element
    patch(vnode, container);
}
function patch(vnode, container) {
    // 处理组件
    // 判断是不是element
    if (typeof vnode.type === 'string') {
        processElement(vnode, container);
    }
    else if (isObject) {
        proccessComponent(vnode, container);
    }
}
function processElement(vnode, container) {
    // init -> update
    mountElement(vnode, container);
}
function mountElement(vnode, container) {
    const el = document.createElement(vnode.type);
    // srting array
    const { children, props } = vnode;
    // children 可以是string 或者 array
    if (typeof children === 'string') {
        el.textContent = children;
    }
    else if (Array.isArray(children)) {
        mountChildren(vnode, el);
    }
    // props
    for (const key in props) {
        const val = props[key];
        el.setAttribute(key, val);
    }
    container.append(el);
}
function mountChildren(vnode, container) {
    vnode.children.forEach((v) => {
        patch(v, container);
    });
}
function proccessComponent(vnode, container) {
    mountComponent(vnode, container);
}
function mountComponent(vnode, container) {
    const instance = createComponentInstance(vnode);
    setupComponent(instance);
    setupRenderEffect(instance, container);
}
function setupRenderEffect(instance, container) {
    const { proxy } = instance;
    const subTree = instance.render.call(proxy);
    // vnode -> patch
    // vnode -> element -> mountElement
    patch(subTree, container);
}

function createVNode(type, props, children) {
    const vnode = {
        type,
        props,
        children,
    };
    return vnode;
}

function createApp(rootComponent) {
    return {
        mount(rootContainer) {
            // 先Vnode
            // component -> root
            // 后续操作都会基于Vnode操作
            const vnode = createVNode(rootComponent, rootContainer);
            render(vnode, rootContainer);
        },
    };
}

function h(type, props, children) {
    return createVNode(type, props, children);
}

export { createApp, h };
