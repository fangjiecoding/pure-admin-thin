<template>
  <div class="bpmn-elform-container">
    <el-card class="header-card">
      <template #header>
        <div class="card-header">
          <span class="title">BPMN 编辑器（自定义 el-form 属性面板）</span>
          <el-tag type="info">Element Plus 表单版本</el-tag>
        </div>
      </template>
      <p class="description">
        此版本使用 Element Plus 的 el-form
        组件构建自定义属性面板，支持更灵活的定制。
      </p>
    </el-card>

    <div class="editor-wrapper">
      <BpmnEditorWithElForm
        ref="editorRef"
        @change="handleBpmnChange"
        @select="handleBpmnSelect"
      />
    </div>

    <el-card class="info-card">
      <template #header>
        <span>操作日志</span>
      </template>
      <div class="log-container">
        <div v-for="(log, index) in logs" :key="index" class="log-item">
          <el-tag size="small" :type="log.type">{{ log.time }}</el-tag>
          <span class="log-text">{{ log.message }}</span>
        </div>
        <div v-if="logs.length === 0" class="empty-log">
          <el-empty description="暂无操作日志" :image-size="60" />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import BpmnEditorWithElForm from "@/components/BpmnEditor/BpmnEditorWithElForm.vue";
import { ElMessage } from "element-plus";

const editorRef = ref();
const logs = ref<Array<{ time: string; message: string; type: any }>>([]);

// 添加日志
const addLog = (message: string, type: any = "info") => {
  const time = new Date().toLocaleTimeString();
  logs.value.unshift({ time, message, type });
  if (logs.value.length > 20) {
    logs.value.pop();
  }
};

// BPMN 变化事件
const handleBpmnChange = (xml: string) => {
  console.log("BPMN XML changed:", xml);
};

// BPMN 元素选择事件
const handleBpmnSelect = (elements: any[]) => {
  if (elements.length > 0) {
    addLog(
      `选中元素: ${elements[0].type || elements[0].businessObject?.type} (ID: ${elements[0].id})`,
      "primary"
    );
  }
};

addLog("页面已加载，BPMN 编辑器初始化完成", "success");
</script>

<style lang="scss" scoped>
.bpmn-elform-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: calc(100vh - 32px);
  padding: 16px;

  .header-card {
    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .title {
        font-size: 16px;
        font-weight: 600;
      }
    }

    .description {
      margin: 0;
      color: #606266;
    }
  }

  .editor-wrapper {
    flex: 1;
    min-height: 0;
    overflow: hidden;
    border: 1px solid #e4e7ed;
    border-radius: 4px;
  }

  .info-card {
    .log-container {
      max-height: 200px;
      overflow-y: auto;

      .log-item {
        display: flex;
        gap: 8px;
        align-items: center;
        padding: 8px 0;
        border-bottom: 1px solid #f0f0f0;

        &:last-child {
          border-bottom: none;
        }

        .log-text {
          font-size: 13px;
          color: #606266;
        }
      }

      .empty-log {
        padding: 20px 0;
      }
    }
  }
}
</style>
