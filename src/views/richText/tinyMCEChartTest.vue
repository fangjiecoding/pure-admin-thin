<template>
  <div>
    <!-- TinyMCE 编辑器 -->
    <textarea id="mytextarea" />

    <!-- Element Plus 弹窗 -->
    <el-dialog v-model="dialogVisible" title="插入ECharts图表" width="800px">
      <!-- ECharts 图表预览 -->
      <div ref="chartRef" style="width: 100%; height: 300px" />

      <!-- 图表配置表单 -->
      <el-form :model="chartForm" label-width="100px">
        <el-form-item label="图表标题">
          <el-input v-model="chartForm.title" placeholder="请输入图表标题" />
        </el-form-item>
        <el-form-item label="X轴数据">
          <el-input
            v-model="chartForm.xAxisData"
            placeholder="请输入X轴数据，用逗号分隔"
          />
        </el-form-item>
        <el-form-item label="Y轴数据">
          <el-input
            v-model="chartForm.yAxisData"
            placeholder="请输入Y轴数据，用逗号分隔"
          />
        </el-form-item>
      </el-form>

      <!-- 弹窗操作按钮 -->
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="insertChart">插入</el-button>
      </template>
    </el-dialog>

    <!-- 插入图表按钮 -->
    <el-button type="primary" @click="dialogVisible = true">插入图表</el-button>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import * as echarts from "echarts";
import tinymce from "tinymce";
// import "tinymce/tinymce.min.css";

// 弹窗显示状态
const dialogVisible = ref(false);

// ECharts 容器
const chartRef = ref(null);

// 图表配置表单
const chartForm = ref({
  title: "示例图表",
  xAxisData: "A,B,C",
  yAxisData: "5,20,36"
});

// ECharts 实例
let myChart = null;

// 初始化 TinyMCE
const initTinyMCE = () => {
  tinymce.init({
    selector: "#mytextarea",
    setup: editor => {
      editor.on("init", () => {
        // 在编辑器初始化时渲染图表
        renderChartsInEditor();
      });
    }
  });
};

// 渲染弹窗中的 ECharts 图表
const renderChart = () => {
  if (myChart) {
    myChart.dispose(); // 销毁之前的图表实例
  }
  myChart = echarts.init(chartRef.value);
  const option = {
    title: {
      text: chartForm.value.title
    },
    xAxis: {
      data: chartForm.value.xAxisData.split(",").map(item => item.trim())
    },
    yAxis: {},
    series: [
      {
        name: "数据",
        type: "bar",
        data: chartForm.value.yAxisData
          .split(",")
          .map(item => parseFloat(item.trim()))
      }
    ]
  };
  myChart.setOption(option);
};

// 插入图表到编辑器
const insertChart = () => {
  const option = {
    title: {
      text: chartForm.value.title
    },
    xAxis: {
      data: chartForm.value.xAxisData.split(",").map(item => item.trim())
    },
    yAxis: {},
    series: [
      {
        name: "数据",
        type: "bar",
        data: chartForm.value.yAxisData
          .split(",")
          .map(item => parseFloat(item.trim()))
      }
    ]
  };

  // 插入占位符到编辑器
  const placeholder = `<div class="echarts-placeholder" data-echarts-option='${JSON.stringify(option)}' style="width: 300px; height: 200px;" contenteditable="false" ></div>`;
  tinymce.activeEditor.insertContent(placeholder);
  // 在图表后面插入一个空行

  // 渲染插入的图表
  renderChartsInEditor();
  // // 手动设置编辑器焦点

  // 等待图表渲染完成
  setTimeout(() => {
    // 恢复编辑器选区

    const editor = tinymce.activeEditor;
    editor.execCommand("selectAll");
    editor.selection.getRng().collapse(false);
    editor.focus();
    // const body = editor.getBody();
    // const lastParagraph = body.lastChild; // 获取最后一个段落
    // editor.selection.setCursor(lastParagraph, 0); // 将光标定位到最后一个段落的开头
    // console.log("lastParagraph", lastParagraph);

    // tinymce.activeEditor.insertContent("111");
    // tinymce.activeEditor.execCommand("selectAll");
    // tinymce.activeEditor.selection.getRng().collapse(false);
    // tinymce.activeEditor.focus();
    // const body = tinymce.activeEditor.getBody();
    // const lastParagraph = body.lastChild; // 获取最后一个段落
    // tinymce.activeEditor.selection.setCursorLocation(lastParagraph, 0); // 将光标定位到最后一个段落的开头
  }, 2000);

  dialogVisible.value = false;
};

// 渲染编辑器中的图表
const renderChartsInEditor = () => {
  const editor = tinymce.activeEditor;
  const iframeDoc = editor.contentDocument || editor.getDoc();

  // 获取所有占位符
  const placeholders = iframeDoc.querySelectorAll(".echarts-placeholder");
  placeholders.forEach(placeholder => {
    const option = JSON.parse(placeholder.getAttribute("data-echarts-option"));
    const chart = echarts.init(placeholder);
    chart.setOption(option);
  });
};

// 监听弹窗显示，渲染图表
onMounted(() => {
  initTinyMCE();
  nextTick(() => {
    // renderChart();
  });
});
</script>

<style scoped>
#mytextarea {
  width: 100%;
  height: 400px;
}
</style>
