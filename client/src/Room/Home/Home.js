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
    const [peers, setPeers] = useState([]); // for storing the stream, username etc for each peer
    const [formState, setState] = useState(true); // for seeing the preview
    const socketRef = useRef();
    const userVideo = useRef(); // the current users video
    const peersRef = useRef([]); // for storing the peers data as ref
    const myUsernameRef = useRef(); // current users username as ref
    const roomID = props.match.params.roomID;
    const [startTime, initialiseStartTime] = useState(null); // start time if the meeting was scheduled
    const [endTime, initialiseEndTime] = useState(null); // end time if the meeting was scheduled
    const [showVideo, changeVideoState] = useState(false); // not to show the video while in chat room
    const { currentUser, logout } = useAuth() // for logging out the user and getting other user data
    const [currentUsername, changeUserName] = useState("");

    useEffect(() => {
        socketRef.current = io.connect("/");

        // replacing the dot from the email because '.' is not allowed as the key in firebase database
        var key = (currentUser.email).replace('.', '')
        firedb.child("usernames").child(key).on("value", name => {
            changeUserName(name.val())
            myUsernameRef.current = currentUsername;
        })


        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
            userVideo.current.srcObject = stream; // capturing the stream

            // creating the peers array
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

            // when a new user joins
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

            // getting the socketid of the user joined through this event
            socketRef.current.on("receiving returned signal", payload => {
                const item = peersRef.current.find(p => p.peerID === payload.id);
                item.peer.signal(payload.signal);
            });

            // when a user leaves the room
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

        // getting the start and end time if the event was scheduled
        firedb.child("events").child(roomID).on("value", time => {
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

    // function to create a new peer when the user has currently joined
    function createPeer(userToSignal, callerID, stream) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });

        // sending the stream of current user to others
        peer.on("signal", signal => {
            const username = myUsernameRef.current;
            socketRef.current.emit("sending signal", { userToSignal, callerID, username, signal })
        })

        return peer;
    }

    // function to add a new peer if the user was already in the room
    function addPeer(incomingSignal, callerID, stream) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        })

        // sending the signal to the server to get in return the socketid for the user
        peer.on("signal", signal => {
            socketRef.current.emit("returning signal", { signal, callerID })
        })

        peer.signal(incomingSignal);

        return peer;
    }

    // to hide the preview if the user clicked on join meet
    function hideForm() {
        setState(false);
        myUsernameRef.current = currentUsername;
        socketRef.current.emit("join room", { roomID, currentUsername });
    }

    // redirecting the user to home screen after leaving the room
    function leaveRoom() {
        socketRef.current.emit("user clicked leave meeting", socketRef.current.id);
        props.history.push("/");
    }

    // redirecting user to the chat room after leaving the video call
    function changeStatus() {
        if (showVideo) {
            window.location.reload();
        }
        changeVideoState(!showVideo);
    }

    
    return (
        <>
            <video muted ref={userVideo} autoPlay playsInline className={formState && showVideo ? "center-video" : "side-video"} style={!showVideo ? { visibility: "hidden" } : null} />
            {!showVideo ? <div className="chat-room">
                <MeetingStatus changeStatus={changeStatus} startTime={startTime} endTime={endTime} leaveRoom={leaveRoom} />
                {socketRef.current ? <Controls formState={false} leaveRoom={leaveRoom} userVideo={userVideo} socketRef={socketRef} myUsername={currentUsername} showVideo={false} roomID={props.match.params.roomID} /> : null}
            </div> :
                <>
                    {formState ? <JoinMeet hideForm={hideForm} /> : <Videos peers={peers} />}
                    <Controls formState={formState} leaveRoom={leaveRoom} userVideo={userVideo} socketRef={socketRef} myUsername={currentUsername} showVideo={true} roomID={props.match.params.roomID} videoFunc={changeStatus} />
                </>}
        </>
    );
}

export default Home;
