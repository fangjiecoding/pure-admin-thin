# AntV X6 使用教程

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

**AntV X6** 是 AntV 旗下的图编辑引擎，提供开箱即用的组件、低成本定制扩展能力和强劲的性能，能快速搭建 DAG 图、ER 图、流程图、血缘图等各类图应用。

### 主要特性

- 📦 **开箱即用**：内置 5 种布局、3 种节点形状、3 种边形状
- 🔧 **定制能力强**：基于 SVG 可以定制任意形状的节点和边
- 🎯 **事件系统完备**：可以监听画布上的任意事件
- 📱 **高性能**：支持虚拟滚动等特性
- 🎨 **插件化**：支持小地图、对齐线、网格、撤销/重做等插件
- 🔄 **数据驱动**：支持 JSON 数据的导入导出

---

## 安装

### 使用 pnpm 安装（推荐）

```bash
pnpm add @antv/x6
```

### 安装常用插件

```bash
pnpm add @antv/x6-plugin-dnd @antv/x6-plugin-snapline @antv/x6-plugin-minimap @antv/x6-plugin-history @antv/x6-plugin-selection @antv/x6-plugin-keyboard
```

### 使用 npm 安装

```bash
npm install @antv/x6
```

### 使用 yarn 安装

```bash
yarn add @antv/x6
```

### 类型支持

X6 使用 TypeScript 开发，自带完整的类型声明。

---

## 基础使用

### 1. 简单的画布示例

```html
&lt;!DOCTYPE html&gt; &lt;html lang="zh-CN"&gt; &lt;head&gt; &lt;meta
charset="UTF-8"&gt; &lt;meta name="viewport" content="width=device-width,
initial-scale=1.0"&gt; &lt;title&gt;X6 基础示例&lt;/title&gt; &lt;style&gt;
#container { width: 100%; height: 600px; background-color: #f2f7fa; }
&lt;/style&gt; &lt;/head&gt; &lt;body&gt; &lt;div id="container"&gt;&lt;/div&gt;
&lt;script src="https://unpkg.com/@antv/x6/dist/x6.js"&gt;&lt;/script&gt;
&lt;script&gt; const { Graph } = X6; // 创建画布 const graph = new Graph({
container: document.getElementById('container'), grid: true, panning: true,
mousewheel: { enabled: true, modifiers: ['ctrl', 'meta'], }, }); // 添加节点
const source = graph.addNode({ x: 100, y: 200, width: 120, height: 60, label:
'开始', attrs: { body: { fill: '#5F95FF', stroke: '#5F95FF', rx: 6, ry: 6, },
label: { fill: '#fff', fontSize: 14, }, }, }); const target = graph.addNode({ x:
400, y: 200, width: 120, height: 60, label: '结束', attrs: { body: { fill:
'#5F95FF', stroke: '#5F95FF', rx: 6, ry: 6, }, label: { fill: '#fff', fontSize:
14, }, }, }); // 添加边 graph.addEdge({ source: source, target: target, label:
'连线', attrs: { line: { stroke: '#A2B1C3', strokeWidth: 2, targetMarker: {
name: 'block', width: 12, height: 8, }, }, }, }); &lt;/script&gt; &lt;/body&gt;
&lt;/html&gt;
```

### 2. 数据驱动方式

```javascript
import { Graph } from "@antv/x6";

const graph = new Graph({
  container: document.getElementById("container"),
  grid: true
});

// 使用数据初始化
const data = {
  nodes: [
    {
      id: "node1",
      x: 100,
      y: 200,
      width: 120,
      height: 60,
      label: "节点1"
    },
    {
      id: "node2",
      x: 400,
      y: 200,
      width: 120,
      height: 60,
      label: "节点2"
    }
  ],
  edges: [
    {
      source: "node1",
      target: "node2",
      label: "连线"
    }
  ]
};

graph.fromJSON(data);

// 导出数据
const json = graph.toJSON();
console.log(json);
```

### 3. 内置形状

```javascript
import { Shape } from "@antv/x6";

// 矩形
graph.addNode({
  shape: "rect",
  x: 100,
  y: 100,
  width: 100,
  height: 60,
  label: "矩形"
});

// 圆形
graph.addNode({
  shape: "circle",
  x: 280,
  y: 100,
  width: 80,
  height: 80,
  label: "圆形"
});

// 椭圆
graph.addNode({
  shape: "ellipse",
  x: 420,
  y: 100,
  width: 120,
  height: 60,
  label: "椭圆"
});

// 多边形
graph.addNode({
  shape: "polygon",
  x: 100,
  y: 240,
  width: 80,
  height: 80,
  label: "多边形",
  attrs: {
    body: {
      refPoints: "0,10 10,0 20,10 10,20"
    }
  }
});

// 路径
graph.addNode({
  shape: "path",
  x: 280,
  y: 240,
  width: 80,
  height: 80,
  label: "路径",
  attrs: {
    body: {
      d: "M20 0 L40 20 L20 40 L0 20 Z"
    }
  }
});
```

---

## 高级功能

### 1. 自定义节点形状

```javascript
import { Graph, Shape } from '@antv/x6';

// 方式一：通过 attrs 配置
graph.addNode({
  x: 100,
  y: 100,
  width: 120,
  height: 60,
  attrs: {
    body: {
      fill: '#fff',
      stroke: '#5F95FF',
      strokeWidth: 2,
      rx: 6,
      ry: 6,
    },
    label: {
      text: '自定义节点',
      fill: '#262626',
      fontSize: 14,
    },
    // 添加图标
    image: {
      'xlink:href': 'https://gw.alipayobjects.com/zos/antfincdn/FLrTNDvlna/antv.png',
      width: 16,
      height: 16,
      x: 12,
      y: 12,
    },
  },
});

// 方式二：继承 Shape.Rect 创建自定义类
class CustomNode extends Shape.Rect {
  constructor(metadata = {}) {
    super({
      ...metadata,
      attrs: {
        ...metadata.attrs,
        body: {
          fill: '#EFF4FF',
          stroke: '#5F95FF',
          strokeWidth: 2,
          rx: 6,
          ry: 6,
        },
        label: {
          fill: '#262626',
          fontSize: 14,
        },
      },
    });
  }
}

graph.addNode(new CustomNode({
  x: 300,
  y: 100,
  width: 120,
  height: 60,
  label: '自定义类节点',
}));

// 方式三：使用 HTML 节点
graph.addNode({
  shape: 'html',
  x: 100,
  y: 200,
  width: 200,
  height: 100,
  html: () =&gt; {
    const wrap = document.createElement('div');
    wrap.style.width = '100%';
    wrap.style.height = '100%';
    wrap.style.display = 'flex';
    wrap.style.alignItems = 'center';
    wrap.style.justifyContent = 'center';
    wrap.style.border = '2px solid #5F95FF';
    wrap.style.borderRadius = '6px';
    wrap.style.background = '#EFF4FF';
    wrap.innerHTML = '&lt;span style="color: #262626"&gt;HTML 节点&lt;/span&gt;';
    return wrap;
  },
});
```

### 2. 使用插件

```javascript
import { Graph } from '@antv/x6';
import { Snapline } from '@antv/x6-plugin-snapline';
import { Selection } from '@antv/x6-plugin-selection';
import { Keyboard } from '@antv/x6-plugin-keyboard';
import { History } from '@antv/x6-plugin-history';
import { MiniMap } from '@antv/x6-plugin-minimap';

const graph = new Graph({
  container: document.getElementById('container'),
  grid: true,
  panning: true,
  mousewheel: true,
});

// 对齐线
graph.use(new Snapline({
  enabled: true,
}));

// 框选
graph.use(new Selection({
  enabled: true,
  multiple: true,
  rubberband: true,
  movable: true,
  showNodeSelectionBox: true,
}));

// 键盘快捷键
graph.use(new Keyboard({
  enabled: true,
}));

// 撤销/重做
graph.use(new History({
  enabled: true,
}));

// 小地图
graph.use(new MiniMap({
  container: document.getElementById('minimap'),
  width: 200,
  height: 160,
}));

// 绑定键盘事件
graph.bindKey(['meta+c', 'ctrl+c'], () =&gt; {
  const cells = graph.getSelectedCells();
  if (cells.length) {
    graph.copy(cells);
  }
});

graph.bindKey(['meta+v', 'ctrl+v'], () =&gt; {
  if (!graph.isClipboardEmpty()) {
    const cells = graph.paste({ offset: 32 });
    graph.cleanSelection();
    graph.select(cells);
  }
});

graph.bindKey(['meta+z', 'ctrl+z'], () =&gt; {
  if (graph.canUndo()) {
    graph.undo();
  }
});

graph.bindKey(['meta+shift+z', 'ctrl+shift+z'], () =&gt; {
  if (graph.canRedo()) {
    graph.redo();
  }
});

graph.bindKey(['backspace', 'delete'], () =&gt; {
  const cells = graph.getSelectedCells();
  if (cells.length) {
    graph.removeCells(cells);
  }
});
```

### 3. 拖拽 DnD

```javascript
import { Graph } from '@antv/x6';
import { Dnd } from '@antv/x6-plugin-dnd';

const graph = new Graph({
  container: document.getElementById('container'),
  grid: true,
});

// 创建 DnD 实例
const dnd = new Dnd({
  target: graph,
  scaled: false,
});

// 准备拖拽节点
const node1 = graph.createNode({
  width: 100,
  height: 40,
  label: '节点1',
  attrs: {
    body: {
      fill: '#EFF4FF',
      stroke: '#5F95FF',
    },
  },
});

const node2 = graph.createNode({
  width: 100,
  height: 40,
  label: '节点2',
  attrs: {
    body: {
      fill: '#F6FFED',
      stroke: '#73D13D',
    },
  },
});

// 将节点添加到侧边栏
document.getElementById('node1').addEventListener('mousedown', (e) =&gt; {
  dnd.start(node1.clone(), e);
});

document.getElementById('node2').addEventListener('mousedown', (e) =&gt; {
  dnd.start(node2.clone(), e);
});
```

### 4. 事件监听

```javascript
import { Graph } from '@antv/x6';

const graph = new Graph({
  container: document.getElementById('container'),
});

// 节点点击
graph.on('node:click', ({ node, e }) =&gt; {
  console.log('点击节点:', node.id);
});

// 边点击
graph.on('edge:click', ({ edge, e }) =&gt; {
  console.log('点击边:', edge.id);
});

// 空白区域点击
graph.on('blank:click', ({ e }) =&gt; {
  console.log('点击空白区域');
});

// 节点移动
graph.on('node:mouseup', ({ node, e }) =&gt; {
  console.log('节点位置:', node.position());
});

// 节点添加
graph.on('node:added', ({ node }) =&gt; {
  console.log('添加节点:', node.id);
});

// 边添加
graph.on('edge:added', ({ edge }) =&gt; {
  console.log('添加边:', edge.id);
});

// 节点移除
graph.on('node:removed', ({ node }) =&gt; {
  console.log('移除节点:', node.id);
});

// 边移除
graph.on('edge:removed', ({ edge }) =&gt; {
  console.log('移除边:', edge.id);
});

// 选择变化
graph.on('selection:changed', ({ selected, removed }) =&gt; {
  console.log('选中:', selected);
  console.log('取消选中:', removed);
});

// 画布变化
graph.on('graph:mouseenter', () =&gt; {
  console.log('鼠标进入画布');
});

graph.on('graph:mouseleave', () =&gt; {
  console.log('鼠标离开画布');
});
```

### 5. 连线配置

```javascript
import { Graph } from "@antv/x6";

const graph = new Graph({
  container: document.getElementById("container"),
  connecting: {
    // 连线路由器
    router: {
      name: "manhattan",
      args: {
        padding: 1
      }
    },
    // 连线连接器
    connector: {
      name: "rounded",
      args: {
        radius: 8
      }
    },
    // 锚点
    anchor: "center",
    // 连接点
    connectionPoint: "boundary",
    // 是否允许连接到画布空白位置
    allowBlank: false,
    // 是否允许连接到节点
    allowNode: true,
    // 是否允许连接到边
    allowEdge: false,
    // 是否允许创建循环连线
    allowLoop: false,
    // 是否允许连接到同一个节点
    allowMulti: true,
    // 高亮显示所有可用的连接桩或节点
    highlight: true,
    // 当连接到节点时，通过 magnet 来判断是否能够连接
    magnet: true,
    // 当鼠标移动到边上方时，自动创建连接桩
    createEdge() {
      return graph.createEdge({
        attrs: {
          line: {
            stroke: "#A2B1C3",
            strokeWidth: 2,
            targetMarker: {
              name: "block",
              width: 12,
              height: 8
            }
          }
        },
        zIndex: 0
      });
    }
  }
});

// 配置连接桩
graph.addNode({
  x: 100,
  y: 100,
  width: 120,
  height: 60,
  label: "节点",
  ports: {
    groups: {
      top: {
        position: "top",
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: "#5F95FF",
            strokeWidth: 1,
            fill: "#fff"
          }
        }
      },
      right: {
        position: "right",
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: "#5F95FF",
            strokeWidth: 1,
            fill: "#fff"
          }
        }
      },
      bottom: {
        position: "bottom",
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: "#5F95FF",
            strokeWidth: 1,
            fill: "#fff"
          }
        }
      },
      left: {
        position: "left",
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: "#5F95FF",
            strokeWidth: 1,
            fill: "#fff"
          }
        }
      }
    },
    items: [
      { group: "top", id: "port-top" },
      { group: "right", id: "port-right" },
      { group: "bottom", id: "port-bottom" },
      { group: "left", id: "port-left" }
    ]
  }
});
```

### 6. 布局

```javascript
import { Graph } from "@antv/x6";
import { Layout } from "@antv/layout";

const graph = new Graph({
  container: document.getElementById("container")
});

// 准备数据
const data = {
  nodes: [
    { id: "node1" },
    { id: "node2" },
    { id: "node3" },
    { id: "node4" },
    { id: "node5" }
  ],
  edges: [
    { source: "node1", target: "node2" },
    { source: "node1", target: "node3" },
    { source: "node2", target: "node4" },
    { source: "node3", target: "node5" }
  ]
};

// DAG 布局
const dagreLayout = new Layout.DagreLayout({
  type: "dagre",
  rankdir: "TB",
  align: "UL",
  nodesep: 60,
  ranksep: 60
});

const model = dagreLayout.layout(data);
graph.fromJSON(model);

// 其他布局类型
// - GridLayout: 网格布局
// - FruchtermanLayout: 力导向布局
// - CircularLayout: 环形布局
// - RadialLayout: 径向布局
// - MDSLayout: 多维缩放布局
```

---

## 在 Vue 3 + TypeScript 项目中集成

### 1. 创建 X6Editor 组件

```vue
&lt;template&gt; &lt;div class="x6-editor-container"&gt; &lt;div
class="toolbar"&gt; &lt;el-button @click="handleImport"&gt;
&lt;el-icon&gt;&lt;Upload /&gt;&lt;/el-icon&gt; 导入 &lt;/el-button&gt;
&lt;el-button type="primary" @click="handleExportJson"&gt;
&lt;el-icon&gt;&lt;Download /&gt;&lt;/el-icon&gt; 导出 JSON &lt;/el-button&gt;
&lt;el-button @click="handleExportSvg"&gt; &lt;el-icon&gt;&lt;Picture
/&gt;&lt;/el-icon&gt; 导出 SVG &lt;/el-button&gt; &lt;el-button
@click="handleReset"&gt; &lt;el-icon&gt;&lt;RefreshLeft /&gt;&lt;/el-icon&gt;
重置 &lt;/el-button&gt; &lt;el-divider direction="vertical" /&gt; &lt;el-button
@click="handleZoomIn"&gt; &lt;el-icon&gt;&lt;ZoomIn /&gt;&lt;/el-icon&gt; 放大
&lt;/el-button&gt; &lt;el-button @click="handleZoomOut"&gt;
&lt;el-icon&gt;&lt;ZoomOut /&gt;&lt;/el-icon&gt; 缩小 &lt;/el-button&gt;
&lt;el-button @click="handleZoomFit"&gt; &lt;el-icon&gt;&lt;FullScreen
/&gt;&lt;/el-icon&gt; 适应 &lt;/el-button&gt; &lt;el-divider
direction="vertical" /&gt; &lt;el-button :disabled="!canUndo"
@click="handleUndo"&gt; &lt;el-icon&gt;&lt;DArrowLeft /&gt;&lt;/el-icon&gt; 撤销
&lt;/el-button&gt; &lt;el-button :disabled="!canRedo" @click="handleRedo"&gt;
&lt;el-icon&gt;&lt;DArrowRight /&gt;&lt;/el-icon&gt; 重做 &lt;/el-button&gt;
&lt;/div&gt; &lt;div class="editor-wrapper"&gt; &lt;div class="sidebar"&gt;
&lt;div class="sidebar-title"&gt;节点列表&lt;/div&gt; &lt;div
class="sidebar-content"&gt; &lt;div v-for="item in nodeTypes" :key="item.type"
class="sidebar-node" :style="{ background: item.color }"
@mousedown="handleDragStart($event, item)" &gt;
{{ item.label }}
&lt;/div&gt; &lt;/div&gt; &lt;/div&gt; &lt;div ref="containerRef" class="canvas"
/&gt; &lt;div class="minimap-wrapper"&gt; &lt;div
class="minimap-title"&gt;小地图&lt;/div&gt; &lt;div ref="minimapRef"
class="minimap" /&gt; &lt;/div&gt; &lt;/div&gt; &lt;input ref="fileInputRef"
type="file" accept=".json" style="display: none" @change="handleFileChange"
/&gt; &lt;!-- JSON 预览对话框 --&gt; &lt;el-dialog
v-model="previewDialogVisible" title="JSON 预览" width="70%"
:close-on-click-modal="false" destroy-on-close &gt; &lt;div
class="json-preview-container"&gt; &lt;pre class="json-content"&gt;{{
  previewJsonContent
}}&lt;/pre&gt; &lt;/div&gt; &lt;template #footer&gt; &lt;el-button
@click="previewDialogVisible = false"&gt;关闭&lt;/el-button&gt; &lt;el-button
type="primary" @click="handleCopyJson"&gt; &lt;el-icon&gt;&lt;DocumentCopy
/&gt;&lt;/el-icon&gt; 复制 JSON &lt;/el-button&gt; &lt;/template&gt;
&lt;/el-dialog&gt; &lt;/div&gt; &lt;/template&gt; &lt;script setup lang="ts"&gt;
import { ref, onMounted, onUnmounted } from 'vue'; import { Graph, Shape } from
'@antv/x6'; import { Snapline } from '@antv/x6-plugin-snapline'; import {
Selection } from '@antv/x6-plugin-selection'; import { Keyboard } from
'@antv/x6-plugin-keyboard'; import { History } from '@antv/x6-plugin-history';
import { MiniMap } from '@antv/x6-plugin-minimap'; import { Dnd } from
'@antv/x6-plugin-dnd'; import { ElMessage } from 'element-plus'; import {
Upload, Download, Picture, RefreshLeft, ZoomIn, ZoomOut, FullScreen, DArrowLeft,
DArrowRight, DocumentCopy, } from '@element-plus/icons-vue'; const emit =
defineEmits&lt;{ (e: 'change', data: any): void; (e: 'select', cells: any[]):
void; }&gt;(); const props = defineProps&lt;{ data?: any; }&gt;(); const
containerRef = ref&lt;HTMLElement&gt;(); const minimapRef =
ref&lt;HTMLElement&gt;(); const fileInputRef = ref&lt;HTMLInputElement&gt;();
let graph: Graph | null = null; let dnd: Dnd | null = null; const canUndo =
ref(false); const canRedo = ref(false); const previewDialogVisible = ref(false);
const previewJsonContent = ref(''); // 节点类型 const nodeTypes = [ { type:
'start', label: '开始', color: '#EFF4FF', stroke: '#5F95FF' }, { type: 'end',
label: '结束', color: '#FFF1F0', stroke: '#FF4D4F' }, { type: 'process', label:
'处理', color: '#E6F7FF', stroke: '#1890FF' }, { type: 'decision', label:
'判断', color: '#FFF7E6', stroke: '#FA8C16' }, ]; // 默认数据 const defaultData
= { nodes: [ { id: 'start', shape: 'rect', x: 100, y: 200, width: 120, height:
60, label: '开始', attrs: { body: { fill: '#EFF4FF', stroke: '#5F95FF',
strokeWidth: 2, rx: 6, ry: 6, }, label: { fill: '#262626', fontSize: 14, }, },
ports: { groups: { top: { position: 'top', attrs: { circle: { r: 4, magnet:
true, stroke: '#5F95FF', strokeWidth: 1, fill: '#fff' } } }, right: { position:
'right', attrs: { circle: { r: 4, magnet: true, stroke: '#5F95FF', strokeWidth:
1, fill: '#fff' } } }, bottom: { position: 'bottom', attrs: { circle: { r: 4,
magnet: true, stroke: '#5F95FF', strokeWidth: 1, fill: '#fff' } } }, left: {
position: 'left', attrs: { circle: { r: 4, magnet: true, stroke: '#5F95FF',
strokeWidth: 1, fill: '#fff' } } }, }, items: [ { group: 'top', id: 'port-top'
}, { group: 'right', id: 'port-right' }, { group: 'bottom', id: 'port-bottom' },
{ group: 'left', id: 'port-left' }, ], }, }, { id: 'end', shape: 'rect', x: 400,
y: 200, width: 120, height: 60, label: '结束', attrs: { body: { fill: '#FFF1F0',
stroke: '#FF4D4F', strokeWidth: 2, rx: 6, ry: 6, }, label: { fill: '#262626',
fontSize: 14, }, }, ports: { groups: { top: { position: 'top', attrs: { circle:
{ r: 4, magnet: true, stroke: '#FF4D4F', strokeWidth: 1, fill: '#fff' } } },
right: { position: 'right', attrs: { circle: { r: 4, magnet: true, stroke:
'#FF4D4F', strokeWidth: 1, fill: '#fff' } } }, bottom: { position: 'bottom',
attrs: { circle: { r: 4, magnet: true, stroke: '#FF4D4F', strokeWidth: 1, fill:
'#fff' } } }, left: { position: 'left', attrs: { circle: { r: 4, magnet: true,
stroke: '#FF4D4F', strokeWidth: 1, fill: '#fff' } } }, }, items: [ { group:
'top', id: 'port-top' }, { group: 'right', id: 'port-right' }, { group:
'bottom', id: 'port-bottom' }, { group: 'left', id: 'port-left' }, ], }, }, ],
edges: [], }; // 创建节点 const createNode = (item: any) =&gt; { return
graph!.createNode({ width: 120, height: 60, label: item.label, attrs: { body: {
fill: item.color, stroke: item.stroke, strokeWidth: 2, rx: 6, ry: 6, }, label: {
fill: '#262626', fontSize: 14, }, }, ports: { groups: { top: { position: 'top',
attrs: { circle: { r: 4, magnet: true, stroke: item.stroke, strokeWidth: 1,
fill: '#fff' } } }, right: { position: 'right', attrs: { circle: { r: 4, magnet:
true, stroke: item.stroke, strokeWidth: 1, fill: '#fff' } } }, bottom: {
position: 'bottom', attrs: { circle: { r: 4, magnet: true, stroke: item.stroke,
strokeWidth: 1, fill: '#fff' } } }, left: { position: 'left', attrs: { circle: {
r: 4, magnet: true, stroke: item.stroke, strokeWidth: 1, fill: '#fff' } } }, },
items: [ { group: 'top', id: 'port-top' }, { group: 'right', id: 'port-right' },
{ group: 'bottom', id: 'port-bottom' }, { group: 'left', id: 'port-left' }, ],
}, }); }; // 拖拽开始 const handleDragStart = (e: MouseEvent, item: any) =&gt; {
if (!graph || !dnd) return; const node = createNode(item); dnd.start(node, e);
}; // 更新撤销/重做状态 const updateUndoRedoState = () =&gt; { if (!graph)
return; canUndo.value = graph.canUndo(); canRedo.value = graph.canRedo(); }; //
初始化画布 const initGraph = () =&gt; { if (!containerRef.value ||
!minimapRef.value) return; graph = new Graph({ container: containerRef.value,
grid: { size: 10, visible: true, type: 'doubleMesh', args: { color: '#eee',
thickness: 1, colorSecond: '#d0d0d0', thicknessSecond: 1, factor: 4, }, },
panning: { enabled: true, eventTypes: ['leftMouseDown', 'mouseWheel'], },
mousewheel: { enabled: true, modifiers: ['ctrl', 'meta'], minScale: 0.5,
maxScale: 2, }, connecting: { router: { name: 'manhattan', args: { padding: 1 },
}, connector: { name: 'rounded', args: { radius: 8 }, }, anchor: 'center',
connectionPoint: 'boundary', allowBlank: false, snap: { radius: 20, },
createEdge() { return graph!.createEdge({ attrs: { line: { stroke: '#A2B1C3',
strokeWidth: 2, targetMarker: { name: 'block', width: 12, height: 8, }, }, },
zIndex: 0, }); }, }, highlighting: { magnetAdsorbed: { name: 'stroke', args: {
attrs: { fill: '#5F95FF', stroke: '#5F95FF', }, }, }, }, }); // 插件
graph.use(new Snapline({ enabled: true })); graph.use(new Selection({ enabled:
true, multiple: true, rubberband: true, movable: true, showNodeSelectionBox:
true, })); graph.use(new Keyboard({ enabled: true })); graph.use(new History({
enabled: true })); graph.use(new MiniMap({ container: minimapRef.value, width:
200, height: 160, padding: 10, })); // DnD dnd = new Dnd({ target: graph,
scaled: false, }); // 键盘快捷键 graph.bindKey(['meta+c', 'ctrl+c'], () =&gt; {
const cells = graph!.getSelectedCells(); if (cells.length) { graph!.copy(cells);
} }); graph.bindKey(['meta+v', 'ctrl+v'], () =&gt; { if
(!graph!.isClipboardEmpty()) { const cells = graph!.paste({ offset: 32 });
graph!.cleanSelection(); graph!.select(cells); } }); graph.bindKey(['meta+z',
'ctrl+z'], () =&gt; { if (graph!.canUndo()) { graph!.undo();
updateUndoRedoState(); } }); graph.bindKey(['meta+shift+z', 'ctrl+shift+z'], ()
=&gt; { if (graph!.canRedo()) { graph!.redo(); updateUndoRedoState(); } });
graph.bindKey(['backspace', 'delete'], () =&gt; { const cells =
graph!.getSelectedCells(); if (cells.length) { graph!.removeCells(cells); } });
// 事件监听 graph.on('history:change', () =&gt; { updateUndoRedoState();
emit('change', graph!.toJSON()); }); graph.on('selection:changed', ({ selected
}) =&gt; { emit('select', selected); }); graph.on('node:added', () =&gt; {
emit('change', graph!.toJSON()); }); graph.on('edge:added', () =&gt; {
emit('change', graph!.toJSON()); }); graph.on('node:removed', () =&gt; {
emit('change', graph!.toJSON()); }); graph.on('edge:removed', () =&gt; {
emit('change', graph!.toJSON()); }); // 导入数据 if (props.data) {
graph.fromJSON(props.data); } else { graph.fromJSON(defaultData); }
updateUndoRedoState(); }; // 导入数据 const importData = (data: any) =&gt; { if
(!graph) return; try { graph.fromJSON(data); updateUndoRedoState();
ElMessage.success('导入成功'); } catch (err) { console.error('导入失败:', err);
ElMessage.error('导入失败'); } }; // 导出 JSON const handleExportJson = () =&gt;
{ if (!graph) return; try { const data = graph.toJSON(); const content =
JSON.stringify(data, null, 2); downloadFile(content, 'graph.json',
'application/json'); ElMessage.success('导出 JSON 成功'); } catch (err) {
console.error('导出失败:', err); ElMessage.error('导出 JSON 失败'); } }; // 导出
SVG const handleExportSvg = () =&gt; { if (!graph) return; try { const svg =
graph.toSVG(); downloadFile(svg, 'graph.svg', 'image/svg+xml');
ElMessage.success('导出 SVG 成功'); } catch (err) { console.error('导出失败:',
err); ElMessage.error('导出 SVG 失败'); } }; // 下载文件 const downloadFile =
(content: string, filename: string, mimeType: string) =&gt; { const blob = new
Blob([content], { type: mimeType }); const url = URL.createObjectURL(blob);
const link = document.createElement('a'); link.href = url; link.download =
filename; document.body.appendChild(link); link.click();
document.body.removeChild(link); URL.revokeObjectURL(url); }; // 导入文件 const
handleImport = () =&gt; { fileInputRef.value?.click(); }; const handleFileChange
= (event: Event) =&gt; { const target = event.target as HTMLInputElement; const
file = target.files?.[0]; if (!file) return; const reader = new FileReader();
reader.onload = (e) =&gt; { try { const content = e.target?.result as string;
const data = JSON.parse(content); importData(data); } catch (err) {
console.error('解析文件失败:', err); ElMessage.error('解析文件失败'); } };
reader.readAsText(file); target.value = ''; }; // 重置 const handleReset = ()
=&gt; { importData(defaultData); }; // 缩放控制 const handleZoomIn = () =&gt; {
if (!graph) return; graph.zoom(0.1); }; const handleZoomOut = () =&gt; { if
(!graph) return; graph.zoom(-0.1); }; const handleZoomFit = () =&gt; { if
(!graph) return; graph.zoomToFit({ padding: 20 }); }; // 撤销/重做 const
handleUndo = () =&gt; { if (!graph) return; if (graph.canUndo()) { graph.undo();
updateUndoRedoState(); } }; const handleRedo = () =&gt; { if (!graph) return; if
(graph.canRedo()) { graph.redo(); updateUndoRedoState(); } }; // 预览 JSON const
handlePreviewJson = () =&gt; { if (!graph) return; try { const data =
graph.toJSON(); previewJsonContent.value = JSON.stringify(data, null, 2);
previewDialogVisible.value = true; } catch (err) { console.error('获取 JSON
失败:', err); ElMessage.error('获取 JSON 失败'); } }; // 复制 JSON const
handleCopyJson = async () =&gt; { try { if (navigator.clipboard &amp;&amp;
window.isSecureContext) { await
navigator.clipboard.writeText(previewJsonContent.value); ElMessage.success('JSON
已复制到剪贴板'); return; } } catch (err) { console.warn('Clipboard API
失败，尝试降级方案:', err); } try { const textArea =
document.createElement('textarea'); textArea.value = previewJsonContent.value;
textArea.style.position = 'fixed'; textArea.style.left = '-999999px';
textArea.style.top = '-999999px'; document.body.appendChild(textArea);
textArea.focus(); textArea.select(); const successful =
document.execCommand('copy'); document.body.removeChild(textArea); if
(successful) { ElMessage.success('JSON 已复制到剪贴板'); } else { throw new
Error('execCommand 失败'); } } catch (err) { console.error('复制失败:', err);
ElMessage.error('复制失败，请手动选择复制'); } }; // 暴露给父组件的方法
defineExpose({ importData, exportData: () =&gt; graph?.toJSON(), exportSvg: ()
=&gt; graph?.toSVG(), getGraph: () =&gt; graph, getSelectedCells: () =&gt;
graph?.getSelectedCells(), clearSelection: () =&gt; graph?.cleanSelection(), });
onMounted(() =&gt; { initGraph(); }); onUnmounted(() =&gt; { if (graph) {
graph.dispose(); graph = null; } dnd = null; }); &lt;/script&gt; &lt;style
lang="scss" scoped&gt; .x6-editor-container { display: flex; flex-direction:
column; width: 100%; height: 100%; .toolbar { display: flex; gap: 8px;
align-items: center; padding: 12px; background: #f5f7fa; border-bottom: 1px
solid #e4e7ed; } .editor-wrapper { display: flex; flex: 1; overflow: hidden;
.sidebar { width: 200px; background: #fff; border-right: 1px solid #e4e7ed;
display: flex; flex-direction: column; .sidebar-title { padding: 12px;
font-size: 14px; font-weight: 600; color: #303133; border-bottom: 1px solid
#e4e7ed; } .sidebar-content { flex: 1; overflow-y: auto; padding: 12px;
.sidebar-node { margin-bottom: 8px; padding: 12px; border: 1px solid #d9d9d9;
border-radius: 4px; text-align: center; cursor: grab; font-size: 14px;
user-select: none; transition: all 0.3s; &amp;:hover { border-color: #5f95ff; }
&amp;:active { cursor: grabbing; } } } } .canvas { flex: 1; background: #f2f7fa;
position: relative; } .minimap-wrapper { width: 220px; background: #fff;
border-left: 1px solid #e4e7ed; display: flex; flex-direction: column;
.minimap-title { padding: 12px; font-size: 14px; font-weight: 600; color:
#303133; border-bottom: 1px solid #e4e7ed; } .minimap { width: 200px; height:
160px; margin: 10px; border: 1px solid #e4e7ed; } } } } .json-preview-container
{ max-height: 60vh; padding: 16px; overflow: auto; background: #f5f7fa;
border-radius: 4px; .json-content { margin: 0; font-family: Consolas, Monaco,
'Courier New', monospace; font-size: 13px; line-height: 1.6; color: #303133;
word-break: break-all; white-space: pre-wrap; } } &lt;/style&gt;
```

### 2. 在路由中使用

```typescript
// src/router/modules/test.ts
import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw = {
  path: '/x6',
  name: 'X6',
  component: () =&gt; import('@/views/demoTest/x6.vue'),
  meta: {
    title: 'X6 图编辑器',
    icon: 'Share',
  },
};

export default routes;
```

### 3. 创建 x6.vue 页面

```vue
&lt;script setup lang="ts"&gt; import { ref } from 'vue'; import X6Editor from
'@/components/X6Editor/index.vue'; const x6EditorRef = ref(); const currentData
= ref&lt;any&gt;(null); const selectedCells = ref&lt;any[]&gt;([]); const
handleChange = (data: any) =&gt; { currentData.value = data;
console.log('数据变化:', data); }; const handleSelect = (cells: any[]) =&gt; {
selectedCells.value = cells; console.log('选中单元格:', cells); };
&lt;/script&gt; &lt;template&gt; &lt;div class="x6-page"&gt; &lt;X6Editor
ref="x6EditorRef" @change="handleChange" @select="handleSelect" /&gt;
&lt;/div&gt; &lt;/template&gt; &lt;style lang="scss" scoped&gt; .x6-page {
width: 100%; height: calc(100vh - 120px); } &lt;/style&gt;
```

### 4. 使用 Composable 抽离逻辑

```typescript
// src/components/X6Editor/hooks/useX6.ts
import { ref } from 'vue';
import type { Graph } from '@antv/x6';
import { ElMessage } from 'element-plus';

export function useX6() {
  const graph = ref&lt;Graph | null&gt;(null);

  const initGraph = (container: HTMLElement, options?: any) =&gt; {
    // 动态导入，避免服务端渲染问题
    const { Graph } = await import('@antv/x6');
    graph.value = new Graph({
      container,
      grid: true,
      panning: true,
      mousewheel: true,
      ...options,
    });
    return graph.value;
  };

  const importData = (data: any) =&gt; {
    if (!graph.value) return;
    try {
      graph.value.fromJSON(data);
      ElMessage.success('导入成功');
    } catch (err) {
      console.error('导入失败:', err);
      ElMessage.error('导入失败');
    }
  };

  const exportData = () =&gt; {
    if (!graph.value) return null;
    return graph.value.toJSON();
  };

  const exportSvg = () =&gt; {
    if (!graph.value) return null;
    return graph.value.toSVG();
  };

  const zoomIn = () =&gt; {
    if (!graph.value) return;
    graph.value.zoom(0.1);
  };

  const zoomOut = () =&gt; {
    if (!graph.value) return;
    graph.value.zoom(-0.1);
  };

  const zoomToFit = () =&gt; {
    if (!graph.value) return;
    graph.value.zoomToFit({ padding: 20 });
  };

  const clear = () =&gt; {
    if (!graph.value) return;
    graph.value.clearCells();
  };

  const dispose = () =&gt; {
    if (graph.value) {
      graph.value.dispose();
      graph.value = null;
    }
  };

  return {
    graph,
    initGraph,
    importData,
    exportData,
    exportSvg,
    zoomIn,
    zoomOut,
    zoomToFit,
    clear,
    dispose,
  };
}
```

### 5. 创建组件目录结构

建议在项目中创建如下结构：

```
src/
├── components/
│   └── X6Editor/
│       ├── index.vue          # 主组件
│       ├── hooks/
│       │   └── useX6.ts      # 逻辑抽离
│       ├── types/
│       │   └── index.ts      # 类型定义
│       └── utils/
│           └── index.ts      # 工具函数
└── views/
    └── demoTest/
        └── x6.vue
```

---

## 常见问题

### 1. 画布高度问题

确保容器元素有明确的高度：

```css
.canvas {
  width: 100%;
  height: 600px; /* 或使用 calc(100vh - xxx) */
}
```

### 2. TypeScript 类型问题

X6 自带类型声明，通常无需额外配置。如果遇到问题，可以检查 tsconfig.json：

```json
{
  "compilerOptions": {
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true
  }
}
```

### 3. 性能优化

对于大型图，可以使用以下优化：

```javascript
import { Graph } from "@antv/x6";

const graph = new Graph({
  container: document.getElementById("container"),
  // 启用虚拟渲染（仅渲染视口内的元素）
  async: true,
  // 减少渲染频率
  frozen: false,
  // 禁用一些不需要的交互
  embedding: false,
  highlighting: false
});

// 批量添加元素
const nodes = [];
const edges = [];
graph.addCells([...nodes, ...edges]);
```

### 4. 自定义样式问题

可以通过 CSS 自定义 X6 的样式：

```css
/* 节点选择框 */
.x6-graph-selection {
  border: 1px solid #5f95ff;
}

/* 对齐线 */
.x6-widget-snapline {
  background-color: #5f95ff;
}

/* 连接桩 */
.x6-port-body {
  cursor: crosshair;
}
```

### 5. 移动端适配

```javascript
import { Graph } from "@antv/x6";

const graph = new Graph({
  container: document.getElementById("container"),
  panning: {
    enabled: true,
    eventTypes: ["leftMouseDown", "touch"]
  },
  mousewheel: {
    enabled: true,
    modifiers: null // 无需按键
  }
});
```

---

## 参考资料

### 官方资源

- **GitHub**: [https://github.com/antvis/X6](https://github.com/antvis/X6)
- **官网**: [https://x6.antv.antgroup.com/](https://x6.antv.antgroup.com/)
- **文档**: [https://x6.antv.antgroup.com/tutorial/about](https://x6.antv.antgroup.com/tutorial/about)
- **示例**: [https://x6.antv.antgroup.com/examples/](https://x6.antv.antgroup.com/examples/)
- **API**: [https://x6.antv.antgroup.com/docs/api/graph/intro](https://x6.antv.antgroup.com/docs/api/graph/intro)

### 相关仓库

- **@antv/layout**: [https://github.com/antvis/layout](https://github.com/antvis/layout) - 图布局算法
- **@antv/x6-react-shape**: [https://github.com/antvis/X6/tree/master/packages/x6-react-shape](https://github.com/antvis/X6/tree/master/packages/x6-react-shape) - React 节点
- **@antv/x6-vue-shape**: [https://github.com/antvis/X6/tree/master/packages/x6-vue-shape](https://github.com/antvis/X6/tree/master/packages/x6-vue-shape) - Vue 节点

### 社区资源

- **AntV 博客**: [https://antv.antgroup.com/blog](https://antv.antgroup.com/blog)
- **AntV 官网**: [https://antv.antgroup.com/](https://antv.antgroup.com/)

---

## 下一步

1. 安装依赖并运行示例
2. 尝试自定义节点和边
3. 根据业务需求选择合适的布局
4. 探索更多插件和功能
5. 参考官方文档和示例

祝使用愉快！
