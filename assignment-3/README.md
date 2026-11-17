# Assignment 3: Inventory and Data Management System

**Course:** Web Dev III  
**Unit Covered:** Unit – 3  
**CO Mapping:** CO3  
**Marks:** 2.5  
**Mode:** 100% In-Class (Lab Practicals)  
**Time:** 30–40 minutes  
**Author:** Himank (`narulahimank@gmail.com`)

---

## 📋 Table of Contents
- [Assignment Overview](#-assignment-overview)
- [Technology Stack & Restrictions](#-technology-stack--restrictions)
- [Project Directory Structure](#-project-directory-structure)
- [Docker Compose Setup (MongoDB)](#-docker-compose-setup-mongodb)
- [Running the Application](#-running-the-application)
- [Automated Testing](#-automated-testing)
- [Postman Testing & Screenshot Guide](#-postman-testing--screenshot-guide)
- [Mongoose Schema Design & Field-Level Validation](#-mongoose-schema-design--field-level-validation)
- [API Endpoints Reference](#-api-endpoints-reference)
- [Evaluation Rubric](#-evaluation-rubric)

---

## 🎯 Assignment Overview
The **Inventory and Data Management System** is a RESTful backend built with Node.js, Express.js, and MongoDB using Mongoose. It enables warehouses or retail stores to manage products, adjust stock levels safely (restock and sale operations), query the catalog with filtering, sorting, and pagination, and generate inventory reports using MongoDB Aggregation Pipelines.

### Key Highlights:
- **Persistent Storage:** MongoDB containerized with `docker compose up -d` or local MongoDB instance.
- **Mongoose ODM:** Field-level schema validations, unique SKU indexes, and virtual `stockValue` (`price * quantity`).
- **RESTful CRUD Operations:** Complete Create, Read, Update, Delete, and Stock Adjustment (`PATCH`).
- **Querying:** Dynamic category, supplier, stock, price range filters, regex text search, sorting, and pagination.
- **Aggregation Pipelines:** Low-Stock Alert report (`quantity <= reorderLevel`) and Category-wise inventory metrics.
- **Robust Error Handling:** Centralized middleware managing CastError, duplicate keys, validation errors, and malformed JSON.

---

## 🛠️ Technology Stack & Restrictions

- **Runtime:** Node.js (v18+ or v22+)
- **Backend Framework:** Express.js
- **Database:** MongoDB (via Docker Compose or local mongod)
- **ODM:** Mongoose
- **Configuration:** dotenv
- **Containerization:** Docker & Docker Compose

> **Assignment Restrictions:**
> - ❌ No pre-built admin panel, CMS, or inventory-management boilerplate.
> - ✅ Only Node.js, Express, Mongoose, and dotenv are used.

---

## 📂 Project Directory Structure

```
assignment-3/
├── config/
│   └── db.js                 # MongoDB connection using Mongoose
├── controllers/
│   └── productController.js  # CRUD, filtering, & aggregation business logic
├── middleware/
│   ├── errorHandler.js       # Centralized error handler
│   ├── logger.js             # HTTP request logger
│   └── validateProduct.js    # Body validation middleware
├── models/
│   └── Product.js            # Mongoose Schema with validations & stockValue virtual
├── routes/
│   └── productRoutes.js      # Express router for /api/products
├── scripts/
│   └── seed.js               # Initializer script matching PDF sample dataset
├── .env                      # Environment config (PORT=5000, MONGODB_URI)
├── .env.example              # Template environment file
├── .gitignore                # Git ignore rules
├── docker-compose.yml        # Docker Compose configuration for MongoDB
├── app.js                    # Express application setup
├── server.js                 # HTTP server entry point
├── package.json              # Dependencies and npm scripts
├── postman_collection.json   # Postman test collection with auto-variable propagation
├── test_api.js               # Automated test script testing all endpoints
└── README.md                 # Project documentation
```

---

## 🐳 Docker Compose Setup (MongoDB)

The project includes `docker-compose.yml` to spin up MongoDB locally.

### Start MongoDB Container:
```bash
docker compose up -d
```
*(or use `npm run docker:up`)*

### Verify Container is Running:
```bash
docker ps
```

### Stop MongoDB Container:
```bash
docker compose down
```
*(or use `npm run docker:down`)*

---

## 🚀 Running the Application

### 1. Install Dependencies:
```bash
cd assignment-3
npm install
```

### 2. Seed Sample Database:
Populates the database with the exact 12 products, 5 categories, and 4 low-stock items shown in the assignment PDF:
```bash
npm run seed
```

### 3. Start the Express Server:
- **Development mode (with auto-reload):**
  ```bash
  npm run dev
  ```
- **Production mode:**
  ```bash
  npm start
  ```

Server will start on `http://localhost:5000`.

---

## 🧪 Automated Testing

An automated test suite is provided in `test_api.js`. It boots an isolated test instance, connects to MongoDB, tests all CRUD operations, validations, safe stock adjustments, filtering, sorting, pagination, and aggregation pipelines:

```bash
npm test
```
*(or `node test_api.js`)*

---

## 📮 Postman Testing & Screenshot Guide

Import `postman_collection.json` into Postman. The collection is configured to automatically capture and propagate generated IDs across requests:

1. **Screenshot 1:** `GET /api/products` ➔ displays catalog with pagination and saves the `Study Table` ID.
2. **Screenshot 2:** `POST /api/products` ➔ creates "Gel Pen Pack of 15" and saves `productId`.
3. **Screenshot 3:** `PUT /api/products/{{productId}}` ➔ updates price to 140 and quantity to 60.
4. **Screenshot 4:** `DELETE /api/products/{{productId}}` ➔ deletes the product and returns confirmation.
5. **Screenshot 5:** `GET /api/products/low-stock` ➔ displays low stock items (`quantity <= reorderLevel`).
6. **Screenshot 6:** `GET /api/products/summary` ➔ displays category aggregation summary.
7. **Screenshot 7:** `PATCH /api/products/{{studyTableId}}/stock` ➔ restocks Study Table by `+10`.

---

## 🗄️ Mongoose Schema Design & Field-Level Validation

Defined in `models/Product.js`:

| Field | Type | Required | Validation & Constraints |
| :--- | :--- | :--- | :--- |
| `name` | String | Yes | `trim: true`, length 2-100 characters |
| `sku` | String | Yes | `unique: true`, `uppercase: true`, `trim: true`, Regex: `/^[A-Za-z0-9-]+$/` |
| `category` | String | Yes | `trim: true` |
| `price` | Number | Yes | `min: 0` |
| `quantity` | Number | Yes | `min: 0`, default `0` |
| `reorderLevel` | Number | Yes | `min: 0`, default `0` |
| `supplier` | String | Yes | `trim: true` |
| `createdAt` | Date | Auto | Via `timestamps: true` |
| `updatedAt` | Date | Auto | Via `timestamps: true` |
| `stockValue` | Number | Virtual | Calculated via getter: `price * quantity` |
| `id` | String | Virtual | Mongoose virtual string ID |

---

## 🌐 API Endpoints Reference

Base URL: `http://localhost:5000`

### 1. GET `/api/products` (Screenshot 1)
- **Status:** `200 OK`
- **Query Params:** `category`, `search`, `minPrice`, `maxPrice`, `inStock`, `sortBy`, `order`, `page`, `limit`
- **Sample Response:**
```json
{
  "total": 12,
  "page": 1,
  "totalPages": 2,
  "count": 10,
  "products": [
    {
      "_id": "6a54767af6123427d6e61d76",
      "name": "Study Table",
      "sku": "FURN-TB-012",
      "category": "Furniture",
      "price": 3999,
      "quantity": 2,
      "reorderLevel": 4,
      "supplier": "IKEA India",
      "stockValue": 7998,
      "id": "6a54767af6123427d6e61d76"
    }
  ]
}
```

### 2. POST `/api/products` (Screenshot 2)
- **Status:** `201 Created`
- **Request Body:**
```json
{
  "name": "Gel Pen Pack of 15",
  "sku": "STNY-PN-713",
  "category": "Stationery",
  "price": 120,
  "quantity": 40,
  "reorderLevel": 20,
  "supplier": "Cello Pens"
}
```

### 3. PUT `/api/products/:id` (Screenshot 3)
- **Status:** `200 OK`
- **Request Body:**
```json
{
  "name": "Gel Pen Pack of 15",
  "sku": "STNY-PN-713",
  "category": "Stationery",
  "price": 140,
  "quantity": 60
}
```

### 4. DELETE `/api/products/:id` (Screenshot 4)
- **Status:** `200 OK`
- **Response:**
```json
{
  "message": "Product deleted",
  "id": "6a547727f6123427d6e61d7c"
}
```

### 5. GET `/api/products/low-stock` (Screenshot 5)
- **Status:** `200 OK`
- **Description:** Aggregation query matching items where `quantity <= reorderLevel`.
- **Response:**
```json
{
  "count": 4,
  "lowStockItems": [
    {
      "_id": "6a54767af6123427d6e61d76",
      "name": "Study Table",
      "sku": "FURN-TB-012",
      "category": "Furniture",
      "price": 3999,
      "quantity": 2,
      "reorderLevel": 4,
      "supplier": "IKEA India",
      "stockValue": 7998,
      "id": "6a54767af6123427d6e61d76"
    }
  ]
}
```

### 6. GET `/api/products/summary` (Screenshot 6)
- **Status:** `200 OK`
- **Description:** Aggregation grouping by category calculating total items, total quantity, total stock value, and average price.
- **Response:**
```json
{
  "categories": 5,
  "summary": [
    {
      "_id": "Electronics",
      "totalItems": 4,
      "totalQuantity": 96,
      "totalStockValue": 343904,
      "avgPrice": 5636.5
    },
    {
      "_id": "Apparel",
      "totalItems": 2,
      "totalQuantity": 78,
      "totalStockValue": 75522,
      "avgPrice": 1399
    }
  ]
}
```

### 7. PATCH `/api/products/:id/stock` (Screenshot 7)
- **Status:** `200 OK`
- **Description:** Restock (positive change) or sale (negative change) with safe inventory validation preventing negative stock.
- **Request Body:**
```json
{
  "change": 10
}
```
- **Response:**
```json
{
  "message": "Stock updated",
  "product": {
    "_id": "6a54767af6123427d6e61d76",
    "name": "Study Table",
    "sku": "FURN-TB-012",
    "category": "Furniture",
    "price": 3999,
    "quantity": 12,
    "reorderLevel": 4,
    "supplier": "IKEA India",
    "stockValue": 47988,
    "id": "6a54767af6123427d6e61d76"
  }
}
```

---

## 📊 Evaluation Rubric

| Criteria | Marks | Implementation |
| :--- | :---: | :--- |
| **Database Schema Design & Validation (Mongoose)** | **0.5** | Field-level schema validations, unique SKU, positive constraints, virtual `stockValue` (`price * quantity`). |
| **CRUD Functionality** | **0.75** | `POST` (201), `GET /:id` (200), `PUT /:id` (200), `DELETE /:id` (200), `PATCH /:id/stock` (200). |
| **Querying (Filtering, Sorting, Pagination)** | **0.5** | Full query parameter support on `GET /api/products` with pagination metadata (`total`, `page`, `totalPages`, `count`). |
| **Aggregation (Low-Stock & Category Summary)** | **0.5** | Multi-stage aggregation pipelines for low-stock reports and category totals. |
| **API Design & Clean Code** | **0.25** | MVC architecture, centralized error handling, custom logger, Docker Compose containerization. |
| **Total** | **2.5** | **100% Completed** |
