(function() {
  const shop = window.Shopify?.shop || window.location.hostname;
  const customerId = window.ShopifyAnalytics?.meta?.page?.customerId || '';
  const customerEmail = ''; 
  const apiHost = '/apps/wishvault';

  let settings = {
    primaryColor: '#655246',
    secondaryColor: '#f7f4f0',
    textColor: '#332b26',
    buttonStyle: 'pill-sand',
    buttonText: 'Add to Wishlist',
    pdpPlacement: 'below_cart',
    plpPlacement: 'top_right',
    globalAccess: 'both',
    wishlistView: 'proxy_page'
  };

  let wishlistItems = [];

  // Fetch saved settings from our backend
  function fetchSettings(callback) {
    fetch(`${apiHost}/api/settings?shop=${shop}`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          settings = {
            primaryColor: data.primaryColor || settings.primaryColor,
            secondaryColor: data.secondaryColor || settings.secondaryColor,
            textColor: data.textColor || settings.textColor,
            buttonStyle: data.buttonStyle || settings.buttonStyle,
            buttonText: data.buttonText || settings.buttonText,
            pdpPlacement: data.pdpPlacement || settings.pdpPlacement,
            plpPlacement: data.plpPlacement || settings.plpPlacement,
            globalAccess: data.globalAccess || settings.globalAccess,
            wishlistView: data.wishlistView || settings.wishlistView
          };
          injectStyles();
        }
        if (callback) callback();
      })
      .catch(err => {
        console.warn("WishVault: Settings endpoint not reachable, using defaults.", err);
        injectStyles();
        if (callback) callback();
      });
  }

  function initWishVault() {
    fetchSettings(() => {
      fetchWishlist();
      renderWidgets();
      startObserver();
    });

    // Listen to Shopify Theme Editor Section Load events (Refetches updated configurations)
    document.addEventListener('shopify:section:load', () => {
      fetchSettings(() => {
        renderWidgets();
      });
    });
  }

  function renderWidgets() {
    // 1. Handle Floating Launcher Widget
    if (settings.globalAccess === 'floating_launcher' || settings.globalAccess === 'both') {
      renderFloatingLauncher();
    } else {
      const launcher = document.getElementById('wv-floating-launcher');
      if (launcher) launcher.remove();
    }
    
    // 2. Handle Header Icon Widget
    if (settings.globalAccess === 'header_icon' || settings.globalAccess === 'both') {
      renderHeaderIcon();
    } else {
      const headerLink = document.getElementById('wv-header-link');
      if (headerLink) headerLink.remove();
    }
    
    // 3. Handle Product Page Button (PDP)
    if (window.location.pathname.includes('/products/')) {
      renderPDPButton();
    } else {
      const pdpContainer = document.querySelector('.wv-pdp-btn-container');
      if (pdpContainer) pdpContainer.remove();
    }

    // 4. Handle Collection Card Overlays (PLP)
    if (settings.plpPlacement !== 'hidden') {
      renderPLPButtons();
    } else {
      const hearts = document.querySelectorAll('.wv-plp-heart');
      hearts.forEach(h => h.remove());
    }

    updateWidgetsState();
  }

  function startObserver() {
    const observer = new MutationObserver(() => {
      renderWidgets();
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  function fetchWishlist() {
    fetch(`${apiHost}/api/wishlist?shop=${shop}`)
      .then(res => res.json())
      .then(data => {
        wishlistItems = data || [];
        updateWidgetsState();
      })
      .catch(err => console.error("WishVault: Error loading wishlist items.", err));
  }

  function injectStyles() {
    // Update existing style element if it exists to avoid bloat
    let style = document.getElementById('wv-dynamic-styles');
    if (!style) {
      style = document.createElement('style');
      style.id = 'wv-dynamic-styles';
      document.head.appendChild(style);
    }
    style.innerHTML = `
      :root {
        --wv-primary: ${settings.primaryColor};
        --wv-secondary: ${settings.secondaryColor};
        --wv-text: ${settings.textColor};
      }
    `;
  }

  function isProductInWishlist(productId) {
    return wishlistItems.some(item => String(item.productId) === String(productId));
  }

  function toggleWishlist(productData, callback) {
    const isAdded = isProductInWishlist(productData.id);
    
    if (isAdded) {
      const item = wishlistItems.find(item => String(item.productId) === String(productData.id));
      if (!item) return;
      fetch(`${apiHost}/api/wishlist/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          wishlistItems = wishlistItems.filter(i => i.id !== item.id);
          updateWidgetsState();
          if (callback) callback(false);
        }
      });
    } else {
      fetch(`${apiHost}/api/wishlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shop,
          customerId,
          customerEmail,
          productId: String(productData.id),
          productTitle: productData.title,
          productPrice: productData.price,
          productImage: productData.image
        })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          wishlistItems.push(data.item);
          updateWidgetsState();
          if (callback) callback(true);
        }
      });
    }
  }

  function updateWidgetsState() {
    // Update count labels
    const counters = document.querySelectorAll('.wv-counter');
    counters.forEach(c => {
      c.textContent = wishlistItems.length;
    });

    // Update buttons active class
    const buttons = document.querySelectorAll('[data-wv-product-id]');
    buttons.forEach(btn => {
      const productId = btn.getAttribute('data-wv-product-id');
      if (isProductInWishlist(productId)) {
        btn.classList.add('wv-active');
        const icon = btn.querySelector('.wv-icon');
        if (icon) icon.innerHTML = '♥';
      } else {
        btn.classList.remove('wv-active');
        const icon = btn.querySelector('.wv-icon');
        if (icon) icon.innerHTML = '♡';
      }
    });

    renderDrawerItems();
  }

  function renderFloatingLauncher() {
    if (document.getElementById('wv-floating-launcher')) return;
    const launcher = document.createElement('div');
    launcher.id = 'wv-floating-launcher';
    launcher.innerHTML = `
      <div class="wv-launcher-btn" style="background: var(--wv-primary); color: #fff;">
        <span class="wv-icon-heart">♥</span>
        <span class="wv-counter" style="background: var(--wv-secondary); color: var(--wv-primary);">0</span>
      </div>
    `;
    document.body.appendChild(launcher);

    launcher.addEventListener('click', toggleDrawer);
    renderDrawer();
  }

  function renderHeaderIcon() {
    if (document.getElementById('wv-header-link')) return;

    // Robust search selectors for theme cart links
    const cartIcon = document.querySelector('a[href*="/cart"], .header__icon--cart, .site-header__cart, .cart-link, #cart-icon-bubble');
    if (!cartIcon) return;

    const headerLink = document.createElement('a');
    headerLink.id = 'wv-header-link';
    headerLink.href = '#';
    headerLink.className = cartIcon.className;
    headerLink.style.position = 'relative';
    headerLink.style.display = 'inline-flex';
    headerLink.style.alignItems = 'center';
    headerLink.style.marginRight = '18px';
    headerLink.style.cursor = 'pointer';

    headerLink.innerHTML = `
      <span class="wv-header-heart" style="font-size: 22px; color: var(--wv-primary);">♥</span>
      <span class="wv-counter" style="
        position: absolute;
        top: -6px;
        right: -8px;
        background: #e25c5c;
        color: #fff;
        border-radius: 50%;
        width: 16px;
        height: 16px;
        font-size: 10px;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
      ">0</span>
    `;

    cartIcon.parentNode.insertBefore(headerLink, cartIcon);

    headerLink.addEventListener('click', (e) => {
      e.preventDefault();
      toggleDrawer();
    });

    renderDrawer();
  }

  let drawerOpen = false;
  function toggleDrawer() {
    const drawer = document.getElementById('wv-sidebar-drawer');
    if (!drawer) return;
    drawerOpen = !drawerOpen;
    if (drawerOpen) {
      drawer.classList.add('wv-open');
    } else {
      drawer.classList.remove('wv-open');
    }
  }

  function renderDrawer() {
    if (document.getElementById('wv-sidebar-drawer')) return;

    const drawer = document.createElement('div');
    drawer.id = 'wv-sidebar-drawer';
    drawer.innerHTML = `
      <div class="wv-drawer-header">
        <h3>My Wishlist</h3>
        <button class="wv-close-drawer">✕</button>
      </div>
      <div class="wv-drawer-content">
        <div class="wv-drawer-items"></div>
      </div>
    `;
    document.body.appendChild(drawer);

    drawer.querySelector('.wv-close-drawer').addEventListener('click', toggleDrawer);
    renderDrawerItems();
  }

  function renderDrawerItems() {
    const container = document.querySelector('.wv-drawer-items');
    if (!container) return;

    if (wishlistItems.length === 0) {
      container.innerHTML = `<div class="wv-empty">Your wishlist is empty.</div>`;
      return;
    }

    container.innerHTML = wishlistItems.map(item => `
      <div class="wv-drawer-item" data-id="${item.id}">
        <img src="${item.productImage || 'https://via.placeholder.com/50'}" alt="${item.productTitle}">
        <div class="wv-item-info">
          <h4>${item.productTitle}</h4>
          <p>${item.productPrice}</p>
          <button class="wv-remove-item" data-product-id="${item.productId}">Remove</button>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('.wv-remove-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const productId = e.target.getAttribute('data-product-id');
        toggleWishlist({ id: productId });
      });
    });
  }

  function renderPDPButton() {
    const form = document.querySelector('form[action*="/cart/add"]');
    if (!form || form.querySelector('.wv-pdp-btn-container')) return;

    const productId = window.ShopifyAnalytics?.meta?.product?.id || document.querySelector('[name="id"]')?.value;
    const title = document.querySelector('h1')?.textContent?.trim() || 'Product';
    const price = document.querySelector('[data-price], .price, .product__price')?.textContent?.trim() || '$0.00';
    const image = document.querySelector('meta[property="og:image"]')?.content || '';

    const btnContainer = document.createElement('div');
    btnContainer.className = 'wv-pdp-btn-container';
    
    let buttonHtml = '';
    if (settings.buttonStyle === 'pill-sand') {
      buttonHtml = `
        <button class="wv-pdp-btn wv-pill" data-wv-product-id="${productId}">
          <span class="wv-icon">♡</span>
          <span class="wv-text">${settings.buttonText}</span>
        </button>
      `;
    } else if (settings.buttonStyle === 'bold-espresso') {
      buttonHtml = `
        <button class="wv-pdp-btn wv-bold" data-wv-product-id="${productId}">
          <span class="wv-icon">♡</span>
          <span class="wv-text">${settings.buttonText}</span>
        </button>
      `;
    } else if (settings.buttonStyle === 'link-only') {
      buttonHtml = `
        <button class="wv-pdp-btn wv-link" data-wv-product-id="${productId}">
          <span class="wv-icon">♡</span>
          <span class="wv-text" style="text-decoration: underline;">${settings.buttonText}</span>
        </button>
      `;
    } else {
      buttonHtml = `
        <button class="wv-pdp-btn wv-circle" data-wv-product-id="${productId}">
          <span class="wv-icon">♡</span>
        </button>
      `;
    }

    btnContainer.innerHTML = buttonHtml;

    // Insert PDP button based on settings
    if (settings.pdpPlacement === 'below_cart') {
      form.appendChild(btnContainer);
    } else if (settings.pdpPlacement === 'adjacent_cart') {
      const submitBtn = form.querySelector('[type="submit"], [name="add"]');
      if (submitBtn) {
        submitBtn.style.display = 'inline-block';
        submitBtn.style.verticalAlign = 'middle';
        btnContainer.style.display = 'inline-block';
        btnContainer.style.verticalAlign = 'middle';
        btnContainer.style.marginLeft = '10px';
        submitBtn.parentNode.insertBefore(btnContainer, submitBtn.nextSibling);
      } else {
        form.appendChild(btnContainer);
      }
    } else {
      const priceContainer = document.querySelector('.price, [data-price]');
      if (priceContainer) {
        priceContainer.parentNode.insertBefore(btnContainer, priceContainer.nextSibling);
      } else {
        form.appendChild(btnContainer);
      }
    }

    const btn = btnContainer.querySelector('.wv-pdp-btn');
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleWishlist({ id: productId, title, price, image });
    });
  }

  function renderPLPButtons() {
    const productLinks = document.querySelectorAll('a[href*="/products/"]');
    const processedCards = new Set();

    productLinks.forEach(link => {
      const card = link.closest('.grid__item, .product-card, .card, .product-item, .card-wrapper');
      if (!card || processedCards.has(card) || card.querySelector('.wv-plp-heart')) return;
      processedCards.add(card);

      const href = link.getAttribute('href');
      const handle = href.split('/products/')[1]?.split('?')[0];
      if (!handle) return;

      const imgWrapper = card.querySelector('.media, .card__inner, .card__media, .product-card__image-wrapper, .image-wrap, .card-wrapper') || card.querySelector('img')?.parentNode;
      if (!imgWrapper) return;

      const heart = document.createElement('button');
      heart.className = `wv-plp-heart ${settings.plpPlacement === 'top_left' ? 'wv-top-left' : 'wv-top-right'}`;
      heart.setAttribute('data-wv-product-id', handle);
      heart.style.position = 'absolute';
      heart.style.zIndex = '10';
      heart.innerHTML = '<span class="wv-icon" style="font-size: 16px;">♡</span>';
      
      imgWrapper.style.position = 'relative';
      imgWrapper.appendChild(heart);

      heart.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const title = card.querySelector('.card__heading, .product-card__title, .product-title')?.textContent?.trim() || 'Product';
        const price = card.querySelector('.price-item, .product-card__price, .price')?.textContent?.trim() || '$19.99 USD';
        const image = card.querySelector('img')?.src || '';

        toggleWishlist({ id: handle, title, price, image });
      });
    });
  }

  initWishVault();
})();
