import { useState } from "react";
import Footer from "./Footer";
import type { ActivityLog } from "../types/game.types";
import { mockActivityLogs, gameSessions } from "../data/game.mock";
import type { DeviceData } from "../types/devies.types";

interface ActivityLogProps {
  stream?: DeviceData[];
}

const getPlayerAccent = (actorId: string) => {
  if (actorId === "player_01") return "bg-[#bfdbfe] dark:bg-blue-500"; // Light Blue
  if (actorId === "player_02") return "bg-[#fbcfe8] dark:bg-pink-500"; // Pink
  if (actorId === "player_03") return "bg-[#fef08a] dark:bg-amber-500"; // Yellow
  if (actorId === "SYSTEM") return "bg-[#e7e5e4] dark:bg-slate-500"; // Stone/Gray
  return "bg-slate-200 dark:bg-slate-600";
};

const getStatusBadge = (status: ActivityLog["status"]) => {
  switch (status) {
    case "SUCCESS":
      return "bg-[#dcfce7] text-[#166534] border-[#bbf7d0] dark:bg-[#052e16] dark:border-[#14532d] dark:text-[#4ade80]";
    case "REJECTED":
      return "bg-[#ffedd5] text-[#9a3412] border-[#fed7aa] dark:bg-[#431407] dark:border-[#7c2d12] dark:text-[#fb923c]";
    case "ERROR":
      return "bg-[#ffe4e6] text-[#9f1239] border-[#fecdd3] dark:bg-[#4c0519] dark:border-[#881337] dark:text-[#fb7185]";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400";
  }
};

const formatActionType = (actionType: string) => {
  return actionType.replace(/_/g, " ");
};

export default function ActivityLog({ stream }: ActivityLogProps) {
  const [selectedGameId, setSelectedGameId] = useState<string>("ALL");
  const liveStreamCount = stream?.length ?? 0;

  const filteredLogs =
    selectedGameId === "ALL"
      ? mockActivityLogs
      : mockActivityLogs.filter((log) => log.game_id === selectedGameId);

  return (
    <div className="min-h-screen flex flex-col bg-[#fcf8f9] dark:bg-[#0b0f19] transition-colors duration-300 font-sans">
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 border-b border-[#fbcfe8] dark:border-slate-800 pb-6">
          <h1 className="text-3xl font-bold tracking-tight text-[#3f313a] dark:text-white">
            Activity Log
          </h1>

          {liveStreamCount > 0 && (
            <span className="text-xs font-medium text-slate-600 bg-slate-100 border border-slate-200 dark:text-slate-300 dark:bg-slate-800 dark:border-slate-700 px-3 py-1.5 rounded-full">
              Live packets: {liveStreamCount}
            </span>
          )}

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select
              value={selectedGameId}
              onChange={(e) => setSelectedGameId(e.target.value)}
              className="flex h-10 w-full sm:w-55 items-center justify-between rounded-lg border border-[#fbcfe8] bg-white px-3 py-2 text-sm text-[#475569] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ec4899] dark:border-slate-700 dark:bg-[#1e293b] dark:text-slate-200"
            >
              <option value="ALL">All Game Sessions</option>
              {gameSessions.map((game) => (
                <option key={game.game_id} value={game.game_id}>
                  {game.game_id}{" "}
                  {game.status === "END" ? "(Ended)" : "(Playing)"}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-slate-500 bg-white dark:bg-[#161f30] rounded-xl border border-[#f3e8ff] dark:border-slate-800 shadow-sm">
            No activities found.
          </div>
        ) : (
          /* List Layout แนวตั้งเต็มจอ */
          <div className="flex flex-col gap-6 pb-12">
            {filteredLogs.map((log) => (
              <div
                key={log.log_id}
                className="w-full bg-white dark:bg-[#161f30] border border-[#f3e8ff] dark:border-slate-800 rounded-xl shadow-[0_4px_20px_-4px_rgba(236,72,153,0.05)] dark:shadow-none overflow-hidden flex flex-col relative transition-all duration-200 hover:shadow-[0_8px_30px_-4px_rgba(236,72,153,0.1)]"
              >
                <div
                  className={`h-1.5 w-full ${getPlayerAccent(log.actor_id)}`}
                ></div>

                <div className="p-5 flex flex-col gap-4">
                  {/* Top Header ของ Card */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="bg-[#f1f5f9] text-[#475569] dark:bg-slate-800 dark:text-slate-200 font-bold px-3 py-1.5 rounded-full text-xs">
                        {log.actor_id === "SYSTEM"
                          ? "⚙️ SYSTEM"
                          : `👤 ${log.actor_id.replace("_", " ").toUpperCase()}`}
                      </span>

                      {selectedGameId === "ALL" && (
                        <span className="text-[10px] sm:text-xs font-semibold text-[#64748b] bg-[#f8f5ff] dark:bg-slate-800/80 px-2 py-1 rounded-md border border-[#f3e8ff] dark:border-slate-700">
                          🎮 {log.game_id}
                        </span>
                      )}

                      <span className="text-[10px] sm:text-xs font-semibold text-[#64748b] dark:text-slate-400 uppercase tracking-wider bg-slate-50 dark:bg-slate-800/50 px-2 py-1 rounded-md border border-slate-100 dark:border-transparent">
                        Turn {log.turn_number}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-[#64748b] dark:text-slate-500 font-medium">
                        ⏱️ {new Date(log.timestamp).toLocaleTimeString("th-TH")}
                      </span>
                      <span
                        className={`text-[10px] sm:text-xs font-bold px-2.5 py-1.5 rounded-md border flex items-center gap-1.5 uppercase ${getStatusBadge(log.status)}`}
                      >
                        {log.status === "SUCCESS" && (
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2.5"
                              d="M5 13l4 4L19 7"
                            ></path>
                          </svg>
                        )}
                        {log.status === "REJECTED" && (
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2.5"
                              d="M6 18L18 6M6 6l12 12"
                            ></path>
                          </svg>
                        )}
                        {log.status === "ERROR" && (
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2.5"
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            ></path>
                          </svg>
                        )}
                        {log.status}
                      </span>
                    </div>
                  </div>

                  {/* 3 คอลัมน์ข้อมูลในแนวนอน */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-3 border-y border-[#fce7f3] dark:border-slate-800">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-[#94a3b8] dark:text-slate-500 uppercase tracking-wide">
                        Action
                      </span>
                      <span className="text-sm font-medium text-[#475569] dark:text-slate-200 flex items-center gap-1.5 mt-1">
                        ⚡ {formatActionType(log.action_type)}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-[#94a3b8] dark:text-slate-500 uppercase tracking-wide">
                        Location / Target
                      </span>
                      <span className="text-sm font-medium text-[#475569] dark:text-slate-200 flex items-center gap-1.5 mt-1">
                        📍{" "}
                        {log.details.landmark_name ||
                          log.details.to_space_id
                            ?.replace("_", " ")
                            .toUpperCase() ||
                          "N/A"}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-[#94a3b8] dark:text-slate-500 uppercase tracking-wide">
                        Effect
                      </span>
                      <span className="text-sm font-medium text-[#475569] dark:text-slate-200 flex items-center gap-1.5 mt-1">
                        {log.details.score_change ? (
                          <span className="text-[#10b981] dark:text-emerald-400">
                            🎯 +{log.details.score_change} Score
                          </span>
                        ) : log.details.audio_played ? (
                          "🔊 Audio Triggered"
                        ) : (
                          "➖ None"
                        )}
                      </span>
                    </div>
                  </div>

                  {/* กล่อง Detail สีชมพูอ่อน */}
                  <div className="bg-[#fff0f6] dark:bg-[#371e2e]/50 rounded-lg p-4 text-sm text-[#9d174d] dark:text-slate-300 border border-[#fce7f3] dark:border-slate-800/80 leading-relaxed">
                    <span className="font-bold text-[#831843] dark:text-white mr-2">
                      Detail:
                    </span>
                    {log.details.display_message}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
