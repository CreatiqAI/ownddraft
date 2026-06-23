const icon = (name) => {
  const paths = {
    search: '<circle cx="10" cy="10" r="6"></circle><path d="m15 15 5 5"></path>',
    user: '<circle cx="12" cy="8" r="4"></circle><path d="M4 21c1.8-4 14.2-4 16 0"></path>',
    bag: '<path d="M6 8h12l-1 13H7L6 8Z"></path><path d="M9 8a3 3 0 0 1 6 0"></path>',
    arrow: '<path d="M5 12h14"></path><path d="m13 6 6 6-6 6"></path>',
    brush: '<path d="M15 3l6 6-9 9H6v-6l9-9Z"></path><path d="M6 18l-3 3"></path>',
    pencil: '<path d="m4 16 12-12 4 4L8 20H4v-4Z"></path>',
    eraser: '<path d="m4 15 9-9 7 7-7 7H8l-4-5Z"></path>',
    text: '<path d="M5 5h14"></path><path d="M12 5v14"></path>',
    box: '<path d="m12 3 8 4-8 4-8-4 8-4Z"></path><path d="M4 7v10l8 4 8-4V7"></path><path d="M12 11v10"></path>',
    plane: '<path d="M21 4 3 11l7 3 3 7 8-17Z"></path>',
    shield: '<path d="M12 3 20 6v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3Z"></path>',
    gem: '<path d="M6 3h12l4 6-10 12L2 9l4-6Z"></path>',
    globe: '<circle cx="12" cy="12" r="9"></circle><path d="M3 12h18"></path><path d="M12 3c3 3 3 15 0 18"></path><path d="M12 3c-3 3-3 15 0 18"></path>',
    rotate: '<path d="M4 4v6h6"></path><path d="M20 20v-6h-6"></path><path d="M20 9a8 8 0 0 0-13.4-3.4L4 8"></path><path d="M4 15a8 8 0 0 0 13.4 3.4L20 16"></path>'
  };
  return `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${paths[name] || paths.arrow}</svg>`;
};

const siteBase = new URL(".", document.querySelector('script[src$="site.js"]').src);
const route = (path = "") => new URL(path, siteBase).pathname;

class SiteHeader extends HTMLElement {
  connectedCallback() {
    const active = this.getAttribute("active") || "";
    const dark = this.getAttribute("theme") === "dark";
    const links = [
      ["editions", "Editions", route("editions/")],
      ["create", "Create Your Canvas", route("create/")],
      ["first-drop", "First Drop", route("first-drop/")],
      ["campaign", "Campaign", route("campaign/")],
      ["where-to-buy", "Where To Buy", route("where-to-buy/")]
    ];
    this.innerHTML = `
      <header class="site-header ${dark ? "dark-page" : ""}">
        <a class="brand" href="${route()}">OWND</a>
        <nav class="nav" aria-label="Main navigation">
          ${links.map(([key, label, href]) => `<a class="${active === key ? "active" : ""}" href="${href}">${label}</a>`).join("")}
        </nav>
        <div class="header-actions">
          <a class="order-link" href="${route("build-your-ownd/")}">Order</a>
          <a href="${route("build-your-ownd/")}" aria-label="Search">${icon("search")}</a>
          <a href="${route("build-your-ownd/")}" aria-label="Account">${icon("user")}</a>
          <a href="${route("build-your-ownd/")}" aria-label="Cart">${icon("bag")}</a>
        </div>
      </header>
    `;
  }
}

class SiteFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer class="site-footer">
        <div class="footer-grid">
          <div>
            <a class="brand" href="${route()}">OWND</a>
            <p style="margin-top:22px;font-family:var(--serif);font-size:20px;color:var(--ink)">Not Just Luggage.<br>A Moving <span style="color:var(--orange)">Canvas.</span></p>
            <p>© 2024 OWND. All rights reserved.</p>
          </div>
          <div><h3>Shop</h3><a href="${route("first-drop/")}">All Luggage</a><a href="${route("build-your-ownd/")}">Accessories</a><a href="${route("campaign/")}">Gift Cards</a></div>
          <div><h3>Explore</h3><a href="${route("editions/")}">Artist Edition</a><a href="${route("where-to-buy/")}">Collaborations</a><a href="${route("canvas-light/")}">Canvas Gallery</a></div>
          <div><h3>Company</h3><a href="${route("where-to-buy/")}">About Us</a><a href="${route("campaign/")}">Sustainability</a><a href="${route("build-your-ownd/")}">Contact</a></div>
          <div>
            <h3>Join the journey.</h3>
            <p>Get inspired and get early access.</p>
            <form class="newsletter"><input aria-label="Email address" placeholder="Enter your email"><button aria-label="Submit">→</button></form>
          </div>
        </div>
      </footer>
    `;
  }
}

customElements.define("site-header", SiteHeader);
customElements.define("site-footer", SiteFooter);

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-icon]").forEach((slot) => {
    slot.innerHTML = icon(slot.dataset.icon);
  });
});

document.addEventListener("click", (event) => {
  const selectable = event.target.closest(".choice, .swatch, .segmented button");
  if (!selectable) return;
  const group = selectable.closest(".option-grid, .swatches, .segmented");
  if (!group) return;
  group.querySelectorAll(".active").forEach((item) => item.classList.remove("active"));
  selectable.classList.add("active");
});

document.addEventListener("click", (event) => {
  const quantityButton = event.target.closest("[data-quantity]");
  if (!quantityButton) return;
  const value = document.querySelector("[data-quantity-value]");
  const current = Number(value.textContent.trim()) || 1;
  const next = quantityButton.dataset.quantity === "plus" ? current + 1 : Math.max(1, current - 1);
  value.textContent = next;
});