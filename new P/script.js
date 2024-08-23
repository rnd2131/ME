const client = new Appwrite.Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('66bf2f0c001ed3fc6a5e');

const databases = new Appwrite.Databases(client);
const databaseId = 'products';
const collectionId = '66bf3028000c0a34101e';
const purchaseCollectionId = '66bf759d0020d55c17eb'; // Collection ID for purchases

let allProducts = []; // To store all products fetched from Appwrite
let filteredProducts = []; // To store filtered products
let selectedProduct = null; // To store selected product for purchase

// Function to fetch and display the products
async function getProducts() {
    try {
        const response = await databases.listDocuments(databaseId, collectionId);
        allProducts = response.documents; // Store fetched products
        filteredProducts = allProducts; // Initially, all products are displayed
        displayProducts(filteredProducts); // Display all products
    } catch (error) {
        console.error('Failed to fetch products:', error);
    }
}

// Function to display products
function displayProducts(products) {
    const productsList = document.getElementById('products-list');
    productsList.innerHTML = ''; // Clear existing products

    products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.className = 'product-item';

        productItem.innerHTML = `
            <img src="${product.imageUrl}" alt="${product.name}" class="product-img" loading="lazy">
            <h2>${product.name}</h2>
            <p id="cod" dir="rtl">کد محصول : ${product.description}</p>
            <p id="vb">${product.availability}</p>
            <p class="price">تومان ${product.price}</p>
            <button onclick="openPurchaseForm('${product.$id}')" 
                style="border-radius: 20px;background:#00000075;color: azure;border: none; width: 50%;padding: 10px; margin-top: 20px; cursor:pointer;">BUY</button>
        `;
        productsList.appendChild(productItem);
    });
}

// Search function to filter products by name
function searchProducts() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    filteredProducts = allProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm)
    );
    displayProducts(filteredProducts);
}

// Filter products by price
function filterByPrice() {
    const priceOrder = document.getElementById('price-filter').value;

    if (priceOrder === 'low') {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (priceOrder === 'high') {
        filteredProducts.sort((a, b) => b.price - a.price);
    }

    displayProducts(filteredProducts);
}

// Function to open the purchase form
function openPurchaseForm(productId) {
    selectedProduct = allProducts.find(product => product.$id === productId); // Get the selected product
    document.getElementById('purchase-form').style.display = 'block';
}

// Function to close the purchase form
function closePurchaseForm() {
    document.getElementById('purchase-form').style.display = 'none';
}

// Function to submit the purchase
async function submitPurchase() {
    const buyerName = document.getElementById('buyer-name').value;
    const buyerAddress = document.getElementById('buyer-address').value;
    const quantity = document.getElementById('quantity').value;
    const productCode = document.getElementById('product-code').value;

    if (buyerName && buyerAddress && productCode && quantity > 0) {
        try {
            await databases.createDocument(databaseId, purchaseCollectionId, 'unique()', {
                buyerName,
                buyerAddress,
                productCode,
                quantity
            });

            alert('برای تکمیل خرید به منو BUY بروید');
            alert('در صورت واریز مبلغ، کالا تحویل داده می‌شود.');
            alert('درصورت بروز مشکل از طریق تلگرام یا پیامک در ارتباط باشید.');

            closePurchaseForm(); // Close the form after submission
        } catch (error) {
            console.error('Failed to submit purchase:', error);
        }
    } else {
        alert('لطفاً تمام اطلاعات را وارد کنید');
    }
}

// Theme Switcher
function toggleTheme() {
    document.body.classList.toggle('dark');
    const productItems = document.querySelectorAll('.product-item');
    productItems.forEach(item => item.classList.toggle('dark'));

    const header = document.querySelector('.header');
    header.classList.toggle('dark');

    const themeSwitcher = document.getElementById('theme-switcher');
    themeSwitcher.classList.toggle('dark');
}

// Initialize the product list
getProducts();
