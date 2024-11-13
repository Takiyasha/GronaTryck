// indexeddb.js

// Function to open or create IndexedDB with product store
function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("ProductDB", 1);

    request.onerror = function (event) {
      console.error("Database error: ", event.target.errorCode);
      reject("Error opening product database");
    };

    request.onsuccess = function (event) {
      console.log("Product database opened successfully");
      resolve(event.target.result);
    };

    request.onupgradeneeded = function (event) {
      const db = event.target.result;

      if (!db.objectStoreNames.contains("products")) {
        const objectStore = db.createObjectStore("products", {
          keyPath: "id",
          autoIncrement: true,
        });
        objectStore.createIndex("name", "name", { unique: false });
      }
    };
  });
}

// Function to sync product with server
async function syncProductWithServer(product, method) {
  try {
    const response = await fetch(
      `/products/${method === "POST" ? "" : product.id}`,
      {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to ${method} product on server`);
    }

    const data = await response.json();
    console.log(
      `Product ${method === "POST" ? "added" : "updated"} on server:`,
      data
    );
  } catch (error) {
    console.error(`Error ${method.toLowerCase()}ing product:`, error);
  }
}

// Add product to IndexedDB and sync with server
async function addProduct(product) {
  const db = await openDatabase();
  const transaction = db.transaction(["products"], "readwrite");
  const objectStore = transaction.objectStore("products");

  const request = objectStore.add(product);

  request.onsuccess = function () {
    console.log("Product added successfully:", product);
    syncProductWithServer(product, "POST");
  };

  request.onerror = function (event) {
    console.error("Error adding product: ", event.target.error);
  };
}

// Delete product from IndexedDB and sync with server
async function deleteProduct(productId) {
  const db = await openDatabase();
  const transaction = db.transaction(["products"], "readwrite");
  const objectStore = transaction.objectStore("products");

  const request = objectStore.delete(productId);

  request.onsuccess = function () {
    console.log("Product deleted successfully with ID:", productId);
    syncProductWithServer({ id: productId }, "DELETE");
  };

  request.onerror = function (event) {
    console.error("Error deleting product: ", event.target.error);
  };
}
