import Navbar from "./Navbar";
import React, {useContext, useState} from 'react';
import Search from "./Search";
import Chats from "./Chats";
import {ActiveContext} from "../context/ActiveContext";

function Sidebar(props) {
    const {currentActive, setCurrentActive} = useContext(ActiveContext)
    return (
        <div className={`sidebar ${currentActive && 'active'}`}>
            <div className="before" onClick={() => setCurrentActive(!currentActive)}></div>
            <Navbar/>
            <Search/>
            <Chats/>
        </div>

    );
}

export default Sidebar;