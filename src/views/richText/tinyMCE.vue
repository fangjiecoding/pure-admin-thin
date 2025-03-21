<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from "vue";
import tinymce from "tinymce";
import * as echarts from "echarts";
import TemplateDialog from "./components/TemplateDialog.vue";
const initObj = {
  selector: "#tinymce",
  menubar: true,
  toolbar: [
    { name: "history", items: ["undo", "redo"] },
    { name: "styles", items: ["styles"] },
    { name: "formatting", items: ["bold", "italic"] },
    {
      name: "alignment",
      items: ["alignleft", "aligncenter", "alignright", "alignjustify"]
    },
    { name: "indentation", items: ["outdent", "indent"] },
    { name: "font", items: ["fontfamily", "fontsize", "fontsizeinput"] }
  ],
  statusbar: false,
  skin: "oxide-dark",
  language: "zh_CN",
  base_url: "/tinymce"
};

onMounted(() => {
  tinymce.init(initObj);
});
onUnmounted(() => {
  tinymce.remove();
});
const getContent = () => {
  data.value = tinymce.activeEditor.getContent();
  console.log(data.value);
};
const setContent = () => {
  tinymce.activeEditor.setContent("<p>123</p>");
};
const dialogVisible = ref(false);
const selectTemp = () => {
  dialogVisible.value = true;
};
const data = ref();
const success = data => {
  if (data.type === "chart") {
    tinymce.activeEditor.insertContent(data);
    renderChartsInEditor(data);
  } else {
    tinymce.activeEditor.insertContent(data);
  }
};

// 渲染编辑器中的图表
const renderChartsInEditor = data => {
  const editor = tinymce.activeEditor;
  const iframeDoc = editor.contentDocument;
  const placeholderDom = iframeDoc.querySelector(`#${data.id}`);
  console.log(placeholderDom.getAttribute("data-placeholder"));

  const option = JSON.parse(placeholderDom.getAttribute("data-placeholder"));
  const chart = echarts.init(placeholderDom);
  chart.setOption(option);
};
</script>

<template>
  <div>
    <div id="tinymce" />
    <div
      v-if="data"
      style="padding: 10px; margin-top: 20px; border: 1px solid #ccc"
    >
      <div>{{ data }}</div>
    </div>
    <div style="margin-top: 20px">
      <el-button type="primary" @click="getContent">获得内容</el-button>
      <el-button type="primary" @click="setContent">设置内容</el-button>
      <el-button type="primary" @click="selectTemp">选择模板</el-button>
    </div>

    <TemplateDialog v-model="dialogVisible" @success="success" />
  </div>
</template>
