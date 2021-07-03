import React from 'react';
import { Button, Jumbotron } from 'react-bootstrap';
import { useLocation } from "react-router-dom";

function EventMessage(props) {
    const location = useLocation();

    function handleClick() {
        props.history.push('/');
    }

    return (
        <Jumbotron>
            <h2>Your event has been created</h2>
            <p>
                {location.state.data}
            </p>
            <p>
                <Button variant="primary" onClick={handleClick}>Go back to home page</Button>
            </p>
        </Jumbotron>
    )
}

export default EventMessage
