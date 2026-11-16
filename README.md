# NovaCart — Web Development Capstone Project

A production-ready e-commerce product catalog built with vanilla HTML, CSS, and JavaScript. Features a modular frontend architecture, client-side routing, persistent shopping cart, responsive design, and optimized static assets — ready for deployment to Vercel, Netlify, or Render.

## Key Features

- **Modular frontend** — separated concerns: `data.js` (data layer), `router.js` (client-side routing), `components.js` (reusable UI), `pages.js` (route renderers), `main.js` (entry point).
- **Client-side routing** — History API–based SPA navigation with back/forward support and `<a data-nav>` delegation; no full-page reloads.
- **Shopping cart** — add/remove items, quantity adjustment, LocalStorage persistence, toast notifications, and a slide-out cart drawer.
- **Product catalog** — category filtering, search, sorting (featured/price/name), product detail pages, related products.
- **Responsive design** — mobile-first CSS Grid/Flexbox, sticky header, collapsible mobile menu, slide-out cart.
- **Performance** — CSS custom properties, `loading="lazy"` images, route-based code splitting via ES modules, cache-friendly asset headers, preloaded stylesheets.
- **Production-ready deploy config** — `vercel.json` for Vercel and `_redirects` for Netlify SPA fallback; security headers included.

## Project Structure

```
capstone-ecommerce/
├── index.html            # SPA shell (preloads CSS, loads main.js as module)
├── css/
│   ├── reset.css         # Reset & design tokens
│   └── components.css    # Reusable components + responsive utilities
├── js/
│   ├── main.js           # Entry point; mounts router + shell
│   ├── router.js         # History-API client-side router
│   ├── data.js           # Product catalog + cart state (LocalStorage)
│   ├── components.js     # Header, cart drawer, product card, quick-add
│   └── pages.js          # Route renderers (home, products, product, about, contact, 404)
├── vercel.json           # Vercel deployment config (routes + headers)
├── _redirects            # Netlify SPA fallback rule
├── .gitignore
└── README.md
```

## Local Development

No build step or install is required. Open `index.html` directly, or serve it locally:

```bash
# Using Python
python3 -m http.server 8000 --directory capstone-ecommerce

# Using Node (http-server)
npx http-server capstone-ecommerce -p 8000

# Then visit http://localhost:8000
```

## Deployment

### Live Demo

[NovaCart on Vercel](https://ecommerece-capstone3.vercel.app/)


### Netlify

1. Push to GitHub.
2. Connect the repo in [Netlify](https://netlify.com).
3. Build command: leave empty / Publish directory: `capstone-ecommerce`.
4. `_redirects` ensures client-side routes work on refresh.

### Render

1. Create a new **Static Site** on [Render](https://render.com).
2. Connect your repo, set the root directory to `capstone-ecommerce`.
3. Render serves `index.html`; add a rewrite rule `/* → /index.html` for SPA routes.

## Browser Support

Modern evergreen browsers (ES modules, History API, CSS Grid/custom properties). Includes a `<noscript>` fallback notice.

## License

MIT — built as a Web Development Capstone Project.
