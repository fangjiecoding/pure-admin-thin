# bpmn.js 快速开始

## 安装依赖

在项目根目录运行：

```bash
pnpm add bpmn-js bpmn-js-properties-panel @bpmn-io/properties-panel
```

## 已创建的文件

1. **教程文档**: `docs/bpmn-js使用教程.md` - 完整的使用教程
2. **编辑器组件**: `src/components/BpmnEditor/index.vue` - 可直接使用的 BPMN 编辑器组件
3. **示例页面**: `src/views/demoTest/bpm.vue` - 使用示例

## 使用步骤

### 1. 安装依赖

```bash
pnpm add bpmn-js bpmn-js-properties-panel @bpmn-io/properties-panel
```

### 2. 运行项目

```bash
pnpm dev
```

### 3. 访问页面

在浏览器中访问包含 bpm 页面的路由。

## 组件 API

### Props

| 参数 | 说明                 | 类型   | 默认值 |
| ---- | -------------------- | ------ | ------ |
| xml  | 初始 BPMN XML 字符串 | string | -      |

### Events

| 事件名 | 说明               | 回调参数          |
| ------ | ------------------ | ----------------- |
| change | 流程图变化时触发   | (xml: string)     |
| select | 选中元素变化时触发 | (elements: any[]) |

### Expose 方法

| 方法名        | 说明              | 参数          |
| ------------- | ----------------- | ------------- |
| importDiagram | 导入 BPMN XML     | (xml: string) |
| saveXML       | 导出 BPMN XML     | -             |
| saveSVG       | 导出 SVG          | -             |
| getModeler    | 获取 modeler 实例 | -             |

## 功能特性

- ✅ 完整的 BPMN 2.0 编辑功能
- ✅ 属性面板
- ✅ 导入/导出 BPMN XML
- ✅ 导出 SVG
- ✅ 缩放控制
- ✅ 撤销/重做
- ✅ Element Plus UI 集成
- ✅ Vue 3 + TypeScript 支持

## 更多内容

详细教程请参考：`docs/bpmn-js使用教程.md`
