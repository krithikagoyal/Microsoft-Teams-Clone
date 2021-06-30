import React, { useState, useEffect, useRef } from "react";
import './Chat.css';
import SendMessageForm from './SendMessageForm';

function Chat(props) {

    const [messages, addMessage] = useState([]);
    const ref = useRef(null);

    function scrollToBottom() {
        ref.current.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {

        props.socketRef.current.on('receive message', payload => {
            addMessage([...messages, { senderId: payload.username, text: payload.message }]);
            scrollToBottom();
        });

        return () => {
            props.socketRef.current.off("receive message");
        };

    }, [messages]);

    return (
        <div className="app">
            <h1 className="title">Meeting Chat</h1>
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
                <div className="message" id="content"
                    ref={ref}>
                </div>
            </ul>
            <SendMessageForm socketRef={props.socketRef} username={props.username} />
        </div>
    )
}

export default Chat;
