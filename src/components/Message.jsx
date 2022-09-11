import React, {useContext, useEffect, useRef} from 'react';
import {AuthContext} from "../context/AuthContext";
import {ChatContext} from "../context/ChatContext";

function Message({message}) {
    const {currentUser} = useContext(AuthContext)
    const {data} = useContext(ChatContext)
    const ref = useRef()
    useEffect(() => {
        ref.current?.scrollIntoView({behavior:'smooth'})
    }, [message])
    return (
        <div className={`message ${message.senderId === currentUser.uid && 'owner'}`} ref={ref}>
            <div className="message-info">
                <img src={message.senderId === currentUser.uid ? currentUser.photoURL : data.user.photoUrl} alt="user avatar"/>
                <span>Just now</span>
            </div>
            <div className="message-content">
                <p>{message.text}</p>
                {message.img && <img src={message.img} alt="user content"/>}
            </div>
        </div>
    );
}

export default Message;