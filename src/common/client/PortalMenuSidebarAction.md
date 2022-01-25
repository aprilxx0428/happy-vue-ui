# PortalMenuSidebarAction
门户菜单左侧栏动作

## 设置页面菜单左侧栏选中菜单

### 背景
> 一般的应用是和门户代码分开的，门户点击左侧菜单，实现右边内容变换，但还有另一种情况，右边内容点击按钮后页面切换后，希望门户左侧菜单能够正确定位并选择左侧菜单。  
> 如：左侧菜单有两个，收件箱和写邮件。点击收件箱进入收件箱的页面，收件箱的页面也有一个按钮点击是写邮件，这时候页面进入了写邮件，但是左侧还是定位在收件相上，可以通过此Action，告诉门户，希望选中写邮件左侧菜单

使用方式如下
```js
import { setPortalMenuSidebarSelected } from '@/common/client/portal-menu-sidebar-action'

setPortalMenuSidebarSelected('code')
```


### 功能 
1. SetPortalMenuSidebarMessageAction 设置页面菜单左侧栏选中菜单


### MessageAction

#### SetPortalMenuSidebarMessageAction 设置页面菜单左侧栏选中菜单
| 参数 | 说明 | 类型 | 默认值 | 
| --- | --- | --- | --- |  
| code |  菜单的code | *string* | - |