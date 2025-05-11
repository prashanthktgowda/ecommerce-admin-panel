// frontend/src/services/productService.js
import { addPointerEvent } from 'framer-motion';
import axiosInstance from '../api/axiosInstance';

const API_URL = '/products/';



// Get all products
const getAllProducts = async () => {
  try {
    const response = await axiosInstance.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error.response || error);
    throw error.response?.data || new Error('Could not fetch products.');
  }
};

// Delete a product by ID
const deleteProduct = async (productId) => {
  try {
    const response = await axiosInstance.delete(API_URL + productId);
    return response.data; // Should be { message: 'Product removed' }
  } catch (error) {
    console.error(`Error deleting product ${productId}:`, error.response || error);
    throw error.response?.data || new Error('Could not delete product.');
  }
};
const addProduct = async (productData) => {
    try {
      // When sending FormData, Content-Type header is automatically set by the browser
      // to 'multipart/form-data', so we don't need to set it manually in axiosInstance defaults
      // if it was set to 'application/json'. If your axiosInstance forces 'application/json',
      // you might need to override it here:
      // const response = await axiosInstance.post(API_URL, productData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      // });
      const response = await axiosInstance.post(API_URL, productData);
      return response.data;
    } catch (error) {
      console.error("Error adding product:", error.response || error);
      throw error.response?.data || new Error('Could not add product.');
    }
  };

  // Get a single product by ID
const getProductById = async (productId) => {
  try {
    const response = await axiosInstance.get(API_URL + productId);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product ${productId}:`, error.response || error);
    throw error.response?.data || new Error('Could not fetch product details.');
  }
};

const updateProduct = async (productId, productData) => {
  try {
    // Similar to addProduct, Content-Type will be handled automatically for FormData
    const response = await axiosInstance.put(API_URL + productId, productData);
    return response.data;
  } catch (error) {
    console.error(`Error updating product ${productId}:`, error.response || error);
    throw error.response?.data || new Error('Could not update product.');
  }
};

// We'll add addProduct, getProductById, updateProduct later

const productService = {
  getAllProducts,
  deleteProduct,
  addProduct,
  getProductById,
  updateProduct,
  // ...
};

export default productService;