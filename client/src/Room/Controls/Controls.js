import React, { useState } from 'react'
import Navbar from '../Chat/Navbar';
import './Controls.css'
import { BsMicFill, BsMicMuteFill } from 'react-icons/bs';
import { IoVideocam, IoVideocamOff } from 'react-icons/io5';
import { MdCallEnd } from 'react-icons/md';
import { BiMessageRoundedDetail } from 'react-icons/bi';
import { ImCopy } from 'react-icons/im';
import ReactTooltip from 'react-tooltip';

function Controls(props) {

    const [showChat, changeVisibility] = useState(false); // true: user has opened up the chat, false: user hasn't opened up the chat
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

    // function when the user wants to close or open up the chat box
    function visibility() {
        changeVisibility(!showChat);
    }

    // function to copy the link to clipboard if the user clicked on join-info button
    function copylink(e) {
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
        <>
            <div className={!props.showVideo ? "controls-form" : "controls"}>
                {<><ImCopy data-tip="Copy joining info" onClick={copylink} className="control" id="copy" /><ReactTooltip /></>}
                {videoOn ? <IoVideocam data-tip="Turn off camera" onClick={switchVideo} className="control" /> :
                    <IoVideocamOff data-tip="Turn on camera" onClick={switchVideo} className="control" />}
                {audioOn ? <BsMicFill data-tip="Turn off microphone" onClick={switchAudio} className="control" /> :
                    <BsMicMuteFill data-tip="Turn on microphone" onClick={switchAudio} className="control" />}
                {<><BiMessageRoundedDetail data-tip="Chat with everyone" onClick={visibility} className={showChat || !props.showVideo ? "control show-chat" : "control"} /><ReactTooltip /></>}
                <Navbar showVideo={props.showVideo} socketRef={props.socketRef} username={props.myUsername} chat={props.showVideo ? showChat : true} roomID={props.roomID} />
                {!props.showVideo ? null : <MdCallEnd onClick={props.videoFunc} className="control call-end" data-tip="Leave call" />}
                <ReactTooltip />
            </div>
        </>
    )
}

export default Controls
