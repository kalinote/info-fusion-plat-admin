import { type RouteRecordRaw, createRouter, createWebHashHistory, createWebHistory } from "vue-router"

const Layouts = () => import("@/layouts/index.vue")

/** 常驻路由 */
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: "/redirect",
    component: Layouts,
    meta: {
      hidden: true
    },
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("@/views/redirect/index.vue")
      }
    ]
  },
  {
    path: "/403",
    component: () => import("@/views/error-page/403.vue"),
    meta: {
      hidden: true
    }
  },
  {
    path: "/404",
    component: () => import("@/views/error-page/404.vue"),
    meta: {
      hidden: true
    },
    alias: "/:pathMatch(.*)*"
  },
  {
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      hidden: true
    }
  },
  {
    path: "/",
    component: Layouts,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        component: () => import("@/views/dashboard/index.vue"),
        name: "Dashboard",
        meta: {
          title: "首页",
          svgIcon: "dashboard",
          affix: true
        }
      }
    ]
  },
  {
    path: "/unocss",
    component: Layouts,
    redirect: "/unocss/index",
    children: [
      {
        path: "index",
        component: () => import("@/views/unocss/index.vue"),
        name: "UnoCSS",
        meta: {
          title: "unocss",
          svgIcon: "unocss"
        }
      }
    ]
  },
  {
    path: "/hook-demo",
    component: Layouts,
    redirect: "/hook-demo/use-fetch-select",
    name: "HookDemo",
    meta: {
      title: "hook 示例",
      elIcon: "Menu",
      alwaysShow: true
    },
    children: [
      {
        path: "use-fetch-select",
        component: () => import("@/views/hook-demo/use-fetch-select.vue"),
        name: "UseFetchSelect",
        meta: {
          title: "useFetchSelect"
        }
      },
      {
        path: "use-fullscreen-loading",
        component: () => import("@/views/hook-demo/use-fullscreen-loading.vue"),
        name: "UseFullscreenLoading",
        meta: {
          title: "useFullscreenLoading"
        }
      }
    ]
  }
]

/**
 * 动态路由
 * 用来放置有权限 (Roles 属性) 的路由
 * 必须带有 Name 属性
 */
export const asyncRoutes: RouteRecordRaw[] = [
  {
    path: "/permission",
    component: Layouts,
    redirect: "/permission/page",
    name: "Permission",
    meta: {
      title: "权限管理",
      svgIcon: "lock",
      roles: ["admin", "editor"], // 可以在根路由中设置角色
      alwaysShow: true // 将始终显示根菜单
    },
    children: [
      {
        path: "page",
        component: () => import("@/views/permission/page.vue"),
        name: "PagePermission",
        meta: {
          title: "页面权限",
          roles: ["admin"] // 或者在子导航中设置角色
        }
      },
      {
        path: "directive",
        component: () => import("@/views/permission/directive.vue"),
        name: "DirectivePermission",
        meta: {
          title: "指令权限" // 如果未设置角色，则表示：该页面不需要权限，但会继承根路由的角色
        }
      }
    ]
  },
  {
    path: "/data_source",
    component: Layouts,
    redirect: "/data_source/spiders_source",
    name: "DataSource",
    meta: {
      title: "采集程序管理",
      svgIcon: "data-source",
      alwaysShow: true // 将始终显示根菜单
    },
    children: [
      {
        path: "spiders_source",
        component: () => import("@/views/data-source/spiders/index.vue"),
        name: "spiders_source",
        meta: {
          title: "所有采集程序",
          roles: ["admin", "editor"] // 可以在根路由中设置角色
        }
      },
      {
        path: "wiki_source",
        component: () => import("@/views/data-source/wiki/index.vue"),
        name: "wiki_source",
        meta: {
          title: "Wiki站点信息",
          roles: ["admin", "editor"] // 可以在根路由中设置角色
        }
      },
      {
        path: "rss_source",
        component: () => import("@/views/data-source/rss/index.vue"),
        name: "rss_source",
        meta: {
          title: "RSS采集模板",
          roles: ["admin", "editor"] // 可以在根路由中设置角色
        }
      },
      {
        path: "platform",
        component: () => import("@/views/data-source/platform/index.vue"),
        name: "platform_source",
        meta: {
          title: "平台采集程序",
          roles: ["admin", "editor"] // 可以在根路由中设置角色
        }
      }
    ]
  },
  {
    path: "/web_monitoring",
    component: Layouts,
    redirect: "/web_monitoring/index",
    children: [
      {
        path: "index",
        component: () => import("@/views/web-monitoring/index.vue"),
        name: "web_monitoring",
        meta: {
          title: "页面监测",
          svgIcon: "web-monitoring",
          roles: ["admin"] // 可以在根路由中设置角色
        }
      }
    ]
  },
  {
    path: "/token_management",
    component: Layouts,
    redirect: "/token_management/index",
    children: [
      {
        path: "index",
        component: () => import("@/views/token-management/index.vue"),
        name: "token_management",
        meta: {
          title: "Token管理",
          svgIcon: "token-management",
          roles: ["admin"] // 可以在根路由中设置角色
        }
      }
    ]
  },
  {
    path: "/payment",
    component: Layouts,
    redirect: "/payment/index",
    children: [
      {
        path: "index",
        component: () => import("@/views/token-management/index.vue"),
        name: "payment",
        meta: {
          title: "资费管理",
          svgIcon: "payment",
          roles: ["admin"] // 可以在根路由中设置角色
        }
      }
    ]
  },
  {
    path: "/agent_workflow",
    component: Layouts,
    redirect: "/agent_workflow/index",
    children: [
      {
        path: "index",
        component: () => import("@/views/agent-workflow/index.vue"),
        name: "agent_workflow",
        meta: {
          title: "Agent工作流",
          svgIcon: "workflow",
          roles: ["admin"] // 可以在根路由中设置角色
        }
      }
    ]
  },
  {
    path: "/docker",
    component: Layouts,
    name: "docker",
    meta: {
      title: "Docker",
      svgIcon: "docker",
      roles: ["admin"] // 可以在根路由中设置角色
    }
  },
  {
    path: "/link",
    component: Layouts,
    name: "external_link",
    meta: {
      title: "外部链接",
      svgIcon: "link"
    },
    children: [
      {
        path: "http://192.168.31.50:8080/",
        component: () => {},
        name: "crawlab",
        meta: {
          title: "Crawlab",
          svgIcon: "crawlab"
        }
      },
      {
        path: "http://192.168.31.50:5601/app/dev_tools/",
        component: () => {},
        name: "kibana",
        meta: {
          title: "Kibana",
          svgIcon: "kibana"
        }
      },
      {
        path: "http://192.168.31.50:8082/",
        component: () => {},
        name: "redpanda_console",
        meta: {
          title: "Redpanda Console",
          svgIcon: "kafka"
        }
      },
      {
        path: "http://192.168.31.50:18888/",
        component: () => {},
        name: "jupyter",
        meta: {
          title: "Jupyter Lab",
          svgIcon: "jupyter"
        }
      }
    ]
  },
  {
    path: "/:pathMatch(.*)*", // Must put the 'ErrorPage' route at the end, 必须将 'ErrorPage' 路由放在最后
    redirect: "/404",
    name: "ErrorPage",
    meta: {
      hidden: true
    }
  }
]

const router = createRouter({
  history:
    import.meta.env.VITE_ROUTER_HISTORY === "hash"
      ? createWebHashHistory(import.meta.env.VITE_PUBLIC_PATH)
      : createWebHistory(import.meta.env.VITE_PUBLIC_PATH),
  routes: constantRoutes
})

/** 重置路由 */
export function resetRouter() {
  // 注意：所有动态路由路由必须带有 Name 属性，否则可能会不能完全重置干净
  try {
    router.getRoutes().forEach((route) => {
      const { name, meta } = route
      if (name && meta.roles?.length) {
        router.hasRoute(name) && router.removeRoute(name)
      }
    })
  } catch {
    // 强制刷新浏览器也行，只是交互体验不是很好
    window.location.reload()
  }
}

export default router
