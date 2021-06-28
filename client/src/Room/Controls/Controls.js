import React, { useState } from 'react'
import Navbar from '../Chat/Navbar';
import './Controls.css'
import { BsMicFill } from 'react-icons/bs';
import { IoVideocam } from 'react-icons/io5';
import { MdCallEnd } from 'react-icons/md';
import { BiMessageRoundedDetail } from 'react-icons/bi';
import styled from "styled-components";

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
        <div className={props.formState ? "controls-form" : "controls"}>
            <IoVideocam onClick={switchVideo} className="control" />
            <BsMicFill onClick={switchAudio} className="control" />
            {props.formState ? null : <BiMessageRoundedDetail onClick={visibility} className="control" />}
            {props.formState ? null : <Navbar socketRef={props.socketRef} username={props.myUsername} chat={showChat} />}
            <MdCallEnd onClick={props.leaveRoom} className="control call-end" />
        </div>
    )
}

export default Controls
