# School Library Management API

A RESTful API built with **Node.js**, **Express**, and **MongoDB** to manage a school library system.
The API allows managing authors, books, students, and library attendants, as well as handling book borrowing and returning.

---

# Tech Stack

* **Node.js**
* **Express.js**
* **MongoDB**
* **Mongoose**
* **Postman** (for API testing)

---

# Project Structure

```
library-system
│
├── config
│   └── db.js
│
├── controllers
│   ├── attendant.js
│   ├── author.js
│   ├── book.js
│   └── student.js
│
├── models
│   ├── attendant.model.js
│   ├── author.model.js
│   ├── book.model.js
│   └── student.model.js
│
├── routes
│   ├── attendant.js
│   ├── author.js
│   ├── book.js
│   └── student.js
│
├── services
│   ├── staffIdService.js
│   └── studentIdService.js
│
├── utils
│   ├── idFormatter.js
│   └── isbnGen.js
│
├── .env
├── server.js
└── package.json
```

---

# Installation & Setup

### Clone the repository

```bash
git clone <your-repo-url>
cd library-system
```

---

### Install dependencies

```bash
npm install
```

---

### Configure Environment Variables

Create a `.env` file in the root directory.

Example:

```
PORT=3001
MONGO_URI=mongodb://localhost:27017/
```

---

### Start the Server

Development mode:

```bash
npm run start:dev
```

Server runs on:

```
http://localhost:3001
```

---

# API Endpoints

## Authors

### Create Author

```
POST /authors
```

Body:

```json
{
  "name": "Pristine",
  "bio": "I am the music meister"
}
```

---

### Get All Authors

```
GET /authors?page=1&limit=2
```

---

### Get Single Author

```
GET /authors/:id
```

---

### Update Author

```
PUT /authors/:id
```

---

### Delete Author

```
DELETE /authors/:id
```

---

# Books

### Create Book

```
POST /books
```

Body:

```json
{
  "title": "Indominable",
  "authors": ["authorId"]
}
```

---

### Get All Books

```
GET /books?page=1&limit=3
```

---

### Get One Book

```
GET /books/:id
```

Books automatically populate:

* Authors
* Borrowed Student
* Issuing Attendant

---

### Update Book

```
PUT /books/:id
```

---

### Delete Book

```
DELETE /books/:id
```

---

# Students

### Create Student

```
POST /students
```

Body:

```json
{
  "name": "Rita",
  "email": "rita@example.com",
  "studentId": "STU-KDJF"
}
```

---

### Get All Students

```
GET /students?page=1&limit=2
```

---

### Get One Student

```
GET /students/:id
```

---

# Library Attendants

### Create Attendant

```
POST /attendants
```

Body:

```json
{
  "name": "Sir James"
}
```

---

### Get All Attendants

```
GET /attendants?page=1&limit=2
```

---

# Borrow Book

```
POST /books/:id/borrow
```

Body:

```json
{
  "borrowedBy": "studentId",
  "issuedBy": "attendantId",
  "returnDate": "2026-04-05"
}
```

Rules:

* Book must be **available (IN)**
* After borrowing:

  * status → `OUT`
  * borrowedBy → student
  * issuedBy → attendant
  * returnDate → set

---

# Return Book

```
POST /books/:id/return
```

After returning:

* status → `IN`
* borrowedBy → cleared
* issuedBy → cleared
* returnDate → cleared

---

# API Documentation

The full API collection used for testing is included as a **Postman collection**.

Click the link to access full API documentation on Postman:

```
https://web.postman.co/workspace/05c667ad-a349-4829-817c-0b83cb76a218/documentation/42947527-2d5d2513-957b-46ad-b355-1c0cf31434b4
```

---

# Features

* RESTful API design
* MongoDB relationships with **Mongoose populate**
* Pagination support
* Book borrowing and return logic
* Unique identifiers for students and attendants
* Modular MVC structure

---

# Testing

All endpoints were tested using **Postman**.

You can click the link above to the imported Postman collecton to quickly test all API routes.

---

# Author

Developed as part of a **Backend Development Assignment**.
