import { useState, useEffect } from 'react';
import { Grid, Card, CardContent, Typography, Box, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, List, ListItem, ListItemAvatar, Avatar, ListItemText, LinearProgress, CircularProgress, Stack } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PeopleIcon from '@mui/icons-material/People';
import WarningIcon from '@mui/icons-material/Warning';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { analyticsApi, orderApi, inventoryApi } from '../../api/services';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [inventoryAlerts, setInventoryAlerts] = useState<any[]>([]);
  const [revenueChart, setRevenueChart] = useState<any[]>([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [stats, orders, alerts, revChart] = await Promise.all([
          analyticsApi.dashboard(),
          orderApi.getAdmin({ limit: 5 }),
          inventoryApi.getLowStock(),
          analyticsApi.revenue(7)
        ]);

        setStatsData(stats);
        setRecentOrders(orders?.orders || (Array.isArray(orders) ? orders : []));
        setInventoryAlerts(alerts || []);
        setRevenueChart(revChart || []);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  const kpis = [
    { 
      label: "Total Revenue", 
      value: `₹${statsData?.revenue?.total?.toLocaleString('en-IN') || 0}`, 
      trend: 'Today', 
      trendColor: '#16A34A',
      icon: <TrendingUpIcon />, 
      color: '#16A34A' 
    },
    { 
      label: 'Total Orders', 
      value: statsData?.orders?.total || 0, 
      trend: `${statsData?.orders?.today || 0} Today`, 
      trendColor: '#16A34A',
      icon: <ReceiptLongIcon />, 
      color: '#15803D' 
    },
    { 
      label: 'Total Customers', 
      value: statsData?.customers?.total || 0, 
      trend: 'Active', 
      trendColor: '#16A34A',
      icon: <PeopleIcon />, 
      color: '#16A34A' 
    },
    { 
      label: 'Pending Orders', 
      value: statsData?.orders?.pending || 0, 
      trend: 'Verification', 
      trendColor: '#EF4444',
      icon: <WarningIcon />, 
      color: '#EF4444' 
    },
  ];

  // Helper to map dynamic revenue chart data
  const revenueChartData = {
    labels: revenueChart.length > 0 ? revenueChart.map(item => item.date || item._id) : ['No Data'],
    datasets: [
      {
        label: 'Revenue (₹)',
        data: revenueChart.length > 0 ? revenueChart.map(item => item.totalRevenue || item.amount) : [0],
        borderColor: '#16A34A',
        backgroundColor: 'rgba(22, 163, 74, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const ordersTrendData = {
    labels: revenueChart.length > 0 ? revenueChart.map(item => item.date || item._id) : ['No Data'],
    datasets: [
      {
        label: 'Orders',
        data: revenueChart.length > 0 ? revenueChart.map(item => item.totalOrders || item.count) : [0],
        backgroundColor: '#16A34A',
        borderRadius: 6,
      },
    ],
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Title block */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight={800} color="text.primary">
          Store Operations
        </Typography>
        <Chip 
          label="Live Store Sync Active" 
          color="success" 
          size="medium" 
          variant="outlined" 
          sx={{ fontWeight: 700, borderWidth: 1.5 }} 
        />
      </Box>

      {/* KPI stats cards row */}
      <Grid container spacing={3} mb={4}>
        {kpis.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.label}>
            <Card sx={{ 
              borderRadius: 4, 
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)', 
              border: '1px solid #E5E7EB',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-2px)' }
            }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box sx={{ bgcolor: `${stat.color}12`, color: stat.color, p: 1.5, borderRadius: 3, display: 'flex' }}>
                    {stat.icon}
                  </Box>
                  <Typography variant="caption" sx={{ color: stat.trendColor, bgcolor: `${stat.trendColor}10`, px: 1.2, py: 0.6, borderRadius: 1.5, fontWeight: 800 }}>
                    {stat.trend}
                  </Typography>
                </Box>
                <Box mt={3}>
                  <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>{stat.label}</Typography>
                  <Typography variant="h4" fontWeight={800} mt={0.5}>{stat.value}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Main analytics panels */}
      <Grid container spacing={3} mb={4}>
        {/* Revenue Overview chart */}
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #E5E7EB' }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={800} mb={3}>Revenue Overview</Typography>
              <Box height={300}>
                <Line data={revenueChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Info panel */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #E5E7EB', height: '100%' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="subtitle1" fontWeight={800}>Self-Checkout Summary</Typography>
              </Box>
              <Stack spacing={2} sx={{ mt: 3 }}>
                <Box sx={{ p: 2, bgcolor: 'background.neutral', borderRadius: 2 }}>
                  <Typography variant="subtitle2" fontWeight={700}>System Load</Typography>
                  <Typography variant="body2" color="text.secondary">Optimal</Typography>
                </Box>
                <Box sx={{ p: 2, bgcolor: 'background.neutral', borderRadius: 2 }}>
                  <Typography variant="subtitle2" fontWeight={700}>Database Status</Typography>
                  <Typography variant="body2" color="success.main" fontWeight={600}>Connected</Typography>
                </Box>
                <Box sx={{ p: 2, bgcolor: 'background.neutral', borderRadius: 2 }}>
                  <Typography variant="subtitle2" fontWeight={700}>Gateway Status</Typography>
                  <Typography variant="body2" color="success.main" fontWeight={600}>Online</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Table grid and alerts row */}
      <Grid container spacing={3}>
        {/* Recent Orders table */}
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #E5E7EB' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="subtitle1" fontWeight={800}>Recent Orders</Typography>
              </Box>
              <TableContainer component={Paper} elevation={0} sx={{ border: 'none' }}>
                <Table sx={{ minWidth: 600 }}>
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'grey.50' }}>
                      <TableCell sx={{ fontWeight: 700, fontSize: 12 }}>Order ID</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: 12 }}>Customer</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: 12 }}>Amount</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: 12 }}>Items Count</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: 12 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: 12 }}>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                          <Typography color="text.secondary">No recent checkout orders</Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      recentOrders.map((row) => (
                        <TableRow key={row._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                          <TableCell sx={{ fontWeight: 700, fontSize: 13 }}>{row.orderNumber}</TableCell>
                          <TableCell sx={{ fontWeight: 600, fontSize: 13, color: 'text.secondary' }}>{row.userId?.name || 'Shopper'}</TableCell>
                          <TableCell sx={{ fontWeight: 700, fontSize: 13 }}>₹{row.total}</TableCell>
                          <TableCell sx={{ fontWeight: 600, fontSize: 13 }}>{row.items?.length || 0}</TableCell>
                          <TableCell>
                            <Chip 
                              label={row.status} 
                              size="small" 
                              sx={{ 
                                bgcolor: row.status === 'paid' ? '#E8F5E9' : '#FFF3E0', 
                                color: row.status === 'paid' ? '#2E7D32' : '#E65100',
                                fontWeight: 700,
                                fontSize: 11
                              }} 
                            />
                          </TableCell>
                          <TableCell sx={{ fontSize: 12, color: 'text.secondary' }}>{new Date(row.createdAt).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Inventory alerts */}
        <Grid item xs={12} md={4}>
          <Grid container spacing={3}>
            {/* Inventory Alerts panel */}
            <Grid item xs={12}>
              <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #E5E7EB' }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="subtitle1" fontWeight={800}>Inventory Alerts</Typography>
                  </Box>
                  <List disablePadding>
                    {inventoryAlerts.length === 0 ? (
                      <Typography color="text.secondary" sx={{ py: 2 }} align="center">All items well-stocked</Typography>
                    ) : (
                      inventoryAlerts.map((item) => (
                        <ListItem 
                          key={item._id} 
                          disableGutters 
                          sx={{ py: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                        >
                          <Box>
                            <Typography variant="body2" fontWeight={700}>{item.productId?.name || 'Item'}</Typography>
                            <Typography variant="caption" color="text.secondary">{item.quantity} units left</Typography>
                          </Box>
                          <Chip 
                            label={item.quantity === 0 ? 'Out of Stock' : 'Low Stock'} 
                            size="small" 
                            sx={{ 
                              bgcolor: item.quantity === 0 ? '#FFEBEE' : '#FFF3E0', 
                              color: item.quantity === 0 ? '#C62828' : '#EF6C00',
                              fontWeight: 800,
                              fontSize: 10
                            }} 
                          />
                        </ListItem>
                      ))
                    )}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* Orders Trend bar chart */}
            <Grid item xs={12}>
              <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #E5E7EB' }}>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight={800} mb={2}>Orders Trend</Typography>
                  <Box height={150}>
                    <Bar data={ordersTrendData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
