// frontend/src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import Typography from '@mui/material/Typography';

import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout'; // Import MainLayout
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import AddProductPage from './pages/AddProductPage';
import EditProductPage from './pages/EditProductPage';
import OrdersPage from './pages/OrdersPage'; // Import OrdersPage

// Placeholder Pages (we'll create actual components for these soon)
const NotFoundPage = () => <Typography variant="h1" align="center" sx={{mt: 5}}>404 - Page Not Found</Typography>;


function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        // ... other toast props
      />
      <div className="App"> {/* This div might not be strictly necessary if MainLayout handles all styling */}
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes now use MainLayout */}
          <Route element={<ProtectedRoute />}> {/* Outer protection */}
            <Route element={<MainLayout />}> {/* Layout for authenticated views */}
            <Route path="/" element={<DashboardPage />} /> {/* Use actual component */}
              <Route path="/dashboard" element={<DashboardPage />} />
              

              {/* Outlet in MainLayout will render these: */}
              <Route path="/" element={<DashboardPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/add" element={<AddProductPage />} />
              <Route path="/products/edit/:productId" element={<EditProductPage />} />
              <Route path="/orders" element={<OrdersPage />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;