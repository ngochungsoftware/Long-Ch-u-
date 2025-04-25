// Danh sách sản phẩm
const products = [
    {
        id: 1,
        name: "Hỗn dịch uống men vi sinh Enterogermina Gut Defense Sanofi",
        price: 165000,
        image: "/images/products/1.webp",
        unit: "Hộp 2 Vỉ x 10 Ống"
    },
    {
        id: 2,
        name: "Nước súc miệng Pearlie White Fluorinze Anti-bacterial Fluoride",
        price: 132000,
        image: "/images/products/2.webp",
        unit: "Chai"
    },
    {
        id: 3,
        name: "Viên uống Lutein Nature's Bounty giúp tăng cường thị lực",
        price: 185600,
        image: "/images/products/3.webp",
        unit: "Hộp 30 viên"
    },
    {
        id: 4,
        name: "Máy xông khí dung nén khí Yuwell 403M",
        price: 1245000,
        image: "/images/products/4.webp",
        unit: "Hộp"
    },
    {
        id: 5,
        name: "Siro Brauer Baby & Kids Liquid Zinc bổ sung kẽm",
        price: 380000,
        image: "/images/products/5.webp",
        unit: "Hộp"
    }
];

// Cart functionality
class Cart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.updateCartCount();
    }

    // Thêm sản phẩm vào giỏ hàng
    addItem(product, quantity = 1) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                ...product,
                quantity: quantity
            });
        }
        
        this.saveCart();
        this.updateCartCount();
        this.showNotification('Đã thêm sản phẩm vào giỏ hàng');
    }

    // Xóa sản phẩm khỏi giỏ hàng
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartCount();
    }

    // Cập nhật số lượng sản phẩm
    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = parseInt(quantity);
            if (item.quantity <= 0) {
                this.removeItem(productId);
            } else {
                this.saveCart();
                this.updateCartCount();
            }
        }
    }

    // Lấy tổng số sản phẩm trong giỏ
    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    // Lấy tổng tiền giỏ hàng
    getTotalPrice() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Lưu giỏ hàng vào localStorage
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    // Cập nhật số lượng hiển thị trên icon giỏ hàng
    updateCartCount() {
        const cartCountElement = document.querySelector('.cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = this.getTotalItems();
        }
    }

    // Hiển thị thông báo
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 2000);
    }

    // Xóa toàn bộ giỏ hàng
    clearCart() {
        this.items = [];
        this.saveCart();
        this.updateCartCount();
    }
}

// Khởi tạo giỏ hàng
const cart = new Cart();

// Thêm sự kiện cho các nút "Thêm vào giỏ hàng"
document.addEventListener('DOMContentLoaded', () => {
    // Xử lý nút thêm vào giỏ ở trang chủ
    const addToCartButtons = document.querySelectorAll('.btn-buy');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const productCard = button.closest('.product-card');
            const product = {
                id: parseInt(productCard.dataset.productId),
                name: productCard.querySelector('.product-title').textContent,
                price: parseFloat(productCard.querySelector('.product-price').textContent.replace('đ', '').replace(/\./g, '')),
                image: productCard.querySelector('.product-image').src,
                unit: productCard.querySelector('.product-unit').textContent
            };
            cart.addItem(product);
        });
    });

    // Xử lý nút thêm vào giỏ ở trang chi tiết sản phẩm
    const addToCartDetail = document.querySelector('.btn-add-cart');
    if (addToCartDetail) {
        addToCartDetail.addEventListener('click', () => {
            const productInfo = document.querySelector('.product-info');
            const product = {
                id: parseInt(productInfo.dataset.productId),
                name: document.querySelector('.product-title').textContent,
                price: parseFloat(document.querySelector('.price-current').textContent.replace('đ', '').replace(/\./g, '')),
                image: document.querySelector('.main-image img').src,
                unit: document.querySelector('.product-unit').textContent
            };
            const quantity = parseInt(document.querySelector('.quantity-input').value) || 1;
            cart.addItem(product, quantity);
        });
    }
}); 