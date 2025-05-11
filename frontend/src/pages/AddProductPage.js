// frontend/src/pages/AddProductPage.js
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
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

// Styled component for the file input
const VisuallyHiddenInput = styled('input')({
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

// Validation Schema
const productSchema = yup.object().shape({
  name: yup.string().required('Product name is required').trim(),
  description: yup.string().trim().optional(),
  price: yup.number().typeError('Price must be a number').positive('Price must be positive').required('Price is required'),
  quantity: yup.number().typeError('Quantity must be a number').integer('Quantity must be an integer').min(0, 'Quantity cannot be negative').required('Quantity is required'),
  image: yup.mixed()
    .optional() // Make it optional
    .test('fileSize', 'Image is too large (max 2MB)', (value) => {
      if (!value || !value[0]) return true; // No file, so valid
      return value[0].size <= 2 * 1024 * 1024; // 2MB
    })
    .test('fileType', 'Unsupported file format (only JPEG, PNG, GIF)', (value) => {
      if (!value || !value[0]) return true; // No file, so valid
      return ['image/jpeg', 'image/png', 'image/gif'].includes(value[0].type);
    }),
});


const AddProductPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState(''); // For API errors
  const [imagePreview, setImagePreview] = useState(null);
  const [imageName, setImageName] = useState('');


  const { control, handleSubmit, register, formState: { errors }, watch, setValue } = useForm({
    resolver: yupResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: '',
      quantity: '',
      image: null,
    }
  });

  const selectedImageFile = watch('image');

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setValue('image', event.target.files, { shouldValidate: true }); // react-hook-form expects FileList
      setImageName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setValue('image', null, { shouldValidate: true });
      setImageName('');
      setImagePreview(null);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setFormError('');

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description || ''); // Ensure description is not undefined
    formData.append('price', data.price);
    formData.append('quantity', data.quantity);
    if (data.image && data.image[0]) { // data.image is a FileList
      formData.append('image', data.image[0]);
    }

    try {
      await productService.addProduct(formData);
      toast.success('Product added successfully!');
      navigate('/products'); // Redirect to product list
    } catch (err) {
      const errorMessage = err.message || 'Failed to add product. Please try again.';
      setFormError(errorMessage);
      toast.error(errorMessage);
      console.error("Add product error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
          Add New Product
        </Typography>
        {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}
        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Product Name"
                    variant="outlined"
                    fullWidth
                    required
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Description (Optional)"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="price"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Price"
                    variant="outlined"
                    fullWidth
                    required
                    type="number"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                    error={!!errors.price}
                    helperText={errors.price?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="quantity"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Quantity"
                    variant="outlined"
                    fullWidth
                    required
                    type="number"
                    error={!!errors.quantity}
                    helperText={errors.quantity?.message}
                  />
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
                {imageName || "Upload Product Image (Optional)"}
                {/* We use the VisuallyHiddenInput for the actual file input functionality */}
                <VisuallyHiddenInput type="file" {...register('image', { onChange: handleImageChange })} accept="image/png, image/jpeg, image/gif" />
              </Button>
              {errors.image && (
                <Typography color="error" variant="caption" sx={{ display: 'block', mt: 0.5, ml: 1.5 }}>
                  {errors.image.message}
                </Typography>
              )}
              {imagePreview && (
                <Box sx={{ mt: 2, textAlign: 'center', border: '1px dashed grey', padding: 1, borderRadius: 1, width: 'fit-content', marginX: 'auto' }}>
                  <Typography variant="caption" display="block" gutterBottom>Image Preview:</Typography>
                  <img src={imagePreview} alt="Preview" style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }} />
                </Box>
              )}
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/products')}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Add Product'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default AddProductPage;