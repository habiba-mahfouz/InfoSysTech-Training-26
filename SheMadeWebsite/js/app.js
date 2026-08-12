// She Made - Application Logic & API Integration
window.App = {
  // API Fetcher with Fallback Mock Data
  async fetchProducts(params = {}) {
    // If running from file:// or no API configured, use fallback immediately
    if (!window.CONFIG.API_BASE_URL || window.location.protocol === 'file:') {
      return this.getFallbackProducts(params);
    }

    try {
      const url = new URL(`${window.CONFIG.API_BASE_URL}/products`);
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          url.searchParams.append(key, params[key]);
        }
      });

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);

      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('Backend API offline, using fallback catalog data:', err);
    }
    return this.getFallbackProducts(params);
  },

  async fetchProductById(id) {
    if (!window.CONFIG.API_BASE_URL || window.location.protocol === 'file:') {
      const all = this.getFallbackProducts({});
      return all.find(p => p.productID == id) || all[0];
    }
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);
      const res = await fetch(`${window.CONFIG.API_BASE_URL}/products/${id}`, { signal: controller.signal });
      clearTimeout(timeout);
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('Backend API offline, using fallback product:', err);
    }
    const all = this.getFallbackProducts({});
    return all.find(p => p.productID == id) || all[0];
  },

  async fetchRelatedProducts(id) {
    if (!window.CONFIG.API_BASE_URL || window.location.protocol === 'file:') {
      const current = this.getFallbackProducts({}).find(p => p.productID == id);
      const all = this.getFallbackProducts({});
      return all.filter(p => p.productID != id && current && p.parentCategory === current.parentCategory).slice(0, 4);
    }
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);
      const res = await fetch(`${window.CONFIG.API_BASE_URL}/products/${id}/related`, { signal: controller.signal });
      clearTimeout(timeout);
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('Backend API offline, fallback related:', err);
    }
    const current = await this.fetchProductById(id);
    const all = this.getFallbackProducts({});
    return all.filter(p => p.productID != id && p.parentCategory === current.parentCategory).slice(0, 4);
  },

  // Cart Management
  getCart() {
    return JSON.parse(localStorage.getItem('shemade_cart') || '[]');
  },

  saveCart(cart) {
    localStorage.setItem('shemade_cart', JSON.stringify(cart));
    if (typeof updateCartBadge === 'function') {
      updateCartBadge();
    }
  },

  addToCart(product, color, notes, quantity) {
    if (!color || color.trim() === '') {
      alert(window.CurrentLang === 'ar' ? 'من فضلِك اختاري اللون المطلوب قبل الإضافة للسلة!' : 'Please specify a color preference before adding to cart!');
      return false;
    }

    const finalNotes = (notes && notes.trim() !== '') ? notes.trim() : 'NAN';
    const cart = this.getCart();

    const newItem = {
      cartItemId: Date.now() + Math.random(),
      productID: product.productID,
      productName: product.productName,
      price: product.price,
      mainImage: product.mainImage,
      color: color.trim(),
      notes: finalNotes,
      quantity: parseInt(quantity) || 1,
      totalPrice: (product.price * (parseInt(quantity) || 1))
    };

    cart.push(newItem);
    this.saveCart(cart);

    alert(window.CurrentLang === 'ar' ? 'تمت إضافة المنتج للسلة بنجاح! 🛍️' : 'Product successfully added to cart! 🛍️');
    return true;
  },

  removeFromCart(cartItemId) {
    let cart = this.getCart();
    cart = cart.filter(item => item.cartItemId != cartItemId);
    this.saveCart(cart);
  },

  clearCart() {
    localStorage.removeItem('shemade_cart');
    if (typeof updateCartBadge === 'function') {
      updateCartBadge();
    }
  },

  // WhatsApp Order Message Generator
  sendOrderViaWhatsApp() {
    const cart = this.getCart();
    if (cart.length === 0) return;

    let message = "";
    let grandTotal = 0;

    cart.forEach((item, index) => {
      message += `product ${index + 1}\n`;
      message += `name: ${item.productName}\n`;
      message += `price/item: ${item.price.toFixed(2)} EGP\n`;      message += `quantity: ${item.quantity}\n`;
      message += `color: ${item.color}\n`;
      message += `notes: ${item.notes}\n`;
      message += `total price: ${item.totalPrice.toFixed(2)} EGP\n`;      message += `----------------------\n`;
      grandTotal += item.totalPrice;
    });

    message += `order total price: ${grandTotal.toFixed(2)} EGP`;

    const phone = window.CONFIG.WHATSAPP_NUMBER;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    // Open WhatsApp in new tab
    window.open(url, '_blank');

    // Clear cart as per user explicit specification
    this.clearCart();

    // Reload cart page
    if (window.location.pathname.includes('cart.html')) {
      window.location.reload();
    }
  },

// Fallback Data removed - returns empty list when API is offline
  getFallbackProducts(params) {
    return [];
  }
};
