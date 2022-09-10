import {createContext, useEffect, useState} from "react";
import {auth} from "../firebase";
import {onAuthStateChanged} from 'firebase/auth'

export const ActiveContext = createContext();
export const ActiveContextProvider = ({children}) => {
    const [currentActive, setCurrentActive] = useState(false);

    useEffect(() => {
        const unsub = () => {
            setCurrentActive(!currentActive);
        }
        return () => {
            unsub()
        }
    }, [currentActive]);
    return (
        <ActiveContext.Provider value={{currentActive, setCurrentActive}}>
            {children}
        </ActiveContext.Provider>
    )
}