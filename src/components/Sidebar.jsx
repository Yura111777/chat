import Navbar from "./Navbar";
import React, {useState} from 'react';
import Search from "./Search";
import Chats from "./Chats";

function Sidebar(props) {
    const [active, setActive] = useState(false)
    return (
        <div className={`sidebar ${active && 'active'}`}>
            <div className="before" onClick={() => setActive(!active)}></div>
            <Navbar/>
            <Search/>
            <Chats/>
        </div>

    );
}

export default Sidebar;