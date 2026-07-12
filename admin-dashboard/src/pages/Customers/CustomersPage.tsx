import { Box, Typography, Paper } from '@mui/material';

export default function CustomersPage() {
  return (
    <Box>
      <Typography variant="h5" fontWeight={600} mb={3}>
        Customers
      </Typography>
      <Paper sx={{ p: 4 }}>
        <Typography color="text.secondary">
          Customers management UI — connect to /api/v1/customers endpoints.
        </Typography>
      </Paper>
    </Box>
  );
}
