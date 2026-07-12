import { Box, Typography, Paper } from '@mui/material';

export default function ReportsPage() {
  return (
    <Box>
      <Typography variant="h5" fontWeight={600} mb={3}>
        Reports
      </Typography>
      <Paper sx={{ p: 4 }}>
        <Typography color="text.secondary">
          Reports management UI — connect to /api/v1/reports endpoints.
        </Typography>
      </Paper>
    </Box>
  );
}
