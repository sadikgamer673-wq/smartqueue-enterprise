import { Grid, Card, CardContent, Typography, Box, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, List, ListItem, ListItemAvatar, Avatar, ListItemText, LinearProgress } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PeopleIcon from '@mui/icons-material/People';
import WarningIcon from '@mui/icons-material/Warning';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

const stats = [
  { 
    label: "Total Revenue", 
    value: '₹52,300', 
    trend: '+ 12.5%', 
    trendColor: '#16A34A',
    icon: <TrendingUpIcon />, 
    color: '#16A34A' 
  },
  { 
    label: 'Total Orders', 
    value: '320', 
    trend: '+ 8.3%', 
    trendColor: '#16A34A',
    icon: <ReceiptLongIcon />, 
    color: '#15803D' 
  },
  { 
    label: 'Total Customers', 
    value: '286', 
    trend: '+ 11.2%', 
    trendColor: '#16A34A',
    icon: <PeopleIcon />, 
    color: '#16A34A' 
  },
  { 
    label: 'Pending Verifications', 
    value: '5', 
    trend: '- 16.7%', 
    trendColor: '#EF4444',
    icon: <WarningIcon />, 
    color: '#EF4444' 
  },
];

const revenueChartData = {
  labels: ['7 May', '8 May', '9 May', '10 May', '11 May', '12 May', '13 May'],
  datasets: [
    {
      label: 'Revenue (₹)',
      data: [35000, 42000, 39000, 52300, 47000, 61000, 58000],
      borderColor: '#16A34A',
      backgroundColor: 'rgba(22, 163, 74, 0.1)',
      fill: true,
      tension: 0.4,
    },
  ],
};

const ordersTrendData = {
  labels: ['7 May', '8 May', '9 May', '10 May', '11 May', '12 May', '13 May'],
  datasets: [
    {
      label: 'Orders',
      data: [120, 150, 130, 180, 160, 220, 210],
      backgroundColor: '#16A34A',
      borderRadius: 6,
    },
  ],
};

const topSellingItems = [
  { name: 'Amul Milk', sales: 120, percent: 80, icon: '🥛' },
  { name: 'Rice 1kg', sales: 98, percent: 65, icon: '🌾' },
  { name: 'Britannia Bread', sales: 75, percent: 50, icon: '🍞' },
  { name: 'Aashirvaad Atta', sales: 60, percent: 40, icon: '🌾' },
];

const recentOrders = [
  { id: '#2156', customer: 'Rahul Sharma', amount: '₹141', items: 4, status: 'Completed', time: '2 mins ago' },
  { id: '#2155', customer: 'Priya Singh', amount: '₹856', items: 8, status: 'Completed', time: '5 mins ago' },
  { id: '#2154', customer: 'Amit Kumar', amount: '₹1,240', items: 12, status: 'Completed', time: '12 mins ago' },
  { id: '#2153', customer: 'Neha Patel', amount: '₹932', items: 6, status: 'Completed', time: '18 mins ago' },
  { id: '#2152', customer: 'Vikram Joshi', amount: '₹943', items: 9, status: 'Pending', time: '25 mins ago' },
];

const inventoryAlerts = [
  { name: 'Britannia Brown Bread', qty: '20 Left', status: 'Low Stock', color: '#F59E0B' },
  { name: 'Aashirvaad Atta 5kg', qty: '15 Left', status: 'Low Stock', color: '#F59E0B' },
  { name: 'Amul Curd 400g', qty: '30 Left', status: 'Low Stock', color: '#F59E0B' },
  { name: 'Sugar 1kg', qty: '0 Left', status: 'Out of Stock', color: '#EF4444' },
];

export default function DashboardPage() {
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

      {/* 4 Columns KPI stats cards row */}
      <Grid container spacing={3} mb={4}>
        {stats.map((stat) => (
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

        {/* Top Selling Items ranked list */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #E5E7EB', height: '100%' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="subtitle1" fontWeight={800}>Top Selling Items</Typography>
                <Typography variant="caption" color="primary" fontWeight={700} sx={{ cursor: 'pointer' }}>View All</Typography>
              </Box>
              <List disablePadding>
                {topSellingItems.map((item, idx) => (
                  <ListItem key={item.name} disableGutters sx={{ py: 1.5 }}>
                    <ListItemAvatar sx={{ minWidth: 48 }}>
                      <Avatar sx={{ bgcolor: 'grey.100', fontSize: 20 }}>{item.icon}</Avatar>
                    </ListItemAvatar>
                    <ListItemText 
                      primary={<Typography variant="body2" fontWeight={700}>{item.name}</Typography>}
                      secondary={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <LinearProgress variant="determinate" value={item.percent} color="primary" sx={{ flexGrow: 1, height: 4, borderRadius: 2 }} />
                        <Typography variant="caption" fontWeight={700}>{item.sales}</Typography>
                      </Box>}
                    />
                  </ListItem>
                ))}
              </List>
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
                <Typography variant="caption" color="primary" fontWeight={700} sx={{ cursor: 'pointer' }}>View All</Typography>
              </Box>
              <TableContainer component={Paper} elevation={0} sx={{ border: 'none' }}>
                <Table sx={{ minWidth: 600 }} aria-label="recent orders table">
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'grey.50' }}>
                      <TableCell sx={{ fontWeight: 700, fontSize: 12 }}>Order ID</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: 12 }}>Customer</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: 12 }}>Amount</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: 12 }}>Items</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: 12 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: 12 }}>Time</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentOrders.map((row) => (
                      <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell sx={{ fontWeight: 700, fontSize: 13 }}>{row.id}</TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: 13, color: 'text.secondary' }}>{row.customer}</TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: 13 }}>{row.amount}</TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: 13 }}>{row.items}</TableCell>
                        <TableCell>
                          <Chip 
                            label={row.status} 
                            size="small" 
                            sx={{ 
                              bgcolor: row.status === 'Completed' ? '#E8F5E9' : '#FFF3E0', 
                              color: row.status === 'Completed' ? '#2E7D32' : '#E65100',
                              fontWeight: 700,
                              fontSize: 11
                            }} 
                          />
                        </TableCell>
                        <TableCell sx={{ fontSize: 12, color: 'text.secondary' }}>{row.time}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Inventory alerts + mini analytics overview bar chart */}
        <Grid item xs={12} md={4}>
          <Grid container spacing={3}>
            {/* Inventory Alerts panel */}
            <Grid item xs={12}>
              <Card sx={{ borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #E5E7EB' }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="subtitle1" fontWeight={800}>Inventory Alerts</Typography>
                    <Typography variant="caption" color="primary" fontWeight={700} sx={{ cursor: 'pointer' }}>View All</Typography>
                  </Box>
                  <List disablePadding>
                    {inventoryAlerts.map((item) => (
                      <ListItem 
                        key={item.name} 
                        disableGutters 
                        sx={{ py: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                      >
                        <Box>
                          <Typography variant="body2" fontWeight={700}>{item.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{item.qty}</Typography>
                        </Box>
                        <Chip 
                          label={item.status} 
                          size="small" 
                          sx={{ 
                            bgcolor: `${item.color}15`, 
                            color: item.color,
                            fontWeight: 800,
                            fontSize: 10
                          }} 
                        />
                      </ListItem>
                    ))}
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
