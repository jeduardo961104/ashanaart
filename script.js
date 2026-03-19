/**
 * Ashana Art - Front-End Store Foundation
 * This file handles UI interactions, fake cart state (for phase 1), 
 * and sets up architecture for future backend integration.
 */

// STATE MANAGEMENT (Future-ready architecture)
// In a real e-commerce store, this state would map to local storage / backend database.
const StoreState = {
    cart: [],
    currency: '$',
    
    // Future expansion hooks
    user: null,
    locale: 'en-US' // Future i18n
};

// UI CONTROLLERS
const UI = {
    init() {
        this.setupPreloader();
        this.setupAnimations();
        this.setupCartInteractions();
        this.setupCheckoutForm();
        this.setupCatalogFilters();
        this.updateCartUI();
    },

    // Preloader Logic
    setupPreloader() {
        const preloader = document.getElementById('preloader');
        if (!preloader) return;
        
        // Wait for page to fully load
        window.addEventListener('load', () => {
            // Keep it visible for a moment so the loading video plays gracefully
            setTimeout(() => {
                preloader.classList.add('hidden');
            }, 1000);
        });
    },

    // 1. Soft Fade-in visual effects (Intersection Observer)
    setupAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
        
        // Trigger for elements immediately in view (header, hero)
        setTimeout(() => {
            document.querySelectorAll('.fade-in').forEach(el => {
                const rect = el.getBoundingClientRect();
                if(rect.top < window.innerHeight) {
                    el.classList.add('is-visible');
                }
            });
        }, 100);
    },

    // Catalog Filter Logic
    setupCatalogFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        if (filterBtns.length === 0) return;

        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Update active button styles
                filterBtns.forEach(b => {
                    b.classList.remove('btn-primary');
                    b.classList.add('btn-outline');
                });
                const clickedBtn = e.target;
                clickedBtn.classList.remove('btn-outline');
                clickedBtn.classList.add('btn-primary');

                // Filter items
                const filterValue = clickedBtn.getAttribute('data-filter');
                const products = document.querySelectorAll('#fullCatalogGrid .product-card');

                products.forEach(product => {
                    const categoryEl = product.querySelector('.category');
                    if (!categoryEl) return;
                    
                    const catText = categoryEl.innerText.trim();

                    if (filterValue === 'all' || catText === filterValue) {
                        product.style.display = 'block';
                        // Re-trigger fade-in animation slightly for visual polish
                        product.classList.remove('is-visible');
                        setTimeout(() => product.classList.add('is-visible'), 10);
                    } else {
                        product.style.display = 'none';
                    }
                });
            });
        });
    },

    // 2. Cart logic placeholder
    setupCartInteractions() {
        const addButtons = document.querySelectorAll('.add-to-cart-btn');
        
        addButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const card = e.target.closest('.product-card');
                const id = card.getAttribute('data-id');
                const title = card.querySelector('.product-title').innerText;
                const price = parseFloat(card.getAttribute('data-price'));

                this.addToCart({ id, title, price, quantity: 1 });
            });
        });
    },

    addToCart(product) {
        // Check if item exists
        const existing = StoreState.cart.find(item => item.id === product.id);
        if (existing) {
            existing.quantity += 1;
        } else {
            StoreState.cart.push(product);
        }

        // Visual feedback
        const btn = document.querySelector(`.product-card[data-id="${product.id}"] .add-to-cart-btn`);
        if (btn) {
            const originalText = btn.innerText;
            btn.innerText = 'Added!';
            btn.style.backgroundColor = 'var(--primary-color)';
            btn.style.color = 'white';
            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.backgroundColor = 'transparent';
                btn.style.color = 'var(--primary-color)';
            }, 1500);
        }

        this.updateCartUI();
    },

    updateCartUI() {
        // Update Cart Header Count
        const countSpan = document.getElementById('cart-count');
        const totalItems = StoreState.cart.reduce((sum, item) => sum + item.quantity, 0);
        if (countSpan) countSpan.innerText = totalItems;

        // Update Checkout Order Summary Preview
        const summaryContainer = document.getElementById('summary-items');
        const subtotalEl = document.getElementById('summary-subtotal');
        const totalEl = document.getElementById('summary-total');

        if (!summaryContainer) return; // Not on checkout view

        if (StoreState.cart.length === 0) {
            summaryContainer.innerHTML = '<p class="empty-cart-msg">Your cart is empty.</p>';
            subtotalEl.innerText = `${StoreState.currency}0.00`;
            totalEl.innerText = `${StoreState.currency}0.00`;
            return;
        }

        let html = '';
        let subtotal = 0;

        StoreState.cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            html += `
                <div class="summary-item-row">
                    <span>${item.quantity}x ${item.title}</span>
                    <span>${StoreState.currency}${itemTotal.toFixed(2)}</span>
                </div>
            `;
        });

        summaryContainer.innerHTML = html;
        subtotalEl.innerText = `${StoreState.currency}${subtotal.toFixed(2)}`;
        // For now total is subtotal (Shipping calc hook would go here)
        totalEl.innerText = `${StoreState.currency}${subtotal.toFixed(2)}`;
    },

    // 3. Checkout Form Validation Hook
    setupCheckoutForm() {
        const form = document.getElementById('checkoutForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // FUTURE PAYMENT GATEWAY BOUNDARY
            // At this point, real payment methods (Stripe, PayPal, etc) would tokenize elements
            if (StoreState.cart.length === 0) {
                alert("Your cart is empty. Please add products before checking out.");
                return;
            }

            console.log("--- SECURE CHECKOUT INITIATED ---");
            console.log("Customer: ", document.getElementById('email').value);
            console.log("Cart payload: ", StoreState.cart);

            alert("Thank you! This is a phase-1 visual checkout. In the future, this will connect to the backend server to process the payment and shipping securely.");
        });
    }
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    UI.init();
});
