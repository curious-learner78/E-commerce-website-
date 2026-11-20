# 📚 BookNest — Online Bookstore & Study Essentials Store

A responsive, full-stack e-commerce web application for browsing books and stationery, filtering by category, managing a live shopping cart, and placing real-time orders backed by **Firebase Cloud Firestore**.

🔗 **Live Demo:** [https://curious-learner78.github.io/booknest/](https://curious-learner78.github.io/booknest/)

---

## ✨ Key Features

- **Dynamic Product Catalog:** Loads books and stationery items from Firebase Firestore (`products` collection) with automatic fallback to a built-in catalog.
- **Instant Search & Category Filtering:** Filter items in real time by title, author, or category (*All*, *Literature*, *Tech*, *Stationery*).
- **Interactive Shopping Cart Drawer:** Add items, increment/decrement quantities, and calculate totals dynamically in ₹ (INR).
- **Cloud Firestore Order Persistence:** Submits customer orders with timestamps (`serverTimestamp()`) directly to a Firestore `orders` collection.
- **Mobile-First Responsive UI:** Clean emerald-and-cream interface designed to work smoothly across mobile phones and desktops.

---

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES Modules)
- **Backend & Database:** Firebase v10.12.2 (Cloud Firestore)
- **Hosting & Deployment:** GitHub Pages

---

## 📂 Project Structure

```text
booknest/
├── index.html      # Storefront layout, search/filter bar, product grid, and cart drawer
├── styles.css      # Responsive styling, product cards, and slide-out cart UI
├── app.js          # Catalog rendering, search/filter logic, cart state, and Firestore integration
└── README.md       # Project documentation
```

---

## 🚀 How It Works

- **Catalog Loading (init):** Connects to Firebase Firestore and fetches documents from the products collection. If none exist yet, it seamlessly renders the default catalog.
- **Cart Management:**  Tracks item quantities and calculates subtotals  real time inside a slide-out cart drawer.
- **Order Checkout:**  Validates cart items and writes a structured order document (customerName, items, total, createdAt) to the Firestore orders collection.

## 🛠️Setup & Configuration
1. Clone or fork this repository.

2. Create a project in the Firebase
   ```
   Console, register a Web App, and enable Cloud Firestore.
   ```
3. Replace the firebaseConfig object in app.js with your project's credentials.
4. Enable GitHub Pages from Settings → Pages (main branch, / (root) folder).




