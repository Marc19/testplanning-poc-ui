import React, { useState, useEffect } from 'react';
import CreateMethodForm from './CreateMethodForm';
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

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const CreateMethod = ({hubConnection, loggedInUserToken}) => {
    const [methodCreator, setMethodCreator] = useState('');
    const [methodName, setMethodName] = useState('');
    const [methodApplicationRate, setMethodApplicationRate] = useState('');
    const [operationResult, setOperationResult] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if(!hubConnection) return;
        
        hubConnection.on("ReceiveMethodCreatedMessage", function (message) {
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

    const createMethodClicked = async() => {
        if(methodCreator.trim().length === 0 || methodName.trim().length === 0 || 
           methodApplicationRate.trim().length === 0 || isNaN(Number(methodApplicationRate))){
            return;
        }
        try{
            const response = await axios({
                method: 'post',
                url: 'https://localhost:5004/home/',
                headers: {
                    "Authorization": `Bearer ${loggedInUserToken}` ,
                    "Content-Type": "application/json"
                },
                data: {
                    "Creator": methodCreator,
                    "Name": methodName,
                    "ApplicationRate": Number(methodApplicationRate)
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
			case 'methodCreator': { 
				setMethodCreator(event.target.value); break; 
			} 
			case 'methodName': { 
				setMethodName(event.target.value); break; 
            }
            case 'methodApplicationRate': { 
				setMethodApplicationRate(event.target.value); break; 
            }
            default: 
		}
    }

    return (
        <div>
            <CreateMethodForm
                handleTextChange={handleTextChange}
                createMethodClicked={createMethodClicked}
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
                <DialogTitle id="alert-dialog-title">{"Method could not be created"}</DialogTitle>
                :
                <DialogTitle id="alert-dialog-title">{"Method created susccessfully"}</DialogTitle>
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
                            Method id: {operationResult.id} <br/>
                            Method creator: {operationResult.creator} <br/>
                            Method name: {operationResult.name} <br/>
                            Method application rate: {operationResult.applicationRate} <br/>
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

export default CreateMethod