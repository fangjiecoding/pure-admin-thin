<template>
  <div>
    <el-upload :http-request="onFileChange" :show-file-list="false">
      <el-button size="small" type="primary">上传图片</el-button>
    </el-upload>
    <div v-if="result">{{ result }}</div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Tesseract from "tesseract.js";

const result = ref("");

const onFileChange = options => {
  const { file } = options;

  Tesseract.recognize(
    file,
    "chi_sim" // 简体中文
  )
    .then(({ data }) => {
      result.value = data.text;
    })
    .catch(err => {
      console.log(err);
    });
};
</script>
