import React, {useState, useEffect} from "react";
import Navbar from "../components/Navbar";
import "../styling/Dashboard.css";
import data from "../components/data.json";
import Down from "../images/down.png";
import UP from "../images/up.png";


const Row = ({id, logo, name, type, downtime, reason, resolution}) => {
    const formatTimeDifference = (downtime) => {
        if (downtime === "00:00:00") return 0;
    
        const [hours, minutes, seconds] = downtime.split(":").map(Number);
        const downtimeMilliseconds = (hours * 3600 + minutes * 60 + seconds) * 1000;
    
        const currentTime = new Date();
        const downSince = new Date(currentTime - downtimeMilliseconds);
    
        return downSince.toLocaleString(); // Format as needed
      };

    return (
        <tr key={id}>
            <td className="image-cell"> 
                <img
            src={logo}
            alt={name}
            style={{ width: "40px", height: "40px", objectFit: "cover" }}
            />
            </td>    
            <td>{name}</td>
            <td>{type}</td>
            <td>{downtime === "00:00:00" ? "N/A" : downtime}</td>
            <td>{downtime === "00:00:00" ? 0 : formatTimeDifference(downtime)}</td>
            <td>{reason}</td>
            <td>{resolution}</td>
        </tr>
    );
};



function Dashboard() {
    const [banks, setBanks] = useState([]);

    useEffect(()=>{

       const savedBanks = localStorage.getItem('banks');
       if(!savedBanks){
        const banksData = JSON.stringify(data.banks);
        localStorage.setItem("banks", banksData);
       } else{
         setBanks(JSON.parse(savedBanks));
       }
       
    }, [])

    return (
        <div>
            <Navbar/>
            <div className="Dashboard">
                <table>
                    <thead>
                    <tr>
                       <th></th>
                        <th>Bank Name</th>
                        <th>Type</th>
                        <th>Downtime</th>
                        <th>Down Since</th>
                        <th>Reason</th>
                        <th>Resolution</th>
                    </tr>
                    </thead>
                    <tbody>
                    
                    {banks.length> 0 ? 
                        (banks.map((row) => (
                            <Row key={row.id}
                            logo = {UP}
                            name={row.bankname}
                            type={row.type}
                            downtime={row.downtime}
                            reason={row.reason}
                            resolution= {row.status}
                            />
                        ))) : 
                        (
                            <tr>
                                <td colspan ="6"> No bank is currently Down </td>
                            </tr>
                        )                  
                    }
                    </tbody>
                </table>
            </div>
            
      </div>
    )
}

export default Dashboard;