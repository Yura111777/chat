import pic from '../user-pic.svg';
import {  createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, storage, db } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";

import React, {useState} from 'react';
import {Link, useNavigate} from "react-router-dom";

function Register(props) {
    const [error, setError] = useState(false)
    const [err, setErr] = useState(null)
    const navigate = useNavigate()
    const [image,setImage] = useState(null)
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
                    setErr(error.message)
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
            setErr(err.message)
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
                    <input type="file" id='file' onChange={(e) => setImage(e.target.files[0].name)} className='file'/>
                    <label htmlFor="file" className='file-folder'>
                        <img src={pic} width='40' alt="label avatar"/>
                        {image ? (<span className='img-name'>{image}</span>)  : 'Add an avatar'}
                    </label>
                    <button>Sign up</button>
                </form>
                {error &&  (<span>{err}</span>) }
                <p>
                    Do you have an account? <Link to='/login'>Login</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;