// frontend/src/pages/OrdersPage.js
import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  // Optional: for future status updates
  // Button,
  // Menu,
  // MenuItem,
} from '@mui/material';
import { toast } from 'react-toastify';
import orderService from '../services/orderService';
// import MoreVertIcon from '@mui/icons-material/MoreVert'; // For future actions menu

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // For future status update menu
  // const [anchorEl, setAnchorEl] = useState(null);
  // const [selectedOrder, setSelectedOrder] = useState(null);
  // const openMenu = Boolean(anchorEl);

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await orderService.getAllOrders();
      setOrders(data);
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch orders.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusChipColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'warning';
      case 'Completed':
        return 'success';
      case 'Cancelled': // If you add this status
        return 'error';
      default:
        return 'default';
    }
  };

  // --- Future functionality for updating status ---
  // const handleMenuClick = (event, order) => {
  //   setAnchorEl(event.currentTarget);
  //   setSelectedOrder(order);
  // };

  // const handleMenuClose = () => {
  //   setAnchorEl(null);
  //   setSelectedOrder(null);
  // };

  // const handleStatusUpdate = async (newStatus) => {
  //   if (!selectedOrder) return;
  //   handleMenuClose();
  //   try {
  //     // Assuming you have an updateOrderStatus in orderService
  //     // await orderService.updateOrderStatus(selectedOrder._id, newStatus);
  //     toast.success(`Order ${selectedOrder._id} status updated to ${newStatus}.`);
  //     fetchOrders(); // Refresh orders
  //   } catch (err) {
  //     toast.error(err.message || `Failed to update order status.`);
  //   }
  // };
  // --- End future functionality ---

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>;
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
        Order Management
      </Typography>

      {orders.length === 0 && !loading ? (
        <Typography sx={{mt: 3, textAlign: 'center'}}>No orders found.</Typography>
      ) : (
      <TableContainer component={Paper} elevation={3}>
        <Table sx={{ minWidth: 650 }} aria-label="orders table">
          <TableHead sx={{ backgroundColor: 'primary.main' }}>
            <TableRow>
              <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }}>Order ID</TableCell>
              <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }}>Customer Name</TableCell>
              <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }} align="right">Total Price</TableCell>
              <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }} align="center">Status</TableCell>
              <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }} align="center">Date</TableCell>
              {/* <TableCell sx={{ color: 'common.white', fontWeight: 'bold' }} align="center">Actions</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow
                key={order._id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { backgroundColor: 'action.hover' } }}
              >
                <TableCell component="th" scope="row">
                  {order._id}
                </TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell align="right">${Number(order.totalPrice).toFixed(2)}</TableCell>
                <TableCell align="center">
                  <Chip label={order.status} color={getStatusChipColor(order.status)} size="small" />
                </TableCell>
                <TableCell align="center">
                  {new Date(order.createdAt).toLocaleDateString()}
                </TableCell>
                {/* Future Actions Cell
                <TableCell align="center">
                  <IconButton
                    aria-label="more"
                    aria-controls={`order-menu-${order._id}`}
                    aria-haspopup="true"
                    onClick={(e) => handleMenuClick(e, order)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    id={`order-menu-${order._id}`}
                    anchorEl={anchorEl}
                    open={openMenu && selectedOrder?._id === order._id}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={() => handleStatusUpdate('Pending')}>Set to Pending</MenuItem>
                    <MenuItem onClick={() => handleStatusUpdate('Completed')}>Set to Completed</MenuItem>
                    <MenuItem onClick={() => handleStatusUpdate('Cancelled')}>Set to Cancelled</MenuItem>
                  </Menu>
                </TableCell>
                */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      )}
    </Box>
  );
};

export default OrdersPage;