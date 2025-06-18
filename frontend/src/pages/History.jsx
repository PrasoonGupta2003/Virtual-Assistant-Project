import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { userDataContext } from '../context/userContext';

const History = () => {
  const navigate = useNavigate();
  const { serverUrl } = useContext(userDataContext);
  const [historyData, setHistoryData] = useState([]);

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${serverUrl}/api/history/get`, {
        method: 'GET',
        credentials: 'include'
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setHistoryData(data);
      } else {
        console.error("Unexpected response:", data);
      }
    } catch (error) {
      console.error("Failed to fetch history:", error);
    }
  };

  const handleDeleteHistory = async () => {
    if (!window.confirm("⚠ Are you sure you want to delete all history?")) return;

    try {
      const res = await fetch(`${serverUrl}/api/history/delete`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        setHistoryData([]);
        alert("✅ History deleted successfully.");
      } else {
        alert("❌ Failed to delete history.");
      }
    } catch (error) {
      console.error(error);
      alert("❌ Error deleting history.");
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white p-4 sm:p-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/")}
          className="text-cyan-400 underline text-sm font-medium hover:text-cyan-300 transition-all"
        >
          ⬅ Back to Assistant
        </button>

        {historyData.length > 0 && (
          <button
            onClick={handleDeleteHistory}
            className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-md font-semibold text-sm shadow"
          >
            🗑️ Delete All History
          </button>
        )}
      </div>

      {/* Header */}
      <h2 className="text-2xl sm:text-3xl font-bold text-cyan-300 mb-4 text-center sm:text-left">🧠 Session History</h2>

      {/* History Content */}
      <div className="space-y-6">
        {historyData.length === 0 ? (
          <p className="text-gray-400 italic text-center sm:text-left">No history available.</p>
        ) : (
          historyData.map((entry, idx) => (
            <div
              key={idx}
              className="bg-white/10 backdrop-blur-sm border border-cyan-400 p-4 rounded-xl shadow-md"
            >
              <p className="text-sm text-gray-300 mb-1">👤 <span className="font-semibold text-white">You:</span> {entry.input}</p>
              <p className="text-cyan-300 font-medium mt-1">🤖 {entry.output}</p>
              {entry.details && <p className="text-sm text-gray-400 mt-2">{entry.details}</p>}
              {entry.link && (
                <a
                  href={entry.link}
                  className="text-sm text-blue-400 underline mt-2 block"
                  target="_blank"
                  rel="noreferrer"
                >
                  🔗 Link
                </a>
              )}
              <p className="text-xs text-right mt-2 text-gray-500">{entry.timestamp}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default History;
