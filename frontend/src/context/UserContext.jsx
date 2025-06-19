import axios from 'axios';

import React from 'react';
import { createContext, useState, useEffect} from 'react';

export const userDataContext=createContext();
function UserContext({children}) {
    const serverUrl="https://virtual-assistant-project.onrender.com";
    const [userData, setUserData] = useState(null);
    const [frontendImage, setFrontendImage] = useState(null);
    const [backendImage, setBackendImage] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const handleCurrentUser=async ()=>{
        try{
            const result =await axios.get(`${serverUrl}/api/user/current`,{withCredentials:true});
            setUserData(result.data);
            console.log(result.data);
        }catch(e){
            console.log(e);
        }
    }
    const getGeminiResponse = async (command) => {
    try {
        const result = await axios.post(
        `${serverUrl}/api/user/asktoassistant`,
        { command },
        { withCredentials: true }
        );
        return result.data;
    } catch (error) {
        console.log(error);
    }
    };
    useEffect(()=>{
        handleCurrentUser();
    },[])
    const value={
        serverUrl, userData, setUserData, backendImage, setBackendImage, frontendImage, setFrontendImage, selectedImage, setSelectedImage, getGeminiResponse
    }
    return ( 
        <div>
            <userDataContext.Provider value={value}>
                {children} 
            </userDataContext.Provider>
        </div>
     );
}

export default UserContext;
