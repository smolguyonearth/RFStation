import { useState, useEffect } from "react";
import { Lightbulb } from "lucide-react";

export default function LedSimulation() {
  const [matrix, setMatrix] = useState<number[][]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial state
  useEffect(() => {
    fetch("/api/led/status")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMatrix(data.matrix);
        } else {
          setError("Failed to load matrix state");
        }
      })
      .catch((err) => setError(err.message));
  }, []);

  // Listen for WebSocket updates
  useEffect(() => {
    const ws = new WebSocket(`ws://${window.location.host}/ws`);
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "led_update" && data.matrix) {
          setMatrix(data.matrix);
        }
      } catch (e) {
        console.error("WS Parse error:", e);
      }
    };

    return () => ws.close();
  }, []);

  const handleUpdate = async (row: number, col: number, targetOwner: number) => {
    // If clicking the active owner, toggle it off (0)
    const newOwner = matrix[row][col] === targetOwner ? 0 : targetOwner;

    try {
      const res = await fetch("/api/led/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ row, col, owner: newOwner })
      });
      const data = await res.json();
      if (data.success) {
        // Optimistic update if WebSocket is slow
        setMatrix(data.matrix);
      }
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  if (!matrix || matrix.length === 0) {
    return <div className="p-8 text-brand-primary font-bold flex justify-center">Loading LED Matrix...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 animate-in fade-in duration-500 bg-brand-bg min-h-[calc(100vh-80px)]">
      <div className="flex items-center gap-3 mb-8">
        <Lightbulb size={32} className="text-brand-accent" />
        <h1 className="text-3xl font-black text-brand-primary tracking-wide">LED Matrix Simulator</h1>
      </div>
      
      {error && (
        <div className="bg-red-100 text-red-700 border border-red-300 px-4 py-2 rounded-lg mb-6 shadow-sm">
          {error}
        </div>
      )}

      <div className="bg-white border border-brand-border p-8 rounded-3xl shadow-xl">
        <div className="flex flex-col gap-6">
          {matrix.map((rowData, rowIndex) => (
            <div key={rowIndex} className="flex gap-6 justify-center">
              {rowData.map((owner, colIndex) => (
                <div key={`${rowIndex}-${colIndex}`} className="flex flex-col items-center bg-gray-50 p-5 rounded-3xl border border-gray-200 shadow-inner">
                  <span className="text-brand-primary text-[10px] font-black uppercase tracking-widest mb-4 bg-white border border-gray-200 px-3 py-1 rounded-full shadow-sm">
                    Place [{rowIndex},{colIndex}]
                  </span>
                  
                  <div className="flex gap-4">
                    {/* Player 1 LED (Blue) */}
                    <button
                      onClick={() => handleUpdate(rowIndex, colIndex, 1)}
                      className={`
                        w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 
                        transition-all duration-300 ease-out hover:scale-110 active:scale-95
                        flex items-center justify-center
                        ${owner === 1 
                          ? 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)] border-blue-400 opacity-100 scale-105' 
                          : 'bg-gray-200 border-gray-300 opacity-50 shadow-inner'
                        }
                      `}
                      aria-label={`Set Player 1 at row ${rowIndex}, col ${colIndex}`}
                    />
                    
                    {/* Player 2 LED (Red) */}
                    <button
                      onClick={() => handleUpdate(rowIndex, colIndex, 2)}
                      className={`
                        w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 
                        transition-all duration-300 ease-out hover:scale-110 active:scale-95
                        flex items-center justify-center
                        ${owner === 2 
                          ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.6)] border-red-400 opacity-100 scale-105' 
                          : 'bg-gray-200 border-gray-300 opacity-50 shadow-inner'
                        }
                      `}
                      aria-label={`Set Player 2 at row ${rowIndex}, col ${colIndex}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
        
        <div className="mt-8 flex justify-center gap-6 text-sm font-bold text-brand-primary">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gray-200 border border-gray-300 shadow-inner"></div>
            <span>Empty</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>Player 1</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>Player 2</span>
          </div>
        </div>
      </div>
    </div>
  );
}
