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
      <div class="properties-panel">
        <el-scrollbar height="100%">
          <div v-if="selectedElement" class="properties-content">
            <el-divider content-position="left">
              <span class="divider-title">
                <el-icon><Setting /></el-icon>
                {{ getElementTypeName(selectedElement.type) }} 属性
              </span>
            </el-divider>

            <el-form
              ref="formRef"
              :model="elementProps"
              label-width="80px"
              size="small"
            >
              <!-- 通用属性 -->
              <el-form-item label="编号">
                <el-input v-model="elementProps.id" @change="updateElement" />
              </el-form-item>

              <el-form-item label="名称">
                <el-input v-model="elementProps.name" @change="updateElement" />
              </el-form-item>

              <!-- 流程属性 -->
              <template v-if="selectedElement.type === 'bpmn:Process'">
                <el-form-item label="可执行">
                  <el-switch
                    v-model="elementProps.isExecutable"
                    @change="updateElement"
                  />
                </el-form-item>
              </template>

              <!-- 任务属性 -->
              <template v-if="selectedElement.type === 'bpmn:UserTask'">
                <el-form-item label="处理人">
                  <el-input
                    v-model="elementProps.assignee"
                    @change="updateElement"
                  />
                </el-form-item>
                <el-form-item label="候选用户">
                  <el-input
                    v-model="elementProps.candidateUsers"
                    @change="updateElement"
                  />
                </el-form-item>
                <el-form-item label="候选组">
                  <el-input
                    v-model="elementProps.candidateGroups"
                    @change="updateElement"
                  />
                </el-form-item>
                <el-form-item label="优先级">
                  <el-input-number
                    v-model="elementProps.priority"
                    :min="0"
                    @change="updateElement"
                  />
                </el-form-item>
                <el-form-item label="表单Key">
                  <el-input
                    v-model="elementProps.formKey"
                    @change="updateElement"
                  />
                </el-form-item>
              </template>

              <template v-if="selectedElement.type === 'bpmn:ServiceTask'">
                <el-form-item label="实现类型">
                  <el-select
                    v-model="elementProps.implementationType"
                    @change="updateElement"
                  >
                    <el-option label="Java类" value="class" />
                    <el-option label="表达式" value="expression" />
                    <el-option label="代理表达式" value="delegateExpression" />
                  </el-select>
                </el-form-item>
                <el-form-item label="实现">
                  <el-input
                    v-model="elementProps.implementation"
                    @change="updateElement"
                  />
                </el-form-item>
              </template>

              <!-- 网关属性 -->
              <template v-if="selectedElement.type === 'bpmn:ExclusiveGateway'">
                <el-form-item label="默认流">
                  <el-input
                    v-model="elementProps.default"
                    @change="updateElement"
                  />
                </el-form-item>
              </template>

              <!-- 顺序流属性 -->
              <template v-if="selectedElement.type === 'bpmn:SequenceFlow'">
                <el-form-item label="条件表达式">
                  <el-input
                    v-model="elementProps.conditionExpression"
                    type="textarea"
                    :rows="3"
                    @change="updateElement"
                  />
                </el-form-item>
                <el-form-item label="默认流">
                  <el-switch
                    v-model="elementProps.isDefault"
                    @change="updateElement"
                  />
                </el-form-item>
              </template>

              <!-- 文档说明 -->
              <el-divider content-position="left">文档说明</el-divider>
              <el-form-item label="描述">
                <el-input
                  v-model="elementProps.documentation"
                  type="textarea"
                  :rows="4"
                  @change="updateElement"
                />
              </el-form-item>
            </el-form>
          </div>
          <div v-else class="no-selection">
            <el-empty description="请选择一个元素以编辑属性" />
          </div>
        </el-scrollbar>
      </div>
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
import { ref, reactive, onMounted, onUnmounted, nextTick, watch } from "vue";
import BpmnModeler from "bpmn-js/lib/Modeler";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn.css";
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
  DocumentCopy,
  Setting
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
    ((module: "modeling") => any) &
    ((module: "elementRegistry") => any) &
    ((module: string) => any);
}

const props = defineProps<{
  xml?: string;
}>();

const canvasRef = ref<HTMLElement>();
const fileInputRef = ref<HTMLInputElement>();
const formRef = ref();
let modeler: ExtendedModeler | null = null;

const canUndo = ref(false);
const canRedo = ref(false);
const previewDialogVisible = ref(false);
const previewXmlContent = ref("");
const selectedElement = ref<any>(null);

// 元素属性表单数据
const elementProps = reactive({
  id: "",
  name: "",
  isExecutable: false,
  // 用户任务
  assignee: "",
  candidateUsers: "",
  candidateGroups: "",
  priority: undefined as number | undefined,
  formKey: "",
  // 服务任务
  implementationType: "class",
  implementation: "",
  // 网关
  default: "",
  // 顺序流
  conditionExpression: "",
  isDefault: false,
  // 文档
  documentation: ""
});

// 元素类型名称映射
const elementTypeNames: Record<string, string> = {
  "bpmn:Process": "流程",
  "bpmn:StartEvent": "开始事件",
  "bpmn:EndEvent": "结束事件",
  "bpmn:Task": "任务",
  "bpmn:UserTask": "用户任务",
  "bpmn:ServiceTask": "服务任务",
  "bpmn:ScriptTask": "脚本任务",
  "bpmn:BusinessRuleTask": "业务规则任务",
  "bpmn:ManualTask": "手动任务",
  "bpmn:SendTask": "发送任务",
  "bpmn:ReceiveTask": "接收任务",
  "bpmn:ExclusiveGateway": "排他网关",
  "bpmn:ParallelGateway": "并行网关",
  "bpmn:InclusiveGateway": "包容网关",
  "bpmn:EventBasedGateway": "事件网关",
  "bpmn:SequenceFlow": "顺序流",
  "bpmn:MessageFlow": "消息流",
  "bpmn:DataObjectReference": "数据对象",
  "bpmn:DataStoreReference": "数据存储",
  "bpmn:Participant": "参与者",
  "bpmn:Lane": "泳道"
};

// 获取元素类型名称
const getElementTypeName = (type: string): string => {
  return elementTypeNames[type] || type.replace("bpmn:", "");
};

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

// 更新撤销/重做状态
const updateUndoRedoState = () => {
  if (!modeler) return;
  const commandStack = modeler.get("commandStack");
  canUndo.value = commandStack.canUndo();
  canRedo.value = commandStack.canRedo();
};

// 从选中元素加载属性
const loadElementProps = (element: any) => {
  if (!element || !element.businessObject) {
    selectedElement.value = null;
    return;
  }

  selectedElement.value = element;
  const bo = element.businessObject;

  // 重置表单
  Object.assign(elementProps, {
    id: bo.id || "",
    name: bo.name || "",
    isExecutable: bo.isExecutable || false,
    assignee: bo.assignee || "",
    candidateUsers: bo.candidateUsers || "",
    candidateGroups: bo.candidateGroups || "",
    priority: bo.priority ? Number(bo.priority) : undefined,
    formKey: bo.formKey || "",
    implementationType: bo.class
      ? "class"
      : bo.expression
        ? "expression"
        : bo.delegateExpression
          ? "delegateExpression"
          : "class",
    implementation: bo.class || bo.expression || bo.delegateExpression || "",
    default: bo.default ? bo.default.id : "",
    conditionExpression: bo.conditionExpression?.body || "",
    isDefault: bo.sourceRef?.default === bo,
    documentation: bo.documentation?.[0]?.text || ""
  });
};

// 更新元素属性
const updateElement = () => {
  if (!modeler || !selectedElement.value) return;

  const modeling = modeler.get("modeling");
  const element = selectedElement.value;
  const bo = element.businessObject;

  // 更新基本属性
  const properties: Record<string, any> = {
    id: elementProps.id,
    name: elementProps.name
  };

  // 流程属性
  if (bo.$type === "bpmn:Process") {
    properties.isExecutable = elementProps.isExecutable;
  }

  // 用户任务属性
  if (bo.$type === "bpmn:UserTask") {
    properties.assignee = elementProps.assignee || undefined;
    properties.candidateUsers = elementProps.candidateUsers || undefined;
    properties.candidateGroups = elementProps.candidateGroups || undefined;
    properties.priority = elementProps.priority?.toString() || undefined;
    properties.formKey = elementProps.formKey || undefined;
  }

  // 服务任务属性
  if (bo.$type === "bpmn:ServiceTask") {
    properties.class = undefined;
    properties.expression = undefined;
    properties.delegateExpression = undefined;

    if (elementProps.implementationType === "class") {
      properties.class = elementProps.implementation || undefined;
    } else if (elementProps.implementationType === "expression") {
      properties.expression = elementProps.implementation || undefined;
    } else if (elementProps.implementationType === "delegateExpression") {
      properties.delegateExpression = elementProps.implementation || undefined;
    }
  }

  // 网关属性
  if (bo.$type === "bpmn:ExclusiveGateway") {
    properties.default = elementProps.default || undefined;
  }

  modeling.updateProperties(element, properties);

  // 更新条件表达式
  if (bo.$type === "bpmn:SequenceFlow") {
    if (elementProps.conditionExpression) {
      const moddle = modeler.get("moddle");
      const conditionExpression = moddle.create("bpmn:FormalExpression", {
        body: elementProps.conditionExpression
      });
      modeling.updateProperties(element, { conditionExpression });
    } else {
      modeling.updateProperties(element, { conditionExpression: undefined });
    }
  }

  // 更新文档
  if (elementProps.documentation) {
    const moddle = modeler.get("moddle");
    const documentation = moddle.create("bpmn:Documentation", {
      text: elementProps.documentation
    });
    modeling.updateProperties(element, { documentation: [documentation] });
  } else {
    modeling.updateProperties(element, { documentation: undefined });
  }
};

// 初始化模型器
const initModeler = () => {
  if (!canvasRef.value) return;

  modeler = new BpmnModeler({
    container: canvasRef.value,
    keyboard: {
      bindTo: window
    }
  });

  // 监听元素选择事件
  modeler.on("selection.changed", (event: any) => {
    const newSelection = event.newSelection || [];
    emit("select", newSelection);
    if (newSelection.length > 0) {
      loadElementProps(newSelection[0]);
    } else {
      selectedElement.value = null;
    }
  });

  // 监听元素添加/移除/修改事件
  modeler.on("element.changed", (event: any) => {
    if (event.element === selectedElement.value) {
      loadElementProps(event.element);
    }
  });

  // 监听命令栈变化
  modeler.on("commandStack.changed", () => {
    updateUndoRedoState();
    handleChange();
  });

  importDiagram(props.xml || defaultXml);
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

// 监听 props.xml 变化
watch(
  () => props.xml,
  newXml => {
    if (newXml && modeler) {
      importDiagram(newXml);
    }
  }
);

// 暴露给父组件的方法
defineExpose({
  importDiagram,
  saveXML: () => modeler?.saveXML({ format: true }),
  saveSVG: () => modeler?.saveSVG(),
  getModeler: () => modeler
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
      width: 320px;
      background: #fff;
      border-left: 1px solid #e4e7ed;

      .properties-content {
        padding: 16px;

        .divider-title {
          display: flex;
          gap: 6px;
          align-items: center;
          font-weight: 600;
        }
      }

      .no-selection {
        padding: 40px 20px;
      }
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
