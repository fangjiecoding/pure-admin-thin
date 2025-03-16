<template>
  <el-dialog v-model="dialogVisible" title="选择模板" width="50%">
    <el-tabs v-model="activeName" tab-position="left" class="demo-tabs">
      <el-tab-pane name="text" label="文字">
        <div class="template-list">
          <div
            v-for="(item, index) in templateTextList"
            :key="index"
            class="template-item"
            @click="insertText(item)"
          >
            <div v-html="item" />
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane name="chart" label="图表">
        <el-tabs class="chart-tabs">
          <el-tab-pane
            v-for="(item, index) in templateChartInfo"
            :key="index"
            :label="item.title"
          >
            <div
              v-for="(template, tIndex) in item.templates"
              :key="tIndex"
              class="template"
              @click="insertChart(template)"
            >
              <div
                :ref="el => (chartRefs[`${index}-${tIndex}`] = el)"
                class="chart"
                :style="{ width: '200px', height: '150px' }"
              />
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
      <el-tab-pane name="table" label="表格">
        <div class="template-list">
          <div
            v-for="(template, index) in templateTableList"
            :key="index"
            class="template-item"
            @click="insertTable(template)"
          >
            <table :style="template.style">
              <tr v-for="(row, rowIndex) in template.rows" :key="rowIndex">
                <td
                  v-for="(cell, cellIndex) in row"
                  :key="cellIndex"
                  :style="template.cellStyle"
                >
                  {{ cell }}
                </td>
              </tr>
            </table>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <span class="dialog-footer" />
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, nextTick, watch } from "vue";
const dialogVisible = defineModel();
const emits = defineEmits(["success"]);
import { useECharts } from "@pureadmin/utils";

export interface IProps {
  title: string;
}
const props = withDefaults(defineProps<IProps>(), {
  title: ""
});

const templateTextList = ref([
  `<h1 style="color: #2c3e50; font-size: 24px; font-weight: bold; margin-bottom: 20px; data-set='1111'">2023年全省公安机关警情总体情况</h1>
   <p style="font-size: 16px; line-height: 1.6; color: #34495e;">2023年，全省公安机关接处警平台接处警总量为 <strong style="color: #e74c3c;">1,885,650起</strong>，同比上升 <strong style="color: #e74c3c;">13.27%</strong>。</p>
   <p style="font-size: 16px; line-height: 1.6; color: #34495e;">这一数据反映了社会治安形势的变化以及公众对公安机关的依赖程度。</p>`,

  `<h2 style="color: #2980b9; font-size: 20px; font-weight: bold; margin-bottom: 15px;">警情来源分析</h2>
   <p style="font-size: 16px; line-height: 1.6; color: #34495e;">其中，“110”报警服务平台接警 <strong style="color: #e74c3c;">1,509,705起</strong>，同比下降 <strong style="color: #e74c3c;">2.41%</strong>，占接处警总量的 <strong style="color: #e74c3c;">80.06%</strong>。</p>
   <p style="font-size: 16px; line-height: 1.6; color: #34495e;">这表明“110”仍然是公众报警的主要渠道，但其占比有所下降。</p>`,

  `<h2 style="color: #2980b9; font-size: 20px; font-weight: bold; margin-bottom: 15px;">自接警情况</h2>
   <p style="font-size: 16px; line-height: 1.6; color: #34495e;">办案单位自接警 <strong style="color: #e74c3c;">375,945起</strong>，同比上升 <strong style="color: #e74c3c;">339.6%</strong>，占接处警总量的 <strong style="color: #e74c3c;">19.94%</strong>。</p>
   <p style="font-size: 16px; line-height: 1.6; color: #34495e;">自接警数量的大幅上升可能与公安机关内部流程优化和信息化建设有关。</p>`,

  `<h1 style="color: #2c3e50; font-size: 24px; font-weight: bold; margin-bottom: 20px;">警情类别分布</h1>
   <p style="font-size: 16px; line-height: 1.6; color: #34495e;">根据警情处理结果，2023年全省警情可分为以下五大类：</p>
   <ul style="list-style-type: disc; margin-left: 20px; color: #34495e;">
     <li style="font-size: 16px; line-height: 1.6;"><strong style="color: #e74c3c;">案件类警情</strong>：占 <strong>22.97%</strong></li>
     <li style="font-size: 16px; line-height: 1.6;"><strong style="color: #e74c3c;">其他类警情</strong>：占 <strong>60.91%</strong></li>
     <li style="font-size: 16px; line-height: 1.6;"><strong style="color: #e74c3c;">纠纷类警情</strong>：占 <strong>6.61%</strong></li>
     <li style="font-size: 16px; line-height: 1.6;"><strong style="color: #e74c3c;">求助类警情</strong>：占 <strong>8.34%</strong></li>
     <li style="font-size: 16px; line-height: 1.6;"><strong style="color: #e74c3c;">道路交通类警情</strong>：占 <strong>1.14%</strong></li>
   </ul>`,

  `<h2 style="color: #2980b9; font-size: 20px; font-weight: bold; margin-bottom: 15px;">纠纷类警情分析</h2>
   <p style="font-size: 16px; line-height: 1.6; color: #34495e;">纠纷类警情占 <strong style="color: #e74c3c;">6.61%</strong>，主要集中在邻里矛盾、经济纠纷等领域。</p>
   <p style="font-size: 16px; line-height: 1.6; color: #34495e;">建议加强基层调解力量，减少纠纷升级为案件的可能性。</p>`,

  `<h2 style="color: #2980b9; font-size: 20px; font-weight: bold; margin-bottom: 15px;">求助类警情分析</h2>
   <p style="font-size: 16px; line-height: 1.6; color: #34495e;">求助类警情占 <strong style="color: #e74c3c;">8.34%</strong>，反映了公众对公安机关的信任和依赖。</p>
   <p style="font-size: 16px; line-height: 1.6; color: #34495e;">建议进一步优化求助响应机制，提升公众满意度。</p>`,

  `<h2 style="color: #2980b9; font-size: 20px; font-weight: bold; margin-bottom: 15px;">道路交通类警情分析</h2>
   <p style="font-size: 16px; line-height: 1.6; color: #34495e;">道路交通类警情占 <strong style="color: #e74c3c;">1.14%</strong>，占比相对较小，但仍需加强交通管理和安全教育。</p>`,

  `<h1 style="color: #2c3e50; font-size: 24px; font-weight: bold; margin-bottom: 20px;">警情处理建议</h1>
   <p style="font-size: 16px; line-height: 1.6; color: #34495e;">针对案件类警情的高发，建议：</p>
   <ol style="list-style-type: decimal; margin-left: 20px; color: #34495e;">
     <li style="font-size: 16px; line-height: 1.6;">加强社会治安防控体系建设。</li>
     <li style="font-size: 16px; line-height: 1.6;">提升警务信息化水平，优化警力资源配置。</li>
     <li style="font-size: 16px; line-height: 1.6;">加强社区警务工作，预防和减少案件发生。</li>
   </ol>`,

  `<h2 style="color: #2980b9; font-size: 20px; font-weight: bold; margin-bottom: 15px;">自接警增长原因分析</h2>
   <p style="font-size: 16px; line-height: 1.6; color: #34495e;">自接警数量的大幅上升可能与以下因素有关：</p>
   <ul style="list-style-type: disc; margin-left: 20px; color: #34495e;">
     <li style="font-size: 16px; line-height: 1.6;">公安机关内部流程优化。</li>
     <li style="font-size: 16px; line-height: 1.6;">信息化系统的普及和应用。</li>
     <li style="font-size: 16px; line-height: 1.6;">公众对非紧急警情的认知提升。</li>
   </ul>`,

  `<h1 style="color: #2c3e50; font-size: 24px; font-weight: bold; margin-bottom: 20px;">未来展望</h1>
   <p style="font-size: 16px; line-height: 1.6; color: #34495e;">随着技术的进步和警务改革的深入，预计未来警情处理效率将进一步提升。</p>
   <p style="font-size: 16px; line-height: 1.6; color: #34495e;">同时，公众的安全感和满意度也将得到显著提高。</p>`
]);

const templateChartInfo = ref([
  {
    title: "柱形图",
    templates: [
      {
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
      {
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
    ]
  },
  {
    title: "饼图",
    templates: [
      {
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
      },
      {
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
    ]
  },
  {
    title: "折线图",
    templates: [
      {
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
      {
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
    ]
  }
  // {
  //   title: "散点图",
  //   templates: [
  //     {
  //       config: {
  //         title: { text: "气泡图示例" },
  //         xAxis: { type: "value" },
  //         yAxis: { type: "value" },
  //         series: [
  //           {
  //             type: "scatter",
  //             symbolSize: 20,
  //             data: [
  //               [10.0, 8.04],
  //               [8.07, 6.95],
  //               [13.0, 7.58],
  //               [9.05, 8.81],
  //               [11.0, 8.33],
  //               [14.0, 7.66]
  //             ],
  //             itemStyle: { color: "#73c0de" }
  //           }
  //         ]
  //       }
  //     }
  //   ]
  // },
  // {
  //   title: "雷达图",
  //   templates: [
  //     {
  //       config: {
  //         title: { text: "能力雷达图" },
  //         radar: {
  //           indicator: [
  //             { name: "技术", max: 6500 },
  //             { name: "沟通", max: 16000 },
  //             { name: "管理", max: 30000 },
  //             { name: "创新", max: 38000 }
  //           ]
  //         },
  //         series: [
  //           {
  //             type: "radar",
  //             data: [
  //               {
  //                 value: [4200, 3000, 20000, 35000],
  //                 name: "员工能力评估"
  //               }
  //             ]
  //           }
  //         ]
  //       }
  //     }
  //   ]
  // }
]);
const chartRefs = ref<any>();

const activeName = ref("text");
watch(
  () => activeName.value,
  val => {
    console.log(val);
    if (val === "chart") {
      nextTick(() => {
        // Object.entries(chartRefs.value).forEach(([key, el]) => {
        //   const [typeIndex, templateIndex] = key.split("-");
        //   const elRef = ref(el);
        //   const chart = useECharts(elRef.value);
        //   chart.setOption(
        //     templateChartInfo.value[typeIndex].templates[templateIndex].config
        //   );
        //   chart.resize();
        // });
      });
    }
  }
);

const templateTableList = ref([
  {
    rows: [
      ["Header 1", "Header 2", "Header 3"],
      ["Data 1", "Data 2", "Data 3"],
      ["Data 4", "Data 5", "Data 6"]
    ],
    style: "width: 100%; border-collapse: collapse;",
    cellStyle: "border: 1px solid #000; padding: 8px;" // 单元格样式
  },
  {
    rows: [
      ["Name", "Age", "City"],
      ["Alice", "25", "New York"],
      ["Bob", "30", "San Francisco"],
      ["Charlie", "35", "Los Angeles"]
    ],
    style: "width: 100%; border-collapse: collapse;",
    cellStyle: "border: 1px solid #000; padding: 8px;" // 单元格样式
  },
  {
    rows: [
      ["Product", "Price", "Quantity"],
      ["Apple", "$1.00", "10"],
      ["Banana", "$0.50", "20"],
      ["Orange", "$0.75", "15"]
    ],
    style: "width: 100%; border-collapse: collapse;",
    cellStyle: "border: 1px solid #000; padding: 8px;" // 单元格样式
  }
]);

const insertText = item => {
  dialogVisible.value = false;
  emits("success", item);
};

const insertChart = template => {
  const chartId = "echart-" + Date.now();
  const chartHTML = `
        <div>
          <div id="${chartId}" style="width: 600px; height: 400px;"></div>
          <script>
            const chart = echarts.init(document.getElementById('${chartId}'));
            chart.setOption(${JSON.stringify(template.config)});
          <\/script>
        </div>
      `;
  dialogVisible.value = false;
  emits("success", chartHTML);
};
// 插入表格到 TinyMCE
const insertTable = template => {
  // 生成表格 HTML
  const tableHTML = `
        <table style="${template.style}">
          ${template.rows
            .map(
              row => `
            <tr>
              ${row
                .map(
                  cell => `
             <td style="${template.cellStyle}">${cell}</td>
              `
                )
                .join("")}
            </tr>
          `
            )
            .join("")}
        </table>
      `;
  dialogVisible.value = false;
  emits("success", tableHTML);
};
</script>

<style lang="scss" scoped>
.template-list {
  display: flex;
  flex-direction: column;
  row-gap: 10px;

  .template-item {
    cursor: pointer;
  }
}
</style>
