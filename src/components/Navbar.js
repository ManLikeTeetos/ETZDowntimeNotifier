import {Link} from 'react-router-dom';
import '../styling/Navbar.css';
import { useNavigate } from "react-router-dom";

function Navbar(){
    const navigate = useNavigate();
    const Signout = () => {
        navigate("/login");
    }
    return (
        <div className="Navbar">
            <div>
                <h1>Downtime Notifier</h1>
            </div>
            <div className="Menu">
                <Link to="/"><h1>Dashboard</h1></Link>
                <Link to="/update"><h1>Update</h1></Link>
                <h1 onClick={Signout}>Sign out</h1>
            </div>
        </div>
    )
}

export default Navbar;