import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import CreateRoom from "./CreateRoom/CreateRoom";
import Home from "./Room/Home/Home";
import ScheduleMeetForm from './CreateRoom/ScheduleMeet/ScheduleMeetForm';
import EventMessage from './CreateRoom/ScheduleMeet/EventMessage';
import Login from "./authentication/components/Login"
import PrivateRoute from "./authentication/components/PrivateRoute"
import ForgotPassword from "./authentication/components/ForgotPassword"
import Signup from "./authentication/components/Signup"
import { AuthProvider } from "./authentication/contexts/AuthContext"

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Switch>
          <Route path="/" exact component={CreateRoom} />
          <PrivateRoute path="/room/:roomID" component={Home} />
          <PrivateRoute path="/schedulemeet" component={ScheduleMeetForm} />
          <Route path="/eventcreated" component={EventMessage} />
          <Route path="/signup" render={(props) => <Signup {...props} />} />
          <Route path="/login" render={(props) => <Login {...props} />} />
          <PrivateRoute path="/forgot-password" component={ForgotPassword} />
        </Switch>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
