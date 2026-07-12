import { Box, Typography, Paper } from '@mui/material';

export default function InventoryPage() {
  return (
    <Box>
      <Typography variant="h5" fontWeight={600} mb={3}>
        Inventory
      </Typography>
      <Paper sx={{ p: 4 }}>
        <Typography color="text.secondary">
          Inventory management UI — connect to /api/v1/inventory endpoints.
        </Typography>
      </Paper>
    </Box>
  );
}
