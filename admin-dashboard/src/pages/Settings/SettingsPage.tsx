import { Box, Typography, Paper } from '@mui/material';

export default function SettingsPage() {
  return (
    <Box>
      <Typography variant="h5" fontWeight={600} mb={3}>
        Settings
      </Typography>
      <Paper sx={{ p: 4 }}>
        <Typography color="text.secondary">
          Settings management UI — connect to /api/v1/settings endpoints.
        </Typography>
      </Paper>
    </Box>
  );
}
