<script lang="ts" setup>
import { onMounted, onUnmounted, ref, nextTick } from "vue";
import tinymce from "tinymce";
import * as echarts from "echarts";
import TemplateDialog from "./components/TemplateDialog.vue";
const initObj = {
  selector: "#tinymce",
  height: 800,
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
  branding: false,
  promotion: false,
  skin: "oxide-dark",
  language: "zh_CN",
  base_url: "/tinymce",
  extended_valid_elements: "img[*],span[*]",
  init_instance_callback: editor => {
    initRichText();
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
};

const setContent = () => {
  initRichText();
};
const dialogVisible = ref(false);
const selectTemp = () => {
  dialogVisible.value = true;
};
const data = ref();
const success = data => {
  tinymce.activeEditor.insertContent(data.content);
  console.log(data.content, 5555);

  if (data.placeholder) {
    nextTick(() => {
      Object.keys(data.placeholder).forEach(key => {
        const editor = tinymce.activeEditor;
        const iframeDoc = editor.contentDocument;
        const element = iframeDoc.querySelector(
          `[data-placeholder="{{${key}}}"]`
        ) as HTMLElement;

        switch (data.type) {
          case "text":
            renderText(element, data.placeholder[key]);
            break;
          case "table":
            renderTable(element, data.placeholder[key]);
            break;
          case "chart":
            renderChart(element, data.placeholder[key]);
            break;
        }
      });
    });
  }
  dialogVisible.value = false;
};

const mockData = {
  template: `<p>获取<span style="color:red;" data-placeholder="{{text:key1}}"></span>数据
  </p>
  <div  data-placeholder="{{table:key2}}"></div>
  <div  style="width: 100%; height: 300px;" data-placeholder="{{chart:key3}}"></div>
  <div  style="width: 100%; height: 300px;" data-placeholder="{{chart:key4}}"></div>
  <div  style="width: 100%; height: 300px;" data-placeholder="{{chart:key5}}"></div>`,
  placeholders: {
    "text:key1": {
      data: "xxx"
    },
    "table:key2": {
      data: [
        ["Header 1", "Header 2", "Header 3"],
        ["Data 1", "Data 2", "Data 3"],
        ["Data 4", "Data 5", "Data 6"]
      ]
    },
    "chart:key3": {
      style: "width: 100%; height: 300px;",
      config: {
        title: { text: "基础柱状图" },
        xAxis: {
          type: "category",
          data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
        },
        yAxis: { type: "value" },
        series: [
          {
            data: [89, 92, 110, 134, 48, 118],
            type: "bar",
            itemStyle: { color: "#5470c6" }
          }
        ]
      }
    },
    "chart:key4": {
      style: "width: 100%; height: 300px;",
      config: {
        title: { text: "基础折线图" },
        xAxis: {
          type: "category",
          data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
        },
        yAxis: { type: "value" },
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: "line",
            smooth: true,
            lineStyle: { color: "#ee6666" }
          }
        ]
      }
    },
    "chart:key5": {
      style: "width: 100%; height: 300px;",
      config: {
        title: { text: "基础饼图" },
        series: [
          {
            type: "pie",
            radius: "50%",
            data: [
              { value: 1048, name: "搜索引擎" },
              { value: 735, name: "直接访问" },
              { value: 580, name: "邮件营销" },
              { value: 484, name: "联盟广告" }
            ],
            emphasis: { itemStyle: { shadowBlur: 10 } }
          }
        ]
      }
    }
  }
};
const initRichText = (format = "default") => {
  initTextData();
  setTimeout(() => {
    initRenderRichTextData(format);
  }, 1000);
};
const initTextData = () => {
  tinymce.activeEditor.setContent(mockData.template);
};
const initRenderRichTextData = format => {
  // 渲染占位符内容
  const editor = tinymce.activeEditor;
  const iframeDoc = editor.contentDocument;
  const placeholders = mockData.placeholders;
  Object.keys(placeholders).forEach(placeholderId => {
    const placeholder = placeholders[placeholderId];
    const element = iframeDoc.querySelector(
      `[data-placeholder="{{${placeholderId}}}"]`
    ) as HTMLElement;
    if (element) {
      const type = placeholderId.split(":")[0] as "table" | "text" | "chart";
      renderPlaceholder(
        element,
        placeholder,
        type,
        format as "default" | "img"
      );
    }
  });
};
const renderPlaceholder = (
  element: HTMLElement,
  placeholder: any,
  type: "table" | "text" | "chart",
  format: "default" | "img"
) => {
  switch (type) {
    case "text":
      renderText(element, placeholder);
      break;
    case "table":
      renderTable(element, placeholder);
      break;
    case "chart":
      renderChart(element, placeholder, format);
      break;
    default:
      console.error("Unsupported placeholder type:", placeholder.type);
  }
};
const renderText = (element: HTMLElement, placeholder: any) => {
  element.innerHTML = placeholder.data;
};
const renderTable = (element: HTMLElement, placeholder: any) => {
  const tableHTML = `
        <table style="width: 100%; border-collapse: collapse;">
          ${placeholder.data
            .map(
              row => `
            <tr>
              ${row
                .map(
                  cell => `
             <td style="border: 1px solid #000; padding: 8px;">${cell}</td>
              `
                )
                .join("")}
            </tr>
          `
            )
            .join("")}
        </table>
      `;
  element.innerHTML = tableHTML;
};
const renderChart = (
  element: HTMLElement,
  placeholder: any,
  format: "default" | "img" = "default"
) => {
  const chart = echarts.init(element);
  chart.setOption(placeholder.config);
  if (format === "img") {
    // 监听渲染完成事件
    chart.on("finished", () => {
      const img = new Image();
      img.src = chart.getDataURL({
        pixelRatio: 1
      });
      const parent = element.parentNode;
      parent.replaceChild(img, element);
    });
  }
};
// 渲染编辑器中的图表
const renderChartsInEditor = data => {
  // const editor = tinymce.activeEditor;
  // const iframeDoc = editor.contentDocument;
  // const placeholderDom = iframeDoc.querySelector(`#${data.id}`) as HTMLElement;
  // const option = JSON.parse(placeholderDom.getAttribute("data-placeholder"));
  // const chart = echarts.init(placeholderDom);
  // chart.setOption(option);
};

const changeChartContent = () => {
  initRichText("img");
};
</script>

<template>
  <div>
    <textarea id="tinymce" />
    <div
      v-if="data"
      style="padding: 10px; margin-top: 20px; border: 1px solid #ccc"
    >
      <div v-copy:click="data">{{ data }}</div>
    </div>
    <div style="margin-top: 20px">
      <el-button type="primary" @click="getContent">获得内容</el-button>
      <el-button type="primary" @click="setContent">重置内容</el-button>
      <el-button type="primary" @click="changeChartContent"
        >chart转图片格式</el-button
      >
      <el-button type="primary" @click="selectTemp">选择模板</el-button>
    </div>
    <TemplateDialog
      v-if="dialogVisible"
      v-model="dialogVisible"
      @success="success"
    />
  </div>
</template>
