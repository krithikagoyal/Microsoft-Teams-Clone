import React from 'react'
import { Button, Form } from 'react-bootstrap';
import './JoinMeet.css';

function JoinMeet(props) {

    function submitForm(e) {
        e.preventDefault();
        props.hideForm();
    }

    return (
        <Form onSubmit={submitForm} className="input-form">
            <Button variant="primary" onClick={props.hideForm} className="form-button">
                Join Now
            </Button>
        </Form>
    )
}

export default JoinMeet

