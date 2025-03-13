<script lang="ts" setup>
import tinymce from "tinymce";
import { onMounted, onUnmounted } from "vue";
import Editor from "@tinymce/tinymce-vue";
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
  language: "zh_CN"
};

onMounted(() => {
  tinymce.init(initObj);
});
onUnmounted(() => {
  tinymce.remove();
});
// const getContent = () => {
//   tinymce.activeEditor.execCommand("mceEmoticons");
//   // console.log(tinymce.activeEditor.getContent());
// };
// const setContent = () => {
//   tinymce.activeEditor.setContent("<p>123</p>");
// };
</script>
<template>
  <div>
    <div id="tinymce" />
    <!-- <Editor :init="initObj"></Editor> -->
    <!-- <div style="margin-top: 20px">
      <el-button type="primary" @click="getContent">获得内容</el-button>
      <el-button type="primary" @click="setContent">设置内容</el-button>
    </div> -->
  </div>
</template>
