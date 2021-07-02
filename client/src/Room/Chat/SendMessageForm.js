import React, { useState } from "react";
import './Chat.css';
import Picker from 'emoji-picker-react';
import './SendMessageForm.css';
import { BiSmile } from "react-icons/bi";

function SendMessageForm(props) {

    const [message, setMessage] = useState("");
    const [emojiPickerState, openEmojiPicker] = useState(false);

    const onEmojiClick = (event, emojiObject) => {
        setMessage(message + emojiObject.emoji);
    };

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
        <>
            {emojiPickerState ? <Picker onEmojiClick={onEmojiClick} pickerStyle={{ width: '100%' }}/> : null}
            <form
                onSubmit={handleSubmit}
                className="send-message-form">
                <input
                    onChange={handleChange}
                    value={message}
                    placeholder="Type your message and hit ENTER"
                    type="text"
                    id="input1"
                    className="input-message-form"
                />
                <BiSmile className="emoji-class" onClick={() => openEmojiPicker(!emojiPickerState)}/>
            </form>
        </>
    )
}

export default SendMessageForm;
