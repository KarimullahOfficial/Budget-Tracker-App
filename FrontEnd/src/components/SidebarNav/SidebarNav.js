import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faWallet, faDollarSign } from '@fortawesome/free-solid-svg-icons';
  import './sidebar.css'

function SidebarNav() {
  return (
    <Nav className="flex-column fixed sidebar">
      <Link to="/dashboard">
      <h4 style={{ textAlign: 'center' }}>Welcome</h4>

      </Link>
      <Nav.Link as={Link} to="/dashboard" className="nav-link">
        <FontAwesomeIcon icon={faHome} className="nav-icon" /> Dashboard
      </Nav.Link>
      <Nav.Link as={Link} to="/incomes" className="nav-link">
        <FontAwesomeIcon icon={faDollarSign} className="nav-icon" /> Incomes
      </Nav.Link>
      <Nav.Link as={Link} to="/expenses" className="nav-link">
        <FontAwesomeIcon icon={faWallet} className="nav-icon" /> Expenses
      </Nav.Link>
      {/* Exit Link */}
      <Nav.Link as={Link} to="/signout" className="nav-link exit-link">
        Sign Out
      </Nav.Link>
    </Nav>
  );
}

export default SidebarNav;
