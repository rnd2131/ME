// Import and configure the Appwrite SDK
const client = new Appwrite.Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1') // Set your Appwrite endpoint
    .setProject('66bf2f0c001ed3fc6a5e'); // Replace with your project ID

const database = new Appwrite.Databases(client, 'products'); // Replace with your database ID

// Function to load and display products
async function loadProducts() {
    try {
        const products = await database.listDocuments('66bf3028000c0a34101e'); // Replace with your collection ID
        const productsTable = document.getElementById('productsTable').getElementsByTagName('tbody')[0];
        products.documents.forEach((product) => {
            const row = productsTable.insertRow();
            row.insertCell(0).innerText = product.name;
            row.insertCell(1).innerText = product.price;
            const actionsCell = row.insertCell(2);
            actionsCell.innerHTML = `
                <button onclick="deleteProduct('${product.$id}')">Delete</button>
                <button onclick="editProduct('${product.$id}')">Edit</button>
            `;
        });
    } catch (error) {
        console.error('Failed to load products', error);
    }
}

// Function to load and display purchases
async function loadPurchases() {
    try {
        const purchases = await database.listDocuments('66bf759d0020d55c17eb'); // Replace with your collection ID
        const purchasesTable = document.getElementById('purchasesTable').getElementsByTagName('tbody')[0];
        purchases.documents.forEach((purchase) => {
            const row = purchasesTable.insertRow();
            row.insertCell(0).innerText = purchase.name;
            row.insertCell(1).innerText = purchase.quantity;
            const actionsCell = row.insertCell(2);
            actionsCell.innerHTML = `
                <button onclick="deletePurchase('${purchase.$id}')">Delete</button>
                <button onclick="editPurchase('${purchase.$id}')">Edit</button>
            `;
        });
    } catch (error) {
        console.error('Failed to load purchases', error);
    }
}

// Function to create a new product
async function createProduct(name, price) {
    try {
        const newProduct = await database.createDocument('66bf3028000c0a34101e', 'unique()', {
            name: name,
            price: price
        });
        alert('Product added successfully!');
        location.reload(); // Refresh the page to update the table
    } catch (error) {
        console.error('Failed to add product', error);
    }
}

// Function to delete a product
async function deleteProduct(productId) {
    try {
        await database.deleteDocument('66bf3028000c0a34101e', productId); // Replace with your collection ID
        alert('Product deleted');
        location.reload(); // Refresh the page to update the table
    } catch (error) {
        console.error('Failed to delete product', error);
    }
}

// Function to delete a purchase
async function deletePurchase(purchaseId) {
    try {
        await database.deleteDocument('66bf759d0020d55c17eb', purchaseId); // Replace with your collection ID
        alert('Purchase deleted');
        location.reload();
    } catch (error) {
        console.error('Failed to delete purchase', error);
    }
}

// Event listener for the product form submission
document.getElementById('productForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById('productName').value;
    const price = document.getElementById('productPrice').value;
    createProduct(name, price);
});

// Load products and purchases when the page loads
window.onload = () => {
    loadProducts();
    loadPurchases();
};
