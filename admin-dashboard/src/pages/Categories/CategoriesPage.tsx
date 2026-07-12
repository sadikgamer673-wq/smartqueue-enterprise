import { Box, Typography, Paper } from '@mui/material';

export default function CategoriesPage() {
  return (
    <Box>
      <Typography variant="h5" fontWeight={600} mb={3}>
        Categories
      </Typography>
      <Paper sx={{ p: 4 }}>
        <Typography color="text.secondary">
          Categories management UI — connect to /api/v1/categories endpoints.
        </Typography>
      </Paper>
    </Box>
  );
}
