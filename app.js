import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Paste your Firebase config here once created
const firebaseConfig = {
  apiKey: "AIzaSyAnuoOBn6_d8TP7J6C_YTn50BKSd6RhSow",
  authDomain: "booknest-c9088.firebaseapp.com",
  projectId: "booknest-c9088",
  storageBucket: "booknest-c9088.firebasestorage.app",
  messagingSenderId: "413734001550",
  appId: "1:413734001550:web:8af49c6b91f63c048922df",
  measurementId: "G-R3Z6XZGXGM"
};


let db = null;
try {
  if (firebaseConfig.apiKey !== "YOUR_API_KEY") {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  }
} catch (e) {
  console.warn("Firebase not configured yet:", e.message);
}

const defaultBooks = [
  { id: "b1", title: "Thirukkural: Classic Edition", author: "Thiruvalluvar", category: "Literature", price: 249, icon: "📖" },
  { id: "b2", title: "Silappathikaram", author: "Ilango Adigal", category: "Literature", price: 299, icon: "📜" },
  { id: "b3", title: "Python & Data Analytics Handbook", author: "A. Kumar", category: "Tech", price: 499, icon: "💻" },
  { id: "b4", title: "Machine Learning Foundations", author: "R. Meena", category: "Tech", price: 549, icon: "🤖" },
  { id: "b5", title: "Dot-Grid Study Journal", author: "BookNest Studio", category: "Stationery", price: 179, icon: "📓" },
  { id: "b6", title: "Pastel Study Highlighters (Set of 6)", author: "BookNest Studio", category: "Stationery", price: 149, icon: "🖍️" }
];

let allBooks = [...defaultBooks];
let activeCategory = "All";
let searchQuery = "";
let cart = {};

const productGrid = document.getElementById("product-grid");
const cartCountEl = document.getElementById("cart-count");
const cartDrawer = document.getElementById("cart-drawer");
const cartItemsEl = document.getElementById("cart-items");
const cartTotalEl = document.getElementById("cart-total");

function renderBooks() {
  const filtered = allBooks.filter((book) => {
    const matchesCat = activeCategory === "All" || book.category === activeCategory;
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery) ||
      book.author.toLowerCase().includes(searchQuery);
    return matchesCat && matchesSearch;
  });

  productGrid.innerHTML = filtered.length
    ? filtered
        .map(
          (book) => `
      <div class="book-card">
        <div>
          <div class="book-cover">
            ${book.image ? `<img src="${book.image}" alt="${book.title}" />` : book.icon || "📚"}
          </div>
          <span class="book-cat">${book.category}</span>
          <h3>${book.title}</h3>
          <p class="book-author">by ${book.author}</p>
        </div>
        <div class="card-bottom">
          <span class="price">₹${book.price}</span>
          <button class="add-btn" data-id="${book.id}">+ Add</button>
        </div>
      </div>`
        )
        .join("")
    : `<p>No matching books found.</p>`;

  document.querySelectorAll(".add-btn").forEach((btn) => {
    btn.addEventListener("click", () => addToCart(btn.dataset.id));
  });
}

function addToCart(id) {
  const book = allBooks.find((b) => b.id === id);
  if (!book) return;
  if (cart[id]) {
    cart[id].qty += 1;
  } else {
    cart[id] = { ...book, qty: 1 };
  }
  updateCartUI();
}

function updateQty(id, delta) {
  if (!cart[id]) return;
  cart[id].qty += delta;
  if (cart[id].qty <= 0) delete cart[id];
  updateCartUI();
}

function updateCartUI() {
  const items = Object.values(cart);
  const totalCount = items.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  cartCountEl.textContent = totalCount;
  cartTotalEl.textContent = `₹${totalPrice}`;

  cartItemsEl.innerHTML = items.length
    ? items
        .map(
          (item) => `
      <div class="cart-item">
        <div>
          <strong>${item.title}</strong>
          <div>₹${item.price} × ${item.qty}</div>
        </div>
        <div class="qty-controls">
          <button class="qty-btn" data-id="${item.id}" data-delta="-1">-</button>
          <span>${item.qty}</span>
          <button class="qty-btn" data-id="${item.id}" data-delta="1">+</button>
        </div>
      </div>`
        )
        .join("")
    : `<p style="color:#6b7280;">Your cart is empty.</p>`;

  document.querySelectorAll(".qty-btn").forEach((btn) => {
    btn.addEventListener("click", () => updateQty(btn.dataset.id, Number(btn.dataset.delta)));
  });
}

// Search & Category listeners
document.getElementById("search-input").addEventListener("input", (e) => {
  searchQuery = e.target.value.trim().toLowerCase();
  renderBooks();
});

document.querySelectorAll(".pill").forEach((pill) => {
  pill.addEventListener("click", () => {
    document.querySelectorAll(".pill").forEach((p) => p.classList.remove("active"));
    pill.classList.add("active");
    activeCategory = pill.dataset.cat;
    renderBooks();
  });
});

// Cart Drawer toggle
document.getElementById("open-cart-btn").addEventListener("click", () => cartDrawer.classList.remove("hidden"));
document.getElementById("close-cart-btn").addEventListener("click", () => cartDrawer.classList.add("hidden"));

// Checkout to Firebase Firestore
document.getElementById("checkout-btn").addEventListener("click", async () => {
  const items = Object.values(cart);
  const statusEl = document.getElementById("order-status");
  const customerName = document.getElementById("customer-name").value.trim() || "Guest Reader";

  if (!items.length) {
    statusEl.textContent = "Add at least one book first!";
    return;
  }

  if (db) {
    try {
      await addDoc(collection(db, "orders"), {
        customerName,
        items,
        total: items.reduce((s, i) => s + i.price * i.qty, 0),
        createdAt: serverTimestamp()
      });
      statusEl.textContent = `Order placed in Firebase for ${customerName}!`;
    } catch (err) {
      statusEl.textContent = "Could not save to Firebase—check rules.";
      return;
    }
  } else {
    statusEl.textContent = `Demo order confirmed for ${customerName}! (Connect Firebase to save permanently)`;
  }

  cart = {};
  updateCartUI();
});

// Load from Firestore if configured
async function init() {
  if (db) {
    try {
      const snap = await getDocs(collection(db, "products"));
      const fetched = [];
      snap.forEach((doc) => fetched.push({ id: doc.id, ...doc.data() }));
      if (fetched.length) allBooks = fetched;
    } catch (e) {
      console.warn("Using default catalog:", e.message);
    }
  }
  renderBooks();
  updateCartUI();
}

init();
                                                           
