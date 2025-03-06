import React from "react";
import { Home, Inbox, MessageCircle, FilePlus, FileText, LayoutDashboard, MoreHorizontal, Grid, BarChart } from "lucide-react";
import "./Nav.css";

const Nav = () => {
  const userId = localStorage.getItem("id_utilisateur");

  if (!userId) {
    return null;
  }



  return (
    <nav className="nav">
      <div className="navbar-brand">
        <a href="#">
          <img src="/ormvad_1.jpg" alt="Logo" className="logo" />
        </a>
      </div>
      <ul>
        <li><a href="/projet"><Home size={20} /> <span>Home</span></a></li>
        <li><a href="/dashboard"><BarChart size={20} /> <span>Dashboard</span></a></li>
        <li><a href="/list"><Inbox size={20} /> <span>Liste</span></a></li>
        <li><a href="/board"><Grid size={20} /> <span>Board</span></a></li>
        <li><a href="/chat"><MessageCircle size={20} /> <span>Chat</span></a></li>
        <li><a href="#"><FilePlus size={20} /> <span>Create Doc</span></a></li>
        <li><a href="#"><FileText size={20} /> <span>Docs</span></a></li>
        <li><a href="#"><LayoutDashboard size={20} /> <span>Create Dashboard</span></a></li>
        <li><a href="#"><LayoutDashboard size={20} /> <span>Dashboards</span></a></li>
        <li><a href="#"><MoreHorizontal size={20} /> <span>More</span></a></li>
      </ul>
    </nav>
  );
};

export default Nav;
