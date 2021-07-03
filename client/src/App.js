import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import CreateRoom from "./CreateRoom/CreateRoom";
import Home from "./Room/Home/Home";
import ScheduleMeetForm from './CreateRoom/ScheduleMeet/ScheduleMeetForm';
import EventMessage from './CreateRoom/ScheduleMeet/EventMessage';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={CreateRoom} />
        <Route path="/room/:roomID" component={Home} />
        <Route path="/schedulemeet" component={ScheduleMeetForm} />
        <Route path="/eventcreated" component={EventMessage}/>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
