import React from 'react';
import { Link , useNavigate} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../slices/UserSlice';
const Navbar = () => {
  const userId = useSelector((state) => state.users.user?.id); 
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <nav>
      <ul>
        {/* If there is no userId, show Login and Register links */}
        {!userId ? (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/AdminOnly">AdminOnly</Link></li>
          </>
        ) : (
          // If userId exists, show navigation links for authenticated users
          <>
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/explore">Explore</Link></li>
            <li><Link to="/games">Games</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/socialize">socialize</Link></li>
            <li><Link to="/todolist">todolist</Link></li>
            <li><button onClick={handleLogout}>Logout</button></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
