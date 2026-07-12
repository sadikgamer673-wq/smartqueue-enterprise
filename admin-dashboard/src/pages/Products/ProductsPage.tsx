import { Box, Typography, Paper } from '@mui/material';

export default function ProductsPage() {
  return (
    <Box>
      <Typography variant="h5" fontWeight={600} mb={3}>
        Products
      </Typography>
      <Paper sx={{ p: 4 }}>
        <Typography color="text.secondary">
          Products management UI — connect to /api/v1/products endpoints.
        </Typography>
      </Paper>
    </Box>
  );
}
