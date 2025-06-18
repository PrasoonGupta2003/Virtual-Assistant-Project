import React, { useRef, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { userDataContext } from '../context/userContext';
import { MdKeyboardBackspace } from "react-icons/md";
import { RiImageAddLine } from "react-icons/ri";

import Card from '../components/Card';
import image1 from "../assets/image1.png";
import image2 from "../assets/image2.jpg";
import image3 from "../assets/authBg.png";
import image4 from "../assets/image4.png";
import image5 from "../assets/image5.png";
import image6 from "../assets/image6.jpeg";
import image7 from "../assets/image7.jpeg";

function Customise() {
  const { serverUrl, userData, setUserData, backendImage, setBackendImage, frontendImage, setFrontendImage, selectedImage, setSelectedImage } = useContext(userDataContext);
  const inputImage = useRef();
  const navigate = useNavigate();

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-tr from-black to-[#030353] flex flex-col justify-start items-center px-4 py-10 sm:py-12">
      {/* Back Button */}
      <MdKeyboardBackspace
        className="absolute top-4 left-4 text-white w-8 h-8 cursor-pointer sm:top-6 sm:left-6"
        onClick={() => navigate("/")}
      />

      {/* Heading */}
      <h1 className="text-white text-2xl sm:text-3xl font-semibold mb-8 text-center">
        Select your <span className="text-blue-500">Assistant Image</span>
      </h1>

      {/* Card Grid */}
      <div className="w-full max-w-6xl flex flex-wrap justify-center gap-5 sm:gap-6 px-2">
        <Card image={image1} />
        <Card image={image2} />
        <Card image={image3} />
        <Card image={image4} />
        <Card image={image5} />
        <Card image={image6} />
        <Card image={image7} />

        {/* Upload Custom Image */}
        <div
          className={`w-36 h-56 sm:w-40 sm:h-60 bg-[#09093e70] border-2 rounded-2xl overflow-hidden flex items-center justify-center cursor-pointer transition-all hover:border-4 hover:shadow-2xl hover:shadow-blue-900 ${
            selectedImage === "input" ? "border-white shadow-2xl shadow-blue-900" : ""
          }`}
          onClick={() => {
            inputImage.current.click();
            setSelectedImage("input");
          }}
        >
          {!frontendImage ? (
            <RiImageAddLine className="text-white w-8 h-8" />
          ) : (
            <img src={frontendImage} className="h-full w-full object-cover" />
          )}
        </div>
        <input type="file" accept="image/*" ref={inputImage} hidden onChange={handleImage} />
      </div>

      {/* Next Button */}
      {selectedImage && (
        <button
          className="mt-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-3 text-lg font-semibold shadow-lg transition-all"
          onClick={() => navigate("/customise2")}
        >
          Next
        </button>
      )}
    </div>
  );
}

export default Customise;
