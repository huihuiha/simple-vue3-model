## vue 数据响应式的过程

生成依赖的过程
- proxy代理（拦截get）
- effect 触发 get
- 依赖结构 { target: { key: [depFn1, depFn2, depFn...]}}
- 根据 fn 生成更新实例，执行run方法则执行fn
- 

触发以来的过程