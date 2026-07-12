import { Box, Typography, Paper } from '@mui/material';

export default function OrdersPage() {
  return (
    <Box>
      <Typography variant="h5" fontWeight={600} mb={3}>
        Orders
      </Typography>
      <Paper sx={{ p: 4 }}>
        <Typography color="text.secondary">
          Orders management UI — connect to /api/v1/orders endpoints.
        </Typography>
      </Paper>
    </Box>
  );
}
