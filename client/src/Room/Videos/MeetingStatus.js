import React, { useState, useEffect } from 'react';
import './MeetingStatus.css';

function MeetingStatus(props) {
    const [timeNow, updateTimeNow] = useState("");
    const [newEvent, changeEventState] = useState(true);

    function timer() {
        setInterval(() => {
            let t = Date.now();
            t = new Date(t);
            t = t.toLocaleString();
            updateTimeNow(t);
        }, 1000);
    }

    useEffect(() => {
        if (props.startTime) {
            changeEventState(false);
        }

        timer();

    }, [])

    function handleClick(e) {
        props.changeStatus();
    }

    return (
        <div className="meeting-status">
            <h1 className="time-now">{timeNow}</h1>
            {newEvent ? <p className="meet-time">Invite people with link {window.location.href}</p> : <p className="meet-time">Meeting will take place from {props.startTime} till {props.endTime}</p>}
            <button onClick={handleClick} className="join-meeting-room">Join Video Call</button>
        </div>
    )
}

export default MeetingStatus
