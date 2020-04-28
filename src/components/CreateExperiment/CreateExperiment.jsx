import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import CreateExperimentForm from './CreateExperimentForm';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CreateExperiment = ({hubConnection, loggedInUserToken}) => {
    const [experimentCreator, setExperimentCreator] = useState('');
    const [experimentName, setExperimentName] = useState('');
    const [operationResult, setOperationResult] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if(!hubConnection) return;
        
        hubConnection.on("ReceiveExperimentCreatedMessage", function (message) {
            console.log(message)
            setLoading(false);
            setOperationResult(message);
            setDialogOpen(true);
        });
    }, [hubConnection]);

    const handleDialogClose = () => {
        setDialogOpen(false);
        setOperationResult(null);
    }

    const createExperimentClicked = async() => {
        if(experimentCreator.trim().length === 0 || experimentName.trim().length === 0){
            return;
        }
        try{
            const response = await axios({
                method: 'post',
                url: 'https://localhost:5001/home/',
                headers: {
                    "Authorization": `Bearer ${loggedInUserToken}` ,
                    "Content-Type": "application/json"
                },
                data: {
                    "Creator": experimentCreator,
                    "Name": experimentName
                }
            });

            console.log(response);
        }
        catch(ex){
            console.log(JSON.stringify(ex));
        }
        finally{
            setLoading(true);
        }
    }

    const handleTextChange = event => {
        switch(event.target.id){ 
			case 'experimentCreator': { 
				setExperimentCreator(event.target.value); break; 
			} 
			case 'experimentName': { 
				setExperimentName(event.target.value); break; 
            }
            default: 
		}
    }

    return (
        <div>
            <CreateExperimentForm
                handleTextChange={handleTextChange}
                createExperimentClicked={createExperimentClicked}
                showButton={true}
            />    

            <Backdrop className={""} open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>

            <Dialog
                open={dialogOpen}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleDialogClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
            {
                operationResult && operationResult.failureReason?
                <DialogTitle id="alert-dialog-title">{"Experiment could not be created"}</DialogTitle>
                :
                <DialogTitle id="alert-dialog-title">{"Experiment created susccessfully"}</DialogTitle>
            }
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                    </DialogContentText>
                    {
                        operationResult?
                        operationResult.failureReason?
                        <div>
                            Failure Reason: {operationResult.failureReason}
                        </div>
                        :
                        <div>
                            Experiment id: {operationResult.id} <br/>
                            Experiment creator: {operationResult.creator} <br/>
                            Experiment name: {operationResult.name} <br/>
                            Created At: {operationResult.creationDate}
                        </div>
                        :
                        null
                    }
                </DialogContent>
                <DialogActions>
                <Button onClick={handleDialogClose}color="primary">
                    Close
                </Button>
                </DialogActions>
            </Dialog>
            
        </div>
    )
}

export default CreateExperiment