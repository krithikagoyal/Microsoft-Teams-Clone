import React, { useEffect, useRef, useState } from "react";
import './Videos.css';

const Video = (props) => {
    const ref = useRef();
    const ref2 = useRef();

    useEffect(() => {
        props.peer.on("stream", stream => {
            ref.current.srcObject = stream;
            ref2.current.srcObject = stream;
        })
    }, [props.isUserPinned]);

    return (
        <div className={!props.isUserPinned.isPinned || (props.isUserPinned.peerID === props.peerID) ? "video-container" : "pinned-user"}>
            <video onDoubleClick={() => props.handleDoubleClick(props.peerID)} playsInline autoPlay ref={ref} className={!props.isUserPinned.isPinned ? "display-video" : "pinned-user"} />
            <p className={!props.isUserPinned.isPinned ? "username" : "pinned-user"}>{props.username}</p>
            <video playsInline autoPlay ref={ref2} onDoubleClick={() => props.handleDoubleClick(props.peerID)} className={props.isUserPinned.isPinned && (props.isUserPinned.peerID === props.peerID) ? "display-video pinned" : "not-pinned"} />
            <p className={props.isUserPinned.isPinned && (props.isUserPinned.peerID === props.peerID) ? "username" : "pinned-user"}>{props.username}</p>
        </div>
    );
}


function Videos(props) {
    const [isUserPinned, pinStatus] = useState({ isPinned: false, peerID: null })

    function handleDoubleClick(peerID) {
        console.log(peerID)
        pinStatus({ isPinned: !isUserPinned.isPinned, peerID: peerID })
    }

    return (
        <div className="Container">
            {props.peers.map((peer) => {
                return (
                    <Video peerID={peer.peerID} isUserPinned={isUserPinned} handleDoubleClick={handleDoubleClick} key={peer.peerID} peer={peer.peer} username={peer.username} />
                );
            })}
        </div>
    )
}

export default Videos
