// Product and Category Management
class EcommerceManager {
    constructor() {
        this.products = JSON.parse(localStorage.getItem('products')) || [];
        this.categories = JSON.parse(localStorage.getItem('categories')) || [];
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.init();
    }

    init() {
        this.loadProducts();
        this.loadCategories();
        this.loadCart();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Product form
        document.getElementById('product-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addProduct();
        });

        // Category form
        document.getElementById('category-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addCategory();
        });

        // Cart actions
        document.getElementById('clear-cart').addEventListener('click', () => this.clearCart());
        document.getElementById('checkout').addEventListener('click', () => this.checkout());

        // Admin tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Product list actions
        document.getElementById('product-list').addEventListener('click', (e) => {
            if (e.target.classList.contains('edit')) {
                this.editProduct(e.target.dataset.id);
            } else if (e.target.classList.contains('delete')) {
                this.deleteProduct(e.target.dataset.id);
            }
        });

        // Category list actions
        document.getElementById('category-list').addEventListener('click', (e) => {
            if (e.target.classList.contains('delete')) {
                this.deleteCategory(e.target.dataset.id);
            }
        });
    }

    loadProducts() {
        const productGrid = document.getElementById('product-grid');
        productGrid.innerHTML = '';

        this.products.forEach(product => {
            const productCard = this.createProductCard(product);
            productGrid.appendChild(productCard);
        });
    }

    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="price">$${product.price}</div>
                <div class="description">${product.description}</div>
                <div class="category">Category: ${product.category}</div>
                <button class="btn add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        `;

        card.querySelector('.add-to-cart').addEventListener('click', () => {
            this.addToCart(product);
        });

        return card;
    }

    loadCategories() {
        const categoryGrid = document.getElementById('category-grid');
        categoryGrid.innerHTML = '';

        this.categories.forEach(category => {
            const categoryCard = document.createElement('div');
            categoryCard.className = 'category-card';
            categoryCard.innerHTML = `
                <img src="https://picsum.photos/seed/${category.name}/300/200.jpg" alt="${category.name}">
                <div class="category-info">
                    <h3>${category.name}</h3>
                    <p>${category.products || 0} products</p>
                </div>
            `;
            categoryGrid.appendChild(categoryCard);
        });
    }

    loadCart() {
        const cartItems = document.getElementById('cart-items');
        cartItems.innerHTML = '';

        this.cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div>
                    <h4>${item.name}</h4>
                    <p>$${item.price} x ${item.quantity}</p>
                </div>
                <button class="remove" data-id="${item.id}">Remove</button>
            `;

            cartItem.querySelector('.remove').addEventListener('click', () => {
                this.removeFromCart(item.id);
            });

            cartItems.appendChild(cartItem);
        });

        document.getElementById('cart-count').textContent = this.cart.reduce((total, item) => total + item.quantity, 0);
    }

    addToCart(product) {
        const existingItem = this.cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity++;
        } else {
            this.cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1
            });
        }

        this.saveCart();
        this.loadCart();
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.loadCart();
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
        this.loadCart();
    }

    checkout() {
        if (this.cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        const cartDetails = this.cart.map(item => 
            `${item.name} (x${item.quantity}): $${item.price * item.quantity}`
        ).join('\n');

        const totalPrice = this.cart.reduce((total, item) => 
            total + (item.price * item.quantity), 0
        );

        const message = `Hello, I'd like to order:\n\n${cartDetails}\n\nTotal: $${totalPrice}`;
        const whatsappUrl = `https://wa.me/923058961089?text=${encodeURIComponent(message)}`;
        
        window.open(whatsappUrl, '_blank');
    }

    addProduct() {
        const name = document.getElementById('product-name').value;
        const price = document.getElementById('product-price').value;
        const category = document.getElementById('product-category').value;
        const description = document.getElementById('product-description').value;
        const image = document.getElementById('product-image').value;

        const newProduct = {
            id: Date.now().toString(),
            name,
            price: parseFloat(price),
            category,
            description,
            image
        };

        this.products.push(newProduct);
        this.saveProducts();
        this.loadProducts();
        this.loadCategories();
        
        // Clear form
        document.getElementById('product-form').reset();
        
        // Show success message
        alert('Product added successfully!');
    }

    addCategory() {
        const name = document.getElementById('category-name').value;

        const newCategory = {
            id: Date.now().toString(),
            name,
            products: 0
        };

        this.categories.push(newCategory);
        this.saveCategories();
        this.loadCategories();
        
        // Clear form
        document.getElementById('category-form').reset();
        
        // Show success message
        alert('Category added successfully!');
    }

    editProduct(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        document.getElementById('product-name').value = product.name;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-category').value = product.category;
        document.getElementById('product-description').value = product.description;
        document.getElementById('product-image').value = product.image;

        // Remove the product and let user update it
        this.deleteProduct(productId);
    }

    deleteProduct(productId) {
        this.products = this.products.filter(p => p.id !== productId);
        this.saveProducts();
        this.loadProducts();
        this.loadCategories();
    }

    deleteCategory(categoryId) {
        this.categories = this.categories.filter(c => c.id !== categoryId);
        this.saveCategories();
        this.loadCategories();
    }

    switchTab(tabName) {
        // Hide all tabs
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });

        // Show selected tab
        document.getElementById(`${tabName}-tab`).classList.add('active');

        // Update active button
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.tab === tabName) {
                btn.classList.add('active');
            }
        });
    }

    saveProducts() {
        localStorage.setItem('products', JSON.stringify(this.products));
    }

    saveCategories() {
        localStorage.setItem('categories', JSON.stringify(this.categories));
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }
}

// Initialize the ecommerce manager
document.addEventListener('DOMContentLoaded', () => {
    new EcommerceManager();
});
