document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search-bar input');
    const searchResults = document.createElement('div');
    searchResults.className = 'search-results';
    document.querySelector('.search-bar').appendChild(searchResults);

    // Sample product data - in real application, this would come from a database
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

    // Format price with dots
    function formatPrice(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + 'đ';
    }

    // Search function
    function searchProducts(query) {
        if (!query.trim()) {
            searchResults.style.display = 'none';
            return;
        }

        const results = products.filter(product => 
            product.name.toLowerCase().includes(query.toLowerCase())
        );

        if (results.length > 0) {
            searchResults.innerHTML = results.map(product => `
                <a href="/pages/product-detail.html?id=${product.id}" class="search-result-item">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="search-result-info">
                        <div class="search-result-name">${product.name}</div>
                        <div class="search-result-unit">${product.unit}</div>
                        <div class="search-result-price">${formatPrice(product.price)}</div>
                    </div>
                </a>
            `).join('');
            searchResults.style.display = 'block';
        } else {
            searchResults.innerHTML = '<div class="no-results">Không tìm thấy sản phẩm</div>';
            searchResults.style.display = 'block';
        }
    }

    // Add event listeners
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            searchProducts(e.target.value);
        }, 300);
    });

    // Close search results when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-bar')) {
            searchResults.style.display = 'none';
        }
    });

    // Prevent search results from closing when clicking inside
    searchResults.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}); 