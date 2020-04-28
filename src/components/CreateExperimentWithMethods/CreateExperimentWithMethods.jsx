import React, { useState, useEffect } from 'react'
import CreateExperimentForm from '../CreateExperiment/CreateExperimentForm'
import CreateMethodForm from '../CreateMethod/CreateMethodForm';
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

const CreateExperimentWithMethods = ({hubConnection, loggedInUserToken}) => {
    const [experimentCreator, setExperimentCreator] = useState('');
    const [experimentName, setExperimentName] = useState('');
    
    const [methods, setMethods] = useState([]);

    const [operationResult, setOperationResult] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if(!hubConnection) return;
        
        hubConnection.on("ReceiveExperimentWithMethodsCreatedMessage", function (message) {
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

    const addMethodClicked = () => {
        setMethods([...methods, {
            methodId: methods.length === 0? 1 : methods[methods.length - 1].methodId + 1,
            methodCreator: "", methodName: "", methodApplication: ""}])
    };

    const removeMethodClicked = (id) => {
        setMethods(methods.filter(m => {
            return id !== m.methodId
        }));
    }

    const createExperimentWithMethodsClicked = async () => {
        if(experimentCreator.trim().length === 0 || experimentName.trim().length === 0){
            return;
        }

        if(methods.some(
            m => m.methodCreator.trim().length === 0 || m.methodName.trim().length === 0 || 
                 m.methodApplicationRate.trim().length === 0 || isNaN(Number(m.methodApplicationRate)))
          ){
            return;
        }
        
        console.log(`Bearer ${loggedInUserToken}`);
        try{
            const response = await axios({
                method: 'post',
                url: 'https://localhost:5007/home/',
                headers: {
                    "Authorization": `Bearer ${loggedInUserToken}` ,
                    "Content-Type": "application/json"
                },
                data: {
                    "Experiment": {
                        "Creator": experimentCreator,
                        "Name": experimentName
                    },
                    
                    "Methods": methods.map(m => { return {
                        "Creator": m.methodCreator,
                        "Name": m.methodName,
                        "ApplicationRate": Number(m.methodApplicationRate)
                    }})
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
    };

    const handleTextChange = (event, id) => {
        switch(event.target.id){ 
			case 'experimentCreator': { 
				setExperimentCreator(event.target.value); break; 
			} 
			case 'experimentName': { 
				setExperimentName(event.target.value); break; 
            }
            case 'methodCreator': {
                const method = methods.find(m => m.methodId === id);
                const newMethod = {...method, methodCreator: event.target.value};

                setMethods(methods.map(m => {
                    if(m.methodId === id){
                        return newMethod;
                    }
                    return m;
                }));
                break; 
			} 
			case 'methodName': { 
				const method = methods.find(m => m.methodId === id);
                const newMethod = {...method, methodName: event.target.value};

                setMethods(methods.map(m => {
                    if(m.methodId === id){
                        return newMethod;
                    }
                    return m;
                }));
                break; 
            }
            case 'methodApplicationRate': { 
				const method = methods.find(m => m.methodId === id);
                const newMethod = {...method, methodApplicationRate: event.target.value};

                setMethods(methods.map(m => {
                    if(m.methodId === id){
                        return newMethod;
                    }
                    return m;
                }));
                break; 
            }
            default: 
		}
    }

    return (
        <div>
            <button onClick={addMethodClicked}>Add Method</button> <br/><br/>
            
            <CreateExperimentForm
                handleTextChange={handleTextChange}
                createExperimentClicked={null}
                showButton={false}
            />

            {
                methods.map(m => 
                    <span key={m.methodId}>
                        <br/><br/>
                        <CreateMethodForm
                            id={m.methodId}
                            handleTextChange={handleTextChange}
                            createMethodClicked={null}
                            showButton={false}
                        />
                        <button onClick={() => removeMethodClicked(m.methodId)}>x</button>
                    </span>
                )
            }

            <button style={{marginLeft: "3rem"}} onClick={createExperimentWithMethodsClicked}>Create Experiment with methods</button> <br/><br/>
       
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
                <DialogTitle id="alert-dialog-title">{"Experiment with Methods could not be created"}</DialogTitle>
                :
                <DialogTitle id="alert-dialog-title">{"Experiment with Methods created susccessfully"}</DialogTitle>
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
                            Experiment id: {operationResult.experiment.id} <br/>
                            Experiment creator: {operationResult.experiment.creator} <br/>
                            Experiment name: {operationResult.experiment.name} <br/>
                            Created At: {operationResult.experiment.creationDate} <br/>
                            <br/>
                            Methods: 
                                <br/><hr/>
                                {
                                    operationResult.methods.map(m => 
                                        <span key={m.id}>
                                            Method id: {m.id} <br/>
                                            Method creator: {m.creator} <br/>
                                            Method name: {methods.name} <br/>
                                            Method application rate: {m.applicationRate} <br/>
                                            Created At: {m.creationDate}<br/><hr/>
                                        </span>
                                    )
                                }
                            

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

export default CreateExperimentWithMethods