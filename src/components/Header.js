// import React from "react";
// import { Search, LogOut, Settings,User } from "lucide-react"; // Icônes
// import { useNavigate } from "react-router-dom";
// import "./Header.css";
// import { Home, Inbox, MessageCircle, FilePlus, FileText, LayoutDashboard, MoreHorizontal, Grid, BarChart } from "lucide-react";
// import "./Nav.css";

// const Header = () => {
//   const navigate = useNavigate();
//   const userId = localStorage.getItem("id_utilisateur"); // Vérifie si l'utilisateur est connecté
//   const role = localStorage.getItem("role_utilisateur");
//   // Fonction de déconnexion
//   const handleLogout = () => {
//     // Supprimer l'ID utilisateur du localStorage
//     localStorage.clear();
   
//     // Rediriger vers la page de connexion
//     navigate("/");
  
//     // Rafraîchir la page pour que tout soit réinitialisé (comme un refresh)
  
//   };
//   const handUser = () => {
//     // Supprimer l'ID utilisateur du localStorage
   
   
//     // Rediriger vers la page de connexion
//     navigate("/user");
  
//     // Rafraîchir la page pour que tout soit réinitialisé (comme un refresh)
  
//   };
  

//   // Ne pas afficher le header si l'utilisateur n'est pas connecté
//   if (!userId) {
//     return null;
//   }

//   return (
//     <>
//     <header className="header">
//       <div className="header-container">
//         {/* Barre de recherche */}
//         <div className="search-bar">
//           <Search className="search-icon" size={18} />
//           <input type="text" placeholder="Rechercher..." />
//         </div>

//         {/* Boutons de navigation */}

//         {role === "Chef de projet" && (
//         <button className="header-btn mm" onClick={handUser}>
//           Gérer les utilisateurs
//         </button>
//       )}
//         {/* Bouton de déconnexion */}
//         <button className="logout-btn" onClick={handleLogout}>
//           <LogOut size={22} /> Déconnexion
//         </button>
//       </div>
//     </header>
//     <nav className="nav">
//       <div className="navbar-brand">
//         <a href="#">
//           <img src="/ormvad_1.jpg" alt="Logo" className="logo" />
//         </a>
//       </div>
//       <ul>
//       {role === "Chef de projet" && (    <li><a href="/projet"><Home size={20} /> <span>Projets</span></a></li>)}
//         {role === "Utilisateur Normal" && (   <li><a href="/MesTaches"><BarChart size={20} /> <span>Mes Taches</span></a></li>)}
//         <li><a href="/dashboard"><BarChart size={20} /> <span>Dashboard</span></a></li>
//         <li><a href="/listFiltre"><Inbox size={20} /> <span>Taches</span></a></li>
//         <li><a href="/board"><Grid size={20} /> <span>Board</span></a></li>
//         <li><a href="/chat"><MessageCircle size={20} /> <span>Chat</span></a></li>
//         <li><a href="/user"><User size={20} /> <span>Utilisateur</span></a></li>
//         <li><a href="#"><Settings size={20} /> <span>Paramétre</span></a></li>

//       </ul>
//     </nav>
//     </>
//   );
// };

//  export default Header;




import React from "react";
import { Search, LogOut, Home, Inbox, MessageCircle, Settings, User, FilePlus, FileText, LayoutDashboard, MoreHorizontal, Grid, BarChart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { 
  AppBar, 
  Toolbar, 
  IconButton, 
  Typography, 
  Avatar, 
  Menu, 
  MenuItem, 
  Drawer, 
  Box, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  InputBase
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ChatIcon from '@mui/icons-material/Chat';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import PostAddIcon from '@mui/icons-material/PostAdd';
import DescriptionIcon from '@mui/icons-material/Description';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const Header = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("id_utilisateur");
  const role = localStorage.getItem("role_utilisateur");
  const [drawerOpen, setDrawerOpen] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleLogout = () => {
      localStorage.clear();
    navigate("/");
  };

  const handleUser = () => {
    navigate("/user");
  };

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  if (!userId) {
    return null;
  }

  return (
    <>
      {/* Barre de navigation principale */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => setDrawerOpen(!drawerOpen)}>
            <MenuIcon />
          </IconButton>
          
          {/* Barre de recherche */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            backgroundColor: 'rgba(255, 255, 255, 0.15)', 
            borderRadius: 1, 
            px: 1,
            mx: 2,
            width: 300
          }}>
            <Search sx={{ mr: 1 }} />
            <InputBase
              placeholder="Rechercher..."
              sx={{ color: 'inherit', width: '100%' }}
              inputProps={{ 'aria-label': 'search' }}
            />
          </Box>
          
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ORMVAD-Gestion De Projet
          </Typography>
          
          {role === "Chef de projet" && (
            <IconButton color="inherit" onClick={handleUser} sx={{ mr: 1 }}>
              <PeopleIcon />
            </IconButton>
          )}
          
          <IconButton 
  color="inherit"
  sx={{ 
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    '&:hover': {
      backgroundColor: '#1565c0' // Une teinte légèrement plus foncée au survol
    }
  }}
>
  <NotificationsIcon />
</IconButton>

<IconButton 
  onClick={handleAvatarClick} 
  color="inherit"
  sx={{ 
    marginLeft: 2, 
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    '&:hover': {
      backgroundColor: '#1565c0'
    }
  }}
>
  <Avatar />
</IconButton>
          
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleLogout}>
              <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
              Déconnexion
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      
      {/* Menu latéral */}
      <Drawer
        variant="persistent"
        open={drawerOpen}
        sx={{
          width: drawerOpen ? 240 : 0,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerOpen ? 240 : 0,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar /> {/* Espace pour la barre d'appbar */}
        <Box sx={{ overflow: 'auto' }}>
          <List>
          {role === "Chef de projet" && (
            <ListItem button onClick={() => navigate("/projet")}>
              <ListItemIcon><Home /></ListItemIcon>
              <ListItemText primary="Projets" />
            </ListItem>
            )}

            {role === "Utilisateur Normal" && (
              <ListItem button onClick={() => navigate("/MesTaches")}>
                <ListItemIcon><AssignmentIcon /></ListItemIcon>
                <ListItemText primary="Mes Taches" />
              </ListItem>
            )}
            
            <ListItem button onClick={() => navigate("/dashboard")}>
              <ListItemIcon><InsertChartIcon /></ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
            
            <ListItem button onClick={() => navigate("/listfiltre")}>
              <ListItemIcon><Inbox /></ListItemIcon>
              <ListItemText primary="Taches" />
            </ListItem>
            
            <ListItem button onClick={() => navigate("/board")}>
              <ListItemIcon><Grid /></ListItemIcon>
              <ListItemText primary="Board" />
            </ListItem>
            
            <ListItem button onClick={() => navigate("/chat")}>
              <ListItemIcon><ChatIcon /></ListItemIcon>
              <ListItemText primary="Chat" />
            </ListItem>
            
            {role === "Chef de projet" && (
            <ListItem button onClick={() => navigate("/user")}>
              <ListItemIcon><User /></ListItemIcon>
              <ListItemText primary="Utilisateur" />
            </ListItem>
            )}

            <ListItem button onClick={() => navigate("/settings")}>
              <ListItemIcon><Settings /></ListItemIcon>
              <ListItemText primary="Paramètre" />
            </ListItem>
            

          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Header;