# PageDialogLayout
弹出示页面Layout, 能自适应页面布局。结合[`page-client`](../../common/client/PageClient.md), 完整提供打开，关闭页面响应。

## 背景
当系统复杂的情况下，会出现各种复杂的整合方式，一个功能，可能会出现一下三种要求：
1. 要求在浏览器新页面打开独立访问，
2. 使用`iframe`弹窗的方式访问
3. 在vue页面，为了性能考虑，被当作Vue的一个组件被使用。

需要完成上面三个场景，可以通过`PageDialogLayout`组件自适应布局，同时提供了`close`方法，用来关闭页面，开发者可以不用关系当前页面是处在上面样的场境下。

## API

### Props
| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| minHeight | 最低高度 | *string* | `100%` | 

### Methods


### Slots
| 名称    | 说明          |
| ------- | ------------- |
| default | 自定义内容 |
| footer | 按钮区域 |

### 方法

通过 ref 可以获取到 PageDialogLayout 实例并调用实例方法

| 方法名 | 说明 | 参数 | 返回值 |
| --- | --- | --- | --- |
| close | 关闭页面 | data: any | - |