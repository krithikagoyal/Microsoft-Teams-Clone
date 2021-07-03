import * as React from 'react';
import { ReactMultiEmail, isEmail } from 'react-multi-email';
import { Button, Form } from 'react-bootstrap';
import 'react-multi-email/style.css';
import { v1 as uuid } from "uuid";
import CalenderApi from "./CalenderApi";
import { options } from './TimeZoneSelect';

class AttendeesEmail extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            emails: [],
            description: "",
            authorise: false,
            startdateTime: "2021-07-05T05:00:00",
            enddateTime: "2021-07-05T05:00:00",
            timezone: "+05:30",
        };
    }

    formSubmit = (event) => {
        event.preventDefault();
        this.setState({ authorise: true });
    }

    render() {
        const { emails } = this.state;
        const { description } = this.state;
        const { authorise } = this.state;
        const { startdateTime } = this.state;
        const { enddateTime } = this.state;
        const { timezone } = this.state;
        const id = uuid();
        const link = `http://localhost:3000/room/${id}`;
        return (React.createElement(React.Fragment, null,
            <h3>Email</h3>,
            React.createElement(ReactMultiEmail, {
                placeholder: "placeholder", emails: emails, onChange: (_emails) => {
                    this.setState({ emails: _emails });
                }, validateEmail: email => {
                    return isEmail(email); // return boolean
                }, getLabel: (email, index, removeEmail) => {
                    return (React.createElement("div", { "data-tag": true, key: index },
                        email,
                        React.createElement("span", { "data-tag-handle": true, onClick: () => removeEmail(index) }, "\u00D7")));
                }
            }),
            <p>Start time:</p>,
            <input type="datetime-local" name="date-time" onChange={e => this.setState({ startdateTime: e.target.value })} step={1} />,
            <p>End time:</p>,
            <input type="datetime-local" name="date-time" onChange={e => this.setState({ enddateTime: e.target.value })} step={1} />,
            <select onChange={e => this.setState({ timezone: e.target.value })}>
                {options.map(val => (
                    <option value={val.value}>{val.name}</option>
                ))}
            </select>,
            <Form onSubmit={this.formSubmit}>
                <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Description of the Event</Form.Label>
                    <Form.Control as="textarea" rows={3} onChange={e => this.setState({ description: e.target.value })} />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>,
            <>{authorise ? <CalenderApi description={description} link={link} attendees={emails} start={startdateTime + timezone} end={enddateTime + timezone} /> : null}</>
        ));
    }
}

export default AttendeesEmail;
