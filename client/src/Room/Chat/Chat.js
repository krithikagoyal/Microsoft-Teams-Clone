import React, { useState, useEffect, useRef } from "react";
import './Chat.css';
import SendMessageForm from './SendMessageForm';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Chat(props) {

    const [messages, addMessage] = useState([]);
    const ref = useRef(null);

    function scrollToBottom() {
        ref.current.scrollIntoView({ behavior: "smooth" });
    }

    function newMessageNotification(message) {
        toast(<div className="message-notifier">
            <div>
                {message.username}
            </div>
            <div>
                {message.message}
            </div>
        </div>, {
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    }

    useEffect(() => {

        props.socketRef.current.on('receive message', payload => {
            addMessage([...messages, { senderId: payload.username, text: payload.message }]);
            scrollToBottom();
            if (props.chat === false) { newMessageNotification(payload); }
        });

        return () => {
            props.socketRef.current.off("receive message");
        };

    }, [messages, props.chat]);

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
            <ToastContainer className="new-message"/>
            <SendMessageForm socketRef={props.socketRef} username={props.username} />
        </div>
    )
}

export default Chat;
