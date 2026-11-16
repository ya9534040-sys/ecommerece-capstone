// Reusable UI components
import { navigateTo } from "./router.js";

// ---------- Cart state (mirrors data.js cart via module re-export is complex;
// we import the shared cart object from data.js) ----------
import { cart, products, saveCart } from "./data.js";

let cartOpenListener = null;

// ---------- Header ----------
export function renderHeader(container) {
  const cartBtnHtml = `
    <button class="cart-btn" id="open-cart" title="Shopping cart" aria-label="Shopping cart">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle>
        <path d="M1 1h4l2.69 11.28a2 2 0 0 0 1.94 1.72h12.74a2 2 0 0 0 1.62-2.08L20.77 7H3.13z"></path>
      </svg>
      <span class="cart-count" id="cart-count">${cart.length}</span>
    </button>
  `;
  container.innerHTML = `
    <header class="header">
      <div class="container">
        <a href="/" class="logo" data-nav>Nova<span>Cart</span></a>
        <nav class="nav-list">
          <a href="/" data-nav>Home</a>
          <a href="/products" data-nav>Shop</a>
          <a href="/about" data-nav>About</a>
          <a href="/contact" data-nav>Contact</a>
        </nav>
        <div class="nav-actions">${cartBtnHtml}</div>
        <button class="menu-btn" id="menu-btn" aria-label="Open menu">☰</button>
      </div>
    </header>
  `;

  document.getElementById("open-cart").addEventListener("click", () => {
    window.dispatchEvent(new CustomEvent("toggle-cart"));
  });

  // Mobile menu toggle
  const menuBtn = document.getElementById("menu-btn");
  const navList = container.querySelector(".nav-list");
  if (menuBtn && navList) {
    menuBtn.addEventListener("click", () => {
      const open = navList.classList.toggle("open");
      menuBtn.textContent = open ? "✕" : "☰";
    });
    // Close mobile menu on nav click
    navList.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
      navList.classList.remove("open");
      menuBtn.textContent = "☰";
    }));
  }
}

export function updateCartCount() {
  const el = document.getElementById("cart-count");
  if (el) el.textContent = cart.reduce((sum, i) => sum + i.qty, 0);
}

// ---------- Cart drawer ----------
export function initCart() {
  const overlay = document.createElement("div");
  overlay.className = "cart-overlay";
  const drawer = document.createElement("div");
  drawer.className = "cart-drawer";
  drawer.id = "cart-drawer";
  drawer.innerHTML = `
    <div class="cart-header">
      <h2>Your Cart</h2>
      <button class="btn-ghost" id="close-cart">Close</button>
    </div>
    <div class="cart-body" id="cart-body"></div>
    <div class="cart-footer">
      <div class="cart-total"><span>Total</span><span id="cart-total">$0.00</span></div>
      <button class="btn btn-primary" id="checkout-btn">Checkout</button>
    </div>
  `;
  document.body.appendChild(overlay);
  document.body.appendChild(drawer);

  const openCart = () => { overlay.classList.add("open"); drawer.classList.add("open"); renderCart(); };
  const closeCart = () => { overlay.classList.remove("open"); drawer.classList.remove("open"); };

  document.getElementById("close-cart").addEventListener("click", closeCart);
  overlay.addEventListener("click", closeCart);
  window.addEventListener("toggle-cart", openCart);

  document.getElementById("checkout-btn").addEventListener("click", () => {
    if (cart.length === 0) return showToast("Your cart is empty.");
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    cart.splice(0); saveCart(); updateCartCount();
    closeCart();
    showToast(`Order placed — $${total.toFixed(2)}. Thank you!`);
    setTimeout(() => navigateTo("/"), true);
  });
}

export function renderCart() {
  const body = document.getElementById("cart-body");
  const totalEl = document.getElementById("cart-total");
  if (!body || !totalEl) return;

  (async () => {
    if (cart.length === 0) {
      body.innerHTML = `<div class="cart-empty"><p style="font-size:1.1rem;">Your cart is empty</p><p style="font-size:0.9rem;opacity:0.7;">Add items to get started.</p><div style="margin-top:1.5rem;"><a href="/products" class="btn btn-outline" style="data-nav" onclick="event.preventDefault();navigateTo('/products',true)">Browse Products</a></div></div>`;
      totalEl.textContent = "$0.00";
      return;
    }
    body.innerHTML = cart.map(item => {
      const p = products.find(pr => pr.id === item.id);
      if (!p) return "";
      const lineTotal = p.price * item.qty;
      return `
        <div class="cart-item">
          <img src="${p.image}" alt="${p.name}" loading="lazy" />
          <div class="cart-item-info">
            <div class="cart-item-name">${escapeHtml(p.name)}</div>
            <div class="cart-item-price">$${p.price.toFixed(2)} each</div>
          </div>
          <div class="cart-item-actions">
            <button class="qty-btn" data-change="-1" data-id="${item.id}" title="Remove one">−</button>
            <span class="qty-val">${item.qty}</span>
            <button class="qty-btn" data-change="+1" data-id="${item.id}" title="Add one">+</button>
            <button class="btn-ghost" data-remove data-id="${item.id}" style="color:var(--danger)" title="Remove">🗑</button>
          </div>
        </div>
      `;
    }).join("");

    const total = cart.reduce((s, i) => { const p = products.find(pr => pr.id === i.id); return s + (p ? p.price * i.qty : 0); }, 0);
    totalEl.textContent = `$${total.toFixed(2)}`;

    // Wire qty buttons
    body.querySelectorAll("[data-change]").forEach(btn => {
      btn.addEventListener("click", () => {
        const change = parseInt(btn.dataset.change, 10);
        const id = btn.dataset.id;
        const idx = cart.findIndex(c => c.id === id);
        if (idx === -1) return;
        cart[idx].qty += change;
        if (cart[idx].qty <= 0) cart.splice(idx, 1);
        saveCart(); updateCartCount(); renderCart();
      });
    });
    body.querySelectorAll("[data-remove]").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        cart.splice(0, cart.length, ...cart.filter(c => c.id !== id));
        saveCart(); updateCartCount(); renderCart();
      });
    });
  })();
}

export function showToast(msg) {
  let t = document.querySelector(".toast");
  if (!t) {
    t = document.createElement("div");
    t.className = "toast";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2200);
}

function escapeHtml(s) {
  const d = document.createElement("div");
  d.textContent = s;
  return d.innerHTML;
}

// ---------- Product card ----------
export function productCard(p) {
  const badgeHtml = p.badge ? `<span class="badge badge-${p.badge}">${p.badge}</span>` : "";
  const stockHtml = p.inStock ? "" : `<div style="color:var(--danger);font-size:0.8rem;font-weight:600;margin-top:0.25rem;">Out of stock</div>`;
  const old = p.oldPrice ? `<span class="old">$${p.oldPrice.toFixed(2)}</span>` : "";
  return `
    <article class="card product-card">
      <div class="product-image">
        ${badgeHtml}
        <img src="${p.image}" alt="${escapeHtml(p.name)}" loading="lazy" />
        <div class="product-actions">
          <button class="btn btn-outline btn-sm quick-add" data-id="${p.id}" title="Add to cart" ${!p.inStock ? "disabled" : ""}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </button>
        </div>
      </div>
      <div class="product-info">
        <div class="product-cat">${escapeHtml(p.category)}</div>
        <h3 class="product-name">${escapeHtml(p.name)}</h3>
        <div class="product-price">$${p.price.toFixed(2)} ${old}</div>
        ${stockHtml}
      </div>
    </article>
  `;
}

export function initQuickAdd() {
  document.addEventListener("click", async (e) => {
    const btn = e.target.closest(".quick-add");
    if (!btn) return;
    const id = btn.dataset.id;
    const { products } = await import("./data.js");
    const p = products.find(pr => pr.id === id);
    if (!p || !p.inStock) return;
    const existing = cart.find(c => c.id === id);
    if (existing) existing.qty += 1;
    else cart.push({ id, qty: 1 });
    saveCart(); updateCartCount();
    showToast(`Added "${p.name}" to cart`);
  });
}
