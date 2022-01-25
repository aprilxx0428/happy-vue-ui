# MessageAction

## 说明
MessageAction是约束window.postMessage的格式协议。  
> Q: 为什么需要约定格式?  
> A: 不用的页面交互，在现代浏览器下，大多使用window.postMessage, 关于 [`postMessage`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/postMessage) 点开查看解释。这个方法在各个地方都可以调用，只要在页面使用 window.addEventListener('message')事件监听就可以。这个时候就会出现一个问题，怎么判断这个数据是你`post`过来. 所有才会出现数据约定

## 数据约定
约定数据格式 
```js
{ action: string, data: any }

如：

{ 
    action: 'close_page', 
    data: { 
        OPEN_MODE:"iframeDialog", 
        OPEN_TARGET_ID:'xxx'
    }
}
```

`action`: 代表动作，字符串类型
`data`: 动作都数据，可以是任何类型

### 关闭页面示例
发送页面A：
```js
window.postMessage({ 
    action: 'close_page', 
    data: { 
        OPEN_MODE:"iframeDialog", 
        OPEN_TARGET_ID:'xxx'
    }
}, "*")
```

接受页面B：
```js
export default {
    mounted() {
        // 页面加载监听
        window.addEventListener('message', this.messageEventListener)
    },
    destroyed() {
        // 页面退出，卸载监听事件，这是必须的
        window.removeEventListener('message', this.messageEventListener)
    },
    methods: {
        messageEventListener(e){
        const data = e.data
        // 判断是之前发布的close_page的动作
        if(data.action && data.action === 'close_page') {
            console.log(data.data) // { OPEN_MODE:"iframeDialog", OPEN_TARGET_ID:'xxx' }
        }
    }
}
```

### BindMessageActionMixin

BindMessageActionMixin 可以大大简化上面示例当中的步骤，它会自动进行页面监听和退出时卸载监听

```js
import { BindMessageActionMixin } from "@/common/messageAction"
export default {
    mixins: [
        BindMessageActionMixin(function(bind) {
            bind('close_page', this.closePageMessageActionHandler)
        })
    ],
    methods: {
        closePageMessageActionHandler(data) {
            console.log(data.data) // { OPEN_MODE:"iframeDialog", OPEN_TARGET_ID:'xxx' }
        }
    }
}
```

### API


## 内置的MessageAction

1. ClosePageMessageAction: 关闭页面
2. SetIFrameHeightMessageAction: 设置IFrame高度