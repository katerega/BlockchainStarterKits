// File: src/App.jsx
import React, { useEffect, useState } from "react";
import ChartCard from "./components/ChartCard";
import "./App.css";

const mockData = [
  { time: "10 AM", txs: 120 },
  { time: "11 AM", txs: 150 },
  { time: "12 PM", txs: 200 },
  { time: "1 PM", txs: 180 },
  { time: "2 PM", txs: 220 },
];

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Simulate API call (replace with real Poktroll relay data fetch here)
    setTimeout(() => {
      setData(mockData);
    }, 1000);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-4">🇺🇬 Uganda DeFi & DAO Pulse</h1>
      <p className="mb-6">Live dashboard of DeFi transactions and DAO activity in Uganda</p>

      <ChartCard title="🔁 Transaction Volume (Hourly)" data={data} />

      <div className="mt-8 bg-gray-800 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">💡 Sponsored by</h2>
        <p>Your Web3 startup or DAO could be featured here. Contact us below to sponsor!</p>
      </div>

      <div className="mt-6 text-sm text-gray-400">
        Built with Poktroll • Last updated: {new Date().toLocaleString()}
      </div>
    </div>
  );
}

export default App;

// File: src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// File: src/index.css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');

body {
  margin: 0;
  font-family: 'Inter', sans-serif;
  background-color: #1a202c;
  color: white;
}

/* Tailwind CSS can be added via CDN or PostCSS if desired */
