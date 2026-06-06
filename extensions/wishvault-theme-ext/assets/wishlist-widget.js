(function () {
  'use strict';

  // ─── Read customer data injected by Liquid ───────────────────────────────────
  const root = document.getElementById('wishvault-root');
  const shop = root?.dataset.shop || window.Shopify?.shop || window.location.hostname;
  const customerId = root?.dataset.customerId || '';
  const customerEmail = root?.dataset.customerEmail || '';
  const apiHost = '/apps/wishvault';

  // ─── Default settings (overwritten by backend fetch) ─────────────────────────
  let settings = {
    primaryColor: '#655246',
    secondaryColor: '#f7f4f0',
    textColor: '#332b26',
    buttonStyle: 'pill-sand',
    buttonText: 'Add to Wishlist',
    pdpPlacement: 'below_cart',
    plpPlacement: 'top_right',
    globalAccess: 'both',
    wishlistView: 'drawer',
  };

  let wishlistItems = [];
  let drawerOpen = false;

  // ─── Flags to prevent duplicate rendering ────────────────────────────────────
  let headerRendered = false;
  let launcherRendered = false;
  let drawerRendered = false;
  let pdpRendered = false;
  let observerActive = false;

  // ═══════════════════════════════════════════════════════════════════════════════
  // INIT
  // ═══════════════════════════════════════════════════════════════════════════════
  function initWishVault() {
    fetchSettings(() => {
      fetchWishlist();
      renderAll();
      startObserver();
    });

    document.addEventListener('shopify:section:load', () => {
      fetchSettings(() => renderAll());
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // FETCH SETTINGS
  // ═══════════════════════════════════════════════════════════════════════════════
  function fetchSettings(callback) {
    fetch(`${apiHost}/api/settings?shop=${encodeURIComponent(shop)}`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          settings.primaryColor   = data.primaryColor   || settings.primaryColor;
          settings.secondaryColor = data.secondaryColor || settings.secondaryColor;
          settings.textColor      = data.textColor      || settings.textColor;
          settings.buttonStyle    = data.buttonStyle    || settings.buttonStyle;
          settings.buttonText     = data.buttonText     || settings.buttonText;
          settings.pdpPlacement   = data.pdpPlacement   || settings.pdpPlacement;
          settings.plpPlacement   = data.plpPlacement   || settings.plpPlacement;
          settings.globalAccess   = data.globalAccess   || settings.globalAccess;
          settings.wishlistView   = data.wishlistView   || settings.wishlistView;
          injectCSSVars();
        }
        if (callback) callback();
      })
      .catch(() => {
        injectCSSVars();
        if (callback) callback();
      });
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // FETCH WISHLIST ITEMS
  // ═══════════════════════════════════════════════════════════════════════════════
  function fetchWishlist() {
    const params = new URLSearchParams({ shop });
    if (customerEmail) params.set('customerEmail', customerEmail);
    if (customerId)    params.set('customerId', customerId);

    fetch(`${apiHost}/api/wishlist?${params}`)
      .then(res => res.json())
      .then(data => {
        wishlistItems = data || [];
        syncUIState();
      })
      .catch(err => console.error('WishVault: Error loading wishlist.', err));
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // CSS VARIABLES
  // ═══════════════════════════════════════════════════════════════════════════════
  function injectCSSVars() {
    let style = document.getElementById('wv-dynamic-styles');
    if (!style) {
      style = document.createElement('style');
      style.id = 'wv-dynamic-styles';
      document.head.appendChild(style);
    }
    style.innerHTML = `
      :root {
        --wv-primary:   ${settings.primaryColor};
        --wv-secondary: ${settings.secondaryColor};
        --wv-text:      ${settings.textColor};
      }
    `;
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // RENDER ALL WIDGETS
  // ═══════════════════════════════════════════════════════════════════════════════
  function renderAll() {
    renderDrawer();        // drawer must exist before header/launcher attach events to it
    renderGlobalAccess();
    renderPDPButton();
    renderPLPButtons();
    syncUIState();
  }

  // ─── Global Access: header icon + floating launcher ──────────────────────────
  function renderGlobalAccess() {
    const wantsLauncher = settings.globalAccess === 'floating_launcher' || settings.globalAccess === 'both';
    const wantsHeader   = settings.globalAccess === 'header_icon'       || settings.globalAccess === 'both';

    if (wantsLauncher) renderFloatingLauncher();
    else removeById('wv-floating-launcher');

    if (wantsHeader) renderHeaderIcon();
    else removeById('wv-header-link');
  }

  // ─── Floating launcher (bottom-right fixed button) ───────────────────────────
  function renderFloatingLauncher() {
    if (launcherRendered || document.getElementById('wv-floating-launcher')) {
      launcherRendered = true;
      return;
    }
    const launcher = document.createElement('button');
    launcher.id = 'wv-floating-launcher';
    launcher.setAttribute('aria-label', 'Open Wishlist');
    launcher.innerHTML = `
      <span class="wv-launcher-heart">&#9829;</span>
      <span class="wv-counter wv-launcher-counter">0</span>
    `;
    document.body.appendChild(launcher);
    launcher.addEventListener('click', toggleDrawer);
    launcherRendered = true;
  }

  // ─── Header icon (next to cart icon) ─────────────────────────────────────────
  function renderHeaderIcon() {
    if (headerRendered || document.getElementById('wv-header-link')) {
      headerRendered = true;
      return;
    }

    // Try multiple common cart icon selectors across Dawn, Debut, Refresh, Sense, etc.
    const cartSelectors = [
      'a[href="/cart"]',
      'a[href*="/cart"]',
      '.header__icon--cart',
      '.site-header__cart',
      '.cart-link',
      '#cart-icon-bubble',
      '[data-icon="cart"]',
      '.header-cart-btn',
    ];

    let cartEl = null;
    for (const sel of cartSelectors) {
      cartEl = document.querySelector(sel);
      if (cartEl) break;
    }

    if (!cartEl) return; // header not ready yet, observer will retry

    const link = document.createElement('a');
    link.id = 'wv-header-link';
    link.href = '#wishvault-wishlist';
    link.setAttribute('aria-label', 'My Wishlist');
    link.className = 'wv-header-icon';
    link.innerHTML = `
      <svg class="wv-header-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="currentColor" stroke-width="1.5" fill="none"/>
      </svg>
      <span class="wv-counter wv-header-counter">0</span>
    `;

    link.addEventListener('click', (e) => {
      e.preventDefault();
      toggleDrawer();
    });

    // Insert before cart icon
    cartEl.parentNode.insertBefore(link, cartEl);
    headerRendered = true;
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // DRAWER (slide-out panel)
  // ═══════════════════════════════════════════════════════════════════════════════
  function renderDrawer() {
    if (drawerRendered || document.getElementById('wv-sidebar-drawer')) {
      drawerRendered = true;
      return;
    }

    // Backdrop overlay
    const backdrop = document.createElement('div');
    backdrop.id = 'wv-backdrop';
    backdrop.addEventListener('click', closeDrawer);
    document.body.appendChild(backdrop);

    const drawer = document.createElement('div');
    drawer.id = 'wv-sidebar-drawer';
    drawer.setAttribute('role', 'dialog');
    drawer.setAttribute('aria-label', 'Wishlist');
    drawer.innerHTML = `
      <div class="wv-drawer-header">
        <div class="wv-drawer-title">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:18px;height:18px;margin-right:8px;color:var(--wv-primary)">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="currentColor" stroke-width="1.5" fill="none"/>
          </svg>
          <span>My Wishlist</span>
          <span class="wv-drawer-count">(<span class="wv-drawer-total">0</span> items)</span>
        </div>
        <button class="wv-close-drawer" aria-label="Close wishlist">&#10005;</button>
      </div>
      <div class="wv-drawer-content">
        <div class="wv-drawer-items"></div>
      </div>
      <div class="wv-drawer-footer">
        <a class="wv-view-all-btn" href="/pages/wishlist">View Full Wishlist</a>
      </div>
    `;
    document.body.appendChild(drawer);

    drawer.querySelector('.wv-close-drawer').addEventListener('click', closeDrawer);
    drawerRendered = true;
  }

  function toggleDrawer() {
    const drawer = document.getElementById('wv-sidebar-drawer');
    const backdrop = document.getElementById('wv-backdrop');
    if (!drawer) return;
    drawerOpen = !drawerOpen;
    drawer.classList.toggle('wv-open', drawerOpen);
    if (backdrop) backdrop.classList.toggle('wv-open', drawerOpen);
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    if (drawerOpen) renderDrawerItems();
  }

  function closeDrawer() {
    const drawer = document.getElementById('wv-sidebar-drawer');
    const backdrop = document.getElementById('wv-backdrop');
    drawerOpen = false;
    if (drawer) drawer.classList.remove('wv-open');
    if (backdrop) backdrop.classList.remove('wv-open');
    document.body.style.overflow = '';
  }

  function renderDrawerItems() {
    const container = document.querySelector('.wv-drawer-items');
    const totalEl   = document.querySelector('.wv-drawer-total');
    if (!container) return;

    if (totalEl) totalEl.textContent = wishlistItems.length;

    if (wishlistItems.length === 0) {
      container.innerHTML = `
        <div class="wv-empty-state">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:48px;height:48px;color:#ccc;margin-bottom:12px">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="currentColor" stroke-width="1.5" fill="none"/>
          </svg>
          <p>Your wishlist is empty</p>
          <span>Save items you love and come back anytime.</span>
        </div>`;
      return;
    }

    container.innerHTML = wishlistItems.map(item => `
      <div class="wv-drawer-item" data-id="${item.id}">
        <a href="/products/${item.productHandle || item.productId}" class="wv-item-image-link">
          <img src="${item.productImage || 'https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-product-1_small.png'}"
               alt="${escapeHtml(item.productTitle || '')}"
               onerror="this.src='https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-product-1_small.png'">
        </a>
        <div class="wv-item-info">
          <a class="wv-item-title" href="/products/${item.productHandle || item.productId}">${escapeHtml(item.productTitle || 'Product')}</a>
          <p class="wv-item-price">${escapeHtml(item.productPrice || '')}</p>
          <div class="wv-item-actions">
            <a class="wv-add-to-cart-btn" href="/products/${item.productHandle || item.productId}">View Product</a>
            <button class="wv-remove-item" data-item-id="${item.id}" aria-label="Remove from wishlist">&#10005;</button>
          </div>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('.wv-remove-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const itemId = btn.getAttribute('data-item-id');
        removeFromWishlist(itemId);
      });
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // PRODUCT PAGE BUTTON (PDP)
  // ═══════════════════════════════════════════════════════════════════════════════
  function renderPDPButton() {
    if (pdpRendered) return;
    if (!window.location.pathname.includes('/products/')) return;

    const form = document.querySelector('form[action*="/cart/add"]');
    if (!form) return;
    if (form.querySelector('.wv-pdp-btn-container')) return;

    // Get product ID — try multiple sources
    const productId =
      window.ShopifyAnalytics?.meta?.product?.id ||
      document.querySelector('[name="id"]')?.value ||
      document.querySelector('[data-product-id]')?.dataset.productId ||
      '';

    if (!productId) return;

    const title = document.querySelector('h1')?.textContent?.trim() || 'Product';
    const price = document.querySelector('[data-price], .price__sale .price-item--sale, .price-item--regular, .price, .product__price')?.textContent?.trim() || '';
    const image = document.querySelector('meta[property="og:image"]')?.content ||
                  document.querySelector('.product__media img, .product-featured-media img')?.src || '';

    const container = document.createElement('div');
    container.className = 'wv-pdp-btn-container';

    const isWishlisted = isInWishlist(productId);
    const btnClass = {
      'pill-sand':    'wv-pill',
      'bold-espresso':'wv-bold',
      'link-only':    'wv-link',
      'float-circle': 'wv-circle',
    }[settings.buttonStyle] || 'wv-pill';

    container.innerHTML = `
      <button class="wv-pdp-btn ${btnClass} ${isWishlisted ? 'wv-active' : ''}"
              data-wv-product-id="${productId}"
              aria-label="${isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}">
        <span class="wv-icon">${isWishlisted ? '&#9829;' : '&#9825;'}</span>
        ${settings.buttonStyle !== 'float-circle' ? `<span class="wv-text">${isWishlisted ? 'Saved to Wishlist' : settings.buttonText}</span>` : ''}
      </button>
    `;

    // Placement logic
    if (settings.pdpPlacement === 'adjacent_cart') {
      const submitBtn = form.querySelector('[type="submit"], [name="add"]');
      if (submitBtn) {
        container.style.display = 'inline-block';
        container.style.marginLeft = '10px';
        container.style.verticalAlign = 'middle';
        submitBtn.style.verticalAlign = 'middle';
        submitBtn.parentNode.insertBefore(container, submitBtn.nextSibling);
      } else {
        form.appendChild(container);
      }
    } else if (settings.pdpPlacement === 'below_price') {
      const priceEl = document.querySelector('.price, [data-price], .product__price');
      if (priceEl) {
        priceEl.parentNode.insertBefore(container, priceEl.nextSibling);
      } else {
        form.appendChild(container);
      }
    } else {
      // default: below_cart
      form.appendChild(container);
    }

    const btn = container.querySelector('.wv-pdp-btn');
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleWishlist({ id: productId, title, price, image }, (added) => {
        btn.classList.toggle('wv-active', added);
        const iconEl = btn.querySelector('.wv-icon');
        const textEl = btn.querySelector('.wv-text');
        if (iconEl) iconEl.innerHTML = added ? '&#9829;' : '&#9825;';
        if (textEl) textEl.textContent = added ? 'Saved to Wishlist' : settings.buttonText;
        btn.setAttribute('aria-label', added ? 'Remove from wishlist' : 'Add to wishlist');
        showToast(added ? 'Added to wishlist ♥' : 'Removed from wishlist');
      });
    });

    pdpRendered = true;
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // COLLECTION PAGE HEART BUTTONS (PLP)
  // ═══════════════════════════════════════════════════════════════════════════════
  function renderPLPButtons() {
    if (settings.plpPlacement === 'hidden') return;
    if (window.location.pathname.includes('/products/')) return;

    const posClass = settings.plpPlacement === 'top_left' ? 'wv-top-left' : 'wv-top-right';

    // Select all product card links
    const productLinks = document.querySelectorAll('a[href*="/products/"]');
    const seen = new Set();

    productLinks.forEach(link => {
      const card = link.closest('.grid__item, .product-card, .card, .product-item, .card-wrapper, [class*="product"]');
      if (!card || seen.has(card) || card.querySelector('.wv-plp-heart')) return;
      seen.add(card);

      const href = link.getAttribute('href');
      const handle = href.split('/products/')[1]?.split('?')[0]?.split('/')[0];
      if (!handle) return;

      const imgWrapper =
        card.querySelector('.media, .card__inner, .card__media, .product-card__image-wrapper, .image-wrap') ||
        card.querySelector('img')?.parentNode;
      if (!imgWrapper) return;

      const isWishlisted = isInWishlist(handle);
      const heart = document.createElement('button');
      heart.className = `wv-plp-heart ${posClass} ${isWishlisted ? 'wv-active' : ''}`;
      heart.setAttribute('data-wv-product-id', handle);
      heart.setAttribute('aria-label', isWishlisted ? 'Remove from wishlist' : 'Add to wishlist');
      heart.innerHTML = `<span class="wv-icon">${isWishlisted ? '&#9829;' : '&#9825;'}</span>`;

      imgWrapper.style.position = 'relative';
      imgWrapper.appendChild(heart);

      heart.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const title = card.querySelector('.card__heading, .product-card__title, .product-title, h2, h3')?.textContent?.trim() || 'Product';
        const price = card.querySelector('.price-item, .product-card__price, .price, [class*="price"]')?.textContent?.trim() || '';
        const image = card.querySelector('img')?.src || '';

        toggleWishlist({ id: handle, title, price, image }, (added) => {
          heart.classList.toggle('wv-active', added);
          const iconEl = heart.querySelector('.wv-icon');
          if (iconEl) iconEl.innerHTML = added ? '&#9829;' : '&#9825;';
          heart.setAttribute('aria-label', added ? 'Remove from wishlist' : 'Add to wishlist');
          showToast(added ? 'Added to wishlist ♥' : 'Removed from wishlist');
        });
      });
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // WISHLIST TOGGLE (ADD / REMOVE)
  // ═══════════════════════════════════════════════════════════════════════════════
  function isInWishlist(productId) {
    return wishlistItems.some(i => String(i.productId) === String(productId));
  }

  function toggleWishlist(product, callback) {
    const inList = isInWishlist(product.id);

    if (inList) {
      const item = wishlistItems.find(i => String(i.productId) === String(product.id));
      if (!item) return;

      fetch(`${apiHost}/api/wishlist/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id }),
      })
        .then(r => r.json())
        .then(data => {
          if (data.success) {
            wishlistItems = wishlistItems.filter(i => i.id !== item.id);
            syncUIState();
            if (callback) callback(false);
          }
        })
        .catch(err => console.error('WishVault: Remove error', err));
    } else {
      fetch(`${apiHost}/api/wishlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shop,
          customerId,
          customerEmail,
          productId: String(product.id),
          productTitle: product.title,
          productPrice: product.price,
          productImage: product.image,
        }),
      })
        .then(r => r.json())
        .then(data => {
          if (data.success) {
            wishlistItems.push(data.item);
            syncUIState();
            if (callback) callback(true);
          }
        })
        .catch(err => console.error('WishVault: Add error', err));
    }
  }

  function removeFromWishlist(itemId) {
    fetch(`${apiHost}/api/wishlist/delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: itemId }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          wishlistItems = wishlistItems.filter(i => i.id !== itemId);
          syncUIState();
          renderDrawerItems();
        }
      });
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // SYNC UI STATE (counters, heart fill states)
  // ═══════════════════════════════════════════════════════════════════════════════
  function syncUIState() {
    const count = wishlistItems.length;

    // Update all counters
    document.querySelectorAll('.wv-counter').forEach(el => {
      el.textContent = count;
      el.style.display = count === 0 ? 'none' : 'flex';
    });

    if (document.querySelector('.wv-drawer-total')) {
      document.querySelector('.wv-drawer-total').textContent = count;
    }

    // Update all product buttons heart states
    document.querySelectorAll('[data-wv-product-id]').forEach(btn => {
      const pid = btn.getAttribute('data-wv-product-id');
      const active = isInWishlist(pid);
      btn.classList.toggle('wv-active', active);
      const icon = btn.querySelector('.wv-icon');
      if (icon) icon.innerHTML = active ? '&#9829;' : '&#9825;';
    });

    if (drawerOpen) renderDrawerItems();
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // TOAST NOTIFICATION
  // ═══════════════════════════════════════════════════════════════════════════════
  function showToast(message) {
    let toast = document.getElementById('wv-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'wv-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('wv-toast-show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('wv-toast-show'), 2500);
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // MUTATION OBSERVER (smart — only re-renders PLP when new product cards appear)
  // ═══════════════════════════════════════════════════════════════════════════════
  function startObserver() {
    if (observerActive) return;
    observerActive = true;

    let debounceTimer;
    const observer = new MutationObserver((mutations) => {
      // Only trigger if new nodes were added (avoid attribute changes causing loops)
      const hasNewNodes = mutations.some(m => m.addedNodes.length > 0);
      if (!hasNewNodes) return;

      // Don't re-trigger for our own injected elements
      const isOurEl = mutations.every(m =>
        Array.from(m.addedNodes).every(n =>
          n.id && (n.id.startsWith('wv-') || n.id === 'wishvault-root')
        )
      );
      if (isOurEl) return;

      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        // Only retry things that may have missed on first render
        if (!headerRendered) renderHeaderIcon();
        if (!launcherRendered) renderFloatingLauncher();
        if (!pdpRendered) renderPDPButton();
        renderPLPButtons(); // PLP always re-scans for new cards (infinite scroll etc.)
      }, 300);
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // HELPERS
  // ═══════════════════════════════════════════════════════════════════════════════
  function removeById(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // ─── Boot ─────────────────────────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWishVault);
  } else {
    initWishVault();
  }

})();
