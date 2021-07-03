import React, { useState } from "react";
import { v1 as uuid } from "uuid";
import './CreateRoom.css';

const CreateRoom = (props) => {

    const [room, setRoom] = useState("");

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
            <h1 className="homeHeading">Welcome to Teams</h1>
            <form onSubmit={() => props.history.push(`/room/${room}`)}>
                <input onChange={handleChange}
                    value={room}
                    type="text"
                    placeholder="Type URL and press ENTER"
                    className="input-name" />
            </form>
            <button onClick={create} className="new-meeting">Create new meeting</button>
            <button onClick={scheduleMeet}>Schedule a meet</button>
        </div>
    );
};

export default CreateRoom;
