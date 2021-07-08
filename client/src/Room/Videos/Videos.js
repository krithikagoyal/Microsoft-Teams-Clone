import React, { useEffect, useRef } from "react";
import './Videos.css';

const Video = (props) => {
    const ref = useRef();

    useEffect(() => {
        props.peer.on("stream", stream => {
            ref.current.srcObject = stream;
        })
    }, []);

    return (
        <div className="video-container">
            <video playsInline autoPlay ref={ref} className="display-video" />
            <p className="username">{props.username}</p>
        </div>
    );
}


function Videos(props) {
    return (
        <div className="Container">
            {props.peers.map((peer) => {
                return (
                    <Video key={peer.peerID} peer={peer.peer} username={peer.username} />
                );
            })}
        </div>
    )
}

export default Videos
