# E-commerce Admin Panel

This project is a full-stack admin dashboard for a simple e-commerce system, allowing administrators to manage products and view orders. It was built as an assessment to demonstrate proficiency in frontend (React), backend (Node.js/Express), and database (MongoDB) technologies, along with core web development principles like CRUD operations, API communication, and authentication.

## Table of Contents

1.  [Project Objective](#project-objective)
2.  [Features](#features)
    *   [Product Management](#product-management)
    *   [Order Management](#order-management)
    *   [Authentication](#authentication)
    *   [Dashboard](#dashboard)
3.  [Tech Stack](#tech-stack)
4.  [Project Flow & Architecture](#project-flow--architecture)
    *   [Backend](#backend-1)
    *   [Frontend](#frontend-1)
    *   [Database](#database-1)
    *   [Authentication Flow](#authentication-flow)
5.  [Setup and Installation](#setup-and-installation)
    *   [Prerequisites](#prerequisites)
    *   [Backend Setup](#backend-setup-1)
    *   [Frontend Setup](#frontend-setup-1)
    *   [MongoDB (Docker)](#mongodb-docker)
6.  [Running the Application](#running-the-application)
7.  [API Endpoints](#api-endpoints)
    *   [Auth Routes](#auth-routes)
    *   [Product Routes](#product-routes)
    *   [Order Routes](#order-routes)
8.  [Future Enhancements (Optional)](#future-enhancements-optional)

## Project Objective

(As per PDF)
To build a full-stack admin dashboard where an admin can manage products and orders in a simple e-commerce system. The focus is on demonstrating:
*   **Frontend:** User Interface (React, Material UI)
*   **Backend:** APIs (Node.js, Express)
*   **Database:** Storage (MongoDB)
*   **Core Skills:** CRUD, Form Handling, API Communication, Basic Authentication.

## Features

### Product Management
*   **Add New Product:**
    *   Form with fields: Product Name (required), Description (optional), Price (decimal, required), Quantity (integer, required).
    *   Optional image upload for product thumbnails.
*   **List All Products:**
    *   Displayed in a table/grid showing: Image (Thumbnail), Name, Price, Quantity.
    *   Actions to Edit or Delete each product.
*   **Update a Product:**
    *   Form pre-filled with existing product details.
    *   Ability to edit all fields and update/replace the product image.
*   **Delete a Product:**
    *   Remove product from the database with confirmation.
    *   Associated product image is also removed from server storage.

### Order Management (Simplified Version)
*   **List All Orders:**
    *   Displayed in a table showing: Order ID, Customer Name, Total Price, Status (Pending/Completed), Order Date.
    *   Orders are pre-filled in the database for demonstration (no checkout flow implemented).

### Authentication
![Admin Login Page](![alt text](image.png))
*   **Admin Login:** Secure login page for administrators (email/password).
*   **JWT (JSON Web Token) Authentication:** Tokens are issued upon successful login and used to authorize access to protected API routes.
*   **Protected Routes:** Product and order management pages and APIs are accessible only to authenticated administrators.
*   **Logout Functionality.**

### Dashboard
![Admin Dashboard](![alt text](image-1.png))
*   **Homepage:** Displays quick statistics:
    *   Total number of products.
    *   Total number of orders.

### Product Listing
![Product Listing Page](![alt text](image-2.png))
*A comprehensive table displaying all products with options to edit or delete.*

### Add Product Form
![Add Product Form](![alt text](image-3.png))
*Form for adding new products, including details like name, price, quantity, and image upload.*

### Order Listing
![Order Listing Page](![alt text](image-5.png))
*Displays all customer orders with relevant details like customer name, total price, and status.*

### API Testing using Post man
![Order Listing Page](![alt text](image-4.png))
*Showcasing API testing using Postman desktop*


## Tech Stack

*   **Frontend:**
    *   React
    *   React Router DOM (for routing)
    *   Material UI (for UI components and styling)
    *   Axios (for API communication)
    *   React Hook Form & Yup (for form handling and validation)
    *   React Toastify (for notifications)
*   **Backend:**
    *   Node.js
    *   Express.js (web framework)
    *   Mongoose (MongoDB ODM)
    *   JSON Web Token (jsonwebtoken) (for authentication)
    *   Bcrypt.js (for password hashing)
    *   Multer (for handling file/image uploads)
    *   `dotenv` (for environment variables)
    *   `cors` (for Cross-Origin Resource Sharing)
*   **Database:**
    *   MongoDB (NoSQL database, run via Docker)
*   **Development Tools:**
    *   VS Code
    *   Postman (for API testing)
    *   Nodemon (for backend auto-restarts)
    *   Git & GitHub (for version control)

## Project Flow & Architecture

The project follows a typical client-server architecture with a separate frontend and backend.

### Backend
1.  **Server Setup:** An Express.js server listens for incoming HTTP requests.
2.  **Middleware:**
    *   `cors`: Enables requests from the frontend (different origin).
    *   `express.json()`: Parses incoming JSON request bodies.
    *   `express.urlencoded()`: Parses URL-encoded data.
    *   Static file serving for uploaded images (`/uploads`).
    *   Authentication middleware (`protect`): Verifies JWT for protected routes.
    *   `multer`: Handles `multipart/form-data` for image uploads.
3.  **Routing:** API routes are defined for authentication, products, and orders. Each route is handled by a specific controller function.
    *   `/api/auth`: Handles admin registration (initial) and login.
    *   `/api/products`: Handles CRUD operations for products.
    *   `/api/orders`: Handles listing orders.
4.  **Controllers:** Contain the business logic for each route. They interact with services/models.
5.  **Models (Mongoose Schemas):** Define the structure for `User` (Admin), `Product`, and `Order` data in MongoDB. They include data validation, pre-save hooks (e.g., password hashing), and instance methods (e.g., password matching).
6.  **Database Interaction:** Mongoose is used to perform CRUD operations on the MongoDB database.

### Frontend
1.  **UI (React Components):**
    *   The application is built using React functional components and hooks.
    *   **Pages:** Represent different views (Login, Dashboard, Products, Orders, Add/Edit Product).
    *   **Layouts:** `MainLayout` provides a consistent structure (sidebar, app bar) for authenticated views.
    *   **Components:** Reusable UI elements (e.g., `StatCard`, `ProtectedRoute`).
    *   **Material UI:** Used extensively for pre-built, styled components, enhancing UI/UX.
2.  **Routing (`react-router-dom`):**
    *   Manages navigation between different pages.
    *   `ProtectedRoute` component ensures only authenticated users can access certain routes.
3.  **State Management:**
    *   **Local Component State (`useState`, `useReducer`):** Used for managing UI-specific state within components.
    *   **Context API (`AuthContext`):** Manages global authentication state (admin info, token, login/logout functions).
4.  **API Communication (`axios`):**
    *   An `axiosInstance` is configured with the backend base URL.
    *   An interceptor automatically attaches the JWT to outgoing requests if the admin is logged in.
    *   Service modules (`authService.js`, `productService.js`, `orderService.js`) encapsulate API call logic.
5.  **Form Handling (`react-hook-form` & `yup`):**
    *   Used for managing product forms (add/edit).
    *   Provides efficient form state management and validation using Yup schemas.
6.  **User Experience:**
    *   `react-toastify` provides feedback (success/error messages) for user actions.
    *   Loading indicators (`CircularProgress`) are shown during data fetching.
    *   Responsive design elements are incorporated using Material UI's grid system and drawer behavior.

### Database
*   **MongoDB:** A NoSQL document database.
    *   **Collections:** `users`, `products`, `orders`.
    *   **Schemas:** Defined via Mongoose in the backend to structure data within these collections.
    *   Hosted in a Docker container for ease of setup and portability.

### Authentication Flow
1.  Admin navigates to the `/login` page.
2.  Enters email and password.
3.  Frontend sends credentials to the backend `/api/auth/login` endpoint.
4.  Backend verifies credentials:
    *   Finds user by email.
    *   Compares hashed password using `bcrypt.js`.
5.  If valid, backend generates a JWT signed with a secret key and returns it to the frontend along with user details.
6.  Frontend stores the JWT (and user info) in `localStorage` and updates the `AuthContext`.
7.  For subsequent requests to protected API routes, the frontend's `axios` interceptor attaches the JWT as a `Bearer` token in the `Authorization` header.
8.  Backend's `protect` middleware verifies the JWT on incoming requests to protected routes:
    *   If valid, allows access.
    *   If invalid or missing, returns a `401 Unauthorized` error.
9.  Logout clears the JWT from `localStorage` and updates the `AuthContext`.

## Setup and Installation

### Prerequisites
*   Node.js (v16 or later recommended) & npm (or Yarn)
*   Docker Desktop (for running MongoDB)
*   Git

### Backend Setup
1.  Clone the repository:
    ```bash
    git clone https://github.com/prashanthktgowda/ecommerce-admin-panel
    cd ecommerce-admin-panel/backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `backend` directory with the following content:
    ```env
    PORT=5001
    MONGO_URI=mongodb://localhost:27017/ecommerce_admin # Adjust if your MongoDB is different
    JWT_SECRET=yourSuperStrongRandomSecretKeyForJWT # CHANGE THIS!
    ```
    *   **Important:** Replace `yourSuperStrongRandomSecretKeyForJWT` with a long, random, and secure string.
    *   Ensure `MONGO_URI` matches your MongoDB Docker container's connection string.

### Frontend Setup
1.  Navigate to the frontend directory:
    ```bash
    cd ../frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
    (No `.env` file needed for the frontend in this basic setup, as the API URL is hardcoded in `axiosInstance.js`. For production, you'd use environment variables here too.)

### MongoDB (Docker)
1.  Ensure Docker Desktop is running.
2.  Pull the MongoDB image and run a container (if you don't have one already):
    ```bash
    docker pull mongo
    docker run -d -p 27017:27017 --name mongodb-ecommerce mongo
    ```
    This command runs a MongoDB container named `mongodb-ecommerce` and maps port `27017` on your host to port `27017` in the container. If you use a different port or name, adjust the `MONGO_URI` in the backend's `.env` file accordingly.

## Running the Application

1.  **Start the Backend Server:**
    Open a terminal in the `backend` directory:
    ```bash
    npm run dev
    ```
    The backend server should start on `http://localhost:5001` (or the port specified in `.env`).

2.  **Start the Frontend Development Server:**
    Open another terminal in the `frontend` directory:
    ```bash
    npm start
    ```
    The React application will open in your browser, typically at `http://localhost:3000`.

3.  **Initial Admin User Setup:**
    *   The first time you run the application, you'll need to create an admin user. The backend includes a `/api/auth/register` endpoint for this.
    *   You can use Postman to send a `POST` request to `http://localhost:5001/api/auth/register` with a JSON body:
        ```json
        {
            "email": "admin@example.com",
            "password": "yourSecurePassword"
        }
        ```
    *   Alternatively, you can temporarily enable a registration form on the frontend or directly insert an admin user into the MongoDB `users` collection (with a bcrypt-hashed password).
    *   **Security Note:** After creating the initial admin, consider disabling or further protecting the public registration route in a production environment.

4.  **Access the Admin Panel:**
    Navigate to `http://localhost:3000/login` in your browser and log in with the admin credentials.

## API Endpoints

Base URL for all API endpoints: `http://localhost:5001/api`

### Auth Routes
*   `POST /auth/register`: (For initial admin setup) Register a new admin.
*   `POST /auth/login`: Login an admin, returns a JWT.

### Product Routes
(All protected by JWT authentication)
*   `POST /products`: Add a new product (supports image upload via `form-data`).
*   `GET /products`: List all products.
*   `GET /products/:id`: Get a single product by its ID.
*   `PUT /products/:id`: Update a product by its ID (supports image update via `form-data`).
*   `DELETE /products/:id`: Delete a product by its ID.

### Order Routes
(All protected by JWT authentication)
*   `GET /orders`: List all orders.
*   `POST /orders`: (Optional, for development) Seed/create a sample order.

## Future Enhancements (Optional)

*   More detailed order view.
*   Ability to update order status via the UI.
*   User management for multiple admin roles.
*   Advanced filtering and searching for products and orders.
*   Pagination for long lists.
*   Deployment scripts and instructions (e.g., using Docker Compose for both frontend/backend).
*   Image storage in a cloud service (e.g., AWS S3, Cloudinary) instead of local server storage.
*   More comprehensive error handling and logging.
*   Unit and integration tests.