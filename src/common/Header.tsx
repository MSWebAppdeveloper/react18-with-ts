import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();

  return (
    <>
      <div className="container-fluid">
        <header className="d-flex justify-content-center align-items-center mt-3">
          <nav>
            <ul className="nav nav-pills justify-content-between">
              <li className={`nav-item me-2 ${location.pathname === '/' && 'active'}`}>
                <Link to="/" className="btn btn-outline-primary" aria-current="page">
                  Home
                </Link>
              </li>
              <li className={`nav-item me-2 ${location.pathname === '/about' && 'active'}`}>
                <Link to="/about" className="btn btn-outline-primary">
                  About
                </Link>
              </li>
              <li className={`nav-item ${location.pathname === '/error' && 'active'}`}>
                <Link to="/error" className="btn btn-outline-primary">
                  Error Page
                </Link>
              </li>
            </ul>
          </nav>
        </header>
      </div>
      <hr className="border border-secondary border-2 opacity-50" />
    </>
  );
};

export default Header;
