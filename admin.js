// Import Appwrite SDK
const sdk = new Appwrite.Client();

sdk
    .setEndpoint('https://cloud.appwrite.io/v1') // Set your Appwrite endpoint
    .setProject('66bf2f0c001ed3fc6a5e'); // Replace with your project ID

const database = new Appwrite.Databases(sdk, 'products'); // Replace with your database ID

// Function to load and display products
async function loadProducts() {
    try {
        const products = await database.listDocuments('66bf3028000c0a34101e'); // Replace with your collection ID
        const productsTable = document.getElementById('productsTable').getElementsByTagName('tbody')[0];
        products.documents.forEach((product) => {
            const row = productsTable.insertRow();
            row.insertCell(0).innerText = product.name;
            row.insertCell(1).innerText = product.price;
            const actionsCell = row.insertCell(3);
            actionsCell.innerHTML = `
                <button onclick="deleteProduct('${product.name}')">Delete</button>
                <button onclick="editProduct('${product.name}')">Edit</button>
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
            row.insertCell(1).innerText = purchase.name;
            row.insertCell(2).innerText = purchase.quantity;
            const actionsCell = row.insertCell(3);
            actionsCell.innerHTML = `
                <button onclick="deletePurchase('${purchase.name}')">Delete</button>
                <button onclick="editPurchase('${purchase.name}')">Edit</button>
            `;
        });
    } catch (error) {
        console.error('Failed to load purchases', error);
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

// Load products and purchases when the page loads
window.onload = () => {
    loadProducts();
    loadPurchases();
};
