import { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Button, Grid, TextField, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, TablePagination,
  IconButton, Chip, Dialog, DialogTitle, DialogContent, DialogActions,
  FormControl, InputLabel, Select, MenuItem, Stack, InputAdornment,
  Switch, FormControlLabel, Avatar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { productApi, categoryApi, storeApi } from '../../api/services';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStore, setSelectedStore] = useState('');

  // Dialog State
  const [open, setOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    barcode: '',
    sku: '',
    categoryId: '',
    brand: '',
    price: 0,
    mrp: 0,
    tax: 18,
    unit: 'piece',
    images: [] as string[],
    isActive: true,
    storeId: '',
    initialStock: 100,
    lowStockThreshold: 10
  });

  const [loading, setLoading] = useState(false);

  // Fetch initial data
  useEffect(() => {
    fetchCategories();
    fetchStores();
  }, []);

  // Fetch products on filter change
  useEffect(() => {
    fetchProducts();
  }, [page, rowsPerPage, selectedCategory, selectedStore]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await productApi.getAll({
        page: page + 1,
        limit: rowsPerPage,
        search: search || undefined,
        categoryId: selectedCategory || undefined,
        storeId: selectedStore || undefined
      });
      if (res) {
        setProducts(res.products || []);
        setTotalProducts(res.total || 0);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await categoryApi.getAll();
      setCategories(res || []);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const fetchStores = async () => {
    try {
      const res = await storeApi.getAll();
      setStores(res || []);
    } catch (err) {
      console.error('Failed to fetch stores:', err);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    fetchProducts();
  };

  const handleOpenCreate = () => {
    setEditProduct(null);
    setFormData({
      name: '',
      description: '',
      barcode: '',
      sku: '',
      categoryId: categories[0]?._id || '',
      brand: '',
      price: 0,
      mrp: 0,
      tax: 18,
      unit: 'piece',
      images: [],
      isActive: true,
      storeId: stores[0]?._id || '',
      initialStock: 100,
      lowStockThreshold: 10
    });
    setOpen(true);
  };

  const handleOpenEdit = (product: any) => {
    setEditProduct(product);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      barcode: product.barcode || '',
      sku: product.sku || '',
      categoryId: product.categoryId?._id || product.categoryId || '',
      brand: product.brand || '',
      price: product.price || 0,
      mrp: product.mrp || 0,
      tax: product.tax || 18,
      unit: product.unit || 'piece',
      images: product.images || [],
      isActive: product.isActive ?? true,
      storeId: product.storeId?._id || product.storeId || '',
      initialStock: 0, // Not editable
      lowStockThreshold: product.lowStockThreshold || 10
    });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to deactivate this product?')) {
      try {
        await productApi.delete(id);
        fetchProducts();
      } catch (err) {
        console.error('Failed to delete product:', err);
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          images: [reader.result as string]
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editProduct) {
        await productApi.update(editProduct._id, formData);
      } else {
        await productApi.create(formData);
      }
      setOpen(false);
      fetchProducts();
    } catch (err) {
      console.error('Failed to save product:', err);
      alert('Error saving product. Please check input fields (duplicate barcode/SKU).');
    }
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h5" fontWeight={600}>
          Products Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
          sx={{ borderRadius: 2 }}
        >
          Create Product
        </Button>
      </Stack>

      {/* Filter and Search Bar */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }} elevation={0} variant="outlined">
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <form onSubmit={handleSearchSubmit}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search by name, SKU or barcode..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  )
                }}
              />
            </form>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                label="Category"
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((c) => (
                  <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Store</InputLabel>
              <Select
                value={selectedStore}
                label="Store"
                onChange={(e) => setSelectedStore(e.target.value)}
              >
                <MenuItem value="">All Stores</MenuItem>
                {stores.map((s) => (
                  <MenuItem key={s._id} value={s._id}>{s.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={() => {
                setSearch('');
                setSelectedCategory('');
                setSelectedStore('');
                setPage(0);
              }}
            >
              Clear
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Products Table */}
      <TableContainer component={Paper} elevation={0} variant="outlined" sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: 'background.neutral' }}>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>Barcode</TableCell>
              <TableCell>SKU</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Store</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">MRP</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                  <Typography color="text.secondary">No products found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product._id} hover>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        src={product.images?.[0]}
                        alt={product.name}
                        variant="rounded"
                        sx={{ width: 40, height: 40 }}
                      >
                        {product.name?.[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {product.brand}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>{product.barcode}</TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>{product.categoryId?.name || 'N/A'}</TableCell>
                  <TableCell>{product.storeId?.name || 'N/A'}</TableCell>
                  <TableCell align="right">₹{product.price}</TableCell>
                  <TableCell align="right">₹{product.mrp}</TableCell>
                  <TableCell align="center">
                    <Chip
                      label={product.isActive ? 'Active' : 'Inactive'}
                      color={product.isActive ? 'success' : 'default'}
                      size="small"
                      variant="soft"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <IconButton size="small" onClick={() => handleOpenEdit(product)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDelete(product._id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={totalProducts}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </TableContainer>

      {/* Create/Edit Modal Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>{editProduct ? 'Edit Product' : 'Create Product'}</DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Product Name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Brand"
                  required
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Barcode"
                  required
                  disabled={!!editProduct}
                  value={formData.barcode}
                  onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="SKU"
                  required
                  disabled={!!editProduct}
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={formData.categoryId}
                    label="Category"
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  >
                    {categories.map((c) => (
                      <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Store</InputLabel>
                  <Select
                    value={formData.storeId}
                    label="Store"
                    onChange={(e) => setFormData({ ...formData, storeId: e.target.value })}
                  >
                    {stores.map((s) => (
                      <MenuItem key={s._id} value={s._id}>{s.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Price (₹)"
                  type="number"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="MRP (₹)"
                  type="number"
                  required
                  value={formData.mrp}
                  onChange={(e) => setFormData({ ...formData, mrp: parseFloat(e.target.value) || 0 })}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Tax (%)"
                  type="number"
                  value={formData.tax}
                  onChange={(e) => setFormData({ ...formData, tax: parseInt(e.target.value) || 0 })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Unit"
                  placeholder="e.g. piece, pack, litre, kg"
                  required
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                />
              </Grid>
              {!editProduct && (
                <>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Initial Stock"
                      type="number"
                      value={formData.initialStock}
                      onChange={(e) => setFormData({ ...formData, initialStock: parseInt(e.target.value) || 0 })}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Low Stock Threshold"
                      type="number"
                      value={formData.lowStockThreshold}
                      onChange={(e) => setFormData({ ...formData, lowStockThreshold: parseInt(e.target.value) || 0 })}
                    />
                  </Grid>
                </>
              )}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack spacing={2}>
                  <Typography variant="body2" fontWeight={600} color="text.secondary">
                    Product Image
                  </Typography>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<CloudUploadIcon />}
                    sx={{ width: '100%', py: 1.5 }}
                  >
                    Upload Image File
                    <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                  </Button>
                  {formData.images?.[0] && (
                    <Box sx={{ mt: 1, position: 'relative', width: 80, height: 80 }}>
                      <Avatar
                        src={formData.images[0]}
                        variant="rounded"
                        sx={{ width: 80, height: 80 }}
                      />
                    </Box>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Stack spacing={2} sx={{ mt: 4 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      />
                    }
                    label="Product Available/Active"
                  />
                </Stack>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setOpen(false)} variant="outlined">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Save Product
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
