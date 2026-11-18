import { createRouter, createWebHashHistory } from "vue-router";
// Home is imported eagerly: it's the landing page, so it should be in the main bundle.
import HomeView from "../views/HomeView.vue";
import AboutView from "../views/AboutView.vue";
import NotFoundView from "../views/NotFoundView.vue";
import DashboardView from "../views/DashboardView.vue";
import DashboardProfileView from "../views/DashboardProfileView.vue";
import DashboardSettingsView from "../views/DashboardSettingsView.vue";
import { createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "home", // Named routes: navigate by name so URL changes don't break links.
    component: HomeView,
    meta: { title: "Home" }, // meta: central place for per-route data (titles, auth flags...).
  },
  {
    path: "/about",
    name: "about",
    // Lazy loading: this view becomes a separate chunk, loaded only when visited.
    // component: () => import('../views/AboutView.vue'),
    component: AboutView,
    meta: { title: "About" },
  },
  {
    // Redirect for an old/alias URL: users and bookmarks keep working after a rename.
    // Redirecting to a named route keeps it independent of the final path.
    path: "/home",
    redirect: { name: "home" },
  },
  {
    // Parent route: renders DashboardView (layout with its own <RouterView>).
    path: "/dashboard",
    component: DashboardView,
    // Default child: /dashboard has no page of its own, so send it to Profile.
    redirect: { name: "dashboard-profile" },
    meta: { title: "Dashboard" },
    children: [
      {
        // Relative child paths (no leading "/") are appended to the parent: /dashboard/profile.
        path: "profile",
        name: "dashboard-profile",
        component: DashboardProfileView,
        meta: { title: "Profile" },
      },
      {
        path: "settings",
        name: "dashboard-settings",
        component: DashboardSettingsView,
        meta: { title: "Settings" },
      },
    ],
  },
  {
    // Catch-all 404 route, always last, so unknown URLs show a proper page.
    path: "/:pathMatch(.*)*",
    name: "not-found",
    // component: () => import('../views/NotFoundView.vue'),
    component: NotFoundView,
    meta: { title: "Not Found" },
  },
];

const router = createRouter({
  // Hash mode: URLs look like /#/about. The server only ever sees "/", so no
  // server fallback config is needed (works on any static host).
  // history: createWebHashHistory(import.meta.env.BASE_URL),
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  // Restore scroll position on back/forward, jump to top on new navigation,
  // and support #anchors.
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    if (to.hash) return { el: to.hash, behavior: "smooth" };
    return { top: 0 };
  },
});

// Global guard: one place for cross-cutting concerns (titles, auth checks later).
router.afterEach((to) => {
  document.title = `${to.meta.title ?? "App"} | session-8`;
});

export default router;
