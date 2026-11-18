import { createRouter, createWebHashHistory } from "vue-router";
// Home is imported eagerly: it's the landing page, so it should be in the main bundle.
import HomeView from "../views/HomeView.vue";
import NotFoundView from "../views/NotFoundView.vue";
import PostsView from "../views/PostsView.vue";
import PostDetailView from "../views/PostDetailView.vue";
import DashboardView from "../views/DashboardView.vue";
import DashboardProfileView from "../views/DashboardProfileView.vue";
import DashboardSettingsView from "../views/DashboardSettingsView.vue";
import { createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import AdminView from "../views/AdminView.vue";
import ForbiddenView from "../views/ForbiddenView.vue";
import UsageDebounceView from "../views/UsageDebounceView.vue";
import UsageFetchStorageView from "../views/UsageFetchStorageView.vue";
import DynamicTransitionView from "../views/DynamicTransitionView.vue";
import UsageAsyncBoundary from "../views/UsageAsyncBoundary.vue";
import ScopedSlotView from "../views/ScopedSlotView.vue";
import { useAuth } from "../stores/auth";

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
    component: () => import("../views/AboutView.vue"),
    // component: AboutView,
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
    // Set on the parent only: children inherit it (to.meta merges all matched records),
    // so every /dashboard/* page is protected with one line.
    meta: { title: "Dashboard", requiresAuth: true },
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
    path: "/debounce",
    name: "debounce",
    component: UsageDebounceView,
    meta: { title: "Debounce" },
  },
  {
    path: "/fetch-storage",
    name: "fetch-storage",
    component: UsageFetchStorageView,
    meta: { title: "Fetch & Storage" },
  },
  {
    path: "/transition",
    name: "transition",
    component: DynamicTransitionView,
    meta: { title: "Transition" },
  },
  {
    path: "/async-boundary",
    name: "async-boundary",
    component: UsageAsyncBoundary,
    meta: { title: "Async Boundary" },
  },
  {
    path: "/scoped-slots",
    name: "scoped-slots",
    component: ScopedSlotView,
    meta: { title: "Scoped Slots" },
  },
  {
    // guestOnly: logged-in users have no reason to see the login page.
    path: "/login",
    name: "login",
    component: LoginView,
    meta: { title: "Login", guestOnly: true },
  },
  {
    // Authentication (logged in?) + Authorization (allowed role?) both declared in meta.
    path: "/admin",
    name: "admin",
    component: AdminView,
    meta: { title: "Admin", requiresAuth: true, roles: ["admin"] },
  },
  {
    path: "/forbidden",
    name: "forbidden",
    component: ForbiddenView,
    meta: { title: "Access denied" },
  },
  {
    // Static route: fixed path, lists all posts.
    path: "/posts",
    name: "posts",
    component: PostsView,
    meta: { title: "Posts" },
  },
  {
    // Dynamic route: ":id" is a param. "(\\d+)" restricts it to digits, so /posts/abc
    // falls through to the 404 route instead of calling the API with junk.
    path: "/posts/:id(\\d+)",
    name: "post-detail",
    component: PostDetailView,
    // props: true passes route.params as component props, so the view doesn't
    // depend on $route (easier to reuse and test).
    props: true,
    meta: { title: "Post" },
  },
  // Example: dynamic route + query param (e.g. /#/posts/5?tab=comments).
  // Query params are NOT part of the path, so they are never written in `path`.
  // `props: true` only maps params, so use a props function to pass both
  // (query values are strings, or null/arrays, so give them a default).
  // {
  //   path: "/posts/:id(\\d+)",
  //   name: "post-detail",
  //   component: PostDetailView,
  //   props: (route) => ({
  //     id: route.params.id,
  //     tab: route.query.tab ?? "details",
  //   }),
  // },
  // Navigate with: { name: "post-detail", params: { id: 5 }, query: { tab: "comments" } }
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

// beforeEach runs before every navigation: the single place for access control.
// Returning nothing/true allows it; returning a location redirects (no next() needed).
router.beforeEach((to) => {
  const { isLoggedIn, role } = useAuth();

  // Already logged in -> keep them away from /login.
  if (to.meta.guestOnly && isLoggedIn.value) return { name: "home" };

  // Authentication: protected route + no user -> login, remembering where they wanted to go.
  if (to.meta.requiresAuth && !isLoggedIn.value) {
    return { name: "login", query: { redirect: to.fullPath } };
  }

  // Authorization: logged in, but is their role allowed? If not -> 403 (not login:
  // they are already authenticated, logging in again would not help).
  if (to.meta.roles && !to.meta.roles.includes(role.value)) {
    return { name: "forbidden" };
  }
});

// afterEach runs after navigation is confirmed (it can't block or redirect):
// good for side effects like the page title, analytics, closing menus.
router.afterEach((to) => {
  document.title = `${to.meta.title ?? "App"} | session-8`;
});

export default router;
