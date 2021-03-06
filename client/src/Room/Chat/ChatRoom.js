// its a new event or a scheduled event
import React, { useState, useEffect } from 'react';
import './ChatRoom.css';

function ChatRoom(props) {
    const [newEvent, changeEventState] = useState(true); // it was a new event or a scheduled event ?

    useEffect(() => {
        if (props.startTime) {
            changeEventState(false);
        }
    }, [props.startTime])

    function handleClick(e) {
        props.changeStatus();
    }

    // copy the text to clipboard after clicking the link.
    function handlelinkClick(e) {
        e.preventDefault();
        var copyText = window.location.href;

        document.addEventListener('copy', function (e) {
            e.clipboardData.setData('text/plain', copyText);
            e.preventDefault();
        }, true);

        document.execCommand('copy');
        alert('copied text: ' + copyText);
    }

    return (
        <div className="meeting-status">
            <button onClick={handleClick} className="join-meeting-room">Join Video Call</button>
            <button onClick={props.leaveRoom} className="leave-meeting-room">Leave room</button>
            {newEvent ? <p className="meet-time">Invite people with link <a onClick={handlelinkClick} className="anchor-link">{window.location.href}</a></p> : <p className="meet-time">Meeting time: {props.startTime} till {props.endTime}</p>}
        </div>
    )
}

export default ChatRoom
