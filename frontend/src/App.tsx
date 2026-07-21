import { BrowserRouter, Routes, Route } from "react-router-dom"

import Home from "@/pages/Home"
import Map from "@/pages/Map"
import Monitor from "@/pages/Monitor"
// [DB DISABLED] Live page removed — it depended on Supabase Realtime. See docs/DB_ACTIVATE.md
// import Live from "@/pages/Live"
import Game from "@/pages/Game"

import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

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
            {/* [DB DISABLED] <Route path="/live" element={<Live />} /> */}
            <Route path="/game" element={<Game />} />
          </Routes>
        </main>

        <Footer />
        
      </div>
    </BrowserRouter>
  );
}
