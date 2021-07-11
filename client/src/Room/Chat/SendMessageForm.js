import React, { useState } from "react";
import './Chat.css';
import Picker from 'emoji-picker-react';
import './SendMessageForm.css';
import { BiSmile } from "react-icons/bi";
import { firedb } from '../../authentication/firebase';

function SendMessageForm(props) {

    const [message, setMessage] = useState("");
    const [emojiPickerState, openEmojiPicker] = useState(false); // to know if to show up the emoji box or not

    const onEmojiClick = (event, emojiObject) => {
        setMessage(message + emojiObject.emoji); // adding emoji to the current message
    };

    function handleChange(e) {
        // setting message to be what is typed by the user
        setMessage(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault()
        const username = props.username;
        const roomID = props.roomID;
        props.socketRef.current.emit('send message', { username, message, roomID }); // sending the message to the server
        setMessage("");
        // add the new message to database
        firedb.child(props.roomID).push({ senderId: username, text: message });
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
