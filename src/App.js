import React, { useState } from 'react';
import CreateExperiment from './components/CreateExperiment/CreateExperiment';
import CreateMethod from './components/CreateMethod/CreateMethod';
import CreateExperimentWithMethods from './components/CreateExperimentWithMethods/CreateExperimentWithMethods';
import ListExperiments from './components/ListExperiments/ListExperiments';
import LogIn from './components/LogIn/LogIn';
const signalR = require("@aspnet/signalr");

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loggedInUserToken, setLoggedInUserToken] = useState("");
  const [hubConnection, setHubConnection] = useState(null);

  const login = (loggedInToken) => {
    startSignalRConnection(loggedInToken);
    setLoggedInUserToken(loggedInToken);
    setLoggedIn(true);
  }

  const startSignalRConnection = (loggedInToken) => {
    let hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`https://localhost:5002/notificationsHub?token=${loggedInToken}`)
      .build();

    console.log("About to start connection....")
    hubConnection.start()
      .then(()=> {
        console.log("Connection Started!");
        setHubConnection(hubConnection);
        //   var connectionUrl = hubConnection["connection"].transport.webSocket.url.split("id=")[1] ;
        //   console.log(connectionUrl);
      })
      .catch(err=>console.log("Couldn't start Connection!", JSON.stringify(err)));
  }

  return (
    <div style={{ padding: "2rem" }}>
      {
        !loggedIn?
        <LogIn login={login}/>
        :
        <>
          <CreateExperiment 
            hubConnection={hubConnection}
            loggedInUserToken={loggedInUserToken}>
          </CreateExperiment>

          <br/><br/><hr/><br/><br/>

          <CreateMethod 
            hubConnection={hubConnection}
            loggedInUserToken={loggedInUserToken}>
          </CreateMethod>

          <br/><br/><hr/><br/><br/>

          <CreateExperimentWithMethods
            hubConnection={hubConnection}
            loggedInUserToken={loggedInUserToken}>
          </CreateExperimentWithMethods>

          <br/><br/><hr/><br/><br/>

          <ListExperiments></ListExperiments>
        </>
      }
    </div>
  );
}

export default App;
