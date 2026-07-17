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
    },
    {
      path: "/demoTest/iframe",
      name: "iframe",
      component: () => import("@/views/demoTest/iframe.vue"),
      meta: {
        title: "iframe",
        showParent: true
      }
    },
    {
      path: "/demoTest/bpm",
      name: "bpm",
      component: () => import("@/views/demoTest/bpm.vue"),
      meta: {
        title: "bpm",
        showParent: true
      }
    },
    {
      path: "/demoTest/bpmn-elform",
      name: "bpmn-elform",
      component: () => import("@/views/demoTest/bpmn-elform.vue"),
      meta: {
        title: "bpmn-elform",
        showParent: true
      }
    }
  ]
} satisfies RouteConfigsTable;
