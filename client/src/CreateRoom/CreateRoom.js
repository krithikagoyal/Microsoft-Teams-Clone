import React, { useState } from "react";
import { v1 as uuid } from "uuid";
import './CreateRoom.css';
import { useAuth } from "../authentication/contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import collaborate from '../images/collaborate.png';

const CreateRoom = (props) => {

    const [room, setRoom] = useState("");
    const history = useHistory()
    const { currentUser, logout } = useAuth();
    const [error, setError] = useState("");

    async function handleLogout() {
        setError("")

        try {
            await logout()
            history.push("/login")
        } catch {
            setError("Failed to log out")
        }
    }


    function create() {
        const id = uuid();
        props.history.push(`/room/${id}`);
    }

    function handleChange(e) {
        e.preventDefault();
        setRoom(e.target.value);
    }

    function scheduleMeet() {
        props.history.push(`/schedulemeet`);
    }

    return (
        <div className="create-room">
            <div className="image-side">
                <img src={collaborate} className="collaborate-img" />
                <p>Collaborate anytime, anywhere.</p>
            </div>
            <div className="image-left">
                <h1 className="homeHeading">Welcome to Teams</h1>
                <form onSubmit={() => props.history.push(`/room/${room}`)}>
                    <input onChange={handleChange}
                        value={room}
                        type="text"
                        placeholder="Meeting ID"
                        className="input-name" />
                </form>
                <button onClick={create} className="new-meeting">Start instant meet</button>
                <br />
                <button onClick={scheduleMeet} className="schedule-meet">Schedule a meet</button>
                <br />
                <button onClick={handleLogout} className="handle-logout">Log out</button>
            </div>
        </div>
    );
};

export default CreateRoom;
