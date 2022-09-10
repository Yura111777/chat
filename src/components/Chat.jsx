import React, {useContext} from 'react';
import add from '../img/add-user.svg';
import cam from '../img/camera.svg';
import more from '../img/more.svg'
import Messages from "./Messages";
import Input from "./Input";
import {ChatContext} from "../context/ChatContext";

function Chat(props) {
    const {data} = useContext(ChatContext)

    return (
        <div className='chat'>
            <div className="chat-info">
                <span>{data.user?.displayName}</span>
                <div className="chat-info-icons">
                    <img src={add} alt="add user to a chat"/>
                    <img src={cam} alt="video chat with user"/>
                    <img src={more} alt="more options"/>
                </div>
            </div>
            <Messages/>
            <Input/>
        </div>

    );
}

export default Chat;