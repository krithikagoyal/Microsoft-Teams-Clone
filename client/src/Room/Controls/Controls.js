import React, { useState } from 'react'
import Navbar from '../Chat/Navbar';
import './Controls.css'

function Controls(props) {

    const [showChat, changeVisibility] = useState(false);

    function switchAudio() {
        let enabled = props.userVideo.current.srcObject.getAudioTracks()[0].enabled;
        if (enabled) {
            props.userVideo.current.srcObject.getAudioTracks()[0].enabled = false;
        } else {
            props.userVideo.current.srcObject.getAudioTracks()[0].enabled = true;
        }

    }

    function switchVideo() {
        let enabled = props.userVideo.current.srcObject.getVideoTracks()[0].enabled;
        if (enabled) {
            props.userVideo.current.srcObject.getVideoTracks()[0].enabled = false;
        } else {
            props.userVideo.current.srcObject.getVideoTracks()[0].enabled = true;
        }
    }

    function visibility() {
        changeVisibility(!showChat);
    }

    return (
        <div className="controls">
            <button className="leave-room" onClick={props.leaveRoom}>Leave meeting</button>
            <button className="switch-audio" onClick={switchAudio}>Mute/Unmute</button>
            <button className="switch-video" onClick={switchVideo}>Video on/off</button>
            {props.formState ? null : <button className="show-chat" onClick={visibility}>Chat</button>}
            {props.formState ? null : <Navbar socketRef={props.socketRef} username={props.myUsername} chat={showChat} />}
        </div>
    )
}

export default Controls
