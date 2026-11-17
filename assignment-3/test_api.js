/**
 * Automated Test Script for Assignment 3 - Inventory and Data Management System
 * Tests all CRUD, filtering, sorting, pagination, and aggregation endpoints.
 */

const dotenv = require('dotenv');
const mongoose = require('mongoose');
const http = require('http');

dotenv.config();

const app = require('./app');
const Product = require('./models/Product');

const PORT = 5002;
let server;
let baseUrl = `http://127.0.0.1:${PORT}`;

let passedCount = 0;
let failedCount = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passedCount++;
  } else {
    console.error(`  ❌ FAIL: ${testName} ${details ? '- ' + details : ''}`);
    failedCount++;
  }
}

async function runTests() {
  console.log('\n======================================================');
  console.log('🧪 Starting Inventory Management REST API Tests...');
  console.log('======================================================\n');

  try {
    // 1. Connect DB & Start Test Server
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/inventory_db_test';
    await mongoose.connect(mongoUri);
    await Product.deleteMany({}); // Clean test DB

    server = http.createServer(app);
    await new Promise((resolve) => server.listen(PORT, resolve));
    console.log(`Test server running on port ${PORT}\n`);

    // 2. Test Welcome Route
    const resHome = await fetch(`${baseUrl}/`);
    const dataHome = await resHome.json();
    assert(resHome.status === 200 && dataHome.success === true, 'GET / (Welcome route)');

    // 3. Test POST /api/products - Create Product
    const newProduct = {
      name: 'Gel Pen Pack of 15',
      sku: 'STNY-PN-713',
      category: 'Stationery',
      price: 120,
      quantity: 40,
      reorderLevel: 20,
      supplier: 'Cello Pens'
    };

    const resCreate = await fetch(`${baseUrl}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct)
    });
    const createdProduct = await resCreate.json();
    assert(resCreate.status === 201 && createdProduct.sku === 'STNY-PN-713', 'POST /api/products - Valid creation');
    assert(createdProduct.stockValue === 4800, 'Virtual field stockValue calculation (120 * 40 = 4800)');

    const testProductId = createdProduct._id || createdProduct.id;

    // 4. Test Validation Error on POST
    const resInvalid = await fetch(`${baseUrl}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Incomplete' })
    });
    assert(resInvalid.status === 400, 'POST /api/products - Input validation error handling (400 Bad Request)');

    // 5. Test Duplicate SKU
    const resDup = await fetch(`${baseUrl}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct)
    });
    assert(resDup.status === 400, 'POST /api/products - Duplicate SKU handling (400 Bad Request)');

    // 6. Test GET /api/products/:id
    const resGetById = await fetch(`${baseUrl}/api/products/${testProductId}`);
    const dataById = await resGetById.json();
    assert(resGetById.status === 200 && dataById.name === 'Gel Pen Pack of 15', 'GET /api/products/:id - Fetch single product');

    // 7. Test PUT /api/products/:id
    const resUpdate = await fetch(`${baseUrl}/api/products/${testProductId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ price: 140, quantity: 60 })
    });
    const dataUpdated = await resUpdate.json();
    assert(resUpdate.status === 200 && dataUpdated.price === 140 && dataUpdated.quantity === 60, 'PUT /api/products/:id - Update product details');
    assert(dataUpdated.stockValue === 8400, 'Virtual field stockValue after update (140 * 60 = 8400)');

    // 8. Test PATCH /api/products/:id/stock - Restock (+10)
    const resRestock = await fetch(`${baseUrl}/api/products/${testProductId}/stock`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ change: 10 })
    });
    const dataRestock = await resRestock.json();
    assert(resRestock.status === 200 && dataRestock.product.quantity === 70, 'PATCH /api/products/:id/stock - Restock (+10)');

    // 9. Test PATCH /api/products/:id/stock - Sale (-20)
    const resSale = await fetch(`${baseUrl}/api/products/${testProductId}/stock`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ change: -20 })
    });
    const dataSale = await resSale.json();
    assert(resSale.status === 200 && dataSale.product.quantity === 50, 'PATCH /api/products/:id/stock - Sale reduction (-20)');

    // 10. Test PATCH /api/products/:id/stock - Insufficient Stock Rejection
    const resOverSale = await fetch(`${baseUrl}/api/products/${testProductId}/stock`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ change: -100 })
    });
    assert(resOverSale.status === 400, 'PATCH /api/products/:id/stock - Safe stock adjustment rejects negative balance (400)');

    // 11. Add more products for Filtering, Sorting, Pagination & Aggregation
    await Product.create([
      {
        name: 'Wireless Keyboard',
        sku: 'ELEC-KB-101',
        category: 'Electronics',
        price: 1500,
        quantity: 3,
        reorderLevel: 5,
        supplier: 'Logitech'
      },
      {
        name: 'Gaming Mouse',
        sku: 'ELEC-MS-102',
        category: 'Electronics',
        price: 2500,
        quantity: 1,
        reorderLevel: 4,
        supplier: 'Razer'
      },
      {
        name: 'Desk Lamp',
        sku: 'FURN-LP-201',
        category: 'Furniture',
        price: 800,
        quantity: 20,
        reorderLevel: 5,
        supplier: 'IKEA'
      }
    ]);

    // 12. Test GET /api/products - Filtering by Category
    const resCategory = await fetch(`${baseUrl}/api/products?category=Electronics`);
    const dataCategory = await resCategory.json();
    assert(resCategory.status === 200 && dataCategory.count === 2, 'GET /api/products?category=Electronics (Filter)');

    // 13. Test GET /api/products - Sorting
    const resSort = await fetch(`${baseUrl}/api/products?sortBy=price&order=asc`);
    const dataSort = await resSort.json();
    assert(resSort.status === 200 && dataSort.products[0].price <= dataSort.products[1].price, 'GET /api/products?sortBy=price&order=asc (Sorting)');

    // 14. Test GET /api/products - Pagination
    const resPage = await fetch(`${baseUrl}/api/products?page=1&limit=2`);
    const dataPage = await resPage.json();
    assert(resPage.status === 200 && dataPage.products.length === 2 && dataPage.total === 4, 'GET /api/products?page=1&limit=2 (Pagination metadata)');

    // 15. Test GET /api/products/low-stock - Aggregation
    const resLowStock = await fetch(`${baseUrl}/api/products/low-stock`);
    const dataLowStock = await resLowStock.json();
    // Wireless Keyboard (3 <= 5) and Gaming Mouse (1 <= 4)
    assert(resLowStock.status === 200 && dataLowStock.count === 2, 'GET /api/products/low-stock - Aggregation pipeline matches quantity <= reorderLevel');

    // 16. Test GET /api/products/summary - Aggregation
    const resSummary = await fetch(`${baseUrl}/api/products/summary`);
    const dataSummary = await resSummary.json();
    assert(resSummary.status === 200 && dataSummary.categories >= 3, 'GET /api/products/summary - Aggregation category metrics');

    // 17. Test DELETE /api/products/:id
    const resDelete = await fetch(`${baseUrl}/api/products/${testProductId}`, {
      method: 'DELETE'
    });
    const dataDelete = await resDelete.json();
    assert(resDelete.status === 200 && dataDelete.message === 'Product deleted', 'DELETE /api/products/:id - Product deletion');

    // Verify product is gone
    const resVerifyDelete = await fetch(`${baseUrl}/api/products/${testProductId}`);
    assert(resVerifyDelete.status === 404, 'GET /api/products/:id after delete returns 404');

  } catch (error) {
    console.error('Test execution error:', error);
    failedCount++;
  } finally {
    if (server) {
      server.close();
    }
    await mongoose.connection.close();

    console.log('\n======================================================');
    console.log(`Test Results: ${passedCount} PASSED, ${failedCount} FAILED`);
    console.log('======================================================\n');

    process.exit(failedCount > 0 ? 1 : 0);
  }
}

runTests();
