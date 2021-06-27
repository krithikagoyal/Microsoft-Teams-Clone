import React, {useState} from "react";
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

    return (
        <>
            <h1 className="homeHeading">Welcome to Teams</h1>
            <form onSubmit={() => props.history.push(`/room/${room}`)}>
                <input onChange={handleChange}
                    value={room}
                    type="text"
                    placeholder="Enter URL and press ENTER" />
            </form>
            <button onClick={create}>Start new meeting</button>
        </>
    );
};

export default CreateRoom;
