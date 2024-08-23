const client = new Appwrite.Client()
.setEndpoint('https://cloud.appwrite.io/v1')
.setProject('66bf2f0c001ed3fc6a5e');

const databases = new Appwrite.Databases(client);
const databaseId = 'products';
const collectionId = '66bf3028000c0a34101e';
const purchaseCollectionId = '66bf759d0020d55c17eb'; // Collection ID for purchases

// Function to fetch and display the collection
let allProducts = []; // To store all products fetched from Appwrite

// Function to fetch and display the collection
async function getProducts() {
try {
const response = await databases.listDocuments(databaseId, collectionId);
allProducts = response.documents; // Store the fetched products

displayProducts(allProducts); // Display all products initially
} catch (error) {
console.error('Failed to fetch products:', error);
}
}

// Function to display products based on a given list
function displayProducts(products) {
const productsList = document.getElementById('products-list');
productsList.innerHTML = ''; // Clear the product list

products.forEach(product => {
const productItem = document.createElement('div');
productItem.className = 'product-item';

productItem.innerHTML = `
<img src="${product.imageUrl}" alt="${product.name}" class="product-img" loading="lazy">
<h2>${product.name}</h2>
<p id="cod" dir="rtl">کد محصول :${product.description}</p>
<p id="vb">${product.availability}</p>
<p class="price">تومان${product.price}</p>
<button onclick="openPurchaseForm('${product.description}')"
    style="border-radius: 20px;background:#00000075;color: azure;border: none; width: 50%;padding: 10px; margin-top: 20px; cursor:pointer;">BUY</button>
`;

productsList.appendChild(productItem);
});
}

// Function to filter products based on search input
function filterProducts() {
const searchTerm = document.getElementById('search-bar').value.toLowerCase();
const filteredProducts = allProducts.filter(product => 
product.name.toLowerCase().includes(searchTerm) || 
product.description.toLowerCase().includes(searchTerm)
);

displayProducts(filteredProducts); // Display the filtered products
}



// Function to open the purchase form with product details
function openPurchaseForm(productCode) {
document.getElementById('product-code').value = productCode;
document.getElementById('purchase-form-container').style.display = 'flex';
}

// Function to close the purchase form
function closePurchaseForm() {
document.getElementById('purchase-form-container').style.display = 'none';
}

// Function to handle the purchase submission
async function submitPurchase() {
const buyerName = document.getElementById('buyer-name').value;
const buyerAddress = document.getElementById('buyer-address').value;
const quantity = document.getElementById('quantity').value; // Get quantity value
const productCode = document.getElementById('product-code').value;

if (buyerName && buyerAddress && productCode && quantity > 0) {
    try {
        // Create a purchase document
        await databases.createDocument(databaseId, purchaseCollectionId, 'unique()', {
            buyerName,
            buyerAddress,
            productCode,
            quantity // Include quantity in the document
        });

        // Show success message and close the form
        alert('برای تکمیل خرید یه منو BUY بروید')
        alert('در صورت واریز مبلغ کالا تحویل داده میشود');
        alert('درصورت بروز مشکل از طریغ تلگرام یا پیامک در ارتباط باشید');
        closePurchaseForm(); // Close the form after submission
    } catch (error) {
        console.error('Failed to submit purchase:', error);
    }
} else {
    alert('لطفاً تمام اطلاعات را وارد کنید');
}
}

// Call the function to fetch and display products when the page loads
getProducts();