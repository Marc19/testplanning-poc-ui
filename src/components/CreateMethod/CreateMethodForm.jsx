import React from 'react'

const CreateMethodForm = ({handleTextChange, createMethodClicked, showButton, id}) => {
    return (
        <>
            <label>Method Creator</label> &nbsp;
            <input id="methodCreator" onChange={(e) => handleTextChange(e,id)}></input> &nbsp;
            <label>Method Name</label> &nbsp;
            <input id="methodName" onChange={(e) => handleTextChange(e,id)}></input> &nbsp;
            <label>Method Application Rate</label> &nbsp;
            <input id="methodApplicationRate" onChange={(e) => handleTextChange(e,id)}></input> &nbsp;
            {
                showButton?
                <button onClick={createMethodClicked}>Create Method</button>
                :
                null
            }
        </>
    )
}

export default CreateMethodForm