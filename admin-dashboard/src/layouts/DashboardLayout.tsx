import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Drawer, AppBar, Toolbar, List, ListItemButton, ListItemIcon, ListItemText,
  Typography, IconButton, Avatar, Menu, MenuItem, Divider,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory2';
import CategoryIcon from '@mui/icons-material/Category';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PeopleIcon from '@mui/icons-material/People';
import BadgeIcon from '@mui/icons-material/Badge';
import PaymentIcon from '@mui/icons-material/Payment';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import BarChartIcon from '@mui/icons-material/BarChart';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { logout } from '../redux/slices/authSlice';

const DRAWER_WIDTH = 260;

const navItems = [
  { label: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { label: 'Orders', icon: <ReceiptIcon />, path: '/orders' },
  { label: 'Customers', icon: <PeopleIcon />, path: '/customers' },
  { label: 'Inventory', icon: <WarehouseIcon />, path: '/inventory' },
  { label: 'Analytics', icon: <BarChartIcon />, path: '/analytics' },
  { label: 'Reports', icon: <AssessmentIcon />, path: '/reports' },
  { label: 'Settings', icon: <SettingsIcon />, path: '/settings' },
];

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: `calc(100% - ${DRAWER_WIDTH}px)`,
          ml: `${DRAWER_WIDTH}px`,
          bgcolor: 'background.paper',
          color: 'text.primary',
          borderBottom: '1px solid #E5E7EB',
        }}
      >
        <Toolbar sx={{ justifyContent: 'flex-end' }}>
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
            <Avatar sx={{ width: 34, height: 34, bgcolor: 'primary.main' }}>
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </Avatar>
          </IconButton>
          <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)}>
            <MenuItem disabled>{user?.email}</MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box', border: 'none', bgcolor: '#0F1115' },
        }}
      >
        <Toolbar sx={{ px: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography variant="h5" fontWeight={800} color="primary.main">
            SmartQueue
          </Typography>
        </Toolbar>
        <List sx={{ px: 1.5, display: 'flex', flexDirection: 'column', height: 'calc(100% - 64px)' }}>
          <Box sx={{ flexGrow: 1 }}>
            {navItems.map((item) => {
              const selected = location.pathname === item.path;
              return (
                <ListItemButton
                  key={item.path}
                  selected={selected}
                  onClick={() => navigate(item.path)}
                  sx={{
                    borderRadius: 2,
                    mb: 0.5,
                    color: selected ? 'white' : '#9CA3AF',
                    bgcolor: selected ? 'primary.main' : 'transparent',
                    '&:hover': { bgcolor: selected ? 'primary.main' : 'rgba(255,255,255,0.05)' },
                    '&.Mui-selected': { bgcolor: 'primary.main' },
                  }}
                >
                  <ListItemIcon sx={{ color: 'inherit', minWidth: 38 }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: 14, fontWeight: 600 }} />
                </ListItemButton>
              );
            })}
          </Box>

          <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', my: 2 }} />

          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 2,
              mb: 2,
              color: '#EF4444',
              '&:hover': { bgcolor: 'rgba(239,68,68,0.08)' },
            }}
          >
            <ListItemIcon sx={{ color: 'inherit', minWidth: 38 }}><LogoutIcon /></ListItemIcon>
            <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: 14, fontWeight: 600 }} />
          </ListItemButton>
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 4, ml: `${DRAWER_WIDTH}px`, mt: 8, bgcolor: 'background.default', minHeight: '100vh' }}>
        <Outlet />
      </Box>
    </Box>
  );
}
