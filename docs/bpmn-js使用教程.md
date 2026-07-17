# bpmn.js 使用教程

## 目录

1. [简介](#简介)
2. [安装](#安装)
3. [基础使用](#基础使用)
4. [高级功能](#高级功能)
5. [在 Vue 3 + TypeScript 项目中集成](#在-vue-3--typescript-项目中集成)
6. [常见问题](#常见问题)
7. [参考资料](#参考资料)

---

## 简介

**bpmn.js** 是一个基于 Web 的 BPMN 2.0 流程图渲染和编辑工具库，由 Camunda 团队开发。它允许你在浏览器中查看、编辑和导出 BPMN 2.0 流程图。

### 主要特性

- 完整的 BPMN 2.0 规范支持
- 可嵌入的流程图编辑器
- 自定义样式和主题
- 插件扩展机制
- 支持导入/导出 BPMN XML 文件
- 响应式设计

---

## 安装

### 使用 pnpm 安装（推荐）

```bash
pnpm add bpmn-js bpmn-js-properties-panel @bpmn-io/properties-panel
```

### 使用 npm 安装

```bash
npm install bpmn-js bpmn-js-properties-panel @bpmn-io/properties-panel
```

### 使用 yarn 安装

```bash
yarn add bpmn-js bpmn-js-properties-panel @bpmn-io/properties-panel
```

### 类型声明

bpmn.js 自带类型声明，TypeScript 项目可以直接使用。

---

## 基础使用

### 1. 简单的渲染示例

```html
<!DOCTYPE html>
<html>
  <head>
    <title>BPMN.js 示例</title>
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/bpmn-js@15.1.3/dist/assets/diagram-js.css"
    />
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/bpmn-js@15.1.3/dist/assets/bpmn-font/css/bpmn.css"
    />
    <style>
      #canvas {
        width: 100%;
        height: 600px;
        border: 1px solid #ccc;
      }
    </style>
  </head>
  <body>
    <div id="canvas"></div>
    <script src="https://cdn.jsdelivr.net/npm/bpmn-js@15.1.3/dist/bpmn-viewer.development.js"></script>
    <script>
      const bpmnXML = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" 
                  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" 
                  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" 
                  xmlns:di="http://www.omg.org/spec/DD/20100524/DI" 
                  id="Definitions_1" 
                  targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="Process_1" isExecutable="false">
    <bpmn:startEvent id="StartEvent_1" name="开始"/>
    <bpmn:task id="Task_1" name="任务1"/>
    <bpmn:endEvent id="EndEvent_1" name="结束"/>
    <bpmn:sequenceFlow id="Flow_1" sourceRef="StartEvent_1" targetRef="Task_1"/>
    <bpmn:sequenceFlow id="Flow_2" sourceRef="Task_1" targetRef="EndEvent_1"/>
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNShape id="StartEvent_1_di" bpmnElement="StartEvent_1">
        <dc:Bounds x="180" y="160" width="36" height="36"/>
        <bpmndi:BPMNLabel><dc:Bounds x="187" y="203" width="22" height="14"/></bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Task_1_di" bpmnElement="Task_1">
        <dc:Bounds x="280" y="140" width="100" height="80"/>
        <bpmndi:BPMNLabel><dc:Bounds x="314" y="171" width="32" height="18"/></bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="EndEvent_1_di" bpmnElement="EndEvent_1">
        <dc:Bounds x="440" y="160" width="36" height="36"/>
        <bpmndi:BPMNLabel><dc:Bounds x="448" y="203" width="22" height="14"/></bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_1_di" bpmnElement="Flow_1">
        <di:waypoint x="216" y="178"/>
        <di:waypoint x="280" y="180"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_2_di" bpmnElement="Flow_2">
        <di:waypoint x="380" y="180"/>
        <di:waypoint x="440" y="178"/>
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;

      const viewer = new BpmnJS({
        container: "#canvas"
      });

      viewer
        .importXML(bpmnXML)
        .then(() => {
          viewer.get("canvas").zoom("fit-viewport");
        })
        .catch(err => {
          console.error("导入失败:", err);
        });
    </script>
  </body>
</html>
```

### 2. 编辑器模式

```javascript
import BpmnModeler from "bpmn-js/lib/Modeler";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";

const modeler = new BpmnModeler({
  container: "#canvas",
  keyboard: {
    bindTo: window
  }
});

// 导入 BPMN XML
async function importDiagram(xml) {
  try {
    const { warnings } = await modeler.importXML(xml);
    if (warnings.length) {
      console.warn("导入警告:", warnings);
    }
    modeler.get("canvas").zoom("fit-viewport");
  } catch (err) {
    console.error("导入失败:", err);
  }
}

// 导出 BPMN XML
async function exportDiagram() {
  try {
    const { xml } = await modeler.saveXML({ format: true });
    return xml;
  } catch (err) {
    console.error("导出失败:", err);
  }
}

// 导出 SVG
async function exportSVG() {
  try {
    const { svg } = await modeler.saveSVG();
    return svg;
  } catch (err) {
    console.error("导出 SVG 失败:", err);
  }
}
```

---

## 高级功能

### 1. 添加属性面板

```javascript
import BpmnModeler from "bpmn-js/lib/Modeler";
import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule
} from "bpmn-js-properties-panel";
import "bpmn-js-properties-panel/dist/assets/properties-panel.css";

const modeler = new BpmnModeler({
  container: "#canvas",
  propertiesPanel: {
    parent: "#properties-panel"
  },
  additionalModules: [BpmnPropertiesPanelModule, BpmnPropertiesProviderModule]
});
```

### 2. 自定义元素

```javascript
// 自定义形状
const customElements = {
  name: "customElements",
  init: function (eventBus, elementRegistry, modeling) {
    eventBus.on("elementFactory.create", event => {
      if (event.element.type === "bpmn:Task") {
        // 自定义任务样式
      }
    });
  }
};

customElements.$inject = ["eventBus", "elementRegistry", "modeling"];

const modeler = new BpmnModeler({
  container: "#canvas",
  additionalModules: [customElements]
});
```

### 3. 事件监听

```javascript
// 元素选择事件
modeler.on("selection.changed", event => {
  console.log("选中元素:", event.newSelection);
});

// 元素创建事件
modeler.on("create.end", event => {
  console.log("创建元素:", event.shape);
});

// 元素移动事件
modeler.on("elements.changed", event => {
  console.log("元素变化:", event.elements);
});

// 连接创建事件
modeler.on("connect.end", event => {
  console.log("创建连接:", event.connection);
});
```

### 4. 自定义 Palette（工具栏）

```javascript
import BpmnModeler from "bpmn-js/lib/Modeler";

const CustomPalette = {
  name: "customPalette",
  paletteProvider: ["type", CustomPaletteProvider]
};

class CustomPaletteProvider {
  constructor(create, elementFactory, palette, translate) {
    this.create = create;
    this.elementFactory = elementFactory;
    this.translate = translate;

    palette.registerProvider(this);
  }

  getPaletteEntries(element) {
    const { create, elementFactory, translate } = this;

    function createTask() {
      return function (event) {
        const shape = elementFactory.createShape({
          type: "bpmn:Task"
        });
        create.start(event, shape);
      };
    }

    return {
      "create.task": {
        group: "activity",
        className: "bpmn-icon-task",
        title: translate("创建任务"),
        action: {
          dragstart: createTask(),
          click: createTask()
        }
      }
    };
  }
}

CustomPaletteProvider.$inject = [
  "create",
  "elementFactory",
  "palette",
  "translate"
];

const modeler = new BpmnModeler({
  container: "#canvas",
  additionalModules: [CustomPalette]
});
```

---

## 在 Vue 3 + TypeScript 项目中集成

### 1. 创建 BpmnEditor 组件

```vue
<template>
  <div class="bpmn-editor-container">
    <div class="toolbar">
      <el-button @click="handleImport">导入</el-button>
      <el-button @click="handleExportXml">导出 XML</el-button>
      <el-button @click="handleExportSvg">导出 SVG</el-button>
      <el-button @click="handleReset">重置</el-button>
      <el-button @click="handleZoomIn">放大</el-button>
      <el-button @click="handleZoomOut">缩小</el-button>
      <el-button @click="handleZoomFit">适应</el-button>
    </div>
    <div class="editor-wrapper">
      <div ref="canvasRef" class="canvas"></div>
      <div ref="propertiesRef" class="properties-panel"></div>
    </div>
    <input
      ref="fileInputRef"
      type="file"
      accept=".bpmn,.xml"
      style="display: none"
      @change="handleFileChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import BpmnModeler from "bpmn-js/lib/Modeler";
import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule,
  CamundaPlatformPropertiesProviderModule
} from "bpmn-js-properties-panel";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import "bpmn-js-properties-panel/dist/assets/properties-panel.css";
import { ElMessage } from "element-plus";

const canvasRef = ref<HTMLElement>();
const propertiesRef = ref<HTMLElement>();
const fileInputRef = ref<HTMLInputElement>();
let modeler: BpmnModeler | null = null;

// 默认 BPMN XML
const defaultXml = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" 
                  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" 
                  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" 
                  xmlns:di="http://www.omg.org/spec/DD/20100524/DI" 
                  id="Definitions_1" 
                  targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="Process_1" name="流程" isExecutable="false">
    <bpmn:startEvent id="StartEvent_1" name="开始"/>
    <bpmn:endEvent id="EndEvent_1" name="结束"/>
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNShape id="StartEvent_1_di" bpmnElement="StartEvent_1">
        <dc:Bounds x="180" y="160" width="36" height="36"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="EndEvent_1_di" bpmnElement="EndEvent_1">
        <dc:Bounds x="380" y="160" width="36" height="36"/>
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>`;

// 初始化模型器
const initModeler = () => {
  if (!canvasRef.value || !propertiesRef.value) return;

  modeler = new BpmnModeler({
    container: canvasRef.value,
    propertiesPanel: {
      parent: propertiesRef.value
    },
    additionalModules: [
      BpmnPropertiesPanelModule,
      BpmnPropertiesProviderModule,
      CamundaPlatformPropertiesProviderModule
    ],
    keyboard: {
      bindTo: window
    }
  });

  // 监听事件
  modeler.on("selection.changed", event => {
    console.log("选中元素:", event.newSelection);
  });

  modeler.on("commandStack.changed", () => {
    console.log("命令栈变化");
  });

  importDiagram(defaultXml);
};

// 导入流程图
const importDiagram = async (xml: string) => {
  if (!modeler) return;
  try {
    const { warnings } = await modeler.importXML(xml);
    if (warnings.length) {
      console.warn("导入警告:", warnings);
    }
    const canvas = modeler.get("canvas");
    canvas.zoom("fit-viewport");
    ElMessage.success("导入成功");
  } catch (err) {
    console.error("导入失败:", err);
    ElMessage.error("导入失败");
  }
};

// 导出 XML
const handleExportXml = async () => {
  if (!modeler) return;
  try {
    const { xml } = await modeler.saveXML({ format: true });
    downloadFile(xml, "diagram.bpmn", "application/xml");
    ElMessage.success("导出 XML 成功");
  } catch (err) {
    console.error("导出失败:", err);
    ElMessage.error("导出 XML 失败");
  }
};

// 导出 SVG
const handleExportSvg = async () => {
  if (!modeler) return;
  try {
    const { svg } = await modeler.saveSVG();
    downloadFile(svg, "diagram.svg", "image/svg+xml");
    ElMessage.success("导出 SVG 成功");
  } catch (err) {
    console.error("导出 SVG 失败:", err);
    ElMessage.error("导出 SVG 失败");
  }
};

// 下载文件
const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// 导入文件
const handleImport = () => {
  fileInputRef.value?.click();
};

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = e => {
    const content = e.target?.result as string;
    importDiagram(content);
  };
  reader.readAsText(file);
  target.value = "";
};

// 重置
const handleReset = () => {
  importDiagram(defaultXml);
};

// 缩放控制
const handleZoomIn = () => {
  if (!modeler) return;
  const canvas = modeler.get("canvas");
  canvas.zoom(canvas.zoom() * 1.2);
};

const handleZoomOut = () => {
  if (!modeler) return;
  const canvas = modeler.get("canvas");
  canvas.zoom(canvas.zoom() * 0.8);
};

const handleZoomFit = () => {
  if (!modeler) return;
  modeler.get("canvas").zoom("fit-viewport");
};

onMounted(() => {
  initModeler();
});

onUnmounted(() => {
  if (modeler) {
    modeler.destroy();
    modeler = null;
  }
});
</script>

<style lang="scss" scoped>
.bpmn-editor-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .toolbar {
    padding: 12px;
    background: #f5f7fa;
    border-bottom: 1px solid #e4e7ed;
    display: flex;
    gap: 8px;
  }

  .editor-wrapper {
    flex: 1;
    display: flex;
    overflow: hidden;

    .canvas {
      flex: 1;
      background: #ffffff;
      position: relative;
    }

    .properties-panel {
      width: 300px;
      background: #ffffff;
      border-left: 1px solid #e4e7ed;
      overflow-y: auto;
    }
  }
}

:deep(.bjs-powered-by) {
  display: none;
}
</style>
```

### 2. 在路由中使用

```typescript
// src/router/modules/test.ts
import { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw = {
  path: "/bpmn",
  name: "Bpmn",
  component: () => import("@/views/demoTest/bpm.vue"),
  meta: {
    title: "BPMN 流程图编辑器",
    icon: "Workflow"
  }
};

export default routes;
```

### 3. 更新 bpm.vue 页面

```vue
<script setup lang="ts">
import BpmnEditor from "@/components/BpmnEditor/index.vue";
</script>

<template>
  <div class="bpm-page">
    <BpmnEditor />
  </div>
</template>

<style lang="scss" scoped>
.bpm-page {
  width: 100%;
  height: calc(100vh - 120px);
}
</style>
```

### 4. 完整的组件目录结构

建议在项目中创建如下结构：

```
src/
├── components/
│   └── BpmnEditor/
│       ├── index.vue           # 主组件
│       ├── hooks/
│       │   └── useBpmn.ts      # 逻辑抽离
│       ├── types/
│       │   └── index.ts        # 类型定义
│       └── utils/
│           └── index.ts        # 工具函数
└── views/
    └── demoTest/
        └── bpm.vue
```

### 5. 使用 Composable 抽离逻辑

```typescript
// src/components/BpmnEditor/hooks/useBpmn.ts
import { ref } from "vue";
import BpmnModeler from "bpmn-js/lib/Modeler";
import { ElMessage } from "element-plus";

export function useBpmn() {
  const modeler = ref<BpmnModeler | null>(null);

  const initModeler = (
    container: HTMLElement,
    propertiesPanel?: HTMLElement
  ) => {
    modeler.value = new BpmnModeler({
      container,
      propertiesPanel: propertiesPanel
        ? { parent: propertiesPanel }
        : undefined,
      keyboard: { bindTo: window }
    });

    return modeler.value;
  };

  const importXML = async (xml: string) => {
    if (!modeler.value) return;
    try {
      await modeler.value.importXML(xml);
      modeler.value.get("canvas").zoom("fit-viewport");
      ElMessage.success("导入成功");
    } catch (err) {
      console.error(err);
      ElMessage.error("导入失败");
    }
  };

  const saveXML = async () => {
    if (!modeler.value) return "";
    try {
      const { xml } = await modeler.value.saveXML({ format: true });
      return xml;
    } catch (err) {
      console.error(err);
      return "";
    }
  };

  const saveSVG = async () => {
    if (!modeler.value) return "";
    try {
      const { svg } = await modeler.value.saveSVG();
      return svg;
    } catch (err) {
      console.error(err);
      return "";
    }
  };

  const destroy = () => {
    if (modeler.value) {
      modeler.value.destroy();
      modeler.value = null;
    }
  };

  return {
    modeler,
    initModeler,
    importXML,
    saveXML,
    saveSVG,
    destroy
  };
}
```

---

## 常见问题

### 1. 样式不显示

确保正确引入了 CSS 文件：

```javascript
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import "bpmn-js-properties-panel/dist/assets/properties-panel.css";
```

### 2. 类型错误

在 TypeScript 中，如果遇到类型问题，可以在 `src/types` 目录下添加声明文件：

```typescript
// src/types/bpmn-js.d.ts
declare module "bpmn-js/lib/Modeler";
declare module "bpmn-js/lib/Viewer";
declare module "bpmn-js-properties-panel";
```

### 3. 画布高度问题

确保容器元素有明确的高度：

```css
.canvas {
  width: 100%;
  height: 600px; /* 或使用 calc(100vh - xxx) */
}
```

### 4. 中文乱码

确保 HTML 文件使用 UTF-8 编码：

```html
<meta charset="UTF-8" />
```

### 5. 性能优化

对于大型流程图，可以：

- 使用 Viewer 而非 Modeler（只读模式）
- 延迟加载
- 启用缩放优化

```javascript
// 只用于查看
import BpmnViewer from "bpmn-js/lib/Viewer";

const viewer = new BpmnViewer({
  container: "#canvas"
});
```

---

## 参考资料

### 官方资源

- **GitHub**: [https://github.com/bpmn-io/bpmn-js](https://github.com/bpmn-io/bpmn-js)
- **官网**: [https://bpmn.io/](https://bpmn.io/)
- **文档**: [https://github.com/bpmn-io/bpmn-js/tree/master/docs](https://github.com/bpmn-io/bpmn-js/tree/master/docs)
- **示例**: [https://github.com/bpmn-io/bpmn-js-examples](https://github.com/bpmn-io/bpmn-js-examples)

### 相关库

- **diagram-js**: bpmn-js 的底层图形库
- **bpmn-moddle**: BPMN XML 解析库
- **bpmn-js-properties-panel**: 属性面板扩展

### BPMN 2.0 规范

- [OMG BPMN 2.0 Specification](https://www.omg.org/spec/BPMN/2.0/)
- [BPMN 2.0 中文教程](https://www.mosquitotec.com/bpmn2-tutorial/)

### 社区资源

- [Stack Overflow - bpmn-js](https://stackoverflow.com/questions/tagged/bpmn-js)
- [Camunda Forum](https://forum.camunda.io/)

---

## 下一步

1. 安装依赖并运行示例
2. 尝试自定义元素和样式
3. 集成到你的业务流程中
4. 探索更多插件和扩展

祝使用愉快！
