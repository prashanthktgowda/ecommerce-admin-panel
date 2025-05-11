// frontend/src/services/orderService.js
import axiosInstance from '../api/axiosInstance';

const API_URL = '/orders/';

// Get all orders
const getAllOrders = async () => {
  try {
    const response = await axiosInstance.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error.response || error);
    throw error.response?.data || new Error('Could not fetch orders.');
  }
};

// We'll add more functions here later if needed

const orderService = {
  getAllOrders,
};

export default orderService;