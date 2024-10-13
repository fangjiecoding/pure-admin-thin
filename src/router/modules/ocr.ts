export default {
  path: "/ocr",
  redirect: "/ocr/ocrTest",
  meta: {
    title: "ocr",
    rank: 11
  },
  children: [
    {
      path: "/ocr/ocrTest",
      name: "ocrTest",
      component: () => import("@/views/ocr/index.vue"),
      meta: {
        title: "OcrTest"
      }
    }
  ]
} satisfies RouteConfigsTable;
