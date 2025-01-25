import React, {useState, useEffect} from "react";
import Navbar from "../components/Navbar";
import data from "../components/data.json";


function Update(){
    const [bank, setBank] = useState("");
    const [type, setType] = useState("");
    const [error, setError] = useState("");
    const [time, setTime] = useState({hours: "00", minutes: "00"});
    const [resolution, setResolution] = useState("");
    

    return (
        <div>
            <Navbar/>
            <div className="Update">

            </div>
        </div>
    )
}

export default Update;