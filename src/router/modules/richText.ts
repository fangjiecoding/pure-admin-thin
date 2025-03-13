export default {
  path: "/richText",
  redirect: "/richText/tinyMCE",
  meta: {
    title: "richText",
    rank: 11
  },
  children: [
    {
      path: "/richText/tinyMCE",
      name: "tinyMCE",
      component: () => import("@/views/richText/tinyMCE.vue"),
      meta: {
        title: "tinyMce"
      }
    },
    {
      path: "/richText/tiptap",
      name: "tiptap",
      component: () => import("@/views/richText/tiptap.vue"),
      meta: {
        title: "tiptap"
      }
    },
    {
      path: "/richText/quill",
      name: "quill",
      component: () => import("@/views/richText/quill.vue"),
      meta: {
        title: "quill"
      }
    },
    {
      path: "/richText/wangeditor",
      name: "wangeditor",
      component: () => import("@/views/richText/wangeditor.vue"),
      meta: {
        title: "wangeditor"
      }
    },
    {
      path: "/richText/ckeditor",
      name: "ckeditor",
      component: () => import("@/views/richText/ckeditor.vue"),
      meta: {
        title: "ckeditor"
      }
    }
  ]
} satisfies RouteConfigsTable;
