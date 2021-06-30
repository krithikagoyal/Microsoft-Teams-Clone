import React, { useState } from 'react'
import Navbar from '../Chat/Navbar';
import './Controls.css'
import { BsMicFill, BsMicMuteFill } from 'react-icons/bs';
import { IoVideocam, IoVideocamOff } from 'react-icons/io5';
import { MdCallEnd } from 'react-icons/md';
import { BiMessageRoundedDetail } from 'react-icons/bi';
import ReactTooltip from 'react-tooltip';

function Controls(props) {

    const [showChat, changeVisibility] = useState(false);
    const [videoOn, changeVideo] = useState(true);
    const [audioOn, changeAudio] = useState(true);

    function switchAudio() {
        changeAudio(!audioOn);
        let enabled = props.userVideo.current.srcObject.getAudioTracks()[0].enabled;
        if (enabled) {
            props.userVideo.current.srcObject.getAudioTracks()[0].enabled = false;
        } else {
            props.userVideo.current.srcObject.getAudioTracks()[0].enabled = true;
        }

    }

    function switchVideo() {
        changeVideo(!videoOn);
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
        <div className={props.formState ? "controls-form" : "controls"}>
            {videoOn ? <IoVideocam data-tip="Turn off camera" onClick={switchVideo} className="control" /> :
                <IoVideocamOff data-tip="Turn on camera" onClick={switchVideo} className="control" />}
            {audioOn ? <BsMicFill data-tip="Turn off microphone" onClick={switchAudio} className="control" /> :
                <BsMicMuteFill data-tip="Turn on microphone" onClick={switchAudio} className="control" />}
            {props.formState ? null : <><BiMessageRoundedDetail data-tip="Chat with everyone" onClick={visibility} className={showChat ? "control show-chat" : "control"} /><ReactTooltip /></>}
            {props.formState ? null : <Navbar socketRef={props.socketRef} username={props.myUsername} chat={showChat} />}
            <MdCallEnd onClick={props.leaveRoom} className="control call-end" data-tip="Leave call" />
            <ReactTooltip />
        </div>
    )
}

export default Controls
