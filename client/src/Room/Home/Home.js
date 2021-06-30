import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import InputName from '../InputName/InputName'
import Videos from '../Videos/Videos'
import Controls from '../Controls/Controls'
import './Home.css';

function Home(props) {
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
                const newPeers = [];
                users.forEach(user => {
                    const peer = createPeer(user.id, socketRef.current.id, stream);
                    peersRef.current.push({
                        peerID: user.id,
                        username: user.username,
                        peer,
                    })
                    newPeers.push({
                        peerID: user.id,
                        username: user.username,
                        peer,
                    });
                })
                setPeers(newPeers);
            })

            socketRef.current.on("user joined", payload => {
                const peer = addPeer(payload.signal, payload.callerID, stream);
                const newPeers = [...peersRef.current, {
                    peerID: payload.callerID,
                    username: payload.username,
                    peer,
                }];

                peersRef.current = newPeers;

                setPeers(newPeers);
            });

            socketRef.current.on("receiving returned signal", payload => {
                const item = peersRef.current.find(p => p.peerID === payload.id);
                item.peer.signal(payload.signal);
            });

            socketRef.current.on("user left", id => {
                const peerObj = peersRef.current.find(p => p.peerID === id);
                const newPeers = peersRef.current.filter(p => p.peerID !== id);

                if (peerObj) {
                    peerObj.peer.destroy();
                }

                peersRef.current = newPeers;
                setPeers(newPeers);
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
            const username = myUsernameRef.current;
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

    function hideForm() {
        setState(false);
        myUsernameRef.current = myUsername;
        socketRef.current.emit("join room", { roomID, myUsername });
    }

    function leaveRoom() {
        socketRef.current.emit("user clicked leave meeting", socketRef.current.id);
        props.history.push("/");
    }

    return (
        <>
            <video muted ref={userVideo} autoPlay playsInline className={formState ? "center-video" : "side-video"}/>
            {formState ? <InputName hideForm={hideForm} changeName={changeName} /> :
                <Videos peers={peers} />}
            <Controls formState={formState} leaveRoom={leaveRoom} userVideo={userVideo} socketRef={socketRef} myUsername={myUsername} />
        </>
    );
}

export default Home;
