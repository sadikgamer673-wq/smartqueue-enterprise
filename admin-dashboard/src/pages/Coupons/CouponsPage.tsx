import { Box, Typography, Paper } from '@mui/material';

export default function CouponsPage() {
  return (
    <Box>
      <Typography variant="h5" fontWeight={600} mb={3}>
        Coupons
      </Typography>
      <Paper sx={{ p: 4 }}>
        <Typography color="text.secondary">
          Coupons management UI — connect to /api/v1/coupons endpoints.
        </Typography>
      </Paper>
    </Box>
  );
}
