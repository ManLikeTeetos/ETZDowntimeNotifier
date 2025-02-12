import {Route, Routes, Navigate} from 'react-router-dom';
import Dashboard from '../Pages/Dashboard';
import Report from '../Pages/Report';
import Update from '../Pages/Update';
import LogIn from '../Pages/LogIn';
import Register from '../Pages/NewRegister';
import Admin from '../Pages/Admin';


function Routing(){
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/dashboard" element={<Dashboard/>}/>
            <Route path="/report" element={<Report/>}/>
            <Route path="/update" element={<Update/>}/>
            <Route path="/login" element={<LogIn/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/admin" element={<Admin/>}/>
        </Routes>
    );
}

export default Routing;