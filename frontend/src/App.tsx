import { useEffect, useState, useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import type { DeviceData } from "./types/devies.types";

import Home from "./pages/Home";
import GameBoard from "./pages/GameBoard";
import ActivityLog from "./pages/ActivityLog";
import Ranking from "./pages/Ranking";
import Summary from "./pages/Summary";
import TT from "./pages/l-useState";
import Navbar from "./pages/Navbar";
import Map from "./pages/Map";

import "./index.css";

export default function App() {
  const [stream, setStream] = useState<DeviceData[]>([]);
  const bufferRef = useRef<DeviceData[]>([]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000/ws");
    let counter = 0;

    ws.onmessage = (event) => {
      const rawData = JSON.parse(event.data);
      const newData: DeviceData = {
        ...rawData,
        id: `${Date.now()}-${counter++}`,
      };

      bufferRef.current = [newData, ...bufferRef.current].slice(0, 100);
    };

    const interval = setInterval(() => {
      if (bufferRef.current.length > 0) {
        setStream([...bufferRef.current]);
      }
    }, 100);

    return () => {
      ws.close();
      clearInterval(interval);
    };
  }, []);

  const latest = stream[0];

  return (
    <Router>
      <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50">
        <Navbar />

        {/* <main className="py-12 px-8 max-w-7xl mx-auto w-full"> */}
        <Routes>
          <Route path="/" element={<Home latest={latest} stream={stream} />} />

          <Route path="/game" element={<GameBoard />} />

          <Route
            path="/activity-log"
            element={<ActivityLog stream={stream} />}
          />

          <Route path="/ranking" element={<Ranking />} />
          <Route path="/tt" element={<TT />} />
          <Route path="/summary" element={<Summary />} />
          <Route path="/map" element={<Map />} />

          <Route
            path="*"
            element={
              <div className="text-center py-20">
                <h1 className="text-3xl font-extrabold text-red-500 tracking-tight">
                  404 - Page Not Found
                </h1>
                <p className="text-slate-400 mt-2 text-base">
                  The page you are looking for does not exist.
                </p>
              </div>
            }
          />
        </Routes>
        {/* </main> */}
      </div>
    </Router>
  );
}
