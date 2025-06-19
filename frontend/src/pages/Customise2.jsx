import React, { useState, useContext } from 'react';
import { userDataContext } from '../context/UserContext';
import axios from 'axios';
import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

function Customise2() {
  const { userData, backendImage, selectedImage, serverUrl, setUserData } = useContext(userDataContext);
  const [assistantName, setAssistantName] = useState(userData?.assistantName || "");
  const navigate = useNavigate();

  const handleUpdateAssistant = async () => {
    try {
      let formData = new FormData();
      formData.append("assistantName", assistantName);
      if (backendImage) {
        formData.append("assistantImage", backendImage);
      } else {
        formData.append("imageUrl", selectedImage);
      }

      const result = await axios.post(`${serverUrl}/api/user/update`, formData, { withCredentials: true });
      setUserData(result.data);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-t from-black to-[#030353] flex flex-col justify-center items-center px-4 sm:px-6 py-10 relative">
      
      {/* Back Button */}
      <MdKeyboardBackspace
        className="absolute top-4 left-4 sm:top-6 sm:left-6 text-white w-8 h-8 sm:w-9 sm:h-9 cursor-pointer"
        onClick={() => navigate("/customise")}
      />

      {/* Title */}
      <h1 className="text-white text-2xl sm:text-3xl font-semibold text-center mb-8">
        Select your <span className="text-blue-500">Assistant Name</span>
      </h1>

      {/* Input Field */}
      <input
        type="text"
        placeholder="Enter Assistant Name"
        className="w-full max-w-xl px-4 py-3 sm:py-4 text-base sm:text-lg rounded-full border-2 border-white bg-transparent text-white placeholder-gray-300 outline-none"
        required
        value={assistantName}
        onChange={(e) => setAssistantName(e.target.value)}
      />

      {/* Button */}
      {assistantName && (
        <button
          className="mt-6 sm:mt-8 w-full max-w-xs h-[55px] sm:h-[60px] bg-blue-600 hover:bg-blue-700 transition-all rounded-full text-white font-semibold text-lg sm:text-xl shadow-md"
          onClick={handleUpdateAssistant}
        >
          Create your Assistant
        </button>
      )}
    </div>
  );
}

export default Customise2;
