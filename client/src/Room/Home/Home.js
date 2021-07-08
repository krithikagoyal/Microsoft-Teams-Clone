import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import JoinMeet from '../InputName/JoinMeet'
import Videos from '../Videos/Videos'
import Controls from '../Controls/Controls'
import './Home.css';
import MeetingStatus from "../Videos/MeetingStatus";
import { firedb } from '../../authentication/firebase'
import { useAuth } from '../../authentication/contexts/AuthContext';

function Home(props) {
    const [peers, setPeers] = useState([]);
    const [formState, setState] = useState(true);
    const socketRef = useRef();
    const userVideo = useRef();
    const peersRef = useRef([]);
    const myUsernameRef = useRef();
    const roomID = props.match.params.roomID;
    const [startTime, initialiseStartTime] = useState(null);
    const [endTime, initialiseEndTime] = useState(null);
    const [showVideo, changeVideoState] = useState(false);
    const { currentUser, logout } = useAuth()
    const [currentUsername, changeUserName] = useState("");

    useEffect(() => {
        socketRef.current = io.connect("/");

        var key = (currentUser.email).replace('.', '')
        firedb.child("usernames").child(key).on("value", name => {
            changeUserName(name.val())
            myUsernameRef.current = currentUsername;
        })


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

        firedb.child("events").child(window.location.href).on("value", time => {
            if (time.val() != null) {
                let starttime = time.val().start;
                let endtime = time.val().end;
                starttime = new Date(starttime);
                endtime = new Date(endtime);
                initialiseStartTime(starttime.toLocaleString());
                initialiseEndTime(endtime.toLocaleString());
            }
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
        myUsernameRef.current = currentUsername;
        socketRef.current.emit("join room", { roomID, currentUsername });
    }

    function leaveRoom() {
        socketRef.current.emit("user clicked leave meeting", socketRef.current.id);
        props.history.push("/");
    }

    function changeStatus() {
        changeVideoState(!showVideo);
    }


    return (
        <>
            <video muted ref={userVideo} autoPlay playsInline className={formState && showVideo ? "center-video" : "side-video"} />
            {!showVideo ? <>
                <MeetingStatus changeStatus={changeStatus} startTime={startTime} endTime={endTime} />
                {socketRef.current ? <Controls formState={false} leaveRoom={leaveRoom} userVideo={userVideo} socketRef={socketRef} myUsername={currentUsername} showVideo={false} roomID={props.match.params.roomID} /> : null}
            </> :
                <>
                    {formState ? <JoinMeet hideForm={hideForm} /> : <Videos peers={peers} />}
                    <Controls formState={formState} leaveRoom={leaveRoom} userVideo={userVideo} socketRef={socketRef} myUsername={currentUsername} showVideo={true} roomID={props.match.params.roomID} />
                </>}
        </>
    );
}

export default Home;
