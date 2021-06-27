import React, { useState } from "react";
import './Chat.css';

function SendMessageForm(props) {

    const [message, setMessage] = useState("");

    function handleChange(e) {
        setMessage(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault()
        console.log("handle submit");
        const username = props.username;
        props.socketRef.current.emit('send message', { username, message });
        setMessage("");
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="send-message-form">
            <input
                onChange={handleChange}
                value={message}
                placeholder="Type your message and hit ENTER"
                type="text" />
        </form>
    )
}

export default SendMessageForm;