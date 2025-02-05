import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Import Bootstrap Icons
import '/styles/navbar.css';

const Navbar = () => {
    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">Betterversion</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavDropdown">
                    <ul className="navbar-nav ms-auto d-flex align-items-center">
    <li className="nav-item">
        <Link className="nav-link" to="/login">Login</Link>
    </li>
    <li className="nav-item">
        <Link className="nav-link" to="/signup">Sign-up</Link>
    </li>
    <li className="nav-item dropdown">
        <a className="nav-link d-flex align-items-center" href="#" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            <i className="bi bi-list"></i> {/* Bootstrap icon */}
        </a>
        <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdownMenuLink">
            <li><Link className="dropdown-item" to="/page1">Page 1</Link></li>
            <li><Link className="dropdown-item" to="/page2">Page 2</Link></li>
            <li><Link className="dropdown-item" to="/page3">Page 3</Link></li>
        </ul>
    </li>
</ul>

                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
