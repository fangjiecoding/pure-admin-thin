export default {
  path: "/ocr",
  redirect: "/ocr/ocrBaiduYunTes",
  meta: {
    title: "ocr",
    rank: 11
  },
  children: [
    {
      path: "/ocr/baiduYunTest",
      name: "ocrTest",
      component: () => import("@/views/ocr/baiduYunTest.vue"),
      meta: {
        title: "百度智能云"
      }
    },
    {
      path: "/ocr/tesseractTest",
      name: "tesseractTest",
      component: () => import("@/views/ocr/tesseractTest.vue"),
      meta: {
        title: "tesseract"
      }
    }
  ]
} satisfies RouteConfigsTable;
