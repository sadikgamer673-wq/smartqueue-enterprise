import { Box, Typography, Paper } from '@mui/material';

export default function WorkersPage() {
  return (
    <Box>
      <Typography variant="h5" fontWeight={600} mb={3}>
        Workers
      </Typography>
      <Paper sx={{ p: 4 }}>
        <Typography color="text.secondary">
          Workers management UI — connect to /api/v1/workers endpoints.
        </Typography>
      </Paper>
    </Box>
  );
}
