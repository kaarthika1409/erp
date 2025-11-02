import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiLogOut, FiHome, FiUsers, FiBook, FiBarChart2, FiBell, FiCalendar } from 'react-icons/fi';
import './Sidebar.css';

const Sidebar = ({ role, menuItems }) => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>ERP System</h2>
      </div>
      <nav className="sidebar-nav">
        <ul>
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link to={item.path} className="nav-link">
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <button onClick={handleLogout} className="logout-btn">
        <FiLogOut />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default Sidebar;