// Helper function to generate CSS background for mixed colors (up to 4)
function getColorBackground(colorGroup) {
  if (!Array.isArray(colorGroup)) {
    return `background: ${colorGroup};`; // Fallback for old single string format
  }
  const len = colorGroup.length;
  if (len === 1) {
    return `background: ${colorGroup[0]};`;
  } else if (len === 2) {
    return `background: linear-gradient(90deg, ${colorGroup[0]} 50%, ${colorGroup[1]} 50%);`;
  } else if (len === 3) {
    return `background: linear-gradient(180deg, ${colorGroup[0]} 33.33%, ${colorGroup[1]} 33.33% 66.66%, ${colorGroup[2]} 66.66%);`;
  } else if (len === 4) {
    return `background: conic-gradient(${colorGroup[0]} 90deg, ${colorGroup[1]} 90deg 180deg, ${colorGroup[2]} 180deg 270deg, ${colorGroup[3]} 270deg);`;
  }
  return 'background: transparent;'; // Fallback
}

const products = [
  { 
    id: 1, 
    name: "Beaded Earring", 
    price: 150, 
    image: "images/sticker.png", 
    images: ["images/sticker.png", "images/qr.png", "images/logo.png"], 
    category: "beads", 
    subcategory: "earrings", 
    tag: "best-seller", 
    colors: [
      ["#ffffff"], // Solid red
      ["#f62bbc"], // Solid black
      ["#ff0000", "#000000"], // 2 colors (half/half)
      ["#ffc0cb", "#ffffff", "#87ceeb"], // 3 colors (stripes)
      ["#ff0000", "#00ff00", "#0000ff", "#ffff00"] // 4 colors (quadrants)
    ],
    reviews: [
      { image: "images/sticker.png", text: "Amazing quality, highly recommend!", date: "2 days ago" },
      { image: "images/qr.png", text: "Looks exactly like the picture, I'm in love.", date: "1 week ago" }
    ]
  },
  { id: 2, name: "Crochet Headband", price: 200, image: "images/qr.png", images: ["images/qr.png"], category: "crochet", subcategory: "headbands", tag: "best-seller", colors: [], reviews: [] },
  { id: 3, name: "New Product 1", price: 250, image: "", images: [], category: "crochet", subcategory: "tops", tag: "new-arrival", colors: [] },
  { id: 4, name: "New Product 2", price: 300, image: "", images: [], category: "beads", subcategory: "necklaces", tag: "new-arrival", colors: [] },
  { id: 5, name: "Wide Headband", price: 120, image: "", images: [], category: "crochet", subcategory: "headbands", tag: "", colors: [] },
  { id: 6, name: "Thin Headband", price: 90, image: "", images: [], category: "crochet", subcategory: "headbands", tag: "", colors: [] },
  { id: 7, name: "Summer Crop Top", price: 350, image: "", images: [], category: "crochet", subcategory: "tops", tag: "", colors: [] },
  { id: 8, name: "Knitted Bracelet", price: 50, image: "", images: [], category: "crochet", subcategory: "bracelets", tag: "", colors: [] },
  { id: 9, name: "Flower Earring", price: 150, image: "", images: [], category: "beads", subcategory: "earrings", tag: "", colors: [] },
  { id: 10, name: "Drop Earring", price: 120, image: "", images: [], category: "beads", subcategory: "earrings", tag: "", colors: [] },
  { id: 11, name: "Pearl Choker", price: 250, image: "", images: [], category: "beads", subcategory: "necklaces", tag: "", colors: [] },
  { id: 12, name: "Beaded Bracelet", price: 80, image: "", images: [], category: "beads", subcategory: "bracelets", tag: "", colors: [] },
];

function createCardHTML(product) {
  let imgHtml = product.image 
    ? `<img src="${product.image}" class="card-img-top rounded-top-4" alt="${product.name}" style="height: 200px; object-fit: cover;">` 
    : `<div class="placeholder-img bg-light rounded-top-4" style="height: 200px;"></div>`;
  
  let colorsHtml = '';
  if (product.colors && product.colors.length > 0) {
    colorsHtml = '<div class="color-options mb-3 d-flex justify-content-center gap-1">';
    product.colors.forEach(colorGroup => {
      let bgStyle = getColorBackground(colorGroup);
      colorsHtml += `<span class="color-circle shadow-sm" style="${bgStyle} width:15px; height:15px; border-radius:50%; display:inline-block; border:1px solid #ccc;"></span>`;
    });
    colorsHtml += '</div>';
  } else {
    colorsHtml = '<div class="mb-3" style="height: 15px;"></div>'; // placeholder for spacing
  }

  return `
    <div class="product-card card border-0 shadow-sm rounded-4">
      ${imgHtml}
      <div class="card-body text-center">
        <h6 class="card-title fw-bold">${product.name}</h6>
        <p class="card-text text-muted small mb-2">${product.price} EGP</p>
        ${colorsHtml}
        <button class="btn btn-outline-custom w-100 rounded-pill btn-sm" onclick="window.location.href='details.html?id=${product.id}'">Details</button>
      </div>
    </div>
  `;
}

function renderProducts() {
  const containers = document.querySelectorAll('.dynamic-products');
  containers.forEach(container => {
    const filterType = container.getAttribute('data-filter-type');
    const filterValue = container.getAttribute('data-filter-value');
    
    let filteredProducts = [];
    if (filterType === 'tag') {
      filteredProducts = products.filter(p => p.tag === filterValue);
    } else if (filterType === 'subcategory') {
      filteredProducts = products.filter(p => p.subcategory === filterValue);
    }
    
    let html = '';
    filteredProducts.forEach(p => {
      html += createCardHTML(p);
    });
    
    container.innerHTML = html;
  });
}

document.addEventListener("DOMContentLoaded", renderProducts);

function renderCatalog() {
  const catalogGrid = document.getElementById('catalog-grid');
  if (!catalogGrid) return; // Only run on catalog.html

  const urlParams = new URLSearchParams(window.location.search);
  const filterType = urlParams.get('type');
  const filterValue = urlParams.get('val');
  
  let filteredProducts = products;
  
  if (filterType === 'tag') {
    filteredProducts = products.filter(p => p.tag === filterValue);
  } else if (filterType === 'subcategory') {
    filteredProducts = products.filter(p => p.subcategory === filterValue);
  } else if (filterType === 'category') {
    filteredProducts = products.filter(p => p.category === filterValue);
  } else if (filterType === 'search') {
    const query = filterValue.toLowerCase();
    filteredProducts = products.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.category.toLowerCase().includes(query) || 
      p.subcategory.toLowerCase().includes(query)
    );
    document.getElementById('catalog-title').innerText = 'Search Results for "' + filterValue + '"';
    document.title = 'Search Results - SHE MADE';
  }
  
  if (filteredProducts.length === 0) {
    catalogGrid.innerHTML = `<div class="col-12 text-center text-muted my-5"><i class="fas fa-box-open fs-1 mb-3"></i><h4>No products found in this category yet.</h4></div>`;
    return;
  }

  let html = '';
  filteredProducts.forEach(p => {
    // We wrap createCardHTML in a div.col
    html += `<div class="col">${createCardHTML(p)}</div>`;
  });
  
  catalogGrid.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", renderCatalog);
