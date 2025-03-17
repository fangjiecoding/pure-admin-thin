<script lang="ts" setup>
import tinymce from "tinymce";
import { onMounted, onUnmounted, ref } from "vue";
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
  allow_script_urls: true,
  allow_html_data_urls: true,
  content_security_policy: true,
  extended_valid_elements: "script[src|charset|defer|type|async]",
  init_instance_callback: editor => {
    // 在 iframe 的 head 中插入 ECharts
    const iframeDoc = editor.iframeElement.contentDocument;
    const script = iframeDoc.createElement("script");
    script.src = "https://cdn.staticfile.org/echarts/4.3.0/echarts.min.js";
    script.onload = val => {
      console.log("ECharts 加载完成，可以在 iframe 中使用 echarts 对象");
    };
    iframeDoc.head.appendChild(script);
  }
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
  tinymce.activeEditor.setContent(data);
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
