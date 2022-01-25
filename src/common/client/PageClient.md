# PageClient
页面 各种辅助 Client， 结合 [`PageDialogLayout`](../../components/shared/PageDialogLayout.md) 组件使用 

## 设计
当系统复杂的情况下，会出现各种复杂的整合方式，一个功能，可能会出现一下三种要求：
1. 要求在浏览器新页面打开独立访问，
2. 使用`iframe`弹窗的方式访问
3. 在vue页面，为了性能考虑，被当作Vue的一个组件被使用。

同时，当页面出现操作按钮，如`关闭按钮`, 则要完成一下逻辑：
1. 判断页面是否上述第1点的情况，则关闭的时候是把当前页面关闭，同时可能需要通知上个页面，当前页面被关闭了
2. 判断页面是否上述第2点的情况，则关闭的时候，通知父页面，把弹窗关闭
3. 判断页面是否上述第3点的情况，则关闭，触发一个事件让父组件知道当前组件关闭了

基于以上的要求，编写一个页面会需要大量的逻辑。 PageClient设计了一套约定和API，用来简化工作：
在URL地址设计了2参数用来判断当前页面的状态
1. OPEN_MODE: 页面打开方式，`iframeDialog`(上述第2条) | `blank`(上述第1条)。没有此参数的，代表第3条
2. OPEN_TARGET_ID: 一个唯一值，关闭的时候，此值原封不动传递回去，让上一个页面判断

### 示例
可以查看门户的demo页面 ,url: 门户路径/demo

### 新页面打开
```js
import { OpenPageModeEnum, renderOpenUrl } from "@/common/client/page-client"

const targetId = "xxxx"
const url = renderOpenUrl(OpenPageModeEnum.Blank, url, targetId)
window.open(url)
```

### IFrame 弹窗访问
```html
<el-dialog
    custom-class="dialog-position dialog-position-auto dialog-position-auto--nopadding"
    title="IFrame 显示"
    :visible="iframeBVisisble"
    @close="dialogCloseHandler"
>
    <aioa-frame :src="dialogIframeUrl" frameborder="0" scrolling="auto"></aioa-frame>
</el-dialog>
```
```js
import { OpenPageModeEnum, renderOpenUrl } from "@/common/client/page-client"

const targetId = "xxxx"
const dialogIframeUrl = renderOpenUrl(OpenPageModeEnum.Blank, url, targetId)
```

### 功能 
1. ClosePageMessageAction 关闭页面的MessagAction
2. renderOpenUrl 生成打开页面的URL地址


### MessageAction

#### close_page 关闭页面
| 参数 | 说明 | 类型 |
| --- | --- | --- | --- |
| OPEN_MODE |  打开的方式 | *string* | `iframeDialog`,`blank` |