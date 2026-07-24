import { BrowserRouter, Routes, Route } from "react-router-dom"

import Home from "@/pages/Home"
import Map from "@/pages/Map"
import Game from "@/pages/Game"
import Display from "@/pages/Display"
import Controller from "@/pages/Controller"

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
            <Route path="/game" element={<Game />} />
            <Route path="/display" element={<Display />} />
            <Route path="/control" element={<Controller />} />
            <Route path="/controller" element={<Controller />} />
            <Route path="/controll" element={<Controller />} />
          </Routes>
        </main>

        <Footer />

      </div>
    </BrowserRouter>
  );
}
