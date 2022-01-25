# PageMainLayout
智能办公典型页面的Layout,快速创建相同的页面。


## API

### Props
| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| pageTitle | 标题 | *string* | '' | 
| btnRefresh| 刷新按钮是否可见 | *boolean* | `true` |
| isShowHeader | 是否显示页面头部 | *boolean* | `true` |

### Methods


### Slots
| 名称    | 说明          |
| ------- | ------------- |
| default | 自定义内容 |
| titleAssisted | 标题旁边显示的辅助内容 |
| buttons | 按钮区域 |
| refreshBtn | 刷新按钮 |
| side | 左侧内容显示区域 |
| pagination | 分页区域 |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| refresh | 点击刷新按钮触发 | |
