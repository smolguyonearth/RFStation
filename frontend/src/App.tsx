import { BrowserRouter, Routes, Route } from "react-router-dom"

import Home from "@/pages/Home"
import Map from "@/pages/Map"
import Monitor from "@/pages/Monitor"
import Live from "@/pages/Live"
import Control from "@/pages/Control"
import Display from "@/pages/Display"


import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import PlayMode from "@/components/Game/Play/PlayMode";
import MuseumMode from "@/components/Game/Museum/MuseumMode";
import Game from "@/components/Game/Game";

export default function Root() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">

        <Navbar />

        <main className="w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/map" element={<Map />} />
            <Route path="/monitor" element={<Monitor />} />
            <Route path="/live" element={<Live />} />
            <Route path="/play" element={<PlayMode />} />
            <Route path="/museum" element={<MuseumMode />} />
            <Route path="/game" element={<Game />} />
            <Route path="/control" element={<Control />} />
            <Route path="/display" element={<Display />} />
          </Routes>
        </main>

        <Footer />
        
      </div>
    </BrowserRouter>
  );
}
