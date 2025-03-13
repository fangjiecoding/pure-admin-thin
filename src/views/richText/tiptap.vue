<template>
  <div>
    <editor-content :editor="editor" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useEditor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";

const editor = useEditor({
  content: "<p>I'm running Tiptap with Vue.js. 🎉</p>",
  extensions: [StarterKit]
});
const abc = ref("");
watch(
  () => abc.value,
  val => {
    console.log(val, 111);
  }
);
</script>
