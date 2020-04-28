import React from 'react'

const CreateExperimentForm = ({handleTextChange, createExperimentClicked, showButton}) => {
    return (
        <>
            <label>Experiment Creator</label> &nbsp;
            <input id="experimentCreator" onChange={handleTextChange}></input> &nbsp;
            <label>Experiment Name</label> &nbsp;
            <input id="experimentName" onChange={handleTextChange}></input> &nbsp;
            {
                showButton?
                <button onClick={createExperimentClicked}>Create Experiment</button>
                :
                null
            }
        </>
    )
}

export default CreateExperimentForm