import React, {useContext, useEffect, useState} from 'react';
import { doc, onSnapshot } from "firebase/firestore";
import {db} from "../firebase";
import {AuthContext} from "../context/AuthContext";
import {ChatContext} from "../context/ChatContext";
import {ActiveContext} from "../context/ActiveContext";

function Chats(props) {
    const [chats,setChats] = useState([])
    const {currentUser} = useContext(AuthContext)
    const {dispatch} = useContext(ChatContext)
    const {currentActive, setCurrentActive} = useContext(ActiveContext)
    useEffect(() => {
        const getChats = () => {
            const unsub = onSnapshot(doc(db, "userChat", currentUser.uid ), (doc) => {
                setChats(doc.data())
            });
            return () => {
                unsub()
            }
        }
        currentUser.uid && getChats()
    },[currentUser.uid])
    const handleSelect = (user) => {
        dispatch({type:'CHANGE_USER', payload: user })
        setCurrentActive(!currentActive)
    }
    return (
        <div className='chats'>
            {Object.entries(chats)?.sort((a,b) => b[1].date - a[1].date).map(chat => {
                return (
                    <div className="user-chat" key={chat[0]} onClick={() => handleSelect(chat[1].userInfo)}>
                        {console.log(chat[1])}
                        <img src={chat[1].userInfo.photoUrl} alt="user avatar"/>
                        <div className="user-chat-info">
                            <span>{chat[1].userInfo.displayName}</span>
                            <p>{chat[1].lastMessage?.text}</p>
                        </div>
                    </div>
                )
            })}

        </div>
    );
}

export default Chats;