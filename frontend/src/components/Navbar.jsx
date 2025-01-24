import { Link} from 'react-router-dom';


const Navbar = () => {
    
    return (
        <>
            <nav>

                <Link to="/" >Home</Link>

                <Link to="/" >Login</Link>
                <Link to="/" >Sign-up</Link>

            </nav>
        </>
    );
};

export default Navbar;
