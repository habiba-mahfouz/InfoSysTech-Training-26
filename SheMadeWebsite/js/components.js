// She Made - Reusable Components & i18n Loader
window.I18N_DICTIONARY = {
  en: {
    brand: "SHE MADE",
    nav_home: "Home",
    nav_crochet: "Crochet",
    nav_beads: "Beads",
    nav_cart: "Cart",
    search_placeholder: "Search...",
    hero_title: "Made for women by women",
    hero_sub: "Handmade Crochet & Beads. Crafted with care, designed to stand out. Discover authentic artisanal pieces.",
    shop_collection: "Shop the Collection",
    best_seller: "Best Seller",
    new_arrivals: "New Arrivals",
    show_all: "SHOW ALL →",
    how_to_order: "How to Order?",
    how_to_order_sub: "Watch this short video to learn how to easily order via WhatsApp",
    details: "Details",
    add_to_cart: "Add to Cart",
    color_pref: "Color Preference",
    color_pref_placeholder: "e.g., Ivory, Sage Green, Deep Rose",
    notes_label: "Special Notes or Sizing (optional)",
    notes_placeholder: "Add specific measurements or special instructions here...",
    quantity: "Quantity",
    total: "Total",
    related_items: "Related Items",
    cart_empty_title: "Your cart is currently empty",
    cart_empty_sub: "It looks like you haven't added any of our handcrafted pieces to your cart yet. Discover our intentional designs and find something beautiful.",
    start_shopping: "START SHOPPING",
    your_cart: "Your Cart",
    order_summary: "Order Summary",
    estimated_total: "Estimated Total",
    order_whatsapp: "Order via WhatsApp",
    remove: "Remove",
    search_results: "Search Results",
    no_results_title: "No Results Found for",
    no_results_sub: "We couldn't find anything matching your search. Try exploring our curated suggestions below or refine your keywords.",
    continue_shopping: "CONTINUE SHOPPING",
    footer_tagline: "Celebrating artisanal craftsmanship and intentional design. Made For Women By Women.",
    footer_contact: "Contact Us",
    footer_community: "Community",
    footer_copyright: "© 2026 SHE MADE. Made For Women By Women."
  },
  ar: {
    brand: "SHE MADE",
    nav_home: "الرئيسية",
    nav_crochet: "الكروشيه",
    nav_beads: "الخرز",
    nav_cart: "السلة",
    search_placeholder: "...بحث",
    hero_title: "صُنع من النساء للنساء",
    hero_sub: "كروشيه وخرز يدوي الصنع. صُمم بحب وإتقان ليمنحكِ إطلالة فريدة.",
    shop_collection: "تسوقي المجموعة",
    best_seller: "الأكثر مبيعاً",
    new_arrivals: "وصل حديثاً",
    show_all: "← عرض الكل",
    how_to_order: "كيف تطلبين؟",
    how_to_order_sub: "شاهدي هذا الفيديو القصير لمعرفة كيفية الطلب بسهولة عبر الواتساب",
    details: "التفاصيل",
    add_to_cart: "إضافة للسلة",
    color_pref: "تفاصيل اللون المطلوب",
    color_pref_placeholder: "مثال: عاجي، أخضر مريمي، وردي داكن",
    notes_label: "ملاحظات خاصة أو مقاسات (اختياري)",
    notes_placeholder:"...أضيفي مقاسات خاصة أو أي تعليمات إضافية",
    quantity: "الكمية",
    total: "الإجمالي",
    related_items: "منتجات ذات صلة",
    cart_empty_title: "سلة التسوق فارغة حالياً",
    cart_empty_sub: "يبدو أنكِ لم تضيفي أي من منتجاتنا اليدوية الفريدة إلى السلة بعد. اكتشفي تصاميمنا الأنيقة واختاري ما يناسبكِ",
    start_shopping: "ابدأي التسوق",
    your_cart: "سلة التسوق",
    order_summary: "ملخص الطلب",
    estimated_total: "المجموع التقديري",
    order_whatsapp: "إرسال الطلب عبر الواتساب",
    remove: "إزالة",
    search_results: "نتائج البحث",
    no_results_title: "لا توجد نتائج بحث عن",
    no_results_sub: "لم نتمكن من العثور على أي منتج يطابق بحثكِ. جربي استكشاف المنتجات المقترحة أو تعديل كلمات البحث.",
    continue_shopping: "متابعة التسوق",
    footer_tagline: "نحتفي بالحرفية اليدوية والتصاميم المبتكرة. صُنع من النساء للنساء.",
    footer_contact: "تواصل معنا",
    footer_community: "مجتمعنا",
    footer_copyright: "© 2026 SHE MADE. صُنع من النساء للنساء."
  }
};

window.CurrentLang = localStorage.getItem('shemade_lang') || 'en';

// Load Component Helper
async function loadComponent(selector, filepath) {
  const container = document.querySelector(selector);
  if (!container) return;
  try {
    const res = await fetch(filepath);
    if (res.ok) {
      container.innerHTML = await res.text();
    }
  } catch (err) {
    console.error(`Error loading component ${filepath}:`, err);
  }
}

// Initialize Site Layout & i18n
async function initSiteLayout() {
  await loadComponent('#navbar-container', 'components/navbar.html');
  await loadComponent('#footer-container', 'components/footer.html');

  applyLanguage(window.CurrentLang);
  highlightActiveNav();
  updateCartBadge();
  setupSearchInput();

  // Attach Lang Switcher Event
  const langBtn = document.getElementById('lang-toggle-btn');
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      window.CurrentLang = window.CurrentLang === 'en' ? 'ar' : 'en';
      localStorage.setItem('shemade_lang', window.CurrentLang);
      applyLanguage(window.CurrentLang);
    });
  }
}

function applyLanguage(lang) {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

  const dict = window.I18N_DICTIONARY[lang] || window.I18N_DICTIONARY.en;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (dict[key]) {
      el.placeholder = dict[key];
    }
  });
}

function highlightActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  if (page === 'index.html') document.getElementById('nav-home')?.classList.add('active');
  else if (page === 'crochet.html') document.getElementById('nav-crochet')?.classList.add('active');
  else if (page === 'bead.html') document.getElementById('nav-beads')?.classList.add('active');
  else if (page === 'cart.html') document.getElementById('nav-cart')?.classList.add('active');
}

function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem('shemade_cart') || '[]');
  const totalCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const badge = document.getElementById('cart-badge');
  if (badge) {
    if (totalCount > 0) {
      badge.textContent = totalCount;
      badge.classList.remove('d-none');
    } else {
      badge.classList.add('d-none');
    }
  }
}

function setupSearchInput() {
  const input = document.getElementById('navbar-search');
  if (input) {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const query = input.value.trim();
        if (query) {
          window.location.href = `search.html?q=${encodeURIComponent(query)}`;
        }
      }
    });
  }
}

// Reusable Product Card HTML Generator
function createProductCardHtml(product) {
  const dict = window.I18N_DICTIONARY[window.CurrentLang] || window.I18N_DICTIONARY.en;
  return `
    <div class="col-12 col-sm-6 col-lg-3">
      <div class="product-card">
        <div class="product-card-img-wrap">
          <img src="${product.mainImage}" alt="${product.productName}" class="product-card-img" loading="lazy">
        </div>
        <div class="d-flex align-items-baseline justify-content-between mb-1">
          <h5 class="product-card-title">${product.productName}</h5>
          <span class="product-card-price">${product.price.toFixed(2)} EGP</span>
        </div>
        <p class="product-card-sub">${product.description ? product.description.substring(0, 45) + '...' : product.categoryName}</p>
        <div class="mt-auto">
          <a href="details.html?id=${product.productID}" class="btn btn-mauve btn-mauve-sm w-100">${dict.details}</a>
        </div>
      </div>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', initSiteLayout);
