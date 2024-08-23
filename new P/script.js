const client = new Appwrite.Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('66bf2f0c001ed3fc6a5e');

const databases = new Appwrite.Databases(client);
const databaseId = 'products';
const collectionId = '66bf3028000c0a34101e';
const purchaseCollectionId = '66bf759d0020d55c17eb'; // Collection ID for purchases

let allProducts = []; // To store all products fetched from Appwrite
let selectedProduct = null; // To store selected product for purchase

// Function to fetch and display the products
async function getProducts() {
    try {
        const response = await databases.listDocuments(databaseId, collectionId);
        allProducts = response.documents; // Store fetched products
        displayProducts(allProducts); // Display all products
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
    const name = document.getElementById('buyer-name').value;
    const address = document.getElementById('buyer-address').value;
    const phone = document.getElementById('buyer-phone').value;

    if (!name || !address || !phone || !selectedProduct) {
        alert('Please fill all the fields.');
        return;
    }

    try {
        await databases.createDocument(databaseId, purchaseCollectionId, {
            productId: selectedProduct.$id,
            name: name,
            address: address,
            phone: phone
        });

        alert('Purchase successful! Redirecting to payment gateway...');
        window.location.href = 'https://payment-gateway.com'; // Replace with actual payment URL
    } catch (error) {
        console.error('Failed to submit purchase:', error);
    }
}

// Theme toggle function
function toggleTheme() {
    document.body.classList.toggle('dark');
    document.querySelectorAll('.product-item').forEach(item => item.classList.toggle('dark'));
    document.getElementById('purchase-form').classList.toggle('dark');
    document.getElementById('theme-switcher').classList.toggle('dark');
}

// Fetch and display products on page load
getProducts();

async function submitPurchase() {
    const buyerName = document.getElementById('buyer-name').value;
    const buyerAddress = document.getElementById('buyer-address').value;
    const quantity = document.getElementById('quantity').value; // Get quantity value
    const productCode = document.getElementById('product-code').value; // Get product code value

    if (buyerName && buyerAddress && productCode && quantity > 0) {
        try {
            // Create a purchase document
            await databases.createDocument(databaseId, purchaseCollectionId, 'unique()', {
                buyerName,
                buyerAddress,
                productCode,
                quantity // Include quantity in the document
            });

            // Show success messages and close the form
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
