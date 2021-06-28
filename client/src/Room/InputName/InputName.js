import React from 'react'
import { Button, Form } from 'react-bootstrap';
import './InputName.css';

function InputName(props) {

    function submitForm(e) {
        e.preventDefault();
        props.hideForm();
    }

    return (
        <Form onSubmit={submitForm} className="input-form">
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Enter your username:</Form.Label>
                <Form.Control type="name" placeholder="Enter username" onChange={e => props.changeName(e.target.value)} />
                <Form.Text className="text-muted">
                    This is what other users will see.
                </Form.Text>
            </Form.Group>
            <Button variant="primary" onClick={props.hideForm} className="form-button">
                Join Now
            </Button>
        </Form>
    )
}

export default InputName

