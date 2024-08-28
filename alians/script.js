const client = new Appwrite.Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('66bf2f0c001ed3fc6a5e');

const databases = new Appwrite.Databases(client);
const databaseId = 'products';
const collectionId = '66bf3028000c0a34101e';
const purchaseCollectionId = '66bf759d0020d55c17eb'; // Collection ID for purchases

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
            alert('برای تکمیل خرید به منوی BUY بروید');
            alert('در صورت واریز مبلغ کالا تحویل داده میشود');
            alert('درصورت بروز مشکل از طریق تلگرام یا پیامک در ارتباط باشید');
            closePurchaseForm(); // Close the form after submission
        } catch (error) {
            console.error('Failed to submit purchase:', error);
        }
    } else {
        alert('لطفاً تمام اطلاعات را وارد کنید');
    }
}

// Function to sort products by different criteria
function sortProducts(criteria) {
    let sortedProducts = [];

    switch(criteria) {
        case 'newest':
            sortedProducts = [...allProducts].sort((a, b) => new Date(b.$createdAt) - new Date(a.$createdAt));
            break;
        case 'oldest':
            sortedProducts = [...allProducts].sort((a, b) => new Date(a.$createdAt) - new Date(b.$createdAt));
            break;
        case 'name':
            sortedProducts = [...allProducts].sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'price-asc':
            sortedProducts = [...allProducts].sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            sortedProducts = [...allProducts].sort((a, b) => b.price - a.price);
            break;
        default:
            sortedProducts = allProducts;
    }

    displayProducts(sortedProducts);
}

// Event listeners for sorting buttons
document.getElementById('sort-newest').addEventListener('click', () => sortProducts('newest'));
document.getElementById('sort-oldest').addEventListener('click', () => sortProducts('oldest'));
document.getElementById('sort-name').addEventListener('click', () => sortProducts('name'));
document.getElementById('sort-price-asc').addEventListener('click', () => sortProducts('price-asc'));
document.getElementById('sort-price-desc').addEventListener('click', () => sortProducts('price-desc'));

// Call the function to fetch and display products when the page loads
getProducts();
