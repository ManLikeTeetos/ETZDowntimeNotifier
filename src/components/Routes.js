import {Route, Routes} from 'react-router-dom';
import Dashboard from '../Pages/Dashboard';
import Update from '../Pages/Update';
import LogIn from '../Pages/LogIn';


function Routing(){
    return (
        <Routes>
            <Route path="/" element={<Dashboard/>}/>
            <Route path="/update" element={<Update/>}/>
            <Route path="/login" element={<LogIn/>}/>
        </Routes>
    );
}

export default Routing;