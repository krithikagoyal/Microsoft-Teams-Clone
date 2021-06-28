import React, { useEffect, useRef } from "react";
import styled from "styled-components";

const StyledVideo = styled.video`
    height: 30%;
    width: 40%;
`;

const Container = styled.div`
    padding: 20px;
    display: flex;
    height: 100vh;
    width: 90%;
    margin: auto;
    flex-wrap: wrap;
`;


const Video = (props) => {
    const ref = useRef();

    useEffect(() => {
        props.peer.on("stream", stream => {
            ref.current.srcObject = stream;
        })
    }, []);

    return (
        <div>
            <StyledVideo playsInline autoPlay ref={ref} />
            <p>{props.username}</p>
        </div>
    );
}


function Videos(props) {
    return (
        <Container>
            {props.peers.map((peer) => {
                return (
                    <Video key={peer.peerID} peer={peer.peer} username={peer.username} />
                );
            })}
        </Container>
    )
}

export default Videos
