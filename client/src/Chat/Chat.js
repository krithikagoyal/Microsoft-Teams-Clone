import React, { useState, useEffect } from "react";
import './Chat.css';
import SendMessageForm from './SendMessageForm';

function Chat(props) {

    const [messages, addMessage] = useState([]);

    useEffect(() => {

        props.socketRef.current.on('receive message', payload => {
            addMessage([...messages, { senderId: payload.username, text: payload.message }]);
        });

        return () => {
            props.socketRef.current.off("receive message");
        };

    }, [messages]);

    return (
        <div className="app">
            <ul className="message-list">
                {messages.map((message, index) => {
                    return (
                        <li className="message" key={index}>
                            <div>
                                {message.senderId}
                            </div>
                            <div>
                                {message.text}
                            </div>
                        </li>
                    )
                })}
            </ul>
            <SendMessageForm socketRef={props.socketRef} username={props.username} />
        </div>
    )
}

export default Chat;
