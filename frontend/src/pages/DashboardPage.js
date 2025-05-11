// frontend/src/pages/DashboardPage.js
import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, Typography, CircularProgress, Alert, Box } from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People'; // Example for future use

import productService from '../services/productService';
import orderService from '../services/orderService';
import { toast } from 'react-toastify';


const StatCard = ({ title, value, icon, color = "primary.main" }) => (
  <Card sx={{ display: 'flex', alignItems: 'center', p: 2, height: '100%' }}>
    <Box sx={{
      mr: 2,
      p: 1.5,
      borderRadius: '50%',
      backgroundColor: color, // Use color directly
      color: 'common.white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {icon}
    </Box>
    <Box>
      <Typography color="textSecondary" gutterBottom variant="body2">
        {title}
      </Typography>
      <Typography component="h2" variant="h5">
        {value}
      </Typography>
    </Box>
  </Card>
);


const DashboardPage = () => {
  const [stats, setStats] = useState({
    productCount: 0,
    orderCount: 0,
    // userCount: 0, // Example for future
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError('');
      try {
        // Fetch in parallel
        const [productsData, ordersData] = await Promise.all([
          productService.getAllProducts(),
          orderService.getAllOrders(),
          // Add more promises here for other data, e.g., userService.getUserCount()
        ]);

        setStats({
          productCount: productsData.length,
          orderCount: ordersData.length,
          // userCount: usersData.count, // Example
        });

      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        const errorMessage = err.message || 'Failed to load dashboard data. Please try again later.';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Dashboard Overview
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Products"
            value={stats.productCount}
            icon={<InventoryIcon sx={{ fontSize: 30 }} />}
            color="info.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Orders"
            value={stats.orderCount}
            icon={<ShoppingCartIcon sx={{ fontSize: 30 }} />}
            color="success.main"
          />
        </Grid>
        {/* Example for future expansion */}
        {/* <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Registered Users"
            value={stats.userCount}
            icon={<PeopleIcon sx={{ fontSize: 30 }} />}
            color="warning.main"
          />
        </Grid> */}
      </Grid>

      {/* You can add more sections to the dashboard here, like charts or recent activity */}
    </Box>
  );
};

export default DashboardPage;