<script setup lang="ts">
import { ref } from "vue";
import BpmnEditor from "@/components/BpmnEditor/index.vue";
import { ElMessage } from "element-plus";

const bpmnEditorRef = ref();
const currentXml = ref("");

const handleChange = (xml: string) => {
  currentXml.value = xml;
  console.log("流程图已更新");
};

const handleSelect = (elements: any[]) => {
  console.log("选中元素:", elements);
};

const handleSave = async () => {
  if (bpmnEditorRef.value) {
    const { xml } = await bpmnEditorRef.value.saveXML();
    console.log("保存的 XML:", xml);
    ElMessage.success("保存成功");
  }
};
</script>

<template>
  <div class="bpm-page">
    <div class="page-header">
      <h2>BPMN 流程图编辑器</h2>
      <el-button type="primary" @click="handleSave"> 保存流程 </el-button>
    </div>
    <div class="editor-container">
      <BpmnEditor
        ref="bpmnEditorRef"
        @change="handleChange"
        @select="handleSelect"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.bpm-page {
  display: flex;
  flex-direction: column;
  width: calc(100% - 48px);
  height: calc(100% - 48px);

  .page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    background: #fff;
    border-bottom: 1px solid #e4e7ed;

    h2 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #303133;
    }
  }

  .editor-container {
    flex: 1;
    overflow: hidden;
  }
}
</style>
