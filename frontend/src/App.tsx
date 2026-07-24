import { BrowserRouter, Routes, Route } from "react-router-dom"

import Home from "@/pages/Home"
import Map from "@/pages/Map"
import Game from "@/pages/Game"
import Display from "@/pages/Display"
import Controller from "@/pages/Controller"

// import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

export default function Root() {
  return (
    <BrowserRouter>
      <div className="h-screen w-screen max-h-screen overflow-hidden bg-[#FAF9F6] text-[#333C4E] font-sans flex flex-col items-stretch select-none">

        {/* Main Dashboard Frame (Full screen) */}
        <div className="h-full w-full bg-[#FAF9F6] flex flex-col lg:flex-row overflow-hidden relative">

          {/* <Navbar /> */}

          <div className="flex-grow flex flex-col min-w-0 h-full bg-[#FAF9F6] overflow-y-auto">
            <main className="flex-grow w-full min-h-0">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/map" element={<Map />} />
                <Route path="/game" element={<Game />} />
                <Route path="/display" element={<Display />} />
                <Route path="/control" element={<Controller />} />
                <Route path="/controller" element={<Controller />} />
                <Route path="/controll" element={<Controller />} />
              </Routes>
            </main>

            <Footer />
          </div>

        </div>
      </div>
    </BrowserRouter>
  );
}
