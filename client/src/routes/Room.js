import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";
import { Button, Form } from 'react-bootstrap';

const Container = styled.div`
    padding: 20px;
    display: flex;
    height: 100vh;
    width: 90%;
    margin: auto;
    flex-wrap: wrap;
`;

const StyledVideo = styled.video`
    height: 40%;
    width: 50%;
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

const Room = (props) => {
    const [peers, setPeers] = useState([]);
    const [myUsername, changeName] = useState("Anonymous user");
    const [formState, setState] = useState(true);
    const socketRef = useRef();
    const userVideo = useRef();
    const peersRef = useRef([]);
    const myUsernameRef = useRef();
    const roomID = props.match.params.roomID;


    useEffect(() => {
        socketRef.current = io.connect("/");
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
            userVideo.current.srcObject = stream;

            socketRef.current.on("all users", users => {
                const peers = [];
                users.forEach(user => {
                    const peer = createPeer(user.id, socketRef.current.id, stream);
                    peersRef.current.push({
                        peerID: user.id,
                        username: user.username,
                        peer,
                    })
                    peers.push({
                        peerID: user.id,
                        username: user.username,
                        peer,
                    });
                })
                setPeers(peers);
            })

            socketRef.current.on("user joined", payload => {
                const peer = addPeer(payload.signal, payload.callerID, stream);
                const peers = [...peersRef.current, {
                    peerID: payload.callerID,
                    username: payload.username,
                    peer,
                }];
                console.log("user joined", payload.username);

                peersRef.current = peers;

                setPeers(peers);
            });

            socketRef.current.on("receiving returned signal", payload => {
                const item = peersRef.current.find(p => p.peerID === payload.id);
                item.peer.signal(payload.signal);
            });

            socketRef.current.on("user left", id => {
                const peerObj = peersRef.current.find(p => p.peerID === id);
                const peers = peersRef.current.filter(p => p.peerID !== id);

                if (peerObj) {
                    peerObj.peer.destroy();
                }

                peersRef.current = peers;
                setPeers(peers);
            })
        })
    }, []);

    function createPeer(userToSignal, callerID, stream) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });

        peer.on("signal", signal => {
            console.log("signal", myUsernameRef.current);
            const username = myUsernameRef.current;
            console.log("username tttt", username);
            socketRef.current.emit("sending signal", { userToSignal, callerID, username, signal })
        })

        return peer;
    }

    function addPeer(incomingSignal, callerID, stream) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        })

        peer.on("signal", signal => {
            socketRef.current.emit("returning signal", { signal, callerID })
        })

        peer.signal(incomingSignal);

        return peer;
    }

    function leaveRoom() {
        socketRef.current.emit("user clicked leave meeting", socketRef.current.id);
        props.history.push("/");
    }

    function switchAudio() {
        let enabled = userVideo.current.srcObject.getAudioTracks()[0].enabled;
        if (enabled) {
            userVideo.current.srcObject.getAudioTracks()[0].enabled = false;
        } else {
            userVideo.current.srcObject.getAudioTracks()[0].enabled = true;
        }

    }

    function switchVideo() {
        let enabled = userVideo.current.srcObject.getVideoTracks()[0].enabled;
        if (enabled) {
            userVideo.current.srcObject.getVideoTracks()[0].enabled = false;
        } else {
            userVideo.current.srcObject.getVideoTracks()[0].enabled = true;
        }
    }

    function hideForm() {
        setState(false);
        console.log(myUsername);
        myUsernameRef.current = myUsername;
        socketRef.current.emit("join room", { roomID, myUsername });
    }

    return (
        <div>
            {formState ? <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Enter your username:</Form.Label>
                    <Form.Control type="name" placeholder="Enter username" onChange={e => changeName(e.target.value)} />
                    <Form.Text className="text-muted">
                        This is what other users will see.
                    </Form.Text>
                </Form.Group>
                <Button variant="primary" onClick={hideForm}>
                    Submit
                </Button>
            </Form> : null}
            <Container>
                <StyledVideo muted ref={userVideo} autoPlay playsInline />
                <p>{myUsername}</p>
                {peers.map((peer) => {
                    return (
                        <Video key={peer.peerID} peer={peer.peer} username={peer.username} />
                    );
                })}
                <button onClick={leaveRoom}>Leave meeting</button>
                <button onClick={switchAudio}>Mute/Unmute</button>
                <button onClick={switchVideo}>Video on/off</button>
            </Container>
        </div>
    );
};

export default Room;
