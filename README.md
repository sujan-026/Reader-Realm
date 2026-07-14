# Book Review Website

**Project by:** Sujan P

## Introduction

Welcome to the **Reader Realm**! This platform allows users to explore books and their reviews, create user accounts, and contribute their own reviews. Admins have the special privilege to manage books, reviews, and users with full CRUD operations.

## Live Website
You can visit the live website at: **https://reader-realm.vercel.app/**

## Features

- **User Features:**
  - View a list of books.
  - View individual book details, including reviews.
  - Create an account and log in.
  - Add a review to a book.
  
- **Admin Features:**
  - Handle books: Create, Read, Update, and Delete (CRUD) operations on books.
  - Handle reviews: View and manage reviews for each book.
  - Handle users: View, create, update, and delete users.

## Tech Stack

- **Frontend**: React (for user interface)
- **Backend**: Express.js (API server)
- **Database**: MongoDB (via MongoDB Atlas)

## Installation

To get started with the project locally, follow the steps below:

### 1. Clone the repository
```bash
git clone https://github.com/your-username/book-review-website.git
cd book-review-website
```

### 2. Install dependencies
Install the dependencies for both the frontend and backend.

- **For the backend:**
  In the root directory of the project (where `package.json` is located), run:
  ```bash
  npm install
  ```

- **For the frontend:**
  Navigate to the **frontend** directory and install the dependencies:
  ```bash
  cd frontend
  npm install
  ```

### 3. Set up environment variables
Create a `.env` file in the root directory of your project and add the following variables:

```env
MONGO_URI=your_mongodb_atlas_connection_string
PORT=5000
```

Replace `your_mongodb_atlas_connection_string` with your MongoDB Atlas connection string and `your_jwt_secret` with a secure key for JWT authentication.

### 4. Run the application

- **For the backend (API):**
  In the root directory, run:
  ```bash
  npm run back
  ```

- **For the frontend (React app):**
  In the **frontend** directory, run:
  ```bash
  npm run dev
  ```

### 5. Visit the website
- Frontend will be running at: `http://localhost:8080`
- Backend will be running at: `http://localhost:5000` (or any other port you have set)

## API Routes

### **Books Routes**

- **GET /books**: Retrieve a list of all books.

  **Response:**
  ```json
  [
    {
      "id": "id of book in mongoDB",
      "title": "Book Title",
      "author": "Author Name",
      "description": "Description of the book.",
      "coverImage": "image url",
      "blurImage": "image url",
      "rating" "Overall rating of the book",
      "reviews": "Array of reviews"
    }
  ]
  ```

- **GET /books/:id**: Retrieve the details of a specific book by its ID.

  **Response:**
  ```json
  {
     "id": "1",
      "title": "Book Title",
      "author": "Author Name",
      "description": "Description of the book.",
      "coverImage": "image url",
      "blurImage": "image url",
      "rating" "Overall rating of the book",
      "reviews": "Array of reviews"
  }
  ```

- **POST /books**: Add a new book (Admin only).

  **Request body:**
  ```json
  {
      "title": "Book Title",
      "author": "Author Name",
      "description": "Description of the book.",
      "coverImage": "image url",
      "blurImage": "image url",
      "rating" "Overall rating of the book",
      "reviews": "Array of reviews"
  }
  ```

  **Response:**
  ```json
  {
      "title": "Book Title",
      "author": "Author Name",
      "description": "Description of the book.",
      "coverImage": "image url",
      "blurImage": "image url",
      "rating" "Overall rating of the book",
      "reviews": "Array of reviews"
  }
  ```

- **DELETE /books/:id**: Delete a book by its ID (Admin only).

  **Response:**
  ```json
  {
    "message": "Book deleted successfully."
  }
  ```

- **PUT /books/:id**: Update the details of a book by its ID (Admin only).

  **Request body:**
  ```json
  {
    "title": "Updated Book Title",
    "author": "Updated Author Name",
    "description": "Updated book description."
  }
  ```

  **Response:**
  ```json
  {
    "message": "Book updated successfully."
  }
  ```

### **Reviews Routes**

- **GET /reviews**: Retrieve a list of all reviews.

  **Response:**
  ```json
  {
    "success": "true",
    data : [
      {
        "bookId": "1",
        "userId": "123",
        "userName": "User Name",
        "review": "Great book!",
        "userAvatar": "userAvatar",
        "rating": 5,
        "text": "description of rating",
        "date": "date or rating"
      }
    ]
  }
  ```

- **GET /reviews/:id**: Retrieve a specific review by its ID.

  **Response:**
  ```json
  {
    "success": "true",
    data : [
      {
        "bookId": "1",
        "userId": "123",
        "userName": "User Name",
        "review": "Great book!",
        "userAvatar": "userAvatar",
        "rating": 5,
        "text": "description of rating",
        "date": "date or rating"
      }
    ]
  }
  ```

- **POST /reviews**: Submit a new review for a book.

  **Request body:**
  ```json
  {
    "bookId": "1",
    "userId": "123",
    "review": "Awesome book!",
    "rating": 4
  }
  ```

  **Response:**
  ```json
  {
    "message": "Review added successfully."
  }
  ```

- **DELETE /reviews/:id**: Delete a review by its ID (Admin or review owner only).

  **Response:**
  ```json
  {
    "message": "Review deleted successfully."
  }
  ```

- **PUT /reviews/:id**: Update a review by its ID (Admin or review owner only).

  **Request body:**
  ```json
  {
    "review": "Updated review text",
    "rating": 5
  }
  ```

  **Response:**
  ```json
  {
    "message": "Review updated successfully."
  }
  ```

### **Users Routes**

- **GET /users**: Retrieve a list of all users (Admin only).

  **Response:**
  ```json
  [
    {
      "id": "123",
      "username": "user1",
      "email": "user1@example.com"
    }
  ]
  ```

- **GET /users/:id**: Retrieve the details of a specific user by ID.

  **Response:**
  ```json
  {
    "id": "123",
    "username": "user1",
    "email": "user1@example.com"
  }
  ```

- **POST /users**: Create a new user account.

  **Request body:**
  ```json
  {
    "username": "newuser",
    "email": "newuser@example.com",
    "password": "password123"
  }
  ```

  **Response:**
  ```json
  {
    "message": "User created successfully."
  }
  ```

- **PUT /users/:id**: Update a user's details by ID (Admin or user only).

  **Request body:**
  ```json
  {
    "username": "updateduser",
    "email": "updateduser@example.com"
  }
  ```

  **Response:**
  ```json
  {
    "message": "User updated successfully."
  }
  ```

- **DELETE /users/:id**: Delete a user by ID (Admin only).

  **Response:**
  ```json
  {
    "message": "User deleted successfully."
  }
  ```

- **POST /users/login**: Log in a user and obtain a JWT token for authentication.

  **Request body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

  **Response:**
  ```json
  {
    "token": "JWT_token_here"
  }
  ```

## Conclusion

This project provides a fully functional **Reader Realm** where users can read and review books, while administrators have control over the book, review, and user management. 

For any questions or issues, feel free to open an issue in the repository.

---
This project was created by **Sujan P**.
