import React from 'react';
import { Link } from 'react-router-dom';
const Header: React.FC = () => {
    return (
        <>
            <div className="container">
                <header className="d-flex justify-content-center mt-2">
                    <ul className="nav nav-pills gap-3">
                        <li className="nav-item"><Link to="/" className="nav-link active" aria-current="page">Home</Link></li>
                        <li className="nav-item"><Link to="/About" className="nav-link active" aria-current="page">About</Link></li>
                        <li className="nav-item"><Link to="/Error" className="nav-link active" aria-current="page">Error Page</Link></li>
                        <li className="nav-item"><Link to="/AddUser" className="nav-link active" aria-current="page">Add Page</Link></li>
                    </ul>
                </header>
            </div>
            <hr className="border border-secondary border-2 opacity-50" />
        </>
    );
}
export default Header;