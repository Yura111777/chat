import React, {useContext, useState} from 'react';
import { collection, query, where, getDoc, getDocs, setDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import {db} from '../firebase'
import {AuthContext} from "../context/AuthContext";


function Search(props) {
    const [userName, setUserName] = useState('')
    const [user, setUser] = useState(null)
    const [err, setUErr] = useState(false)
    const {currentUser} = useContext(AuthContext)
    const handleSearch = async () => {
        const q = query(collection(db, 'users'),where('displayName','==', userName))
        try{
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                setUser(doc.data())

            });
        } catch (err){
            setUErr(true)
        }

    }
    const handleKey = (e) => {
        e.code === 'Enter' && handleSearch();
    }
    const handleSelect = async () => {
        // check if chats group exits, if not create new
        const combinedId = currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid
        try{
            const res  = await getDoc(doc(db, 'chats', combinedId))
            if(!res.exists()){
                //create chat collection
                await setDoc(doc(db,'chats', combinedId), {messages:[]})
                // create user chat
                await updateDoc(doc(db, 'userChat', currentUser.uid), {
                    [combinedId+".userInfo"]: {
                        uid: user.uid,
                        displayName: user.displayName,
                        photoUrl: user.photoUrl
                    },
                    [combinedId+".date"]:serverTimestamp()
                })
                await updateDoc(doc(db, 'userChat', user.uid), {
                    [combinedId+".userInfo"]: {
                        uid: currentUser.uid,
                        displayName: currentUser.displayName,
                        photoUrl: currentUser.photoUrl
                    },
                    [combinedId+".date"]:serverTimestamp()
                })

            }
        } catch (e) {

        }

        setUser(null)
        setUserName('')
        // create user chat
    }
    return (
        <div className='search'>
            <div className="search-form">
                <input type="text" placeholder='Find a user' value={userName} onKeyDown={handleKey} onChange={(e) => setUserName(e.target.value)}/>
            </div>
            {user && <div className="user-chat" onClick={() => handleSelect}>
                {console.log(user)}
                <img src={user.photoUrl} alt=""/>
                <div className="user-chat-info">
                    <span>{user.displayName}</span>
                </div>
            </div>}
            {err && <span>Something went wrong</span>}
        </div>
    );
}

export default Search;