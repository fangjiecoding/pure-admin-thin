<script lang="ts" setup>
import { ref, nextTick, watch } from "vue";
import * as echarts from "echarts";

const dialogVisible = defineModel("update:modelValue", {
  type: Boolean,
  default: false
});
const emits = defineEmits(["success"]);

const templateTextList = ref([
  {
    template: `<h1 style="color: #2c3e50; font-size: 24px; font-weight: bold; margin-bottom: 20px;"><span data-placeholder="{{text:key1}}"></span>年全省公安机关警情总体情况</h1>
   <p style="font-size: 16px; line-height: 1.6; color: #34495e;">2023年，全省公安机关接处警平台接处警总量为 <strong style="color: #e74c3c;"><span data-placeholder="{{text:key2}}"></span>起</strong>，同比上升 <strong style="color: #e74c3c;"><span data-placeholder="{{text:key3}}"></span></strong>。</p>
   <p style="font-size: 16px; line-height: 1.6; color: #34495e;">这一数据反映了社会治安形势的变化以及公众对公安机关的依赖程度。</p>`,
    placeholder: {
      "text:key1": { data: 2023 },
      "text:key2": { data: "185650" },
      "text:key3": { data: "13.27%" }
    }
  },
  {
    template: `<h1 style="color: #2c3e50; font-size: 24px; font-weight: bold; margin-bottom: 20px;">警情类别分布</h1>
   <p style="font-size: 16px; line-height: 1.6; color: #34495e;">根据警情处理结果，2023年全省警情可分为以下五大类：</p>
   <ul style="list-style-type: disc; margin-left: 20px; color: #34495e;">
     <li style="font-size: 16px; line-height: 1.6;"><strong style="color: #e74c3c;">案件类警情</strong>：占 <strong><span data-placeholder="{{text:key4}}"></span></strong></li>
     <li style="font-size: 16px; line-height: 1.6;"><strong style="color: #e74c3c;">其他类警情</strong>：占 <strong><span data-placeholder="{{text:key5}}"></span></strong></li>
     <li style="font-size: 16px; line-height: 1.6;"><strong style="color: #e74c3c;">纠纷类警情</strong>：占 <strong><span data-placeholder="{{text:key6}}"></span></strong></li>
     <li style="font-size: 16px; line-height: 1.6;"><strong style="color: #e74c3c;">求助类警情</strong>：占 <strong><span data-placeholder="{{text:key7}}"></span></strong></li>
     <li style="font-size: 16px; line-height: 1.6;"><strong style="color: #e74c3c;">道路交通类警情</strong>：占 <strong><span data-placeholder="{{text:key8}}"></span></strong></li>
   </ul>`,
    placeholder: {
      "text:key4": { data: "22.97%" },
      "text:key5": { data: "60.91%" },
      "text:key6": { data: "6.61%" },
      "text:key7": { data: "8.34%" },
      "text:key8": { data: "1.14%" }
    }
  },
  {
    template: `<h1 style="color: #2c3e50; font-size: 24px; font-weight: bold; margin-bottom: 20px;">未来展望</h1>
   <p style="font-size: 16px; line-height: 1.6; color: #34495e;">随着技术的进步和警务改革的深入，预计未来警情处理效率将进一步提升。</p>
   <p style="font-size: 16px; line-height: 1.6; color: #34495e;">同时，公众的安全感和满意度也将得到显著提高。</p>`
  }
]);
const templateTableList = ref([
  {
    template: `<div data-placeholder="{{table:key9}}"></div>`,
    style: "width: 100%; border-collapse: collapse;",
    cellStyle: "border: 1px solid #000; padding: 8px;",
    placeholder: {
      "table:key9": {
        data: [
          ["Header 1", "Header 2", "Header 3"],
          ["Data 1", "Data 2", "Data 3"],
          ["Data 4", "Data 5", "Data 6"]
        ]
      }
    }
  },
  {
    template: `<div data-placeholder="{{table:key10}}"></div>`,
    style: "width: 100%; border-collapse: collapse;",
    cellStyle: "border: 1px solid #000; padding: 8px;",
    placeholder: {
      "table:key10": {
        data: [
          ["Name", "Age", "City"],
          ["Alice", "25", "New York"],
          ["Bob", "30", "San Francisco"],
          ["Charlie", "35", "Los Angeles"]
        ]
      }
    }
  },
  {
    template: `<div data-placeholder="{{table:key11}}"></div>`,
    style: "width: 100%; border-collapse: collapse;",
    cellStyle: "border: 1px solid #000; padding: 8px;",
    placeholder: {
      "table:key11": {
        data: [
          ["Product", "Price", "Quantity"],
          ["Apple", "$1.00", "10"],
          ["Banana", "$0.50", "20"],
          ["Orange", "$0.75", "15"]
        ]
      }
    }
  }
]);
const templateChartInfo = ref([
  {
    title: "柱形图",
    templates: [
      {
        template: `<div data-placeholder="{{chart:key12}}" style="width: 100%; height: 300px;"></div>`,
        style: "width: 100%; height: 300px;",
        placeholder: {
          "chart:key12": {
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
          }
        }
      },
      {
        template: `<div data-placeholder="{{chart:key13}}" style="width: 100%; height: 300px;"></div>`,
        style: "width: 100%; height: 300px;",
        placeholder: {
          "chart:key13": {
            config: {
              title: { text: "多系列柱状图" },
              xAxis: {
                type: "category",
                data: ["Q1", "Q2", "Q3", "Q4"]
              },
              yAxis: { type: "value" },
              series: [
                {
                  name: "2022",
                  data: [320, 302, 341, 374],
                  type: "bar",
                  itemStyle: { color: "#91cc75" }
                },
                {
                  name: "2023",
                  data: [420, 382, 401, 434],
                  type: "bar",
                  itemStyle: { color: "#fac858" }
                }
              ]
            }
          }
        }
      }
    ]
  },
  {
    title: "饼图",
    templates: [
      {
        template: `<div data-placeholder="{{chart:key14}}" style="width: 100%; height: 300px;"></div>`,
        placeholder: {
          "chart:key14": {
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
      },
      {
        template: `<div data-placeholder="{{chart:key15}}"  style="width: 300px; height: 300px;"></div>`,
        placeholder: {
          "chart:key15": {
            config: {
              title: { text: "环形图" },
              series: [
                {
                  type: "pie",
                  radius: ["40%", "70%"],
                  data: [
                    { value: 335, name: "北京" },
                    { value: 310, name: "上海" },
                    { value: 234, name: "广州" },
                    { value: 135, name: "深圳" }
                  ],
                  label: { show: false }
                }
              ]
            }
          }
        }
      }
    ]
  },
  {
    title: "折线图",
    templates: [
      {
        template: `<div data-placeholder="{{chart:key16}}" style="width: 300px; height: 300px;"></div>`,
        placeholder: {
          "chart:key16": {
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
          }
        }
      },
      {
        template: `<div data-placeholder="{{chart:key17}}" style="width: 300px; height: 300px;"></div>`,
        placeholder: {
          "chart:key17": {
            config: {
              title: { text: "多维度折线图" },
              xAxis: { type: "category", data: ["1月", "2月", "3月", "4月"] },
              yAxis: { type: "value" },
              series: [
                {
                  name: "用户增长",
                  data: [120, 200, 150, 80],
                  type: "line",
                  areaStyle: {}
                },
                {
                  name: "订单增长",
                  data: [82, 93, 90, 93],
                  type: "line",
                  areaStyle: {}
                }
              ]
            }
          }
        }
      }
    ]
  }
]);
const textRefs = ref(new Map());
const setTextRef = (el, index) => {
  if (el) {
    textRefs.value.set(index, el);
  }
};
const tableRefs = ref(new Map());
const setTableRef = (el, index) => {
  if (el) {
    tableRefs.value.set(index, el);
  }
};
const chartRefs = ref(new Map());
const setChartRef = (el, typeIndex, templateIndex) => {
  if (el) {
    chartRefs.value.set(`${typeIndex}-${templateIndex}`, el);
  }
};
const activeName = ref("text");
watch(
  () => activeName.value,
  val => {
    if (val === "text") {
      setTimeout(() => {
        textRefs.value.forEach((el, key) => {
          const textOption = templateTextList.value[key];
          // 创建临时容器解析模板
          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = textOption.template;
          // 查找所有占位符元素
          const placeholderElements =
            tempDiv.querySelectorAll("[data-placeholder]");
          console.log(placeholderElements);
          // 遍历处理每个占位符
          placeholderElements.forEach(element => {
            // // 提取原始占位符标识
            const rawPlaceholder = element.getAttribute("data-placeholder");
            // 使用正则表达式提取纯键名 (移除 {{}} 包装)
            const keyMatch = rawPlaceholder.match(/\{\{(.+?)\}\}/);
            if (!keyMatch) return;
            const key = keyMatch[1];
            // 获取对应的数据
            const value = textOption.placeholder[key].data;
            // 数据有效性检查
            if (value !== undefined && value !== null) {
              element.textContent = value; // 安全注入文本内容
            } else {
              console.warn(`未找到占位符 ${key} 对应的数据`);
              element.textContent = "[数据缺失]"; // 友好提示
            }
          });
          el.innerHTML = tempDiv.innerHTML;
        });
      });
    }
    if (val === "table") {
      nextTick(() => {
        tableRefs.value.forEach((el, key) => {
          const tableOption = templateTableList.value[key];
          const placeholderId = el.getAttribute("data-placeholder");
          const config = tableOption.placeholder[placeholderId];
          const tableHTML = `
        <table style="${tableOption.style}">
          ${config.data
            .map(
              row => `
            <tr>
              ${row
                .map(
                  cell => `
             <td style="${tableOption.cellStyle}">${cell}</td>
              `
                )
                .join("")}
            </tr>
          `
            )
            .join("")}
        </table>
          `;
          el.innerHTML = tableHTML;
        });
      });
    }
    if (val === "chart") {
      nextTick(() => {
        // 遍历 Map 结构
        chartRefs.value.forEach((el, key) => {
          const [typeIndex, templateIndex] = key.split("-").map(Number);
          // 添加数据校验
          const chartOption = templateChartInfo.value[typeIndex];
          if (!chartOption) return;
          const template = chartOption.templates?.[templateIndex];
          if (!template?.placeholder) return;
          // 获取data-placeholder属性
          const placeholderId = el.getAttribute("data-placeholder");
          // 初始化图表
          const chart = echarts.init(el);
          chart.setOption(template.placeholder[placeholderId].config);
          chart.resize();
        });
      });
    }
  },
  { immediate: true }
);
// 插入文本到 TinyMCE
const insertText = item => {
  emits("success", {
    type: "text",
    content: item.template,
    placeholder: item.placeholder
  });
};
// 插入表格到 TinyMCE
const insertTable = item => {
  emits("success", {
    type: "table",
    content: item.template,
    placeholder: item.placeholder
  });
};
// 插入图表到编辑器
const insertChart = item => {
  emits("success", {
    type: "chart",
    content: item.template,
    placeholder: item.placeholder
  });
};
</script>
<template>
  <el-dialog v-model="dialogVisible" title="选择模板" width="50%">
    <el-tabs v-model="activeName" tab-position="left" class="demo-tabs">
      <el-tab-pane name="text" label="文字">
        <div class="template-list">
          <div
            v-for="(item, index) in templateTextList"
            :key="index"
            :ref="el => setTextRef(el, index)"
            class="template-item"
            @click="insertText(item)"
          />
        </div>
      </el-tab-pane>
      <el-tab-pane name="table" label="表格">
        <div class="template-list">
          <div
            v-for="(item, index) in templateTableList"
            :key="index"
            :ref="el => setTableRef(el, index)"
            class="template-item"
            :data-placeholder="`${Object.keys(item.placeholder)[0]}`"
            @click="insertTable(item)"
          />
        </div>
      </el-tab-pane>
      <el-tab-pane name="chart" label="图表">
        <el-tabs class="chart-tabs">
          <el-tab-pane
            v-for="(item, index) in templateChartInfo"
            :key="index"
            :label="item.title"
          >
            <div class="chart-list">
              <div
                v-for="(template, tIndex) in item.templates"
                :key="tIndex"
                :ref="el => setChartRef(el, index, tIndex)"
                class="chart-item"
                :data-placeholder="`${Object.keys(template.placeholder)[0]}`"
                style="width: 300px; height: 300px"
                @click="insertChart(template)"
              />
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <span class="dialog-footer" />
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.template-list {
  display: flex;
  flex-direction: column;
  row-gap: 10px;

  .template-item {
    cursor: pointer;
  }
}

.chart-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
</style>
