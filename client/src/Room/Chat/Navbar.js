import React from 'react';
import './Navbar.css';
import { IconContext } from 'react-icons';
import Chat from './Chat';

function Navbar(props) {

    return (
        <>
            <IconContext.Provider value={{ color: '#fff' }}>
                <nav className={props.chat ? 'nav-menu active' : 'nav-menu'}>
                    <Chat socketRef={props.socketRef} username={props.username} />
                </nav>
            </IconContext.Provider>
        </>
    );
}

export default Navbar;
