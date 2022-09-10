import React, {useContext, useState} from 'react';
import { collection, query, where, getDoc, getDocs, setDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import {db} from '../firebase'
import {AuthContext} from "../context/AuthContext";
import {ActiveContext} from "../context/ActiveContext";


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
    const handleKey = async (e) => {
        e.preventDefault()
        await handleSearch();
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
                // console.log(user, '=====================')
                const resss = await updateDoc(doc(db, 'userChat', user.uid), {
                    [combinedId+".userInfo"]: {
                        uid: currentUser.uid,
                        displayName: currentUser.displayName,
                        photoUrl: currentUser.photoURL
                    },
                    [combinedId+".date"]:serverTimestamp()
                })
                console.log(resss,1111111111111111111111)
            }

        } catch (e) {
            console.log(e)
        }

        setUser(null)
        setUserName('')
        // create user chat
    }
    return (
        <div className='search'>
            <div className="search-form">
                <form onSubmit={handleKey}>
                    <input type="text" placeholder='Find a user' value={userName}  onChange={(e) => setUserName(e.target.value)}/>
                </form>
            </div>
            {user && <div className="user-chat" onClick={() => handleSelect()}>
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