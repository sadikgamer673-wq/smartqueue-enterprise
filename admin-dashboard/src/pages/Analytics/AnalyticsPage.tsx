import { Box, Typography, Paper } from '@mui/material';

export default function AnalyticsPage() {
  return (
    <Box>
      <Typography variant="h5" fontWeight={600} mb={3}>
        Analytics
      </Typography>
      <Paper sx={{ p: 4 }}>
        <Typography color="text.secondary">
          Analytics management UI — connect to /api/v1/analytics endpoints.
        </Typography>
      </Paper>
    </Box>
  );
}
