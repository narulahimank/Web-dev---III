# Lab Assignment 2 – Student Management REST API

**Subject:** Web Dev III (Node.js & Express Backend)  
**Unit:** 2 | **In-Class Lab**

---

## 📌 Project Overview
A RESTful API built with **Node.js** and **Express.js** to manage student records using CRUD operations. The project implements custom middleware, modular routing, error handling with HTTP status codes, and in-memory JSON data storage.

---

## 📁 Project Structure
```text
Web dev-3/
├── data/
│   └── students.js           # In-memory student array data
├── middleware/
│   └── logger.js             # Custom request logger middleware
├── routes/
│   └── studentRoutes.js      # Student CRUD modular routes
├── .gitignore
├── app.js                    # Express application entry point
├── package.json              # Project metadata & dependencies
├── postman_collection.json   # Postman collection for direct import & testing
└── README.md
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Server
```bash
npm start
```
The server will run on `http://localhost:3000`.

---

## 📡 API Endpoints

| Method | Endpoint | Description | Success Status | Error Status |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/students` | Get all student records | `200 OK` | `500 Internal Server Error` |
| **GET** | `/students/:id` | Get single student by ID | `200 OK` | `400 Bad Request` / `404 Not Found` |
| **POST** | `/students` | Add a new student record | `201 Created` | `400 Bad Request` |
| **PUT** | `/students/:id` | Update student record by ID | `200 OK` | `400 Bad Request` / `404 Not Found` |
| **DELETE** | `/students/:id` | Remove student record by ID | `200 OK` | `400 Bad Request` / `404 Not Found` |

---

## 🧪 Testing with Postman / cURL

### 1. Get All Students
- **Method:** `GET`
- **URL:** `http://localhost:3000/students`
- **cURL:**
  ```bash
  curl -X GET http://localhost:3000/students
  ```

### 2. Get Student by ID
- **Method:** `GET`
- **URL:** `http://localhost:3000/students/1`
- **cURL:**
  ```bash
  curl -X GET http://localhost:3000/students/1
  ```

### 3. Add New Student
- **Method:** `POST`
- **URL:** `http://localhost:3000/students`
- **Headers:** `Content-Type: application/json`
- **Body (JSON):**
  ```json
  {
    "name": "Kavita",
    "course": "MCA"
  }
  ```
- **cURL:**
  ```bash
  curl -X POST http://localhost:3000/students -H "Content-Type: application/json" -d "{\"name\":\"Kavita\",\"course\":\"MCA\"}"
  ```

### 4. Update Student
- **Method:** `PUT`
- **URL:** `http://localhost:3000/students/1`
- **Headers:** `Content-Type: application/json`
- **Body (JSON):**
  ```json
  {
    "name": "Rahul Sharma",
    "course": "MCA"
  }
  ```
- **cURL:**
  ```bash
  curl -X PUT http://localhost:3000/students/1 -H "Content-Type: application/json" -d "{\"name\":\"Rahul Sharma\",\"course\":\"MCA\"}"
  ```

### 5. Delete Student
- **Method:** `DELETE`
- **URL:** `http://localhost:3000/students/1`
- **cURL:**
  ```bash
  curl -X DELETE http://localhost:3000/students/1
  ```

---

## 🛠️ Key Features Implemented
- ✅ **Express Server Setup** with JSON body parser
- ✅ **CRUD Operations** (Create, Read, Update, Delete)
- ✅ **Custom Logger Middleware** logging timestamp, HTTP method, and requested URL
- ✅ **Modular Routing** using `express.Router()`
- ✅ **Error Handling & Status Codes** (`200`, `201`, `400`, `404`, `500`)
- ✅ **In-Memory Data Storage** (Array / JSON) without external database dependencies
- ✅ **Postman Ready** with included `postman_collection.json`
