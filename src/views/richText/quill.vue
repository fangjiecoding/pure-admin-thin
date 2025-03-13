<template>
  <div>
    <div ref="editorContainer" class="quill-editor" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import Quill from "quill";
import "quill/dist/quill.snow.css"; // 导入 Quill 的样式
const editorContainer = ref();
const quill = ref();
onMounted(() => {
  quill.value = new Quill(editorContainer.value, {
    theme: "snow",
    modules: {
      toolbar: [
        ["bold", "italic", "underline", "strike"],
        ["blockquote", "code-block"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ script: "sub" }, { script: "super" }],
        [{ indent: "-1" }, { indent: "+1" }]
      ]
    }
  });
});
</script>

<style>
.quill-editor {
  height: 300px; /* 可以根据需要调整高度 */
}
</style>
