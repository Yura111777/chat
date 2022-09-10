import React, {useContext, useState} from 'react';
import attach from '../img/attach.svg';
import image from '../img/img.svg';
import {AuthContext} from "../context/AuthContext";
import {ChatContext} from "../context/ChatContext";
import {doc, updateDoc, arrayUnion, Timestamp, setDoc, serverTimestamp} from 'firebase/firestore'
import {db, storage} from "../firebase";
import {v4 as uuid} from 'uuid'
import {getDownloadURL, ref, uploadBytesResumable} from "firebase/storage";
import {updateProfile} from "firebase/auth";

function Input(props) {
    const [text, setText] = useState('')
    const [img, setImage] = useState(null)
    const {currentUser} = useContext(AuthContext)
    const {data} = useContext(ChatContext)
    const handleSend = async () => {
        if(img) {
            const storageRef = ref(storage, uuid());

            const uploadTask = uploadBytesResumable(storageRef, img);
            uploadTask.on(
                (error) => {
                    // setError(true)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                        await updateDoc(doc(db,'chats', data.chatId), {
                            messages: arrayUnion({
                                id: uuid(),
                                text,
                                senderId: currentUser.uid,
                                date: Timestamp.now(),
                                img:downloadURL
                            })
                        })

                    });
                }
            );

        } else {
            await updateDoc(doc(db,'chats', data.chatId), {
                messages: arrayUnion({
                    id: uuid(),
                    text,
                    senderId: currentUser.uid,
                    date: Timestamp.now(),
                })
            })
        }
        await updateDoc(doc(db, 'userChat', currentUser.uid), {
            [data.chatId + ".lastMessage"]: {
                text
            },
            [data.chatId + '.date']: serverTimestamp(),
        })
        await updateDoc(doc(db, 'userChat', data.user.uid), {
            [data.chatId + ".lastMessage"]: {
                text
            },
            [data.chatId + '.date']: serverTimestamp(),
        })
        setImage(null)
        setText('')
    }
    return (
        <div className='input'>
            <input type="text" value={text} placeholder='Type something...' onChange={(e) => setText(e.target.value)}/>
            <div className="send">
                <img src={attach} alt="attach file"/>
                <input type="file" name="" style={{display:"none"}} id="file" onChange={e => setImage(e.target.files[0])}/>
                <label htmlFor="file">
                    <img src={image} alt="upload graphics"/>
                </label>
                <button onClick={() => handleSend()}>
                    Send
                </button>
            </div>
        </div>
    );
}

export default Input;