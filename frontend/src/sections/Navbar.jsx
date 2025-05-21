import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Navbar = () => {
    const userId = useSelector((state) => state.users.user?.id); // Get userId from Redux state

    return (
        <nav>
            <ul>
                {!userId ? (
                    <>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/register">Register</Link></li>
                    </>
                ) : (
                    <>
                        <li><Link to="/home">Home</Link></li>
                        <li><Link to="/explore">Explore</Link></li>
                        <li><Link to="/games">Games</Link></li>
                        <li><Link to="/profile">Profile</Link></li> {/* Updated to point to /profile */}
                        <li><Link to="/socialize">Socialize</Link></li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
