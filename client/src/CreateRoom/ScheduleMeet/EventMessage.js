import React from 'react';
import { Button, Jumbotron } from 'react-bootstrap';
import { useLocation } from "react-router-dom";

function EventMessage(props) {
    const location = useLocation();

    function handleClick() {
        props.history.push('/');
    }

    return (
        <div style={{ background: "#dae2ee", height: "100vh"}}>
            <Jumbotron style={{ background: "white"}}>
                <h2>Your event has been created</h2>
                <p>
                    {location.state.data}
                </p>
                <p>
                    <Button variant="primary" onClick={handleClick} style={{ background: "#4b53bc", borderWidth:"0"}}>Go back to home page</Button>
                </p>
            </Jumbotron>
        </div>
    )
}

export default EventMessage
