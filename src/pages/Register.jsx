import pic from '../user-pic.svg';
import {  createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, storage, db } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";

import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";

function Register(props) {
    const [error, setError] = useState(false)
    const navigate = useNavigate()
    const handleSubmit = async (e)=> {
        e.preventDefault()
        const displayName = e.target[0].value;
        const email = e.target[1].value;
        const password = e.target[2].value;
        const file = e.target[3].files[0];
        try {
            const res = await createUserWithEmailAndPassword(auth, email, password)

            const storageRef = ref(storage, displayName);

            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                (error) => {
                    setError(true)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                        await updateProfile(res.user,{
                            displayName,
                            photoURL: downloadURL
                        })
                        await setDoc(doc(db, 'users', res.user.uid), {
                            uid: res.user.uid,
                            displayName,
                            email,
                            photoUrl: downloadURL,
                        })
                        await setDoc(doc(db, 'userChat', res.user.uid), {})
                        navigate('/')
                    });
                }
            );

        } catch(err){
            setError(true)
        }


    }
    return (
        <div className='form-container'>
            <div className="form-wrapper">
                   <span className="logo">
                       Ark Chat
                   </span>
                <span className="title">
                       Register
                   </span>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder='Display name'/>
                    <input type="email" placeholder='Email'/>
                    <input type="password" placeholder='Password'/>
                    <input type="file" id='file' className='file'/>
                    <label htmlFor="file" className='file-folder'>
                        <img src={pic} width='40' alt="label avatar"/>
                        Add an avatar
                    </label>
                    <button>Sign up</button>
                </form>
                {error && <span>Something went wrong!</span> }
                <p>
                    Do you have an account? Login
                </p>
            </div>
        </div>
    );
}

export default Register;