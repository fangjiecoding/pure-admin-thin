<script setup lang="ts">
import { ref } from "vue";
import html2canvas from "html2canvas";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const loading = ref(false);
const upload = async (options: { file: File }) => {
  loading.value = true;
  const { file } = options;
  const reader = new FileReader();
  reader.onload = async function (e) {
    try {
      const htmlContent = e.target?.result;
      if (typeof htmlContent !== "string") {
        throw new Error("文件内容不是有效的HTML文本");
      }

      //提取<body>内容
      const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*)<\/body>/i);
      const bodyContent = bodyMatch ? bodyMatch[1] : htmlContent;

      //分割HTML内容
      const sections = bodyContent.split(/<p class="nextpage"><\/p>/i);
      const zip = new JSZip();

      for (const [index, section] of sections.entries()) {
        if (!section.trim()) continue;
        try {
          // 创建临时容器
          const sectionElement = document.createElement("div");
          // 删除特定的style属性
          const cleanedMarginSection = section.replace(
            /style="MARGIN-TOP: 110px; MARGIN-LEFT: 90px"/gi,
            ""
          );
          sectionElement.style.cssText = `
            position: fixed;
            padding: 50px;
          `;
          document.body.appendChild(sectionElement);
          sectionElement.innerHTML = cleanedMarginSection;

          await Promise.all(
            Array.from(sectionElement.querySelectorAll("img")).map(
              img =>
                new Promise<void>(resolve => {
                  if (img.complete) return resolve();
                  img.onload = () => resolve();
                  img.onerror = () => resolve();
                })
            )
          );

          // 确保渲染完成
          await new Promise(resolve => setTimeout(resolve, 100));

          // 执行转换
          const canvas = await html2canvas(sectionElement, {
            scale: 2
          });

          // 将canvas转换为blob并添加到ZIP
          const blob = await new Promise<Blob>(resolve =>
            canvas.toBlob(blob => resolve(blob!), "image/png")
          );
          zip.file(`page_${index + 1}.png`, blob, { binary: true });

          // 清理临时元素
          sectionElement.remove();
        } catch (error) {
          console.error(`分段 ${index + 1} 转换失败:`, error);
        }
      }

      // 生成ZIP文件并下载
      const zipContent = await zip.generateAsync({ type: "blob" });
      saveAs(zipContent, `图片.zip`);
    } catch (error) {
      console.error("转换失败:", error);
      alert(
        `转换失败: ${error instanceof Error ? error.message : String(error)}`
      );
    } finally {
      loading.value = false;
      document
        .querySelectorAll("div[style*='position: fixed']")
        .forEach(node => node.remove());
    }
  };
  reader.readAsText(file, "gbk");
};
</script>

<template>
  <div>
    <div style="display: flex; column-gap: 10px">
      <el-upload
        :http-request="upload"
        :show-file-list="false"
        accept=".html,.htm"
        :multiple="false"
      >
        <el-button size="small" type="primary" :loading="loading">{{
          loading ? "转换中" : "上传HTML转换图片"
        }}</el-button>
      </el-upload>
    </div>
  </div>
</template>
