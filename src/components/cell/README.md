# aioa-cell 单元格控件

### 介绍
一个用于显示详情样式的统一控件。 示例可参考`配置中心=>考勤方案设置`的点击`方案名称`界面。

### 引入
```js

import { AioaCell, AioaCellGroup } from "@/components"

```

## 代码演示
```html

<aioa-cell title="方案名称" label="研发中心"></aioa-cell>

<aioa-cell-group>
    <aioa-cell title="地点" label="上海市浦东新区居家桥路955弄"></aioa-cell>
</aioa-cell-group>

```

```js

```


### 案例演示  
#### 模板代码
```html
<div class="custom-cells">
    <el-row>
        <el-col :span="12">
            <aioa-cell title="方案名称" label="研发中心"></aioa-cell>
        </el-col>
        <el-col :span="12">
            <aioa-cell title="全体员工" label="true"></aioa-cell>
        </el-col>
    </el-row>

    <el-row>
        <el-col :span="24">
            <aioa-cell title="人员对象" direction="column" label="陈叶军,储俊,狄传玲,段杭伯,康帅兵,吕发海,田轲,王旺,王希顺,谢开贵,徐闻彦,苑露莹,张慧,"> </aioa-cell>
        </el-col>
    </el-row>

    <el-row>
        <el-col :span="24">
            <aioa-cell-group>
                <aioa-cell title="地点" label="上海市浦东新区居家桥路955弄"></aioa-cell>
            </aioa-cell-group>
        </el-col>
    </el-row>

    <!-- 复杂布局嵌套cell -->
    <el-row>
        <el-col :span="12">
            <aioa-cell title="启动打卡" direction="column" title-class="custom-cells__title">
                <el-row>
                    <el-col :span="12">
                        <aioa-cell title="内勤打卡:" label="是" title-class="custom-cells__title" cell-class="custom-cells__cell"></aioa-cell>
                    </el-col>
                    <el-col :span="12">
                        <aioa-cell title="外勤打卡:" label="是" title-class="custom-cells__title" cell-class="custom-cells__cell"></aioa-cell>
                    </el-col>
                </el-row>
            </aioa-cell>
        </el-col>

        <el-col :span="12">
            <aioa-cell title="启动审核" direction="column" title-class="custom-cells__title">
                <el-row>
                    <el-col :span="12">
                        <aioa-cell title="内勤打卡:" label="是" title-class="custom-cells__title" cell-class="custom-cells__cell"></aioa-cell>
                    </el-col>
                    <el-col :span="12">
                        <aioa-cell title="外勤打卡:" label="是" title-class="custom-cells__title" cell-class="custom-cells__cell"></aioa-cell>
                    </el-col>
                </el-row>
            </aioa-cell>
        </el-col>
    </el-row>
</div>
```

######【custom-cells】类名 应对特殊布局
```css 
<style lang="less" scoped>
.custom-cells /deep/ .custom-cells__cell {
    padding-top: 0;
}
.custom-cells /deep/ .custom-cells__title {
    line-height: initial;
}
</style>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|------|
| cellClass | 单元格额外类型 | *string* | - |
| title | 左侧标题 | *string* | - |
| titleClass | 左侧标题额外类名 | *string* | - |
| value | 右侧内容 | *string* | - |
| valueClass | 右侧内容额外类名 | *string* | - |
| label | 标题下方的描述信息 | *string* | - |
| labelClass | 标题下方描述信息的额外类名 | *string* | - |
| icon | 左侧图标名称 | *string* | - |
| center | 是否使内容垂直居中 | *boolean* | `false` |
| direction | title和value对齐方式(不传是row,传是上下对齐)  | *string* | - |
| hairline | 是否显示比边框 | *boolean* | `false` |

### Slots

| 名称 | 说明 |
|------|------|
| default | 默认插槽 |
| title | 自定义左侧 title 的内容 |
| label | 自定义标题下方 label 的内容 |
| value | 自定义单元格最右侧的额外内容 |