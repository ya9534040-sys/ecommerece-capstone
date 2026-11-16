// Application entry point
import { Router } from "./router.js";
import { renderHeader, initCart, updateCartCount } from "./components.js";
import {
  renderHome,
  renderProducts,
  renderProduct,
  renderAbout,
  renderContact,
  renderNotFound
} from "./pages.js";

const routes = {
  "/": renderHome,
  "/products": renderProducts,
  "/product/:id": renderProduct,
  "/about": renderAbout,
  "/contact": renderContact
};

function init() {
  // Shell
  document.body.innerHTML = `
    <header id="header"></header>
    <main id="app"></main>
  `;

  renderHeader(document.getElementById("header"));
  initCart();
  updateCartCount();

  const app = document.getElementById("app");

  const router = new Router({
    routes,
    containerId: "app",
    onRouteChange: (path) => {
      // Close mobile menu / cart on route change
      const nav = document.querySelector(".nav-list");
      if (nav) nav.classList.remove("open");
      const mb = document.getElementById("menu-btn");
      if (mb) mb.textContent = "☰";
      // Scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });
  router.notFound(renderNotFound);

  window.__router = router;
}

document.addEventListener("DOMContentLoaded", init);
