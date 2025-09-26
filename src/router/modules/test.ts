export default {
  path: "/demoTest",
  redirect: "/demoTest/htmlToImg",
  meta: {
    title: "demoTest",
    rank: 12
  },
  children: [
    {
      path: "/demoTest/htmlToImg",
      name: "htmlToImg",
      component: () => import("@/views/demoTest/htmlToImg.vue"),
      meta: {
        title: "html转图片",
        showParent: true
      }
    }
  ]
} satisfies RouteConfigsTable;
