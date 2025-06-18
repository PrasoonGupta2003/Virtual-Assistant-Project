import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { userDataContext } from "../context/userContext";
import axios from "axios";
import bg from "../assets/authBg.png";

function SignUp() {
  const { serverUrl, setUserData } = useContext(userDataContext);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        { name, email, password },
        { withCredentials: true }
      );
      setUserData(result.data);
      navigate("/customise");
    } catch (error) {
      console.error(error);
      setUserData(null);
      setErr(error?.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div
      className="w-full min-h-screen bg-cover bg-center flex items-center justify-center px-4 sm:px-8"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <form
        onSubmit={handleSignUp}
        className="w-full max-w-md bg-black/60 backdrop-blur-md rounded-xl shadow-xl p-6 sm:p-8 flex flex-col gap-5"
      >
        <h1 className="text-white text-2xl sm:text-3xl font-semibold text-center mb-2">
          Register to <span className="text-blue-500">Virtual Assistant</span>
        </h1>

        <input
          type="text"
          placeholder="Enter Username"
          className="w-full px-4 py-3 text-base sm:text-lg rounded-full border-2 border-white bg-transparent text-white placeholder-gray-300 outline-none"
          required
          onChange={(e) => setName(e.target.value)}
          value={name}
        />

        <input
          type="email"
          placeholder="Enter Email"
          className="w-full px-4 py-3 text-base sm:text-lg rounded-full border-2 border-white bg-transparent text-white placeholder-gray-300 outline-none"
          required
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />

        <div className="relative w-full">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter Password"
            className="w-full px-4 py-3 pr-12 text-base sm:text-lg rounded-full border-2 border-white bg-transparent text-white placeholder-gray-300 outline-none"
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          {showPassword ? (
            <IoEyeOff
              className="absolute top-3.5 right-4 text-white text-xl cursor-pointer"
              onClick={() => setShowPassword(false)}
            />
          ) : (
            <IoEye
              className="absolute top-3.5 right-4 text-white text-xl cursor-pointer"
              onClick={() => setShowPassword(true)}
            />
          )}
        </div>

        {err && (
          <p className="text-sm sm:text-base text-red-500 font-medium -mt-2">
            * {err}
          </p>
        )}

        <button
          type="submit"
          className="w-full mt-2 bg-blue-600 hover:bg-blue-700 transition-all text-white font-semibold text-lg py-3 rounded-full shadow-md"
        >
          Sign up
        </button>

        <p
          className="text-center text-sm sm:text-base text-white mt-4 cursor-pointer"
          onClick={() => navigate("/signin")}
        >
          Already have an account?{" "}
          <span className="text-blue-400 font-semibold underline">Sign In</span>
        </p>
      </form>
    </div>
  );
}

export default SignUp;
