import React, { useContext, useEffect, useState } from 'react';
import { userDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BiLogOut } from "react-icons/bi";
import { FaHistory } from "react-icons/fa";
import { MdSettingsVoice } from "react-icons/md";
import { HiMenuAlt3 } from "react-icons/hi";

function Home() {
  const navigate = useNavigate();
  const { userData, serverUrl, setUserData, getGeminiResponse } = useContext(userDataContext);
  const [assistantOutput, setAssistantOutput] = useState(null);
  const [history, setHistory] = useState([]);
  const [inputText, setInputText] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  let recognition;

  const handleLogout = async () => {
    const confirmLogout = window.confirm("⚠ Are you sure you want to logout?");
    if (!confirmLogout) return;

    try {
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
      setUserData(null);
      navigate("/signin");
    } catch (e) {
      console.log(e);
      setUserData(null);
    }
  };

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;
      window.speechSynthesis.speak(utterance);
    } else {
      console.log("Speech synthesis not supported.");
    }
  };

  const handleUserInput = async (transcript) => {
    const data = await getGeminiResponse(transcript);
    if (data && data.response) {
      speak(data.response);
      const fullEntry = {
        input: transcript,
        output: data.response,
        details: data.details || "",
        link: data.link || "",
        timestamp: new Date().toLocaleString()
      };
      setAssistantOutput(fullEntry);
      setHistory(prev => [...prev, fullEntry]);

      await axios.post(
        `${serverUrl}/api/history/add`,
        {
          input: fullEntry.input,
          output: fullEntry.output,
          details: fullEntry.details,
          link: fullEntry.link
        },
        { withCredentials: true }
      );
    } else {
      speak("Sorry, I couldn't understand that.");
      setAssistantOutput(null);
    }
  };

  const startAssistant = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = 'en-US';

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      console.log("heard:", transcript);

      if (transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) {
        await handleUserInput(transcript);
      }
    };

    recognition.onend = () => recognition.start();
    recognition.start();
  };

  const handleTextSubmit = async (e) => {
    e.preventDefault();
    if (inputText.trim()) {
      await handleUserInput(inputText);
    }
    setInputText("");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-tr from-[#0f172a] to-[#1e293b] flex flex-col items-center justify-start gap-6 px-4 py-6 sm:px-6 md:px-10 lg:px-16">

      {/* Navbar */}
      <div className="w-full flex justify-between items-center px-4 py-4 bg-white/10 border-b border-cyan-500 rounded-xl shadow-md">
        <h1 className="text-cyan-400 text-xl sm:text-2xl font-bold">🧠 Voice Assistant</h1>
        <div className="hidden sm:flex gap-4">
          <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-semibold text-sm flex items-center gap-2">
            Logout <BiLogOut size={18} />
          </button>
          <button onClick={() => navigate("/customise")} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-semibold text-sm">
            Customise
          </button>
          <button onClick={() => navigate("/history", { state: { history } })} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md font-semibold text-sm flex items-center gap-2">
            History <FaHistory size={16} />
          </button>
        </div>

        {/* Hamburger Icon */}
        <div className="sm:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-white focus:outline-none">
            <HiMenuAlt3 size={28} />
            </button>
        </div>
        </div>

      {/* Hamburger Menu Items */}
        {menuOpen && (
        <div className="flex flex-col sm:hidden w-full px-4 mb-4 gap-3 animate-slide-down transition-all duration-300">
            <button onClick={handleLogout} className="bg-rose-600 hover:bg-rose-700 text-white py-2 rounded-md font-semibold text-sm flex justify-center items-center gap-2">
            Logout <BiLogOut size={18} />
            </button>
            <button onClick={() => navigate("/customise")} className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md font-semibold text-sm flex justify-center items-center">
            Customize
            </button>
            <button onClick={() => navigate("/history", { state: { history } })} className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-md font-semibold text-sm flex justify-center items-center gap-2">
            History <FaHistory size={16} />
            </button>
        </div>
        )};   

      {/* Assistant Avatar */}
      <div className="w-60 h-80 sm:w-72 sm:h-96 flex justify-center items-center overflow-hidden rounded-2xl shadow-2xl border-2 border-white">
        <img src={userData?.assistantImage} alt="assistant" className="h-full w-full object-cover" />
      </div>

      {/* Welcome Text */}
      <h1 className="text-white text-lg sm:text-xl text-center mt-4">
        👋 Hello Boss! I'm <span className="font-bold text-cyan-400">{userData?.assistantName}</span>
      </h1>
      <p className="text-white text-sm sm:text-base text-center">Let’s make today productive — how may I help you?</p>

      {/* Start Assistant Button */}
      <button
        onClick={startAssistant}
        className="mt-2 px-5 py-3 sm:px-6 sm:py-4 bg-green-600 hover:bg-green-700 text-white rounded-full text-sm sm:text-lg font-semibold flex items-center gap-2 shadow-lg transition-all"
      >
        Start Assistant <MdSettingsVoice size={20} />
      </button>

      {/* Keyboard Input */}
      <form onSubmit={handleTextSubmit} className="flex flex-col sm:flex-row gap-3 mt-4 w-full max-w-md">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your query..."
          className="px-4 py-2 rounded-lg border border-cyan-300 bg-white text-black w-full"
        />
        <button
          type="submit"
          className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg font-semibold w-full sm:w-auto"
        >
          Ask
        </button>
      </form>

      {/* Output Display */}
      {assistantOutput && (
        <div className="mt-4 bg-white/10 backdrop-blur-md rounded-xl p-4 w-full max-w-lg text-white shadow-inner border border-cyan-300">
          <p className="font-medium text-sm text-gray-400">👤 You: {assistantOutput.input}</p>
          <p className="font-semibold text-cyan-300 mt-2">🤖 {assistantOutput.output}</p>

          {assistantOutput.details && (
            <p className="mt-2 text-sm text-gray-300">{assistantOutput.details}</p>
          )}

          {assistantOutput.link && (
            <a
              href={assistantOutput.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block text-blue-400 underline text-sm"
            >
              Tap to open 🔗
            </a>
          )}

          <p className="text-xs text-right text-gray-400 mt-2">
            ⏱ {assistantOutput.timestamp}
          </p>
        </div>
      )}
    </div>
  );
}

export default Home;
