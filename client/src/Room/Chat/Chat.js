import React, { useState, useEffect, useRef } from "react";
import './Chat.css';
import SendMessageForm from './SendMessageForm';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { firedb } from '../../authentication/firebase';

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
        firedb.child(props.roomID).on("value", messagesdb => {
            if (messagesdb.val() != null) {
                var messagessDB = [];
                Object.keys(messagesdb.val()).map(id => {
                    messagessDB.push(messagesdb.val()[id])
                })
                addMessage(messagessDB)
            }
            if (ref.current) { scrollToBottom(); }
        })
    }, []);

    useEffect(() => {

        props.socketRef.current.on('receive message', payload => {
            if (props.roomID === payload.roomID) {
                if (props.chat === false) { newMessageNotification(payload); }
                scrollToBottom();
            }
        });

        return () => {
            props.socketRef.current.off("receive message");
        };

    }, [messages, props.chat]);

    return (
        <div className="app">
            <h1 className="title">Meeting Chat</h1>
            <div className="message-list">
                {messages.map((message, index) => {
                    return (
                        <div className="message" key={index}>
                            <div>
                                {message.senderId}
                            </div>
                            <div>
                                {message.text}
                            </div>
                        </div>
                    )
                })}
                <div className="message" id="content"
                    ref={ref}>
                </div>
            </div>
            <ToastContainer className="new-message" />
            <SendMessageForm socketRef={props.socketRef} username={props.username} roomID={props.roomID} />
        </div>
    )
}

export default Chat;
