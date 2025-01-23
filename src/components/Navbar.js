import {Link} from 'react-router-dom';
import '../styling/Navbar.css';

function Navbar(){
    return (
        <div className="Navbar">
            <div>
                <h1>Downtime Notifier</h1>
            </div>
            <div className="Menu">
                <Link to="/"><h1>Dashboard</h1></Link>
                <Link to="/update"><h1>Update</h1></Link>
                <h1>Sign out</h1>
            </div>
        </div>
    )
}

export default Navbar;