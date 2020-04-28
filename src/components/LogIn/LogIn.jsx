import React, { useState } from 'react'

const TOKEN1 = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6Im1hcmMifQ.aQ9IVm74fEFgxBJY244kXy7XvzFikimzMu9MfGGfavs";
const TOKEN2 = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwibmFtZSI6InNoZXJpZiJ9.VDc9DFmDA_3Tcy5KkjGLUkLpug0v4orLdBdOJ_L8XL0";

const LogIn = ({login}) => {
    const [selectedUserToken, setSelectedUserToken] = useState(TOKEN1);
    
    const handleDropDownChange = (event) => {
        setSelectedUserToken(event.target.value);
    }

    const loginClicked = () => {
        login(selectedUserToken);
    };

    return (
        <div>
            <label>Log in as</label>&nbsp;
            <select id="users" onChange={handleDropDownChange} value={selectedUserToken}>
                <option value={TOKEN1}>User1</option>
                <option value={TOKEN2}>User2</option>
            </select> 
            &nbsp;
            <button onClick={loginClicked}>{"Log in"}</button>
        </div>
    )
}

export default LogIn