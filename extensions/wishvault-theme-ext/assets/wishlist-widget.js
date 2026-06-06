(function () {
  'use strict';

  // ─── Customer data from Liquid ───────────────────────────────────────────────
  const root = document.getElementById('wishvault-root');
  const shop = (root && root.dataset.shop) || (window.Shopify && window.Shopify.shop) || window.location.hostname;
  const customerId    = (root && root.dataset.customerId)    || '';
  const customerEmail = (root && root.dataset.customerEmail) || '';
  const apiHost = '/apps/wishvault';

  // ─── Defaults ────────────────────────────────────────────────────────────────
  var settings = {
    primaryColor:   '#655246',
    secondaryColor: '#f7f4f0',
    textColor:      '#332b26',
    buttonStyle:    'pill-sand',
    buttonText:     'Add to Wishlist',
    pdpPlacement:   'below_cart',
    plpPlacement:   'top_right',
    globalAccess:   'both',
    wishlistView:   'drawer',
  };

  var wishlistItems  = [];
  var drawerOpen     = false;
  var headerDone     = false;
  var launcherDone   = false;
  var drawerDone     = false;
  var pdpDone        = false;
  var observerActive = false;

  // ─── INIT ────────────────────────────────────────────────────────────────────
  function init() {
    fetchSettings(function () {
      fetchWishlist();
      renderAll();
      startObserver();
    });
    document.addEventListener('shopify:section:load', function () {
      resetFlags();
      fetchSettings(function () { renderAll(); });
    });
  }

  function resetFlags() {
    headerDone = launcherDone = drawerDone = pdpDone = false;
  }

  // ─── FETCH SETTINGS ──────────────────────────────────────────────────────────
  function fetchSettings(cb) {
    fetch(apiHost + '/api/settings?shop=' + encodeURIComponent(shop))
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (d) {
          settings.primaryColor   = d.primaryColor   || settings.primaryColor;
          settings.secondaryColor = d.secondaryColor || settings.secondaryColor;
          settings.textColor      = d.textColor      || settings.textColor;
          settings.buttonStyle    = d.buttonStyle    || settings.buttonStyle;
          settings.buttonText     = d.buttonText     || settings.buttonText;
          settings.pdpPlacement   = d.pdpPlacement   || settings.pdpPlacement;
          settings.plpPlacement   = d.plpPlacement   || settings.plpPlacement;
          settings.globalAccess   = d.globalAccess   || settings.globalAccess;
          settings.wishlistView   = d.wishlistView   || settings.wishlistView;
        }
        injectCSS();
        if (cb) cb();
      })
      .catch(function () { injectCSS(); if (cb) cb(); });
  }

  // ─── FETCH WISHLIST ──────────────────────────────────────────────────────────
  function fetchWishlist() {
    var url = apiHost + '/api/wishlist?shop=' + encodeURIComponent(shop);
    if (customerEmail) url += '&customerEmail=' + encodeURIComponent(customerEmail);
    else if (customerId) url += '&customerId=' + encodeURIComponent(customerId);

    fetch(url)
      .then(function (r) { return r.json(); })
      .then(function (d) { wishlistItems = d || []; syncUI(); })
      .catch(function () {});
  }

  // ─── CSS VARS ────────────────────────────────────────────────────────────────
  function injectCSS() {
    var el = document.getElementById('wv-vars');
    if (!el) {
      el = document.createElement('style');
      el.id = 'wv-vars';
      document.head.appendChild(el);
    }
    el.textContent = ':root{--wv-p:' + settings.primaryColor + ';--wv-s:' + settings.secondaryColor + ';--wv-t:' + settings.textColor + ';}';
  }

  // ─── RENDER ALL ──────────────────────────────────────────────────────────────
  function renderAll() {
    renderDrawer();
    renderGlobalAccess();
    renderPDP();
    renderPLP();
    syncUI();
  }

  // ─── GLOBAL ACCESS (header + floating) ──────────────────────────────────────
  function renderGlobalAccess() {
    var g = settings.globalAccess;
    if (g === 'floating_launcher' || g === 'both') renderLauncher();
    else removeEl('wv-launcher');

    if (g === 'header_icon' || g === 'both') renderHeader();
    else removeEl('wv-header-icon');
  }

  // ─── FLOATING LAUNCHER ──────────────────────────────────────────────────────
  function renderLauncher() {
    if (launcherDone || document.getElementById('wv-launcher')) { launcherDone = true; return; }
    var btn = document.createElement('button');
    btn.id = 'wv-launcher';
    btn.setAttribute('aria-label', 'Open Wishlist');
    btn.innerHTML = '<span class="wv-lheart">&#9829;</span><span class="wv-counter wv-lcnt">0</span>';
    document.body.appendChild(btn);
    btn.addEventListener('click', toggleDrawer);
    launcherDone = true;
  }

  // ─── HEADER ICON ────────────────────────────────────────────────────────────
  // Wide selector list covering: Dawn, Debut, Savor, Sense, Refresh, Impulse,
  // Minimal, Brooklyn, Narrative, Boundless, Supply, Venture + generic fallbacks
  function renderHeader() {
    if (headerDone || document.getElementById('wv-header-icon')) { headerDone = true; return; }

    var cartSelectors = [
      // Savor theme specific
      'a.header-actions__action[href*="cart"]',
      '.header-actions__action[href*="cart"]',
      '.header-actions a[href*="cart"]',
      // Dawn / most modern themes
      '#cart-icon-bubble',
      '.header__icon--cart',
      // Generic cart links
      'a[href="/cart"]',
      'a[href*="/cart"]:not([href*="product"]):not([href*="collection"])',
      // Other theme classes
      '.site-header__cart',
      '.cart-link',
      '.nav__cart',
      '[data-icon="cart"]',
      '.cart__toggle',
      '#CartToggle',
      '.js-cart-toggle',
    ];

    var cartEl = null;
    for (var i = 0; i < cartSelectors.length; i++) {
      try {
        var found = document.querySelector(cartSelectors[i]);
        if (found) { cartEl = found; break; }
      } catch(e) {}
    }

    if (!cartEl) return; // will retry via observer

    var icon = document.createElement('a');
    icon.id   = 'wv-header-icon';
    icon.href = '#';
    icon.setAttribute('aria-label', 'My Wishlist');
    icon.innerHTML =
      '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>' +
      '<span class="wv-counter wv-hcnt">0</span>';
    icon.addEventListener('click', function (e) { e.preventDefault(); toggleDrawer(); });

    // Insert BEFORE cart element
    cartEl.parentNode.insertBefore(icon, cartEl);
    headerDone = true;
  }

  // ─── DRAWER ──────────────────────────────────────────────────────────────────
  function renderDrawer() {
    if (drawerDone || document.getElementById('wv-drawer')) { drawerDone = true; return; }

    var backdrop = document.createElement('div');
    backdrop.id = 'wv-backdrop';
    backdrop.addEventListener('click', closeDrawer);
    document.body.appendChild(backdrop);

    var d = document.createElement('div');
    d.id = 'wv-drawer';
    d.setAttribute('role', 'dialog');
    d.setAttribute('aria-label', 'Wishlist');
    d.innerHTML =
      '<div class="wv-dhead">' +
        '<div class="wv-dtitle">' +
          '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>' +
          '<span>My Wishlist</span>' +
          '<span class="wv-dcount">(<span class="wv-dtotal">0</span> items)</span>' +
        '</div>' +
        '<button class="wv-dclose" aria-label="Close">&#10005;</button>' +
      '</div>' +
      '<div class="wv-dbody"><div class="wv-ditems"></div></div>' +
      '<div class="wv-dfooter"><a class="wv-viewall" href="/apps/wishvault/wishlist">View Full Wishlist &rarr;</a></div>';

    document.body.appendChild(d);
    d.querySelector('.wv-dclose').addEventListener('click', closeDrawer);
    drawerDone = true;
  }

  function toggleDrawer() {
    var d = document.getElementById('wv-drawer');
    var b = document.getElementById('wv-backdrop');
    if (!d) return;
    drawerOpen = !drawerOpen;
    d.classList.toggle('wv-open', drawerOpen);
    if (b) b.classList.toggle('wv-open', drawerOpen);
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    if (drawerOpen) renderItems();
  }

  function closeDrawer() {
    drawerOpen = false;
    var d = document.getElementById('wv-drawer');
    var b = document.getElementById('wv-backdrop');
    if (d) d.classList.remove('wv-open');
    if (b) b.classList.remove('wv-open');
    document.body.style.overflow = '';
  }

  function renderItems() {
    var c = document.querySelector('.wv-ditems');
    var t = document.querySelector('.wv-dtotal');
    if (!c) return;
    if (t) t.textContent = wishlistItems.length;

    if (!wishlistItems.length) {
      c.innerHTML =
        '<div class="wv-empty">' +
          '<svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>' +
          '<p>Your wishlist is empty</p>' +
          '<span>Save items you love and come back anytime.</span>' +
        '</div>';
      return;
    }

    c.innerHTML = wishlistItems.map(function (item) {
      var img = item.productImage || 'https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-product-1_small.png';
      var title = esc(item.productTitle || 'Product');
      var price = esc(item.productPrice || '');
      var handle = item.productHandle || item.productId;
      return (
        '<div class="wv-item" data-id="' + item.id + '">' +
          '<a href="/products/' + handle + '" class="wv-iimg"><img src="' + img + '" alt="' + title + '" loading="lazy" onerror="this.src=\'https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-product-1_small.png\'"></a>' +
          '<div class="wv-iinfo">' +
            '<a class="wv-ititle" href="/products/' + handle + '">' + title + '</a>' +
            '<p class="wv-iprice">' + price + '</p>' +
            '<div class="wv-ibtns">' +
              '<a class="wv-ibuy" href="/products/' + handle + '">View Product</a>' +
              '<button class="wv-iremove" data-iid="' + item.id + '" aria-label="Remove">&#10005;</button>' +
            '</div>' +
          '</div>' +
        '</div>'
      );
    }).join('');

    c.querySelectorAll('.wv-iremove').forEach(function (btn) {
      btn.addEventListener('click', function () { removeItem(btn.getAttribute('data-iid')); });
    });
  }

  // ─── PDP BUTTON ─────────────────────────────────────────────────────────────
  function renderPDP() {
    if (pdpDone) return;
    var path = window.location.pathname;
    if (!path.match(/\/products\//)) return;

    // Wide form selectors — covers Savor, Dawn, Debut, etc.
    var formSelectors = [
      'form[action*="/cart/add"]',
      'form[action="/cart/add"]',
      '#product-form',
      '.product-form',
      '.product__form',
      '[data-product-form]',
      'form.shopify-product-form',
    ];

    var form = null;
    for (var i = 0; i < formSelectors.length; i++) {
      form = document.querySelector(formSelectors[i]);
      if (form) break;
    }
    if (!form) return; // observer will retry

    if (form.querySelector('.wv-pdp-wrap')) return; // already injected

    // Get product ID from multiple sources
    var productId =
      (window.ShopifyAnalytics && window.ShopifyAnalytics.meta && window.ShopifyAnalytics.meta.product && window.ShopifyAnalytics.meta.product.id) ||
      (window.__st && window.__st.pid) ||
      (document.querySelector('[name="id"]') && document.querySelector('[name="id"]').value) ||
      (document.querySelector('[data-product-id]') && document.querySelector('[data-product-id]').dataset.productId) ||
      '';

    if (!productId) return;

    var title = (document.querySelector('h1') && document.querySelector('h1').textContent.trim()) || 'Product';
    var priceSelectors = [
      '.price-item--sale', '.price-item--regular', '[data-price]',
      '.product__price', '.price', '.product-price',
    ];
    var price = '';
    for (var pi = 0; pi < priceSelectors.length; pi++) {
      var pel = document.querySelector(priceSelectors[pi]);
      if (pel) { price = pel.textContent.trim(); break; }
    }
    var image = (document.querySelector('meta[property="og:image"]') && document.querySelector('meta[property="og:image"]').content) ||
                (document.querySelector('.product__media img, .product-featured-media img, .product-media img') &&
                 document.querySelector('.product__media img, .product-featured-media img, .product-media img').src) || '';

    var active = inList(productId);
    var btnClass = { 'pill-sand': 'wv-pill', 'bold-espresso': 'wv-bold', 'link-only': 'wv-link', 'float-circle': 'wv-circle' }[settings.buttonStyle] || 'wv-pill';

    var wrap = document.createElement('div');
    wrap.className = 'wv-pdp-wrap';
    wrap.innerHTML =
      '<button class="wv-pdp ' + btnClass + (active ? ' wv-on' : '') + '" data-pid="' + productId + '" aria-label="' + (active ? 'Remove from wishlist' : 'Add to wishlist') + '">' +
        '<span class="wv-ico">' + (active ? '&#9829;' : '&#9825;') + '</span>' +
        (settings.buttonStyle !== 'float-circle' ? '<span class="wv-txt">' + (active ? 'Saved' : settings.buttonText) + '</span>' : '') +
      '</button>';

    // Placement
    if (settings.pdpPlacement === 'adjacent_cart') {
      var sub = form.querySelector('[type="submit"],[name="add"]');
      if (sub) {
        wrap.style.display = 'inline-block';
        wrap.style.marginLeft = '10px';
        sub.parentNode.insertBefore(wrap, sub.nextSibling);
      } else form.appendChild(wrap);
    } else if (settings.pdpPlacement === 'below_price') {
      var priceEl = document.querySelector('.price,[data-price],.product__price');
      if (priceEl) priceEl.parentNode.insertBefore(wrap, priceEl.nextSibling);
      else form.appendChild(wrap);
    } else {
      form.appendChild(wrap); // below_cart (default)
    }

    var btn = wrap.querySelector('.wv-pdp');
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      toggleItem({ id: productId, title: title, price: price, image: image }, function (added) {
        btn.classList.toggle('wv-on', added);
        var ico = btn.querySelector('.wv-ico');
        var txt = btn.querySelector('.wv-txt');
        if (ico) ico.innerHTML = added ? '&#9829;' : '&#9825;';
        if (txt) txt.textContent = added ? 'Saved' : settings.buttonText;
        btn.setAttribute('aria-label', added ? 'Remove from wishlist' : 'Add to wishlist');
        toast(added ? '&#9829; Added to wishlist' : 'Removed from wishlist');
      });
    });

    pdpDone = true;
  }

  // ─── PLP HEARTS ─────────────────────────────────────────────────────────────
  function renderPLP() {
    if (settings.plpPlacement === 'hidden') return;
    var path = window.location.pathname;
    if (path.match(/\/products\//)) return; // not on product page

    var pos = settings.plpPlacement === 'top_left' ? 'wv-tl' : 'wv-tr';
    var links = document.querySelectorAll('a[href*="/products/"]');
    var seen = new Set ? new Set() : { _s: [], has: function(v){ return this._s.indexOf(v) > -1; }, add: function(v){ this._s.push(v); } };

    links.forEach(function (link) {
      var card = link.closest('.grid__item,.product-card,.card,.product-item,.card-wrapper,.product-grid-item,[class*="product-card"],[class*="ProductCard"],[class*="product_card"]');
      if (!card || seen.has(card) || card.querySelector('.wv-plp')) return;
      seen.add(card);

      var href = link.getAttribute('href');
      var handle = href.split('/products/')[1];
      if (!handle) return;
      handle = handle.split('?')[0].split('/')[0];

      // Image wrapper — wide selector
      var imgWrap =
        card.querySelector('.media,.card__inner,.card__media,.product-card__image-wrapper,.image-wrap,.product__image-wrapper,.product-image-wrapper,.card-product__image') ||
        (card.querySelector('img') && card.querySelector('img').parentNode);
      if (!imgWrap) return;

      var active = inList(handle);
      var heart = document.createElement('button');
      heart.className = 'wv-plp ' + pos + (active ? ' wv-on' : '');
      heart.setAttribute('data-pid', handle);
      heart.setAttribute('aria-label', active ? 'Remove from wishlist' : 'Add to wishlist');
      heart.innerHTML = '<span class="wv-ico">' + (active ? '&#9829;' : '&#9825;') + '</span>';
      imgWrap.style.position = 'relative';
      imgWrap.appendChild(heart);

      heart.addEventListener('click', function (e) {
        e.preventDefault(); e.stopPropagation();
        var t = (card.querySelector('.card__heading,.product-card__title,.product-title,h2,h3') && card.querySelector('.card__heading,.product-card__title,.product-title,h2,h3').textContent.trim()) || 'Product';
        var pr = (card.querySelector('.price-item,.price,[class*="price"]') && card.querySelector('.price-item,.price,[class*="price"]').textContent.trim()) || '';
        var im = (card.querySelector('img') && card.querySelector('img').src) || '';
        toggleItem({ id: handle, title: t, price: pr, image: im }, function (added) {
          heart.classList.toggle('wv-on', added);
          var ico = heart.querySelector('.wv-ico');
          if (ico) ico.innerHTML = added ? '&#9829;' : '&#9825;';
          heart.setAttribute('aria-label', added ? 'Remove from wishlist' : 'Add to wishlist');
          toast(added ? '&#9829; Added to wishlist' : 'Removed from wishlist');
        });
      });
    });
  }

  // ─── TOGGLE (add / remove) ───────────────────────────────────────────────────
  function inList(pid) {
    return wishlistItems.some(function (i) { return String(i.productId) === String(pid); });
  }

  function toggleItem(product, cb) {
    if (inList(product.id)) {
      var item = wishlistItems.filter(function (i) { return String(i.productId) === String(product.id); })[0];
      if (!item) return;
      fetch(apiHost + '/api/wishlist/delete', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id })
      }).then(function (r) { return r.json(); }).then(function (d) {
        if (d.success) { wishlistItems = wishlistItems.filter(function (i) { return i.id !== item.id; }); syncUI(); if (cb) cb(false); }
      }).catch(function () {});
    } else {
      fetch(apiHost + '/api/wishlist', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shop: shop, customerId: customerId, customerEmail: customerEmail, productId: String(product.id), productTitle: product.title, productPrice: product.price, productImage: product.image })
      }).then(function (r) { return r.json(); }).then(function (d) {
        if (d.success) { wishlistItems.push(d.item); syncUI(); if (cb) cb(true); }
      }).catch(function () {});
    }
  }

  function removeItem(itemId) {
    fetch(apiHost + '/api/wishlist/delete', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: itemId })
    }).then(function (r) { return r.json(); }).then(function (d) {
      if (d.success) { wishlistItems = wishlistItems.filter(function (i) { return i.id !== itemId; }); syncUI(); renderItems(); }
    });
  }

  // ─── SYNC UI (counters + heart states) ──────────────────────────────────────
  function syncUI() {
    var count = wishlistItems.length;
    document.querySelectorAll('.wv-counter').forEach(function (el) {
      el.textContent = count;
      el.style.display = count > 0 ? 'flex' : 'none';
    });
    var dt = document.querySelector('.wv-dtotal');
    if (dt) dt.textContent = count;

    document.querySelectorAll('[data-pid]').forEach(function (el) {
      var pid = el.getAttribute('data-pid');
      var on  = inList(pid);
      el.classList.toggle('wv-on', on);
      var ico = el.querySelector('.wv-ico');
      if (ico) ico.innerHTML = on ? '&#9829;' : '&#9825;';
    });

    if (drawerOpen) renderItems();
  }

  // ─── TOAST ──────────────────────────────────────────────────────────────────
  function toast(msg) {
    var el = document.getElementById('wv-toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'wv-toast';
      document.body.appendChild(el);
    }
    el.innerHTML = msg;
    el.classList.add('wv-show');
    clearTimeout(el._t);
    el._t = setTimeout(function () { el.classList.remove('wv-show'); }, 2600);
  }

  // ─── OBSERVER (retry missing elements, handle infinite scroll) ───────────────
  function startObserver() {
    if (observerActive) return;
    observerActive = true;
    var timer;
    var obs = new MutationObserver(function (muts) {
      var hasNew = muts.some(function (m) { return m.addedNodes.length > 0; });
      if (!hasNew) return;
      // Skip if only our own nodes added
      var allOurs = muts.every(function (m) {
        return Array.from(m.addedNodes).every(function (n) {
          return n.id && n.id.indexOf('wv-') === 0;
        });
      });
      if (allOurs) return;
      clearTimeout(timer);
      timer = setTimeout(function () {
        if (!headerDone)  renderHeader();
        if (!launcherDone) renderLauncher();
        if (!pdpDone)     renderPDP();
        renderPLP(); // always re-scan (infinite scroll)
      }, 400);
    });
    obs.observe(document.body, { childList: true, subtree: true });
  }

  // ─── HELPERS ────────────────────────────────────────────────────────────────
  function removeEl(id) { var e = document.getElementById(id); if (e) e.remove(); }
  function esc(s) {
    return String(s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  // ─── BOOT ───────────────────────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
