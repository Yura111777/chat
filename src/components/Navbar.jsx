import React, {useContext} from 'react';
import {signOut} from 'firebase/auth'
import {auth} from "../firebase";
import {AuthContext} from "../context/AuthContext";
import defaulttpic from '../img/default.svg'

function Navbar(props) {
    const {currentUser} = useContext(AuthContext)
    return (
        <div className='navbar'>
            <span className="logo">Ark Chat</span>
            <div className="user">
                <img src={currentUser.photoURL ? currentUser.photoURL : defaulttpic} alt="user avatar"/>
                <span>{currentUser.displayName}</span>
                <button onClick={() => signOut(auth)}>Logout</button>
            </div>
        </div>

    );
}

export default Navbar;