// Page renderers
import { products, categories, cart, saveCart } from "./data.js";
import { navigateTo } from "./router.js";
import { productCard, updateCartCount, initQuickAdd, showToast } from "./components.js";

const getApp = () => document.getElementById("app");

export async function renderHome() {
  const featured = products.slice(0, 4);
  getApp().innerHTML = `
    <section class="hero">
      <h1>Everything you need,<br/>delivered with care.</h1>
      <p>Discover curated essentials across electronics, home, apparel, and accessories — quality products at fair prices.</p>
      <div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;">
        <a href="/products" class="btn btn-primary" data-nav>Shop Now</a>
        <a href="/about" class="btn btn-outline" data-nav>About Us</a>
      </div>
    </section>
    <div class="section-sm">
      <div class="container">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;">
          <h2 style="font-size:1.5rem;font-weight:800;">Featured</h2>
          <a href="/products" class="btn btn-ghost btn-sm" data-nav>View all</a>
        </div>
        <div class="grid grid-4">${featured.map(productCard).join("")}</div>
      </div>
    </div>
  `;
  initQuickAdd();
}

export async function renderProducts(params) {
  const { category, q, sort } = params;
  const url = new URL(window.location.href);
  const cat = category || url.searchParams.get("category") || "";
  const query = (q || url.searchParams.get("q") || "").toLowerCase();
  const sortBy = sort || url.searchParams.get("sort") || "featured";

  let filtered = products.filter(p => p.inStock);
  if (cat) filtered = filtered.filter(p => p.category === cat);
  if (query) filtered = filtered.filter(p => p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query));

  if (sortBy === "price-asc") filtered.sort((a, b) => a.price - b.price);
  else if (sortBy === "price-desc") filtered.sort((a, b) => b.price - a.price);
  else if (sortBy === "alpha") filtered.sort((a, b) => a.name.localeCompare(b.name));

  const catLinks = categories.map(c => `
    <a href="/products?category=${encodeURIComponent(c)}" class="btn btn-ghost btn-sm ${c === cat ? "btn-primary" : ""}" data-nav style="${c === cat ? "color:var(--white)" : ""}">${c}</a>
  `).join("");

  getApp().innerHTML = `
    <div class="section">
      <div class="container">
        <div class="page-header">
          <h1 class="page-title">${cat || "All Products"}</h1>
          <p class="page-subtitle">${filtered.length} item${filtered.length !== 1 ? "s" : ""} found${query ? ` matching "${escapeHtml(query)}"` : ""}</p>
        </div>
        <div style="display:grid;grid-template-columns:1fr;gap:1rem;align-items:start;margin-bottom:2rem;">
          <div style="display:flex;gap:0.75rem;flex-wrap:wrap;align-items:center;">
            <strong style="font-size:0.9rem;color:var(--gray-600);">Filter by category:</strong>
            <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">${catLinks}</div>
          </div>
          <div style="display:flex;gap:0.75rem;align-items:center;">
            <strong style="font-size:0.9rem;color:var(--gray-600);">Sort:</strong>
            <select id="sort-select" class="form-control" style="width:auto;max-width:200px;">
              <option value="featured" ${sortBy === "featured" ? "selected" : ""}>Featured</option>
              <option value="price-asc" ${sortBy === "price-asc" ? "selected" : ""}>Price: low to high</option>
              <option value="price-desc" ${sortBy === "price-desc" ? "selected" : ""}>Price: high to low</option>
              <option value="alpha" ${sortBy === "alpha" ? "selected" : ""}>Name A–Z</option>
            </select>
          </div>
          ${query ? `<div style="margin-top:0.5rem;"><a href="/products" class="btn btn-ghost btn-sm" data-nav>Clear filters</a></div>` : ""}
        </div>
        <div class="grid grid-4" id="products-grid">
          ${filtered.length ? filtered.map(productCard).join("") : `<div style="grid-column:1/-1;"><div class="state-box" style="padding:2rem;"><h3>No products found</h3><p>Try adjusting your filters or search.</p></div></div>`}
        </div>
      </div>
    </div>
  `;

  document.getElementById("sort-select").addEventListener("change", (e) => {
    const sel = e.target.value;
    const base = "/products" + (cat ? `?category=${encodeURIComponent(cat)}` : "") + (query ? `?q=${encodeURIComponent(query)}` : "") + (cat && query ? "" : "");
    const sep = (cat || query) ? "&" : "?";
    navigateTo(`${base}${sep}sort=${sel}`, true);
  });
  initQuickAdd();
}

export async function renderProduct(params) {
  const p = products.find(x => x.id === params.id);
  if (!p) return renderNotFound();
  const related = products.filter(x => x.category === p.category && x.id !== p.id).slice(0, 4);
  getApp().innerHTML = `
    <div class="section">
      <div class="container">
        <a href="/products" class="btn btn-ghost btn-sm" data-nav>← Back to shop</a>
        <div class="grid grid-2" style="margin-top:1.5rem;">
          <div>
            <div class="detail-image">
              <img src="${p.image}" alt="${escapeHtml(p.name)}" loading="lazy" />
            </div>
          </div>
          <div class="detail-meta" style="display:flex;flex-direction:column;gap:1rem;">
            <div class="product-cat">${escapeHtml(p.category)}</div>
            <h1 style="font-size:2rem;font-weight:800;line-height:1.2;">${escapeHtml(p.name)}</h1>
            <div class="detail-price">$${p.price.toFixed(2)} ${p.oldPrice ? `<span style="font-size:1rem;font-weight:500;color:var(--gray-600);margin-left:0.5rem;text-decoration:line-through;">$${p.oldPrice.toFixed(2)}</span>` : ""}</div>
            <div class="detail-desc">${escapeHtml(p.description)}</div>
            <div style="display:flex;gap:0.75rem;align-items:center;">
              <div class="cart-item-actions" style="margin-left:0;">
                <button class="qty-btn" id="qty-minus" title="Decrease">−</button>
                <span class="qty-val" id="qty-val">1</span>
                <button class="qty-btn" id="qty-plus" title="Increase">+</button>
              </div>
              <button class="btn btn-primary" id="add-to-detail" style="margin-left:auto;padding:0.875rem 1.75rem;font-size:1rem;" ${!p.inStock ? "disabled" : ""}>
                ${p.inStock ? "Add to Cart" : "Out of Stock"}
              </button>
            </div>
            ${!p.inStock ? `<p style="color:var(--danger);font-size:0.9rem;font-weight:600;">Currently unavailable.</p>` : ""}
          </div>
        </div>
        ${related.length ? `
        <div style="margin-top:3rem;border-top:1px solid var(--gray-200);padding-top:2rem;">
          <h2 style="font-size:1.5rem;font-weight:800;margin-bottom:1rem;">You may also like</h2>
          <div class="grid grid-4">${related.map(productCard).join("")}</div>
        </div>` : ""}
      </div>
    </div>
  `;
  initQuickAdd();

  let qty = 1;
  const minus = document.getElementById("qty-minus");
  const plus = document.getElementById("qty-plus");
  const val = document.getElementById("qty-val");
  const addBtn = document.getElementById("add-to-detail");
  minus.addEventListener("click", () => { if (qty > 1) { qty--; val.textContent = qty; } });
  plus.addEventListener("click", () => { qty++; val.textContent = qty; });
  addBtn.addEventListener("click", () => {
    const existing = cart.find(c => c.id === p.id);
    if (existing) existing.qty += qty;
    else cart.push({ id: p.id, qty });
    saveCart();
    updateCartCount();
    showToast(`Added ${qty}× "${p.name}" to cart`);
  });
}

export async function renderAbout() {
  getApp().innerHTML = `
    <div class="section">
      <div class="container">
        <div class="page-header">
          <h1 class="page-title">About NovaCart</h1>
          <p class="page-subtitle">Built to demonstrate professional-grade web development.</p>
        </div>
        <div class="grid grid-2">
          <div>
            <p style="font-size:1.05rem;color:var(--gray-600);line-height:1.8;margin-bottom:1.5rem;">
              NovaCart is a full-stack capstone project featuring a modular frontend architecture, client-side routing,
              asset optimization, and production-ready deployment. It showcases modern web development practices
              including responsive design, component-driven UI, state management, and performant asset delivery.
            </p>
            <p style="font-size:1.05rem;color:var(--gray-600);line-height:1.8;">
              This project was built with vanilla HTML, CSS, and JavaScript — no build step required — making it
              instantly deployable to any static host such as Vercel, Netlify, or Render.
            </p>
          </div>
          <div class="card" style="padding:2rem;">
            <h3 style="font-size:1.25rem;font-weight:800;margin-bottom:1rem;">Tech Stack</h3>
            <ul style="color:var(--gray-600);line-height:1.8;list-style:disc;padding-left:1.2rem;">
              <li>Semantic HTML5</li>
              <li>Modern CSS (custom properties, grid, flexbox)</li>
              <li>ES6+ modules &amp; client-side routing (History API)</li>
              <li>LocalStorage cart persistence</li>
              <li>Static hosting (Vercel / Netlify / Render)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `;
}

export async function renderContact() {
  getApp().innerHTML = `
    <div class="section">
      <div class="container">
        <div class="page-header" style="max-width:600px;">
          <h1 class="page-title">Contact Us</h1>
          <p class="page-subtitle">Have a question? We'd love to hear from you.</p>
        </div>
        <div class="card" style="max-width:600px;padding:2rem;">
          <form id="contact-form" novalidate>
            <div class="form-group">
              <label for="name">Name</label>
              <input type="text" id="name" class="form-control" required placeholder="Your name" />
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" class="form-control" required placeholder="you@example.com" />
            </div>
            <div class="form-group">
              <label for="message">Message</label>
              <textarea id="message" class="form-control" rows="5" required placeholder="How can we help?"></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  `;
  document.getElementById("contact-form").addEventListener("submit", (e) => {
    e.preventDefault();
    showToast("Thanks! Your message has been sent (demo).");
    e.target.reset();
  });
}

export async function renderNotFound() {
  getApp().innerHTML = `
    <div class="section" style="text-align:center;">
      <div class="container">
        <div class="state-box" style="max-width:400px;margin:0 auto;">
          <h3 style="font-size:3rem;font-weight:800;">404</h3>
          <p>Page not found.</p>
          <a href="/" class="btn btn-primary" style="margin-top:1rem;data-nav">Go Home</a>
        </div>
      </div>
    </div>
  `;
}

function escapeHtml(s) {
  const d = document.createElement("div");
  d.textContent = s;
  return d.innerHTML;
}
