// indexeddb.js
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

// Add product and sync with server
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

// Update product and sync with server
async function updateProduct(product) {
  const db = await openDatabase();
  const transaction = db.transaction(["products"], "readwrite");
  const objectStore = transaction.objectStore("products");

  const request = objectStore.put(product);

  request.onsuccess = function () {
    console.log("Product updated successfully:", product);
    syncProductWithServer(product, "PUT");
  };

  request.onerror = function (event) {
    console.error("Error updating product: ", event.target.error);
  };
}

// Delete product and sync with server
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

// Function to open or create IndexedDB with user store
function openUserDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("UserDB", 1);

    request.onerror = function (event) {
      console.error("Database error: ", event.target.errorCode);
      reject("Error opening user database");
    };

    request.onsuccess = function (event) {
      console.log("User database opened successfully");
      resolve(event.target.result);
    };

    request.onupgradeneeded = function (event) {
      const db = event.target.result;

      if (!db.objectStoreNames.contains("users")) {
        const objectStore = db.createObjectStore("users", { keyPath: "id" });
        objectStore.createIndex("email", "email", { unique: true });
      }
    };
  });
}

// CRUD functions similar to products
async function addUser(user) {
  const db = await openUserDatabase();
  const transaction = db.transaction(["users"], "readwrite");
  const objectStore = transaction.objectStore("users");

  const request = objectStore.add(user);

  request.onsuccess = function () {
    console.log("User added successfully:", user);
  };

  request.onerror = function (event) {
    console.error("Error adding user: ", event.target.error);
  };
}
