// Newsletter form functionality
document.querySelectorAll('.py-5.text-center.bg-warning.text-dark form').forEach(form => {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const input = form.querySelector('input[type="email"]');
        if (input && input.value.trim()) {
            input.value = '';
            form.innerHTML += '<div style="color:#388e3c;font-weight:600;margin-top:1rem;">Thank you for subscribing!</div>';
        }
    });
});

// Category click filters products (demo only)
document.querySelectorAll('.category').forEach(cat => {
    cat.addEventListener('click', function() {
        const category = cat.textContent.toLowerCase();
        document.getElementById('searchInput').value = category;
        document.getElementById('searchBtn').click();
    });
});
// Carousel functionality
const slides = document.querySelectorAll('.carousel-slide');
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');
let currentSlide = 0;

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });
}

prevBtn.addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
});

nextBtn.addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
});

showSlide(currentSlide);

// Placeholder for loading products
const productsGrid = document.getElementById('products-grid');

// Demo products grouped by category
const demoProducts = [
    { name: 'Anchovy Fish', price: 2000, image: 'images/anchovyfish.jpg', category: 'poultry' },
    { name: 'Banana', price: 500, image: 'images/banana.jpg', category: 'fruits' },
    { name: 'Blackberry', price: 800, image: 'images/blackberry.jpg', category: 'fruits' },
    { name: 'Cassava', price: 400, image: 'images/cassava.jpg', category: 'grains' },
    { name: 'Cow Meat', price: 3500, image: 'images/cowmeat.jpg', category: 'poultry' },
    { name: 'Drumstick', price: 1200, image: 'images/drumstick.jpg', category: 'poultry' },
    { name: 'Egg', price: 300, image: 'images/egg.jpg', category: 'dairy' },
    { name: 'Fresh Crabs', price: 2500, image: 'images/freshcrabs.jpg', category: 'poultry' },
    { name: 'Hilsa Fish', price: 2200, image: 'images/hilsafish.jpg', category: 'poultry' },
    { name: 'Lamb Chops', price: 4000, image: 'images/lambchops.jpg', category: 'poultry' },
    { name: 'Local Crab', price: 1800, image: 'images/localcrab.jpg', category: 'poultry' },
    { name: 'Minced Beef', price: 3200, image: 'images/mincedbeef.jpg', category: 'poultry' },
    { name: 'Orange', price: 600, image: 'images/orange.jpg', category: 'fruits' },
    { name: 'Pineapple', price: 700, image: 'images/pineapple.jpg', category: 'fruits' },
    { name: 'Red Apple', price: 650, image: 'images/redapple.jpg', category: 'fruits' },
    { name: 'Red Pear', price: 900, image: 'images/redpear.jpg', category: 'fruits' },
    { name: 'Red Raspberry', price: 850, image: 'images/redraspberry.jpg', category: 'fruits' },
    { name: 'Snow Crab', price: 2600, image: 'images/snowcrab.jpg', category: 'poultry' },
    { name: 'Steak', price: 5000, image: 'images/steak.jpg', category: 'poultry' },
    { name: 'Strawberry', price: 750, image: 'images/strawberry.jpg', category: 'fruits' },
    { name: 'White Eggs', price: 350, image: 'images/whiteeggs.jpg', category: 'dairy' }
];

async function loadProducts(search = "") {
    productsGrid.innerHTML = "";
    let url = 'http://localhost:5000/api/products';
    let products = [];
    try {
        const res = await fetch(url);
        products = await res.json();
    } catch {
        products = demoProducts;
    }
    if (search) {
        products = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    }
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
            card.innerHTML = `
                <div class="wishlist-icon" title="Add to Wishlist">
                    <i class="fa-regular fa-heart"></i>
                </div>
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>₦${product.price}</p>
                <button>Add to Cart</button>
            `;
        productsGrid.appendChild(card);
    });
}

document.getElementById('searchBtn').addEventListener('click', () => {
    const searchVal = document.getElementById('searchInput').value;
    const category = document.getElementById('filterCategory').value;
    const minPrice = document.getElementById('minPrice').value;
    const maxPrice = document.getElementById('maxPrice').value;
    const minRating = document.getElementById('minRating').value;
    loadProductsAdvanced({ search: searchVal, category, minPrice, maxPrice, minRating });
});

async function loadProductsAdvanced(filters) {
    productsGrid.innerHTML = "";
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
        if (val) params.append(key, val);
    });
    let url = 'http://localhost:5000/api/products?' + params.toString();
    let products = [];
    try {
        const res = await fetch(url);
        products = await res.json();
    } catch {
        products = demoProducts;
    }
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="wishlist-icon" title="Add to Wishlist">
                <i class="fa-regular fa-heart"></i>
            </div>
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>₦${product.price}</p>
            <button>Add to Cart</button>
        `;
        productsGrid.appendChild(card);
        card.querySelector('.wishlist-icon').addEventListener('click', function() {
            this.classList.toggle('active');
            const heart = this.querySelector('i');
            heart.classList.toggle('fa-solid');
            heart.classList.toggle('fa-regular');
            // TODO: Integrate with backend to save/remove wishlist item for logged-in user
        });
    });
    addProductCardListeners();
}

document.getElementById('searchBtn').addEventListener('click', () => {
    const searchVal = document.getElementById('searchInput').value;
    loadProducts(searchVal);
});

// Category click filters products by category
function loadProductsByCategory(category) {
    productsGrid.innerHTML = "";
    let url = 'http://localhost:5000/api/products';
    let products = [];
    fetch(url)
        .then(res => res.json())
        .then(data => {
            products = data.length ? data : demoProducts;
            products = products.filter(p => p.category === category);
            products.forEach(product => {
                const card = document.createElement('div');
                card.className = 'product-card';
                card.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>₦${product.price}</p>
                    <button>Add to Cart</button>
                `;
                productsGrid.appendChild(card);
                    card.querySelector('.wishlist-icon').addEventListener('click', function() {
                        this.classList.toggle('active');
                        const heart = this.querySelector('i');
                        heart.classList.toggle('fa-solid');
                        heart.classList.toggle('fa-regular');
                        // TODO: Integrate with backend to save/remove wishlist item for logged-in user
                    });
            });
        });
}

document.querySelectorAll('.category').forEach(cat => {
    cat.addEventListener('click', function() {
        const category = cat.textContent.toLowerCase();
        loadProductsByCategory(category);
    });
});

// Product modal logic
const productModal = new bootstrap.Modal(document.getElementById('productModal'));
const modalProductInfo = document.getElementById('modalProductInfo');
const modalReviews = document.getElementById('modalReviews');
const reviewForm = document.getElementById('reviewForm');
let currentProductId = null;

function showProductModal(product) {
    currentProductId = product._id || product.id;
    modalProductInfo.innerHTML = `
        <img src="${product.image}" alt="${product.name}" style="width:100%;max-width:200px;">
        <h3>${product.name}</h3>
        <p>₦${product.price}</p>
        <p>${product.desc || ''}</p>
    `;
    // Fetch and show reviews
    fetch(`http://localhost:5000/api/products/${currentProductId}/reviews`)
        .then(res => res.json())
        .then(data => {
            if (data.success && data.reviews.length) {
                modalReviews.innerHTML = data.reviews.map(r => `
                    <div class="review-item">
                        <strong>${r.user || 'Anonymous'}</strong> - <span>${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</span><br>
                        <span>${r.comment}</span>
                    </div>
                `).join('');
            } else {
                modalReviews.innerHTML = '<em>No reviews yet.</em>';
            }
        });
    productModal.show();
}

// Add click event to product cards to open modal
function addProductCardListeners() {
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', function(e) {
            // Prevent modal on wishlist or cart button click
            if (e.target.classList.contains('wishlist-icon') || e.target.tagName === 'BUTTON') return;
            const name = card.querySelector('h3').textContent;
            const product = demoProducts.find(p => p.name === name) || {};
            showProductModal(product);
        });
    });
}

// After loading products, add listeners

// Product CRUD UI (basic demo)
const productForm = document.getElementById('productForm');
if (productForm) {
    productForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData(productForm);
        let method = 'POST';
        let url = 'http://localhost:5000/api/products';
        const productId = productForm.dataset.editId;
        if (productId) {
            method = 'PUT';
            url += '/' + productId;
        }
        try {
            const res = await fetch(url, {
                method,
                body: formData
            });
            const data = await res.json();
            if (data._id || data.success) {
                alert('Product saved!');
                productForm.reset();
                productForm.removeAttribute('data-edit-id');
                loadProducts();
            } else {
                alert('Error saving product');
            }
        } catch (err) {
            alert('Error: ' + err.message);
        }
    });
}

// Add edit/delete buttons to product cards (admin/demo only)
function addProductCardListeners() {
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (e.target.classList.contains('wishlist-icon') || e.target.tagName === 'BUTTON') return;
            const name = card.querySelector('h3').textContent;
            const product = demoProducts.find(p => p.name === name) || {};
            showProductModal(product);
        });
        // Add edit/delete buttons if admin
        if (!card.querySelector('.edit-btn')) {
            const editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            editBtn.className = 'edit-btn btn btn-sm btn-warning';
            editBtn.onclick = function(e) {
                e.stopPropagation();
                // Fill form for editing
                if (productForm) {
                    productForm.elements['name'].value = card.querySelector('h3').textContent;
                    productForm.elements['price'].value = card.querySelector('p').textContent.replace(/[^\d]/g, '');
                    productForm.setAttribute('data-edit-id', card.dataset.id);
                }
            };
            card.appendChild(editBtn);
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.className = 'delete-btn btn btn-sm btn-danger';
            deleteBtn.onclick = async function(e) {
                e.stopPropagation();
                if (confirm('Delete this product?')) {
                    const id = card.dataset.id;
                    try {
                        const res = await fetch('http://localhost:5000/api/products/' + id, { method: 'DELETE' });
                        const data = await res.json();
                        if (data.success) {
                            alert('Product deleted');
                            loadProducts();
                        } else {
                            alert('Error deleting product');
                        }
                    } catch (err) {
                        alert('Error: ' + err.message);
                    }
                }
            };
            card.appendChild(deleteBtn);
        }
    });
}

loadProducts().then(addProductCardListeners);

// Review form submit
reviewForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const rating = parseInt(document.getElementById('reviewRating').value);
    const comment = document.getElementById('reviewComment').value;
    const user = 'Anonymous'; // Replace with logged-in user if available
    fetch(`http://localhost:5000/api/products/${currentProductId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user, rating, comment })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            modalReviews.innerHTML += `
                <div class="review-item">
                    <strong>${user}</strong> - <span>${'★'.repeat(rating)}${'☆'.repeat(5-rating)}</span><br>
                    <span>${comment}</span>
                </div>
            `;
            reviewForm.reset();
        }
    });
});

loadProducts();