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
      message += `price/item: $${item.price.toFixed(2)}\n`;
      message += `quantity: ${item.quantity}\n`;
      message += `color: ${item.color}\n`;
      message += `notes: ${item.notes}\n`;
      message += `total price: $${item.totalPrice.toFixed(2)}\n`;
      message += `----------------------\n`;
      grandTotal += item.totalPrice;
    });

    message += `order total price: $${grandTotal.toFixed(2)}`;

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

  // Fallback Data in case API Server is loading
  getFallbackProducts(params) {
    const list = [
      {
        productID: 1,
        productName: "The 'Rosie' Crochet Cardigan",
        categoryName: "Cardigans",
        parentCategory: "Crochet",
        price: 145.00,
        description: "Meticulously handcrafted using a luxurious blend of merino wool and silk, the Rosie cardigan offers unparalleled softness and a delicate drape. Each piece takes over 40 hours to complete, ensuring a unique, heirloom-quality garment designed for the intentional wardrobe.",
        isBestSeller: true,
        isNewArrival: false,
        mainImage: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&auto=format&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop"
        ]
      },
      {
        productID: 2,
        productName: "Rose Twist Headband",
        categoryName: "Headbands",
        parentCategory: "Crochet",
        price: 18.00,
        description: "Merino Wool Blend. Handcrafted rose twist headband, cozy and soft.",
        isBestSeller: true,
        isNewArrival: false,
        mainImage: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=800&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=800&auto=format&fit=crop"]
      },
      {
        productID: 3,
        productName: "Cream Cable Band",
        categoryName: "Headbands",
        parentCategory: "Crochet",
        price: 22.00,
        description: "100% Organic Cotton. Elegant cream braided cable headband.",
        isBestSeller: true,
        isNewArrival: true,
        mainImage: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&auto=format&fit=crop"]
      },
      {
        productID: 4,
        productName: "Sage Lace Crown",
        categoryName: "Headbands",
        parentCategory: "Crochet",
        price: 25.00,
        description: "Silk & Alpaca Blend. Delicate soft sage green crown headband.",
        isBestSeller: true,
        isNewArrival: true,
        mainImage: "https://images.unsplash.com/photo-1509319117193-57bab727e09d?w=800&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1509319117193-57bab727e09d?w=800&auto=format&fit=crop"]
      },
      {
        productID: 5,
        productName: "Mocha Chunky Band",
        categoryName: "Headbands",
        parentCategory: "Crochet",
        price: 20.00,
        description: "Chunky Wool. Warm mocha braided headband for winter cozy feel.",
        isBestSeller: true,
        isNewArrival: true,
        mainImage: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&auto=format&fit=crop"]
      },
      {
        productID: 6,
        productName: "Summer Breeze Halter Top",
        categoryName: "Tops",
        parentCategory: "Crochet",
        price: 45.00,
        description: "100% Cotton. Delicate cream handmade halter top with intricate scalloped lace.",
        isBestSeller: false,
        isNewArrival: true,
        mainImage: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop"]
      },
      {
        productID: 7,
        productName: "Terracotta Square Neck",
        categoryName: "Tops",
        parentCategory: "Crochet",
        price: 52.00,
        description: "Linen Blend. Breathable rust terracotta knitted tank top with ribbed waist.",
        isBestSeller: true,
        isNewArrival: false,
        mainImage: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop"]
      },
      {
        productID: 8,
        productName: "Lavender Dream Bralette",
        categoryName: "Tops",
        parentCategory: "Crochet",
        price: 38.00,
        description: "Soft Cotton. Custom sizing feminine lavender soft knitted bralette.",
        isBestSeller: false,
        isNewArrival: true,
        mainImage: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=800&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=800&auto=format&fit=crop"]
      },
      {
        productID: 9,
        productName: "Forest Mesh Tee",
        categoryName: "Tops",
        parentCategory: "Crochet",
        price: 65.00,
        description: "Bamboo Blend. Draping rich forest green open mesh short sleeve tee.",
        isBestSeller: true,
        isNewArrival: true,
        mainImage: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop"]
      },
      {
        productID: 10,
        productName: "Blush Pearl Bracelet",
        categoryName: "Bracelets",
        parentCategory: "Beads",
        price: 28.00,
        description: "Freshwater pearls paired with handcrafted blush crystal glass beads.",
        isBestSeller: true,
        isNewArrival: false,
        mainImage: "https://images.unsplash.com/photo-1611591475281-8d995c697686?w=800&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1611591475281-8d995c697686?w=800&auto=format&fit=crop"]
      },
      {
        productID: 11,
        productName: "Ocean Wave Necklace",
        categoryName: "Necklaces",
        parentCategory: "Beads",
        price: 35.00,
        description: "Artisanal turquoise and deep blue glass bead statement choker.",
        isBestSeller: true,
        isNewArrival: true,
        mainImage: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop"]
      },
      {
        productID: 12,
        productName: "Golden Sunset Phone Charm",
        categoryName: "Accessories",
        parentCategory: "Beads",
        price: 16.00,
        description: "Handbeaded amber and gold phone strap charm with durable cord.",
        isBestSeller: false,
        isNewArrival: true,
        mainImage: "https://images.unsplash.com/photo-1600003014608-a400c9f136ef?w=800&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1600003014608-a400c9f136ef?w=800&auto=format&fit=crop"]
      }
    ];

    let result = list;
    if (params.parentCategory) result = result.filter(p => p.parentCategory.toLowerCase() === params.parentCategory.toLowerCase());
    if (params.categoryName) result = result.filter(p => p.categoryName.toLowerCase() === params.categoryName.toLowerCase());
    if (params.isBestSeller) result = result.filter(p => p.isBestSeller === (params.isBestSeller === 'true' || params.isBestSeller === true));
    if (params.isNewArrival) result = result.filter(p => p.isNewArrival === (params.isNewArrival === 'true' || params.isNewArrival === true));
    if (params.search) {
      const q = params.search.toLowerCase();
      result = result.filter(p => p.productName.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.categoryName.toLowerCase().includes(q));
    }
    return result;
  }
};
