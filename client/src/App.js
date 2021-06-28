import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import CreateRoom from "./CreateRoom/CreateRoom";
import Home from "./Room/Home/Home";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={CreateRoom} />
        <Route path="/room/:roomID" component={Home} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
