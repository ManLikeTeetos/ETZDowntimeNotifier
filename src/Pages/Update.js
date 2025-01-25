import React, {useState} from "react";
import Navbar from "../components/Navbar";
import data from "../components/data.json";
import "../styling/Update.css";


function Update(){
    const [selectedBank, setSelectedBank] = useState("");
    const [type, setType] = useState("FT");
    const [selectedError, setSelectedError] = useState("");
    const [time, setTime] = useState({hours: "00", minutes: "00"});
    const [resolution, setResolution] = useState("NIP");
   
 

//   useEffect(() => {
//     const savedBanks = JSON.parse(localStorage.getItem('upbanks')) || [];
    
//   }, []);

      // Handle form submission
      const handleSubmit = (e) => {
        e.preventDefault();
        console.log({
          selectedBank,
          type,
          selectedError,
          time,
          resolution,
        });

       

        //Find selected Bank
        let selectedBankData = data.banks.find((bank) => bank.bankname === selectedBank && bank.type === type);

        //VT issues
        if (!selectedBankData) {
            // Create a new bank entry if it doesn't exist
            selectedBankData = {
                bankname: selectedBank,
                type: type,
                downtime: "00:00", // Default downtime
                reason: "", // Default reason
                status: "Node up", // Default status
            };
          
        }

       
        
        if(selectedBankData){

            // Update downtime in hh:mm format
            const updatedDowntime = `${time.hours}:${time.minutes}`;
            selectedBankData.downtime = updatedDowntime;
            selectedBankData.status = resolution;

             ///error message
            const selectedErrorMessage = data.status.find(error => error.code === selectedError)?.message || '';
            selectedBankData.reason = selectedErrorMessage;


            if(selectedError === "suc"){
                let downbanks = JSON.parse(localStorage.getItem("downbanks")) || [];
                downbanks = downbanks.filter((item) => item.bankname !== selectedBank || item.type !== type);

                // console.log("i am here", downbanks);
                // debugger;

                 // Update or add the bank to upbanks
                const upbanks = JSON.parse(localStorage.getItem("upbanks")) || [];
                const existingBankIndex = upbanks.findIndex(item => item.bankname === selectedBank && item.type === selectedBankData.type);
                if (existingBankIndex !== -1) {
                    // Update the existing bank in upbanks
                    upbanks[existingBankIndex] = selectedBankData;
                } else {
                    // Add the selected bank to upbanks
                    upbanks.push(selectedBankData);
                }
              
                //save
                localStorage.setItem("downbanks", JSON.stringify(downbanks));
                localStorage.setItem("upbanks", JSON.stringify(upbanks));
            } else {

                
                
                // Handle when selectedError is not "00" (Error)
                // Remove the selected bank from upbanks if it's there
                let upbanks = JSON.parse(localStorage.getItem("upbanks")) || [];
                upbanks = upbanks.filter((item) => item.bankname !== selectedBank || item.type !== type);
               

                // Update or add the bank to downbanks
                const downbanks = JSON.parse(localStorage.getItem("downbanks")) || [];
                const existingDownBankIndex = downbanks.findIndex(item => item.bankname === selectedBank && item.type === selectedBankData.type);
                if (existingDownBankIndex !== -1) {
                    // Update the existing bank in downbanks
                    downbanks[existingDownBankIndex] = selectedBankData;
                } else {
                    
                    // Add the selected bank to downbanks
                    downbanks.push(selectedBankData);
                }

                localStorage.setItem("upbanks", JSON.stringify(upbanks));
                localStorage.setItem("downbanks", JSON.stringify(downbanks));
            } 

           

            // Reset the form fields
            setSelectedBank("");
            setType("FT");
            setSelectedError("");
            setTime({ hours: "00", minutes: "00" });
            setResolution("NIP");

            alert("Bank updated and moved to downbanks successfully!");


        }
      };




    return (
        <div>
            <Navbar/>
            <div className="Update">
                <div className="form-container">
                    {/* <h2>Update Bank Status</h2> */}
                    <form className="form-inner" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Bank Name</label>
                            <select
                            value={selectedBank}
                            onChange={(e) => setSelectedBank(e.target.value)}
                            >
                            <option value="">Select Bank</option>
                            {data.banks.map((bank) => (
                                <option key={bank.id} value={bank.bankname}>
                                {bank.bankname}
                                </option>
                            ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Type</label>
                            <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            >
                            <option value="FT">FT</option>
                            <option value="VT">VT</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Error</label>
                            <select
                            value={selectedError}
                            onChange={(e) => setSelectedError(e.target.value)}
                            >
                            <option value="">Select Error</option>
                            {data.status.map((status) => (
                                <option key={status.code} value={status.code}>
                                {status.message}
                                </option>
                            ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Time</label>
                            <div className="time-inputs">
                            <select
                                value={time.hours}
                                onChange={(e) =>
                                setTime({ ...time, hours: e.target.value })
                                }
                            >
                                {[...Array(24).keys()].map((h) => (
                                <option key={h} value={String(h).padStart(2, "0")}>
                                    {String(h).padStart(2, "0")}
                                </option>
                                ))}
                            </select>
                            :
                            <select
                                value={time.minutes}
                                onChange={(e) =>
                                setTime({ ...time, minutes: e.target.value })
                                }
                            >
                                {[...Array(60).keys()].map((m) => (
                                <option key={m} value={String(m).padStart(2, "0")}>
                                    {String(m).padStart(2, "0")}
                                </option>
                                ))}
                            </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Resolution</label>
                            <select
                            value={resolution}
                            onChange={(e) => setResolution(e.target.value)}
                            >
                            <option value="NIP">NIP</option>
                            <option value="Node down">Node down</option>
                            <option value="Node up">Node up</option>
                            </select>
                        </div>

                        <button type="submit" className="submit-btn">
                            Update
                        </button>
                    </form>
                </div>
            </div>    
        </div>
    )
}

export default Update;