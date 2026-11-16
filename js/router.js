// Client-side router using the History API
export class Router {
  constructor({ routes, containerId = "app", onRouteChange }) {
    this.routes = routes;           // { path: renderFn }
    this.container = document.getElementById(containerId);
    this.onRouteChange = onRouteChange;
    this.currentPath = "/";
    this.notFoundFn = null;

    // Popstate (back/forward)
    window.addEventListener("popstate", (e) => {
      const path = e.state && e.state.path ? e.state.path : window.location.pathname;
      this.navigate(path, { push: false });
    });

    // Delegate link clicks -> client-side navigation
    document.addEventListener("click", (e) => {
      const link = e.target.closest("a[data-nav]");
      if (!link) return;
      e.preventDefault();
      const href = link.getAttribute("href");
      this.navigate(href, { push: true });
    });

    // Initial render
    this.navigate(window.location.pathname, { push: false });
  }

  notFound(fn) { this.notFoundFn = fn; return this; }

  resolve(path) {
    // Normalize
    let p = path === "/" ? "/" : path.replace(/\/+$/, "");
    // Exact match
    if (this.routes[p]) return { route: this.routes[p], params: {} };
    // Parameter match: /product/:id
    for (const [pathKey, renderFn] of Object.entries(this.routes)) {
      const segs = pathKey.split("/");
      const pSegs = p.split("/");
      if (segs.length !== pSegs.length) continue;
      const params = {};
      let matched = true;
      for (let i = 0; i < segs.length; i++) {
        if (segs[i].startsWith(":")) params[segs[i].slice(1)] = pSegs[i];
        else if (segs[i] !== pSegs[i]) { matched = false; break; }
      }
      if (matched) return { route: renderFn, params };
    }
    return null;
  }

  async navigate(path, { push = true } = {}) {
    this.currentPath = path;
    if (push) window.history.pushState({ path }, "", path);

    const resolved = this.resolve(path);
    if (this.container) this.container.innerHTML = "";

    if (resolved) {
      await resolved.route(resolved.params);
      if (this.onRouteChange) this.onRouteChange(path, resolved.params);
    } else if (this.notFoundFn) {
      await this.notFoundFn();
      if (this.onRouteChange) this.onRouteChange(path, {});
    }
  }

  link(path) { return path; } // helper placeholder
}

export const navigateTo = (path, push = true) => {
  if (typeof window.__router !== "undefined") window.__router.navigate(path, { push });
};
