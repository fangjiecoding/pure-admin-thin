<template>
  <div class="bpmn-editor-container">
    <div class="toolbar">
      <el-button @click="handleImport">
        <el-icon><Upload /></el-icon>
        导入
      </el-button>
      <el-button type="primary" @click="handlePreviewXml">
        <el-icon><View /></el-icon>
        预览 XML
      </el-button>
      <el-button @click="handleExportXml">
        <el-icon><Download /></el-icon>
        导出 XML
      </el-button>
      <el-button @click="handleExportSvg">
        <el-icon><Picture /></el-icon>
        导出 SVG
      </el-button>
      <el-button @click="handleReset">
        <el-icon><RefreshLeft /></el-icon>
        重置
      </el-button>
      <el-divider direction="vertical" />
      <el-button @click="handleZoomIn">
        <el-icon><ZoomIn /></el-icon>
        放大
      </el-button>
      <el-button @click="handleZoomOut">
        <el-icon><ZoomOut /></el-icon>
        缩小
      </el-button>
      <el-button @click="handleZoomFit">
        <el-icon><FullScreen /></el-icon>
        适应
      </el-button>
      <el-divider direction="vertical" />
      <el-button :disabled="!canUndo" @click="handleUndo">
        <el-icon><DArrowLeft /></el-icon>
        撤销
      </el-button>
      <el-button :disabled="!canRedo" @click="handleRedo">
        <el-icon><DArrowRight /></el-icon>
        重做
      </el-button>
    </div>
    <div class="editor-wrapper">
      <div ref="canvasRef" class="canvas" />
      <div ref="propertiesRef" class="properties-panel" />
    </div>
    <input
      ref="fileInputRef"
      type="file"
      accept=".bpmn,.xml"
      style="display: none"
      @change="handleFileChange"
    />

    <!-- XML 预览对话框 -->
    <el-dialog
      v-model="previewDialogVisible"
      title="BPMN XML 预览"
      width="70%"
      :close-on-click-modal="false"
      destroy-on-close
    >
      <div class="xml-preview-container">
        <pre class="xml-content">{{ previewXmlContent }}</pre>
      </div>
      <template #footer>
        <el-button @click="previewDialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="handleCopyXml">
          <el-icon><DocumentCopy /></el-icon>
          复制 XML
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import BpmnModeler from "bpmn-js/lib/Modeler";
import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule
} from "bpmn-js-properties-panel";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
import "@bpmn-io/properties-panel/assets/properties-panel.css";
import { ElMessage } from "element-plus";
import {
  Upload,
  Download,
  Picture,
  RefreshLeft,
  ZoomIn,
  ZoomOut,
  FullScreen,
  DArrowLeft,
  DArrowRight,
  View,
  DocumentCopy
} from "@element-plus/icons-vue";

const emit = defineEmits<{
  (e: "change", xml: string): void;
  (e: "select", elements: any[]): void;
}>();

// CommandStack 类型
interface CommandStack {
  canUndo(): boolean;
  canRedo(): boolean;
  undo(): void;
  redo(): void;
}

// Canvas 类型
interface Canvas {
  zoom(level: string | number): void;
  zoom(): number;
}

// 扩展 Modeler 类型
interface ExtendedModeler extends BpmnModeler {
  get: ((module: "commandStack") => CommandStack) &
    ((module: "canvas") => Canvas) &
    ((module: string) => any);
}

const props = defineProps<{
  xml?: string;
}>();

const canvasRef = ref<HTMLElement>();
const propertiesRef = ref<HTMLElement>();
const fileInputRef = ref<HTMLInputElement>();
let modeler: ExtendedModeler | null = null;

const canUndo = ref(false);
const canRedo = ref(false);
const previewDialogVisible = ref(false);
const previewXmlContent = ref("");

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

// 中文翻译映射
const translations: Record<string, string> = {
  // 通用
  General: "通用",
  Details: "详情",
  Documentation: "文档说明",
  Name: "名称",
  Id: "编号",
  Element: "元素",
  Process: "流程",
  Participant: "参与者",

  // 属性
  Properties: "属性",
  Attributes: "属性",
  Extension: "扩展",

  // 流程相关
  isExecutable: "是否可执行",
  "Process Id": "流程编号",
  "Process Name": "流程名称",

  // 事件
  "Start Event": "开始事件",
  "End Event": "结束事件",
  "Intermediate Catch Event": "中间捕获事件",
  "Intermediate Throw Event": "中间抛出事件",

  // 任务
  Task: "任务",
  "Service Task": "服务任务",
  "User Task": "用户任务",
  "Business Rule Task": "业务规则任务",
  "Script Task": "脚本任务",
  "Manual Task": "手动任务",
  "Send Task": "发送任务",
  "Receive Task": "接收任务",

  // 网关
  "Exclusive Gateway": "排他网关",
  "Parallel Gateway": "并行网关",
  "Inclusive Gateway": "包容网关",
  "Event-based Gateway": "事件网关",

  // 连线
  "Sequence Flow": "顺序流",
  "Message Flow": "消息流",
  Association: "关联",

  // 其他
  Yes: "是",
  No: "否",
  true: "是",
  false: "否",
  Create: "创建",
  Edit: "编辑",
  Remove: "删除",
  Add: "添加",
  Select: "选择",
  Value: "值",
  Type: "类型",
  Condition: "条件表达式",
  Default: "默认",
  Source: "源",
  Target: "目标"
};

// 汉化属性面板
const translatePropertiesPanel = () => {
  if (!propertiesRef.value) return;

  const panel = propertiesRef.value;
  const observer = new MutationObserver(() => {
    const elements = panel.querySelectorAll("*");
    elements.forEach(el => {
      if (el.childNodes.length === 1 && el.childNodes[0].nodeType === 3) {
        const text = el.textContent?.trim();
        if (text && translations[text]) {
          el.textContent = translations[text];
        }
      }

      // 处理 placeholder
      if ("placeholder" in el) {
        const placeholder = (el as HTMLInputElement).placeholder;
        if (placeholder && translations[placeholder]) {
          (el as HTMLInputElement).placeholder = translations[placeholder];
        }
      }
    });
  });

  observer.observe(panel, {
    childList: true,
    subtree: true
  });

  return observer;
};

// 更新撤销/重做状态
const updateUndoRedoState = () => {
  if (!modeler) return;
  const commandStack = modeler.get("commandStack");
  canUndo.value = commandStack.canUndo();
  canRedo.value = commandStack.canRedo();
};

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
      BpmnPropertiesProviderModule
    ],
    keyboard: {
      bindTo: window
    }
  });

  // 监听元素选择事件
  modeler.on("selection.changed", (event: any) => {
    emit("select", event.newSelection || []);
  });

  // 监听命令栈变化
  modeler.on("commandStack.changed", () => {
    updateUndoRedoState();
    handleChange();
  });

  importDiagram(props.xml || defaultXml);

  // 初始化汉化
  nextTick(() => {
    translatePropertiesPanel();
  });
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
    updateUndoRedoState();
    ElMessage.success("导入成功");
  } catch (err) {
    console.error("导入失败:", err);
    ElMessage.error("导入失败");
  }
};

// 触发变化事件
const handleChange = async () => {
  if (!modeler) return;
  try {
    const { xml } = await modeler.saveXML({ format: true });
    emit("change", xml);
  } catch (err) {
    console.error("获取 XML 失败:", err);
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

// 预览 XML
const handlePreviewXml = async () => {
  if (!modeler) return;
  try {
    const { xml } = await modeler.saveXML({ format: true });
    previewXmlContent.value = xml;
    previewDialogVisible.value = true;
  } catch (err) {
    console.error("获取 XML 失败:", err);
    ElMessage.error("获取 XML 失败");
  }
};

// 复制 XML
const handleCopyXml = async () => {
  try {
    // 优先使用现代 clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(previewXmlContent.value);
      ElMessage.success("XML 已复制到剪贴板");
      return;
    }
  } catch (err) {
    console.warn("Clipboard API 失败，尝试降级方案:", err);
  }

  // 降级方案：使用传统的 textarea + execCommand
  try {
    const textArea = document.createElement("textarea");
    textArea.value = previewXmlContent.value;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);

    if (successful) {
      ElMessage.success("XML 已复制到剪贴板");
    } else {
      throw new Error("execCommand 失败");
    }
  } catch (err) {
    console.error("复制失败:", err);
    ElMessage.error("复制失败，请手动选择复制");
  }
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

// 撤销/重做
const handleUndo = () => {
  if (!modeler) return;
  const commandStack = modeler.get("commandStack");
  commandStack.undo();
};

const handleRedo = () => {
  if (!modeler) return;
  const commandStack = modeler.get("commandStack");
  commandStack.redo();
};

// 暴露给父组件的方法
defineExpose({
  importDiagram,
  saveXML: () => modeler?.saveXML({ format: true }),
  saveSVG: () => modeler?.saveSVG(),
  getModeler: () => modeler,
  translations
});

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
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  .toolbar {
    display: flex;
    gap: 8px;
    align-items: center;
    padding: 12px;
    background: #f5f7fa;
    border-bottom: 1px solid #e4e7ed;
  }

  .editor-wrapper {
    display: flex;
    flex: 1;
    overflow: hidden;

    .canvas {
      position: relative;
      flex: 1;
      background: #fff;
    }

    .properties-panel {
      width: 300px;
      overflow-y: auto;
      background: #fff;
      border-left: 1px solid #e4e7ed;
    }
  }
}

:deep(.bjs-powered-by) {
  display: none;
}

:deep(.djs-palette) {
  top: 10px !important;
  left: 10px !important;
}

:deep(.properties-panel) {
  height: 100%;
}

:deep(.bio-properties-panel) {
  height: 100%;
  overflow-y: auto;
}

.xml-preview-container {
  max-height: 60vh;
  padding: 16px;
  overflow: auto;
  background: #f5f7fa;
  border-radius: 4px;

  .xml-content {
    margin: 0;
    font-family: Consolas, Monaco, "Courier New", monospace;
    font-size: 13px;
    line-height: 1.6;
    color: #303133;
    word-break: break-all;
    white-space: pre-wrap;
  }
}
</style>
