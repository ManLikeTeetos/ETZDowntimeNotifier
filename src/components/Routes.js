import {Route, Routes} from 'react-router-dom';
import Dashboard from '../Pages/Dashboard';
import Update from '../Pages/Update';


function Routing(){
    return (
        <Routes>
            <Route path="/" element={<Dashboard/>}/>
            <Route path="/update" element={<Update/>}/>
        </Routes>
    );
}

export default Routing;