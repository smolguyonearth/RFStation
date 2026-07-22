import { useNavigate } from "react-router-dom";
import { Play, BookOpen } from "lucide-react";

export default function Display(): React.JSX.Element {
  const navigate = useNavigate();

  return (
    <div className="h-auto bg-brand-bg py-6 px-4 sm:px-6">
      <div className="max-w-6xl w-full mx-auto min-h-screen">
        <div className="bg-white rounded-3xl shadow-sm border border-brand-border/60 p-6 md:p-8 min-h-[80vh] flex flex-col">
          <div className="border-b border-gray-100 pb-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Display Dashboard</h1>
            <p className="text-gray-500 mt-1">
              Select your preferred mode to get started
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
            <button
              onClick={() => navigate("/play")}
              className="group flex flex-col gap-4 p-8 bg-gray-50 border border-gray-200 rounded-3xl hover:bg-blue-50 hover:border-blue-200 transition-all duration-300 text-left"
            >
              <div className="p-4 bg-white w-fit rounded-2xl text-blue-600 shadow-sm group-hover:shadow-md transition-all">
                <Play size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Gameplay Mode
                </h3>
                <p className="text-gray-500 mt-2">
                  Engage with the live simulation and start your journey now.
                </p>
              </div>
            </button>

            <button
              onClick={() => navigate("/museum")}
              className="group flex flex-col gap-4 p-8 bg-gray-50 border border-gray-200 rounded-3xl hover:bg-purple-50 hover:border-purple-200 transition-all duration-300 text-left"
            >
              <div className="p-4 bg-white w-fit rounded-2xl text-purple-600 shadow-sm group-hover:shadow-md transition-all">
                <BookOpen size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Museum Mode</h3>
                <p className="text-gray-500 mt-2">
                  Explore historical records, archives, and past data insights.
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
