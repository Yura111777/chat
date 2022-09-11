import React, {useContext, useState} from 'react';
import i from '../img/i.svg';
import close from '../img/close.png';
import image from '../img/img.svg';
import {AuthContext} from "../context/AuthContext";
import {ChatContext} from "../context/ChatContext";
import {doc, updateDoc, arrayUnion, Timestamp, setDoc, serverTimestamp} from 'firebase/firestore'
import {db, storage} from "../firebase";
import {v4 as uuid} from 'uuid'
import {getDownloadURL, ref, uploadBytesResumable} from "firebase/storage";


function Input(props) {
    const [text, setText] = useState('')
    const [modal, setModal] = useState(false)
    const [img, setImage] = useState(null)
    const {currentUser} = useContext(AuthContext)
    const {data} = useContext(ChatContext)
    const handleSend = async () => {
        const name = uuid();
        if(img) {
            const storageRef = ref(storage, name );
            const uploadTask = uploadBytesResumable(storageRef, img);
            uploadTask.on(
                (error) => {
                    // setError(true)
                    console.log(error)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                        await updateDoc(doc(db,'chats', data.chatId), {
                            messages: arrayUnion({
                                id: uuid(),
                                text,
                                senderId: currentUser.uid,
                                date: Timestamp.now(),
                                img: downloadURL,
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
                <img src={i} alt="attach file" title='Image resolution must be smaller or equal 1920x1080' onClick={() => setModal(true)}/>
                <input type="file" name="" style={{display:"none"}} id="file" onChange={(e) => setImage(e.target.files[0])}/>
                <label htmlFor="file" style={img ? {background: '#282c34'}: {}}>
                    <img src={image} alt="upload graphics"/>
                </label>
                <button onClick={() => handleSend()}>
                    Send
                </button>
            </div>
            <div className={`modal ${modal && 'active'}`}>
                <div className="body">
                    <span className="close" onClick={() => setModal(false)}>
                        <img src={close} alt="close button" width='16'/>
                    </span>
                    <p>
                        Image resolution must be smaller or equal 1920x1080
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Input;