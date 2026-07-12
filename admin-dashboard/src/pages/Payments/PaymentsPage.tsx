import { Box, Typography, Paper } from '@mui/material';

export default function PaymentsPage() {
  return (
    <Box>
      <Typography variant="h5" fontWeight={600} mb={3}>
        Payments
      </Typography>
      <Paper sx={{ p: 4 }}>
        <Typography color="text.secondary">
          Payments management UI — connect to /api/v1/payments endpoints.
        </Typography>
      </Paper>
    </Box>
  );
}
