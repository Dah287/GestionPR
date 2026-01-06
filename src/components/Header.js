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

//         {role === "admin" && (
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
//       {role === "admin" && (    <li><a href="/projet"><Home size={20} /> <span>Projets</span></a></li>)}
//         {role === "user" && (   <li><a href="/MesTaches"><BarChart size={20} /> <span>Mes Taches</span></a></li>)}
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
import { useNavigate ,useLocation} from "react-router-dom";
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
  ListItemIcon, 
  ListItemText,
  InputBase,
  useTheme ,
  ListItemButton,
  } from "@mui/material";
  import {
  Assignment,
  InsertChart,
  GridView,
  Chat,
  Person,
} from "@mui/icons-material";
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
import useAutoLogout from "./useAutoLogout";

const Header = () => {
    useAutoLogout();
  const navigate = useNavigate();
  const userId = localStorage.getItem("id_utilisateur");
  const role = localStorage.getItem("role_utilisateur");
const userName = localStorage.getItem("nom_utilisateur") || "Utilisateur"; // Fallback si absent
  const [drawerOpen, setDrawerOpen] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);


  const theme = useTheme();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;


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
          {/* Conteneur : Avatar + Nom */}
<Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
  <Typography variant="body1" sx={{ color: 'white', mr: 1, fontWeight: 'medium' }}>
    {userName}
  </Typography>

</Box>
          {role === "admin" && (
            <IconButton color="inherit" onClick={handleUser} sx={{ mr: 1 }}>
              <PeopleIcon />
            </IconButton>
          )}
          
{/* Icône Notifications */}
<IconButton 
  color="inherit"
  sx={{ 
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    '&:hover': { backgroundColor: '#1565c0' }
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
          width: drawerOpen ? 170 : 0,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerOpen ? 170 : 0,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar /> {/* Espace pour la barre d'appbar */}
<Box
      sx={{
        height: "100%",
        overflow: "auto",
        px: 1,
        py: 2,
        backgroundColor: theme.palette.mode === "light" ? "#f9f9fb" : "#1e1e1e",
        borderRight: `1px solid ${theme.palette.divider}`,
      }}
    >
      <List sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>

        {/* Projets */}
        <ListItemButton
          onClick={() => navigate("/projet")}
          sx={{
            borderRadius: 2,
            py: 1.2,
            px: 2,
            backgroundColor: isActive("/projet")
              ? theme.palette.primary.main
              : "transparent",
            color: isActive("/projet")
              ? theme.palette.primary.contrastText
              : theme.palette.text.primary,
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: isActive("/projet")
                ? theme.palette.primary.main
                : theme.palette.action.hover,
              transform: "translateX(4px)",
            },
          }}
        >
          <ListItemIcon
            sx={{
              color: isActive("/projet")
                ? theme.palette.primary.contrastText
                : theme.palette.text.secondary,
              minWidth: 40,
            }}
          >
            <Home />
          </ListItemIcon>
          <ListItemText
            primary="Projets"
            primaryTypographyProps={{
              fontSize: "0.95rem",
              fontWeight: isActive("/projet") ? 600 : 500,
            }}
          />
        </ListItemButton>

        {/* Tâches affectées */}
        <ListItemButton
          onClick={() => navigate("/MesTaches")}
          sx={{
            borderRadius: 2,
            py: 1.2,
            px: 2,
            backgroundColor: isActive("/MesTaches")
              ? theme.palette.primary.main
              : "transparent",
            color: isActive("/MesTaches")
              ? theme.palette.primary.contrastText
              : theme.palette.text.primary,
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: isActive("/MesTaches")
                ? theme.palette.primary.main
                : theme.palette.action.hover,
              transform: "translateX(4px)",
            },
          }}
        >
          <ListItemIcon
            sx={{
              color: isActive("/MesTaches")
                ? theme.palette.primary.contrastText
                : theme.palette.text.secondary,
              minWidth: 40,
            }}
          >
            <Assignment />
          </ListItemIcon>
          <ListItemText
            primary="Tâches affectées"
            primaryTypographyProps={{
              fontSize: "0.95rem",
              fontWeight: isActive("/MesTaches") ? 600 : 500,
            }}
          />
        </ListItemButton>

        {/* Dashboard */}
        <ListItemButton
          onClick={() => navigate("/dashboard")}
          sx={{
            borderRadius: 2,
            py: 1.2,
            px: 2,
            backgroundColor: isActive("/dashboard")
              ? theme.palette.primary.main
              : "transparent",
            color: isActive("/dashboard")
              ? theme.palette.primary.contrastText
              : theme.palette.text.primary,
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: isActive("/dashboard")
                ? theme.palette.primary.main
                : theme.palette.action.hover,
              transform: "translateX(4px)",
            },
          }}
        >
          <ListItemIcon
            sx={{
              color: isActive("/dashboard")
                ? theme.palette.primary.contrastText
                : theme.palette.text.secondary,
              minWidth: 40,
            }}
          >
            <InsertChart />
          </ListItemIcon>
          <ListItemText
            primary="Dashboard"
            primaryTypographyProps={{
              fontSize: "0.95rem",
              fontWeight: isActive("/dashboard") ? 600 : 500,
            }}
          />
        </ListItemButton>

        {/* Tâches */}
        <ListItemButton
          onClick={() => navigate("/listfiltre")}
          sx={{
            borderRadius: 2,
            py: 1.2,
            px: 2,
            backgroundColor: isActive("/listfiltre")
              ? theme.palette.primary.main
              : "transparent",
            color: isActive("/listfiltre")
              ? theme.palette.primary.contrastText
              : theme.palette.text.primary,
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: isActive("/listfiltre")
                ? theme.palette.primary.main
                : theme.palette.action.hover,
              transform: "translateX(4px)",
            },
          }}
        >
          <ListItemIcon
            sx={{
              color: isActive("/listfiltre")
                ? theme.palette.primary.contrastText
                : theme.palette.text.secondary,
              minWidth: 40,
            }}
          >
            <Inbox />
          </ListItemIcon>
          <ListItemText
            primary="Tâches"
            primaryTypographyProps={{
              fontSize: "0.95rem",
              fontWeight: isActive("/listfiltre") ? 600 : 500,
            }}
          />
        </ListItemButton>

        {/* Board */}
        <ListItemButton
          onClick={() => navigate("/board")}
          sx={{
            borderRadius: 2,
            py: 1.2,
            px: 2,
            backgroundColor: isActive("/board")
              ? theme.palette.primary.main
              : "transparent",
            color: isActive("/board")
              ? theme.palette.primary.contrastText
              : theme.palette.text.primary,
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: isActive("/board")
                ? theme.palette.primary.main
                : theme.palette.action.hover,
              transform: "translateX(4px)",
            },
          }}
        >
          <ListItemIcon
            sx={{
              color: isActive("/board")
                ? theme.palette.primary.contrastText
                : theme.palette.text.secondary,
              minWidth: 40,
            }}
          >
            <GridView />
          </ListItemIcon>
          <ListItemText
            primary="Board"
            primaryTypographyProps={{
              fontSize: "0.95rem",
              fontWeight: isActive("/board") ? 600 : 500,
            }}
          />
        </ListItemButton>

        {/* Chat */}
        <ListItemButton
          onClick={() => navigate("/chat")}
          sx={{
            borderRadius: 2,
            py: 1.2,
            px: 2,
            backgroundColor: isActive("/chat")
              ? theme.palette.primary.main
              : "transparent",
            color: isActive("/chat")
              ? theme.palette.primary.contrastText
              : theme.palette.text.primary,
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: isActive("/chat")
                ? theme.palette.primary.main
                : theme.palette.action.hover,
              transform: "translateX(4px)",
            },
          }}
        >
          <ListItemIcon
            sx={{
              color: isActive("/chat")
                ? theme.palette.primary.contrastText
                : theme.palette.text.secondary,
              minWidth: 40,
            }}
          >
            <Chat />
          </ListItemIcon>
          <ListItemText
            primary="Chat"
            primaryTypographyProps={{
              fontSize: "0.95rem",
              fontWeight: isActive("/chat") ? 600 : 500,
            }}
          />
        </ListItemButton>

        {/* Utilisateur (admin uniquement) */}
        {role === "admin" && (
          <ListItemButton
            onClick={() => navigate("/user")}
            sx={{
              borderRadius: 2,
              py: 1.2,
              px: 2,
              backgroundColor: isActive("/user")
                ? theme.palette.primary.main
                : "transparent",
              color: isActive("/user")
                ? theme.palette.primary.contrastText
                : theme.palette.text.primary,
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: isActive("/user")
                  ? theme.palette.primary.main
                  : theme.palette.action.hover,
                transform: "translateX(4px)",
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: isActive("/user")
                  ? theme.palette.primary.contrastText
                  : theme.palette.text.secondary,
                minWidth: 40,
              }}
            >
              <Person />
            </ListItemIcon>
            <ListItemText
              primary="Utilisateur"
              primaryTypographyProps={{
                fontSize: "0.95rem",
                fontWeight: isActive("/user") ? 600 : 500,
              }}
            />
          </ListItemButton>
        )}

        {/* Paramètre */}
        <ListItemButton
          onClick={() => navigate("/settings")}
          sx={{
            borderRadius: 2,
            py: 1.2,
            px: 2,
            backgroundColor: isActive("/settings")
              ? theme.palette.primary.main
              : "transparent",
            color: isActive("/settings")
              ? theme.palette.primary.contrastText
              : theme.palette.text.primary,
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: isActive("/settings")
                ? theme.palette.primary.main
                : theme.palette.action.hover,
              transform: "translateX(4px)",
            },
          }}
        >
          <ListItemIcon
            sx={{
              color: isActive("/settings")
                ? theme.palette.primary.contrastText
                : theme.palette.text.secondary,
              minWidth: 40,
            }}
          >
            <Settings />
          </ListItemIcon>
          <ListItemText
            primary="Paramètre"
            primaryTypographyProps={{
              fontSize: "0.95rem",
              fontWeight: isActive("/settings") ? 600 : 500,
            }}
          />
        </ListItemButton>
        {/* Marchés */}
<ListItemButton
  onClick={() => navigate("/marches")}
  sx={{
    borderRadius: 2,
    py: 1.2,
    px: 2,
    backgroundColor: isActive("/marches")
      ? theme.palette.primary.main
      : "transparent",
    color: isActive("/marches")
      ? theme.palette.primary.contrastText
      : theme.palette.text.primary,
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: isActive("/marches")
        ? theme.palette.primary.main
        : theme.palette.action.hover,
      transform: "translateX(4px)",
    },
  }}
>
  <ListItemIcon
    sx={{
      color: isActive("/marches")
        ? theme.palette.primary.contrastText
        : theme.palette.text.secondary,
      minWidth: 40,
    }}
  >
    <FileText />
  </ListItemIcon>
  <ListItemText
    primary="Marchés(1)"
    primaryTypographyProps={{
      fontSize: "0.95rem",
      fontWeight: isActive("/marches") ? 600 : 500,
    }}
  />
</ListItemButton>

{/* Marchés 1 */}
<ListItemButton
  onClick={() => navigate("/marches2")}
  sx={{
    borderRadius: 2,
    py: 1.2,
    px: 2,
    backgroundColor: isActive("/marches2")
      ? theme.palette.primary.main
      : "transparent",
    color: isActive("/marches2")
      ? theme.palette.primary.contrastText
      : theme.palette.text.primary,
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: isActive("/marches2")
        ? theme.palette.primary.main
        : theme.palette.action.hover,
      transform: "translateX(4px)",
    },
  }}
>
  <ListItemIcon
    sx={{
      color: isActive("/marches2")
        ? theme.palette.primary.contrastText
        : theme.palette.text.secondary,
      minWidth: 40,
    }}
  >
    <FilePlus />
  </ListItemIcon>
  <ListItemText
    primary="Marchés(2)"
    primaryTypographyProps={{
      fontSize: "0.95rem",
      fontWeight: isActive("/marches2") ? 600 : 500,
    }}
  />
</ListItemButton>

      </List>
    </Box>
      </Drawer>
    </>
  );
};

export default Header;