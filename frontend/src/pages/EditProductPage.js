// frontend/src/pages/EditProductPage.js
import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { styled } from '@mui/material/styles';
import { toast } from 'react-toastify';

import productService from '../services/productService';

const VisuallyHiddenInput = styled('input')({ /* ... same as in AddProductPage ... */
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

// Same validation schema as AddProductPage
const productSchema = yup.object().shape({
  name: yup.string().required('Product name is required').trim(),
  description: yup.string().trim().optional(),
  price: yup.number().typeError('Price must be a number').positive('Price must be positive').required('Price is required'),
  quantity: yup.number().typeError('Quantity must be a number').integer('Quantity must be an integer').min(0, 'Quantity cannot be negative').required('Quantity is required'),
  image: yup.mixed()
    .optional()
    .test('fileSize', 'Image is too large (max 2MB)', (value) => {
      if (!value || !value[0]) return true;
      return value[0].size <= 2 * 1024 * 1024;
    })
    .test('fileType', 'Unsupported file format (only JPEG, PNG, GIF)', (value) => {
      if (!value || !value[0]) return true;
      return ['image/jpeg', 'image/png', 'image/gif'].includes(value[0].type);
    }),
});

const EditProductPage = () => {
  const { productId } = useParams(); // Get productId from URL
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true); // For initial data fetch
  const [formError, setFormError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [imageName, setImageName] = useState('');
  const [existingImageUrl, setExistingImageUrl] = useState(null);


  const { control, handleSubmit, register, formState: { errors }, watch, setValue, reset } = useForm({
    resolver: yupResolver(productSchema),
    defaultValues: { // Set default values, will be overridden by fetched data
      name: '',
      description: '',
      price: '',
      quantity: '',
      image: null,
    }
  });

  // Fetch product data on component mount
  useEffect(() => {
    const fetchProduct = async () => {
      setPageLoading(true);
      try {
        const product = await productService.getProductById(productId);
        reset({ // Use reset to populate form fields
          name: product.name,
          description: product.description || '',
          price: product.price,
          quantity: product.quantity,
          // image: null, // Don't pre-fill file input, handle preview separately
        });
        if (product.imageUrl) {
          setExistingImageUrl(`http://localhost:5001${product.imageUrl}`); // Full URL for current image
          setImagePreview(`http://localhost:5001${product.imageUrl}`);
          // Extract filename if possible, or set a placeholder
          const filename = product.imageUrl.split('/').pop();
          setImageName(filename || "Current Image");
        }
      } catch (err) {
        const errorMessage = err.message || 'Failed to fetch product details.';
        setFormError(errorMessage);
        toast.error(errorMessage);
        // navigate('/products'); // Optionally redirect if product not found
      } finally {
        setPageLoading(false);
      }
    };
    if (productId) {
      fetchProduct();
    }
  }, [productId, reset, navigate]);


  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setValue('image', event.target.files, { shouldValidate: true });
      setImageName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Preview new image
      };
      reader.readAsDataURL(file);
      setExistingImageUrl(null); // Clear existing image URL if a new file is chosen
    } else {
      // If user deselects a file, revert to existing image preview if available
      setValue('image', null, { shouldValidate: true });
      setImageName(existingImageUrl ? (existingImageUrl.split('/').pop() || "Current Image") : '');
      setImagePreview(existingImageUrl);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setFormError('');

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description || '');
    formData.append('price', data.price);
    formData.append('quantity', data.quantity);
    if (data.image && data.image[0]) { // If a new image file is selected
      formData.append('image', data.image[0]);
    }
    // If no new image is selected, the backend should keep the existing image if `product.imageUrl` isn't explicitly cleared.
    // Our backend updateProduct controller is designed to only update imageUrl if req.file exists.

    try {
      await productService.updateProduct(productId, formData);
      toast.success('Product updated successfully!');
      navigate('/products');
    } catch (err) {
      const errorMessage = err.message || 'Failed to update product. Please try again.';
      setFormError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
        <Typography sx={{ml: 2}}>Loading product details...</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
          Edit Product
        </Typography>
        {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={3}>
            {/* Form fields are identical to AddProductPage */}
            <Grid item xs={12}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Product Name" variant="outlined" fullWidth required error={!!errors.name} helperText={errors.name?.message} />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Description (Optional)" variant="outlined" fullWidth multiline rows={4} error={!!errors.description} helperText={errors.description?.message} />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="price"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Price" variant="outlined" fullWidth required type="number" InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }} error={!!errors.price} helperText={errors.price?.message} />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="quantity"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Quantity" variant="outlined" fullWidth required type="number" error={!!errors.quantity} helperText={errors.quantity?.message} />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                component="label"
                role={undefined}
                variant="outlined"
                tabIndex={-1}
                startIcon={<PhotoCamera />}
                fullWidth
                sx={{justifyContent: 'flex-start', textTransform: 'none', py: 1.5}}
                color={errors.image ? "error" : "primary"}
              >
                {imageName || "Upload New Product Image (Optional)"}
                <VisuallyHiddenInput type="file" {...register('image', { onChange: handleImageChange })} accept="image/png, image/jpeg, image/gif" />
              </Button>
              {errors.image && (
                <Typography color="error" variant="caption" sx={{ display: 'block', mt: 0.5, ml: 1.5 }}>
                  {errors.image.message}
                </Typography>
              )}
              {imagePreview && (
                 <Box sx={{ mt: 2, textAlign: 'center', border: '1px dashed grey', padding: 1, borderRadius: 1, width: 'fit-content', marginX: 'auto' }}>
                  <Typography variant="caption" display="block" gutterBottom>
                    {existingImageUrl && imagePreview === existingImageUrl ? "Current Image Preview:" : "New Image Preview:"}
                  </Typography>
                  <img src={imagePreview} alt="Preview" style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }} />
                </Box>
              )}
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
              <Button variant="outlined" onClick={() => navigate('/products')} disabled={loading}>Cancel</Button>
              <Button type="submit" variant="contained" color="primary" disabled={loading}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Update Product'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default EditProductPage;